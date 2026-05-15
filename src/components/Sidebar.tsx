import React from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  MonitorPlay, 
  Mail,
  Gamepad2,
  Gem,
  School,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LearningMode } from '@/lib/demoAssignments';

const brandLogoSrc = '/eis-maths-studio-logo.png';

export type TabType = 'dashboard' | 'eis-maths' | 'place-value-lesson' | 'lesson-planner' | 'grader' | 'classroom' | 'email' | 'neuroquest';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, mode, setMode, isOpen, setIsOpen }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eis-maths', label: 'EIS Grade 8 Maths', icon: School },
    { id: 'place-value-lesson', label: 'AI 3D Lesson Generator', icon: Gem },
    { id: 'lesson-planner', label: 'Lesson Planner', icon: BookOpen },
    { id: 'grader', label: 'Grader & Evaluator', icon: CheckSquare },
    { id: 'classroom', label: 'Virtual Classroom', icon: MonitorPlay },
    { id: 'email', label: 'Email Assistant', icon: Mail },
    { id: 'neuroquest', label: 'NeuroQuest Academy', icon: Gamepad2 },
  ] as const;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#18345f] bg-[#050711] text-white shadow-2xl shadow-[#061126]/30 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-[#49c8ff]/25 bg-[#071126] shadow-[0_0_28px_rgba(73,200,255,.18)]">
              <Image src={brandLogoSrc} alt="EIS Maths Studio logo" width={44} height={44} className="h-11 w-11 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-wide text-white">EIS Maths Studio</p>
              <p className="truncate text-xs font-semibold text-[#8ddfff]">Student Teacher App</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-2">
            <p className="mb-2 px-2 text-xs font-black uppercase tracking-wide text-slate-400">View mode</p>
            <div className="grid grid-cols-2 gap-1">
              {(['teacher', 'student'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setMode(item);
                    setActiveTab('dashboard');
                    setIsOpen(false);
                  }}
                  className={cn(
                    'rounded-md px-2 py-2 text-xs font-black capitalize transition',
                    mode === item ? 'bg-[#49c8ff] text-[#061126]' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
                  isActive 
                    ? "bg-[#ffc43b] text-[#061126] shadow-[0_0_28px_rgba(255,196,59,.16)]" 
                    : "text-slate-300 hover:bg-[#0d1e43] hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-[#061126]" : "text-[#8ddfff]")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#49c8ff] font-black text-[#061126]">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Teacher Profile</span>
              <span className="text-xs capitalize text-slate-400">{mode} workspace</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
