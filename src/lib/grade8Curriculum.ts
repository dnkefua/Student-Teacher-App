export type CurriculumUnit = 'numerical' | 'abstract' | 'spatial' | 'data';

export type CurriculumQuestion = {
  id: string;
  unit: CurriculumUnit;
  unitLabel: string;
  topic: string;
  title: string;
  question: string;
  prompt: string;
  expectedAnswer: string;
  answerHints: string[];
  teacherNote: string;
  correctFeedback: string;
  partialFeedback: string;
};

export const unitLabels: Record<CurriculumUnit, string> = {
  numerical: 'Numerical Reasoning',
  abstract: 'Abstract Reasoning',
  spatial: 'Spatial Reasoning',
  data: 'Reasoning with Data',
};

export const grade8Curriculum: CurriculumQuestion[] = [
  {
    id: 'abstract-linear-equation',
    unit: 'abstract',
    unitLabel: unitLabels.abstract,
    topic: 'Linear equations',
    title: 'Equation Balance Checkpoint',
    question: 'Solve 5x - 7 = 28 and explain the inverse operations.',
    prompt: 'Show how to keep both sides balanced, then check your answer.',
    expectedAnswer: 'x = 7',
    answerHints: ['x=7', 'xequals7'],
    teacherNote: 'Add 7 to both sides, divide both sides by 5, then substitute x = 7 to check.',
    correctFeedback: 'Correct. You isolated 5x by adding 7, divided by 5, and checked x = 7 in the original equation.',
    partialFeedback: 'Good start. Add 7 to both sides first, then divide both sides by 5.',
  },
  {
    id: 'abstract-gradient-intercept',
    unit: 'abstract',
    unitLabel: unitLabels.abstract,
    topic: 'Linear relationships (y = mx + c)',
    title: 'Gradient and y-intercept',
    question: 'For the line y = 3x - 5, identify the gradient and the y-intercept.',
    prompt: 'Use the form y = mx + c to read the gradient (m) and the y-intercept (c).',
    expectedAnswer: 'gradient = 3, y-intercept = -5',
    answerHints: ['gradient3', 'm=3', 'intercept-5', 'c=-5'],
    teacherNote: 'Students should recognise m as the coefficient of x and c as the constant term.',
    correctFeedback: 'Correct. The gradient is 3 (rise over run) and the y-intercept is -5 (where the line crosses the y-axis).',
    partialFeedback: 'Re-read y = mx + c. The number in front of x is the gradient, the constant is the y-intercept.',
  },
  {
    id: 'abstract-quadratic',
    unit: 'abstract',
    unitLabel: unitLabels.abstract,
    topic: 'Quadratic equations (a = 1)',
    title: 'Factorise and solve',
    question: 'Solve x² + 5x + 6 = 0 by factorising.',
    prompt: 'Find two numbers that multiply to 6 and add to 5, then factorise.',
    expectedAnswer: 'x = -2 or x = -3',
    answerHints: ['x=-2', 'x=-3', '-2,-3', '-3,-2'],
    teacherNote: 'Factorisation: (x + 2)(x + 3) = 0, giving x = -2 or x = -3.',
    correctFeedback: 'Correct. (x + 2)(x + 3) = 0 gives the two roots x = -2 and x = -3.',
    partialFeedback: 'Look for two numbers whose product is 6 and sum is 5 — they will be the roots (with opposite signs).',
  },
  {
    id: 'numerical-recurring-decimal',
    unit: 'numerical',
    unitLabel: unitLabels.numerical,
    topic: 'Recurring decimals',
    title: 'Convert recurring decimal to fraction',
    question: 'Express 0.4444... (0.4 recurring) as a fraction in simplest form.',
    prompt: 'Let x = 0.4444..., then form 10x and subtract to eliminate the recurring part.',
    expectedAnswer: '4/9',
    answerHints: ['4/9'],
    teacherNote: 'Let x = 0.4̇. Then 10x = 4.4̇. Subtracting gives 9x = 4, so x = 4/9.',
    correctFeedback: 'Correct. Letting x = 0.4̇ and forming 10x - x = 9x = 4 gives x = 4/9.',
    partialFeedback: 'Set x equal to the decimal, multiply by 10 to shift the digits, then subtract to remove the recurring part.',
  },
  {
    id: 'numerical-exponents',
    unit: 'numerical',
    unitLabel: unitLabels.numerical,
    topic: 'Laws of exponents',
    title: 'Simplify using index laws',
    question: 'Simplify (2³ × 2⁴) ÷ 2⁵ as a single power of 2 and as a whole number.',
    prompt: 'Use the product rule for the numerator, then the quotient rule.',
    expectedAnswer: '2² = 4',
    answerHints: ['2^2', '2²', '=4'],
    teacherNote: 'Product rule: 2³ × 2⁴ = 2⁷. Quotient rule: 2⁷ ÷ 2⁵ = 2² = 4.',
    correctFeedback: 'Correct. Add the exponents in the product (3 + 4 = 7), subtract for the quotient (7 - 5 = 2), so the answer is 2² = 4.',
    partialFeedback: 'Use a^m × a^n = a^(m+n) for the top, then a^m ÷ a^n = a^(m-n) for the full expression.',
  },
  {
    id: 'numerical-standard-form',
    unit: 'numerical',
    unitLabel: unitLabels.numerical,
    topic: 'Standard form',
    title: 'Write a number in standard form',
    question: 'Write 0.00045 in standard form (scientific notation).',
    prompt: 'A number in standard form has one non-zero digit before the decimal point.',
    expectedAnswer: '4.5 × 10⁻⁴',
    answerHints: ['4.5x10-4', '4.5×10-4', '4.5*10^-4', '4.5e-4'],
    teacherNote: 'Move the decimal point 4 places right to get 4.5, so the exponent is -4.',
    correctFeedback: 'Correct. 0.00045 = 4.5 × 10⁻⁴. The negative exponent shows we moved the point right.',
    partialFeedback: 'Count how many places you move the decimal point. Moving right means a negative exponent.',
  },
  {
    id: 'spatial-pythagoras',
    unit: 'spatial',
    unitLabel: unitLabels.spatial,
    topic: 'Pythagoras',
    title: 'Find the hypotenuse',
    question: 'A right-angled triangle has legs of length 6 cm and 8 cm. Find the length of the hypotenuse.',
    prompt: 'Apply a² + b² = c² and take the positive square root.',
    expectedAnswer: '10 cm',
    answerHints: ['10cm', '=10', 'c=10', 'hypotenuse10'],
    teacherNote: '6² + 8² = 36 + 64 = 100, so c = √100 = 10 cm.',
    correctFeedback: 'Correct. 6² + 8² = 100, and √100 = 10, so the hypotenuse is 10 cm.',
    partialFeedback: 'Square both legs, add them, then take the square root. Remember the answer is a length.',
  },
  {
    id: 'spatial-trigonometry',
    unit: 'spatial',
    unitLabel: unitLabels.spatial,
    topic: 'Basic trigonometry',
    title: 'Sine ratio',
    question: 'In a right-angled triangle, the side opposite angle θ is 3 and the hypotenuse is 5. Find sin θ.',
    prompt: 'Use SOH: sin θ = opposite / hypotenuse.',
    expectedAnswer: 'sin θ = 3/5 = 0.6',
    answerHints: ['3/5', '0.6', 'sinθ=0.6', 'sin=0.6'],
    teacherNote: 'sin θ = opposite / hypotenuse = 3/5 = 0.6.',
    correctFeedback: 'Correct. SOH gives sin θ = opposite ÷ hypotenuse = 3 ÷ 5 = 0.6.',
    partialFeedback: 'Recall SOH-CAH-TOA. Sine uses opposite over hypotenuse.',
  },
  {
    id: 'data-probability',
    unit: 'data',
    unitLabel: unitLabels.data,
    topic: 'Probability',
    title: 'Probability of two heads',
    question: 'A fair coin is flipped twice. What is the probability of getting two heads in a row?',
    prompt: 'Multiply independent probabilities, or list the sample space {HH, HT, TH, TT}.',
    expectedAnswer: '1/4 = 0.25',
    answerHints: ['1/4', '0.25', '25%'],
    teacherNote: 'P(H) × P(H) = 1/2 × 1/2 = 1/4. Or 1 favourable outcome (HH) out of 4 equally likely outcomes.',
    correctFeedback: 'Correct. Independent events multiply: 1/2 × 1/2 = 1/4 (or 0.25, or 25%).',
    partialFeedback: 'List all four outcomes (HH, HT, TH, TT) — only one has two heads.',
  },
  {
    id: 'data-mean',
    unit: 'data',
    unitLabel: unitLabels.data,
    topic: 'Measures of central tendency',
    title: 'Find the mean',
    question: 'Find the mean of the data set: 4, 8, 6, 10, 12.',
    prompt: 'Add the values, then divide by the number of values.',
    expectedAnswer: '8',
    answerHints: ['=8', 'mean8', 'mean=8'],
    teacherNote: '4 + 8 + 6 + 10 + 12 = 40. 40 ÷ 5 = 8.',
    correctFeedback: 'Correct. The five values total 40, and 40 ÷ 5 = 8.',
    partialFeedback: 'Sum all values, then divide by how many values there are.',
  },
];

export function findQuestionById(id: string): CurriculumQuestion | undefined {
  return grade8Curriculum.find((question) => question.id === id);
}

export function checkAnswer(question: CurriculumQuestion, answer: string): boolean {
  const normalized = answer.toLowerCase().replace(/\s+/g, '');
  return question.answerHints.some((hint) => normalized.includes(hint.toLowerCase().replace(/\s+/g, '')));
}
