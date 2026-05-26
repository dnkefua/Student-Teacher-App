'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Sidebar, TabType } from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import { DashboardHome } from '@/components/DashboardHome';
import { AuthProvider } from '@/lib/auth/authContext';
import type { LearningMode } from '@/lib/demoAssignments';

// Heavy or rarely-used routes are split into their own chunks so the
// initial bundle doesn't carry every studio. Each lazy import shows a
// small skeleton while its chunk downloads.

const SkeletonLoading = () => (
  <div className="flex h-64 items-center justify-center rounded-lg border border-white/10 bg-white/[.02]">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#49c8ff] border-t-transparent" />
  </div>
);

const InteractiveLessonRenderer = dynamic(
  () => import('@/components/InteractiveLessonRenderer').then((m) => ({ default: m.InteractiveLessonRenderer })),
  { loading: SkeletonLoading },
);
const LearningDataHub = dynamic(
  () => import('@/components/learningHub/LearningDataHub').then((m) => ({ default: m.LearningDataHub })),
  { loading: SkeletonLoading },
);
// Maths/English/Science legacy studios were retired once parity was reached
// with the new grade8-platform. The SubjectStudioShell renders that
// platform directly — no more dynamic imports of the old studios.
const LessonGenerator = dynamic(
  () => import('@/components/CinematicLessonEngine').then((m) => ({ default: m.LessonGenerator })),
  { loading: SkeletonLoading },
);
const CinematicStudio = dynamic(
  () => import('@/components/cinematic/CinematicStudio').then((m) => ({ default: m.CinematicStudio })),
  { loading: SkeletonLoading },
);
const TeacherUploadStudio = dynamic(
  () => import('@/components/TeacherUploadStudio').then((m) => ({ default: m.TeacherUploadStudio })),
  { loading: SkeletonLoading },
);
const VirtualClassroom = dynamic(
  () => import('@/components/VirtualClassroom').then((m) => ({ default: m.VirtualClassroom })),
  { loading: SkeletonLoading },
);
const LessonPlanner = dynamic(
  () => import('@/components/LessonPlanner').then((m) => ({ default: m.LessonPlanner })),
  { loading: SkeletonLoading },
);
const Grader = dynamic(
  () => import('@/components/Grader').then((m) => ({ default: m.Grader })),
  { loading: SkeletonLoading },
);
const TeacherCalendar = dynamic(
  () => import('@/components/TeacherCalendar').then((m) => ({ default: m.TeacherCalendar })),
  { loading: SkeletonLoading },
);
const EmailAssistant = dynamic(
  () => import('@/components/EmailAssistant').then((m) => ({ default: m.EmailAssistant })),
  { loading: SkeletonLoading },
);
const NeuroQuestHub = dynamic(
  () => import('@/components/NeuroQuestHub').then((m) => ({ default: m.NeuroQuestHub })),
  { loading: SkeletonLoading },
);
const SubjectStudioShell = dynamic(
  () => import('@/components/SubjectStudioShell').then((m) => ({ default: m.SubjectStudioShell })),
  { loading: SkeletonLoading },
);

const brandLogoSrc = '/eis-maths-studio-logo.png';
// Learning Hub is teacher-only because it contains class analytics, external
// data imports, and individual student performance evidence. Students stay
// inside subject lessons, assignments, cinematic lessons, NeuroQuest, and
// the virtual classroom — never the raw analytics hub.
const teacherOnlyTabs: TabType[] = [
  'learning-hub',
  'place-value-lesson',
  'cinematic-studio',
  'upload-studio',
  'lesson-planner',
  'grader',
  'email',
];

export function ClientPage() {
  return (
    <AuthProvider>
      <ClientPageInner />
    </AuthProvider>
  );
}

