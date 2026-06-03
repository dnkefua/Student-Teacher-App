import React, { useState, useEffect } from 'react';
import { practiceQuestions } from '../../data/curriculumData';
import { unit2Practice } from '../../data/unit2Data';
import { unit3Practice } from '../../data/unit3Data';
import { unit4Practice } from '../../data/unit4Data';
import {
  englishUnit1Practice, englishUnit2Practice, englishUnit3Practice, englishUnit4Practice, englishUnit5Practice,
  englishUnit1NGRTTests, englishUnit2NGRTTests, englishUnit3NGRTTests, englishUnit4NGRTTests, englishUnit5NGRTTests,
  type NGRTTest,
} from '../../data/englishCurriculum';
import { scienceUnit1Practice, scienceUnit2Practice, scienceUnit3Practice, scienceUnit4Practice, scienceUnit5Practice, scienceUnit6Practice } from '../../data/scienceCurriculum';
import { Brain, Eye, EyeOff, CheckCircle2, XCircle, PenTool, BookOpenCheck } from 'lucide-react';
import { UnitId, PracticeQuestion, SubjectId } from '../../types';
import { QuickAssignButton } from '../QuickAssignButton';

export function PracticeView({ unit, subject }: { unit: UnitId, subject?: SubjectId }) {
  const getData = (): PracticeQuestion[] => {
    if (subject === 'science') {
      if (unit === 'unit1') return scienceUnit1Practice;
      if (unit === 'unit2') return scienceUnit2Practice;
      if (unit === 'unit3') return scienceUnit3Practice;
      if (unit === 'unit4') return scienceUnit4Practice;
      if (unit === 'unit5') return scienceUnit5Practice;
      if (unit === 'unit6') return scienceUnit6Practice;
      return [];
    }
    if (subject === 'english') {
      if (unit === 'unit1') return englishUnit1Practice;
      if (unit === 'unit2') return englishUnit2Practice;
      if (unit === 'unit3') return englishUnit3Practice;
      if (unit === 'unit4') return englishUnit4Practice;
      if (unit === 'unit5') return englishUnit5Practice;
      return [];
    }

    switch (unit) {
      case 'unit1': return practiceQuestions;
      case 'unit2': return unit2Practice;
      case 'unit3': return unit3Practice;
      case 'unit4': return unit4Practice;
      default: return practiceQuestions;
    }
  };

  const getSubtitle = () => {
    if (subject === 'science') {
      if (unit === 'unit1') return 'Who are we?';
      if (unit === 'unit2') return 'How do we map matter?';
      if (unit === 'unit3') return 'Ecology';
      if (unit === 'unit4') return 'Energy & Future';
      if (unit === 'unit5') return 'What does a wave tell us';
      if (unit === 'unit6') return 'Photosynthesis';
      return '';
    }
    if (subject === 'english') {
       if (unit === 'unit1') return 'Advertising & Persuasion';
       if (unit === 'unit2') return 'Character & Perspective';
       if (unit === 'unit3') return 'Poetry & Form';
       if (unit === 'unit4') return 'Language & Film';
       if (unit === 'unit5') return 'Shakespeare & Context';
       return '';
    }

    switch (unit) {
      case 'unit1': return 'Proportional Reasoning';
      case 'unit2': return 'Linear Functions & Models';
      case 'unit3': return '3D Geometry and Transformations';
      case 'unit4': return 'Statistics and Probability';
      default: return '';
    }
  };

  const getColorTheme = () => {
    if (subject === 'science') {
      switch (unit) {
        case 'unit1': return { text: 'text-emerald-500', bg: 'bg-emerald-100 text-emerald-700', activeBg: 'bg-emerald-600 hover:bg-emerald-700' };
        case 'unit2': return { text: 'text-teal-500', bg: 'bg-teal-100 text-teal-700', activeBg: 'bg-teal-600 hover:bg-teal-700' };
        case 'unit3': return { text: 'text-green-500', bg: 'bg-green-100 text-green-700', activeBg: 'bg-green-600 hover:bg-green-700' };
        case 'unit4': return { text: 'text-cyan-500', bg: 'bg-cyan-100 text-cyan-700', activeBg: 'bg-cyan-600 hover:bg-cyan-700' };
        case 'unit5': return { text: 'text-blue-500', bg: 'bg-blue-100 text-blue-700', activeBg: 'bg-blue-600 hover:bg-blue-700' };
        case 'unit6': return { text: 'text-lime-500', bg: 'bg-lime-100 text-lime-700', activeBg: 'bg-lime-600 hover:bg-lime-700' };
        default: return { text: 'text-emerald-500', bg: 'bg-emerald-100 text-emerald-700', activeBg: 'bg-emerald-600 hover:bg-emerald-700' };
      }
    }
    if (subject === 'english') {
      return { text: 'text-amber-500', bg: 'bg-amber-100 text-amber-700', activeBg: 'bg-amber-600 hover:bg-amber-700' };
    }
    switch (unit) {
      case 'unit1': return { text: 'text-violet-500', bg: 'bg-violet-100 text-violet-700', activeBg: 'bg-violet-600 hover:bg-violet-700' };
      case 'unit2': return { text: 'text-fuchsia-500', bg: 'bg-fuchsia-100 text-fuchsia-700', activeBg: 'bg-fuchsia-600 hover:bg-fuchsia-700' };
      case 'unit3': return { text: 'text-emerald-500', bg: 'bg-emerald-100 text-emerald-700', activeBg: 'bg-emerald-600 hover:bg-emerald-700' };
      case 'unit4': return { text: 'text-orange-500', bg: 'bg-orange-100 text-orange-700', activeBg: 'bg-orange-600 hover:bg-orange-700' };
      default: return { text: 'text-violet-500', bg: 'bg-violet-100 text-violet-700', activeBg: 'bg-violet-600 hover:bg-violet-700' };
    }
  };

  const getNGRTTests = (): NGRTTest[] => {
    if (subject !== 'english') return [];
    if (unit === 'unit1') return englishUnit1NGRTTests;
    if (unit === 'unit2') return englishUnit2NGRTTests;
    if (unit === 'unit3') return englishUnit3NGRTTests;
    if (unit === 'unit4') return englishUnit4NGRTTests;
    if (unit === 'unit5') return englishUnit5NGRTTests;
    return [];
  };

  const data = getData();
  const ngrtTests = getNGRTTests();
  const theme = getColorTheme();

  const [ngrtAnswers, setNgrtAnswers] = useState<Record<string, string>>({});
  const [ngrtRevealed, setNgrtRevealed] = useState<Record<string, boolean>>({});

  const handleNgrtAnswer = (testId: string, qId: number, opt: string, correct: string) => {
    const key = `${testId}-${qId}`;
    if (ngrtAnswers[key]) return;
    setNgrtAnswers(prev => ({ ...prev, [key]: opt }));
    if (opt.trim().toLowerCase() === correct.trim().toLowerCase()) {
      setNgrtRevealed(prev => ({ ...prev, [key]: true }));
    }
  };

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isCorrect, setIsCorrect] = useState<Record<number, boolean>>({});
  const [failuresCount, setFailuresCount] = useState<Record<number, number>>({});

  // Reset and Load state when unit changes
  useEffect(() => {
    const savedCompletedStr = localStorage.getItem(`practice_completed_${subject}_${unit}`);
    const savedCompleted = savedCompletedStr ? JSON.parse(savedCompletedStr) : [];
    const initialRevealed: Record<number, boolean> = {};
    const initialCorrect: Record<number, boolean> = {};
    
    savedCompleted.forEach((id: number) => {
      initialRevealed[id] = true;
      initialCorrect[id] = true;
    });

    setRevealed(initialRevealed);
    setIsCorrect(initialCorrect);
    setCompleted(savedCompleted.length);
    setUserAnswers({});
    setFailuresCount({});
  }, [unit, subject]);

  const markCompleted = (id: number, correct: boolean = true) => {
    setRevealed(prev => {
      const alreadyRevealed = prev[id];
      if (!alreadyRevealed) {
        setCompleted(c => {
          const newC = Math.min(c + 1, data.length);
          // Save to local storage
          const savedStr = localStorage.getItem(`practice_completed_${subject}_${unit}`);
          const saved = savedStr ? JSON.parse(savedStr) : [];
          if (!saved.includes(id)) {
            saved.push(id);
            localStorage.setItem(`practice_completed_${subject}_${unit}`, JSON.stringify(saved));
          }
          return newC;
        });
      }
      return { ...prev, [id]: true };
    });
    
    setIsCorrect(prev => ({ ...prev, [id]: correct }));
  };

  const toggleReveal = (id: number) => {
    markCompleted(id, true);
  };

  const checkAnswer = (q: PracticeQuestion) => {
    const userAns = userAnswers[q.id]?.toString().trim().toLowerCase() || '';
    const correctAns = q.interactiveAnswer?.toString().trim().toLowerCase() || '';
    
    if (userAns === correctAns) {
      markCompleted(q.id, true);
    } else {
      setIsCorrect(prev => ({ ...prev, [q.id]: false }));
      setFailuresCount(prev => ({ ...prev, [q.id]: (prev[q.id] || 0) + 1 }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <Brain className={`w-8 h-8 ${theme.text}`} />
            Practice Problems
          </h1>
          <p className="text-slate-500 font-medium">Test your understanding of {getSubtitle()}</p>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Progress</div>
          <div className="text-xl font-black text-violet-600">{completed} / {data.length}</div>
        </div>
      </header>

      {data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center mt-8">
          <PenTool className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Practice Problems</h3>
          <p className="text-slate-500">The practice set for this unit is currently being designed. Please check back later.</p>
        </div>
      ) : (
      <div className="space-y-6">
        {data.map((q, index) => (
          <div key={q.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-mono ${theme.bg}`}>
                  {q.id}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-medium text-slate-900">{q.question}</h3>
                  {subject && (
                    <QuickAssignButton
                      refId={`practice-${subject}-${unit}-${q.id}`}
                      label={q.question}
                      subject={subject}
                      unit={unit}
                      kind="exercise"
                      defaultTitle={`Practice Q${q.id}`}
                    />
                  )}
                </div>

                {q.hint && !revealed[q.id] && (
                  <p className="text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block">
                    <strong className="text-slate-700 mr-1">Hint:</strong> {q.hint}
                  </p>
                )}

                <div className="mt-4">
                  {!q.type || q.type === 'reveal' ? (
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        revealed[q.id] 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                          : `${theme.activeBg} text-white`
                      }`}
                      disabled={revealed[q.id]}
                    >
                      {revealed[q.id] ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Eye className="w-4 h-4" />}
                      {revealed[q.id] ? 'Completed' : 'Reveal Solution'}
                    </button>
                  ) : q.type === 'multiple-choice' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.interactiveOptions?.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setUserAnswers(prev => ({ ...prev, [q.id]: opt }));
                              if (!revealed[q.id]) {
                                if (opt.toString().trim().toLowerCase() === q.interactiveAnswer?.toString().trim().toLowerCase()) {
                                  markCompleted(q.id, true);
                                } else {
                                  setIsCorrect(prev => ({...prev, [q.id]: false}));
                                  setFailuresCount(prev => ({ ...prev, [q.id]: (prev[q.id] || 0) + 1 }));
                                }
                              }
                            }}
                            disabled={revealed[q.id]}
                            className={`px-4 py-3 border rounded-xl text-left font-medium transition-all ${
                              revealed[q.id] && opt.toString().trim().toLowerCase() === q.interactiveAnswer?.toString().trim().toLowerCase()
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : userAnswers[q.id] === opt && isCorrect[q.id] === false
                                ? 'bg-rose-50 border-rose-500 text-rose-900'
                                : userAnswers[q.id] === opt
                                ? 'bg-slate-100 border-slate-400'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {isCorrect[q.id] === false && !revealed[q.id] && (
                        <p className="text-rose-500 text-sm font-bold flex items-center gap-2 mt-2">
                          <XCircle className="w-4 h-4" /> Incorrect, try again.
                        </p>
                      )}
                      {failuresCount[q.id] >= 2 && !revealed[q.id] && (
                        <div className="mt-4 bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-4">
                          <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
                            <Brain className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-900">Recommended Review</h4>
                            <p className="text-amber-800/80 text-sm mt-1 mb-3">
                              It looks like you're stuck on this topic. We strongly recommend returning to the <strong className="font-black text-amber-900">Lessons</strong> tab to review the foundational concepts.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : q.type === 'free-text' ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        type="text"
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        disabled={revealed[q.id]}
                        placeholder="Type your answer here..."
                        className={`px-4 py-2 border rounded-xl flex-1 outline-none transition-all ${
                           isCorrect[q.id] === false ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                           : revealed[q.id] ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                           : 'border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !revealed[q.id]) {
                            checkAnswer(q);
                          }
                        }}
                      />
                      {!revealed[q.id] && (
                        <button
                          onClick={() => checkAnswer(q)}
                          className={`${theme.activeBg} text-white px-5 py-2 rounded-xl font-bold transition-all`}
                        >
                          Check
                        </button>
                      )}
                      {isCorrect[q.id] === false && !revealed[q.id] && (
                        <p className="text-rose-500 text-sm font-bold flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Incorrect.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {failuresCount[q.id] >= 2 && !revealed[q.id] && (
                    <div className="mt-4 bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-4">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900">Recommended Review</h4>
                        <p className="text-amber-800/80 text-sm mt-1 mb-3">
                          It looks like you're stuck on this topic. We strongly recommend returning to the <strong className="font-black text-amber-900">Lessons</strong> tab to review the foundational concepts.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {revealed[q.id] && (
                  <div className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      Solution:
                    </div>
                    <p className="text-emerald-900 font-mono text-sm leading-relaxed whitespace-pre-wrap pl-7 border-l-2 border-emerald-300">
                      {q.answerFullWorking}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* ── NGRT Tests (English only) ─────────────────────────────────────── */}
      {ngrtTests.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-100">
              <BookOpenCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">End-of-Chapter NGRT Tests</h2>
              <p className="text-sm text-slate-500">New Group Reading Test — 3 standardised reading comprehension tests. Assign directly to students.</p>
            </div>
          </div>

          <div className="space-y-8">
            {ngrtTests.map((test) => (
              <div key={test.id} className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden">
                {/* Test header */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 bg-amber-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-black shrink-0">
                      T{test.testNumber}
                    </span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">NGRT · Test {test.testNumber}</p>
                      <h3 className="font-bold text-slate-900 text-base">{test.title}</h3>
                    </div>
                  </div>
                  {subject && (
                    <QuickAssignButton
                      refId={test.id}
                      label={`NGRT Test ${test.testNumber}: ${test.title}`}
                      subject={subject}
                      unit={unit}
                      kind="exercise"
                      defaultTitle={`NGRT T${test.testNumber} – ${test.title}`}
                    />
                  )}
                </div>

                {/* Passages */}
                <div className="px-6 pt-5 pb-4 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reading Passages</p>
                  {(test as any).passages
                    ? (test as any).passages.map((p: { label: string; text: string }) => (
                        <div key={p.label}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">{p.label}</p>
                          <blockquote className="text-sm leading-relaxed text-slate-700 bg-slate-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4">
                            {p.text}
                          </blockquote>
                        </div>
                      ))
                    : (
                        <blockquote className="text-sm leading-relaxed text-slate-700 bg-slate-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 italic">
                          {(test as any).passage}
                        </blockquote>
                      )
                  }
                </div>

                {/* Questions */}
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comprehension Questions</p>
                  {test.questions.map((q) => {
                    const key = `${test.id}-${q.id}`;
                    const chosen = ngrtAnswers[key];
                    const correct = ngrtRevealed[key];
                    const answered = Boolean(chosen);
                    return (
                      <div key={q.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm mb-3">
                          <span className="font-black text-amber-600 mr-1.5">{q.id}.</span>{q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt) => {
                            const isChosen = chosen === opt;
                            const isAnswer = opt.trim().toLowerCase() === q.answer.trim().toLowerCase();
                            return (
                              <button
                                key={opt}
                                disabled={answered}
                                onClick={() => handleNgrtAnswer(test.id, q.id, opt, q.answer)}
                                className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                  answered && isAnswer
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                    : isChosen && !isAnswer
                                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                                    : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700 disabled:hover:border-slate-200'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {correct && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                          </p>
                        )}
                        {chosen && !correct && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                            <XCircle className="w-3.5 h-3.5" /> Answer locked. Correct answer revealed in green.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
