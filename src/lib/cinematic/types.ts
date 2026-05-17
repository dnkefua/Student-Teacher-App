export type SubjectId = 'mathematics' | 'science' | 'english';

export type CinematicSceneType =
  | 'math_ratio_mixer'
  | 'math_equation_balance'
  | 'math_linear_graph'
  | 'math_pythagoras'
  | 'math_circle_lab'
  | 'math_solid_geometry'
  | 'math_probability_spinner'
  | 'math_percentage_bar'
  | 'math_data_visualisation'
  | 'science_particle_model'
  | 'science_cell_3d'
  | 'science_forces_motion'
  | 'science_circuit_builder'
  | 'science_ecosystem_sim'
  | 'science_chemical_reaction'
  | 'science_energy_transfer'
  | 'science_earth_space'
  | 'science_scientific_method'
  | 'english_text_annotation'
  | 'english_essay_planner'
  | 'english_poetry_highlighter'
  | 'english_grammar_builder'
  | 'english_writing_revision'
  | 'english_story_map'
  | 'english_character_board'
  | 'english_debate_simulator'
  | 'english_speaking_feedback';

export type CinematicLessonSpec = {
  id: string;
  subject: SubjectId;
  grade: 'Grade 8';
  unitId: string;
  title: string;
  topic: string;
  concept: string;
  inquiryQuestion: string;
  objectives: string[];
  sceneType: CinematicSceneType;
  cinematicStyle: {
    tone: 'premium_school' | 'pixar_inspired' | 'lab_simulation' | 'documentary' | 'exam_coach';
    cameraStyle: 'slow_orbit' | 'zoom_reveal' | 'guided_walkthrough' | 'split_screen' | 'interactive_lab';
    colorTheme: 'math_cyan_gold' | 'science_emerald_cyan' | 'english_purple_gold';
    pacing: 'slow' | 'medium' | 'fast';
  };
  storyboard: CinematicStoryboardStep[];
  interactiveScene: InteractiveSceneSpec;
  heygen: HeyGenLessonVideoSpec;
  assessment: {
    checkpoints: CinematicCheckpoint[];
    assignmentQuestions: {
      id: string;
      question: string;
      expectedAnswer?: string;
      rubric: string;
      marks: number;
    }[];
  };
  analytics: {
    eventSubject: 'Mathematics' | 'Science' | 'English';
    eventType:
      | '3d_interaction'
      | 'simulation_interaction'
      | 'virtual_lab'
      | 'reading_annotation'
      | 'writing_submission'
      | 'assignment_submission';
    masteryConcept: string;
    skillTags: string[];
  };
};

export type CinematicStoryboardStep = {
  id: string;
  title: string;
  narration: string;
  visualAction: string;
  cameraAction?: string;
  highlightObjects?: string[];
  studentPrompt?: string;
  expectedInteraction?: string;
  durationSeconds?: number;
};

export type InteractiveSceneSpec = {
  type: CinematicSceneType;
  objects: SceneObjectSpec[];
  labels: SceneLabelSpec[];
  animations: SceneAnimationSpec[];
  interactions: SceneInteractionSpec[];
  initialState?: Record<string, number | string | boolean>;
};

export type SceneObjectSpec = {
  id: string;
  type:
    | 'cube'
    | 'sphere'
    | 'cylinder'
    | 'line'
    | 'arrow'
    | 'plane'
    | 'text'
    | 'particle_system'
    | 'cell_organelle'
    | 'circuit_component'
    | 'annotation_text'
    | 'custom';
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  material?: 'matte' | 'glass' | 'metal' | 'emissive' | 'transparent';
  data?: Record<string, unknown>;
};

export type SceneLabelSpec = {
  id: string;
  text: string;
  targetObjectId?: string;
  position?: [number, number, number];
  color?: string;
};

export type SceneAnimationSpec = {
  id: string;
  trigger: 'on_start' | 'on_step' | 'on_hover' | 'on_click' | 'on_slider_change';
  targetObjectId: string;
  property: 'position' | 'rotation' | 'scale' | 'opacity' | 'color' | 'custom';
  from?: unknown;
  to?: unknown;
  durationSeconds: number;
  easing?: 'linear' | 'easeInOut' | 'spring';
};

export type SceneInteractionSpec = {
  id: string;
  type:
    | 'slider'
    | 'drag'
    | 'click_reveal'
    | 'toggle'
    | 'multiple_choice'
    | 'text_response'
    | 'annotation'
    | 'simulation_control';
  label: string;
  targetObjectId?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string | boolean;
  options?: string[];
};

export type CinematicCheckpoint = {
  id: string;
  prompt: string;
  type: 'multiple_choice' | 'short_answer' | 'interaction' | 'annotation' | 'lab_response' | 'writing';
  choices?: string[];
  expectedAnswer?: string;
  feedback: string;
};

export type HeyGenLessonVideoSpec = {
  enabled: boolean;
  videoPurpose:
    | 'lesson_intro'
    | 'concept_explanation'
    | 'recap'
    | 'teacher_walkthrough'
    | 'parent_summary'
    | 'student_revision';
  title: string;
  script: string;
  avatarStyle:
    | 'professional_teacher'
    | 'science_lab_teacher'
    | 'english_coach'
    | 'exam_coach'
    | 'student_friendly';
  voiceStyle: 'warm_confident' | 'calm_teacher' | 'energetic' | 'exam_focused';
  aspectRatio: '16:9' | '9:16';
  durationTargetSeconds: number;
  includeCaptions: boolean;
  status?: 'not_generated' | 'queued' | 'generated' | 'failed' | 'demo';
  videoUrl?: string;
  heygenVideoId?: string;
};

export type CinematicAsset = {
  id: string;
  lessonId: string;
  subject: SubjectId;
  assetType:
    | 'heygen_intro_video'
    | 'heygen_recap_video'
    | 'heygen_parent_summary'
    | 'narration_audio'
    | 'thumbnail'
    | 'scene_preview';
  status: 'draft' | 'queued' | 'processing' | 'ready' | 'failed' | 'demo';
  title: string;
  script?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  provider?: 'heygen' | 'local' | 'mock';
  providerId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type CinematicLessonRecord = {
  id: string;
  spec: CinematicLessonSpec;
  subject: SubjectId;
  title: string;
  topic: string;
  createdBy: string;
  source: 'template' | 'ai' | 'mock' | 'upload' | 'manual';
  createdAt: string;
  updatedAt?: string;
};

export type CinematicInteractionEvent = {
  lessonId: string;
  stepId?: string;
  interactionId?: string;
  action: string;
  value?: unknown;
  durationSeconds?: number;
  score?: number;
};
