import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  MonitorPlay, 
  Mail,
  Gamepad2,
  School,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'dashboard' | 'eis-maths' | 'lesson-planner' | 'grader' | 'classroom' | 'email' | 'neuroquest';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eis-maths', label: 'EIS Grade 8 Maths', icon: School },
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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <BookOpen className="w-6 h-6" />
            <span>EduQuest AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-700" : "text-gray-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Teacher Profile</span>
              <span className="text-xs text-gray-500">Settings</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
