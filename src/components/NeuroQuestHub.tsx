import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  CheckSquare,
  Copy,
  ExternalLink,
  Gamepad2,
  Gauge,
  GraduationCap,
  Keyboard,
  Mail,
  MonitorPlay,
  Puzzle,
  Route,
  Search,
  Timer,
  Users,
} from 'lucide-react';
import { TabType } from './Sidebar';
import {
  NeuroQuestAssignment,
  buildQuestRubric,
  createDefaultAssignment,
  getNeuroQuestGame,
  loadActiveAssignment,
  neuroQuestGames,
  saveActiveAssignment,
} from '@/lib/neuroquest';

interface NeuroQuestHubProps {
  setActiveTab: (tab: TabType) => void;
}

const iconBySlug = {
  'math-racer-3d': Gauge,
  'maze-pursuit-3d': Route,
  lightbot: BrainCircuit,
  'math-runner': Timer,
  'memory-match': Puzzle,
  'typing-hero': Keyboard,
  'word-search': Search,
} as const;

const colorByTone = {
  amber: 'bg-amber-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
} as const;

const roster = [
  { name: 'Alice M.', progress: 92, score: 1840, status: 'Mastered' },
  { name: 'Bob K.', progress: 74, score: 1260, status: 'Practicing' },
  { name: 'Diana R.', progress: 86, score: 1510, status: 'Ready' },
  { name: 'Charlie S.', progress: 58, score: 940, status: 'Needs support' },
];

export function NeuroQuestHub({ setActiveTab }: NeuroQuestHubProps) {
  const [assignment, setAssignment] = useState<NeuroQuestAssignment>(() => loadActiveAssignment() ?? createDefaultAssignment(neuroQuestGames[0].slug));
  const [selectedSlug, setSelectedSlug] = useState(() => loadActiveAssignment()?.gameSlug ?? neuroQuestGames[0].slug);
  const [copied, setCopied] = useState(false);

  const selectedGame = useMemo(() => getNeuroQuestGame(selectedSlug), [selectedSlug]);
  const GameIcon = iconBySlug[selectedGame.slug as keyof typeof iconBySlug] ?? Gamepad2;
  const launchUrl = typeof window === 'undefined' ? selectedGame.href : `${window.location.origin}${selectedGame.href}`;

  const selectGame = (slug: string) => {
    setSelectedSlug(slug);
    setAssignment(createDefaultAssignment(slug));
    setCopied(false);
  };

  const saveAssignment = () => {
    const next = {
      ...assignment,
      gameSlug: selectedSlug,
      createdAt: assignment.createdAt || new Date().toISOString(),
    };
    setAssignment(next);
    saveActiveAssignment(next);
  };

  const copyLaunchLink = async () => {
    await navigator.clipboard.writeText(launchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const sendToPlanner = () => {
    saveAssignment();
    setActiveTab('lesson-planner');
  };

  const sendToGrader = () => {
    saveAssignment();
    setActiveTab('grader');
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
              <Gamepad2 className="h-4 w-4" />
              NeuroQuest Academy
            </div>
            <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
              Game-based learning wired into your teacher command center.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Select a NeuroQuest activity, launch it in the portal, save a class assignment, and send the same quest context into lesson planning, grading, email updates, and the online classroom.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveAssignment}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Save Active Quest <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab('classroom')}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-100"
              >
                Teach Live <MonitorPlay className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <Gamepad2 className="mb-4 h-7 w-7 text-amber-300" />
              <div className="text-2xl font-bold">{neuroQuestGames.length}</div>
              <p className="text-sm text-slate-300">Playable demos</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <GraduationCap className="mb-4 h-7 w-7 text-emerald-300" />
              <div className="text-2xl font-bold">G8</div>
              <p className="text-sm text-slate-300">Flagship track</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <Users className="mb-4 h-7 w-7 text-cyan-300" />
              <div className="text-2xl font-bold">30</div>
              <p className="text-sm text-slate-300">Classroom seats</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <BarChart3 className="mb-4 h-7 w-7 text-rose-300" />
              <div className="text-2xl font-bold">4</div>
              <p className="text-sm text-slate-300">Teacher handoffs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Activity Library</h2>
                <p className="text-gray-600">Choose the learning game for today&apos;s class.</p>
              </div>
              <a
                href={selectedGame.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600"
                title="Open selected game in a new tab"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {neuroQuestGames.map((game) => {
                const Icon = iconBySlug[game.slug as keyof typeof iconBySlug] ?? Gamepad2;
                const isActive = selectedSlug === game.slug;
                return (
                  <button
                    key={game.slug}
                    onClick={() => selectGame(game.slug)}
                    className={`rounded-lg border p-4 text-left transition ${
                      isActive ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 text-white ${colorByTone[game.color as keyof typeof colorByTone]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{game.subject}</p>
                        <h3 className="font-semibold text-gray-900">{game.title}</h3>
                        <p className="mt-1 text-sm leading-5 text-gray-600">{game.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Class Assignment</h2>
            <p className="mt-1 text-gray-600">This saved quest becomes available in planner, grader, email, and classroom.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Assignment title</label>
                <input
                  value={assignment.title}
                  onChange={(event) => setAssignment((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Learning objective</label>
                <textarea
                  value={assignment.objective}
                  onChange={(event) => setAssignment((current) => ({ ...current, objective: event.target.value }))}
                  className="h-20 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    value={assignment.duration}
                    onChange={(event) => setAssignment((current) => ({ ...current, duration: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Student launch link</label>
                  <div className="flex gap-2">
                    <input readOnly value={launchUrl} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600" />
                    <button onClick={copyLaunchLink} className="rounded-lg bg-gray-900 px-3 text-white transition hover:bg-gray-800" title="Copy launch link">
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Student instructions</label>
                <textarea
                  value={assignment.instructions}
                  onChange={(event) => setAssignment((current) => ({ ...current, instructions: event.target.value }))}
                  className="h-24 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={sendToPlanner} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700">
                <BookOpen className="h-5 w-5" />
                Plan Lesson
              </button>
              <button onClick={sendToGrader} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700">
                <CheckSquare className="h-5 w-5" />
                Build Rubric
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 text-white ${colorByTone[selectedGame.color as keyof typeof colorByTone]}`}>
                  <GameIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedGame.title}</h2>
                  <p className="text-sm text-gray-500">{selectedGame.gradeBand} · {selectedGame.subject}</p>
                </div>
              </div>
              <button onClick={saveAssignment} className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                Save
              </button>
            </div>
            <iframe
              title={selectedGame.title}
              src={selectedGame.href}
              className="h-[520px] w-full bg-slate-950"
              allow="fullscreen; gamepad; autoplay"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Live Progress Snapshot</h2>
              <div className="mt-4 space-y-3">
                {roster.map((student) => (
                  <div key={student.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">{student.name}</span>
                      <span className="text-gray-500">{student.status}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-indigo-600" style={{ width: `${student.progress}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Score evidence: {student.score}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Assessment Rubric Preview</h2>
              <pre className="mt-4 max-h-[280px] overflow-y-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-xs leading-5 text-gray-700">
                {buildQuestRubric(assignment)}
              </pre>
              <button
                onClick={() => {
                  saveAssignment();
                  setActiveTab('email');
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Draft Parent Update <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
