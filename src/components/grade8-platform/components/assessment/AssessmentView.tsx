import React from 'react';
import { ClipboardList, Award, Scale, HelpCircle, Lightbulb } from 'lucide-react';
import { UnitId, SubjectId } from '../../types';
import { assessmentsData } from '../../data/assessmentData';
import { QuickAssignButton } from '../QuickAssignButton';

export function AssessmentView({ unit = 'unit1', subject = 'math' }: { unit?: UnitId, subject?: SubjectId }) {
  const subjectData = assessmentsData[subject];

  const getTheme = () => {
    switch (subject) {
      case 'math': return { theme: 'text-rose-500', bg: 'bg-rose-50 border-rose-100', badge: 'bg-rose-100 text-rose-700' };
      case 'science': return { theme: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' };
      case 'english': return { theme: 'text-amber-500', bg: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-700' };
      default: return { theme: 'text-slate-500', bg: 'bg-slate-50 border-slate-100', badge: 'bg-slate-100 text-slate-700' };
    }
  };

  const { theme, bg, badge } = getTheme();

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-2 flex items-center justify-center gap-3">
          <ClipboardList className={`w-8 h-8 ${theme}`} />
          Teacher Resource: Differentiated IB Assessments
        </h1>
        <p className="text-slate-500 font-medium">Select from 3 differentiated options per criterion to assign to your students.</p>
      </header>

      <div className="space-y-8">
        
        {/* Criterion A */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Award className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Criterion A</h2>
            <span className={`py-1 px-3 text-xs font-bold rounded-full ${badge}`}>Knowing & Understanding (Max 8)</span>
          </div>
          <div className="space-y-6 text-slate-700 relative z-10">
            {subjectData.criteriaA.map((option: any, idx: number) => (
              <div key={idx} className={`p-5 rounded-2xl border ${bg}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${theme.replace('text-', 'bg-')}`}>{idx + 1}</span>
                    {option.optionTitle}
                  </h3>
                  <QuickAssignButton refId={`assess-${subject}-${unit}-A-${idx}`} label={option.optionTitle} subject={subject} unit={unit} kind="exercise" defaultTitle={`Criterion A – ${option.optionTitle}`} />
                </div>
                {option.questions ? (
                   <ul className="space-y-2">
                     {option.questions.map((q: any) => (
                       <li key={q.id} className="text-sm bg-white p-3 rounded-lg border border-slate-100">
                         <strong>Q:</strong> {q.question}
                       </li>
                     ))}
                   </ul>
                ) : (
                  <p className="text-sm bg-white p-4 rounded-xl border border-slate-100">{option.prompt}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Criterion B */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Lightbulb className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Criterion B</h2>
            <span className="py-1 px-3 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Investigating / Organizing (Max 8)</span>
          </div>
          <div className="space-y-6 text-slate-700 relative z-10">
             {subjectData.criteriaB.map((option: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl border bg-blue-50 border-blue-100">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-blue-500 shrink-0">{idx + 1}</span>
                    {option.optionTitle}
                  </h3>
                  <QuickAssignButton refId={`assess-${subject}-${unit}-B-${idx}`} label={option.optionTitle} subject={subject} unit={unit} kind="exercise" defaultTitle={`Criterion B – ${option.optionTitle}`} />
                </div>
                {option.description && <p className="mb-3 text-sm font-medium">{option.description}</p>}
                {option.questions ? (
                  <ul className="list-decimal pl-5 space-y-1 text-sm bg-white p-4 rounded-xl border border-blue-100">
                    {option.questions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm bg-white p-4 rounded-xl border border-blue-100">{option.prompt}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Criterion C */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <HelpCircle className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Criterion C</h2>
            <span className="py-1 px-3 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Communicating / Evaluating (Max 8)</span>
          </div>
          <div className="space-y-6 text-slate-700 relative z-10">
             {subjectData.criteriaC.map((option: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl border bg-purple-50 border-purple-100">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-purple-900 text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-purple-500 shrink-0">{idx + 1}</span>
                    {option.optionTitle}
                  </h3>
                  <QuickAssignButton refId={`assess-${subject}-${unit}-C-${idx}`} label={option.optionTitle} subject={subject} unit={unit} kind="exercise" defaultTitle={`Criterion C – ${option.optionTitle}`} />
                </div>
                <p className="text-sm bg-white p-4 rounded-xl border border-purple-100">{option.prompt}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Criterion D */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Scale className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Criterion D</h2>
            <span className="py-1 px-3 bg-fuchsia-100 text-fuchsia-700 text-xs font-bold rounded-full">Applying / Reflecting (Max 8)</span>
          </div>
          <div className="space-y-6 text-slate-700 relative z-10">
             {subjectData.criteriaD.map((option: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl border bg-fuchsia-50 border-fuchsia-100">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-fuchsia-900 text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-fuchsia-500 shrink-0">{idx + 1}</span>
                    {option.optionTitle}
                  </h3>
                  <QuickAssignButton refId={`assess-${subject}-${unit}-D-${idx}`} label={option.optionTitle} subject={subject} unit={unit} kind="exercise" defaultTitle={`Criterion D – ${option.optionTitle}`} />
                </div>
                {option.scenario && (
                  <div className="mb-3 text-sm bg-white p-4 rounded-xl border border-fuchsia-100">
                    <strong className="block mb-1 text-fuchsia-900">Scenario:</strong>
                    {option.scenario}
                  </div>
                )}
                {option.questions ? (
                  <ul className="list-decimal pl-5 space-y-1 text-sm bg-white p-4 rounded-xl border border-fuchsia-100">
                    {option.questions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm bg-white p-4 rounded-xl border border-fuchsia-100">{option.prompt}</p>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
