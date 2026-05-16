'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, RotateCcw, Volume2 } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Recording = { url: string; durationSeconds: number };

function checks(transcript: string) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillers = words.filter((w) => /^(um|uh|like|so|actually|basically)$/i.test(w)).length;
  const sentenceCount = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 3).length;
  const averageSentenceLength = sentenceCount ? Math.round(wordCount / sentenceCount) : 0;
  return { wordCount, fillers, sentenceCount, averageSentenceLength };
}

export function SpeakingFeedback({ lesson }: { lesson: SubjectLesson }) {
  const taskPrompt = useMemo(() => lesson.assignmentQuestions[0]?.question ?? lesson.inquiryQuestion, [lesson]);
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState<Recording | null>(null);
  const [transcript, setTranscript] = useState('');
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRef = useRef<number>(0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setSupported(false);
    }
  }, []);

  const start = async () => {
    if (!supported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const durationSeconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        setAudio({ url, durationSeconds });
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRef.current = recorder;
      startRef.current = Date.now();
      setRecording(true);
    } catch (err) {
      console.warn('[SpeakingFeedback] mic failed', err);
      setSupported(false);
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const reset = () => {
    setAudio(null);
    setTranscript('');
  };

  const c = checks(transcript);
  const wpm = audio && c.wordCount ? Math.round((c.wordCount / audio.durationSeconds) * 60) : null;

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Mic className="h-3 w-3" />
            Speaking Feedback
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Task</p>
          <p className="line-clamp-2 text-sm text-slate-200">{taskPrompt}</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {!supported ? (
        <p className="mt-3 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-3 py-2 text-sm text-[#ffe08a]">
          Microphone is not available in this browser — use the transcript field below to get text-only feedback.
        </p>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          {recording ? (
            <button
              onClick={stop}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#fb7185] px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#f43f5e]"
            >
              <MicOff className="h-3.5 w-3.5" />
              Stop recording
            </button>
          ) : (
            <button
              onClick={start}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#c084fc] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#1a0a36] transition hover:bg-[#a855f7]"
            >
              <Mic className="h-3.5 w-3.5" />
              Start recording
            </button>
          )}
          {audio && !recording && (
            <audio src={audio.url} controls className="h-8 max-w-full flex-1" />
          )}
        </div>
      )}

      <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-400">Transcript (type or paste)</p>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={6}
        placeholder="Type out what you said so the analyser can score it..."
        className="mt-1 w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
      />

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Words" value={c.wordCount} />
        <Stat label="Sentences" value={c.sentenceCount} />
        <Stat label="Avg length" value={c.averageSentenceLength} />
        <Stat label="Fillers" value={c.fillers} bad={c.fillers > 5} />
      </div>
      {wpm !== null && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-slate-300">
          <Volume2 className="h-3 w-3 text-[#c084fc]" />
          Pace · {wpm} words per minute ({wpm < 110 ? 'a bit slow' : wpm > 180 ? 'a bit rushed' : 'natural'})
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, bad }: { label: string; value: number; bad?: boolean }) {
  return (
    <div
      className="rounded-md border p-2 text-center"
      style={{
        borderColor: bad ? 'rgba(251,113,133,.45)' : 'rgba(255,255,255,.15)',
        background: bad ? 'rgba(251,113,133,.08)' : 'rgba(255,255,255,.03)',
      }}
    >
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black" style={{ color: bad ? '#fb7185' : '#ffffff' }}>
        {value}
      </p>
    </div>
  );
}
