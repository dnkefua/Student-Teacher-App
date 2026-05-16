// Maps weak-concept keywords back to the right subject + interactive so
// AI recommendations and recommendation-actions can route correctly across
// Maths / Science / English.

import type { SubjectId, SubjectInteractiveType } from './types';
import type { ThreeDType } from '@/lib/grade8Curriculum';

export type InterventionTarget = {
  subject: SubjectId;
  interactiveType: SubjectInteractiveType;
  /** Friendly label for buttons / chips. */
  label: string;
  /** Tab to open in ClientPage. */
  tab: 'lesson' | 'maths-studio' | 'science-studio' | 'english-studio';
};

const RULES: { pattern: RegExp; target: InterventionTarget }[] = [
  // ─── Maths ──────────────────────────────────────────────────────────
  { pattern: /ratio|proportion|rate|scale factor/i, target: { subject: 'mathematics', interactiveType: 'ratio_mixer_3d', label: 'Ratio Mixer 3D', tab: 'lesson' } },
  { pattern: /equation|algebra|expression|solve.*x/i, target: { subject: 'mathematics', interactiveType: 'equation_balance_3d', label: 'Equation Balance 3D', tab: 'lesson' } },
  { pattern: /linear|gradient|intercept|coordinate|graph/i, target: { subject: 'mathematics', interactiveType: 'linear_graph_3d', label: 'Linear Graph 3D', tab: 'lesson' } },
  { pattern: /pythagoras|hypoten|right.?angle|trig|sine|cosine|tangent/i, target: { subject: 'mathematics', interactiveType: 'pythagoras_3d', label: 'Pythagoras 3D', tab: 'lesson' } },
  { pattern: /circle|circumference|radius/i, target: { subject: 'mathematics', interactiveType: 'circle_lab_3d', label: 'Circle Lab 3D', tab: 'lesson' } },
  { pattern: /angle|parallel|triangle/i, target: { subject: 'mathematics', interactiveType: 'angle_lab_3d', label: 'Angle Lab 3D', tab: 'lesson' } },
  { pattern: /probability|chance|spinner/i, target: { subject: 'mathematics', interactiveType: 'probability_spinner_3d', label: 'Probability Spinner 3D', tab: 'lesson' } },
  { pattern: /percentage|fraction|decimal|fdpr/i, target: { subject: 'mathematics', interactiveType: 'percentage_bar_3d', label: 'Percentage Bar 3D', tab: 'lesson' } },
  { pattern: /volume|cylinder|cuboid|surface|prism/i, target: { subject: 'mathematics', interactiveType: 'solid_geometry_3d', label: 'Solid Geometry 3D', tab: 'lesson' } },
  { pattern: /mean|median|mode|range|scatter|bivariate|data interpretation/i, target: { subject: 'mathematics', interactiveType: 'data_visualisation_3d', label: 'Data Visualisation 3D', tab: 'lesson' } },

  // ─── Science ────────────────────────────────────────────────────────
  { pattern: /particle|state of matter|solid|liquid|gas|diffusion|density/i, target: { subject: 'science', interactiveType: 'particle_model_3d', label: 'Particle Model 3D', tab: 'science-studio' } },
  { pattern: /cell|organelle|nucleus|mitochondri|chloroplast|membrane|tissue/i, target: { subject: 'science', interactiveType: 'cell_3d', label: 'Cell 3D', tab: 'science-studio' } },
  { pattern: /force|motion|friction|gravity|acceleration|newton/i, target: { subject: 'science', interactiveType: 'forces_motion_sim', label: 'Forces & Motion Simulator', tab: 'science-studio' } },
  { pattern: /circuit|current|voltage|resistance|electric|conductor|insulator/i, target: { subject: 'science', interactiveType: 'electric_circuit_builder', label: 'Circuit Builder', tab: 'science-studio' } },
  { pattern: /ecosystem|food chain|food web|habitat|adapt|predator|interdependen/i, target: { subject: 'science', interactiveType: 'ecosystem_simulation', label: 'Ecosystem Simulation', tab: 'science-studio' } },
  { pattern: /chemical|reaction|acid|alkali|indicator|ph/i, target: { subject: 'science', interactiveType: 'chemical_reaction_lab', label: 'Chemical Reaction Lab', tab: 'science-studio' } },
  { pattern: /energy|conduction|convection|radiation|renewable/i, target: { subject: 'science', interactiveType: 'energy_transfer_sim', label: 'Energy Transfer Simulator', tab: 'science-studio' } },
  { pattern: /earth|space|moon|orbit|solar system|season/i, target: { subject: 'science', interactiveType: 'earth_space_orbit', label: 'Earth & Space Orbit', tab: 'science-studio' } },
  { pattern: /scientific method|investigation|hypothesis|variable/i, target: { subject: 'science', interactiveType: 'scientific_method_lab', label: 'Scientific Method Lab', tab: 'science-studio' } },
  { pattern: /digest|respiration|circulation|skelet|muscle/i, target: { subject: 'science', interactiveType: 'body_system_3d', label: 'Body Systems 3D', tab: 'science-studio' } },

  // ─── English ────────────────────────────────────────────────────────
  { pattern: /annotat|comprehension|inference|evidence selection|main idea/i, target: { subject: 'english', interactiveType: 'text_annotation_lab', label: 'Text Annotation Lab', tab: 'english-studio' } },
  { pattern: /essay|thesis|persuasive|argument|paragraph structure/i, target: { subject: 'english', interactiveType: 'essay_planner', label: 'Essay Planner', tab: 'english-studio' } },
  { pattern: /poetry|simile|metaphor|figurative|imagery|alliteration/i, target: { subject: 'english', interactiveType: 'poetry_device_highlighter', label: 'Poetry Device Highlighter', tab: 'english-studio' } },
  { pattern: /grammar|clause|sentence type|punctuation|subject.?verb/i, target: { subject: 'english', interactiveType: 'grammar_sentence_builder', label: 'Grammar Sentence Builder', tab: 'english-studio' } },
  { pattern: /revision|drafting|writing|paragraph flow|clarity/i, target: { subject: 'english', interactiveType: 'writing_revision_studio', label: 'Writing Revision Studio', tab: 'english-studio' } },
  { pattern: /vocabulary|word choice|context clues|word root/i, target: { subject: 'english', interactiveType: 'vocabulary_practice', label: 'Vocabulary Practice', tab: 'english-studio' } },
  { pattern: /narrative|story|plot|characterisation|dialogue/i, target: { subject: 'english', interactiveType: 'story_structure_map', label: 'Story Structure Map', tab: 'english-studio' } },
  { pattern: /character analysis|protagonist|antagonist/i, target: { subject: 'english', interactiveType: 'character_analysis_board', label: 'Character Analysis Board', tab: 'english-studio' } },
  { pattern: /debate|rhetoric|counterargument/i, target: { subject: 'english', interactiveType: 'debate_simulator', label: 'Debate Simulator', tab: 'english-studio' } },
  { pattern: /speaking|presentation|oral|speech/i, target: { subject: 'english', interactiveType: 'speaking_feedback', label: 'Speaking Feedback', tab: 'english-studio' } },
];

