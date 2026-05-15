import React, { useState, useRef, useEffect } from 'react';
import { generateContent, DEFAULT_AI_MODEL, TTS_MODEL } from '@/lib/gemini';
import { Send, Volume2, Users, ShieldAlert, Loader2, UserPlus, Video, VideoOff, Mic, MicOff, PhoneOff, ScreenShare, Copy, Check, Gamepad2, ExternalLink, Settings } from 'lucide-react';
import { Modality } from '@google/genai';
import { NeuroQuestAssignment, getNeuroQuestGame, loadActiveAssignment } from '@/lib/neuroquest';
import { ActiveLessonPanel } from './ActiveLessonPanel';
import type { DemoAssignment } from '@/lib/demoAssignments';
import type { TabType } from './Sidebar';

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

export function VirtualClassroom({ setActiveTab }: { setActiveTab?: (tab: TabType) => void } = {}) {
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

  const postSystemMessage = (sender: string, text: string, isTeacher = true) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, sender, text, isTeacher, timestamp: new Date() },
    ]);
  };

  const handleShareLesson = (lesson: DemoAssignment) => {
    postSystemMessage(
      'Mr Smith (live)',
      `📘 We're starting "${lesson.title}" (${lesson.lessonTitle}). Today's inquiry: ${lesson.inquiryQuestion}`,
    );
  };

  const handleShareAssignment = (lesson: DemoAssignment) => {
    postSystemMessage(
      'Mr Smith (live)',
      `📝 Assignment for today: ${lesson.question} — try this in your notebook and submit on your dashboard.`,
    );
  };

  const handleAskAi = async (lesson: DemoAssignment) => {
    if (isAskingAi) return;
    setIsAskingAi(true);
    try {
      const prompt = `You are explaining a step in a live Grade 8 maths class. In 2-3 short sentences, explain how to approach this question for a student who is stuck. Be encouraging and concrete. Do not give the final numeric answer — leave that for the student to compute.\n\nQuestion: ${lesson.question}\nInquiry frame: ${lesson.inquiryQuestion}`;
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

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Virtual Classroom Assistant</h2>
          <p className="text-gray-600">Run camera-based online learning, share NeuroQuest activities, answer with AI voice, and monitor behavior.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={copyClassLink}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 flex items-center gap-2"
          >
            {copiedClassLink ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            {copiedClassLink ? 'Copied' : 'Class Link'}
          </button>
          {!isVideoActive && (
          <button 
            onClick={startVideoCall}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Video className="w-5 h-5" />
            Start Online Class
          </button>
          )}
        </div>
      </div>

      <ActiveLessonPanel
        onShareLesson={handleShareLesson}
        onShareAssignment={handleShareAssignment}
        onAskAi={handleAskAi}
        onOpenLessonPlayer={setActiveTab ? handleOpenLessonPlayer : undefined}
        isAskingAi={isAskingAi}
      />

      {cameraError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {cameraError}
        </div>
      )}

      {isVideoActive ? (
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
          {/* Video Grid Area (Takes up 3 columns on large screens) */}
          <div className="xl:col-span-3 flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-lg relative min-h-[50vh] xl:min-h-0">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4 grid gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-white md:grid-cols-[1fr_1fr_auto_auto]">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                  Camera
                  <select
                    value={selectedVideoDevice}
                    onChange={(event) => setSelectedVideoDevice(event.target.value)}
                    className="mt-1 w-full rounded-md border border-white/10 bg-gray-950 px-2 py-2 text-sm normal-case text-white"
                  >
                    {devices.filter(device => device.kind === 'videoinput').map((device, index) => (
                      <option key={device.deviceId || index} value={device.deviceId}>
                        {device.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                  Microphone
                  <select
                    value={selectedAudioDevice}
                    onChange={(event) => setSelectedAudioDevice(event.target.value)}
                    className="mt-1 w-full rounded-md border border-white/10 bg-gray-950 px-2 py-2 text-sm normal-case text-white"
                  >
                    {devices.filter(device => device.kind === 'audioinput').map((device, index) => (
                      <option key={device.deviceId || index} value={device.deviceId}>
                        {device.label || `Microphone ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={restartVideoWithDevices}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                  Apply
                </button>
                <button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <ScreenShare className="h-4 w-4" />
                  {isScreenSharing ? 'Stop Share' : 'Share Screen'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {isScreenSharing && (
                  <div className="relative col-span-2 aspect-video overflow-hidden rounded-lg border-2 border-cyan-400 bg-gray-800 md:col-span-3">
                    <video ref={screenVideoRef} autoPlay playsInline muted className="h-full w-full object-contain" />
                    <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
                      Screen Share
                    </div>
                  </div>
                )}

                {/* Teacher's Video (Local) */}
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-indigo-500">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                  />
                  {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        T
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1">
                    Teacher (You)
                    {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                  </div>
                </div>

                {/* Simulated Students */}
                {FAKE_STUDENTS.map((student) => (
                  <div key={student.id} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: student.avatarColor }}>
                      <span className="text-2xl font-bold text-gray-800 opacity-50">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium truncate max-w-[90%]">
                      {student.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Controls */}
            <div className="h-16 bg-gray-950 flex items-center justify-center gap-4 shrink-0">
              <button 
                onClick={toggleMute}
                className={`p-3 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleVideo}
                className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
              <button 
                onClick={endVideoCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors ml-4"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Side Panel (Chat + Waiting Room) */}
          <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
            <div className="flex-1 min-h-0">
              <ChatSection />
            </div>
            <div className="h-[300px] shrink-0">
              <SidebarSection />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="lg:col-span-2 min-h-0">
            <ChatSection />
          </div>
          <div className="min-h-0 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <Video className="h-5 w-5 text-indigo-600" />
                Camera and Mic Check
              </h3>
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-900">
                {isPreviewing ? (
                  <video ref={previewVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-gray-400">
                    Test your camera before starting the EIS online class.
                  </div>
                )}
              </div>
              <div className="mt-3 grid gap-2">
                <select
                  value={selectedVideoDevice}
                  onChange={(event) => setSelectedVideoDevice(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {devices.filter(device => device.kind === 'videoinput').map((device, index) => (
                    <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>
                  ))}
                </select>
                <select
                  value={selectedAudioDevice}
                  onChange={(event) => setSelectedAudioDevice(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {devices.filter(device => device.kind === 'audioinput').map((device, index) => (
                    <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={isPreviewing ? stopCameraTest : startCameraTest}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {isPreviewing ? 'Stop Test' : 'Test Camera'}
                </button>
                <button
                  onClick={startVideoCall}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Start Class
                </button>
              </div>
            </div>
            <SidebarSection />
          </div>
        </div>
      )}
    </div>
  );
}
