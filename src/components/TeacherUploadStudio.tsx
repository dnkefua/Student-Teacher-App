'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  Wand2,
  X,
} from 'lucide-react';
import { aiGenerateLesson } from '@/lib/ai/client';
import type { GeneratedLesson as AiGeneratedLesson } from '@/lib/ai/types';
import { uploadTeacherSource, type UploadProgress, type UploadResult } from '@/lib/firebase/uploads';
import { saveGeneratedLesson } from '@/lib/firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { getDemoUserId } from '@/lib/firebase/demoUser';
import { ExplainerByType } from './Math3DExplainers';
import { EnglishInteractiveRenderer } from './english/EnglishInteractiveRenderer';
import { ScienceInteractiveRenderer } from './science/ScienceInteractiveRenderer';
import { threeDLabels, type CurriculumUnit } from '@/lib/grade8Curriculum';
import type { SubjectId, SubjectLesson, SubjectLabel } from '@/lib/subjects/types';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';

const ACCEPTED_FILES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
};

const UNIT_OPTIONS: { value: CurriculumUnit; label: string }[] = [
  { value: 'numerical', label: 'Numerical Reasoning' },
  { value: 'abstract', label: 'Abstract Reasoning' },
  { value: 'spatial', label: 'Spatial Reasoning' },
  { value: 'data', label: 'Reasoning with Data' },
];

function isExtractableLater(file: File | null): boolean {
  if (!file) return false;
  const t = file.type;
  return t === 'application/pdf' || t.includes('powerpoint') || t.includes('presentation');
}

type Phase = 'idle' | 'uploading' | 'uploaded' | 'generating' | 'generated' | 'saving' | 'saved' | 'error';

function subjectLabelFor(id: SubjectId): SubjectLabel {
  return subjectRegistry[id].label;
}

function asSubjectLesson(gl: AiGeneratedLesson): SubjectLesson {
  return {
    id: 'generated',
    subject: gl.subject,
    subjectLabel: subjectLabelFor(gl.subject),
    grade: 'Grade 8',
    unitId: 'ai-generated',
    unitTitle: gl.strand,
    strand: gl.strand,
    topic: gl.topic,
    title: gl.title,
    inquiryQuestion: gl.inquiryQuestion,
    objectives: gl.objectives,
    studentExplanation: gl.studentExplanation,
    teacherNotes: gl.teacherNotes,
    animatedSteps: gl.animatedSteps,
    interactiveType: gl.subjectInteractiveType ?? '',
    modality: 'animated_explainer',
    workedExamples: gl.workedExamples,
    practiceQuestions: gl.practiceQuestions.map((q, i) => ({
      id: `p${i + 1}`,
      type: 'short_answer',
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
    })),
    assignmentQuestions: gl.assignmentQuestions.map((q, i) => ({
      id: `a${i + 1}`,
      question: q.question,
      expectedAnswer: q.expectedAnswer,
      rubric: q.rubric,
      marks: 10,
    })),
    extensionChallenge: gl.extensionChallenge,
  };
}

