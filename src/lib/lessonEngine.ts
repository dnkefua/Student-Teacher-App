import { AnimationMode, CourseLesson } from './eisMypMathCourse';
import { placeValueLessonData } from './placeValueLesson';
import { getVisualResearchBlueprint } from './mathVisualResearch';

export type LessonGeneratorInput = {
  subject: string;
  grade: number;
  chapter: string;
  subtopic: string;
  learningObjectives: string[];
  difficultyLevel: 'foundation' | 'standard' | 'advanced';
  exampleProblems?: string[];
  workedExample?: {
    prompt: string;
    steps: string[];
    answer: string;
  };
  textbookReference?: string;
  preferredVisualStyle: string;
  animationMode?: AnimationMode;
};

export type Scene = {
  id: string;
  title: string;
  durationSeconds: number;
  purpose: string;
  visualDescription: string;
  narration: string;
  cameraMovement: string;
  animationSteps: string[];
  studentInteraction?: string;
};

export type NarrationLine = {
  sceneId: string;
  startTime: number;
  endTime: number;
  text: string;
  emotion: 'curious' | 'excited' | 'calm' | 'dramatic' | 'encouraging';
};

export type CameraDirection = {
  sceneId: string;
  movement: 'zoom-in' | 'zoom-out' | 'orbit' | 'pan' | 'fly-through' | 'static';
  target: string;
  durationSeconds: number;
};

export type AnimationStep = {
  sceneId: string;
  startTime: number;
  endTime: number;
  object: string;
  action: string;
  easing: string;
};

export type SoundCue = {
  sceneId: string;
  time: number;
  type: 'whoosh' | 'pop' | 'success' | 'error' | 'ambient' | 'sparkle';
  description: string;
};

export type VisualAsset = {
  id: string;
  type: '3d-model' | 'shape' | 'icon' | 'particle' | 'label' | 'background';
  description: string;
  ownership: 'generated-original' | 'open-source' | 'app-owned';
};

