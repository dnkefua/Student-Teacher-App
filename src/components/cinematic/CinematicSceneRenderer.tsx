'use client';

import React, { useMemo } from 'react';
import { Box, Sparkles } from 'lucide-react';
import { ExplainerByType } from '@/components/Math3DExplainers';
import { ScienceInteractiveRenderer } from '@/components/science/ScienceInteractiveRenderer';
import { EnglishInteractiveRenderer } from '@/components/english/EnglishInteractiveRenderer';
import type { ThreeDType } from '@/lib/grade8Curriculum';
import type { SubjectLesson, SubjectLabel, LearningModality } from '@/lib/subjects/types';
import type { CinematicInteractionEvent, CinematicLessonSpec, CinematicSceneType } from '@/lib/cinematic/types';

type Props = {
  spec: CinematicLessonSpec;
  currentStepId?: string;
  onInteraction?: (event: CinematicInteractionEvent) => void;
};

const mathMap: Partial<Record<CinematicSceneType, ThreeDType>> = {
  math_ratio_mixer: 'ratio_mixer_3d',
  math_equation_balance: 'equation_balance_3d',
  math_linear_graph: 'linear_graph_3d',
  math_pythagoras: 'pythagoras_3d',
  math_circle_lab: 'circle_lab_3d',
  math_solid_geometry: 'solid_geometry_3d',
  math_probability_spinner: 'probability_spinner_3d',
  math_percentage_bar: 'percentage_bar_3d',
  math_data_visualisation: 'data_visualisation_3d',
};

const scienceMap: Partial<Record<CinematicSceneType, string>> = {
  science_particle_model: 'particle_model_3d',
  science_cell_3d: 'cell_3d',
  science_forces_motion: 'forces_motion_sim',
  science_circuit_builder: 'electric_circuit_builder',
  science_ecosystem_sim: 'ecosystem_simulation',
  science_chemical_reaction: 'chemical_reaction_lab',
  science_energy_transfer: 'energy_transfer_sim',
  science_earth_space: 'earth_space_orbit',
  science_scientific_method: 'scientific_method_lab',
};

const englishMap: Partial<Record<CinematicSceneType, string>> = {
  english_text_annotation: 'text_annotation_lab',
  english_essay_planner: 'essay_planner',
  english_poetry_highlighter: 'poetry_device_highlighter',
  english_grammar_builder: 'grammar_sentence_builder',
  english_writing_revision: 'writing_revision_studio',
  english_story_map: 'story_structure_map',
  english_character_board: 'character_analysis_board',
  english_debate_simulator: 'debate_simulator',
  english_speaking_feedback: 'speaking_feedback',
};

function subjectLabel(subject: CinematicLessonSpec['subject']): SubjectLabel {
  if (subject === 'science') return 'Science';
  if (subject === 'english') return 'English';
  return 'Mathematics';
}

function modalityFor(spec: CinematicLessonSpec): LearningModality {
  if (spec.subject === 'science') return spec.analytics.eventType === 'virtual_lab' ? 'virtual_lab' : 'simulation';
  if (spec.subject === 'english') return spec.analytics.eventType === 'writing_submission' ? 'writing_workshop' : 'reading_analysis';
  return '3d_interactive';
}

function lessonFromSpec(spec: CinematicLessonSpec, interactiveType: string): SubjectLesson {
  return {
    id: spec.id,
    subject: spec.subject,
    subjectLabel: subjectLabel(spec.subject),
    grade: spec.grade,
    unitId: spec.unitId,
    unitTitle: spec.topic,
    strand: spec.concept,
    topic: spec.topic,
    title: spec.title,
    inquiryQuestion: spec.inquiryQuestion,
    objectives: spec.objectives,
    studentExplanation: spec.storyboard[0]?.narration ?? spec.concept,
    teacherNotes: spec.heygen.script,
    animatedSteps: spec.storyboard.map((step) => step.narration),
    interactiveType,
    modality: modalityFor(spec),
    practiceQuestions: spec.assessment.checkpoints.map((checkpoint) => ({
      id: checkpoint.id,
      type: checkpoint.type === 'writing' ? 'essay' : checkpoint.type === 'annotation' ? 'annotation' : 'short_answer',
      question: checkpoint.prompt,
      answer: checkpoint.expectedAnswer,
      explanation: checkpoint.feedback,
    })),
    assignmentQuestions: spec.assessment.assignmentQuestions,
    extensionChallenge: `Extend this by creating a second example for ${spec.topic}.`,
  };
}

export function CinematicSceneRenderer({ spec, currentStepId, onInteraction }: Props) {
  const activeStep = spec.storyboard.find((step) => step.id === currentStepId) ?? spec.storyboard[0];
  const lesson = useMemo(() => {
    const interactiveType = scienceMap[spec.sceneType] ?? englishMap[spec.sceneType] ?? spec.sceneType;
    return lessonFromSpec(spec, interactiveType);
  }, [spec]);

  const emit = (interactionId: string, action: string, value?: unknown) => {
    onInteraction?.({ lessonId: spec.id, stepId: activeStep?.id, interactionId, action, value });
  };

  let rendered: React.ReactNode = null;
  const mathType = mathMap[spec.sceneType];
  if (mathType) rendered = <ExplainerByType type={mathType} />;
  else if (spec.subject === 'science') rendered = <ScienceInteractiveRenderer lesson={lesson} />;
  else if (spec.subject === 'english') rendered = <EnglishInteractiveRenderer lesson={lesson} />;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Interactive app-rendered scene</p>
          <p className="truncate text-sm font-semibold text-slate-200">{activeStep?.visualAction ?? spec.concept}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
          <Sparkles className="h-3 w-3" />
          {spec.sceneType.replace(/_/g, ' ')}
        </span>
      </div>

      {rendered ?? <PremiumPlaceholder spec={spec} />}

      <div className="grid gap-2 sm:grid-cols-2">
        {spec.interactiveScene.interactions.slice(0, 4).map((interaction) => (
          <button
            key={interaction.id}
            type="button"
            onClick={() => emit(interaction.id, interaction.type, interaction.defaultValue ?? interaction.label)}
            className="rounded-md border border-white/10 bg-[#061126] px-3 py-2 text-left text-xs font-bold text-slate-200 transition hover:border-[#49c8ff]/60 hover:text-white"
          >
            {interaction.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function PremiumPlaceholder({ spec }: { spec: CinematicLessonSpec }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-8 text-center">
      <div>
        <Box className="mx-auto h-10 w-10 text-[#8ddfff]" />
        <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#ffc43b]">Interactive cinematic template coming soon for this concept.</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
          The lesson still runs with storyboard, checkpoints, analytics, assignment, and HeyGen video assets. Scene type: {spec.sceneType}.
        </p>
      </div>
    </div>
  );
}
