import type { ThreeDType } from '@/lib/grade8Curriculum';
import type { LearningModality, SubjectLabel, SubjectLesson } from '@/lib/subjects/types';
import type { CinematicLessonSpec, CinematicSceneType } from './types';

export const cinematicMathMap: Partial<Record<CinematicSceneType, ThreeDType>> = {
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

export const cinematicScienceMap: Partial<Record<CinematicSceneType, string>> = {
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

export const cinematicEnglishMap: Partial<Record<CinematicSceneType, string>> = {
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

export function subjectLabel(subject: CinematicLessonSpec['subject']): SubjectLabel {
  if (subject === 'science') return 'Science';
  if (subject === 'english') return 'English';
  return 'Mathematics';
}

export function modalityFor(spec: CinematicLessonSpec): LearningModality {
  if (spec.subject === 'science') return spec.analytics.eventType === 'virtual_lab' ? 'virtual_lab' : 'simulation';
  if (spec.subject === 'english') return spec.analytics.eventType === 'writing_submission' ? 'writing_workshop' : 'reading_analysis';
  return '3d_interactive';
}

export function interactiveTypeFor(spec: CinematicLessonSpec): string {
  return cinematicScienceMap[spec.sceneType] ?? cinematicEnglishMap[spec.sceneType] ?? spec.sceneType;
}

export function lessonFromCinematicSpec(spec: CinematicLessonSpec, interactiveType = interactiveTypeFor(spec)): SubjectLesson {
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
