'use client';

import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';

const QUIZIZZ_EXAMPLE = `platformAnalyticsRegistry.quizizz = {
  platform: "quizizz",
  displayName: "Quizizz",
  category: "quiz",
  supportedMethods: ["csv", "xlsx", "api"],
  identityFields: {
    studentName: ["name", "student", "participant"],
    email: ["email"],
  },
  activityFields: {
    activityTitle: ["quiz name", "activity", "title"],
    topic: ["topic", "subject"],
  },
  performanceFields: {
    score: ["score", "points"],
    percentage: ["accuracy", "percentage"],
  },
  engagementFields: {
    durationSeconds: ["time spent", "duration"],
  },
  questionFields: {
    questionText: ["question"],
    selectedAnswer: ["response", "answer"],
    correctAnswer: ["correct answer"],
    isCorrect: ["correct"],
  },
  defaultEventType: "question_response",
  defaultSubject: "Mathematics",
  defaultGrade: "Grade 8",
  normalizer: "generic",
};`;

const STEPS = [
  'Create platform registry entry.',
  'Define identity field aliases (name, email, username).',
  'Define activity field aliases (title, topic, date).',
  'Define performance field aliases (score, percentage, completion).',
  'Define engagement field aliases (duration, attempts).',
  'Choose the default event type and subject/grade.',
  'Choose a normalizer (or use "generic").',
  'Upload a sample report — the importer reads the registry.',
  'Map any unknown columns inside Upload Studio.',
  'Save events to the LearningEvent store.',
  'Student matching links external IDs to EIS roster.',
  'Mastery engine recalculates profiles automatically.',
];

export function PlatformIntegrationRoadmap() {
  return (
    <section className="space-y-4">
      <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Integration roadmap</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-emerald-300/30 bg-emerald-300/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-emerald-200">Live today</p>
            <p className="mt-1 text-sm font-black text-white">CSV &amp; XLSX import</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">
              Drop any school-approved report into Upload Reports. The registry handles column variation across platforms.
            </p>
          </div>
          <div className="rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#ffe08a]">Next</p>
            <p className="mt-1 text-sm font-black text-white">ManageBac API · OneRoster · LTI</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">
              Real-time roster + assessment sync once the school approves credentials. Connectors are scaffolded in <span className="font-mono text-slate-200">src/lib/learningHub/connectors/</span>.
            </p>
          </div>
          <div className="rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#8ddfff]">Later</p>
            <p className="mt-1 text-sm font-black text-white">Caliper · xAPI · Wonde</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">
              Standards-based learning record store integration when EIS commits to a long-term analytics warehouse.
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">How to add a new platform</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-200">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </article>

      <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Example registry entry · Quizizz</p>
        <pre className="mt-3 overflow-x-auto rounded-md border border-white/10 bg-[#020611] p-3 text-[11px] leading-5 text-slate-200">
{QUIZIZZ_EXAMPLE}
        </pre>
        <p className="mt-3 text-[11px] leading-5 text-slate-400">
          The Learning Data Hub already ships entries for {Object.keys(platformAnalyticsRegistry).length} platforms (Kahoot, Blooket, Dr Frost, MyiMaths, ManageBac, NeuroQuest, EIS Maths Studio, Generic CSV, Google Classroom, Microsoft Teams, Quizizz, Edpuzzle, Seneca, Mathspace, Wonde, Custom). Add a new key, set the aliases, save the file — no other code changes needed.
        </p>
      </article>
    </section>
  );
}
