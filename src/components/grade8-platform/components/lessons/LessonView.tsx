import React, { useState, useEffect } from 'react';
import { examplesData } from '../../data/curriculumData';
import { unit2Examples } from '../../data/unit2Data';
import { unit3Examples } from '../../data/unit3Data';
import { unit4Examples } from '../../data/unit4Data';
import { englishUnit1Examples, englishUnit2Examples, englishUnit3Examples, englishUnit4Examples, englishUnit5Examples } from '../../data/englishCurriculum';
import { scienceUnit1Examples, scienceUnit2Examples, scienceUnit3Examples, scienceUnit4Examples, scienceUnit5Examples, scienceUnit6Examples } from '../../data/scienceCurriculum';
import { BookOpen, ChevronRight, Lightbulb, Calculator, Info, PenTool, ChevronDown, ChevronUp } from 'lucide-react';
import { UnitId, Example, SubjectId } from '../../types';
import { ExampleGraph } from './ExampleGraph';

/**
 * Renders a single solved-example step in a clean textbook style:
 *
 *   • "Step N:" lifts out as a bold blue heading
 *   • The English explanation stays as regular sans-serif body text
 *   • The mathematical expression after the final ":" or after a clear
 *     equation marker drops to its own centered display line in a
 *     serif math face — no more monospace typewriter look.
 *
 * Accepts strings such as
 *    "Step 1: Calculate 5% of 150: 0.05 × 150 = 7.5"
 *    "Final Answer: 157.5 AED"
 *    "Multiply both sides by 4: 4x = 24"
 *
 * If no recognisable structure is found, falls back to a plain paragraph.
 */
function MathStep({ text, tone = 'blue' }: { text: string; tone?: 'blue' | 'amber' | 'slate' }) {
  // Normalise ASCII operators to their proper Unicode glyphs.
  const normalize = (s: string) =>
    s
      .replace(/\s\*\s/g, ' × ')
      .replace(/(\d)\*(\d)/g, '$1×$2')
      .replace(/\s\/\s/g, ' ÷ ')
      .replace(/\\n/g, '\n');

  // Render the inline body, treating **…** as <strong> (existing convention).
  const renderInline = (input: string) => {
    const out: React.ReactNode[] = [];
    const re = /\*\*(.*?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(input)) !== null) {
      if (m.index > last) out.push(input.slice(last, m.index));
      out.push(
        <strong key={out.length} className="font-bold text-slate-900">
          {m[1]}
        </strong>,
      );
      last = m.index + m[0].length;
    }
    if (last < input.length) out.push(input.slice(last));
    return out;
  };

  const looksLikeEquation = (s: string) => /=|→|->/.test(s) && /[0-9x-z()×÷+\-]/i.test(s);
  const stepMatch = text.match(/^\s*(Step\s*\d+|Final\s*Answer|Answer|Method\s*\d+)\s*:\s*(.*)$/i);

  let heading: string | null = null;
  let rest = normalize(text);

  if (stepMatch) {
    heading = stepMatch[1];
    rest = normalize(stepMatch[2]);
  }

  // If the rest contains a colon followed by an equation, split it.
  let body: string | null = rest;
  let equation: string | null = null;
  const colonSplit = rest.split(/\s*:\s+/);
  if (colonSplit.length >= 2 && looksLikeEquation(colonSplit[colonSplit.length - 1])) {
    equation = colonSplit.pop()!.trim();
    body = colonSplit.join(': ').trim() || null;
  } else if (!stepMatch && looksLikeEquation(rest)) {
    // No "Step N:" prefix but the whole line is an equation
    body = null;
    equation = rest;
  }

  const headingColor =
    tone === 'amber'
      ? 'text-amber-700'
      : tone === 'slate'
        ? 'text-slate-700'
        : 'text-blue-600';

  return (
    <div className="text-slate-700 leading-relaxed">
      {heading && (
        <p className={`mb-1 text-base font-bold ${headingColor}`}>{heading}</p>
      )}
      {body && (
        <p className="text-base">{renderInline(body)}</p>
      )}
      {equation && (
        <div className="my-3 flex justify-center">
          <span
            className="inline-block rounded-md border border-slate-200 bg-slate-50 px-5 py-2 text-lg text-slate-900"
            style={{ fontFamily: 'Cambria Math, Cambria, Georgia, "Times New Roman", serif' }}
          >
            {equation}
          </span>
        </div>
      )}
    </div>
  );
}

