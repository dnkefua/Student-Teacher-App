import type {
  CinematicLessonSpec,
  CinematicSceneType,
  HeyGenLessonVideoSpec,
  InteractiveSceneSpec,
  SubjectId,
} from './types';
import { sceneTypeForSubject, subjectBySceneType } from './sceneSchema';

const eventSubject = {
  mathematics: 'Mathematics',
  science: 'Science',
  english: 'English',
} as const;

const theme = {
  mathematics: 'math_cyan_gold',
  science: 'science_emerald_cyan',
  english: 'english_purple_gold',
} as const;

const sceneConcepts: Record<CinematicSceneType, string> = {
  math_ratio_mixer: 'proportional reasoning through part-whole ratios',
  math_equation_balance: 'inverse operations on both sides of an equation',
  math_linear_graph: 'gradient and intercept as visible graph structure',
  math_pythagoras: 'area relationships in right-angled triangles',
  math_circle_lab: 'radius, diameter, circumference and area',
  math_solid_geometry: 'volume and surface structure of 3D shapes',
  math_probability_spinner: 'theoretical probability as sector size',
  math_percentage_bar: 'fractions, decimals and percentages out of 100',
  math_data_visualisation: 'data comparison, mean and median',
  science_particle_model: 'particle arrangement and energy in states of matter',
  science_cell_3d: 'cell organelle structure and function',
  science_forces_motion: 'resultant force and acceleration',
  science_circuit_builder: 'series and parallel current paths',
  science_ecosystem_sim: 'interdependence in food webs',
  science_chemical_reaction: 'reactants, products, indicators and pH',
  science_energy_transfer: 'useful and wasted energy pathways',
  science_earth_space: 'orbits, day-night cycles and moon phases',
  science_scientific_method: 'variables, fair tests and evidence',
  english_text_annotation: 'identifying evidence and writer choices',
  english_essay_planner: 'building evidence-led analytical paragraphs',
  english_poetry_highlighter: 'spotting poetic devices and effects',
  english_grammar_builder: 'constructing accurate, varied sentences',
  english_writing_revision: 'redrafting against a success rubric',
  english_story_map: 'plot structure and turning points',
  english_character_board: 'traits supported by textual evidence',
  english_debate_simulator: 'claim, evidence, rebuttal and response',
  english_speaking_feedback: 'spoken delivery, clarity and structure',
};

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 72) || 'cinematic-lesson';
}

function baseScene(sceneType: CinematicSceneType): InteractiveSceneSpec {
  return {
    type: sceneType,
    objects: [
      { id: 'core-model', type: 'custom', position: [0, 0, 0], color: '#49c8ff', material: 'emissive' },
      { id: 'focus-label', type: 'text', position: [0, 1.3, 0], color: '#ffffff' },
    ],
    labels: [{ id: 'main-label', text: sceneConcepts[sceneType], targetObjectId: 'core-model', position: [0, 1.6, 0] }],
    animations: [
      {
        id: 'opening-orbit',
        trigger: 'on_start',
        targetObjectId: 'core-model',
        property: 'rotation',
        from: [0, 0, 0],
        to: [0, Math.PI * 2, 0],
        durationSeconds: 8,
        easing: 'easeInOut',
      },
    ],
    interactions: [
      { id: 'inspect', type: 'click_reveal', label: 'Inspect the key feature', targetObjectId: 'core-model' },
      { id: 'explain', type: 'text_response', label: 'Explain what changed' },
    ],
  };
}

function heygenSpec(subject: SubjectId, title: string, topic: string, sceneType: CinematicSceneType): HeyGenLessonVideoSpec {
  const avatarStyle = subject === 'science' ? 'science_lab_teacher' : subject === 'english' ? 'english_coach' : 'professional_teacher';
  return {
    enabled: true,
    videoPurpose: subject === 'science' ? 'concept_explanation' : subject === 'english' ? 'teacher_walkthrough' : 'lesson_intro',
    title: `${title} studio video explainer`,
    script: `Welcome to ${title}. In this short explainer, focus on one idea: ${sceneConcepts[sceneType]}. Watch the interactive scene inside EIS Learning Studio, notice what changes when you use the controls, and be ready to explain ${topic} using precise evidence from the model.`,
    avatarStyle,
    voiceStyle: subject === 'english' ? 'warm_confident' : 'calm_teacher',
    aspectRatio: '16:9',
    durationTargetSeconds: 60,
    includeCaptions: true,
    status: 'not_generated',
  };
}