export type Interaction = {
  id: string;
  sceneId: string;
  type: 'tap' | 'drag' | 'match' | 'build' | 'answer';
  prompt: string;
  correctResponse: string;
  feedback: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type Reward = {
  xp: number;
  badge: string;
  message: string;
};

export type ExamQuestionWalkthrough = {
  prompt: string;
  given: string[];
  approach: Array<{
    title: string;
    explanation: string;
    visualAction: string;
    working: string;
  }>;
  alternativeApproaches?: Array<{
    title: string;
    whenToUse: string;
    steps: string[];
  }>;
  finalAnswer: string;
  examTip: string;
};

export type LessonVideoAssetPackage = {
  lessonId: string;
  title: string;
  subject: string;
  grade: number;
  chapter: string;
  subtopic: string;
  cinematicStyle: string;
  objectives: string[];
  textbookReference?: string;
  scenes: Scene[];
  narrationScript: NarrationLine[];
  cameraDirections: CameraDirection[];
  animationTimeline: AnimationStep[];
  soundDesignNotes: SoundCue[];
  visualAssets: VisualAsset[];
  interactions: Interaction[];
  quiz: QuizQuestion[];
  reward: Reward;
  visualBlueprint?: ReturnType<typeof getVisualResearchBlueprint>;
  examQuestion: ExamQuestionWalkthrough;
};

export const defaultPlaceValueGeneratorInput: LessonGeneratorInput = {
  subject: 'Mathematics',
  grade: 8,
  chapter: 'Number System',
  subtopic: 'Number Basics and Place Value',
  learningObjectives: [...placeValueLessonData.objectives],
  difficultyLevel: 'standard',
  exampleProblems: ['5,482', '7,305', 'Move digit 5 between places', 'Remove zero from 7,305'],
  preferredVisualStyle: 'Futuristic classroom, glowing 3D math world, neon blue and gold accents',
};

const placeValueScenes: Scene[] = [
  {
    id: 'scene-1-hook',
    title: 'Cinematic Hook',
    durationSeconds: 12,
    purpose: 'Create emotional curiosity about digits and position.',
    visualDescription: 'A dark futuristic number world appears. The number 5,482 floats in the center while its digits glow at different intensities.',
    narration: 'Every number has a secret. Its digits are not equal. Their power depends on where they stand.',
    cameraMovement: 'slow zoom-in toward 5,482',
    animationSteps: ['Open with starfield particles', 'Reveal 5,482 in glowing type', 'Pulse each digit from left to right'],
  },
  {
    id: 'scene-2-tower',
    title: 'Place Value Tower',
    durationSeconds: 16,
    purpose: 'Introduce thousands, hundreds, tens and ones as positions with different power.',
    visualDescription: 'A glowing four-floor tower rises with labels: Thousands, Hundreds, Tens, Ones. Digits move into the correct floors.',
    narration: 'A digit gets its power from its floor in the place-value tower. Move left and its value becomes ten times stronger.',
    cameraMovement: 'vertical pan up the tower',
    animationSteps: ['Build four tower floors', 'Label each floor', 'Send digits into their floors', 'Draw x10 arrows moving left'],
  },
  {
    id: 'scene-3-base-ten',
    title: 'Base-Ten World',
    durationSeconds: 18,
    purpose: 'Connect place value to physical base-ten models.',
    visualDescription: 'Original 2.5D blocks appear: one cube, ten rod, hundred flat, thousand cube.',
    narration: 'One is a small cube. Ten is a rod. One hundred is a flat square. One thousand is a powerful cube made from hundreds of ones.',
    cameraMovement: 'orbit around block models',
    animationSteps: ['Spawn one cube', 'Extrude ten rod', 'Assemble hundred flat', 'Assemble thousand cube'],
  },
  {
    id: 'scene-4-example-5482',
    title: 'Example 1 - 5,482',
    durationSeconds: 24,
    purpose: 'Decompose 5,482 into digit values and expanded form.',
    visualDescription: '5 thousand cubes, 4 hundred flats, 8 ten rods and 2 one cubes animate into grouped lanes.',
    narration: 'In 5,482, the 5 means five thousands. The 4 means four hundreds. The 8 means eight tens. The 2 means two ones.',
    cameraMovement: 'fly-through across each place lane',
    animationSteps: ['Generate 5 thousand cubes', 'Generate 4 hundred flats', 'Generate 8 ten rods', 'Generate 2 one cubes', 'Reveal expanded form'],
    studentInteraction: 'Tap each digit to highlight its value and block group.',
  },
  {
    id: 'scene-5-digit-power',
    title: 'Interactive Digit Power',
    durationSeconds: 18,
    purpose: 'Show multiplication and division by ten as position changes.',
    visualDescription: 'The digit 5 slides between ones, tens, hundreds and thousands while the value updates instantly.',
    narration: 'Move left: multiply by ten. Move right: divide by ten. The digit stays the same, but its place changes its power.',
    cameraMovement: 'side pan following the moving digit',
    animationSteps: ['Place 5 in ones', 'Slide to tens and show 50', 'Slide to hundreds and show 500', 'Slide to thousands and show 5000'],
    studentInteraction: 'Drag or tap the place where digit 5 should stand.',
  },
  {
    id: 'scene-6-example-7305',
    title: 'Example 2 - 7,305',
    durationSeconds: 22,
    purpose: 'Decompose 7,305 and show zero tens.',
    visualDescription: '7 thousand cubes, 3 hundred flats, an empty glowing tens lane and 5 one cubes appear.',
    narration: 'In 7,305, the zero says there are no tens. But it is still doing an important job.',
    cameraMovement: 'zoom from full number into the zero lane',
    animationSteps: ['Build 7 thousands', 'Build 3 hundreds', 'Highlight empty tens lane', 'Build 5 ones'],
  },
  {
    id: 'scene-7-zero-placeholder',
    title: 'Zero Placeholder Moment',
    durationSeconds: 18,
    purpose: 'Explain that zero holds a place and removing it changes the number.',
    visualDescription: 'Zero glows like a transparent shield. When removed, 7,305 compresses into 735 and the place labels shift.',
    narration: 'Zero may look empty, but it holds the place. Remove it, and the number changes completely.',
    cameraMovement: 'dramatic zoom-in on zero, then snap zoom-out',
    animationSteps: ['Highlight zero', 'Remove zero', 'Compress digits', 'Show 7,305 is not 735'],
    studentInteraction: 'Press remove zero, then restore it.',
  },
  {
    id: 'scene-8-quiz',
    title: 'Quiz Battle',
    durationSeconds: 32,
    purpose: 'Check understanding with instant feedback.',
    visualDescription: 'A glowing challenge arena presents five questions with success feedback.',
    narration: 'Now it is your turn. Use the power of position to solve each challenge.',
    cameraMovement: 'static arena view',
    animationSteps: ['Reveal quiz arena', 'Show questions', 'Celebrate correct answers', 'Explain corrections'],
    studentInteraction: 'Answer five quiz questions.',
  },
  {
    id: 'scene-9-reward',
    title: 'Reward',
    durationSeconds: 10,
    purpose: 'Celebrate completion and reinforce progress.',
    visualDescription: 'Gold and blue particles burst around the badge Place Value Master.',
    narration: 'Lesson complete. You have unlocked the Place Value Master badge.',
    cameraMovement: 'zoom-out through confetti particles',
    animationSteps: ['Show XP gained', 'Reveal badge', 'Burst lightweight confetti'],
  },
];

function buildNarration(scenes: Scene[]): NarrationLine[] {
  let cursor = 0;
  return scenes.map((scene, index) => {
    const line: NarrationLine = {
      sceneId: scene.id,
      startTime: cursor,
      endTime: cursor + scene.durationSeconds,
      text: scene.narration,
      emotion: index === 0 ? 'curious' : index === scenes.length - 1 ? 'encouraging' : scene.studentInteraction ? 'excited' : 'calm',
    };
    cursor += scene.durationSeconds;
    return line;
  });
}

function buildCameraDirections(scenes: Scene[]): CameraDirection[] {
  return scenes.map((scene) => ({
    sceneId: scene.id,
    movement: scene.cameraMovement.includes('orbit') ? 'orbit' : scene.cameraMovement.includes('zoom') ? 'zoom-in' : scene.cameraMovement.includes('pan') ? 'pan' : scene.cameraMovement.includes('fly') ? 'fly-through' : 'static',
    target: scene.title,
    durationSeconds: scene.durationSeconds,
  }));
}

function buildAnimationTimeline(scenes: Scene[]): AnimationStep[] {
  return scenes.flatMap((scene) =>
    scene.animationSteps.map((step, index) => ({
      sceneId: scene.id,
      startTime: Math.round((scene.durationSeconds / Math.max(1, scene.animationSteps.length)) * index),
      endTime: Math.round((scene.durationSeconds / Math.max(1, scene.animationSteps.length)) * (index + 1)),
      object: step.split(' ')[0] ?? 'visual',
      action: step,
      easing: 'ease-in-out',
    })),
  );
}

function buildSoundCues(scenes: Scene[]): SoundCue[] {
  return scenes.flatMap((scene, index) => [
    { sceneId: scene.id, time: 0, type: index === 0 ? 'ambient' : 'whoosh', description: `Original ${index === 0 ? 'ambient shimmer' : 'transition whoosh'} for ${scene.title}` },
    { sceneId: scene.id, time: Math.max(1, scene.durationSeconds - 2), type: scene.studentInteraction ? 'pop' : 'sparkle', description: `Light accent cue for ${scene.title}` },
  ]);
}

const placeValueQuiz: QuizQuestion[] = placeValueLessonData.quizQuestions.map((question) => ({
  id: question.id,
  prompt: question.prompt,
  options: [...question.options],
  answer: question.answer,
  explanation: question.explanation,
}));

const rationalNumberScenes: Scene[] = [
  {
    id: 'rational-1-hook',
    title: 'Cinematic Hook',
    durationSeconds: 12,
    purpose: 'Show that integers, decimals and fractions are different names for positions on the same number line.',
    visualDescription: 'A glowing horizontal number line appears in a dark math world. Integers stand like towers, decimals float as fine ticks, and fractions unfold as equal partitions.',
    narration: 'Integers, decimals and fractions may look different, but they can all describe exact positions on the same number line.',
    cameraMovement: 'fly-through along the number line',
    animationSteps: ['Reveal negative and positive integer towers', 'Glow zero as the anchor', 'Zoom into fractional partitions', 'Overlay decimal labels'],
  },
  {
    id: 'rational-2-integers',
    title: 'Integer Motion',
    durationSeconds: 18,
    purpose: 'Explain integer direction and magnitude with movement from zero.',
    visualDescription: 'A student marker starts at zero and travels left for negative numbers and right for positive numbers, leaving a light trail.',
    narration: 'Integers tell us direction and distance from zero. Positive values move right. Negative values move left.',
    cameraMovement: 'pan',
    animationSteps: ['Start marker at zero', 'Move right to positive five', 'Return to zero', 'Move left to negative three', 'Compare distance from zero'],
    studentInteraction: 'Tap the side of zero where -3 belongs.',
  },
  {
    id: 'rational-3-decimal-grid',
    title: 'Decimal Grid Zoom',
    durationSeconds: 18,
    purpose: 'Connect decimals to tenths and hundredths using area models.',
    visualDescription: 'A square grid divides into 10 strips, then 100 cells. Shaded cells become 0.4, 0.45 and equivalent fractions.',
    narration: 'Decimals are fraction ideas written with place value. Tenths divide a whole into ten parts. Hundredths divide it into one hundred parts.',
    cameraMovement: 'zoom-in',
    animationSteps: ['Show one whole square', 'Split into tenths', 'Shade four tenths', 'Split into hundredths', 'Shade forty-five hundredths'],
  },
  {
    id: 'rational-4-fraction-strips',
    title: 'Fraction Strip Bridge',
    durationSeconds: 20,
    purpose: 'Show fractions as equal parts and connect them to decimals.',
    visualDescription: 'Fraction strips stack: halves, quarters, eighths and tenths. Equivalent lengths align and glow.',
    narration: 'A fraction is a comparison: selected equal parts over total equal parts. Equivalent fractions land at the same length.',
    cameraMovement: 'orbit',
    animationSteps: ['Build a one-whole strip', 'Split into halves', 'Split into quarters', 'Align one half with two quarters', 'Reveal 1/2 = 0.5'],
    studentInteraction: 'Match 1/2 to the decimal with the same length.',
  },
  {
    id: 'rational-5-conversion-lab',
    title: 'Conversion Lab',
    durationSeconds: 22,
    purpose: 'Connect integer, decimal and fraction representations through shared position.',
    visualDescription: 'Cards for -1.5, -3/2 and -1 1/2 slide onto the same number-line point while a decimal grid and fraction strip confirm the match.',
    narration: 'When forms are equivalent, they meet at the same position. A decimal, a fraction and a mixed number can be three labels for one value.',
    cameraMovement: 'zoom-in',
    animationSteps: ['Place -1.5 on number line', 'Convert -3/2 to -1.5', 'Align mixed number -1 1/2', 'Glow one shared position'],
  },
  {
    id: 'rational-6-example',
    title: 'Worked Example',
    durationSeconds: 24,
    purpose: 'Solve -7 + 12 - 9 using directed movement.',
    visualDescription: 'A marker starts at -7, moves twelve steps right to 5, then nine steps left to -4.',
    narration: 'Start at negative seven. Adding twelve moves right to five. Subtracting nine moves left to negative four.',
    cameraMovement: 'pan',
    animationSteps: ['Start at -7', 'Move 12 spaces right', 'Pause at 5', 'Move 9 spaces left', 'Reveal final answer -4'],
    studentInteraction: 'Predict the final landing point before the last move.',
  },
  {
    id: 'rational-7-quiz',
    title: 'Quiz Battle',
    durationSeconds: 30,
    purpose: 'Check understanding of placement, conversion and integer operations.',
    visualDescription: 'A challenge arena asks students to place rational numbers, compare forms and calculate integer movement.',
    narration: 'Now use the models. Place, compare and calculate using the number line, grid and fraction strips.',
    cameraMovement: 'static',
    animationSteps: ['Reveal challenge arena', 'Ask placement question', 'Ask conversion question', 'Ask integer movement question', 'Show feedback'],
    studentInteraction: 'Answer five rational-number questions.',
  },
  {
    id: 'rational-8-reward',
    title: 'Reward',
    durationSeconds: 10,
    purpose: 'Celebrate mastery of connected rational representations.',
    visualDescription: 'Number-line particles, grid cells and fraction strips combine into a Rational Number Navigator badge.',
    narration: 'Lesson complete. You can now connect integers, decimals and fractions as one number system.',
    cameraMovement: 'zoom-out',
    animationSteps: ['Merge visual models', 'Reveal XP', 'Award Rational Number Navigator badge'],
  },
];

const rationalNumberQuiz: QuizQuestion[] = [
  {
    id: 'rq1',
    prompt: 'Where is -3 on a number line?',
    options: ['3 spaces right of zero', '3 spaces left of zero', 'Between 0 and 1', 'At zero'],
    answer: '3 spaces left of zero',
    explanation: 'Negative integers are placed to the left of zero. The distance from zero is 3.',
  },
  {
    id: 'rq2',
    prompt: 'Which fraction is equal to 0.5?',
    options: ['1/5', '1/2', '5/10 only, never 1/2', '2/5'],
    answer: '1/2',
    explanation: '0.5 is five tenths, and 5/10 simplifies to 1/2.',
  },
  {
    id: 'rq3',
    prompt: 'Calculate -7 + 12 - 9.',
    options: ['-4', '4', '-28', '14'],
    answer: '-4',
    explanation: 'Start at -7, move 12 right to 5, then move 9 left to -4.',
  },
  {
    id: 'rq4',
    prompt: 'Which is larger: 5/12 or 0.45?',
    options: ['5/12', '0.45', 'They are equal', 'Cannot compare'],
    answer: '0.45',
    explanation: '5/12 is about 0.4167, which is less than 0.45.',
  },
  {
    id: 'rq5',
    prompt: 'Why are decimal grids useful?',
    options: ['They show equal parts of one whole', 'They remove place value', 'They only work for integers', 'They make all numbers positive'],
    answer: 'They show equal parts of one whole',
    explanation: 'A decimal grid shows tenths and hundredths as equal parts, making decimals and fractions visible.',
  },
];

function buildBlueprintQuiz(input: LessonGeneratorInput, visualBlueprint: ReturnType<typeof getVisualResearchBlueprint> | undefined): QuizQuestion[] {
  const model = visualBlueprint?.diagrams[0] ?? 'the lesson model';
  const firstStep = input.workedExample?.steps[0] ?? 'Read the question and identify what is being asked.';
  const finalAnswer = input.workedExample?.answer ?? 'State the answer clearly with units if needed.';
  const examples = input.exampleProblems?.filter(Boolean).slice(0, 5) ?? [];

  const baseQuestions: QuizQuestion[] = [
    {
      id: 'gq1',
      prompt: `For this exam-style problem, what is the strongest first move? ${input.workedExample?.prompt ?? input.subtopic}`,
      options: [firstStep, 'Guess from the numbers only', 'Skip the diagram and write the answer', 'Change the units randomly'],
      answer: firstStep,
      explanation: 'The first move should connect the question to a known method before any final answer is written.',
    },
    {
      id: 'gq2',
      prompt: `Which visual model best explains ${input.subtopic}?`,
      options: [model, 'A random rotating cube', 'A paragraph with no diagram', 'A copied video frame'],
      answer: model,
      explanation: 'This lesson uses a topic-specific model so the mathematics can be seen and manipulated.',
    },
    {
      id: 'gq3',
      prompt: `What should the final working show for ${input.workedExample?.prompt ?? input.subtopic}?`,
      options: [finalAnswer, 'Only the question copied again', 'No units or explanation', 'A different topic'],
      answer: finalAnswer,
      explanation: 'A complete answer states the result and keeps it connected to the question context.',
    },
  ];

  const exerciseQuestions = examples.slice(1).map((problem, index) => ({
    id: `gq-ex-${index + 1}`,
    prompt: `Practice checkpoint: ${problem}`,
    options: ['Set it up using the visual model first', 'Ignore the givens', 'Use a different chapter method', 'Stop after reading the question'],
    answer: 'Set it up using the visual model first',
    explanation: visualBlueprint?.teacherMoves[index % visualBlueprint.teacherMoves.length] ?? 'Use the model to organise the given values before calculating.',
  }));

  return [...baseQuestions, ...exerciseQuestions].slice(0, 5);
}

function buildExamQuestionWalkthrough(
  input: LessonGeneratorInput,
  visualBlueprint: ReturnType<typeof getVisualResearchBlueprint> | undefined,
  isPlaceValue: boolean,
  isRationalNumbers: boolean,
): ExamQuestionWalkthrough {
  if (isPlaceValue) {
    return {
      prompt: 'Exam-style question: Write 5,482 in expanded form and explain the value of each digit.',
      given: ['Number: 5,482', 'Places: thousands, hundreds, tens, ones', 'Required: digit values and expanded form'],
      approach: [
        { title: 'Read the number by place', explanation: 'Separate the number into thousands, hundreds, tens and ones before calculating anything.', visualAction: 'Digits drop into the place-value tower.', working: '5 | 4 | 8 | 2 = thousands | hundreds | tens | ones' },
        { title: 'Multiply each digit by its place value', explanation: 'A digit gets its value from the place it occupies.', visualAction: 'Base-ten blocks appear under each digit.', working: '5 x 1000 = 5000, 4 x 100 = 400, 8 x 10 = 80, 2 x 1 = 2' },
        { title: 'Write the expanded form', explanation: 'Expanded form shows the full value hidden inside the compact number.', visualAction: 'The four block groups slide into one equation line.', working: '5,482 = 5 x 1000 + 4 x 100 + 8 x 10 + 2' },
        { title: 'Check by adding', explanation: 'The parts should rebuild the original number.', visualAction: 'The values merge back into 5,482.', working: '5000 + 400 + 80 + 2 = 5,482' },
      ],
      alternativeApproaches: [
        {
          title: 'Expanded-value table',
          whenToUse: 'Use when the question asks for digit values or expanded form.',
          steps: ['Make columns for thousands, hundreds, tens and ones.', 'Place each digit in its column.', 'Multiply each digit by the column value.', 'Add the parts to check the original number.'],
        },
      ],
      finalAnswer: '5,482 = 5 x 1000 + 4 x 100 + 8 x 10 + 2',
      examTip: 'Always label the place before writing the value. This prevents confusing 8 tens with 8 hundreds.',
    };
  }

  if (isRationalNumbers) {
    return {
      prompt: 'Exam-style question: Calculate -7 + 12 - 9. Show your method on a number line.',
      given: ['Start value: -7', 'Operation 1: add 12', 'Operation 2: subtract 9', 'Required: final value with method'],
      approach: [
        { title: 'Mark the start', explanation: 'For integer operations, begin by placing the first number on the number line.', visualAction: 'The marker lands at -7, left of zero.', working: 'Start at -7' },
        { title: 'Addition moves right', explanation: 'Adding a positive number moves the marker to the right.', visualAction: 'The marker travels 12 spaces right and pauses at 5.', working: '-7 + 12 = 5' },
        { title: 'Subtraction moves left', explanation: 'Subtracting a positive number moves the marker to the left.', visualAction: 'The marker travels 9 spaces left from 5.', working: '5 - 9 = -4' },
        { title: 'Check the direction', explanation: 'The final point should be left of zero because moving left 9 from 5 crosses zero by 4 spaces.', visualAction: 'Zero glows as the marker crosses it and lands at -4.', working: '-7 + 12 - 9 = -4' },
      ],
      alternativeApproaches: [
        {
          title: 'Pair positives and negatives',
          whenToUse: 'Use when the expression has several integer additions and subtractions.',
          steps: ['Rewrite subtraction as adding a negative: -7 + 12 + (-9).', 'Combine positives: 12.', 'Combine negatives: -7 + -9 = -16.', 'Then 12 + -16 = -4.'],
        },
        {
          title: 'Number-line movement',
          whenToUse: 'Use when you need to show a visual method clearly.',
          steps: ['Start at -7.', 'Move 12 spaces right.', 'Move 9 spaces left.', 'Read the landing point: -4.'],
        },
      ],
      finalAnswer: '-4',
      examTip: 'Use arrows for every operation. Right means add; left means subtract.',
    };
  }

  if (input.animationMode === 'percentage-bars') {
    return {
      prompt: 'Exam-style question: Find 8% of 300.',
      given: ['Percentage: 8%', 'Whole quantity: 300', 'Required: the part represented by 8%'],
      approach: [
        {
          title: 'Write percent as a fraction',
          explanation: 'Percent means out of 100, so 8% becomes 8/100.',
          visualAction: 'The percent symbol transforms into a fraction bar: 8 over 100.',
          working: '8% = 8/100',
        },
        {
          title: 'Multiply by the whole',
          explanation: 'The word "of" means multiply in this type of percentage question.',
          visualAction: 'The fraction 8/100 connects to 300/1.',
          working: '8% of 300 = 8/100 x 300/1',
        },
        {
          title: 'Cancel before multiplying',
          explanation: 'Simplify 300/100 by dividing both numbers by 100. This makes the calculation smaller.',
          visualAction: '100 and 300 are crossed out and replaced by 1 and 3.',
          working: '8/100 x 300/1 = 8/1 x 3/1',
        },
        {
          title: 'Multiply the remaining numbers',
          explanation: 'Now multiply the numerators and denominators.',
          visualAction: '8 and 3 slide together to form 24.',
          working: '8 x 3 = 24',
        },
      ],
      alternativeApproaches: [
        {
          title: 'Decimal multiplier method',
          whenToUse: 'Use when converting the percent to a decimal is quick.',
          steps: ['8% = 0.08', '0.08 x 300 = 24', 'So 8% of 300 is 24.'],
        },
        {
          title: 'Mental 1% method',
          whenToUse: 'Use when the whole is easy to divide by 100.',
          steps: ['1% of 300 = 3', '8% is eight lots of 1%', '8 x 3 = 24.'],
        },
      ],
      finalAnswer: '24',
      examTip: 'For percentage-of-quantity questions, choose the method that gives the cleanest arithmetic: fraction cancellation, decimal multiplier or 1% method.',
    };
  }

  const worked = input.workedExample;
  const prompt = worked?.prompt ?? input.exampleProblems?.[0] ?? `Solve an exam-style question about ${input.subtopic}.`;
  const steps = worked?.steps?.length ? worked.steps : ['Identify what the question gives.', 'Choose the correct visual model.', 'Carry out the calculation carefully.', 'Check the result against the context.'];
  const model = visualBlueprint?.diagrams[0] ?? 'visual model';
  const difficultModes: AnimationMode[] = ['percentage-bars', 'equation-balance', 'coordinate-grid', 'circle-lab', 'solid-builder', 'data-lab', 'probability-spinner'];
  const shouldShowAlternative = input.animationMode ? difficultModes.includes(input.animationMode) : false;

  return {
    prompt: `Exam-style question: ${prompt}`,
    given: [input.textbookReference ? `Textbook alignment: ${input.textbookReference}` : input.subtopic, `Model: ${model}`, `Required: ${worked?.answer ? 'show working and final answer' : 'clear method and answer'}`],
    approach: [
      { title: 'Read and underline the target', explanation: 'Decide exactly what the question is asking before choosing a method.', visualAction: `Highlight the key information and open the ${model}.`, working: prompt },
      { title: 'Choose the model', explanation: visualBlueprint?.researchBasis[0] ?? 'Use a visual representation to reduce guessing.', visualAction: visualBlueprint?.threeDModels[0] ?? 'The model appears and labels the known quantities.', working: visualBlueprint?.teacherMoves[0] ?? 'Represent the known values visually.' },
      ...steps.slice(0, 3).map((step, index) => ({
        title: `Solve step ${index + 1}`,
        explanation: 'Connect the calculation to the visual model so the method is memorable.',
        visualAction: visualBlueprint?.interactions[index] ?? 'Animate the next mathematical step.',
        working: step,
      })),
      { title: 'Check and state the answer', explanation: 'A final exam answer should be clear, labelled and checked against the question.', visualAction: 'The answer locks into the final callout.', working: worked?.answer ? `Answer: ${worked.answer}` : 'State the final answer with units if needed.' },
    ].slice(0, 6),
    alternativeApproaches: shouldShowAlternative
      ? [
          {
            title: 'Visual-first approach',
            whenToUse: 'Use when the diagram makes the relationship clearer than symbols alone.',
            steps: [visualBlueprint?.diagrams[0] ?? 'Draw the key model.', visualBlueprint?.interactions[0] ?? 'Mark the known values.', 'Use the model to decide the operation.', worked?.answer ? `State the answer: ${worked.answer}` : 'State the final answer clearly.'],
          },
          {
            title: 'Symbolic shortcut',
            whenToUse: 'Use when you already understand the relationship and need an efficient exam method.',
            steps: [...steps.slice(0, 3), worked?.answer ? `Answer: ${worked.answer}` : 'Check the result.'],
          },
        ]
      : undefined,
    finalAnswer: worked?.answer ?? 'Use the completed working to state the answer.',
    examTip: visualBlueprint?.teacherMoves[1] ?? 'Show enough working that someone can follow your method.',
  };
}

export function generateLessonAssetPackage(input: LessonGeneratorInput): LessonVideoAssetPackage {
  const visualBlueprint = input.animationMode ? getVisualResearchBlueprint(input.animationMode) : undefined;
  const isPlaceValue = input.subject.toLowerCase().includes('math') && input.subtopic.toLowerCase().includes('place value');
  const isRationalNumbers =
    input.subject.toLowerCase().includes('math') &&
    input.subtopic.toLowerCase().includes('integers') &&
    input.subtopic.toLowerCase().includes('decimals') &&
    input.subtopic.toLowerCase().includes('fractions');
  const scenes = isPlaceValue
    ? placeValueScenes
    : isRationalNumbers
      ? rationalNumberScenes
    : visualBlueprint
      ? [
          {
            id: `scene-1-${input.animationMode}-hook`,
            title: `Cinematic Hook - ${input.subtopic}`,
            durationSeconds: 12,
            purpose: `Create curiosity using ${visualBlueprint.researchBasis[0]}`,
            visualDescription: visualBlueprint.cinematicScenes[0],
            narration: `${input.subtopic} becomes clear when we see it through the right model: ${visualBlueprint.diagrams[0].toLowerCase()}.`,
            cameraMovement: 'slow zoom-in',
            animationSteps: [visualBlueprint.cinematicScenes[0], visualBlueprint.diagrams[0], visualBlueprint.teacherMoves[0]],
          },
          {
            id: `scene-2-${input.animationMode}-model`,
            title: 'Build the Visual Model',
            durationSeconds: 18,
            purpose: visualBlueprint.researchBasis[1] ?? visualBlueprint.researchBasis[0],
            visualDescription: `${visualBlueprint.diagrams.slice(0, 3).join(', ')} appear as connected representations.`,
            narration: `First, we build the idea visually. Watch how ${visualBlueprint.diagrams[1].toLowerCase()} connects to the symbols.`,
            cameraMovement: 'orbit around model',
            animationSteps: [visualBlueprint.threeDModels[0], visualBlueprint.threeDModels[1], visualBlueprint.interactions[0]],
            studentInteraction: visualBlueprint.interactions[0],
          },
          {
            id: `scene-3-${input.animationMode}-example`,
            title: 'Worked Example',
            durationSeconds: 22,
            purpose: 'Apply the visual model to a textbook-style example.',
            visualDescription: `${input.exampleProblems?.[0] ?? input.subtopic} is solved using ${visualBlueprint.diagrams[0].toLowerCase()} and animated callouts.`,
            narration: `Now the visual model becomes a method. Each step has a visible reason.`,
            cameraMovement: 'pan across solution steps',
            animationSteps: [visualBlueprint.cinematicScenes[1], visualBlueprint.interactions[1], visualBlueprint.teacherMoves[1]],
          },
          {
            id: `scene-4-${input.animationMode}-checkpoint`,
            title: 'Interactive Checkpoint',
            durationSeconds: 18,
            purpose: 'Pause for student action and teacher discussion.',
            visualDescription: `The lesson pauses on ${visualBlueprint.interactions[2] ?? visualBlueprint.interactions[0]}.`,
            narration: `Your turn. Use the model to make the next move, then explain why it works.`,
            cameraMovement: 'static',
            animationSteps: [visualBlueprint.interactions[0], visualBlueprint.interactions[1], visualBlueprint.interactions[2] ?? visualBlueprint.teacherMoves[0]],
            studentInteraction: visualBlueprint.interactions[2] ?? visualBlueprint.interactions[0],
          },
          {
            id: `scene-5-${input.animationMode}-reward`,
            title: 'Reward',
            durationSeconds: 10,
            purpose: 'Celebrate completion and summarise the visual idea.',
            visualDescription: `${visualBlueprint.threeDModels[0]} and ${visualBlueprint.diagrams[0]} combine into a mastery badge.`,
            narration: `Lesson complete. You can now explain ${input.subtopic} using a strong visual model.`,
            cameraMovement: 'zoom-out',
            animationSteps: ['Show summary', 'Reveal badge', 'Award XP'],
          },
        ]
      : [
        {
          id: 'scene-1-hook',
          title: `Why ${input.subtopic} Matters`,
          durationSeconds: 12,
          purpose: 'Create curiosity and connect the idea to a real student problem.',
          visualDescription: `A glowing ${input.subtopic} world opens in a futuristic classroom.`,
          narration: `${input.subtopic} is not just a rule. It is a way to see a hidden pattern clearly.`,
          cameraMovement: 'slow zoom-in',
          animationSteps: ['Reveal concept title', 'Show real-world question', 'Highlight key unknown'],
        },
        {
          id: 'scene-2-model',
          title: 'Build the Visual Model',
          durationSeconds: 18,
          purpose: 'Represent the concept with an original visual model.',
          visualDescription: `Animated shapes, labels and arrows form a clear model for ${input.subtopic}.`,
          narration: `First, we build the idea visually. Then we connect the visual model to mathematical symbols.`,
          cameraMovement: 'orbit around model',
          animationSteps: ['Spawn model pieces', 'Attach labels', 'Show transformation arrows'],
          studentInteraction: 'Tap the highlighted part of the model.',
        },
        {
          id: 'scene-3-example',
          title: 'Worked Example',
          durationSeconds: 22,
          purpose: 'Apply the model to a worked example.',
          visualDescription: `Example values appear and are solved through the same model.`,
          narration: `Now the model becomes a method. Each step has a visual reason.`,
          cameraMovement: 'pan across solution steps',
          animationSteps: ['Reveal example', 'Animate step one', 'Animate step two', 'Show final answer'],
        },
        {
          id: 'scene-4-checkpoint',
          title: 'Interactive Checkpoint',
          durationSeconds: 18,
          purpose: 'Pause for active student thinking.',
          visualDescription: 'A glowing checkpoint pauses the lesson and asks the student to choose or build the next step.',
          narration: `Your turn. Use the visual pattern to make the next move.`,
          cameraMovement: 'static',
          animationSteps: ['Pause timeline', 'Show choices', 'React to student answer'],
          studentInteraction: 'Answer the checkpoint question.',
        },
        {
          id: 'scene-5-reward',
          title: 'Reward',
          durationSeconds: 10,
          purpose: 'Celebrate completion and summarise the core idea.',
          visualDescription: 'A badge and XP reward appear with lightweight particle motion.',
          narration: `Lesson complete. You can now explain the core idea behind ${input.subtopic}.`,
          cameraMovement: 'zoom-out',
          animationSteps: ['Show summary', 'Reveal badge', 'Award XP'],
        },
      ];

  const quiz = isPlaceValue
    ? placeValueQuiz
    : isRationalNumbers
      ? rationalNumberQuiz
      : buildBlueprintQuiz(input, visualBlueprint);

  const interactions: Interaction[] = isPlaceValue
    ? [
        { id: 'tap-digit', sceneId: 'scene-4-example-5482', type: 'tap', prompt: 'Tap a digit to reveal its value.', correctResponse: 'Any digit selected', feedback: 'The selected digit glows and its value appears.' },
        { id: 'move-digit', sceneId: 'scene-5-digit-power', type: 'drag', prompt: 'Move digit 5 to a new place.', correctResponse: 'Place selected', feedback: 'The value updates from 5 to 50, 500 or 5000.' },
        { id: 'remove-zero', sceneId: 'scene-7-zero-placeholder', type: 'tap', prompt: 'Remove zero and observe the change.', correctResponse: 'Zero removed', feedback: '7,305 compresses into 735, showing why zero matters.' },
      ]
    : visualBlueprint
      ? visualBlueprint.interactions.slice(0, 5).map((prompt, index) => ({
          id: `interaction-${index + 1}`,
          sceneId: scenes[Math.min(index + 1, scenes.length - 1)]?.id ?? scenes[0].id,
          type: index === 0 ? 'drag' : index === 1 ? 'tap' : index === 2 ? 'match' : 'answer',
          prompt,
          correctResponse: 'Student completes the model action and explains the reasoning.',
          feedback: visualBlueprint.teacherMoves[index % visualBlueprint.teacherMoves.length],
        }))
      : [
          { id: 'generic-interaction', sceneId: scenes[1]?.id ?? scenes[0].id, type: 'answer', prompt: `Explain the key idea in ${input.subtopic}.`, correctResponse: 'Clear explanation', feedback: 'Connect the explanation to the visual model and the worked example.' },
        ];

  return {
    lessonId: `${input.subject}-${input.grade}-${input.chapter}-${input.subtopic}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: isPlaceValue ? placeValueLessonData.title : `${input.subtopic}: Cinematic Explainer`,
    subject: input.subject,
    grade: input.grade,
    chapter: input.chapter,
    subtopic: input.subtopic,
    cinematicStyle: input.preferredVisualStyle,
    objectives: input.learningObjectives,
    textbookReference: input.textbookReference,
    scenes,
    narrationScript: buildNarration(scenes),
    cameraDirections: buildCameraDirections(scenes),
    animationTimeline: buildAnimationTimeline(scenes),
    soundDesignNotes: buildSoundCues(scenes),
    visualAssets: [
      { id: 'world-bg', type: 'background', description: 'Original dark navy futuristic classroom background with soft glow fields.', ownership: 'generated-original' },
      { id: 'math-blocks', type: '3d-model', description: 'Original CSS/SVG 2.5D math manipulatives generated by the app.', ownership: 'app-owned' },
      { id: 'labels-callouts', type: 'label', description: 'Original animated labels, arrows and callouts.', ownership: 'app-owned' },
      { id: 'particles', type: 'particle', description: 'Lightweight original reward and transition particles.', ownership: 'generated-original' },
      ...(visualBlueprint
        ? visualBlueprint.threeDModels.map((model, index) => ({
            id: `visual-model-${index + 1}`,
            type: '3d-model' as const,
            description: model,
            ownership: 'generated-original' as const,
          }))
        : []),
    ],
    interactions,
    quiz,
    reward: {
      xp: isPlaceValue ? placeValueLessonData.rewards.xp : isRationalNumbers ? 420 : 300,
      badge: isPlaceValue ? placeValueLessonData.rewards.badge : isRationalNumbers ? 'Rational Number Navigator' : `${input.subtopic} Explorer`,
      message: 'Lesson Complete',
    },
    visualBlueprint,
    examQuestion: buildExamQuestionWalkthrough(input, visualBlueprint, isPlaceValue, isRationalNumbers),
  };
}

export function inputFromCourseLesson(lesson: CourseLesson, chapter: string): LessonGeneratorInput {
  return {
    subject: 'Mathematics',
    grade: 8,
    chapter,
    subtopic: lesson.title,
    learningObjectives: lesson.objectives,
    difficultyLevel: 'standard',
    exampleProblems: [lesson.workedExample.prompt, ...lesson.exercises.fluency],
    workedExample: lesson.workedExample,
    textbookReference: lesson.textbookSection,
    preferredVisualStyle: 'Futuristic classroom, glowing 3D math world, neon blue and gold accents',
    animationMode: lesson.animation,
  };
}