function TechniqueCard({ tech }: { tech: any; key?: React.Key }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`border rounded-xl mb-3 overflow-hidden cursor-pointer transition-all duration-200 ${expanded ? 'bg-white shadow-md border-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center p-4">
        <span className={`font-bold block ${tech.color || 'text-slate-900'}`}>{tech.name}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed">
          <div className="h-px w-full bg-slate-100 mb-3" />
          <p>{tech.description}</p>
          {tech.excerpt && (
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 italic mt-3">
               "{tech.excerpt.split('**').map((part: string, i: number) => {
                 return i % 2 !== 0 
                   ? <strong key={i} className={`font-black not-italic ${tech.color || 'text-slate-900'}`}>{part}</strong> 
                   : <span key={i}>{part}</span>
               })}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { solvedExamplesData } from '../../data/solvedExamplesData';
import { QuickAssignButton } from '../QuickAssignButton';

export function LessonView({ unit, subject }: { unit: UnitId, subject?: SubjectId }) {
  const getData = (): Example[] => {
    if (subject === 'science') {
      if (unit === 'unit1') return scienceUnit1Examples;
      if (unit === 'unit2') return scienceUnit2Examples;
      if (unit === 'unit3') return scienceUnit3Examples;
      if (unit === 'unit4') return scienceUnit4Examples;
      if (unit === 'unit5') return scienceUnit5Examples;
      if (unit === 'unit6') return scienceUnit6Examples;
      return [];
    }

    if (subject === 'english') {
      if (unit === 'unit1') return englishUnit1Examples;
      if (unit === 'unit2') return englishUnit2Examples;
      if (unit === 'unit3') return englishUnit3Examples;
      if (unit === 'unit4') return englishUnit4Examples;
      if (unit === 'unit5') return englishUnit5Examples;
      return [];
    }

    switch (unit) {
      case 'unit1': return examplesData;
      case 'unit2': return unit2Examples;
      case 'unit3': return unit3Examples;
      case 'unit4': return unit4Examples;
      default: return examplesData;
    }
  };

  const getTitle = () => {
    if (subject === 'english') {
      if (unit === 'unit1') return '1.2 Core Topics & Class Exercises';
      if (unit === 'unit2') return '2.2 Core Topics & Class Exercises';
      if (unit === 'unit3') return '3.2 Core Topics & Class Exercises';
      if (unit === 'unit4') return '4.2 Core Topics & Class Exercises';
      if (unit === 'unit5') return '5.2 Core Topics & Class Exercises';
      return 'Core Topics & Class Exercises';
    }

    switch (unit) {
      case 'unit1': return '1.1 Proportional Reasoning & Percentages';
      case 'unit2': return '2.1 & 2.2 Models and Functions';
      case 'unit3': return '3.1 & 3.2 3D Geometry and Transformations';
      case 'unit4': return '4.1 & 4.2 Statistics and Probability';
      default: return '';
    }
  };

  const getColorTheme = () => {
    if (subject === 'english') {
       return { text: 'text-amber-600', activeText: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', activeRing: 'ring-amber-500/20', activeBorder: 'border-amber-500' };
    }

    switch (unit) {
      case 'unit1': return { text: 'text-cyan-600', activeText: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100', activeRing: 'ring-cyan-500/20', activeBorder: 'border-cyan-500' };
      case 'unit2': return { text: 'text-violet-600', activeText: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100', activeRing: 'ring-violet-500/20', activeBorder: 'border-violet-500' };
      case 'unit3': return { text: 'text-emerald-600', activeText: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', activeRing: 'ring-emerald-500/20', activeBorder: 'border-emerald-500' };
      case 'unit4': return { text: 'text-amber-600', activeText: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', activeRing: 'ring-amber-500/20', activeBorder: 'border-amber-500' };
      default: return { text: 'text-cyan-600', activeText: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100', activeRing: 'ring-cyan-500/20', activeBorder: 'border-cyan-500' };
    }
  };

  const data = getData();
  const theme = getColorTheme();
  
  const [activeExample, setActiveExample] = useState<string>(data[0]?.id || '');

  // Reset active example on unit change
  useEffect(() => {
    if (data.length > 0) setActiveExample(data[0].id);
  }, [unit, subject, data]);

  return (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 shrink-0">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-2">
          {getTitle()}
        </h1>
        <p className="text-slate-500 font-medium tracking-wide">
          {subject === 'math' ? "Subtopics & Explanations" : "Worked Examples & Step-by-Step Methods"}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {data.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Lessons Available</h3>
            <p className="text-slate-500">Content for this unit is currently being updated. Please check back later.</p>
          </div>
        ) : (
          <>
            {/* Sidebar for Examples List */}
            <div className="lg:w-1/4 xl:w-1/5 shrink-0 space-y-3">
              {data.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveExample(ex.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    activeExample === ex.id 
                      ? `bg-white shadow-sm ring-1 ${theme.activeRing} ${theme.activeBorder}`
                      : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-bold mb-1 block ${theme.text}`}>
                      {subject === 'math' ? 'SUBTOPIC' : 'EXAMPLE'}
                    </span>
                    <span className={`font-semibold ${activeExample === ex.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {ex.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${activeExample === ex.id ? theme.activeText : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Content Area for Active Example */}
            <div className="lg:w-3/4 xl:w-4/5 flex flex-col relative pb-32">
              {data.map((ex) => {
                if (activeExample !== ex.id) return null;
            return (
              <div key={ex.id} className="animate-in fade-in duration-300 py-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{ex.title}</h2>
                
                <div className={`border rounded-2xl p-5 mb-8 font-medium text-lg leading-relaxed shadow-sm ${theme.bg} ${theme.border} ${theme.text.replace('text-', 'text-').replace('600', '900')}`}>
                  {subject === 'math' ? <span className="block mb-2 font-bold text-slate-800">Concept Context:</span> : null}
                  {ex.problem}
                </div>

                {ex.context && (
                <div className="flex items-start gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                  <Info className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {subject === 'math' ? <strong className="block mb-1 text-slate-800">Why it matters:</strong> : null}
                    {ex.context}
                  </p>
                </div>
                )}

                {ex.interactiveUrl && (
                  <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white mb-8 relative">
                    <div className="absolute top-0 left-0 right-0 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-4 py-2 uppercase tracking-wide flex justify-between items-center z-10 pointer-events-none">
                      <span>Interactive Explorer</span>
                      <span className="text-slate-300 font-normal normal-case">Manipulate directly to see changes</span>
                    </div>
                    <iframe
                      src={ex.interactiveUrl}
                      className="w-full h-full pt-8"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <ExampleGraph exampleId={ex.id} />

                {subject === 'math' && (ex.solvedExamples || solvedExamplesData[ex.id]) && (ex.solvedExamples || solvedExamplesData[ex.id]).length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">5 Solved Examples</h3>
                    <div className="space-y-6">
                      {(ex.solvedExamples || solvedExamplesData[ex.id]).map((se, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-slate-50 p-4 border-b border-slate-200 font-medium text-slate-800 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-blue-600 font-bold mr-2">Example {idx + 1}:</span>
                              {se.question}
                            </div>
                            {subject && (
                              <QuickAssignButton
                                refId={`example-${subject}-${unit}-${ex.id}-${idx}`}
                                label={se.question}
                                subject={subject as SubjectId}
                                unit={unit}
                                kind="exercise"
                                defaultTitle={`${ex.title} · Example ${idx + 1}`}
                              />
                            )}
                          </div>
                          <div className="p-5 bg-white space-y-3">
                            <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider mb-1">Solution</h4>
                            {se.solution.map((step, sIdx) => (
                              <MathStep key={sIdx} text={step} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`grid ${ex.method2Steps && ex.method2Steps.length > 0 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8 mt-8`}>
                  {/* Method 1 / Techniques */}
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                      {subject === 'english' ? <PenTool className={`w-5 h-5 ${theme.activeText}`} /> : <Calculator className={`w-5 h-5 ${theme.activeText}`} />}
                      {ex.method1Name || 'Standard Method'}
                    </h3>
                    <div className="space-y-4">
                      {ex.techniques ? (
                        ex.techniques.map((tech, idx) => (
                           <TechniqueCard key={idx} tech={tech} />
                        ))
                      ) : (
                        ex.method1Steps && ex.method1Steps.map((step, idx) => {
                          // Each line may bundle several sub-lines separated by literal "\n".
                          const parts = step.split('\\n');
                          return (
                            <div
                              key={idx}
                              className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-2"
                            >
                              {parts.map((part, i) => (
                                <MathStep key={i} text={part} tone="blue" />
                              ))}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Method 2 / Alternate */}
                  {ex.method2Steps && ex.method2Steps.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        {subject === 'english' ? ex.method2Name : `Alternate: ${ex.method2Name}`}
                      </h3>
                      <div className="space-y-4">
                        {ex.method2Steps.map((step, idx) => {
                          const parts = step.split('\\n');
                          return (
                            <div
                              key={idx}
                              className="p-5 bg-amber-50/50 rounded-xl border border-amber-100/50 space-y-2"
                            >
                              {parts.map((part, i) => (
                                <MathStep key={i} text={part} tone="amber" />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