function eventTypeFor(subject: SubjectId, sceneType: CinematicSceneType): CinematicLessonSpec['analytics']['eventType'] {
  if (subject === 'english') return sceneType === 'english_writing_revision' || sceneType === 'english_essay_planner' ? 'writing_submission' : 'reading_annotation';
  if (subject === 'science') return sceneType === 'science_scientific_method' || sceneType === 'science_chemical_reaction' ? 'virtual_lab' : 'simulation_interaction';
  return '3d_interaction';
}

export function createTemplateForSceneType(
  sceneType: CinematicSceneType,
  subject: SubjectId = subjectBySceneType[sceneType],
  topic = sceneConcepts[sceneType],
): CinematicLessonSpec {
  const safeSceneType = subjectBySceneType[sceneType] === subject ? sceneType : sceneTypeForSubject(subject);
  const concept = sceneConcepts[safeSceneType];
  const subjectName = eventSubject[subject];
  const title = titleForScene(safeSceneType, topic);
  return {
    id: `cin-${slug(subject)}-${slug(safeSceneType)}-${slug(topic)}`,
    subject,
    grade: 'Grade 8',
    unitId: `${subject}-cinematic-core`,
    title,
    topic,
    concept,
    inquiryQuestion: `How can an interactive model help us understand ${topic}?`,
    objectives: [
      `Describe the core idea behind ${topic}.`,
      'Use the interactive scene to test or reveal the concept.',
      'Explain the result using accurate subject vocabulary.',
    ],
    sceneType: safeSceneType,
    cinematicStyle: {
      tone: subject === 'science' ? 'lab_simulation' : subject === 'english' ? 'exam_coach' : 'premium_school',
      cameraStyle: subject === 'science' ? 'interactive_lab' : 'guided_walkthrough',
      colorTheme: theme[subject],
      pacing: 'medium',
    },
    storyboard: [
      {
        id: 'hook',
        title: 'Focus the question',
        narration: `Today we are investigating ${topic}. The key is to look for ${concept}.`,
        visualAction: 'Reveal the core model with a slow camera orbit and a highlighted label.',
        cameraAction: 'slow_orbit',
        highlightObjects: ['core-model'],
        durationSeconds: 18,
      },
      {
        id: 'manipulate',
        title: 'Manipulate the model',
        narration: 'Use the controls and watch what changes. The model is designed to make the invisible thinking visible.',
        visualAction: 'Student changes one variable or annotation at a time.',
        studentPrompt: 'What changed, and why did it change?',
        expectedInteraction: 'inspect',
        durationSeconds: 28,
      },
      {
        id: 'explain',
        title: 'Prove the concept',
        narration: 'Now turn the observation into a clear explanation using subject vocabulary.',
        visualAction: 'Show the checkpoint and connect the model to the assessment question.',
        studentPrompt: `Explain ${topic} using the model as evidence.`,
        expectedInteraction: 'explain',
        durationSeconds: 24,
      },
    ],
    interactiveScene: baseScene(safeSceneType),
    heygen: heygenSpec(subject, title, topic, safeSceneType),
    assessment: {
      checkpoints: [
        {
          id: 'checkpoint-observe',
          prompt: `What is the most important change you notice in the ${topic} model?`,
          type: subject === 'english' ? 'annotation' : 'interaction',
          expectedAnswer: concept,
          feedback: 'Good responses connect a visible action in the model to the underlying concept.',
        },
      ],
      assignmentQuestions: [
        {
          id: 'assignment-explain',
          question: `Explain ${topic} using at least two details from the cinematic interactive scene.`,
          expectedAnswer: `A clear explanation should mention ${concept}.`,
          rubric: '4 marks: accurate concept, two scene details, correct vocabulary, clear reasoning.',
          marks: 4,
        },
      ],
    },
    analytics: {
      eventSubject: subjectName,
      eventType: eventTypeFor(subject, safeSceneType),
      masteryConcept: concept,
      skillTags: [subject, topic, safeSceneType],
    },
  };
}

export function createDemoCinematicLessons(): CinematicLessonSpec[] {
  return [
    createTemplateForSceneType('math_ratio_mixer', 'mathematics', 'Ratio and Proportion - Mixing Colours'),
    createTemplateForSceneType('science_particle_model', 'science', 'Particle Model - Solids, Liquids and Gases'),
    createTemplateForSceneType('english_essay_planner', 'english', 'Building Evidence in Persuasive Writing'),
  ];
}

function titleForScene(sceneType: CinematicSceneType, topic: string): string {
  if (sceneType === 'math_ratio_mixer') return 'Ratio and Proportion - Mixing Colours';
  if (sceneType === 'science_particle_model') return 'Particle Model - Solids, Liquids and Gases';
  if (sceneType === 'english_essay_planner') return 'Building Evidence in Persuasive Writing';
  return topic;
}

export const cinematicDemoLessons = createDemoCinematicLessons();
