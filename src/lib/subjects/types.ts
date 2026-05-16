// Universal subject architecture. The shapes below let Maths, Science, and
// English share the Hub (mastery, recommendations, LearningEvent ingestion)
// without each subject reinventing its own model.

export type SubjectId = 'mathematics' | 'science' | 'english';
export type SubjectLabel = 'Mathematics' | 'Science' | 'English';
export type GradeLevel = 'Grade 8';

export type LearningModality =
  | '3d_interactive'
  | 'animated_explainer'
  | 'simulation'
  | 'virtual_lab'
  | 'reading_analysis'
  | 'writing_workshop'
  | 'speaking_practice'
  | 'quiz'
  | 'assignment'
  | 'project'
  | 'discussion';

export type SubjectLessonQuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'extended_response'
  | 'essay'
  | 'lab_response'
  | 'annotation'
  | 'oral_response';

export type ScienceInteractiveType =
  | 'cell_3d'
  | 'body_system_3d'
  | 'particle_model_3d'
  | 'chemical_reaction_lab'
  | 'forces_motion_sim'
  | 'energy_transfer_sim'
  | 'electric_circuit_builder'
  | 'ecosystem_simulation'
  | 'earth_space_orbit'
  | 'scientific_method_lab';

export type EnglishInteractiveType =
  | 'text_annotation_lab'
  | 'story_structure_map'
  | 'character_analysis_board'
  | 'poetry_device_highlighter'
  | 'grammar_sentence_builder'
  | 'essay_planner'
  | 'vocabulary_practice'
  | 'debate_simulator'
  | 'speaking_feedback'
  | 'writing_revision_studio';

export type SubjectInteractiveType = ScienceInteractiveType | EnglishInteractiveType | string;

export type SubjectLesson = {
  id: string;
  subject: SubjectId;
  subjectLabel: SubjectLabel;
  grade: GradeLevel;
  unitId: string;
  unitTitle: string;
  strand: string;
  topic: string;
  title: string;

  inquiryQuestion: string;
  statementOfInquiry?: string;
  keyConcept?: string;
  relatedConcepts?: string[];

  objectives: string[];
  studentExplanation: string;
  teacherNotes: string;
  animatedSteps: string[];

  interactiveType: SubjectInteractiveType;
  modality: LearningModality;

  workedExamples?: {
    prompt: string;
    steps: string[];
    answer: string;
  }[];

  practiceQuestions: {
    id: string;
    type: SubjectLessonQuestionType;
    question: string;
    choices?: string[];
    answer?: string;
    rubric?: string;
    explanation?: string;
    marks?: number;
  }[];

  assignmentQuestions: {
    id: string;
    question: string;
    expectedAnswer?: string;
    rubric: string;
    marks: number;
  }[];

  extensionChallenge: string;
};

export type SubjectUnit = {
  id: string;
  subject: SubjectId;
  subjectLabel: SubjectLabel;
  grade: GradeLevel;
  title: string;
  strand: string;
  inquiryQuestion: string;
  statementOfInquiry?: string;
  keyConcept?: string;
  relatedConcepts?: string[];
  lessons: SubjectLesson[];
};
