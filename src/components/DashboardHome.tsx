import React from 'react';
import { BookOpen, CheckSquare, MonitorPlay, Mail, ArrowRight, Gamepad2, School } from 'lucide-react';
import { TabType } from './Sidebar';

interface DashboardHomeProps {
  setActiveTab: (tab: TabType) => void;
}

export function DashboardHome({ setActiveTab }: DashboardHomeProps) {
  const features = [
    {
      id: 'eis-maths',
      title: 'EIS Grade 8 Maths',
      description: 'Textbook-aligned maths lessons with 3D animated explanations, NeuroQuest practice, and online classroom delivery.',
      icon: School,
      color: 'bg-slate-900',
    },
    {
      id: 'lesson-planner',
      title: 'Lesson Planner',
      description: 'Generate comprehensive lesson plans from text, images, or URLs.',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      id: 'grader',
      title: 'Grader & Evaluator',
      description: 'Automatically grade student submissions based on your marking scheme.',
      icon: CheckSquare,
      color: 'bg-green-500',
    },
    {
      id: 'classroom',
      title: 'Virtual Classroom',
      description: 'Host 30-seat group video calls, monitor comments, and answer questions with AI voice.',
      icon: MonitorPlay,
      color: 'bg-purple-500',
    },
    {
      id: 'email',
      title: 'Email Assistant',
      description: 'Draft and send emails to students, parents, or faculty effortlessly.',
      icon: Mail,
      color: 'bg-orange-500',
    },
    {
      id: 'neuroquest',
      title: 'NeuroQuest Academy',
      description: 'Launch game-based learning activities and connect them to lesson planning, grading, and classroom workflows.',
      icon: Gamepad2,
      color: 'bg-cyan-500',
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Teacher!</h1>
        <p className="mt-2 text-gray-600">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div 
              key={feature.id}
              onClick={() => setActiveTab(feature.id as TabType)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-900">Built for EIS</h3>
        <p className="mt-2 text-indigo-700">
          Start with EIS Grade 8 Maths, save an active textbook lesson, teach it online with camera and screen share, then bring NeuroQuest evidence into planning, grading, and parent communication.
        </p>
      </div>
    </div>
  );
}
