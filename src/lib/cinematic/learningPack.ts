import type { CourseChapter, CourseLesson } from '@/lib/eisMypMathCourse';
import type { SubjectLesson } from '@/lib/subjects/types';

export type CinematicPackQuestion = {
  id: string;
  question: string;
  expectedAnswer: string;
  rubric: string;
  marks: number;
  visualCue: string;
};

export type CinematicLearningPack = {
  id: string;
  subject: 'mathematics' | 'science' | 'english';
  title: string;
  topic: string;
  conceptExplanation: string;
  videoTitle: string;
  heyGenScript: string;
  visualBriefs: string[];
  threeDModelBrief: string;
  interactionTasks: string[];
  workedExamples: {
    prompt: string;
    steps: string[];
    answer: string;
  }[];
  assignmentQuestions: CinematicPackQuestion[];
};

const TEN_MARKS = 10;

function cleanId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ensureTenQuestions(seed: CinematicPackQuestion[], topic: string, visualCue: string): CinematicPackQuestion[] {
  const defaults: Omit<CinematicPackQuestion, 'id'>[] = [
    {
      question: `Use the visual model to identify the most important idea in ${topic}. Explain your reasoning.`,
      expectedAnswer: 'The answer names the core concept and uses visible evidence from the model or image.',
      rubric: 'Full marks for a clear concept, accurate vocabulary, and direct reference to the visual evidence.',
      marks: 4,
      visualCue,
    },
    {
      question: `Label three important parts of the ${topic} scene and state the role of each part.`,
      expectedAnswer: 'Three labels are accurate and each function is explained in subject-specific language.',
      rubric: 'Award marks for correct labels, functions, and clarity.',
      marks: 6,
      visualCue,
    },
    {
      question: `Describe the sequence shown in the cinematic scene for ${topic}.`,
      expectedAnswer: 'The response orders the process logically from start to finish.',
      rubric: 'Full marks for accurate sequence, cause-and-effect language, and no major missing step.',
      marks: 5,
      visualCue,
    },
    {
      question: `What would change if one key part of the model was removed or altered?`,
      expectedAnswer: 'The answer predicts a change and justifies it using the model.',
      rubric: 'Full marks for prediction plus scientific, mathematical, or textual justification.',
      marks: 5,
      visualCue,
    },
    {
      question: `Write one example question a teacher could ask from this image, then answer it.`,
      expectedAnswer: 'The student creates a relevant question and gives a correct answer.',
      rubric: 'Credit relevance, correctness, and use of the image or scene.',
      marks: 4,
      visualCue,
    },
    {
      question: `Explain one common misconception about ${topic} and correct it using the visual scene.`,
      expectedAnswer: 'The misconception is named, corrected, and linked to visible evidence.',
      rubric: 'Full marks for accurate misconception correction and clear visual reference.',
      marks: 5,
      visualCue,
    },
    {
      question: `Compare two parts, examples, or stages in the ${topic} model.`,
      expectedAnswer: 'The comparison identifies one similarity and one difference.',
      rubric: 'Award marks for accurate comparison and precise vocabulary.',
      marks: 4,
      visualCue,
    },
    {
      question: `Create a short explanation for a student who missed the lesson on ${topic}.`,
      expectedAnswer: 'A concise explanation that includes the key idea and one example.',
      rubric: 'Full marks for accuracy, clarity, and appropriate student-friendly language.',
      marks: 5,
      visualCue,
    },
    {
      question: `Use the interactive scene to make a prediction, then explain how you would test it.`,
      expectedAnswer: 'The response gives a testable prediction and a sensible method.',
      rubric: 'Award marks for prediction, method, variables or evidence, and conclusion.',
      marks: 6,
      visualCue,
    },
    {
      question: `Summarise ${topic} in three bullet points using evidence from the visual model.`,
      expectedAnswer: 'Three accurate bullets summarise the main learning points.',
      rubric: 'Full marks for three precise points that use subject vocabulary and visual evidence.',
      marks: 3,
      visualCue,
    },
  ];

  const merged = [...seed, ...defaults.map((q, index) => ({ ...q, id: `auto-${index + 1}` }))];
  return merged.slice(0, TEN_MARKS).map((q, index) => ({
    ...q,
    id: q.id || `cinematic-question-${index + 1}`,
  }));
}

