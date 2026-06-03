'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/overview/OverviewView';
import { LessonView } from './components/lessons/LessonView';
import { LearnView } from './components/learn/LearnView';
import { PracticeView } from './components/practice/PracticeView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { AssetsView } from './components/assets/AssetsView';
import { GLExamView } from './components/exam/GLExamView';
import { NGRTFinalExam } from './components/exam/NGRTFinalExam';
import { AssignmentManager } from './components/assignments/AssignmentManager';
import { SubmissionsView } from './components/submissions/SubmissionsView';
import { FloatingTools } from './components/FloatingTools';
import { TabType, UnitId, SubjectId } from './types';
import { Menu } from 'lucide-react';

export default function App({
  initialSubject = 'math',
  initialTab = 'overview',
  mode = 'teacher',
  studentId,
}: {
  initialSubject?: SubjectId;
  /** Initial tab to land on — useful when entering from the student home. */
  initialTab?: TabType;
  /** Drives the Assignments tab: teachers create, students complete. */
  mode?: 'teacher' | 'student';
  /** Stable id for the student so their submissions persist across reloads. */
  studentId?: string;
}) {
  const [currentSubject, setCurrentSubject] = useState<SubjectId>(initialSubject);
  const [currentUnit, setCurrentUnit] = useState<UnitId>('unit1');
  const [currentTab, setCurrentTab] = useState<TabType>(initialTab);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative flex h-full min-h-[680px] overflow-hidden bg-slate-50 font-sans">
      <Sidebar 
        currentSubject={currentSubject} setSubject={setCurrentSubject}
        currentUnit={currentUnit} setUnit={setCurrentUnit} 
        currentTab={currentTab} setTab={setCurrentTab}
        isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className="flex-1 overflow-y-auto w-full flex flex-col pb-20 relative">
        <header className="md:hidden flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentSubject === 'math' ? 'bg-cyan-500' : currentSubject === 'science' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider capitalize">
              {currentSubject === 'math' ? 'Maths' : currentSubject} · {currentUnit.replace('unit', 'Unit ')}
            </span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white rounded shadow-sm hover:bg-slate-800 transition"
          >
            Topics Menu
          </button>
        </header>

        <div className="p-4 md:p-8 lg:p-12 flex-1 flex flex-col min-h-0">
          {currentTab === 'overview' && <OverviewView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'learn' && <LearnView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'lesson' && <LessonView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'practice' && <PracticeView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'assessment' && <AssessmentView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'assets' && <AssetsView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'exam' && currentSubject === 'english' && <NGRTFinalExam />}
          {currentTab === 'exam' && currentSubject !== 'english' && <GLExamView unit={currentUnit} subject={currentSubject} />}
          {currentTab === 'assignments' && (
            <AssignmentManager mode={mode} subject={currentSubject} studentId={studentId} />
          )}
          {currentTab === 'submissions' && (
            <SubmissionsView mode={mode} subject={currentSubject} />
          )}
        </div>
      </main>

      <FloatingTools />
    </div>
  );
}
