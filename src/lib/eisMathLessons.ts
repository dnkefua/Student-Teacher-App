import { NeuroQuestAssignment } from './neuroquest';

export type EISMathLesson = {
  id: string;
  unit: string;
  title: string;
  textbookSource: string;
  grade: string;
  concept: string;
  narrative: string;
  objectives: string[];
  teacherFlow: string[];
  studentEvidence: string[];
  misconception: string;
  gameSlug: string;
  accent: string;
  example: {
    prompt: string;
    solution: string;
    equation: string;
  };
  visual: 'number-line' | 'equation-balance' | 'power-cubes' | 'geometry-prism' | 'graph-motion';
};

export const eisMathLessons: EISMathLesson[] = [
  {
    id: 'eis-g8-number',
    unit: 'Unit 1',
    title: 'Number Systems, Integers and Indices',
    textbookSource: 'EIS Grade 8 Mathematics textbook resources: negative integers, prime factors, indices, HCF and order of operations.',
    grade: 'EIS Grade 8',
    concept: 'Number sense and priority of operations',
    narrative: 'Students enter a high-speed number arena where every gate opens only when signs, powers, and prime factors are handled in the correct order.',
    objectives: [
      'Calculate with positive and negative integers on a number line.',
      'Apply order of operations with brackets and powers.',
      'Use prime factor decomposition to find HCF and LCM.',
    ],
    teacherFlow: [
      'Open with an animated number-line jump for a negative-integer calculation.',
      'Model one textbook-style worked example with powers before multiplication.',
      'Launch Velocity Quest 3D as a 12-minute fluency sprint.',
      'Close with an error-analysis reflection using one wrong answer from the sprint.',
    ],
    studentEvidence: [
      'Screenshot or record score from Velocity Quest 3D.',
      'Write one worked example using order of operations.',
      'Explain one sign error and how it was corrected.',
    ],
    misconception: 'Students often multiply before handling powers or treat subtracting a negative as ordinary subtraction.',
    gameSlug: 'math-racer-3d',
    accent: '#f59e0b',
    example: {
      prompt: 'Calculate -6 + 4 x 3^2 and write 84 as a product of prime factors.',
      equation: '-6 + 4 x 3^2 = 30; 84 = 2^2 x 3 x 7',
      solution: 'Powers first: 3^2 = 9. Multiply: 4 x 9 = 36. Add: -6 + 36 = 30. Then 84 = 2 x 2 x 3 x 7.',
    },
    visual: 'number-line',
  },
  {
    id: 'eis-g8-equations',
    unit: 'Unit 2',
    title: 'Equations and Formulae',
    textbookSource: 'EIS Grade 8 Mathematics textbook resources: one-step, two-step and complex equations, rearranging formulae.',
    grade: 'EIS Grade 8',
    concept: 'Balance method and rearranging formulae',
    narrative: 'Students work in a formula control room where both sides of the equation must stay balanced for the doors to unlock.',
    objectives: [
      'Solve one-step, two-step and x-on-both-sides equations.',
      'Use inverse operations to preserve equality.',
      'Rearrange formulae such as speed, area and volume relationships.',
    ],
    teacherFlow: [
      'Demonstrate the balance animation for 4x - 3 = 21.',
      'Ask students to name the inverse operation before each move.',
      'Use a paired whiteboard challenge before launching the game.',
      'Assess with a quick rearranging-formula exit ticket.',
    ],
    studentEvidence: [
      'Submit three solved equations with checks.',
      'Explain which inverse operation was used first.',
      'Complete a formula rearrangement reflection.',
    ],
    misconception: 'Students move terms across the equals sign without applying the same operation to both sides.',
    gameSlug: 'math-racer-3d',
    accent: '#6366f1',
    example: {
      prompt: 'Solve 3(2x - 1) = 27, then rearrange A = lw to make w the subject.',
      equation: '3(2x - 1) = 27 -> x = 5; w = A / l',
      solution: 'Divide by 3: 2x - 1 = 9. Add 1: 2x = 10. Divide by 2: x = 5. For A = lw, divide both sides by l.',
    },
    visual: 'equation-balance',
  },
  {
    id: 'eis-g8-powers-algebra',
    unit: 'Unit 3',
    title: 'Working with Powers and Algebra',
    textbookSource: 'EIS Grade 8 Mathematics textbook resources: simplifying, expanding, factorising, substituting and powers.',
    grade: 'EIS Grade 8',
    concept: 'Expression structure and algebraic transformation',
    narrative: 'Students enter an algebra forge where terms combine, brackets expand, and powers stack into glowing cubes.',
    objectives: [
      'Collect like terms and simplify algebraic expressions.',
      'Expand and factorise single brackets.',
      'Substitute values into algebraic expressions involving powers.',
    ],
    teacherFlow: [
      'Use power cubes to show repeated multiplication and index laws.',
      'Model expanding every term inside a bracket.',
      'Run a short Math Runner fluency challenge.',
      'Close with students creating one equivalent expression.',
    ],
    studentEvidence: [
      'Submit one expansion and one factorisation.',
      'Evaluate an expression for a negative value of x.',
      'Describe how they know two expressions are equivalent.',
    ],
    misconception: 'Students may add exponents in the wrong situations or fail to multiply every term in a bracket.',
    gameSlug: 'math-runner',
    accent: '#14b8a6',
    example: {
      prompt: 'Expand and simplify 3(x + 4) - 2(x - 5), then evaluate when x = 6.',
      equation: '3(x + 4) - 2(x - 5) = x + 22; when x = 6, value = 28',
      solution: 'Expand to 3x + 12 - 2x + 10. Combine like terms to get x + 22. Substitute 6 to get 28.',
    },
    visual: 'power-cubes',
  },
  {
    id: 'eis-g8-geometry',
    unit: 'Unit 4',
    title: '2D Shapes and 3D Solids',
    textbookSource: 'EIS Grade 8 Mathematics textbook resources: area, surface area, volume, plans and elevations.',
    grade: 'EIS Grade 8',
    concept: 'Measurement, volume and spatial reasoning',
    narrative: 'Students become design engineers in a 3D blueprint lab, building solids only after proving area, volume and views.',
    objectives: [
      'Find areas of triangles, parallelograms and compound shapes.',
      'Calculate volume and surface area of cuboids and prisms.',
      'Interpret plans and elevations of simple solids.',
    ],
    teacherFlow: [
      'Rotate the animated prism and identify length, width and height.',
      'Link each visible face to surface-area pairs.',
      'Launch Maze Pursuit 3D for spatial reasoning and decision making.',
      'Collect a drawing of one plan and one elevation.',
    ],
    studentEvidence: [
      'Calculate volume and surface area for one prism.',
      'Draw top, front and side views.',
      'Explain the difference between volume and surface area.',
    ],
    misconception: 'Students often use area units for volume or count only three faces when calculating total surface area.',
    gameSlug: 'maze-pursuit-3d',
    accent: '#ec4899',
    example: {
      prompt: 'A rectangular prism is 8 cm long, 5 cm wide and 3 cm high. Find volume and total surface area.',
      equation: 'V = 8 x 5 x 3 = 120 cm^3; SA = 2(40 + 24 + 15) = 158 cm^2',
      solution: 'Volume is length x width x height. Surface area adds matching face pairs: 2(lw + lh + wh).',
    },
    visual: 'geometry-prism',
  },
  {
    id: 'eis-g8-graphs',
    unit: 'Unit 5',
    title: 'Graphs, Rates and Motion',
    textbookSource: 'EIS Grade 8 Mathematics textbook resources: direct proportion, interpreting graphs, distance-time graphs, rates and misleading graphs.',
    grade: 'EIS Grade 8',
    concept: 'Rate of change and graph interpretation',
    narrative: 'Students operate a graph command deck where slope, speed and axis choices change the route through the academy.',
    objectives: [
      'Interpret direct proportion and distance-time graphs.',
      'Calculate speed from distance and time.',
      'Recognise misleading graphs and explain why they distort data.',
    ],
    teacherFlow: [
      'Animate a runner on a distance-time graph and pause at flat sections.',
      'Compare a fair axis with a truncated misleading axis.',
      'Launch Velocity Quest 3D for rate and mental calculation practice.',
      'Use a graph interpretation mini-conference in the online classroom.',
    ],
    studentEvidence: [
      'Calculate one speed from a graph.',
      'Annotate a graph showing rest, constant speed and faster speed.',
      'Write why one chart is misleading.',
    ],
    misconception: 'Students may read the height of a distance-time graph as speed instead of using gradient.',
    gameSlug: 'math-racer-3d',
    accent: '#0ea5e9',
    example: {
      prompt: 'A runner travels 240 m in 30 s. Find the speed and explain a horizontal section on a distance-time graph.',
      equation: 'speed = 240 / 30 = 8 m/s',
      solution: 'Speed equals distance divided by time. A horizontal distance-time graph section means distance is not changing, so the runner is stationary.',
    },
    visual: 'graph-motion',
  },
];

export function createEISAssignment(lesson: EISMathLesson): NeuroQuestAssignment {
  return {
    id: `eis-${lesson.id}-${Date.now()}`,
    gameSlug: lesson.gameSlug,
    title: `EIS Grade 8 Maths: ${lesson.title}`,
    objective: lesson.objectives.join(' '),
    duration: '45 minutes',
    instructions: [
      lesson.narrative,
      `Complete the NeuroQuest activity linked to ${lesson.unit}.`,
      `Evidence: ${lesson.studentEvidence.join(' ')}`,
    ].join('\n'),
    createdAt: new Date().toISOString(),
  };
}
