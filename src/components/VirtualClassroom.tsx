'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { generateContent, DEFAULT_AI_MODEL, TTS_MODEL } from '@/lib/gemini';
import {
  Send,
  Volume2,
  Users,
  ShieldAlert,
  Loader2,
  UserPlus,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  Copy,
  Check,
  Gamepad2,
  ExternalLink,
  Settings,
  Presentation,
  MessageSquare,
  Hand,
  Sparkles,
  Eraser,
  Pencil,
  Maximize2,
  Image as ImageIcon,
  CircleDot,
} from 'lucide-react';
import { Modality } from '@google/genai';
import { NeuroQuestAssignment, getNeuroQuestGame, loadActiveAssignment } from '@/lib/neuroquest';
import { ActiveLessonPanel, type ShareableLesson } from './ActiveLessonPanel';
import type { DemoAssignment } from '@/lib/demoAssignments';
import type { TabType } from './Sidebar';
import { recordClassParticipationEvent } from '@/lib/learningHub/internalEvents';
import { getDemoUserId } from '@/lib/firebase/demoUser';

interface Message {
  id: string;
  sender: string;
  text: string;
  isTeacher: boolean;
  timestamp: Date;
}

const FAKE_STUDENTS = Array.from({ length: 29 }, (_, i) => ({
  id: i,
  name: `Student ${i + 1}`,
  avatarColor: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
}));

