import React from 'react';
import Image from 'next/image';
import {
  BookOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
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
  /** Persistent identity. Students never see the teacher↔student toggle. */
  role?: 'teacher' | 'student';
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (next: boolean) => void;
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
  role = 'teacher',
  isOpen,
  setIsOpen,
  isCollapsed = false,
  setIsCollapsed,
}: SidebarProps) {
  // On mobile the sidebar is a drawer — collapse only applies on desktop.
  const collapsed = isCollapsed && !isOpen;

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
          'fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-[#18345f] bg-[#050711] text-white shadow-2xl transition-[width,transform] duration-200 ease-in-out md:static md:h-screen md:translate-x-0',
          collapsed && 'md:w-14',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className={cn('flex h-14 items-center justify-between border-b border-white/10', collapsed ? 'px-2' : 'px-4')}>
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-md border border-[#49c8ff]/25 bg-[#071126]">
              <Image
                src={brandLogoSrc}
                alt="EIS Learning Studio logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-wide text-white">
                  EIS Learning Studio
                </p>
                <p className="truncate text-[10px] font-semibold text-[#8ddfff]">Grade 8 · MYP</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                'hidden rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white md:block',
                collapsed && 'ml-0',
              )}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 overflow-y-auto py-3', collapsed ? 'px-1' : 'px-2')}>
          {navGroups.map((group, gi) => {
            const visibleItems = group.items.filter((item) => mode === 'teacher' || !teacherOnlyTabs.includes(item.id as TabType));
            if (visibleItems.length === 0) return null;
            return (
            <div key={group.label} className={gi > 0 ? (collapsed ? 'mt-3 border-t border-white/5 pt-3' : 'mt-5') : ''}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>
              )}
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
                      title={collapsed ? item.label : undefined}
                      aria-label={item.label}
                      className={cn(
                        'flex w-full items-center rounded-md text-sm font-semibold transition-colors',
                        collapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2',
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
                      {!collapsed && item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )})}
        </nav>

        {/* Footer: role toggle + profile.
            Students are LOCKED to student view — only teachers see the
            teacher↔student toggle (so they can preview the student UI). */}
        <div className={cn('border-t border-white/10', collapsed ? 'p-2' : 'p-3')}>
          {role === 'teacher' && (
          <div
            className={cn(
              'mb-3 gap-1 rounded-md border border-white/10 bg-[#050711]/70 p-1',
              collapsed ? 'grid grid-cols-1' : 'grid grid-cols-2',
            )}
          >
            {(['teacher', 'student'] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setMode(item);
                  setActiveTab('dashboard');
                  setIsOpen(false);
                }}
                title={collapsed ? item : undefined}
                aria-label={item}
                className={cn(
                  'rounded text-xs font-black capitalize transition',
                  collapsed ? 'px-1 py-1.5' : 'px-2 py-1.5',
                  mode === item
                    ? 'bg-[#49c8ff] text-[#061126] shadow-[0_0_16px_rgba(73,200,255,.3)]'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                {collapsed ? item[0].toUpperCase() : item}
              </button>
            ))}
          </div>
          )}
          <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'px-1')}>
            <UserCircle className="h-5 w-5 shrink-0 text-[#49c8ff]" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">
                  {mode === 'teacher' ? 'Teacher' : 'Student'}
                </p>
                <p className="truncate text-[10px] text-slate-500">EIS Grade 8</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