function subjectVisualStrategy(lesson: SubjectLesson) {
  if (lesson.interactiveType === 'cell_3d') {
    return {
      visualBriefs: [
        'High-definition split-screen image: rounded animal cell beside box-like plant cell.',
        'Plant cell must show rigid cell wall, cell membrane inside the wall, large central vacuole, chloroplasts, nucleus, mitochondria, cytoplasm, and ribosomes.',
        'Animal cell must show flexible rounded membrane, nucleus, mitochondria, cytoplasm, ribosomes, lysosomes, and small temporary vacuoles.',
      ],
      threeDModelBrief:
        'Interactive 3D comparison model: plant cell uses a rectangular/box-like wall with inner membrane; animal cell uses rounded organic membrane. Students rotate, zoom, isolate organelles, and compare plant-only structures.',
      interactionTasks: [
        'Toggle between animal cell and plant cell.',
        'Click an organelle to reveal its function.',
        'Compare shared organelles against plant-only structures.',
        'Predict what happens if chloroplasts or mitochondria stop working.',
      ],
      visualCue: 'Use the plant/animal cell comparison model.',
    };
  }

  if (lesson.interactiveType === 'ecosystem_simulation') {
    return {
      visualBriefs: [
        'High-definition ecosystem image with producers, herbivores, predators, decomposers, and energy-flow arrows.',
        'Food web board with multiple linked chains, not only one linear chain.',
        'Impact simulation showing what changes when one population increases, decreases, or disappears.',
      ],
      threeDModelBrief:
        'Interactive food-web scene: organism cards, energy arrows, trophic levels, decomposer loop, and sliders for sunlight, population pressure, and predator-prey balance.',
      interactionTasks: [
        'Build at least two food chains from the same ecosystem.',
        'Combine the chains into a food web.',
        'Remove one organism and predict the effect.',
        'Explain why arrows show energy flow rather than eating direction.',
      ],
      visualCue: 'Use the ecosystem image and food-web simulation.',
    };
  }

  if (lesson.interactiveType === 'particle_model_3d') {
    return {
      visualBriefs: [
        'Particle-level cinematic diagram showing solids, liquids, and gases side by side.',
        'Motion trails show kinetic energy without implying particles grow larger.',
        'Close-up transition frames for melting, boiling, condensing, and freezing.',
      ],
      threeDModelBrief:
        'Interactive particle model with state toggles, temperature slider, spacing, movement speed, and annotated misconceptions.',
      interactionTasks: [
        'Change temperature and observe particle speed.',
        'Compare arrangement and movement in each state.',
        'Explain diffusion using random motion.',
        'Correct the misconception that particles expand when heated.',
      ],
      visualCue: 'Use the particle model scene.',
    };
  }

  return {
    visualBriefs: [
      `High-definition diagram for ${lesson.topic} with labels and evidence callouts.`,
      'Interactive image panel with hotspots, student prompts, and revealable explanations.',
      'Cinematic scene sequence that moves from observation to explanation to application.',
    ],
    threeDModelBrief:
      `Interactive model for ${lesson.topic}: rotate, label, isolate parts, test a variable, and explain the outcome.`,
    interactionTasks: [
      'Inspect the visual before reading the explanation.',
      'Click labels to reveal functions or evidence.',
      'Make a prediction from the model.',
      'Answer a question that requires evidence from the scene.',
    ],
    visualCue: `Use the ${lesson.topic} visual model.`,
  };
}

export function createSubjectCinematicLearningPack(lesson: SubjectLesson): CinematicLearningPack {
  const strategy = subjectVisualStrategy(lesson);
  const seededQuestions: CinematicPackQuestion[] = lesson.assignmentQuestions.map((q, index) => ({
    id: q.id || `seed-${index + 1}`,
    question: q.question,
    expectedAnswer: q.expectedAnswer ?? 'A strong answer uses the model, correct vocabulary, and a justified conclusion.',
    rubric: q.rubric,
    marks: q.marks,
    visualCue: strategy.visualCue,
  }));

  const workedExamples = [
    ...(lesson.workedExamples ?? []),
    ...lesson.practiceQuestions.slice(0, 3).map((q, index) => ({
      prompt: q.question,
      steps: [
        'Read the question and identify the concept being tested.',
        'Use the visual model or image to find evidence.',
        'Answer using precise vocabulary and a short explanation.',
      ],
      answer: q.answer ?? q.explanation ?? `Model answer for ${lesson.topic} example ${index + 1}.`,
    })),
  ].slice(0, 5);

  return {
    id: `pack-${lesson.id}`,
    subject: lesson.subject,
    title: `${lesson.title} cinematic learning pack`,
    topic: lesson.topic,
    conceptExplanation: lesson.studentExplanation,
    videoTitle: `${lesson.title} - cinematic explainer`,
    heyGenScript: [
      `Welcome to this ${lesson.grade} ${lesson.subjectLabel} cinematic lesson on ${lesson.topic}.`,
      lesson.studentExplanation,
      `Our inquiry question is: ${lesson.inquiryQuestion}`,
      `Watch the EIS Learning Studio interactive model carefully. ${strategy.threeDModelBrief}`,
      `By the end, you should be able to ${lesson.objectives.join(', ').toLowerCase()}.`,
      'Use the cinematic model, diagrams, questions, and assignment to show what you understand.',
    ].join(' '),
    visualBriefs: strategy.visualBriefs,
    threeDModelBrief: strategy.threeDModelBrief,
    interactionTasks: strategy.interactionTasks,
    workedExamples,
    assignmentQuestions: ensureTenQuestions(seededQuestions, lesson.topic, strategy.visualCue),
  };
}

