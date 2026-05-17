'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
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
const EISMathStudio = dynamic(
  () => import('@/components/EISMathStudio').then((m) => ({ default: m.EISMathStudio })),
  { loading: SkeletonLoading },
);
const EnglishStudio = dynamic(
  () => import('@/components/english/EnglishStudio').then((m) => ({ default: m.EnglishStudio })),
  { loading: SkeletonLoading },
);
const ScienceStudio = dynamic(
  () => import('@/components/science/ScienceStudio').then((m) => ({ default: m.ScienceStudio })),
  { loading: SkeletonLoading },
);
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
const EmailAssistant = dynamic(
  () => import('@/components/EmailAssistant').then((m) => ({ default: m.EmailAssistant })),
  { loading: SkeletonLoading },
);
const NeuroQuestHub = dynamic(
  () => import('@/components/NeuroQuestHub').then((m) => ({ default: m.NeuroQuestHub })),
  { loading: SkeletonLoading },
);

const brandLogoSrc = '/eis-maths-studio-logo.png';
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
  const [mode, setMode] = useState<LearningMode>('teacher');
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
  const isCinematic = effectiveActiveTab === 'cinematic-studio';
  const useDarkSurface = isDashboard || isLesson || isUpload || isLearningHub || isEnglish || isScience || isCinematic;

  return (
    <div className={`flex h-screen overflow-hidden ${useDarkSurface ? 'bg-[#050711]' : 'bg-[#f6f8fc]'}`}>
      <Sidebar
        activeTab={effectiveActiveTab}
        setActiveTab={selectTab}
        mode={mode}
        setMode={setMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#18345f] bg-[#050711] px-4 md:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <Image src={brandLogoSrc} alt="EIS Maths Studio logo" width={40} height={40} className="h-10 w-10 rounded-md object-contain" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-wide text-white">EIS Maths Studio</p>
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
          <div className="max-w-6xl mx-auto h-full">
            {effectiveActiveTab === 'dashboard' && <DashboardHome mode={mode} setMode={setMode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'lesson' && <InteractiveLessonRenderer mode={mode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'learning-hub' && mode === 'teacher' && <LearningDataHub mode={mode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'eis-maths' && <EISMathStudio setActiveTab={selectTab} />}
            {effectiveActiveTab === 'english-studio' && <EnglishStudio mode={mode} setActiveTab={selectTab} />}
            {effectiveActiveTab === 'science-studio' && <ScienceStudio setActiveTab={selectTab} />}
            {effectiveActiveTab === 'place-value-lesson' && mode === 'teacher' && <LessonGenerator setActiveTab={selectTab} />}
            {effectiveActiveTab === 'cinematic-studio' && mode === 'teacher' && <CinematicStudio mode={mode} />}
            {effectiveActiveTab === 'upload-studio' && mode === 'teacher' && <TeacherUploadStudio setActiveTab={selectTab} />}
            {effectiveActiveTab === 'lesson-planner' && mode === 'teacher' && <LessonPlanner />}
            {effectiveActiveTab === 'grader' && mode === 'teacher' && <Grader />}
            {effectiveActiveTab === 'classroom' && <VirtualClassroom setActiveTab={selectTab} />}
            {effectiveActiveTab === 'email' && mode === 'teacher' && <EmailAssistant />}
            {effectiveActiveTab === 'neuroquest' && <NeuroQuestHub setActiveTab={selectTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}
