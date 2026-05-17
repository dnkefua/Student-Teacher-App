import type { CinematicLessonSpec, CinematicSceneType, SubjectId } from './types';

export const cinematicSceneTypes = [
  'math_ratio_mixer',
  'math_equation_balance',
  'math_linear_graph',
  'math_pythagoras',
  'math_circle_lab',
  'math_solid_geometry',
  'math_probability_spinner',
  'math_percentage_bar',
  'math_data_visualisation',
  'science_particle_model',
  'science_cell_3d',
  'science_forces_motion',
  'science_circuit_builder',
  'science_ecosystem_sim',
  'science_chemical_reaction',
  'science_energy_transfer',
  'science_earth_space',
  'science_scientific_method',
  'english_text_annotation',
  'english_essay_planner',
  'english_poetry_highlighter',
  'english_grammar_builder',
  'english_writing_revision',
  'english_story_map',
  'english_character_board',
  'english_debate_simulator',
  'english_speaking_feedback',
] as const satisfies readonly CinematicSceneType[];

export const subjectBySceneType: Record<CinematicSceneType, SubjectId> = {
  math_ratio_mixer: 'mathematics',
  math_equation_balance: 'mathematics',
  math_linear_graph: 'mathematics',
  math_pythagoras: 'mathematics',
  math_circle_lab: 'mathematics',
  math_solid_geometry: 'mathematics',
  math_probability_spinner: 'mathematics',
  math_percentage_bar: 'mathematics',
  math_data_visualisation: 'mathematics',
  science_particle_model: 'science',
  science_cell_3d: 'science',
  science_forces_motion: 'science',
  science_circuit_builder: 'science',
  science_ecosystem_sim: 'science',
  science_chemical_reaction: 'science',
  science_energy_transfer: 'science',
  science_earth_space: 'science',
  science_scientific_method: 'science',
  english_text_annotation: 'english',
  english_essay_planner: 'english',
  english_poetry_highlighter: 'english',
  english_grammar_builder: 'english',
  english_writing_revision: 'english',
  english_story_map: 'english',
  english_character_board: 'english',
  english_debate_simulator: 'english',
  english_speaking_feedback: 'english',
};

export function isCinematicSceneType(value: unknown): value is CinematicSceneType {
  return typeof value === 'string' && (cinematicSceneTypes as readonly string[]).includes(value);
}

export function sceneTypeForSubject(subject: SubjectId): CinematicSceneType {
  if (subject === 'science') return 'science_particle_model';
  if (subject === 'english') return 'english_essay_planner';
  return 'math_ratio_mixer';
}

export function validateCinematicLessonSpec(raw: unknown): CinematicLessonSpec | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Partial<CinematicLessonSpec>;
  if (typeof value.id !== 'string' || value.id.length < 2) return null;
  if (!['mathematics', 'science', 'english'].includes(String(value.subject))) return null;
  if (value.grade !== 'Grade 8') return null;
  if (typeof value.title !== 'string' || typeof value.topic !== 'string' || typeof value.concept !== 'string') return null;
  if (!isCinematicSceneType(value.sceneType)) return null;
  if (subjectBySceneType[value.sceneType] !== value.subject) return null;
  if (!Array.isArray(value.objectives) || value.objectives.length === 0) return null;
  if (!Array.isArray(value.storyboard) || value.storyboard.length === 0) return null;
  if (!value.interactiveScene || value.interactiveScene.type !== value.sceneType) return null;
  if (!value.heygen || typeof value.heygen.script !== 'string') return null;
  if (!value.assessment || !Array.isArray(value.assessment.checkpoints)) return null;
  if (!value.analytics || !Array.isArray(value.analytics.skillTags)) return null;
  return value as CinematicLessonSpec;
}
