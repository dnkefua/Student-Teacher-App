'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  BarChart3,
  BrainCircuit,
  Database,
  GraduationCap,
  ListChecks,
  Map,
  Network,
  Sparkles,
  Table2,
  TrashIcon,
  UploadCloud,
  UserCheck,
} from 'lucide-react';
import type { ExternalPlatform, LearningEvent, ExternalImport, PlatformConnection } from '@/lib/learningHub/types';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import {
  isDemoLoaded,
  listEvents,
  listConnections,
  listImports,
  clearAll,
} from '@/lib/learningHub/localStore';
import { seedDemoLearningHubData } from '@/lib/learningHub/demoData';
import { DEMO_ROSTER } from '@/lib/learningHub/studentMatching';
import { ConnectedPlatforms } from './ConnectedPlatforms';
import { UploadReports } from './UploadReports';
import { StudentMatching } from './StudentMatching';
import { LearningEventsTable } from './LearningEventsTable';
import { MasteryAnalytics } from './MasteryAnalytics';
import { AIRecommendations } from './AIRecommendations';
import { StudentLearningGraph } from './StudentLearningGraph';
import { PlatformIntegrationRoadmap } from './PlatformIntegrationRoadmap';
import { PrivacyNotice } from './PrivacyNotice';
import type { TabType } from '@/components/Sidebar';
import type { LearningMode } from '@/lib/demoAssignments';

type Props = {
  mode: LearningMode;
  setActiveTab: (tab: TabType) => void;
};

type TeacherTab =
  | 'platforms'
  | 'upload'
  | 'matching'
  | 'events'
  | 'mastery'
  | 'recommendations'
  | 'graph'
  | 'roadmap';

const TEACHER_TABS: { id: TeacherTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'platforms', label: 'Connected platforms', icon: Network },
  { id: 'upload', label: 'Upload reports', icon: UploadCloud },
  { id: 'matching', label: 'Student matching', icon: UserCheck },
  { id: 'events', label: 'Learning events', icon: Table2 },
  { id: 'mastery', label: 'Mastery analytics', icon: BarChart3 },
  { id: 'recommendations', label: 'AI recommendations', icon: Sparkles },
  { id: 'graph', label: 'Student learning graph', icon: BrainCircuit },
  { id: 'roadmap', label: 'Integration roadmap', icon: Map },
];

type StudentTab = 'my-graph' | 'my-recommendations' | 'my-mastery';
const STUDENT_TABS: { id: StudentTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'my-graph', label: 'My learning graph', icon: BrainCircuit },
  { id: 'my-recommendations', label: 'My recommendations', icon: Sparkles },
  { id: 'my-mastery', label: 'My mastery', icon: BarChart3 },
];

/* ─── External store (Learning Hub) ─────────────────────────────────── */

let cachedSnapshot: {
  events: LearningEvent[];
  imports: ExternalImport[];
  connections: PlatformConnection[];
} | null = null;

function invalidate() { cachedSnapshot = null; }
function readSnapshot() {
  if (cachedSnapshot === null) {
    cachedSnapshot = {
      events: listEvents(),
      imports: listImports(),
      connections: listConnections(),
    };
  }
  return cachedSnapshot;
}
const EMPTY_SNAPSHOT = { events: [] as LearningEvent[], imports: [] as ExternalImport[], connections: [] as PlatformConnection[] };

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => { invalidate(); cb(); };
  window.addEventListener('eis-learning-hub-changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('eis-learning-hub-changed', handler);
    window.removeEventListener('storage', handler);
  };
}

/* ─── Component ─────────────────────────────────────────────────────── */

