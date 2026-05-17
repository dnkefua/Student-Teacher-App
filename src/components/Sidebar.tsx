import React from 'react';
import Image from 'next/image';
import {
  BookOpen,
  CheckSquare,
  Database,
  MonitorPlay,
  Mail,
  Beaker,
  Clapperboard,
  Feather,
  Gamepad2,
  Gem,
  GraduationCap,
  LayoutDashboard,
  School,
  UploadCloud,
  UserCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LearningMode } from '@/lib/demoAssignments';

const brandLogoSrc = '/eis-maths-studio-logo.png';

export type TabType =
  | 'dashboard'
  | 'lesson'
  | 'learning-hub'
  | 'eis-maths'
  | 'english-studio'
  | 'science-studio'
  | 'place-value-lesson'
  | 'cinematic-studio'
  | 'upload-studio'
  | 'lesson-planner'
  | 'grader'
  | 'classroom'
  | 'email'
  | 'neuroquest';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navGroups = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'learning-hub', label: 'Learning Hub', icon: Database },
    ],
  },
  {
    label: 'Subjects',
    items: [
      { id: 'eis-maths', label: 'Grade 8 Maths', icon: School },
      { id: 'english-studio', label: 'Year 8 English', icon: Feather },
      { id: 'science-studio', label: 'Year 8 Science', icon: Beaker },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { id: 'place-value-lesson', label: 'AI Lesson Generator', icon: Gem },
      { id: 'cinematic-studio', label: 'Cinematic Studio', icon: Clapperboard },
      { id: 'upload-studio', label: 'Upload Studio', icon: UploadCloud },
      { id: 'lesson-planner', label: 'Lesson Planner', icon: BookOpen },
      { id: 'grader', label: 'Grader', icon: CheckSquare },
      { id: 'email', label: 'Email Assistant', icon: Mail },
    ],
  },
  {
    label: 'Live & Practice',
    items: [
      { id: 'classroom', label: 'Virtual Classroom', icon: MonitorPlay },
      { id: 'lesson', label: 'Lesson Player', icon: GraduationCap },
      { id: 'neuroquest', label: 'NeuroQuest', icon: Gamepad2 },
    ],
  },
] as const;

const teacherOnlyTabs: TabType[] = [
  'learning-hub',
  'place-value-lesson',
  'cinematic-studio',
  'upload-studio',
  'lesson-planner',
  'grader',
  'email',
];

export function Sidebar({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-[#18345f] bg-[#050711] text-white shadow-2xl transition-transform duration-200 ease-in-out md:static md:h-screen md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-md border border-[#49c8ff]/25 bg-[#071126]">
              <Image
                src={brandLogoSrc}
                alt="EIS logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-wide text-white">
                EIS Studio
              </p>
              <p className="truncate text-[10px] font-semibold text-[#8ddfff]">Grade 8 · MYP</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {navGroups.map((group, gi) => {
            const visibleItems = group.items.filter((item) => mode === 'teacher' || !teacherOnlyTabs.includes(item.id as TabType));
            if (visibleItems.length === 0) return null;
            return (
            <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
              <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as TabType);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-[#ffc43b] text-[#061126]'
                          : 'text-slate-300 hover:bg-[#0d1e43] hover:text-white',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isActive ? 'text-[#061126]' : 'text-[#8ddfff]',
                        )}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )})}
        </nav>

        {/* Footer: role toggle + profile */}
        <div className="border-t border-white/10 p-3">
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-md border border-white/10 bg-[#050711]/70 p-1">
            {(['teacher', 'student'] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setMode(item);
                  setActiveTab('dashboard');
                  setIsOpen(false);
                }}
                className={cn(
                  'rounded px-2 py-1.5 text-xs font-black capitalize transition',
                  mode === item
                    ? 'bg-[#49c8ff] text-[#061126] shadow-[0_0_16px_rgba(73,200,255,.3)]'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-1">
            <UserCircle className="h-5 w-5 shrink-0 text-[#49c8ff]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                {mode === 'teacher' ? 'Teacher' : 'Student'}
              </p>
              <p className="truncate text-[10px] text-slate-500">EIS Grade 8</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
