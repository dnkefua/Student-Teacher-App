'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Save, Sparkles, Wand2 } from 'lucide-react';
import type { LearningMode } from '@/lib/demoAssignments';
import type { CinematicLessonRecord, CinematicLessonSpec, CinematicSceneType, SubjectId } from '@/lib/cinematic/types';
import { cinematicDemoLessons, createTemplateForSceneType } from '@/lib/cinematic/templates';
import { cinematicSceneTypes } from '@/lib/cinematic/sceneSchema';
import { listCinematicLessonSpecs, saveCinematicLessonSpec } from '@/lib/cinematic/assetPipeline';
import { CinematicLessonPlayer } from './CinematicLessonPlayer';

const subjectOptions: { id: SubjectId; label: string }[] = [
  { id: 'mathematics', label: 'Maths' },
  { id: 'science', label: 'Science' },
  { id: 'english', label: 'English' },
];

const styles = [
  '3D concept',
  'science simulation',
  'virtual lab',
  'reading workshop',
  'writing workshop',
  'exam revision',
] as const;

function defaultSceneFor(subject: SubjectId): CinematicSceneType {
  if (subject === 'science') return 'science_particle_model';
  if (subject === 'english') return 'english_essay_planner';
  return 'math_ratio_mixer';
}

export function CinematicStudio({ mode = 'teacher' }: { mode?: LearningMode }) {
  const [subject, setSubject] = useState<SubjectId>('mathematics');
  const [topic, setTopic] = useState('Ratio and Proportion - Mixing Colours');
  const [style, setStyle] = useState<(typeof styles)[number]>('3D concept');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [sceneType, setSceneType] = useState<CinematicSceneType>('math_ratio_mixer');
  const [spec, setSpec] = useState<CinematicLessonSpec>(cinematicDemoLessons[0]);
  const [source, setSource] = useState<'template' | 'ai' | 'mock'>('template');
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [savedLessons, setSavedLessons] = useState<CinematicLessonRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const availableSceneTypes = useMemo(
    () => cinematicSceneTypes.filter((item) => item.startsWith(subject === 'mathematics' ? 'math_' : `${subject}_`)),
    [subject],
  );

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const next = await listCinematicLessonSpecs({ subject, limitCount: 8 });
      if (alive) setSavedLessons(next);
    };
    void load();
    window.addEventListener('eis-cinematic-lessons-changed', load);
    return () => {
      alive = false;
      window.removeEventListener('eis-cinematic-lessons-changed', load);
    };
  }, [subject]);

  const changeSubject = (next: SubjectId) => {
    const nextScene = defaultSceneFor(next);
    setSubject(next);
    setSceneType(nextScene);
    const nextTopic =
      next === 'science'
        ? 'Particle Model - Solids, Liquids and Gases'
        : next === 'english'
          ? 'Building Evidence in Persuasive Writing'
          : 'Ratio and Proportion - Mixing Colours';
    setTopic(nextTopic);
    setSpec(createTemplateForSceneType(nextScene, next, nextTopic));
    setSource('template');
  };

  const generateSpec = async () => {
    if (topic.trim().length < 3 || busy) return;
    setBusy(true);
    setError(null);
    setSaveNotice(null);
    try {
      const res = await fetch('/api/cinematic/generate-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade: 'Grade 8',
          topic,
          desiredSceneType: sceneType,
          teacherNotes: `${style}. ${teacherNotes}`.trim(),
        }),
      });
      const data = (await res.json()) as { data?: CinematicLessonSpec; source?: 'ai' | 'mock'; message?: string };
      if (!res.ok || !data.data) throw new Error(data.message ?? 'Could not generate cinematic lesson.');
      setSpec(data.data);
      setSource(data.source ?? 'mock');
      const saved = await saveCinematicLessonSpec({ spec: data.data, source: data.source ?? 'mock' });
      setSavedLessons((prev) => [saved, ...prev.filter((lesson) => lesson.id !== saved.id)].slice(0, 8));
      setSaveNotice(`Saved ${data.data.title} to cinematic lesson storage.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate cinematic lesson.');
    } finally {
      setBusy(false);
    }
  };

  const saveCurrentSpec = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await saveCinematicLessonSpec({ spec, source });
      setSaveNotice(`Saved ${saved.title} for ${saved.subject}.`);
      setSavedLessons((prev) => [saved, ...prev.filter((lesson) => lesson.id !== saved.id)].slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save cinematic lesson.');
    } finally {
      setSaving(false);
    }
  };

  const useTemplate = async () => {
    const next = createTemplateForSceneType(sceneType, subject, topic);
    setSpec(next);
    setSource('template');
    setSaveNotice(null);
  };

  return (
    <div className="space-y-6 text-white">
      <header className="rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
              <Sparkles className="h-3.5 w-3.5" />
              Cinematic Studio
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-normal">Build app-rendered cinematic lessons</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Generate a structured CinematicLessonSpec, preview the interactive R3F or subject tool, and optionally create short HeyGen avatar video assets around the lesson.
            </p>
          </div>
          <span className="rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#8ddfff]">
            Source: {source}
          </span>
        </div>
      </header>

      <section className="grid gap-4 rounded-lg border border-white/10 bg-[#061126] p-4 xl:grid-cols-[1fr_1fr_auto] xl:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Subject</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {subjectOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => changeSubject(option.id)}
                className={`rounded-md border px-3 py-2 text-xs font-black uppercase tracking-wide ${
                  subject === option.id ? 'border-[#49c8ff] bg-[#49c8ff]/15 text-[#8ddfff]' : 'border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Topic</label>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] px-3 py-2 text-sm text-white outline-none focus:border-[#49c8ff]"
          />
        </div>

        <button
          type="button"
          onClick={generateSpec}
          disabled={busy || topic.trim().length < 3}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#ffc43b] px-4 text-sm font-black text-[#061126] hover:bg-[#ffe08a] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          Generate Cinematic Lesson
        </button>

        <div>
          <label className="text-xs font-black uppercase tracking-wide text-slate-300">Style</label>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value as (typeof styles)[number])}
            className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] px-3 py-2 text-sm text-white outline-none focus:border-[#49c8ff]"
          >
            {styles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-wide text-slate-300">Scene type</label>
          <select
            value={sceneType}
            onChange={(event) => setSceneType(event.target.value as CinematicSceneType)}
            className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] px-3 py-2 text-sm text-white outline-none focus:border-[#49c8ff]"
          >
            {availableSceneTypes.map((item) => (
              <option key={item} value={item}>
                {item.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={useTemplate}
          className="h-10 rounded-md border border-white/10 px-4 text-sm font-black text-slate-200 hover:border-[#49c8ff]/60 hover:text-white"
        >
          Use Template
        </button>

        <button
          type="button"
          onClick={saveCurrentSpec}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 px-4 text-sm font-black text-emerald-100 hover:border-emerald-200/70 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Lesson
        </button>

        <textarea
          value={teacherNotes}
          onChange={(event) => setTeacherNotes(event.target.value)}
          placeholder="Curriculum material, prior misconceptions, or EIS lesson notes"
          className="min-h-20 rounded-md border border-white/10 bg-[#050711] p-3 text-sm text-white outline-none focus:border-[#49c8ff] xl:col-span-3"
        />
      </section>

      {error ? <p className="rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm text-red-100">{error}</p> : null}
      {saveNotice ? (
        <p className="inline-flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
          <CheckCircle2 className="h-4 w-4" />
          {saveNotice}
        </p>
      ) : null}

      {savedLessons.length > 0 ? (
        <section className="rounded-lg border border-white/10 bg-[#061126] p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Saved cinematic lessons</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {savedLessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  setSpec(lesson.spec);
                  setSource(lesson.source === 'manual' || lesson.source === 'upload' ? 'template' : lesson.source);
                  setSaveNotice(`Loaded ${lesson.title}.`);
                }}
                className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-[#49c8ff]/60"
              >
                <p className="line-clamp-2 text-sm font-black text-white">{lesson.title}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">{lesson.topic}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <CinematicLessonPlayer spec={spec} mode={mode} />
    </div>
  );
}
