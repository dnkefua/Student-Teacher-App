'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Timer, PlayCircle, CheckCircle2, XCircle, ArrowRight,
  BookOpen, Clock, Shuffle, RotateCcw,
} from 'lucide-react';
import { glExams } from '../../data/glExams';
import { UnitId, SubjectId } from '../../types';
import { QuickAssignButton } from '../QuickAssignButton';

type TimerMode = '5s' | '10s' | '15s' | '90s';

// ── Scramble letter-tile game ──────────────────────────────────────────────────
interface ScrambleTile { letter: string; key: string; }

function ScrambleQuestion({
  scrambledLetters,
  locked,
  onConfirm,
}: {
  scrambledLetters: string[];
  locked: boolean;
  onConfirm: (word: string) => void;
}) {
  const initial = scrambledLetters.map((l, i) => ({ letter: l, key: `${l}-${i}` }));
  const [pool, setPool] = useState<ScrambleTile[]>(initial);
  const [placed, setPlaced] = useState<ScrambleTile[]>([]);

  // Reset if new question arrives
  useEffect(() => {
    setPool(scrambledLetters.map((l, i) => ({ letter: l, key: `${l}-${i}` })));
    setPlaced([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrambledLetters.join('')]);

  const place = (key: string) => {
    if (locked) return;
    const tile = pool.find(t => t.key === key);
    if (!tile) return;
    setPool(p => p.filter(t => t.key !== key));
    setPlaced(p => [...p, tile]);
  };

  const unplace = (key: string) => {
    if (locked) return;
    const tile = placed.find(t => t.key === key);
    if (!tile) return;
    setPlaced(p => p.filter(t => t.key !== key));
    setPool(p => [...p, tile]);
  };

  const clearAll = () => {
    if (locked) return;
    setPool(initial);
    setPlaced([]);
  };

  const confirm = () => {
    if (placed.length === 0 || locked) return;
    onConfirm(placed.map(t => t.letter).join('').toLowerCase());
  };

  return (
    <div className="space-y-4">
      {/* Answer-building area */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Your Answer — click letters to remove</p>
        <div className="min-h-[3.5rem] flex flex-wrap gap-2 items-center p-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50">
          {placed.length === 0
            ? <span className="text-sm text-slate-400 italic">Click letters below to build the word…</span>
            : placed.map(t => (
                <button
                  key={t.key}
                  onClick={() => unplace(t.key)}
                  disabled={locked}
                  className="w-10 h-10 rounded-xl bg-indigo-500 text-white font-black text-base flex items-center justify-center hover:bg-indigo-400 active:scale-95 transition disabled:opacity-50 shadow-sm select-none"
                >
                  {t.letter}
                </button>
              ))
          }
        </div>
      </div>

      {/* Letter pool */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Available Letters — click to place</p>
        <div className="flex flex-wrap gap-2">
          {pool.map(t => (
            <button
              key={t.key}
              onClick={() => place(t.key)}
              disabled={locked}
              className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 font-black text-base flex items-center justify-center hover:bg-amber-300 active:scale-95 transition disabled:opacity-40 shadow select-none"
            >
              {t.letter}
            </button>
          ))}
          {pool.length === 0 && !locked && (
            <span className="text-sm text-slate-400 italic">All letters placed</span>
          )}
        </div>
      </div>

      {!locked && (
        <div className="flex gap-3 pt-1">
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
          <button
            onClick={confirm}
            disabled={placed.length === 0}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 transition shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm Word
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main exam view ─────────────────────────────────────────────────────────────
export function GLExamView({ unit, subject }: { unit: UnitId; subject?: SubjectId }) {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showPassage, setShowPassage] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode | null>(null);

  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Filter exams to the current subject
  const availableExams = glExams.filter(
    e => ((e as any).subject ?? 'math') === (subject ?? 'math'),
  );

  const examData = availableExams.find(e => e.id === selectedExam);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (examStarted && !examFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleTimeUp(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, examFinished, timeLeft]);

  const handleTimeUp = useCallback(() => {
    if (timerMode === '90s') { finishExam(); }
    else { nextQuestion(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerMode]);

  const startExam = (mode: TimerMode) => {
    setTimerMode(mode);
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setExamFinished(false);
    if (mode === '90s') setTimeLeft(90);
    else if (mode === '5s') setTimeLeft(5);
    else if (mode === '10s') setTimeLeft(10);
    else setTimeLeft(15);
  };

  const restart = () => {
    setExamStarted(false);
    setSelectedExam(null);
    setShowPassage(false);
    setAnswers({});
    setExamFinished(false);
  };

  const finishExam = () => { setExamFinished(true); setTimeLeft(0); };

  const nextQuestion = () => {
    if (!examData) return;
    if (currentQuestionIndex + 1 < examData.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (timerMode !== '90s') {
        const q = examData.questions[currentQuestionIndex + 1] as any;
        const limit = q?.timeLimit;
        if (timerMode === '5s') setTimeLeft(5);
        else if (timerMode === '10s') setTimeLeft(10);
        else setTimeLeft(limit ?? 15);
      }
    } else {
      finishExam();
    }
  };

  const selectAnswer = (qid: number, answer: string) => {
    if (answers[qid]) return;          // locked once confirmed
    setAnswers(prev => ({ ...prev, [qid]: answer }));
  };

  const calculateFinalScore = () => {
    if (!examData) return 0;
    return examData.questions.reduce((s, q) => {
      const userAns = (answers[q.id] ?? '').trim().toLowerCase();
      const correct = (q.answer ?? '').trim().toLowerCase();
      return s + (userAns === correct ? 1 : 0);
    }, 0);
  };

  // ── No exams for this subject ──────────────────────────────────────────────
  if (availableExams.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 mt-8 text-center">
        <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">No GL Exams Yet</h3>
        <p className="text-slate-500">GL Exam content for this subject is coming soon.</p>
      </div>
    );
  }

  // ── Finished screen ────────────────────────────────────────────────────────
  if (examFinished && examData) {
    const finalScore = calculateFinalScore();
    const pct = Math.round((finalScore / examData.questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-sm border border-slate-200 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Exam Complete!</h1>
          <p className="text-slate-500">{examData.title}</p>
          <div className="mt-6 inline-block bg-slate-50 border border-slate-200 rounded-2xl px-10 py-5">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Final Score</div>
            <div className="text-5xl font-black text-indigo-600">
              {finalScore} <span className="text-2xl text-slate-400">/ {examData.questions.length}</span>
            </div>
            <div className="text-slate-500 font-medium mt-1">{pct}% Accuracy</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Answers & Explanations</h2>
          {examData.questions.map((q, idx) => {
            const qAny = q as any;
            const userAns = (answers[q.id] ?? '').trim().toLowerCase();
            const correct = (q.answer ?? '').trim().toLowerCase();
            const isRight = userAns === correct;
            return (
              <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold ${isRight ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {isRight ? '✓' : '✗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 mb-1">{idx + 1}. {qAny.text}</p>
                    {qAny.context && (
                      <p className="text-xs italic text-slate-400 mb-2 border-l-2 border-amber-300 pl-2">{qAny.context}</p>
                    )}
                    <p className="text-sm mb-1">
                      Your answer:{' '}
                      <strong className={isRight ? 'text-emerald-600' : 'text-rose-600'}>
                        {answers[q.id] ? answers[q.id].toUpperCase() : 'No answer'}
                      </strong>
                      {!isRight && (
                        <span className="ml-2 text-slate-500">
                          | Correct: <strong className="text-emerald-600">{q.answer.toUpperCase()}</strong>
                        </span>
                      )}
                    </p>
                    {q.answerFullWorking && (
                      <div className="mt-2 bg-white p-3 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Explanation</p>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{q.answerFullWorking}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={restart}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base hover:bg-slate-800 transition"
        >
          Return to Exam List
        </button>
      </div>
    );
  }

  // ── Active question ────────────────────────────────────────────────────────
  if (examStarted && examData) {
    const q = examData.questions[currentQuestionIndex] as any;
    const chosen = answers[q.id];
    const hasAnswered = Boolean(chosen);
    const isScramble = q.type === 'scramble';
    const isCorrect = hasAnswered && chosen.trim().toLowerCase() === (q.answer ?? '').trim().toLowerCase();

    return (
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Question {currentQuestionIndex + 1} of {examData.questions.length}</p>
            <div className="mt-1 h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((currentQuestionIndex + 1) / examData.questions.length) * 100}%` }} />
            </div>
          </div>
          <div className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-xl border-2 transition ${
            timerMode !== '90s' && timeLeft <= 3
              ? 'bg-rose-100 text-rose-600 border-rose-200 animate-pulse'
              : 'bg-slate-900 text-white border-slate-900'
          }`}>
            <Timer className="w-5 h-5" />
            {timerMode === '90s'
              ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
              : `${timeLeft}s`}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl">
          {/* Section label */}
          {isScramble && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Shuffle className="w-3 h-3" /> Spelling Scramble
              </span>
            </div>
          )}

          {/* Context excerpt */}
          {q.context && (
            <blockquote className="mb-4 text-sm italic text-slate-500 border-l-4 border-amber-300 pl-4 bg-amber-50 py-2 pr-3 rounded-r-xl">
              {q.context}
            </blockquote>
          )}

          <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-snug">{q.text}</h2>

          {isScramble ? (
            <ScrambleQuestion
              scrambledLetters={q.scrambledLetters ?? []}
              locked={hasAnswered}
              onConfirm={(word) => selectAnswer(q.id, word)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options?.map((opt: string, i: number) => {
                const isChosen = chosen === opt;
                const isAns = opt === q.answer;
                const revealCorrect = hasAnswered && isAns;
                const revealWrong = hasAnswered && isChosen && !isAns;
                return (
                  <button
                    key={i}
                    disabled={hasAnswered}
                    onClick={() => selectAnswer(q.id, opt)}
                    className={`py-5 px-4 rounded-2xl border-2 text-lg font-bold text-center transition disabled:cursor-default ${
                      revealCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : revealWrong
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback after answering */}
          {hasAnswered && (
            <div className={`mt-5 p-4 rounded-xl border flex items-start gap-3 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              {isCorrect
                ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              <div>
                <p className={`font-bold text-sm ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isCorrect
                    ? `✓ Correct! "${q.answer.toUpperCase()}"`
                    : `✗ Correct answer: "${q.answer.toUpperCase()}"`}
                </p>
                {q.answerFullWorking && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{q.answerFullWorking}</p>
                )}
              </div>
            </div>
          )}

          {/* Next button */}
          {(timerMode === '90s' || hasAnswered) && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={nextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition"
              >
                {currentQuestionIndex + 1 === examData.questions.length ? 'Finish' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Passage reading screen ─────────────────────────────────────────────────
  if (showPassage && examData) {
    const passage = (examData as any).passage as string | undefined;
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm">
        <button onClick={() => setShowPassage(false)} className="text-slate-400 text-sm font-bold mb-5 hover:text-slate-700">← Back</button>
        <h2 className="text-2xl font-black text-slate-900 mb-1">{examData.title}</h2>
        <p className="text-sm text-amber-600 font-bold uppercase tracking-widest mb-5">Read the passage carefully before starting</p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 max-h-72 overflow-y-auto">
          {passage?.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-700 mb-3 last:mb-0">{para}</p>
          ))}
        </div>
        <p className="text-xs text-slate-400 mb-6">Select a timer mode below to begin. The passage will be shown as a reference excerpt on relevant questions.</p>
        <div className="space-y-3">
          {([
            { mode: '5s' as TimerMode, label: '5 Seconds Per Question', sub: 'Extreme — rapid recall only', colour: 'rose' },
            { mode: '10s' as TimerMode, label: '10 Seconds Per Question', sub: 'Classic GL pace', colour: 'amber' },
            { mode: '15s' as TimerMode, label: '15 Seconds Per Question', sub: 'More time for reasoning', colour: 'emerald' },
          ]).map(({ mode, label, sub, colour }) => (
            <button
              key={mode}
              onClick={() => { setShowPassage(false); startExam(mode); }}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 border-${colour}-200 bg-${colour}-50 hover:bg-${colour}-100 transition text-${colour}-900 group`}
            >
              <div>
                <div className="font-black text-base mb-0.5">{label}</div>
                <div className={`text-${colour}-700 text-xs font-medium`}>{sub}</div>
              </div>
              <PlayCircle className={`w-7 h-7 text-${colour}-400 group-hover:text-${colour}-600`} />
            </button>
          ))}
          <div className="relative py-3 flex items-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100" /></div>
            <div className="relative bg-white px-4 text-xs font-bold text-slate-300 tracking-widest uppercase mx-auto">Or</div>
          </div>
          <button
            onClick={() => { setShowPassage(false); startExam('90s'); }}
            className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition text-indigo-900 group"
          >
            <div>
              <div className="font-black text-base mb-0.5 flex items-center gap-2"><Clock className="w-4 h-4" /> 1 min 30 secs Total Time</div>
              <div className="text-indigo-700 text-xs font-medium">Work at your own pace within the total time</div>
            </div>
            <PlayCircle className="w-7 h-7 text-indigo-400 group-hover:text-indigo-600" />
          </button>
        </div>
      </div>
    );
  }

  // ── Timer selection screen (no passage) ───────────────────────────────────
  if (selectedExam && examData && !showPassage) {
    const hasPassage = Boolean((examData as any).passage);
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm max-w-2xl mx-auto">
        <button onClick={() => setSelectedExam(null)} className="text-slate-400 font-bold text-sm mb-5 hover:text-slate-700 flex items-center gap-1">
          ← Back to Exams
        </button>
        <h2 className="text-3xl font-black text-slate-900 mb-2">{examData.title}</h2>
        <p className="text-slate-500 mb-6">{examData.questions.length} questions</p>

        {hasPassage && (
          <button
            onClick={() => setShowPassage(true)}
            className="w-full mb-6 flex items-center justify-between p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-amber-900 group"
          >
            <div>
              <div className="font-black text-base mb-0.5">Read the Passage First (Recommended)</div>
              <div className="text-amber-700 text-xs font-medium">Sections A & B are based on a reading extract</div>
            </div>
            <BookOpen className="w-7 h-7 text-amber-400 group-hover:text-amber-600" />
          </button>
        )}

        <p className="text-sm text-slate-500 mb-4 font-medium">Or select a timer mode to begin directly:</p>
        <div className="space-y-3">
          <button onClick={() => startExam('5s')} className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 transition text-rose-900 group">
            <div><div className="font-black text-base mb-0.5">5 Seconds Per Question</div><div className="text-rose-700 text-xs font-medium">Extreme difficulty. Rapid fire.</div></div>
            <PlayCircle className="w-7 h-7 text-rose-400 group-hover:text-rose-600" />
          </button>
          <button onClick={() => startExam('10s')} className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-amber-900 group">
            <div><div className="font-black text-base mb-0.5">10 Seconds Per Question</div><div className="text-amber-700 text-xs font-medium">Classic mental maths pace.</div></div>
            <PlayCircle className="w-7 h-7 text-amber-400 group-hover:text-amber-600" />
          </button>
          <button onClick={() => startExam('15s')} className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition text-emerald-900 group">
            <div><div className="font-black text-base mb-0.5">15 Seconds Per Question</div><div className="text-emerald-700 text-xs font-medium">More time for reasoning.</div></div>
            <PlayCircle className="w-7 h-7 text-emerald-400 group-hover:text-emerald-600" />
          </button>
          <div className="relative py-3 flex items-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100" /></div>
            <div className="relative bg-white px-4 text-xs font-bold text-slate-300 tracking-widest uppercase mx-auto">Or</div>
          </div>
          <button onClick={() => startExam('90s')} className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition text-indigo-900 group">
            <div><div className="font-black text-base mb-0.5 flex items-center gap-2"><Clock className="w-4 h-4" /> 1 min 30 secs Total</div><div className="text-indigo-700 text-xs font-medium">Work at your own pace within the total time.</div></div>
            <PlayCircle className="w-7 h-7 text-indigo-400 group-hover:text-indigo-600" />
          </button>
        </div>
      </div>
    );
  }

  // ── Exam list ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
          <Timer className="w-8 h-8 text-indigo-600" />
          GL Style Exams
        </h1>
        <p className="text-slate-500 font-medium">Timed exam practice in GL Assessment format.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableExams.map(exam => (
          <div key={exam.id} className="relative bg-white border-2 border-slate-200 p-8 rounded-3xl hover:border-indigo-300 transition-all shadow-sm hover:shadow-md">
            {subject && (
              <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <QuickAssignButton
                  refId={`exam-${exam.id}`}
                  label={exam.title}
                  subject={subject}
                  unit={unit}
                  kind="exam"
                  defaultTitle={exam.title}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => setSelectedExam(exam.id)}
              className="w-full text-left cursor-pointer"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 pr-10">{exam.title}</h3>
              <p className="text-slate-500 font-medium mb-4">{exam.questions.length} Questions</p>
              {(exam as any).passage && (
                <p className="text-xs text-amber-600 font-bold uppercase tracking-wide mb-4">Includes reading passage</p>
              )}
              <div className="flex items-center text-indigo-600 font-bold gap-2 text-sm">
                Select Timer & Begin <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
