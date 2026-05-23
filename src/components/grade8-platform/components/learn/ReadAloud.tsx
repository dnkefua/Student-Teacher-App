'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Pause, Square } from 'lucide-react';

/**
 * Browser-native text-to-speech control.
 *
 * Uses the standard SpeechSynthesis API so we get audio narration without
 * any external service or extra dependency. Concatenates the supplied
 * `text` pieces into one utterance, lets the user play / pause / stop,
 * and picks a clearer English voice when one is available.
 *
 * Speech is *paused* between paragraphs in the source string so the
 * reader can keep up — handled by the engine via punctuation. A 1×
 * default rate sounds neutral; we expose no rate control here to keep
 * the surface area small.
 */
export function ReadAloud({ text, label = 'Read aloud' }: { text: string; label?: string }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSupported('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function');
  }, []);

  // If the user navigates away or the parent unmounts, stop whatever is
  // currently being read — otherwise voice continues across pages.
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const pickVoice = (): SpeechSynthesisVoice | undefined => {
    if (typeof window === 'undefined') return undefined;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return undefined;
    // Prefer a natural-sounding English voice when one is available.
    const preferred =
      voices.find((v) => /Google.*English/i.test(v.name)) ||
      voices.find((v) => /Microsoft.*(Aria|Jenny|Guy|Sonia|Ryan)/i.test(v.name)) ||
      voices.find((v) => v.lang?.startsWith('en-GB')) ||
      voices.find((v) => v.lang?.startsWith('en-US')) ||
      voices.find((v) => v.lang?.startsWith('en'));
    return preferred;
  };

  const start = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePause = () => {
    if (!supported) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  if (!supported) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-400">
        <Volume2 className="h-4 w-4 opacity-50" />
        TTS not supported in this browser
      </span>
    );
  }

  return (
    <div className="inline-flex shrink-0 items-center gap-1.5">
      {!speaking ? (
        <button
          onClick={start}
          className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.03] hover:shadow-purple-500/50 active:scale-[0.98]"
          title="Listen to this concept being read aloud"
        >
          <Volume2 className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ) : (
        <>
          <button
            onClick={togglePause}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-600"
          >
            <Pause className="h-4 w-4" />
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={stop}
            className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-black text-slate-700 shadow-md transition hover:bg-slate-50"
            title="Stop reading"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        </>
      )}
    </div>
  );
}
