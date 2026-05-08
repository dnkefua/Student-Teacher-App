'use client';

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

export function ClientPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <span>EduQuest AI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === 'dashboard' && <DashboardHome setActiveTab={setActiveTab} />}
            {activeTab === 'eis-maths' && <EISMathStudio setActiveTab={setActiveTab} />}
            {activeTab === 'lesson-planner' && <LessonPlanner />}
            {activeTab === 'grader' && <Grader />}
            {activeTab === 'classroom' && <VirtualClassroom />}
            {activeTab === 'email' && <EmailAssistant />}
            {activeTab === 'neuroquest' && <NeuroQuestHub setActiveTab={setActiveTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}