function mathVisualStrategy(lesson: CourseLesson) {
  const mode = lesson.animation;
  const common = {
    visualBriefs: [
      `High-definition ${lesson.title} diagram with labels, worked annotations, and visible student checkpoints.`,
      'Interactive side panel with an example, a mistake check, and an assignable question.',
      'Cinematic sequence: concept visual, worked example, student pause, recap.',
    ],
    interactionTasks: [
      'Manipulate the model before solving symbolically.',
      'Predict the next step in the worked example.',
      'Explain one mistake and correct it.',
      'Apply the method to a new problem.',
    ],
    visualCue: `Use the ${mode.replaceAll('-', ' ')} interactive model.`,
  };

  const modelByMode: Record<string, string> = {
    'ratio-mixer': '3D ratio mixer with linked parts, equivalent ratio table, and scaled recipe/tank visual.',
    'equation-balance': '3D balance model where both sides remain equal as inverse operations remove terms.',
    'coordinate-grid': 'Interactive coordinate plane with moving point, gradient triangle, table of values, and line reveal.',
    'solid-builder': '3D solid/nets model that folds and unfolds to connect surface area and volume.',
    'percentage-bars': 'Hundred-grid, bar model, fraction-decimal-percent converter, and multiplier visual.',
    'circle-lab': 'Interactive circle model with radius, diameter, circumference unwrap, and area sector rearrangement.',
    'angle-lab': 'Rotating angle arms, parallel-line facts, polygon angle sum, and construction overlays.',
    'probability-spinner': '3D spinner and sample-space simulator comparing theoretical and experimental probability.',
    'data-lab': '3D data columns, mean as balance point, distribution comparison, and graph interpretation.',
  };

  return {
    ...common,
    threeDModelBrief: modelByMode[mode] ?? `Interactive ${mode.replaceAll('-', ' ')} model with sliders, labels, and checkpoint questions.`,
  };
}

export function createMathCinematicLearningPack(lesson: CourseLesson, chapter: CourseChapter): CinematicLearningPack {
  const strategy = mathVisualStrategy(lesson);
  const seededQuestions: CinematicPackQuestion[] = [
    ...lesson.exercises.fluency.map((question, index) => ({
      id: `fluency-${index + 1}`,
      question,
      expectedAnswer: 'Correct working and final answer.',
      rubric: 'Full marks for accurate method, notation, and answer.',
      marks: 3,
      visualCue: strategy.visualCue,
    })),
    ...lesson.exercises.reasoning.map((question, index) => ({
      id: `reasoning-${index + 1}`,
      question,
      expectedAnswer: 'A justified answer that explains the reasoning.',
      rubric: 'Full marks for correct conclusion plus clear mathematical explanation.',
      marks: 5,
      visualCue: strategy.visualCue,
    })),
  ];

  return {
    id: `pack-${lesson.id}`,
    subject: 'mathematics',
    title: `${lesson.title} cinematic learning pack`,
    topic: lesson.title,
    conceptExplanation: lesson.explanation,
    videoTitle: `${lesson.title} - cinematic explainer`,
    heyGenScript: [
      `Welcome to this Grade 8 Mathematics cinematic lesson from ${chapter.chapter}: ${chapter.title}.`,
      `Today we are learning ${lesson.title}. ${lesson.explanation}`,
      `The inquiry question is: ${lesson.inquiry}`,
      `EIS Learning Studio will show the ${lesson.animation.replaceAll('-', ' ')} interactive model while this video explains the thinking.`,
      `We will work through an example: ${lesson.workedExample.prompt}. The answer is ${lesson.workedExample.answer}.`,
    ].join(' '),
    visualBriefs: strategy.visualBriefs,
    threeDModelBrief: strategy.threeDModelBrief,
    interactionTasks: strategy.interactionTasks,
    workedExamples: [
      lesson.workedExample,
      {
        prompt: 'Visual method check',
        steps: ['Represent the problem in the model.', 'Name the operation or relationship.', 'Solve and check against the visual.'],
        answer: 'The visual and symbolic answer must agree.',
      },
    ],
    assignmentQuestions: ensureTenQuestions(seededQuestions, lesson.title, strategy.visualCue),
  };
}
