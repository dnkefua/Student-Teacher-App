'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Sidebar, TabType } from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import { DashboardHome } from '@/components/DashboardHome';
import { LessonPlanner } from '@/components/LessonPlanner';
import { Grader } from '@/components/Grader';
import { VirtualClassroom } from '@/components/VirtualClassroom';
import { EmailAssistant } from '@/components/EmailAssistant';
import { NeuroQuestHub } from '@/components/NeuroQuestHub';
import { EISMathStudio } from '@/components/EISMathStudio';
import { EnglishStudio } from '@/components/english/EnglishStudio';
import { ScienceStudio } from '@/components/science/ScienceStudio';
import { LessonGenerator } from '@/components/CinematicLessonEngine';
import { InteractiveLessonRenderer } from '@/components/InteractiveLessonRenderer';
import { TeacherUploadStudio } from '@/components/TeacherUploadStudio';
import { LearningDataHub } from '@/components/learningHub/LearningDataHub';
import type { LearningMode } from '@/lib/demoAssignments';

const brandLogoSrc = '/eis-maths-studio-logo.png';

export function ClientPage() {
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
            {activeTab === 'upload-studio' && <TeacherUploadStudio />}
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