/** Resolve a topic / concept string into a subject-aware intervention.
 *  Falls back to the maths equation-balance default to preserve previous
 *  behaviour when nothing matches. */
export function resolveIntervention(concept: string | undefined): InterventionTarget {
  if (concept) {
    for (const rule of RULES) {
      if (rule.pattern.test(concept)) return rule.target;
    }
  }
  return { subject: 'mathematics', interactiveType: 'equation_balance_3d', label: 'Equation Balance 3D', tab: 'lesson' };
}

/** Bridge from a 3D scene type (used pre-multi-subject) to the new
 *  intervention target so existing recommendations still route correctly. */
export function interventionFromThreeDType(threeDType: ThreeDType): InterventionTarget {
  const map: Record<ThreeDType, InterventionTarget> = {
    pythagoras_3d: { subject: 'mathematics', interactiveType: 'pythagoras_3d', label: 'Pythagoras 3D', tab: 'lesson' },
    equation_balance_3d: { subject: 'mathematics', interactiveType: 'equation_balance_3d', label: 'Equation Balance 3D', tab: 'lesson' },
    linear_graph_3d: { subject: 'mathematics', interactiveType: 'linear_graph_3d', label: 'Linear Graph 3D', tab: 'lesson' },
    circle_lab_3d: { subject: 'mathematics', interactiveType: 'circle_lab_3d', label: 'Circle Lab 3D', tab: 'lesson' },
    ratio_mixer_3d: { subject: 'mathematics', interactiveType: 'ratio_mixer_3d', label: 'Ratio Mixer 3D', tab: 'lesson' },
    solid_geometry_3d: { subject: 'mathematics', interactiveType: 'solid_geometry_3d', label: 'Solid Geometry 3D', tab: 'lesson' },
    angle_lab_3d: { subject: 'mathematics', interactiveType: 'angle_lab_3d', label: 'Angle Lab 3D', tab: 'lesson' },
    probability_spinner_3d: { subject: 'mathematics', interactiveType: 'probability_spinner_3d', label: 'Probability Spinner 3D', tab: 'lesson' },
    percentage_bar_3d: { subject: 'mathematics', interactiveType: 'percentage_bar_3d', label: 'Percentage Bar 3D', tab: 'lesson' },
    data_visualisation_3d: { subject: 'mathematics', interactiveType: 'data_visualisation_3d', label: 'Data Visualisation 3D', tab: 'lesson' },
  };
  return map[threeDType];
}