export function TeacherUploadStudio() {
  const [subject, setSubject] = useState<SubjectId>('mathematics');
  const [topic, setTopic] = useState('');
  const [unit, setUnit] = useState<CurriculumUnit | ''>('');
  const [context, setContext] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<UploadResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<AiGeneratedLesson | null>(null);
  const [generatedSource, setGeneratedSource] = useState<'ai' | 'mock' | null>(null);
  const [savedLessonId, setSavedLessonId] = useState<string | null>(null);

  const fbReady = isFirebaseConfigured();

  const onDrop = useCallback(async (accepted: File[]) => {
    const picked = accepted[0];
    if (!picked) return;
    setFile(picked);
    setUpload(null);
    setUploadProgress(null);
    setError(null);
    if (!fbReady) return; // demo mode — skip upload
    setPhase('uploading');
    try {
      const result = await uploadTeacherSource(picked, (p) => setUploadProgress(p));
      if (result) {
        setUpload(result);
        setPhase('uploaded');
      } else {
        setPhase('idle');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
      setPhase('error');
    }
  }, [fbReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const clearFile = () => {
    setFile(null);
    setUpload(null);
    setUploadProgress(null);
    if (phase === 'uploaded' || phase === 'error') setPhase('idle');
  };

  const isGenerating = phase === 'generating';
  const isUploadingPhase = phase === 'uploading';
  const generateDisabled = topic.trim().length < 3 || isGenerating || isUploadingPhase;

  const generate = async () => {
    if (generateDisabled) return;
    setPhase('generating');
    setError(null);
    setGenerated(null);
    setGeneratedSource(null);
    setSavedLessonId(null);
    try {
      const response = await aiGenerateLesson({
        topic,
        subject,
        unit: subject === 'mathematics' ? (unit || undefined) : undefined,
        context: context || undefined,
      });
      setGenerated(response.data);
      setGeneratedSource(response.source);
      setPhase('generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lesson generation failed.');
      setPhase('error');
    }
  };

  const saveToLibrary = async () => {
    if (!generated || !fbReady) return;
    setPhase('saving');
    setError(null);
    try {
      const teacherId = getDemoUserId('teacher');
      const saved = await saveGeneratedLesson({
        title: generated.title,
        subject: generated.subject,
        unit: generated.unit,
        strand: generated.strand,
        topic: generated.topic,
        inquiryQuestion: generated.inquiryQuestion,
        objectives: generated.objectives,
        studentExplanation: generated.studentExplanation,
        teacherNotes: generated.teacherNotes,
        animatedSteps: generated.animatedSteps,
        threeDType: generated.threeDType,
        subjectInteractiveType: generated.subjectInteractiveType,
        workedExamples: generated.workedExamples,
        practiceQuestions: generated.practiceQuestions,
        assignmentQuestions: generated.assignmentQuestions,
        extensionChallenge: generated.extensionChallenge,
        createdBy: teacherId,
        source: upload ? 'upload' : 'ai',
        sourceUrl: upload?.downloadUrl,
        sourceFilename: upload?.filename,
      });
      setSavedLessonId(saved?.id ?? null);
      setPhase('saved');
      window.setTimeout(() => setPhase('generated'), 2400);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save lesson.');
      setPhase('error');
    }
  };

  return (
    <div className="space-y-6 text-white">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#ffc43b]/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
              <UploadCloud className="h-3.5 w-3.5" />
              Teacher Upload Studio
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">Generate a lesson from your own source</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Drop in a PDF, slide deck or image. Add a topic and any teacher notes. Gemma 4 returns a full
              structured lesson — animated steps, worked examples, assignment questions with rubrics, and the
              right 3D scene — which you can save to your class library.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {fbReady ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#49c8ff]" />
                Firebase persistence on
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffc43b]" />
                Demo mode · uploads not stored
              </span>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-[#061126] p-5">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#ffc43b]">Subject</p>
            <div className="mb-4 grid grid-cols-3 gap-1.5">
              {(['mathematics', 'english', 'science'] as const).map((s) => {
                const reg = subjectRegistry[s];
                const active = subject === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className="rounded-md border px-2 py-2 text-xs font-black uppercase tracking-wide transition"
                    style={{
                      borderColor: active ? reg.theme.primary : 'rgba(255,255,255,.15)',
                      background: active ? `${reg.theme.primary}22` : 'transparent',
                      color: active ? reg.theme.primary : '#cbd5e1',
                    }}
                  >
                    {reg.label}
                  </button>
                );
              })}
            </div>

            <label className="block text-xs font-black uppercase tracking-wide text-[#ffc43b]">Topic *</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Solving two-step linear equations with positive integers"
              className="mt-2 w-full rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#ffc43b] focus:ring-2 focus:ring-[#ffc43b]/30"
            />

            {subject === 'mathematics' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide text-slate-300">Unit (optional)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as CurriculumUnit | '')}
                    className="mt-2 w-full rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#49c8ff]"
                  >
                    <option value="">Let the AI choose</option>
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <label className="mt-4 block text-xs font-black uppercase tracking-wide text-slate-300">
              Teacher notes / pasted context (optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Anything you want the AI to know — prior misconceptions, real-world examples, page references…"
              className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2.5 text-sm leading-6 text-white outline-none transition focus:border-[#49c8ff] focus:ring-2 focus:ring-[#49c8ff]/30"
            />
          </div>

          <button
            onClick={generate}
            disabled={generateDisabled}
            className={`relative inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition ${
              isGenerating
                ? 'bg-[#ffc43b]/80 text-[#061126]'
                : generateDisabled
                ? 'bg-[#ffc43b]/30 text-[#061126]/50 cursor-not-allowed'
                : 'animate-eis-pulse bg-[#ffc43b] text-[#061126] shadow-[0_0_22px_rgba(255,196,59,.35)] hover:bg-[#ffe08a]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gemma 4 is composing the lesson…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate lesson
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#061126] p-5">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Source material (optional)</p>
          <div
            {...getRootProps()}
            className={`mt-3 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
              isDragActive
                ? 'border-[#49c8ff] bg-[#49c8ff]/5'
                : 'border-white/15 hover:border-[#49c8ff]/60 hover:bg-white/[0.03]'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-7 w-7 text-[#8ddfff]" />
            <p className="mt-3 text-sm font-semibold text-white">
              {isDragActive ? 'Drop the file here…' : 'Drag-and-drop or click to upload'}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Accepts PDF, PPT / PPTX, PNG, JPG, WEBP · max 10 MB
            </p>
          </div>

          {file ? (
            <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-4 w-4 text-[#ffc43b]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">{file.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {(file.size / 1024).toFixed(0)} KB · {file.type || 'unknown type'}
                    </p>
                  </div>
                </div>
                <button onClick={clearFile} className="text-slate-400 transition hover:text-white" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {phase === 'uploading' ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Uploading to Firebase Storage…
                    </span>
                    <span className="font-mono text-[11px] text-[#8ddfff]">
                      {uploadProgress ? Math.round(uploadProgress.fraction * 100) : 0}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#49c8ff] to-[#8ddfff] transition-[width] duration-150"
                      style={{ width: `${(uploadProgress?.fraction ?? 0) * 100}%` }}
                    />
                  </div>
                  {uploadProgress ? (
                    <p className="mt-1 text-[10px] text-slate-500">
                      {(uploadProgress.bytesTransferred / 1024).toFixed(0)} /{' '}
                      {(uploadProgress.totalBytes / 1024).toFixed(0)} KB
                    </p>
                  ) : null}
                </div>
              ) : null}

              {upload ? (
                <a
                  href={upload.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-[#8ddfff] hover:text-white"
                >
                  <Check className="h-3 w-3" />
                  Uploaded · open file
                </a>
              ) : null}

              {isExtractableLater(file) ? (
                <p className="mt-3 rounded-md border border-[#ffc43b]/25 bg-[#ffc43b]/5 px-3 py-2 text-[11px] leading-5 text-[#ffe08a]">
                  PDF and PowerPoint extraction will be handled by a Cloud Run extractor in a follow-up. For now, type the lesson topic and any key points into the fields on the left — those become the AI&apos;s context.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <p className="rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">
          {error}
        </p>
      ) : null}

      {generated ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">
              <Sparkles className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
              Lesson preview
            </p>
            {generatedSource ? (
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                  generatedSource === 'ai'
                    ? 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]'
                    : 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]'
                }`}
              >
                {generatedSource === 'ai' ? 'Gemma 4' : 'AI demo mode'}
              </span>
            ) : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr] xl:items-start">
            <article className="rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
              <h2 className="text-2xl font-black text-white">{generated.title}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-300">
                {[subjectLabelFor(generated.subject), generated.unit, generated.strand, generated.topic]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <p className="mt-3 text-sm italic leading-6 text-[#ffc43b]">Inquiry: {generated.inquiryQuestion}</p>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Objectives</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-200">
                  {generated.objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Student explanation</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{generated.studentExplanation}</p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Animated steps</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-200">
                  {generated.animatedSteps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </article>

            <div className="space-y-4">
              {generated.subject === 'mathematics' && generated.threeDType ? (
                <ExplainerByType type={generated.threeDType} />
              ) : generated.subject === 'english' ? (
                <EnglishInteractiveRenderer lesson={asSubjectLesson(generated)} />
              ) : generated.subject === 'science' ? (
                <ScienceInteractiveRenderer lesson={asSubjectLesson(generated)} />
              ) : null}
              <article className="rounded-lg border border-[#ffc43b]/25 bg-[#ffc43b]/5 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Teacher notes</p>
                <p className="mt-2 text-sm leading-6 text-slate-100">{generated.teacherNotes}</p>
                {generated.subject === 'mathematics' && generated.threeDType ? (
                  <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-300">
                    3D scene · {threeDLabels[generated.threeDType]}
                  </p>
                ) : generated.subjectInteractiveType ? (
                  <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-300">
                    Interactive · {generated.subjectInteractiveType.replace(/_/g, ' ')}
                  </p>
                ) : null}
              </article>
            </div>
          </div>

          <article className="rounded-lg border border-white/10 bg-[#061126] p-6">
            <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Worked examples</p>
            <ul className="mt-3 space-y-4">
              {generated.workedExamples.map((w, i) => (
                <li key={i} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm font-black text-white">{w.prompt}</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-5 text-slate-300">
                    {w.steps.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                  <p className="mt-2 inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2.5 py-1 text-xs font-black text-[#ffe08a]">
                    Answer · {w.answer}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#061126] p-6">
            <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Assignment questions</p>
            <ul className="mt-3 space-y-3">
              {generated.assignmentQuestions.map((q, i) => (
                <li key={i} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm font-black text-white">{q.question}</p>
                  <p className="mt-1 text-[11px] text-[#8ddfff]">Expected · {q.expectedAnswer}</p>
                  <p className="text-[11px] text-slate-400">
                    Keywords · <span className="font-mono">{q.acceptedKeywords.join(' / ')}</span>
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-300">{q.rubric}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-md border border-emerald-300/25 bg-emerald-300/5 px-3 py-2 text-[11px] leading-5 text-emerald-100">
              Extension challenge · {generated.extensionChallenge}
            </p>
          </article>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={saveToLibrary}
              disabled={!fbReady || phase === 'saving' || phase === 'saved'}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${
                phase === 'saved'
                  ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                  : !fbReady
                  ? 'bg-[#49c8ff]/30 text-[#061126]/50 cursor-not-allowed'
                  : phase === 'saving'
                  ? 'bg-[#49c8ff]/80 text-[#061126]'
                  : 'animate-eis-pulse bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)] hover:bg-[#8ddfff]'
              }`}
            >
              {phase === 'saved' ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved to library!
                </>
              ) : phase === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save to library
                </>
              )}
            </button>
            {savedLessonId ? (
              <span className="text-[11px] font-black uppercase tracking-wide text-slate-300">
                Lesson id · <span className="font-mono normal-case text-slate-200">{savedLessonId}</span>
              </span>
            ) : null}
            {!fbReady ? (
              <span className="inline-flex items-center gap-2 text-[11px] text-slate-400">
                <X className="h-3 w-3" />
                Sign in to Firebase to persist generated lessons.
              </span>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
