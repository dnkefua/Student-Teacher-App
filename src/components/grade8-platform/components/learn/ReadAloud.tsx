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
    return null; // Quietly hide on browsers without TTS support
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      {!speaking ? (
        <button
          onClick={start}
          className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:border-purple-400 hover:bg-purple-100"
          title="Listen to this section"
        >
          <Volume2 className="h-3.5 w-3.5" />
          {label}
        </button>
      ) : (
        <>
          <button
            onClick={togglePause}
            className="inline-flex items-center gap-1.5 rounded-md border border-purple-300 bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-800 transition hover:bg-purple-200"
          >
            <Pause className="h-3.5 w-3.5" />
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={stop}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            title="Stop reading"
          >
            <Square className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}