export function LearningDataHub({ mode, setActiveTab }: Props) {
  const { events, imports, connections } = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  const fbReady = isFirebaseConfigured();

  // Use first demo student as the "signed-in" student in student mode.
  const [studentMockId] = useState<string>(DEMO_ROSTER[0].id);
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('platforms');
  const [studentTab, setStudentTab] = useState<StudentTab>('my-graph');
  // Derive demo-active state from storage on each render (cheap; isDemoLoaded
  // is a single localStorage lookup) so we never need a setState-in-effect.
  const demoActive = isDemoLoaded() || events.length > 0;

  const seedDemo = () => {
    seedDemoLearningHubData();
    invalidate();
  };

  const clearDemo = () => {
    clearAll();
    invalidate();
  };

  return (
    <div className="space-y-6 text-white">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#49c8ff]/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/35 bg-[#49c8ff]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
              <Database className="h-3.5 w-3.5" />
              Learning Data Hub
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              {mode === 'teacher'
                ? 'Unify evidence from every learning platform.'
                : 'Your learning across every platform, in one place.'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              ManageBac remains the system of record; the Learning Data Hub is the AI-native intelligence layer that ingests
              Kahoot, Blooket, Dr Frost, MyiMaths, NeuroQuest and EIS Maths Studio evidence, links it to your roster, and
              recommends precise next actions.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${
                fbReady
                  ? 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]'
                  : 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${fbReady ? 'bg-[#49c8ff]' : 'bg-[#ffc43b]'}`} />
              {fbReady ? 'Firebase persistence on' : 'Local demo mode'}
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
              {events.length.toLocaleString()} events · {imports.length} imports · {connections.length} platforms
            </span>
          </div>
        </div>

        {mode === 'teacher' ? (
          <div className="relative mt-4 flex flex-wrap gap-2">
            <button
              onClick={seedDemo}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-black transition ${
                demoActive
                  ? 'border border-white/15 text-slate-200 hover:border-white/35'
                  : 'animate-eis-pulse bg-[#ffc43b] text-[#061126] shadow-[0_0_22px_rgba(255,196,59,.35)] hover:bg-[#ffe08a]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {demoActive ? 'Re-seed demo data' : 'Load demo learning data'}
            </button>
            {events.length > 0 ? (
              <button
                onClick={clearDemo}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black text-slate-300 transition hover:border-[#ff3d22]/40 hover:text-[#ff8a73]"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Clear all imports + events
              </button>
            ) : null}
            <button
              onClick={() => setTeacherTab('upload')}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff]"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Upload a real report
            </button>
            <button
              onClick={() => setActiveTab('lesson')}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-[#ffc43b] hover:text-[#ffe08a]"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Open Lesson Player
            </button>
          </div>
        ) : null}
      </header>

      <PrivacyNotice />

      {mode === 'teacher' ? (
        <div className="space-y-4">
          <nav className="flex flex-wrap gap-2">
            {TEACHER_TABS.map((t) => {
              const Icon = t.icon;
              const active = teacherTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTeacherTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition ${
                    active
                      ? 'border-[#49c8ff] bg-[#49c8ff]/10 text-[#8ddfff]'
                      : 'border-white/15 text-slate-300 hover:border-white/35'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </nav>
          <section>
            {teacherTab === 'platforms' && (
              <ConnectedPlatforms
                connections={connections}
                imports={imports}
                events={events}
                onUpload={(p: ExternalPlatform) => { setTeacherTab('upload'); void p; }}
              />
            )}
            {teacherTab === 'upload' && (
              <UploadReports onImported={() => invalidate()} />
            )}
            {teacherTab === 'matching' && (
              <StudentMatching events={events} onMappingsApplied={() => invalidate()} />
            )}
            {teacherTab === 'events' && <LearningEventsTable events={events} />}
            {teacherTab === 'mastery' && <MasteryAnalytics events={events} />}
            {teacherTab === 'recommendations' && (
              <AIRecommendations events={events} mode="teacher" setActiveTab={setActiveTab} />
            )}
            {teacherTab === 'graph' && <StudentLearningGraph events={events} mode="teacher" />}
            {teacherTab === 'roadmap' && <PlatformIntegrationRoadmap />}
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <nav className="flex flex-wrap gap-2">
            {STUDENT_TABS.map((t) => {
              const Icon = t.icon;
              const active = studentTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setStudentTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition ${
                    active
                      ? 'border-[#49c8ff] bg-[#49c8ff]/10 text-[#8ddfff]'
                      : 'border-white/15 text-slate-300 hover:border-white/35'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </nav>
          {studentTab === 'my-graph' && (
            <StudentLearningGraph events={events.filter((e) => e.studentId === studentMockId)} mode="student" defaultStudentId={studentMockId} />
          )}
          {studentTab === 'my-recommendations' && (
            <AIRecommendations events={events.filter((e) => e.studentId === studentMockId)} mode="student" studentId={studentMockId} setActiveTab={setActiveTab} />
          )}
          {studentTab === 'my-mastery' && (
            <section className="rounded-lg border border-white/10 bg-[#050711]/70 p-4 text-sm leading-6 text-slate-200">
              <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">My mastery — quick view</p>
              <p className="mt-2">
                Open <span className="font-black text-white">My learning graph</span> for the full breakdown. The mastery
                engine uses your events from Kahoot, Blooket, Dr Frost, MyiMaths, NeuroQuest and EIS Maths Studio to
                compute your overall mastery, engagement, and the concepts that need the most work.
              </p>
              <p className="mt-2 text-[11px] text-slate-400">
                <ListChecks className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5 text-[#8ddfff]" />
                Student mode never shows other students&apos; data, raw imports, or roster mappings.
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