export function VirtualClassroom({
  setActiveTab,
  mode = 'teacher',
}: {
  setActiveTab?: (tab: TabType) => void;
  /** Drives which controls are visible — students only see mute / cam / chat / leave. */
  mode?: 'teacher' | 'student';
} = {}) {
  const isTeacher = mode === 'teacher';
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'System', text: 'Class has started.', isTeacher: false, timestamp: new Date() },
    { id: '2', sender: 'Alice', text: 'Hi Mr. Smith! I have a question about the homework.', isTeacher: false, timestamp: new Date() },
    { id: '3', sender: 'Bob', text: 'Yeah, question 3 was really hard.', isTeacher: false, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [behaviorReport, setBehaviorReport] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waitingRoom, setWaitingRoom] = useState(['Charlie', 'Diana']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Video Call State
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copiedClassLink, setCopiedClassLink] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<NeuroQuestAssignment | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Stage / layout state for the premium classroom shell
  type StageView = 'lesson' | 'screen' | 'spotlight' | 'whiteboard' | 'slide';
  const [stageView, setStageView] = useState<StageView>('lesson');
  type RightTab = 'chat' | 'people' | 'tools';
  const [rightTab, setRightTab] = useState<RightTab>('chat');
  const [classStartedAt, setClassStartedAt] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [raisedHands, setRaisedHands] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState<{ dataUrl: string; title: string } | null>(null);
  const slideInputRef = useRef<HTMLInputElement>(null);
  const whiteboardCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [whiteboardColor, setWhiteboardColor] = useState('#ffc43b');

  const postSystemMessage = (sender: string, text: string, isTeacher = true) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, sender, text, isTeacher, timestamp: new Date() },
    ]);
  };

  const handleShareLesson = (lesson: ShareableLesson) => {
    postSystemMessage(
      'Mr Smith (live)',
      `📘 We're starting "${lesson.title}" (${lesson.lessonTitle}). Today's inquiry: ${lesson.inquiryQuestion}`,
    );
    // Record the live-class share as a LearningEvent for every demo student
    // so the Learning Hub reflects participation across the cohort.
    void recordClassParticipationEvent({
      studentId: getDemoUserId('student'),
      studentName: 'Demo Student',
      classId: 'class-grade8a',
      activityTitle: `Live class · ${lesson.title}`,
    });
  };

  const handleShareAssignment = (lesson: ShareableLesson) => {
    postSystemMessage(
      'Mr Smith (live)',
      `📝 Assignment for today: ${lesson.question} — try this in your notebook and submit on your dashboard.`,
    );
  };

  const handleAskAi = async (lesson: ShareableLesson) => {
    if (isAskingAi) return;
    setIsAskingAi(true);
    try {
      const subjectName = lesson.subject === 'english' ? 'English' : lesson.subject === 'science' ? 'science' : 'maths';
      const prompt = `You are explaining a step in a live Grade 8 ${subjectName} class. In 2-3 short sentences, explain how to approach this question for a student who is stuck. Be encouraging and concrete. Do not give the final answer away — leave the thinking for the student.\n\nQuestion: ${lesson.question}\nInquiry frame: ${lesson.inquiryQuestion}`;
      const response = await generateContent({
        model: DEFAULT_AI_MODEL,
        contents: prompt,
      });
      const text = response.text?.trim();
      if (text) {
        postSystemMessage('AI Tutor', `🤖 ${text}`);
      } else {
        postSystemMessage('AI Tutor', '🤖 I could not generate an explanation just now — try again in a moment.');
      }
    } catch (err) {
      postSystemMessage(
        'AI Tutor',
        `🤖 Sorry — AI explanation failed (${err instanceof Error ? err.message : 'unknown error'}).`,
      );
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleOpenLessonPlayer = () => {
    setActiveTab?.('lesson');
  };
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoActive]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  useEffect(() => {
    if (previewVideoRef.current && previewStream) {
      previewVideoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    setActiveAssignment(loadActiveAssignment());
    refreshDevices();
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream, screenStream, previewStream]);

  const refreshDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const foundDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(foundDevices);
      const firstCamera = foundDevices.find(device => device.kind === 'videoinput');
      const firstMic = foundDevices.find(device => device.kind === 'audioinput');
      setSelectedVideoDevice(current => current || firstCamera?.deviceId || '');
      setSelectedAudioDevice(current => current || firstMic?.deviceId || '');
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  };

  const startVideoCall = async () => {
    try {
      setCameraError('');
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
        setPreviewStream(null);
        setIsPreviewing(false);
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
      });
      setLocalStream(stream);
      setIsVideoActive(true);
      setIsMuted(false);
      setIsVideoOff(false);
      await refreshDevices();
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setCameraError("Could not access camera and microphone. Please check browser permissions, device availability, and HTTPS/localhost access.");
    }
  };

  const startCameraTest = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
      });
      setPreviewStream(stream);
      setIsPreviewing(true);
      await refreshDevices();
    } catch (err) {
      console.error('Error testing camera:', err);
      setCameraError('Camera test failed. Please allow camera and microphone permissions for this localhost page and confirm the device is not used by another app.');
    }
  };

  const stopCameraTest = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
      setPreviewStream(null);
    }
    setIsPreviewing(false);
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsVideoActive(false);
  };

  const restartVideoWithDevices = async () => {
    if (!isVideoActive) return;
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    await startVideoCall();
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(stream);
      setIsScreenSharing(true);
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      });
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    setScreenStream(null);
    setIsScreenSharing(false);
  };

  const copyClassLink = async () => {
    const link = typeof window === 'undefined' ? 'http://127.0.0.1:3000' : window.location.origin;
    await navigator.clipboard.writeText(link);
    setCopiedClassLink(true);
    setTimeout(() => setCopiedClassLink(false), 1600);
  };

  const shareQuestToClass = () => {
    if (!activeAssignment) return;
    const game = getNeuroQuestGame(activeAssignment.gameSlug);
    const launchLink = typeof window === 'undefined' ? game.href : `${window.location.origin}${game.href}`;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'Teacher',
      text: `NeuroQuest activity: ${activeAssignment.title}\nGame: ${game.title}\nObjective: ${activeAssignment.objective}\nLaunch: ${launchLink}`,
      isTeacher: true,
      timestamp: new Date()
    }]);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Teacher',
      text: input,
      isTeacher: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const admitStudent = (name: string) => {
    setWaitingRoom(prev => prev.filter(s => s !== name));
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'System',
      text: `${name} joined the class.`,
      isTeacher: false,
      timestamp: new Date()
    }]);
  };

  const answerWithAI = async (questionText: string) => {
    setIsAnswering(true);
    setAudioUrl(null);
    try {
      // 1. Generate the text answer
      const textResponse = await generateContent({
        model: DEFAULT_AI_MODEL,
        contents: `You are a teacher answering a student's question in a virtual class. Keep it concise and encouraging. The question is: "${questionText}"`,
      });

      const answerText = textResponse.text || 'I am not sure how to answer that right now.';

      // Add text message to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'AI Assistant (Teacher Voice)',
        text: answerText,
        isTeacher: true,
        timestamp: new Date()
      }]);

      // 2. Generate TTS audio
      const ttsResponse = await generateContent({
        model: TTS_MODEL,
        contents: [{ parts: [{ text: answerText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }, // Simulating teacher's voice
            },
          },
        },
      });

      const candidates = ttsResponse.candidates as Array<{ content?: { parts?: Array<{ inlineData?: { data?: string } }> } }> | null;
      const base64Audio = candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        
        // Play raw PCM audio using AudioContext
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = audioContext.createBuffer(1, bytes.length / 2, 24000);
        const channelData = audioBuffer.getChannelData(0);
        
        // Convert 16-bit PCM to float32
        const dataView = new DataView(bytes.buffer);
        for (let i = 0; i < bytes.length / 2; i++) {
          channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        console.log("Playing audio");
      }

    } catch (error) {
      console.error("Error generating AI answer:", error);
    } finally {
      setIsAnswering(false);
    }
  };

  const analyzeBehavior = async () => {
    setIsAnalyzing(true);
    try {
      const chatHistory = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const response = await generateContent({
        model: DEFAULT_AI_MODEL,
        contents: `Analyze the following virtual classroom chat history. Rate the students' behavior, engagement, and identify any potential issues or students who might need help.\n\nChat History:\n${chatHistory}`,
      });
      setBehaviorReport(response.text || 'No analysis available.');
    } catch (error) {
      console.error("Error analyzing behavior:", error);
      setBehaviorReport('Failed to analyze behavior.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Premium classroom shell helpers ───────────────────────────────────
  // Tick the class timer once per second while video is active.
  useEffect(() => {
    if (!isVideoActive) {
      setClassStartedAt(null);
      setElapsedSec(0);
      return;
    }
    if (!classStartedAt) setClassStartedAt(Date.now());
    const id = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isVideoActive, classStartedAt]);

  // Auto-switch the stage when the teacher starts screen-sharing.
  useEffect(() => {
    if (isScreenSharing) setStageView('screen');
    else if (stageView === 'screen') setStageView('lesson');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreenSharing]);

  const formatElapsed = useCallback((s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  }, []);

  const onSlideFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setCurrentSlide({ dataUrl, title: file.name });
      setStageView('slide');
      postSystemMessage('Mr Smith (live)', `🖼️ Shared slide: ${file.name}`);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // Whiteboard drawing — local-only sketch surface for live teaching.
  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = whiteboardColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const endDraw = () => {
    isDrawingRef.current = false;
  };
  const clearWhiteboard = () => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  // A few random hands going up while the class is "live" to simulate
  // a real cohort — purely cosmetic for the demo.
  useEffect(() => {
    if (!isVideoActive) return;
    const interval = window.setInterval(() => {
      setRaisedHands((prev) => {
        if (Math.random() > 0.7 && prev.length < 5) {
          const candidate = Math.floor(Math.random() * FAKE_STUDENTS.length);
          return prev.includes(candidate) ? prev : [...prev, candidate];
        }
        if (prev.length > 0 && Math.random() > 0.6) {
          return prev.slice(1);
        }
        return prev;
      });
    }, 4500);
    return () => window.clearInterval(interval);
  }, [isVideoActive]);

  const stageTabs: { id: StageView; label: string; icon: typeof Presentation; available: boolean }[] = useMemo(
    () => {
      const base = [
        { id: 'lesson' as StageView,     label: 'Lesson',     icon: Presentation, available: true },
        { id: 'slide' as StageView,      label: 'Slide',      icon: ImageIcon,    available: Boolean(currentSlide) },
        { id: 'screen' as StageView,     label: 'Screen',     icon: ScreenShare,  available: isScreenSharing },
        { id: 'spotlight' as StageView,  label: 'Spotlight',  icon: Maximize2,    available: true },
      ];
      // Whiteboard is a teacher-only stage — students just watch via Spotlight.
      if (isTeacher) {
        base.splice(3, 0, { id: 'whiteboard' as StageView, label: 'Whiteboard', icon: Pencil, available: true });
      }
      return base;
    },
    [currentSlide, isScreenSharing, isTeacher],
  );

  // Chat and Sidebar UI (reused in both layouts)
  const ChatSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Users className="w-5 h-5" />
          Class Chat
        </div>
        {isAnswering && (
          <div className="flex items-center gap-2 text-sm text-indigo-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI is generating response...
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isTeacher ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500 mb-1">{msg.sender}</span>
            <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
              msg.sender === 'System' ? 'bg-gray-100 text-gray-600 text-sm w-full text-center rounded-lg' :
              msg.isTeacher ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.text}
            </div>
            {!msg.isTeacher && msg.sender !== 'System' && (
              <button 
                onClick={() => answerWithAI(msg.text)}
                className="text-xs text-indigo-600 mt-1 flex items-center gap-1 hover:underline"
              >
                <Volume2 className="w-3 h-3" /> Answer with AI Voice
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 shrink-0">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message to the class..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button 
            onClick={handleSend}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const SidebarSection = () => (
    <div className="space-y-6 flex flex-col h-full">
      {/* Waiting Room */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shrink-0">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-500" />
          Waiting Room ({waitingRoom.length})
        </h3>
        {waitingRoom.length === 0 ? (
          <p className="text-sm text-gray-500">No students waiting.</p>
        ) : (
          <ul className="space-y-2">
            {waitingRoom.map((student, idx) => (
              <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                <span className="text-sm font-medium">{student}</span>
                <button 
                  onClick={() => admitStudent(student)}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  Admit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Behavior Monitor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col flex-1 min-h-[250px]">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            Behavior Monitor
          </h3>
          <button 
            onClick={analyzeBehavior}
            disabled={isAnalyzing}
            className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 disabled:opacity-50 flex items-center gap-1"
          >
            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Analyze Now'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
          {behaviorReport || 'Click "Analyze Now" to get an AI assessment of the current chat behavior and engagement.'}
        </div>
      </div>

      {/* Active NeuroQuest */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shrink-0">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-indigo-500" />
          Active NeuroQuest
        </h3>
        {activeAssignment ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{activeAssignment.title}</p>
              <p className="text-xs text-gray-500">{getNeuroQuestGame(activeAssignment.gameSlug).title} · {activeAssignment.duration}</p>
            </div>
            <button
              onClick={shareQuestToClass}
              className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Share Quest in Chat
            </button>
            <a
              href={getNeuroQuestGame(activeAssignment.gameSlug).href}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Open Game <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Save a quest from NeuroQuest Academy to share it during class.</p>
        )}
      </div>
    </div>
  );

  // ── Premium classroom shell rendering ─────────────────────────────────
  if (isVideoActive) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#0a0d14] text-white">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#070a12] px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-400 sm:px-2 sm:py-1 sm:text-[10px]">
              <CircleDot className="h-2.5 w-2.5 animate-pulse fill-red-500 text-red-500 sm:h-3 sm:w-3" />
              Live
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white sm:text-sm">EIS Grade 8</p>
              <p className="truncate text-[10px] text-slate-400 sm:text-[11px]">
                {FAKE_STUDENTS.length + 1} · ✋{raisedHands.length}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-200 sm:inline-block">
              {formatElapsed(elapsedSec)}
            </span>
            {isTeacher && (
              <button
                onClick={copyClassLink}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10"
                title="Copy class link"
              >
                {copiedClassLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copiedClassLink ? 'Copied' : 'Invite'}</span>
              </button>
            )}
            <button
              onClick={endVideoCall}
              className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-red-500"
              title={isTeacher ? 'End class for everyone' : 'Leave class'}
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isTeacher ? 'End' : 'Leave'}</span>
            </button>
          </div>
        </header>

        {cameraError && (
          <div className="mx-4 mt-3 shrink-0 rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-xs text-red-200">
            {cameraError}
          </div>
        )}

        {/* Main split: Stage + Filmstrip on the left, Right Rail on the right */}
        <div className="flex flex-1 min-h-0 flex-col xl:flex-row">
          {/* LEFT — Stage + filmstrip */}
          <div className="flex flex-1 flex-col min-h-0 border-white/10 xl:border-r">
            {/* Stage tabs */}
            <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-white/10 bg-[#070a12] px-3 py-2 [scrollbar-width:thin]">
              {stageTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = stageView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => tab.available && setStageView(tab.id)}
                    disabled={!tab.available}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#49c8ff] text-[#061126] shadow-[0_0_16px_rgba(73,200,255,.4)]'
                        : tab.available
                          ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                          : 'cursor-not-allowed text-slate-600'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
              <span className="ml-auto hidden shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:inline-flex">
                <Sparkles className="h-3 w-3" /> Stage
              </span>
            </div>

            {/* Stage content */}
            <div className="relative flex-1 overflow-hidden bg-[#0a0d14]">
              {stageView === 'lesson' && (
                <div className="absolute inset-0 overflow-y-auto p-5">
                  <div className="mx-auto max-w-4xl">
                    <ActiveLessonPanel
                      onShareLesson={handleShareLesson}
                      onShareAssignment={handleShareAssignment}
                      onAskAi={handleAskAi}
                      onOpenLessonPlayer={setActiveTab ? handleOpenLessonPlayer : undefined}
                      isAskingAi={isAskingAi}
                    />
                  </div>
                </div>
              )}

              {stageView === 'slide' && currentSlide && (
                <div className="absolute inset-0 grid place-items-center bg-black p-4">
                  <img
                    src={currentSlide.dataUrl}
                    alt={currentSlide.title}
                    className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                  />
                  <p className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                    {currentSlide.title}
                  </p>
                </div>
              )}

              {stageView === 'screen' && (
                <div className="absolute inset-0 grid place-items-center bg-black">
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-contain"
                  />
                  {!isScreenSharing && (
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <div>
                        <ScreenShare className="mx-auto h-10 w-10 text-slate-500" />
                        <p className="mt-2 text-sm font-semibold text-slate-300">Screen share inactive</p>
                        <button
                          onClick={startScreenShare}
                          className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-3 py-2 text-xs font-bold text-[#061126] transition hover:bg-[#8ddfff]"
                        >
                          <ScreenShare className="h-4 w-4" /> Share screen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {stageView === 'whiteboard' && (
                <div className="absolute inset-0 flex flex-col bg-white">
                  <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Whiteboard</span>
                    <div className="flex items-center gap-1">
                      {['#ffc43b', '#49c8ff', '#22c55e', '#ef4444', '#0f172a'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setWhiteboardColor(c)}
                          className={`h-5 w-5 rounded-full border-2 transition ${whiteboardColor === c ? 'border-slate-900 scale-110' : 'border-white'}`}
                          style={{ background: c }}
                          aria-label={`Pen ${c}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={clearWhiteboard}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Eraser className="h-3.5 w-3.5" /> Clear
                    </button>
                  </div>
                  <canvas
                    ref={whiteboardCanvasRef}
                    width={1600}
                    height={900}
                    className="h-full w-full cursor-crosshair touch-none"
                    onPointerDown={startDraw}
                    onPointerMove={draw}
                    onPointerUp={endDraw}
                    onPointerLeave={endDraw}
                  />
                </div>
              )}

              {stageView === 'spotlight' && (
                <div className="absolute inset-0 grid place-items-center bg-black">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-full w-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                  />
                  {isVideoOff && (
                    <div className="grid h-32 w-32 place-items-center rounded-full bg-indigo-600 text-5xl font-black text-white">T</div>
                  )}
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                    Teacher · Spotlight
                  </span>
                </div>
              )}
            </div>

            {/* Filmstrip — teacher + students */}
            <div className="shrink-0 border-t border-white/10 bg-[#070a12] px-3 py-2">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <FilmstripTile label="You" muted={isMuted}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-full w-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                  />
                  {isVideoOff && (
                    <div className="grid h-full w-full place-items-center bg-indigo-600 text-lg font-bold">T</div>
                  )}
                </FilmstripTile>
                {FAKE_STUDENTS.slice(0, 10).map((student) => (
                  <FilmstripTile
                    key={student.id}
                    label={student.name.replace('Student ', 'S')}
                    handRaised={raisedHands.includes(student.id)}
                  >
                    <div className="grid h-full w-full place-items-center" style={{ backgroundColor: student.avatarColor }}>
                      <span className="text-lg font-bold text-slate-800/60">{student.name.charAt(0)}</span>
                    </div>
                  </FilmstripTile>
                ))}
                <button
                  onClick={() => setRightTab('people')}
                  className="grid h-12 w-20 shrink-0 place-items-center rounded-md border border-dashed border-white/20 text-[10px] font-semibold text-slate-400 hover:border-white/40 hover:text-white sm:h-16 sm:w-24"
                >
                  +{FAKE_STUDENTS.length - 10}
                </button>
              </div>
            </div>

            {/* Bottom control bar */}
            <div className="flex shrink-0 items-center justify-between gap-2 overflow-x-auto border-t border-white/10 bg-[#050811] px-2 py-2 sm:px-4 sm:py-2.5 [scrollbar-width:thin]">
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <ControlButton
                  active={!isMuted}
                  danger={isMuted}
                  onClick={toggleMute}
                  icon={isMuted ? MicOff : Mic}
                  label={isMuted ? 'Unmute' : 'Mute'}
                />
                <ControlButton
                  active={!isVideoOff}
                  danger={isVideoOff}
                  onClick={toggleVideo}
                  icon={isVideoOff ? VideoOff : Video}
                  label={isVideoOff ? 'Start video' : 'Stop video'}
                />
                {isTeacher && (
                  <>
                    <ControlButton
                      active={isScreenSharing}
                      onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                      icon={ScreenShare}
                      label={isScreenSharing ? 'Stop share' : 'Share screen'}
                    />
                    <ControlButton
                      onClick={() => slideInputRef.current?.click()}
                      icon={ImageIcon}
                      label="Share slide"
                    />
                    <ControlButton
                      onClick={() => setStageView('whiteboard')}
                      icon={Pencil}
                      label="Whiteboard"
                    />
                    <input
                      ref={slideInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onSlideFileChosen}
                      className="hidden"
                    />
                  </>
                )}
                {!isTeacher && (
                  <ControlButton
                    onClick={() => {
                      setRaisedHands((prev) => prev.includes(-1) ? prev.filter((p) => p !== -1) : [...prev, -1]);
                    }}
                    active={raisedHands.includes(-1)}
                    icon={Hand}
                    label={raisedHands.includes(-1) ? 'Lower hand' : 'Raise hand'}
                  />
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <ControlButton
                  onClick={() => setRightTab('chat')}
                  icon={MessageSquare}
                  label="Chat"
                />
                <ControlButton
                  onClick={() => setRightTab('people')}
                  icon={Users}
                  label="People"
                />
                {isTeacher && (
                  <ControlButton
                    onClick={() => setRightTab('tools')}
                    icon={Hand}
                    label="Tools"
                  />
                )}
                <button
                  onClick={endVideoCall}
                  className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500"
                >
                  <PhoneOff className="h-3.5 w-3.5" /> Leave
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT RAIL — fixed share of viewport on mobile, fixed width on desktop */}
          <aside className="flex h-[40vh] w-full shrink-0 flex-col border-t border-white/10 bg-[#070a12] xl:h-auto xl:w-[360px] xl:border-t-0">
            {/* Right rail tabs — AI tools tab is teacher-only. */}
            <div className="flex shrink-0 border-b border-white/10">
              {(
                ([
                  { id: 'chat', label: 'Chat', icon: MessageSquare, badge: messages.length },
                  { id: 'people', label: 'People', icon: Users, badge: FAKE_STUDENTS.length + 1 },
                  ...(isTeacher ? [{ id: 'tools', label: 'AI', icon: Sparkles, badge: 0 }] : []),
                ] as { id: RightTab; label: string; icon: typeof MessageSquare; badge: number }[])
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = rightTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-semibold transition ${
                      isActive ? 'border-b-2 border-[#49c8ff] bg-white/5 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className="ml-0.5 rounded-full bg-white/10 px-1.5 text-[9px] font-black text-slate-300">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-hidden">
              {rightTab === 'chat' && (
                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isTeacher ? 'items-end' : 'items-start'}`}
                      >
                        <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {msg.sender}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-5 ${
                            msg.sender === 'System'
                              ? 'w-full bg-white/5 text-center text-xs text-slate-400'
                              : msg.isTeacher
                                ? 'bg-[#49c8ff] text-[#061126]'
                                : 'bg-white/10 text-slate-100'
                          }`}
                        >
                          {msg.text}
                        </div>
                        {isTeacher && !msg.isTeacher && msg.sender !== 'System' && (
                          <button
                            onClick={() => answerWithAI(msg.text)}
                            className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#8ddfff] hover:underline"
                          >
                            <Volume2 className="h-3 w-3" /> Answer with AI voice
                          </button>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="shrink-0 border-t border-white/10 p-2">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Message the class…"
                        className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#49c8ff]"
                      />
                      <button
                        onClick={handleSend}
                        className="shrink-0 rounded-md bg-[#49c8ff] p-2 text-[#061126] transition hover:bg-[#8ddfff]"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    {isAnswering && (
                      <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#8ddfff]">
                        <Loader2 className="h-3 w-3 animate-spin" /> AI generating response…
                      </p>
                    )}
                  </div>
                </div>
              )}

              {rightTab === 'people' && (
                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {isTeacher && waitingRoom.length > 0 && (
                      <div>
                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
                          Waiting room ({waitingRoom.length})
                        </p>
                        <div className="space-y-1.5">
                          {waitingRoom.map((s) => (
                            <div
                              key={s}
                              className="flex items-center justify-between rounded-md border border-amber-400/20 bg-amber-400/5 px-2.5 py-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <UserPlus className="h-3.5 w-3.5 text-amber-300" />
                                <span className="text-sm font-medium text-white">{s}</span>
                              </div>
                              <button
                                onClick={() => admitStudent(s)}
                                className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black text-amber-950 hover:bg-amber-300"
                              >
                                Admit
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        In class ({FAKE_STUDENTS.length + 1})
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 rounded-md bg-[#49c8ff]/10 px-2.5 py-1.5">
                          <div className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                            T
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">Teacher (You)</p>
                            <p className="text-[10px] text-slate-400">Host · presenter</p>
                          </div>
                          {isMuted && <MicOff className="h-3.5 w-3.5 text-red-400" />}
                        </div>
                        {FAKE_STUDENTS.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-white/5"
                          >
                            <div
                              className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-slate-800"
                              style={{ background: s.avatarColor }}
                            >
                              {s.name.charAt(8)}
                            </div>
                            <p className="min-w-0 flex-1 truncate text-sm text-slate-200">{s.name}</p>
                            {raisedHands.includes(s.id) && <Hand className="h-3.5 w-3.5 text-amber-400" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rightTab === 'tools' && (
                <div className="h-full overflow-y-auto p-3 space-y-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                        <ShieldAlert className="h-4 w-4 text-orange-400" /> Behavior monitor
                      </p>
                      <button
                        onClick={analyzeBehavior}
                        disabled={isAnalyzing}
                        className="inline-flex items-center gap-1 rounded-md bg-orange-500/15 px-2 py-1 text-[10px] font-bold text-orange-300 hover:bg-orange-500/25 disabled:opacity-50"
                      >
                        {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Analyze'}
                      </button>
                    </div>
                    <p className="mt-2 max-h-32 overflow-y-auto rounded bg-black/30 p-2 text-[11px] leading-5 text-slate-300 whitespace-pre-wrap">
                      {behaviorReport || 'Click "Analyze" to get an AI assessment of chat behavior and engagement.'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                      <Gamepad2 className="h-4 w-4 text-indigo-300" /> Active NeuroQuest
                    </p>
                    {activeAssignment ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs font-semibold text-slate-200">{activeAssignment.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {getNeuroQuestGame(activeAssignment.gameSlug).title} · {activeAssignment.duration}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={shareQuestToClass}
                            className="rounded-md bg-indigo-500 px-2 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-400"
                          >
                            Share in chat
                          </button>
                          <a
                            href={getNeuroQuestGame(activeAssignment.gameSlug).href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/5"
                          >
                            Open <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-slate-400">Save a quest from NeuroQuest Academy to share it.</p>
                    )}
                  </div>

                  {audioUrl && (
                    <audio controls src={audioUrl} className="w-full" />
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ── PRE-CLASS LOBBY ────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Virtual Classroom</h2>
          <p className="text-sm text-gray-600">Premium online teaching shell — stage, filmstrip, whiteboard, AI tools.</p>
        </div>
        <button
          onClick={copyClassLink}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          {copiedClassLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copiedClassLink ? 'Copied' : 'Copy class link'}
        </button>
      </div>

      <ActiveLessonPanel
        onShareLesson={handleShareLesson}
        onShareAssignment={handleShareAssignment}
        onAskAi={handleAskAi}
        onOpenLessonPlayer={setActiveTab ? handleOpenLessonPlayer : undefined}
        isAskingAi={isAskingAi}
      />

      {cameraError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{cameraError}</div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Camera test — big left card */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-gray-900">
              <Video className="h-5 w-5 text-indigo-600" /> Camera & mic check
            </h3>
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">Pre-class lobby</span>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
            {isPreviewing ? (
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-center text-sm text-slate-400">
                <div>
                  <Video className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-2">Test your camera and mic before starting</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              Camera
              <select
                value={selectedVideoDevice}
                onChange={(e) => setSelectedVideoDevice(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2.5 py-2 text-sm normal-case outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {devices.filter((d) => d.kind === 'videoinput').map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              Microphone
              <select
                value={selectedAudioDevice}
                onChange={(e) => setSelectedAudioDevice(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2.5 py-2 text-sm normal-case outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {devices.filter((d) => d.kind === 'audioinput').map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Mic ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={isPreviewing ? stopCameraTest : startCameraTest}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {isPreviewing ? 'Stop test' : 'Test camera'}
            </button>
            <button
              onClick={startVideoCall}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Video className="h-4 w-4" /> Start class
            </button>
          </div>
        </section>

        {/* Right side: lobby info */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
              <UserPlus className="h-5 w-5 text-blue-500" />
              Waiting room ({waitingRoom.length})
            </h3>
            {waitingRoom.length === 0 ? (
              <p className="text-sm text-gray-500">No students waiting.</p>
            ) : (
              <ul className="space-y-1.5">
                {waitingRoom.map((s) => (
                  <li
                    key={s}
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-sm"
                  >
                    <span className="font-medium text-gray-700">{s}</span>
                    <button
                      onClick={() => admitStudent(s)}
                      className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-200"
                    >
                      Admit
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
              <Gamepad2 className="h-5 w-5 text-indigo-500" /> Active NeuroQuest
            </h3>
            {activeAssignment ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">{activeAssignment.title}</p>
                <p className="text-xs text-gray-500">
                  {getNeuroQuestGame(activeAssignment.gameSlug).title} · {activeAssignment.duration}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Save a quest from NeuroQuest Academy to share it during class.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Reusable shell pieces ──────────────────────────────────────────────
function FilmstripTile({
  children,
  label,
  muted,
  handRaised,
}: {
  children: React.ReactNode;
  label: string;
  muted?: boolean;
  handRaised?: boolean;
}) {
  return (
    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black sm:h-16 sm:w-24">
      {children}
      <div className="absolute bottom-0.5 left-0.5 max-w-[80%] truncate rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white">
        {label}
      </div>
      {handRaised && (
        <span className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px]">
          <Hand className="h-3 w-3 text-amber-900" />
        </span>
      )}
      {muted && (
        <span className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-red-500">
          <MicOff className="h-3 w-3 text-white" />
        </span>
      )}
    </div>
  );
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  active,
  danger,
}: {
  icon: typeof Mic;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  const tone = danger
    ? 'bg-red-500 hover:bg-red-400 text-white'
    : active
      ? 'bg-[#49c8ff]/20 hover:bg-[#49c8ff]/30 text-[#8ddfff]'
      : 'bg-white/5 hover:bg-white/10 text-slate-200';
  return (
    <button
      onClick={onClick}
      className={`group inline-flex shrink-0 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 transition sm:px-2.5 ${tone}`}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden text-[9px] font-semibold sm:inline">{label}</span>
    </button>
  );
}
