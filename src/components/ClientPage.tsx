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

  const isDashboard = activeTab === 'dashboard';
  const isLesson = activeTab === 'lesson';
  const isUpload = activeTab === 'upload-studio';
  const isLearningHub = activeTab === 'learning-hub';
  const isEnglish = activeTab === 'english-studio';
  const isScience = activeTab === 'science-studio';
  const useDarkSurface = isDashboard || isLesson || isUpload || isLearningHub || isEnglish || isScience;

  return (
    <div className={`flex h-screen overflow-hidden ${useDarkSurface ? 'bg-[#050711]' : 'bg-[#f6f8fc]'}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
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
            {activeTab === 'dashboard' && <DashboardHome mode={mode} setMode={setMode} setActiveTab={setActiveTab} />}
            {activeTab === 'lesson' && <InteractiveLessonRenderer mode={mode} setActiveTab={setActiveTab} />}
            {activeTab === 'learning-hub' && <LearningDataHub mode={mode} setActiveTab={setActiveTab} />}
            {activeTab === 'eis-maths' && <EISMathStudio setActiveTab={setActiveTab} />}
            {activeTab === 'english-studio' && <EnglishStudio setActiveTab={setActiveTab} />}
            {activeTab === 'science-studio' && <ScienceStudio setActiveTab={setActiveTab} />}
            {activeTab === 'place-value-lesson' && <LessonGenerator setActiveTab={setActiveTab} />}
            {activeTab === 'upload-studio' && <TeacherUploadStudio setActiveTab={setActiveTab} />}
            {activeTab === 'lesson-planner' && <LessonPlanner />}
            {activeTab === 'grader' && <Grader />}
            {activeTab === 'classroom' && <VirtualClassroom setActiveTab={setActiveTab} />}
            {activeTab === 'email' && <EmailAssistant />}
            {activeTab === 'neuroquest' && <NeuroQuestHub setActiveTab={setActiveTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}
