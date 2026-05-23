import React, { useState, useEffect } from 'react';
import { TabType, UnitId, SubjectId } from '../types';
import { BookOpen, Target, PenTool, CheckSquare, GraduationCap, ChevronDown, Menu, BookText, Calculator, FlaskConical } from 'lucide-react';

interface SidebarProps {
  currentSubject: SubjectId;
  setSubject: (subject: SubjectId) => void;
  currentUnit: UnitId;
  setUnit: (unit: UnitId) => void;
  currentTab: TabType;
  setTab: (tab: TabType) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

// ── Inline unit navigation ────────────────────────────────────────────
// Each unit button reveals its module list (Overview, Core Concepts, etc.)
// directly underneath when active, so the student no longer has to scroll
// past every other chapter to reach the navigation for the unit they just
// selected.
type UnitMeta = {
  id: UnitId;
  label: string;
  /** Tailwind text color class used for the small "UNIT N" badge label. */
  accentText: string;
  /** Tailwind classes used to highlight the active nav-item under this unit. */
  activeTabBg: string;
  activeTabText: string;
};

const ENGLISH_UNITS: UnitMeta[] = [
  { id: 'unit1', label: 'Advertising & Persuasion', accentText: 'text-amber-400',   activeTabBg: 'bg-amber-500/10',   activeTabText: 'text-amber-400'   },
  { id: 'unit2', label: 'The Novel',                accentText: 'text-rose-400',    activeTabBg: 'bg-rose-500/10',    activeTabText: 'text-rose-400'    },
  { id: 'unit3', label: 'Voices in Verse',          accentText: 'text-fuchsia-400', activeTabBg: 'bg-fuchsia-500/10', activeTabText: 'text-fuchsia-400' },
  { id: 'unit4', label: 'Language & Film',          accentText: 'text-amber-400',   activeTabBg: 'bg-amber-500/10',   activeTabText: 'text-amber-400'   },
  { id: 'unit5', label: 'Shakespeare',              accentText: 'text-indigo-400',  activeTabBg: 'bg-indigo-500/10',  activeTabText: 'text-indigo-400'  },
];

const SCIENCE_UNITS: UnitMeta[] = [
  { id: 'unit1', label: 'Who are we?',                accentText: 'text-emerald-400', activeTabBg: 'bg-emerald-500/10', activeTabText: 'text-emerald-400' },
  { id: 'unit2', label: 'How do we map matter?',      accentText: 'text-teal-400',    activeTabBg: 'bg-teal-500/10',    activeTabText: 'text-teal-400'    },
  { id: 'unit3', label: 'Ecology',                    accentText: 'text-green-400',   activeTabBg: 'bg-green-500/10',   activeTabText: 'text-green-400'   },
  { id: 'unit4', label: 'Energy & Future',            accentText: 'text-cyan-400',    activeTabBg: 'bg-cyan-500/10',    activeTabText: 'text-cyan-400'    },
  { id: 'unit5', label: 'What does a wave tell us',   accentText: 'text-blue-400',    activeTabBg: 'bg-blue-500/10',    activeTabText: 'text-blue-400'    },
  { id: 'unit6', label: 'Photosynthesis',             accentText: 'text-lime-400',    activeTabBg: 'bg-lime-500/10',    activeTabText: 'text-lime-400'    },
];

const MATH_UNITS: UnitMeta[] = [
  { id: 'unit1', label: 'Numerical & Abstract',  accentText: 'text-cyan-400',    activeTabBg: 'bg-cyan-500/10',    activeTabText: 'text-cyan-400'    },
  { id: 'unit2', label: 'Thinking with Models',  accentText: 'text-violet-400',  activeTabBg: 'bg-violet-500/10',  activeTabText: 'text-violet-400'  },
  { id: 'unit3', label: 'Spatial Reasoning',     accentText: 'text-emerald-400', activeTabBg: 'bg-emerald-500/10', activeTabText: 'text-emerald-400' },
  { id: 'unit4', label: 'Reasoning with Data',   accentText: 'text-amber-400',   activeTabBg: 'bg-amber-500/10',   activeTabText: 'text-amber-400'   },
];

function unitsFor(subject: SubjectId): UnitMeta[] {
  if (subject === 'english') return ENGLISH_UNITS;
  if (subject === 'science') return SCIENCE_UNITS;
  return MATH_UNITS;
}

function UnitListWithInlineNav({
  subject,
  currentUnit,
  currentTab,
  setUnit,
  setTab,
  navItems,
}: {
  subject: SubjectId;
  currentUnit: UnitId;
  currentTab: TabType;
  setUnit: (u: UnitId) => void;
  setTab: (t: TabType) => void;
  navItems: { id: TabType; label: string; icon: React.ReactNode }[];
}) {
  const units = unitsFor(subject);
  return (
    <div className="space-y-2">
      {units.map((u, idx) => {
        const isActive = currentUnit === u.id;
        return (
          <div key={u.id}>
            <button
              onClick={() => {
                setUnit(u.id);
                setTab('overview');
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border ${
                isActive
                  ? 'bg-slate-800/80 border-slate-700 text-white'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-left">
                <div className={`text-xs font-bold mb-0.5 ${u.accentText}`}>
                  UNIT {idx + 1}
                </div>
                <div className="font-semibold text-sm">{u.label}</div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${isActive ? 'rotate-180' : ''}`}
              />
            </button>

            {isActive && (
              <nav className="mt-1 mb-2 ml-3 pl-3 border-l-2 border-slate-700/40 space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 mt-1">
                  Modules
                </p>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      currentTab === item.id
                        ? `${u.activeTabBg} ${u.activeTabText}`
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Sidebar({ currentSubject, setSubject, currentUnit, setUnit, currentTab, setTab, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      let totalQuestions = 5;
      if (currentSubject === 'math') totalQuestions = 68;
      if (currentSubject === 'science') totalQuestions = 30; // 6 units * 5 Qs
      
      let completed = 0;
      ['unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6'].forEach(unit => {
        const str = localStorage.getItem(`practice_completed_${currentSubject}_${unit}`);
        if(str) {
          const arr = JSON.parse(str);
          completed += arr.length;
        }
      });
      setGlobalProgress(Math.round((completed / totalQuestions) * 100));
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 2000);
    return () => clearInterval(interval);
  }, [currentSubject]);

  // Rest of the getNavItems logic...

  const getNavItems = () => {
    if (currentSubject === 'english') {
      return [
        { id: 'overview' as TabType, label: 'Unit Overview', icon: <Target className="w-5 h-5" /> },
        { id: 'lesson' as TabType, label: currentUnit === 'unit1' ? '1.2 Core Topics & Exercises' : currentUnit === 'unit2' ? '2.2 Core Topics & Exercises' : currentUnit === 'unit3' ? '3.2 Core Topics & Exercises' : currentUnit === 'unit4' ? '4.2 Core Topics & Exercises' : '5.2 Core Topics & Exercises', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'practice' as TabType, label: 'Practice & Analysis', icon: <PenTool className="w-5 h-5" /> },
        { id: 'assessment' as TabType, label: 'Assessment Framework', icon: <CheckSquare className="w-5 h-5" /> },
        { id: 'assets' as TabType, label: 'Learning Assets', icon: <BookText className="w-5 h-5" /> },
      ];
    }

    if (currentSubject === 'science') {
      const getLessonTitle = () => {
        switch (currentUnit) {
          case 'unit1': return '1.2 Step-by-Step Problems';
          case 'unit2': return '2.2 Step-by-Step Problems';
          case 'unit3': return '3.2 Step-by-Step Problems';
          case 'unit4': return '4.2 Step-by-Step Problems';
          case 'unit5': return '5.2 Step-by-Step Problems';
          case 'unit6': return '6.2 Step-by-Step Problems';
          default: return 'Core Topics & Exercises';
        }
      };

      return [
        { id: 'overview' as TabType, label: 'Unit Overview', icon: <Target className="w-5 h-5" /> },
        { id: 'learn' as TabType, label: 'Core Concepts', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'lesson' as TabType, label: getLessonTitle(), icon: <Calculator className="w-5 h-5" /> },
        { id: 'practice' as TabType, label: 'Practice & Analysis', icon: <PenTool className="w-5 h-5" /> },
        { id: 'assessment' as TabType, label: 'Assessment Framework', icon: <CheckSquare className="w-5 h-5" /> },
        { id: 'assets' as TabType, label: 'Learning Assets', icon: <BookText className="w-5 h-5" /> },
      ];
    }

    switch (currentUnit) {
      case 'unit1':
        return [
          { id: 'overview' as TabType, label: 'Unit Overview', icon: <Target className="w-5 h-5" /> },
          { id: 'lesson' as TabType, label: '1.1 Proportions & %', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'practice' as TabType, label: 'Practice (10 Qs)', icon: <PenTool className="w-5 h-5" /> },
          { id: 'assessment' as TabType, label: 'Assessment', icon: <CheckSquare className="w-5 h-5" /> },
          { id: 'exam' as TabType, label: 'GL Exams', icon: <PenTool className="w-5 h-5" /> },
        ];
      case 'unit2':
        return [
          { id: 'overview' as TabType, label: 'Unit Overview', icon: <Target className="w-5 h-5" /> },
          { id: 'lesson' as TabType, label: '2.1 & 2.2 Models', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'practice' as TabType, label: 'Practice (18 Qs)', icon: <PenTool className="w-5 h-5" /> },
          { id: 'assessment' as TabType, label: 'Assessment', icon: <CheckSquare className="w-5 h-5" /> },
          { id: 'exam' as TabType, label: 'GL Exams', icon: <PenTool className="w-5 h-5" /> },
        ];
      case 'unit3':
        return [
          { id: 'overview' as TabType, label: 'Unit Overview', icon: <Target className="w-5 h-5" /> },
          { id: 'lesson' as TabType, label: '3.1 & 3.2 Spatial', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'practice' as TabType, label: 'Practice (20 Qs)', icon: <PenTool className="w-5 h-5" /> },
          { id: 'assessment' as TabType, label: 'Assessment', icon: <CheckSquare className="w-5 h-5" /> },
          { id: 'exam' as TabType, label: 'GL Exams', icon: <PenTool className="w-5 h-5" /> },
        ];
      case 'unit4':
        return [
          { id: 'overview' as TabType, label: 'Unit Overview', icon: <Target className="w-5 h-5" /> },
          { id: 'lesson' as TabType, label: '4.1 & 4.2 Data', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'practice' as TabType, label: 'Practice (20 Qs)', icon: <PenTool className="w-5 h-5" /> },
          { id: 'assessment' as TabType, label: 'Assessment', icon: <CheckSquare className="w-5 h-5" /> },
          { id: 'exam' as TabType, label: 'GL Exams', icon: <PenTool className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  // Always append the Assignments tab to whichever per-subject nav list
  // was returned, so teachers and students can reach it from anywhere.
  const navItems = [
    ...getNavItems(),
    { id: 'assignments' as TabType, label: 'Assignments', icon: <GraduationCap className="w-5 h-5" /> },
  ];
  
  const getThemeColor = () => {
    switch (currentUnit) {
      case 'unit1': return 'cyan';
      case 'unit2': return 'violet';
      case 'unit3': return 'emerald';
      case 'unit4': return 'amber';
      case 'unit5': return 'indigo';
      case 'unit6': return 'lime';
      default: return 'cyan';
    }
  };
  
  const theme = getThemeColor();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        w-60 md:w-60 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col h-full shrink-0
      `}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2.5 h-16 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-1.5 rounded bg-slate-800 text-cyan-400">
              {currentSubject === 'math' ? <Calculator className="w-4 h-4 text-cyan-400" /> : currentSubject === 'science' ? <FlaskConical className="w-4 h-4 text-emerald-400" /> : <BookText className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm tracking-wide capitalize text-white">{currentSubject === 'math' ? 'Maths' : currentSubject === 'science' ? 'Science' : 'English'}</h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Workspace navigator</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <UnitListWithInlineNav
          subject={currentSubject}
          currentUnit={currentUnit}
          currentTab={currentTab}
          setUnit={setUnit}
          setTab={setTab}
          navItems={navItems}
        />

      </div>

      {true && (
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-300 font-medium">Practice Progress</p>
            <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${globalProgress}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right">
              {globalProgress}% Complete
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