function ClientPageInner() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  // Role is the user's persistent identity (teacher / student) — separate
  // from `mode` which is the current view. Teachers can preview the
  // student view by flipping mode; students are locked to mode='student'
  // and never see teacher surfaces.
  //
  // IMPORTANT: don't read localStorage during render — it causes a
  // hydration mismatch (server emits 'teacher', client may emit
  // 'student'). Instead, start with 'teacher' on both sides and update
  // from localStorage AFTER mount via useEffect.
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [mode, setModeInternal] = useState<LearningMode>('teacher');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('eis-role');
      if (stored === 'student' || stored === 'teacher') {
        setRole(stored);
        setModeInternal(stored);
      }
      // Honour a one-shot landing-tab hint set by LandingPage when the
      // user clicked a session link (?session=...). Consumed immediately.
      const hint = window.localStorage.getItem('eis-initial-tab');
      if (hint) {
        window.localStorage.removeItem('eis-initial-tab');
        setActiveTab(hint as TabType);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Wrap setMode so students CANNOT escape to teacher mode even if a
  // child component tries to call setMode('teacher').
  const setMode = (next: LearningMode) => {
    if (role === 'student' && next !== 'student') return;
    setModeInternal(next);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem('eis.sidebar.collapsed');
    if (stored === '1') setIsSidebarCollapsed(true);
  }, []);
  React.useEffect(() => {
    window.localStorage.setItem('eis.sidebar.collapsed', isSidebarCollapsed ? '1' : '0');
  }, [isSidebarCollapsed]);

  const effectiveActiveTab = mode === 'student' && teacherOnlyTabs.includes(activeTab) ? 'dashboard' : activeTab;
  const selectTab = (tab: TabType) => {
    setActiveTab(mode === 'student' && teacherOnlyTabs.includes(tab) ? 'dashboard' : tab);
  };

  const isDashboard = effectiveActiveTab === 'dashboard';
  const isLesson = effectiveActiveTab === 'lesson';
  const isUpload = effectiveActiveTab === 'upload-studio';
  const isLearningHub = effectiveActiveTab === 'learning-hub';
  const isEnglish = effectiveActiveTab === 'english-studio';
  const isScience = effectiveActiveTab === 'science-studio';
  const isMaths = effectiveActiveTab === 'eis-maths';
  const isCinematic = effectiveActiveTab === 'cinematic-studio';
  const isSubjectStudio = isMaths || isEnglish || isScience;
  const useDarkSurface = isDashboard || isLesson || isUpload || isLearningHub || isCinematic;

  return (
    <div className={`flex h-dvh overflow-hidden ${useDarkSurface ? 'bg-[#050711]' : 'bg-[#f6f8fc]'}`}>
      <Sidebar
        activeTab={effectiveActiveTab}
        setActiveTab={selectTab}
        mode={mode}
        setMode={setMode}
        role={role}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#18345f] bg-[#050711] px-4 md:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <Image src={brandLogoSrc} alt="EIS Learning Studio logo" width={40} height={40} className="h-10 w-10 rounded-md object-contain" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-wide text-white">EIS Learning Studio</p>
              <p className="truncate text-xs font-semibold capitalize text-[#8ddfff]">{mode} workspace</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md p-2 text-[#8ddfff] hover:bg-white/10 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 ${useDarkSurface ? 'bg-[#050711]' : ''}`}>
          <div className={`${isSubjectStudio ? 'max-w-none' : 'max-w-6xl'} mx-auto h-full`}>
            {effectiveActiveTab === 'dashboard' && <DashboardHome mode={mode} setMode={setMode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'lesson' && <InteractiveLessonRenderer mode={mode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'learning-hub' && mode === 'teacher' && <LearningDataHub mode={mode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'eis-maths' && (
              <SubjectStudioShell subject="math" label="Grade 8 Maths" mode={mode} />
            )}
            {effectiveActiveTab === 'english-studio' && (
              <SubjectStudioShell subject="english" label="Year 8 English" mode={mode} />
            )}
            {effectiveActiveTab === 'science-studio' && (
              <SubjectStudioShell subject="science" label="Year 8 Science" mode={mode} />
            )}
            {effectiveActiveTab === 'place-value-lesson' && mode === 'teacher' && <LessonGenerator setActiveTab={selectTab} />}
            {effectiveActiveTab === 'cinematic-studio' && mode === 'teacher' && <CinematicStudio mode={mode} />}
            {effectiveActiveTab === 'upload-studio' && mode === 'teacher' && <TeacherUploadStudio setActiveTab={selectTab} />}
            {effectiveActiveTab === 'lesson-planner' && mode === 'teacher' && <LessonPlanner />}
            {effectiveActiveTab === 'grader' && mode === 'teacher' && <Grader />}
            {effectiveActiveTab === 'classroom' && <VirtualClassroom setActiveTab={selectTab} mode={mode} />}
            {effectiveActiveTab === 'teacher-calendar' && mode === 'teacher' && (
              <TeacherCalendar setActiveTab={selectTab} />
            )}
            {effectiveActiveTab === 'email' && mode === 'teacher' && <EmailAssistant />}
            {effectiveActiveTab === 'neuroquest' && <NeuroQuestHub setActiveTab={selectTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}
