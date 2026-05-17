'use client';

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, Compass, GraduationCap, Lightbulb, Loader2, Sparkles, Target, Video, Wand2 } from 'lucide-react';
import type { TabType } from '@/components/Sidebar';
import type { LearningMode } from '@/lib/demoAssignments';
import type { SubjectLesson } from '@/lib/subjects/types';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';
import { EnglishInteractiveRenderer } from './EnglishInteractiveRenderer';
import { MediaAdvertisementLab } from './MediaAdvertisementLab';

type Tab = 'explore' | 'practice' | 'assignment';

interface Props {
  lesson: SubjectLesson;
  mode?: LearningMode;
  onBack: () => void;
  setActiveTab: (tab: TabType) => void;
}

export function EnglishLessonPlayer({ lesson, mode = 'teacher', onBack, setActiveTab: _setActiveTab }: Props) {
  void _setActiveTab;
  const theme = subjectRegistry.english.theme;
  const [tab, setTab] = useState<Tab>('explore');
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceRevealed, setPracticeRevealed] = useState<Record<string, boolean>>({});
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [heygenState, setHeygenState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [heygenMessage, setHeygenMessage] = useState<string | null>(null);
  const isTeacher = mode === 'teacher';
  const isAdvertisingLesson = lesson.unitId === 'eis-eng-y8-u1-advertising';
  const studentExplanation = isAdvertisingLesson
    ? 'Adverts persuade through choices students can see: image, colour, layout, slogan, price, audience and cultural context. In this lesson, use the highlighted McDonald\'s US and UAE adverts to point to the evidence first, then explain the persuasive device and its effect.'
    : lesson.studentExplanation;
  const animatedSteps = isAdvertisingLesson
    ? [
        'Choose the US or UAE advert and inspect the whole image before reading the labels.',
        'Click a highlighted area to identify the persuasive device and the audience effect.',
        'Compare how the US advert uses price and product desire while the UAE advert uses Ramadan, kindness and community.',
        'Turn one observation into a PETAL sentence, using the image itself as evidence.',
      ]
    : lesson.animatedSteps;
  const objectives = isAdvertisingLesson
    ? [
        'Identify persuasive devices in real advertisements.',
        'Explain how image and text work together to influence a target audience.',
        'Compare how the same global brand adapts its message for different cultures.',
      ]
    : lesson.objectives;
  const teacherNotes = isAdvertisingLesson
    ? 'Teach this as a visual-first sequence: chapter, topic, real advert, callout, example response, assignable question. Do not start with definitions alone. Ask students to point to the image, name the device, explain audience effect, then write a PETAL sentence.'
    : lesson.teacherNotes;
  const practiceQuestions: SubjectLesson['practiceQuestions'] = isAdvertisingLesson
    ? [
        {
          id: 'mcd-us-device',
          type: 'short_answer',
          question:
            'Example: In the US McDonald\'s advert, which persuasive device is strongest: value language, product image or direct address? Explain your choice.',
          answer:
            'A strong answer names one device, points to a visible part of the advert, and explains how it persuades through value, convenience or desire.',
          explanation: 'This turns a visible feature into analysis rather than a description.',
          marks: 3,
        },
        {
          id: 'mcd-uae-audience',
          type: 'multiple_choice',
          question: 'The UAE Ramadan advert mainly persuades by appealing to...',
          choices: ['Price only', 'Community and cultural values', 'Celebrity endorsement', 'Fear'],
          answer: 'Community and cultural values',
          explanation: 'The campaign localises the brand by connecting it to Ramadan, sharing and kindness.',
          marks: 1,
        },
        {
          id: 'mcd-comparison',
          type: 'short_answer',
          question: 'Write one sentence comparing how the US and UAE adverts use images differently.',
          answer:
            'Example: The US advert foregrounds the product to create appetite, whereas the UAE advert foregrounds people and Ramadan context to create emotional connection.',
          marks: 3,
        },
      ]
    : lesson.practiceQuestions;
  const assignmentQuestions: SubjectLesson['assignmentQuestions'] = isAdvertisingLesson
    ? [
        {
          id: 'mcd-ad-analysis',
          question:
            'Analyse the McDonald\'s US and UAE adverts on screen. Explain THREE persuasive devices across the two adverts. For each device, explain WHAT it is, WHERE it appears in the image, and WHY it persuades that target audience.',
          rubric:
            'Full marks: 3 clearly named devices, accurate image placement, and an explanation that links each device to a specific audience and intended response. Partial marks: device named and located but explanation is general.',
          expectedAnswer:
            'A strong response compares product desire and value language in the US advert with cultural context, community imagery and emotional appeal in the UAE Ramadan advert.',
          marks: 9,
        },
        {
          id: 'mcd-petal-paragraph',
          question:
            'Write one PETAL paragraph explaining how ONE highlighted part of the advert persuades its audience.',
          rubric:
            'Point, Evidence, Technique, Analysis and Link are all present. The analysis must explain audience effect, not simply describe the image.',
          expectedAnswer:
            'Example: The UAE advert uses community imagery to create emotional appeal because the audience connects McDonald\'s with generosity during Ramadan.',
          marks: 6,
        },
      ]
    : lesson.assignmentQuestions;

  const assignQuestion = (id: string) => {
    setAssigningId(id);
    window.setTimeout(() => {
      setAssignedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setAssigningId(null);
    }, 450);
  };

  const generateHeyGenIntro = async () => {
    if (heygenState === 'pending') return;
    setHeygenState('pending');
    setHeygenMessage(null);
    try {
      const script = `Welcome to this Year 8 English advertising lesson. Today we are looking at how adverts use image, slogan, audience and cultural context to persuade. Notice how the US McDonald's advert focuses on value and convenience, while the UAE Ramadan advert focuses on kindness, sharing and community. Your challenge is to explain how one persuasive device changes for a different audience.`;
      const res = await fetch('/api/heygen/create-lesson-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          title: `${lesson.title} - avatar introduction`,
          script,
          avatarStyle: 'english_coach',
          voiceStyle: 'warm_confident',
          aspectRatio: '16:9',
          includeCaptions: true,
          videoPurpose: 'teacher_walkthrough',
        }),
      });
      const data = (await res.json()) as { status?: string; message?: string; videoId?: string };
      if (!res.ok) throw new Error(data.message ?? 'HeyGen request failed.');
      setHeygenState('done');
      setHeygenMessage(data.status === 'demo' ? data.message ?? 'HeyGen demo mode ready.' : `HeyGen video queued: ${data.videoId}`);
    } catch (err) {
      setHeygenState('error');
      setHeygenMessage(err instanceof Error ? err.message : 'HeyGen request failed.');
    }
  };

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
        <div className="space-y-3">
          {isAdvertisingLesson ? <MediaAdvertisementLab compact /> : null}

          <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
            <div className="space-y-3">
              <Card title="Student explanation" icon={BookOpen}>
                <p className="text-sm leading-6 text-slate-200">{studentExplanation}</p>
              </Card>
              <Card title="Animated steps" icon={Sparkles}>
                <ol className="space-y-1.5">
                  {animatedSteps.map((step, i) => (
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
                  {objectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-6 text-slate-200">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: theme.accent }} />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              {isTeacher ? (
                <Card title="Teacher notes" icon={GraduationCap}>
                  <p className="whitespace-pre-line text-xs leading-6 text-slate-300">{teacherNotes}</p>
                </Card>
              ) : null}
              {isTeacher && isAdvertisingLesson ? (
                <Card title="HeyGen lesson opener" icon={Video}>
                  <p className="text-xs leading-5 text-slate-300">
                    Generate a short avatar introduction that tells students what to notice in the US and UAE adverts.
                    The video supports the lesson; the advert analysis stays interactive inside English Studio.
                  </p>
                  <button
                    type="button"
                    onClick={generateHeyGenIntro}
                    disabled={heygenState === 'pending'}
                    className="mt-3 inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/50 bg-[#ffc43b]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#ffc43b] transition hover:border-[#ffc43b] hover:bg-[#ffc43b]/15 disabled:cursor-wait disabled:opacity-70"
                  >
                    {heygenState === 'pending' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                    Generate avatar intro
                  </button>
                  {heygenMessage ? (
                    <p className={`mt-2 text-xs font-semibold ${heygenState === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
                      {heygenMessage}
                    </p>
                  ) : null}
                </Card>
              ) : null}
            </div>

            <div>
              <EnglishInteractiveRenderer lesson={lesson} />
            </div>
          </div>
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-3">
          {practiceQuestions.map((q, i) => {
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
          {assignmentQuestions.map((a, i) => (
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
              {isTeacher && a.expectedAnswer && (
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  <span className="font-black text-slate-200">Model answer · </span>
                  {a.expectedAnswer}
                </p>
              )}
              {isTeacher ? (
                <button
                  type="button"
                  onClick={() => assignQuestion(a.id)}
                  disabled={assigningId === a.id || assignedIds.includes(a.id)}
                  className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white disabled:cursor-default disabled:border-emerald-400/40 disabled:bg-emerald-400/10 disabled:text-emerald-300"
                >
                  {assigningId === a.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : assignedIds.includes(a.id) ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <ClipboardCheck className="h-3.5 w-3.5" />
                  )}
                  {assignedIds.includes(a.id) ? 'Assigned to students' : 'Assign this question'}
                </button>
              ) : null}
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
