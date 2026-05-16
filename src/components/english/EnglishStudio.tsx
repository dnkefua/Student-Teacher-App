'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { setActiveSubjectLesson } from '@/lib/activeSubjectLesson';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Feather,
  Highlighter,
  Library,
  Mic,
  PenLine,
  Play,
  Quote,
  Sparkles,
  Theater,
  Wand2,
} from 'lucide-react';
import type { TabType } from '@/components/Sidebar';
import type { SubjectLesson, SubjectUnit } from '@/lib/subjects/types';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';
import {
  year8EnglishUnits,
  year8EnglishLessons,
} from '@/lib/subjects/english/year8EnglishCurriculum';
import { EnglishLessonPlayer } from './EnglishLessonPlayer';

interface EnglishStudioProps {
  setActiveTab: (tab: TabType) => void;
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const unitIcon: Record<string, IconComponent> = {
  'Media · Advertising': Compass,
  'Novel · Charlie and the Chocolate Factory + Wonder': Library,
  'Poetry · Anthology (Personal & Cultural Expression)': Feather,
  'Language & Film · Our Planet': Sparkles,
  'Drama · The Taming of the Shrew (Shakespeare)': Theater,
};

const interactiveIcon: Record<string, IconComponent> = {
  text_annotation_lab: Highlighter,
  essay_planner: PenLine,
  poetry_device_highlighter: Quote,
  character_analysis_board: Library,
  writing_revision_studio: Wand2,
  story_structure_map: BookOpen,
  grammar_sentence_builder: PenLine,
  vocabulary_practice: BookOpen,
  debate_simulator: Mic,
  speaking_feedback: Mic,
};

export function EnglishStudio({ setActiveTab }: EnglishStudioProps) {
  const theme = subjectRegistry.english.theme;
  const [activeUnitId, setActiveUnitId] = useState<string>(year8EnglishUnits[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const activeUnit = useMemo<SubjectUnit>(
    () => year8EnglishUnits.find((u) => u.id === activeUnitId) ?? year8EnglishUnits[0],
    [activeUnitId]
  );

  const activeLesson = useMemo<SubjectLesson | null>(() => {
    if (!activeLessonId) return null;
    return year8EnglishLessons.find((l) => l.id === activeLessonId) ?? null;
  }, [activeLessonId]);

  useEffect(() => {
    if (activeLesson) setActiveSubjectLesson(activeLesson);
  }, [activeLesson]);

  if (activeLesson) {
    return (
      <EnglishLessonPlayer
        lesson={activeLesson}
        onBack={() => setActiveLessonId(null)}
        setActiveTab={setActiveTab}
      />
    );
  }

  return (
    <div className="space-y-5 text-white">
      <header
        className="rounded-lg border border-white/10 bg-gradient-to-r from-[#1a0a36] via-[#160b2c] to-[#050711] p-5"
        style={{ boxShadow: `0 0 60px ${theme.primary}22 inset` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide"
              style={{
                borderColor: `${theme.primary}55`,
                background: `${theme.primary}1A`,
                color: theme.primary,
              }}
            >
              <Feather className="h-3.5 w-3.5" />
              EIS English Studio · Year 8
            </div>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">
              Read closely. Write deliberately. Speak with intent.
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
              Grade 8 English taught through the school's real Sequence-of-Learning — advertising, the novel, the
              anthology, documentary film, and Shakespeare. Every lesson opens an interactive studio: annotate texts,
              plan PETAL paragraphs, highlight poetic devices, build sentences, and revise drafts with AI feedback.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
              {year8EnglishUnits.length} units · {year8EnglishLessons.length} lessons
            </span>
            <button
              onClick={() => setActiveTab('learning-hub')}
              className="inline-flex items-center gap-1 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white"
            >
              Learning Data Hub
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Units</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {year8EnglishUnits.map((unit) => {
            const Icon = unitIcon[unit.title] ?? BookOpen;
            const isActive = unit.id === activeUnitId;
            return (
              <button
                key={unit.id}
                onClick={() => setActiveUnitId(unit.id)}
                className="rounded-lg border p-3 text-left transition"
                style={{
                  borderColor: isActive ? theme.primary : 'rgba(255,255,255,.1)',
                  background: isActive ? `${theme.primary}14` : 'rgba(255,255,255,.03)',
                  boxShadow: isActive ? `0 0 28px ${theme.primary}33` : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-md"
                    style={{ background: `${theme.primary}22`, color: theme.primary }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-black text-white">{unit.title}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-300">{unit.inquiryQuestion}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(unit.relatedConcepts ?? []).slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ borderColor: `${theme.primary}40`, color: theme.primary }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] font-bold text-slate-400">{unit.lessons.length} lessons</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[.02] p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Active unit</p>
            <h3 className="text-lg font-black text-white">{activeUnit.title}</h3>
            {activeUnit.statementOfInquiry && (
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-300">
                <span className="font-bold text-slate-400">Statement of Inquiry · </span>
                {activeUnit.statementOfInquiry}
              </p>
            )}
          </div>
          <span
            className="rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide"
            style={{ borderColor: `${theme.accent}55`, background: `${theme.accent}1A`, color: theme.accent }}
          >
            Key concept · {activeUnit.keyConcept}
          </span>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {activeUnit.lessons.map((lesson, i) => {
            const Icon = interactiveIcon[lesson.interactiveType] ?? BookOpen;
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLessonId(lesson.id)}
                className="group flex items-start gap-3 rounded-lg border border-white/10 bg-[#0a0f1e] p-3 text-left transition hover:border-white/30"
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-sm font-black"
                  style={{ background: `${theme.primary}26`, color: theme.primary }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: theme.primary }} />
                    <span className="truncate text-[11px] font-black uppercase tracking-wide text-slate-400">
                      {lesson.topic}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-black text-white">{lesson.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{lesson.inquiryQuestion}</p>
                </div>
                <Play
                  className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-white"
                />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
