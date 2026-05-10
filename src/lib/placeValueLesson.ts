export type PlaceValueExample = {
  id: string;
  number: string;
  digits: ReadonlyArray<{
    digit: number;
    place: 'thousands' | 'hundreds' | 'tens' | 'ones';
    multiplier: number;
    value: number;
  }>;
  expandedForm: string;
  explanation: string;
};

export type PlaceValueQuizQuestion = {
  id: string;
  prompt: string;
  options: ReadonlyArray<string>;
  answer: string;
  explanation: string;
};

export const placeValueLessonData = {
  title: 'The Secret Power Inside Numbers',
  grade: 8,
  subject: 'Mathematics',
  subtitle: 'Learn how every digit gets its power from its position.',
  objectives: [
    'Identify thousands, hundreds, tens and ones.',
    'Explain the value of a digit using its position.',
    'Write numbers in expanded form.',
    'Explain zero as a placeholder.',
    'Describe how moving left or right changes value by powers of 10.',
  ],
  vocabulary: ['digit', 'place value', 'expanded form', 'placeholder', 'power of 10'],
  examples: [
    {
      id: '5482',
      number: '5,482',
      digits: [
        { digit: 5, place: 'thousands', multiplier: 1000, value: 5000 },
        { digit: 4, place: 'hundreds', multiplier: 100, value: 400 },
        { digit: 8, place: 'tens', multiplier: 10, value: 80 },
        { digit: 2, place: 'ones', multiplier: 1, value: 2 },
      ],
      expandedForm: '5,482 = 5 x 1000 + 4 x 100 + 8 x 10 + 2',
      explanation: 'Each digit gains its value from the place it occupies. The 5 is worth 5000 because it sits in the thousands place.',
    },
    {
      id: '7305',
      number: '7,305',
      digits: [
        { digit: 7, place: 'thousands', multiplier: 1000, value: 7000 },
        { digit: 3, place: 'hundreds', multiplier: 100, value: 300 },
        { digit: 0, place: 'tens', multiplier: 10, value: 0 },
        { digit: 5, place: 'ones', multiplier: 1, value: 5 },
      ],
      expandedForm: '7,305 = 7 x 1000 + 3 x 100 + 0 x 10 + 5',
      explanation: 'Zero in the tens place is holding the position open. Removing it changes 7,305 into 735, a completely different value.',
    },
  ],
  quizQuestions: [
    {
      id: 'q1',
      prompt: 'What is the value of 8 in 4,862?',
      options: ['8', '80', '800', '8000'],
      answer: '800',
      explanation: 'In 4,862, the 8 is in the hundreds place, so its value is 8 x 100 = 800.',
    },
    {
      id: 'q2',
      prompt: 'What digit is in the hundreds place in 9,245?',
      options: ['9', '2', '4', '5'],
      answer: '2',
      explanation: 'The places are thousands, hundreds, tens, ones. In 9,245, the 2 is in the hundreds place.',
    },
    {
      id: 'q3',
      prompt: 'Write the number from blocks: 6 thousands, 2 hundreds, 9 tens, 1 one.',
      options: ['6291', '6921', '6219', '2691'],
      answer: '6291',
      explanation: '6 thousands, 2 hundreds, 9 tens and 1 one make 6,291.',
    },
    {
      id: 'q4',
      prompt: 'What is the expanded form of 3,507?',
      options: ['3 x 1000 + 5 x 100 + 0 x 10 + 7', '3 x 1000 + 5 x 10 + 7', '3 x 100 + 5 x 10 + 7', '3 x 1000 + 0 x 100 + 5 x 10 + 7'],
      answer: '3 x 1000 + 5 x 100 + 0 x 10 + 7',
      explanation: '3,507 has 3 thousands, 5 hundreds, 0 tens and 7 ones.',
    },
    {
      id: 'q5',
      prompt: 'Why is zero important in 7,305?',
      options: ['It makes the number smaller than 735', 'It holds the tens place so the 3 stays in the hundreds place', 'It means there are no ones', 'It has no purpose'],
      answer: 'It holds the tens place so the 3 stays in the hundreds place',
      explanation: 'The zero tells us there are no tens, while keeping the 3 in the hundreds place. Without it, 7,305 becomes 735.',
    },
  ],
  rewards: {
    xp: 450,
    badge: 'Place Value Master',
  },
} as const;
