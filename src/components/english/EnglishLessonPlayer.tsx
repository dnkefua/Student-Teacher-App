'use client';

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ClipboardCheck, Compass, GraduationCap, Lightbulb, Sparkles, Target } from 'lucide-react';
import type { TabType } from '@/components/Sidebar';
import type { SubjectLesson } from '@/lib/subjects/types';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';
import { EnglishInteractiveRenderer } from './EnglishInteractiveRenderer';

type Tab = 'explore' | 'practice' | 'assignment';

interface Props {
  lesson: SubjectLesson;
  onBack: () => void;
  setActiveTab: (tab: TabType) => void;
}

export function EnglishLessonPlayer({ lesson, onBack, setActiveTab: _setActiveTab }: Props) {
  void _setActiveTab;
  const theme = subjectRegistry.english.theme;
  const [tab, setTab] = useState<Tab>('explore');
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceRevealed, setPracticeRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          English Studio
        </button>
        <span
          className="rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide"
          style={{ borderColor: `${theme.primary}55`, background: `${theme.primary}1A`, color: theme.primary }}
        >
          {lesson.unitTitle}
        </span>
      </div>

      <header className="rounded-lg border border-white/10 bg-gradient-to-r from-[#1a0a36] via-[#160b2c] to-[#050711] p-5">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{lesson.topic}</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">{lesson.title}</h1>
        <p
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-bold uppercase tracking-wide"
          style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: `${theme.accent}14` }}
        >
          <Compass className="h-3 w-3" />
          {lesson.inquiryQuestion}
        </p>

        {(lesson.keyConcept || (lesson.relatedConcepts && lesson.relatedConcepts.length > 0)) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lesson.keyConcept && (
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Key · {lesson.keyConcept}
              </span>
            )}
            {(lesson.relatedConcepts ?? []).map((c) => (
              <span
                key={c}
                className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ borderColor: `${theme.primary}55`, color: theme.primary }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </header>

      <nav className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'explore', label: 'Explore', icon: Lightbulb },
            { id: 'practice', label: 'Practice', icon: Target },
            { id: 'assignment', label: 'Assignment', icon: ClipboardCheck },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? theme.primary : 'rgba(255,255,255,.15)',
                background: active ? `${theme.primary}1A` : 'transparent',
                color: active ? theme.primary : '#cbd5e1',
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {tab === 'explore' && (
        <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-3">
            <Card title="Student explanation" icon={BookOpen}>
              <p className="text-sm leading-6 text-slate-200">{lesson.studentExplanation}</p>
            </Card>
            <Card title="Animated steps" icon={Sparkles}>
              <ol className="space-y-1.5">
                {lesson.animatedSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-6 text-slate-200">
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black"
                      style={{ background: `${theme.primary}26`, color: theme.primary }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
            <Card title="Objectives" icon={Target}>
              <ul className="space-y-1.5">
                {lesson.objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-6 text-slate-200">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: theme.accent }} />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Teacher notes" icon={GraduationCap}>
              <p className="whitespace-pre-line text-xs leading-6 text-slate-300">{lesson.teacherNotes}</p>
            </Card>
          </div>

          <div>
            <EnglishInteractiveRenderer lesson={lesson} />
          </div>
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-3">
          {lesson.practiceQuestions.map((q, i) => {
            const revealed = !!practiceRevealed[q.id];
            return (
              <div key={q.id} className="rounded-lg border border-white/10 bg-white/[.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-white">
                    <span style={{ color: theme.primary }}>Q{i + 1}.</span> {q.question}
                  </p>
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-400">
                    {q.type.replace('_', ' ')}
                  </span>
                </div>

                {q.choices ? (
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {q.choices.map((c) => {
                      const selected = practiceAnswers[q.id] === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setPracticeAnswers((prev) => ({ ...prev, [q.id]: c }))}
                          className="rounded-md border px-3 py-2 text-left text-sm transition"
                          style={{
                            borderColor: selected ? theme.primary : 'rgba(255,255,255,.12)',
                            background: selected ? `${theme.primary}14` : 'rgba(255,255,255,.02)',
                            color: selected ? theme.primary : '#e2e8f0',
                          }}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={practiceAnswers[q.id] ?? ''}
                    onChange={(e) =>
                      setPracticeAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="Type your response..."
                    rows={3}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
                  />
                )}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPracticeRevealed((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="rounded-md border border-white/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white"
                  >
                    {revealed ? 'Hide answer' : 'Reveal answer'}
                  </button>
                  {q.marks ? (
                    <span className="text-[11px] font-bold text-slate-500">{q.marks} marks</span>
                  ) : null}
                </div>

                {revealed && (
                  <div
                    className="mt-2 rounded-md border p-2 text-xs leading-5"
                    style={{ borderColor: `${theme.primary}33`, background: `${theme.primary}10`, color: '#e2e8f0' }}
                  >
                    {q.answer && (
                      <p>
                        <span className="font-black text-white">Answer · </span>
                        {q.answer}
                      </p>
                    )}
                    {q.rubric && (
                      <p className="mt-1">
                        <span className="font-black text-white">Rubric · </span>
                        {q.rubric}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="mt-1">
                        <span className="font-black text-white">Why · </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'assignment' && (
        <div className="space-y-3">
          {lesson.assignmentQuestions.map((a, i) => (
            <div key={a.id} className="rounded-lg border border-white/10 bg-white/[.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-white">
                  <span style={{ color: theme.primary }}>Task {i + 1}.</span> {a.question}
                </p>
                <span
                  className="rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                  style={{ borderColor: `${theme.accent}55`, color: theme.accent, background: `${theme.accent}14` }}
                >
                  {a.marks} marks
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                <span className="font-black text-white">Rubric · </span>
                {a.rubric}
              </p>
              {a.expectedAnswer && (
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  <span className="font-black text-slate-200">Model answer · </span>
                  {a.expectedAnswer}
                </p>
              )}
            </div>
          ))}
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: `${theme.primary}33`, background: `${theme.primary}0F` }}
          >
            <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: theme.primary }}>
              Extension challenge
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-200">{lesson.extensionChallenge}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[.03] p-4">
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-[#c084fc]" />
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{title}</p>
      </div>
      {children}
    </div>
  );
}
