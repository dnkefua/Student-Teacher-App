'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cuboid,
  Gem,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { placeValueLessonData, PlaceValueExample } from '@/lib/placeValueLesson';

type PlaceName = PlaceValueExample['digits'][number]['place'];

const places: Array<{ id: PlaceName; label: string; multiplier: number; color: string }> = [
  { id: 'thousands', label: 'Thousands', multiplier: 1000, color: '#38bdf8' },
  { id: 'hundreds', label: 'Hundreds', multiplier: 100, color: '#facc15' },
  { id: 'tens', label: 'Tens', multiplier: 10, color: '#34d399' },
  { id: 'ones', label: 'Ones', multiplier: 1, color: '#fb7185' },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function getDigitForPlace(example: PlaceValueExample, place: PlaceName) {
  return example.digits.find((digit) => digit.place === place) ?? example.digits[0];
}

export function PlaceValueHero({ onStart, onBack }: { onStart: () => void; onBack?: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-cyan-200/20 bg-slate-950 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.32),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(250,204,21,.22),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(99,102,241,.28),transparent_34%)]" />

      <div className="relative grid min-h-[560px] gap-8 p-6 md:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div>
          {onBack ? (
            <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-200 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to course
            </button>
          ) : null}
          <div className="inline-flex items-center gap-2 rounded-md border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-100">
            <Sparkles className="h-4 w-4" />
            EIS Grade 8 Mathematics
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl lg:text-6xl">
            {placeValueLessonData.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{placeValueLessonData.subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onStart} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-100">
              Start Lesson <ChevronRight className="h-5 w-5" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200">
              <Award className="h-5 w-5 text-amber-200" />
              {placeValueLessonData.rewards.xp} XP + {placeValueLessonData.rewards.badge}
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
          <div className="absolute inset-5 rounded-lg border border-cyan-200/20 bg-slate-950/80" />
          <div className="relative grid h-full min-h-[380px] place-items-center [perspective:1000px]">
            <div className="grid grid-cols-4 gap-4" style={{ transform: 'rotateX(58deg) rotateZ(-28deg)', transformStyle: 'preserve-3d' }}>
              {places.map((place, column) => (
                <div key={place.id} className="grid gap-2">
                  {Array.from({ length: column + 2 }, (_, index) => (
                    <span
                      key={index}
                      className="h-12 w-12 rounded-md border border-white/20 shadow-[10px_10px_0_rgba(15,23,42,.75)] motion-safe:animate-pulse"
                      style={{ background: place.color, animationDelay: `${index * 120}ms`, transform: `translateZ(${index * 8}px)` }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-0 right-0 grid grid-cols-4 gap-2 text-center text-xs font-black uppercase tracking-wide text-slate-200">
              {places.map((place) => <span key={place.id}>{place.label}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaceValueTower() {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Cinematic concept</p>
          <h2 className="text-2xl font-black">Every step left is x10. Every step right is /10.</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-300">A digit is not powerful by itself. Its position gives it power.</p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {places.map((place, index) => (
          <div key={place.id} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/10 p-4">
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: place.color }} />
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Place {index + 1}</p>
            <p className="mt-2 text-2xl font-black">{place.label}</p>
            <p className="mt-2 font-mono text-lg text-amber-100">x {place.multiplier}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-cyan-200/20 bg-cyan-200/10 p-4">
          <p className="flex items-center gap-2 font-bold text-cyan-100"><ArrowLeft className="h-5 w-5" />Move left</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">The digit becomes ten times larger because it moves into a stronger place.</p>
        </div>
        <div className="rounded-lg border border-amber-200/20 bg-amber-200/10 p-4">
          <p className="flex items-center gap-2 font-bold text-amber-100">Move right <ArrowRight className="h-5 w-5" /></p>
          <p className="mt-2 text-sm leading-6 text-slate-200">The digit becomes ten times smaller because it moves into a weaker place.</p>
        </div>
      </div>
    </section>
  );
}

export function BaseTenBlockScene({ example, activePlace }: { example: PlaceValueExample; activePlace: PlaceName }) {
  const activeDigit = getDigitForPlace(example, activePlace);

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Animated base-ten blocks</p>
          <h3 className="text-xl font-black">{activeDigit.digit} {activePlace} = {formatNumber(activeDigit.value)}</h3>
        </div>
        <Cuboid className="h-8 w-8 text-amber-200" />
      </div>

      <div className="mt-5 min-h-72 overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,.18),transparent_35%)] p-6 [perspective:1000px]">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-5 md:grid-cols-4">
          {places.map((place) => {
            const digit = getDigitForPlace(example, place.id);
            const count = Math.max(1, Math.min(digit.digit || 1, 9));
            const isActive = activePlace === place.id;

            return (
              <div key={place.id} className={`rounded-lg border p-3 transition ${isActive ? 'border-cyan-200 bg-white/15 shadow-[0_0_35px_rgba(56,189,248,.28)]' : 'border-white/10 bg-white/5'}`}>
                <p className="text-center text-xs font-black uppercase tracking-wide text-slate-300">{place.label}</p>
                <div className="mt-4 grid min-h-44 place-items-center">
                  <div className="grid grid-cols-3 gap-1.5" style={{ transform: isActive ? 'rotateX(56deg) rotateZ(-26deg)' : 'rotateX(58deg) rotateZ(-28deg)', transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: count }, (_, index) => (
                      <span
                        key={index}
                        className={`rounded-sm border border-white/20 shadow-[6px_6px_0_rgba(15,23,42,.72)] transition motion-safe:animate-pulse ${place.id === 'ones' ? 'h-7 w-7' : place.id === 'tens' ? 'h-7 w-12' : place.id === 'hundreds' ? 'h-12 w-12' : 'h-14 w-14'}`}
                        style={{ background: place.color, animationDelay: `${index * 80}ms`, opacity: digit.digit === 0 ? 0.25 : 1, transform: `translateZ(${index * 3}px)` }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-center text-sm font-bold text-white">{digit.digit} x {place.multiplier}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ExpandedFormPanel({ example, activePlace, onSelectPlace }: { example: PlaceValueExample; activePlace: PlaceName; onSelectPlace: (place: PlaceName) => void }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Guided example</p>
      <h3 className="mt-1 text-2xl font-black">{example.number}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{example.explanation}</p>

      <div className="mt-5 grid grid-cols-4 gap-2" role="group" aria-label={`Digits in ${example.number}`}>
        {example.digits.map((digit) => {
          const place = places.find((item) => item.id === digit.place) ?? places[0];
          const isActive = activePlace === digit.place;

          return (
            <button
              key={digit.place}
              onClick={() => onSelectPlace(digit.place)}
              className={`rounded-lg border p-3 text-center transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${isActive ? 'border-cyan-400 bg-cyan-50 shadow-lg' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
              aria-pressed={isActive}
            >
              <span className="block text-4xl font-black" style={{ color: place.color }}>{digit.digit}</span>
              <span className="mt-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{place.label}</span>
              <span className="mt-1 block text-sm font-bold text-slate-900">{formatNumber(digit.value)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg bg-slate-950 p-4 font-mono text-sm font-bold leading-7 text-white">
        {example.digits.map((digit, index) => (
          <span key={digit.place} className={activePlace === digit.place ? 'text-cyan-200' : ''}>
            {index > 0 ? ' + ' : ''}
            {digit.digit} x {digit.multiplier}
          </span>
        ))}
        <div className="mt-2 text-amber-200">{example.expandedForm}</div>
      </div>
    </section>
  );
}

export function DigitValueExplorer() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceName>('thousands');
  const place = places.find((item) => item.id === selectedPlace) ?? places[0];
  const value = 5 * place.multiplier;

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white">
      <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Interactive digit explorer</p>
      <h3 className="mt-1 text-2xl font-black">Move the digit 5. Watch its power change.</h3>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {places.map((item) => {
            const active = selectedPlace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPlace(item.id)}
                className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${active ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/10 bg-white/5 text-white hover:border-white/40'}`}
                aria-pressed={active}
              >
                <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                <span className="mt-2 block text-2xl font-black">{5 * item.multiplier}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-white/10 bg-white/10 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-300">Current value</p>
            <Gem className="h-6 w-6 text-amber-200" />
          </div>
          <div className="mt-4 grid place-items-center rounded-lg bg-slate-950 p-8">
            <span className="text-7xl font-black" style={{ color: place.color }}>5</span>
            <span className="mt-2 text-xl font-black text-white">{place.label}</span>
            <span className="mt-3 rounded-md bg-white px-4 py-2 font-mono text-xl font-black text-slate-950">5 x {place.multiplier} = {formatNumber(value)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ZeroPlaceholderDemo() {
  const [removed, setRemoved] = useState(false);

  return (
    <section className="rounded-lg border border-amber-200/20 bg-slate-950 p-5 text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-100">Zero as placeholder</p>
          <h3 className="mt-1 text-2xl font-black">Zero can hold a place even when there are no tens.</h3>
        </div>
        <button onClick={() => setRemoved((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-200 px-4 py-2 font-bold text-slate-950 transition hover:bg-amber-100">
          {removed ? 'Restore zero' : 'Remove zero'}
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-white/10 p-5">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { digit: 7, label: 'Thousands' },
              { digit: 3, label: 'Hundreds' },
              { digit: 0, label: 'Tens' },
              { digit: 5, label: 'Ones' },
            ].map((item) => {
              const hidden = removed && item.digit === 0;
              return (
                <div key={item.label} className={`rounded-lg border p-4 transition ${item.digit === 0 ? 'border-amber-200 bg-amber-200/10' : 'border-white/10 bg-slate-950'} ${hidden ? 'scale-75 opacity-20' : 'scale-100 opacity-100'}`}>
                  <p className="text-5xl font-black text-white">{hidden ? ' ' : item.digit}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg bg-white p-4 text-center text-4xl font-black text-slate-950">
            {removed ? '735' : '7,305'}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
          <p className="text-lg font-black">{removed ? 'The value changed.' : 'The zero is doing a job.'}</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {removed
              ? 'Without the zero, the 3 slides from the hundreds place into the tens place. The number is no longer seven thousand three hundred five.'
              : 'In 7,305, the zero says there are no tens, while keeping the 3 in the hundreds place.'}
          </p>
          <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm font-bold text-white">
            7,305 = 7 x 1000 + 3 x 100 + 0 x 10 + 5
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlaceValueQuiz({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const questions = placeValueLessonData.quizQuestions;
  const answeredCount = Object.keys(answers).length;
  const score = questions.filter((question) => answers[question.id] === question.answer).length;
  const complete = answeredCount === questions.length;

  return (
    <section className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Quiz mode</p>
          <h3 className="text-2xl font-black">Prove your place-value power</h3>
        </div>
        <div className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white">Score {score}/{questions.length}</div>
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((question, questionIndex) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;

          return (
            <article key={question.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-900">{questionIndex + 1}. {question.prompt}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {question.options.map((option) => {
                  const chosen = selected === option;
                  const correct = question.answer === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                      className={`rounded-lg border p-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${chosen && correct ? 'border-green-400 bg-green-50 text-green-900' : chosen ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-100'}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {selected ? (
                <div className={`mt-3 flex gap-2 rounded-lg p-3 text-sm leading-6 ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`} role="status">
                  {isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0" />}
                  <span>{question.explanation}</span>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <button
        disabled={!complete}
        onClick={() => onComplete(score, questions.length)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Complete Lesson <Trophy className="h-5 w-5" />
      </button>
    </section>
  );
}

export function LessonCompletionReward({ score, total }: { score: number; total: number }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-amber-200/30 bg-slate-950 p-6 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(250,204,21,.28),transparent_34%),radial-gradient(circle_at_20%_75%,rgba(56,189,248,.28),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            className="absolute h-2 w-2 rounded-full motion-safe:animate-bounce"
            style={{ left: `${(index * 37) % 100}%`, top: `${(index * 19) % 90}%`, background: index % 2 ? '#facc15' : '#38bdf8', animationDelay: `${index * 80}ms` }}
          />
        ))}
      </div>
      <div className="relative mx-auto max-w-xl">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-200 text-slate-950 shadow-[0_0_45px_rgba(250,204,21,.42)]">
          <Trophy className="h-10 w-10" />
        </div>
        <h3 className="mt-5 text-3xl font-black">Lesson Complete</h3>
        <p className="mt-3 text-lg text-slate-200">Score: {score}/{total}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">XP gained</p>
            <p className="mt-1 text-3xl font-black text-amber-100">+{placeValueLessonData.rewards.xp}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Badge</p>
            <p className="mt-1 text-2xl font-black text-cyan-100">{placeValueLessonData.rewards.badge}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlaceValueLessonPage({ onBack }: { onBack?: () => void }) {
  const [started, setStarted] = useState(false);
  const [activeExampleId, setActiveExampleId] = useState<string>(placeValueLessonData.examples[0].id);
  const [activePlace, setActivePlace] = useState<PlaceName>('thousands');
  const [reward, setReward] = useState<{ score: number; total: number } | null>(null);

  const activeExample = useMemo(
    () => placeValueLessonData.examples.find((example) => example.id === activeExampleId) ?? placeValueLessonData.examples[0],
    [activeExampleId],
  );

  const selectExample = (id: string) => {
    setActiveExampleId(id);
    setActivePlace('thousands');
  };

  return (
    <div className="space-y-6 bg-slate-950 text-white md:rounded-lg">
      <PlaceValueHero onStart={() => setStarted(true)} onBack={onBack} />

      {started ? (
        <div className="space-y-6 p-4 md:p-6">
          <section className="rounded-lg border border-white/10 bg-white/10 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Learning objectives</p>
                <h2 className="text-2xl font-black">By the end, students can explain where number power comes from.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {placeValueLessonData.vocabulary.map((word) => (
                  <span key={word} className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-200">{word}</span>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {placeValueLessonData.objectives.map((objective) => (
                <div key={objective} className="rounded-lg border border-white/10 bg-slate-950 p-4">
                  <CircleDot className="mb-3 h-5 w-5 text-cyan-200" />
                  <p className="text-sm leading-6 text-slate-200">{objective}</p>
                </div>
              ))}
            </div>
          </section>

          <PlaceValueTower />

          <section className="rounded-lg border border-white/10 bg-white/10 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Examples</p>
                <h2 className="text-2xl font-black">Tap a digit. The blocks and expanded form update.</h2>
              </div>
              <div className="flex gap-2">
                {placeValueLessonData.examples.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => selectExample(example.id)}
                    className={`rounded-md px-4 py-2 text-sm font-bold transition ${activeExampleId === example.id ? 'bg-cyan-200 text-slate-950' : 'border border-white/10 bg-slate-950 text-white hover:border-white/40'}`}
                  >
                    {example.number}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <ExpandedFormPanel example={activeExample} activePlace={activePlace} onSelectPlace={setActivePlace} />
              <BaseTenBlockScene example={activeExample} activePlace={activePlace} />
            </div>
          </section>

          <DigitValueExplorer />
          <ZeroPlaceholderDemo />
          <PlaceValueQuiz onComplete={(score, total) => setReward({ score, total })} />
          {reward ? <LessonCompletionReward score={reward.score} total={reward.total} /> : null}
        </div>
      ) : null}
    </div>
  );
}
