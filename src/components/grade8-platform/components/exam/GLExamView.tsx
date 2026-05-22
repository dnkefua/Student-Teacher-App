import React, { useState, useEffect } from 'react';
import { Timer, PlayCircle, CheckCircle2, XCircle, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { glExams } from '../../data/glExams';
import { UnitId, SubjectId } from '../../types';

type TimerMode = '5s' | '10s' | '15s' | '90s';

export function GLExamView({ unit, subject }: { unit: UnitId, subject?: SubjectId }) {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [timerMode, setTimerMode] = useState<TimerMode | null>(null);
  
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [examFinished, setExamFinished] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const examData = glExams.find(e => e.id === selectedExam);

  useEffect(() => {
    let interval: any;
    if (examStarted && !examFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, examFinished, timeLeft]);

  const handleTimeUp = () => {
    if (timerMode === '90s') {
      finishExam();
    } else {
      nextQuestion();
    }
  };

  const startExam = (mode: TimerMode) => {
    setTimerMode(mode);
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setExamFinished(false);
    
    if (mode === '90s') {
      setTimeLeft(90);
    } else if (mode === '5s') {
      setTimeLeft(5);
    } else if (mode === '10s') {
      setTimeLeft(10);
    } else if (mode === '15s') {
      setTimeLeft(15);
    }
  };

  const restart = () => {
    setExamStarted(false);
    setSelectedExam(null);
  };

  const finishExam = () => {
    setExamFinished(true);
    setTimeLeft(0);
  };

  const selectAnswer = (answer: string) => {
    const qid = examData!.questions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qid]: answer }));
    
    if (timerMode !== '90s') {
       nextQuestion(); // Auto advance if per-question mode
    }
  };

  const nextQuestion = () => {
    if (!examData) return;
    
    // Check answer correctness silently if per-question, but wait to score at the end
    
    if (currentQuestionIndex + 1 < examData.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (timerMode !== '90s') {
        if (timerMode === '5s') setTimeLeft(5);
        if (timerMode === '10s') setTimeLeft(10);
        if (timerMode === '15s') setTimeLeft(15);
      }
    } else {
      finishExam();
    }
  };

  const calculateFinalScore = () => {
    if (!examData) return 0;
    let s = 0;
    examData.questions.forEach(q => {
      if (answers[q.id] === q.answer) s++;
    });
    return s;
  };

  // If not math subject, show a placeholder
  if (subject !== 'math') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 mt-8 text-center">
        <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">GL Exams are available for Maths</h3>
        <p className="text-slate-500">Please switch to Maths to access the GL Exam module.</p>
      </div>
    );
  }

  if (examFinished && examData) {
    const finalScore = calculateFinalScore();
    const pct = Math.round((finalScore / examData.questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto p-12 bg-white rounded-3xl shadow-sm border border-slate-200 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Exam Completed!</h1>
        <p className="text-lg text-slate-500 mb-8">You finished {examData.title}</p>
        
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8 max-w-sm mx-auto">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Final Score</div>
          <div className="text-6xl font-black text-indigo-600">{finalScore} <span className="text-3xl text-slate-400">/ {examData.questions.length}</span></div>
          <div className="text-slate-500 font-medium mt-2">{pct}% Accuracy</div>
        </div>

        <div className="mb-10 text-left space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Review & Working</h2>
          {examData.questions.map((q, idx) => (
            <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-bold ${answers[q.id] === q.answer ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {answers[q.id] === q.answer ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{idx + 1}. {q.text}</h3>
                  <div className="text-sm text-slate-500 mb-4">
                    Your Answer: <strong className={answers[q.id] === q.answer ? 'text-emerald-600' : 'text-rose-600'}>{answers[q.id] || "No Answer"}</strong> 
                    {answers[q.id] !== q.answer && <span className="ml-2">| Correct: <strong className="text-emerald-600">{q.answer}</strong></span>}
                  </div>
                  
                  {q.answerFullWorking && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Step-by-Step Working</div>
                      <p className="text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">{q.answerFullWorking}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={restart}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all"
        >
          Return to Exam List
        </button>
      </div>
    );
  }

  if (examStarted && examData) {
    const q = examData.questions[currentQuestionIndex];
    return (
      <div className="max-w-3xl mx-auto relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Question {currentQuestionIndex + 1} of {examData.questions.length}</h2>
          </div>
          <div className={`px-6 py-3 rounded-full flex items-center gap-3 font-bold text-2xl border-2 ${timeLeft <= 3 && timerMode !== '90s' ? 'bg-rose-100 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-900 text-white border-slate-900'}`}>
            <Timer className="w-6 h-6" />
            {timerMode === '90s' ? `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}` : timeLeft + 's'}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 shadow-xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-10 text-center leading-tight">
            {q.text}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => selectAnswer(opt)}
                className={`py-6 px-4 rounded-2xl border-2 text-2xl font-bold text-center transition-all ${
                  answers[q.id] === opt 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {timerMode === '90s' && (
             <div className="mt-8 flex justify-end">
                <button 
                  onClick={nextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                  {currentQuestionIndex + 1 === examData.questions.length ? 'Finish' : 'Next'} <ArrowRight className="w-5 h-5" />
                </button>
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <header className="mb-10">
          <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <Timer className="w-8 h-8 text-indigo-600" />
            GL Style Exams
          </h1>
          <p className="text-slate-500 font-medium">Fast-paced, timed mathematical reasoning exams.</p>
       </header>

       {!selectedExam ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {glExams.map(exam => (
              <div key={exam.id} className="bg-white border-2 border-slate-200 p-8 rounded-3xl hover:border-indigo-300 transition-all cursor-pointer shadow-sm hover:shadow-md" onClick={() => setSelectedExam(exam.id)}>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                <p className="text-slate-500 font-medium mb-6">{exam.questions.length} Questions</p>
                
                <div className="flex items-center text-indigo-600 font-bold gap-2">
                  Select Timer Options <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            ))}
         </div>
       ) : (
         <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm max-w-2xl mx-auto">
            <button onClick={() => setSelectedExam(null)} className="text-slate-400 font-bold text-sm mb-6 hover:text-slate-700 flex items-center gap-1">
              &larr; Back to Exams
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-4">{examData?.title}</h2>
            <p className="text-slate-600 mb-8 text-lg">Select a time constraint to begin the exam. In GL tests, strict timing forces quick recall and sharp mental arithmetic.</p>
            
            <div className="space-y-4">
              <button onClick={() => startExam('5s')} className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all text-rose-900 group">
                <div>
                  <div className="font-black text-xl mb-1">5 Seconds Per Question</div>
                  <div className="text-rose-700 text-sm font-medium">Extreme difficulty. Rapid fire.</div>
                </div>
                <PlayCircle className="w-8 h-8 text-rose-400 group-hover:text-rose-600" />
              </button>

              <button onClick={() => startExam('10s')} className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all text-amber-900 group">
                <div>
                  <div className="font-black text-xl mb-1">10 Seconds Per Question</div>
                  <div className="text-amber-700 text-sm font-medium">Classic mental maths pace.</div>
                </div>
                <PlayCircle className="w-8 h-8 text-amber-400 group-hover:text-amber-600" />
              </button>

              <button onClick={() => startExam('15s')} className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all text-emerald-900 group">
                <div>
                  <div className="font-black text-xl mb-1">15 Seconds Per Question</div>
                  <div className="text-emerald-700 text-sm font-medium">More time for reasoning.</div>
                </div>
                <PlayCircle className="w-8 h-8 text-emerald-400 group-hover:text-emerald-600" />
              </button>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100"></div></div>
                <div className="relative bg-white px-4 text-sm font-bold text-slate-300 tracking-widest uppercase">Or</div>
              </div>

              <button onClick={() => startExam('90s')} className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all text-indigo-900 group">
                <div>
                  <div className="font-black text-xl mb-1 flex items-center gap-2"><Clock className="w-5 h-5"/> 1 min 30 secs Total Time</div>
                  <div className="text-indigo-700 text-sm font-medium">Manage your own time across 10 questions.</div>
                </div>
                <PlayCircle className="w-8 h-8 text-indigo-400 group-hover:text-indigo-600" />
              </button>
            </div>
         </div>
       )}
    </div>
  );
}
