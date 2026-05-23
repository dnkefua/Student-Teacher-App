'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Pause, Square, Settings2, Cloud, Loader2 } from 'lucide-react';

/**
 * Browser-native text-to-speech control with a hand-picked voice list.
 *
 * The default SpeechSynthesis voice that the browser picks is almost always
 * one of the legacy robotic eSpeak / SAPI voices. Modern OSes ship far more
 * natural-sounding neural voices (Microsoft Aria / Jenny / Guy Natural,
 * Google UK English Female / Male, macOS Samantha / Daniel) but you have
 * to ask for them by name. This component:
 *
 *   1. Waits for the `voiceschanged` event so it can see the full list,
 *      not the empty initial array Chrome returns synchronously.
 *   2. Scores each voice — natural / neural / online voices win, with
 *      a soft preference for English voices.
 *   3. Exposes a small picker so the student or teacher can audition
 *      other voices and pick the one that sounds most human to them.
 *   4. Pauses cleanly between sentences by adding extra punctuation
 *      before the engine speaks.
 */
export function ReadAloud({ text, label = 'Read aloud' }: { text: string; label?: string }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [cloudAvailable, setCloudAvailable] = useState<boolean | null>(null);
  const [usingCloud, setUsingCloud] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── probe the cloud TTS endpoint once ────────────────────────────
  useEffect(() => {
    // HEAD with an empty body — endpoint returns 400 (missing_text) if a
    // provider is configured, 503 if not. Either way we tell quickly.
    fetch('/api/tts', { method: 'GET' })
      .then((r) => {
        // 503 == no_provider, 400 == provider exists but no text yet.
        setCloudAvailable(r.status !== 503);
      })
      .catch(() => setCloudAvailable(false));
  }, []);

  // ── voice discovery ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSupported =
      'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
    setSupported(isSupported);
    if (!isSupported) return;

    const refresh = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
    };
    refresh();
    // Chrome populates voices asynchronously; this event fires once they load.
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refresh);
    };
  }, []);

  // Score every voice so the most human-sounding one wins. The higher the
  // score, the more natural we expect the voice to be.
  const sortedVoices = useMemo(() => {
    const score = (v: SpeechSynthesisVoice): number => {
      let s = 0;
      const name = v.name.toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      // Marketing terms that vendors put on their neural voices.
      if (/natural|neural|online|premium|enhanced|hd\b|wavenet/.test(name)) s += 50;
      // Microsoft's neural voice names ship as "Microsoft Aria Online (Natural)" etc.
      if (/aria|jenny|guy|sonia|ryan|davis|emma|brian|libby|sara|olivia|liam/.test(name)) s += 25;
      // Apple's most natural voices.
      if (/samantha|daniel|karen|moira|tessa|alex\b|fred\b/.test(name)) s += 15;
      // Google voices are mid-quality on Chrome but better than eSpeak.
      if (/google\s/.test(name)) s += 10;
      // English-language preference.
      if (lang.startsWith('en-gb')) s += 8;
      else if (lang.startsWith('en-us')) s += 7;
      else if (lang.startsWith('en')) s += 5;
      // De-rank the obviously legacy voices.
      if (/espeak|festival|sapi5|microsoft (david|zira|mark|hazel)\b/.test(name)) s -= 30;
      // Local-service voices tend to be lower quality than online neural ones.
      if (!v.localService) s += 5;
      return s;
    };
    return voices
      .map((v) => ({ v, s: score(v) }))
      .sort((a, b) => b.s - a.s)
      .map(({ v }) => v);
  }, [voices]);

  // Pick the first time voices are available; never override a user choice.
  useEffect(() => {
    if (voiceURI || sortedVoices.length === 0) return;
    setVoiceURI(sortedVoices[0].voiceURI);
  }, [sortedVoices, voiceURI]);

  // If the user navigates away or the parent unmounts, stop whatever is
  // currently being read.
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectedVoice = useMemo(
    () => sortedVoices.find((v) => v.voiceURI === voiceURI) || sortedVoices[0],
    [sortedVoices, voiceURI],
  );

  /** Insert a short pause at every sentence boundary so the engine breathes. */
  const prepText = (raw: string) =>
    raw
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s+/g, '$1   ') // triple-space gives engines a longer beat
      .trim();

  const startBrowserTTS = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(prepText(text));
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
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
    setUsingCloud(false);
    window.speechSynthesis.speak(utterance);
  };

  const start = async () => {
    // Prefer the cloud route if one is configured; fall back to browser
    // SpeechSynthesis otherwise (or on cloud failure).
    if (cloudAvailable) {
      try {
        setLoading(true);
        const r = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: prepText(text) }),
        });
        if (!r.ok) throw new Error(`status ${r.status}`);
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onplay = () => {
          setSpeaking(true);
          setPaused(false);
          setUsingCloud(true);
        };
        audio.onpause = () => {
          if (audio.currentTime > 0 && !audio.ended) setPaused(true);
        };
        audio.onended = () => {
          setSpeaking(false);
          setPaused(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setSpeaking(false);
          setPaused(false);
          URL.revokeObjectURL(url);
        };
        await audio.play();
        return;
      } catch {
        // Fall through to browser TTS
      } finally {
        setLoading(false);
      }
    }
    startBrowserTTS();
  };

  const togglePause = () => {
    if (usingCloud && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setPaused(false);
      } else {
        audioRef.current.pause();
        setPaused(true);
      }
      return;
    }
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  /** Brief sample so the picker can audition a voice without playing the
   *  whole concept. */
  const auditionVoice = (v: SpeechSynthesisVoice) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance('Hello, this is what I sound like.');
    u.voice = v;
    u.rate = 0.92;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
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
    <div className="relative inline-flex shrink-0 items-center gap-1.5">
      {!speaking ? (
        <button
          onClick={start}
          disabled={loading}
          className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.03] hover:shadow-purple-500/50 active:scale-[0.98] disabled:opacity-70"
          title={cloudAvailable ? 'Listen with studio-quality cloud voice' : (selectedVoice ? `Listen with ${selectedVoice.name}` : 'Listen to this concept')}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : cloudAvailable ? (
            <Cloud className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          <span>{label}</span>
          {cloudAvailable && (
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              HD
            </span>
          )}
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

      {/* Voice picker */}
      <button
        onClick={() => setShowPicker((v) => !v)}
        className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-2 py-2.5 text-white transition hover:bg-white/20"
        title="Choose voice"
        aria-expanded={showPicker}
      >
        <Settings2 className="h-4 w-4" />
      </button>

      {showPicker && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Choose voice
            </p>
            <p className="text-[10px] text-slate-400">
              {sortedVoices.length} available
            </p>
          </div>
          {sortedVoices.length === 0 ? (
            <p className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
              Voices still loading… try again in a moment.
            </p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {sortedVoices.map((v, i) => {
                const isActive = v.voiceURI === voiceURI;
                const isNatural = /natural|neural|online|premium|enhanced|wavenet/i.test(v.name);
                return (
                  <div
                    key={v.voiceURI}
                    className={`flex items-center gap-2 rounded-md p-2 text-xs ${
                      isActive ? 'bg-purple-50 ring-1 ring-purple-300' : 'hover:bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => setVoiceURI(v.voiceURI)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate font-bold text-slate-900">
                        {v.name}
                        {isNatural && (
                          <span className="ml-1.5 inline-block rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-bold text-emerald-700">
                            NATURAL
                          </span>
                        )}
                        {i === 0 && !isNatural && (
                          <span className="ml-1.5 inline-block rounded bg-blue-100 px-1 py-0.5 text-[9px] font-bold text-blue-700">
                            BEST AVAILABLE
                          </span>
                        )}
                      </p>
                      <p className="truncate text-[10px] text-slate-500">{v.lang}</p>
                    </button>
                    <button
                      onClick={() => auditionVoice(v)}
                      className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-white"
                      title="Hear a sample"
                    >
                      Sample
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-2 text-[10px] text-slate-400">
            For the most human voices, try a recent version of Microsoft Edge — it
            ships neural voices like Aria, Jenny and Guy that sound far less
            robotic than the default.
          </p>
        </div>
      )}
    </div>
  );
}
