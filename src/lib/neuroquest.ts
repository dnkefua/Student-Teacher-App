export type NeuroQuestGame = {
  slug: string;
  title: string;
  subject: string;
  gradeBand: string;
  description: string;
  skills: string[];
  href: string;
  color: string;
};

export type NeuroQuestAssignment = {
  id: string;
  gameSlug: string;
  title: string;
  objective: string;
  duration: string;
  instructions: string;
  createdAt: string;
};

const ACTIVE_ASSIGNMENT_KEY = 'eduquest.activeNeuroQuestAssignment';

export const neuroQuestGames: NeuroQuestGame[] = [
  {
    slug: 'math-racer-3d',
    title: 'Velocity Quest 3D',
    subject: 'Grade 8 Math',
    gradeBand: 'Grades 7-9',
    description: 'A racing challenge where correct answers increase speed, score, and streak momentum.',
    skills: ['Integer operations', 'Equation solving', 'Mental math', 'Fast decision making'],
    href: '/play/math-racer-3d/index.html',
    color: 'amber',
  },
  {
    slug: 'maze-pursuit-3d',
    title: 'Maze Pursuit 3D',
    subject: 'Math + Science',
    gradeBand: 'Grades 7-9',
    description: 'A spatial reasoning maze where correct answers unlock movement powers.',
    skills: ['Grade 8 review', 'Spatial reasoning', 'Risk management', 'Problem solving'],
    href: '/play/maze-pursuit-3d/index.html',
    color: 'teal',
  },
  {
    slug: 'lightbot',
    title: 'Lightbot',
    subject: 'Computational Thinking',
    gradeBand: 'Grades 3-8',
    description: 'A programming puzzle for sequencing, procedures, loops, and debugging.',
    skills: ['Sequencing', 'Loops', 'Procedures', 'Debugging'],
    href: '/play/lightbot/index.html',
    color: 'indigo',
  },
  {
    slug: 'math-runner',
    title: 'Math Runner',
    subject: 'Arithmetic Fluency',
    gradeBand: 'Grades 3-8',
    description: 'A fast answer loop for mental math, streaks, and level progression.',
    skills: ['Arithmetic fluency', 'Number sense', 'Accuracy under time pressure'],
    href: '/play/math-runner/index.html',
    color: 'rose',
  },
  {
    slug: 'memory-match',
    title: 'Memory Match',
    subject: 'Working Memory',
    gradeBand: 'Grades 1-8',
    description: 'A matching exercise for attention, recall, and pattern recognition.',
    skills: ['Visual memory', 'Concentration', 'Pattern recognition'],
    href: '/play/memory-match/index.html',
    color: 'emerald',
  },
  {
    slug: 'typing-hero',
    title: 'Typing Hero',
    subject: 'Keyboard Fluency',
    gradeBand: 'Grades 4-10',
    description: 'A word-speed challenge that builds typing confidence and accuracy.',
    skills: ['Typing speed', 'Keyboard fluency', 'Accuracy'],
    href: '/play/typing-hero/index.html',
    color: 'sky',
  },
  {
    slug: 'word-search',
    title: 'Word Search',
    subject: 'Vocabulary',
    gradeBand: 'Grades 2-8',
    description: 'A topic-based word grid for science, math, space, nature, and body systems.',
    skills: ['Vocabulary', 'Spelling', 'Pattern scanning'],
    href: '/play/word-search/index.html',
    color: 'violet',
  },
];

export function getNeuroQuestGame(slug: string) {
  return neuroQuestGames.find((game) => game.slug === slug) ?? neuroQuestGames[0];
}

export function createDefaultAssignment(gameSlug: string): NeuroQuestAssignment {
  const game = getNeuroQuestGame(gameSlug);

  return {
    id: `quest-${Date.now()}`,
    gameSlug: game.slug,
    title: `${game.title} Mastery Sprint`,
    objective: `Students will strengthen ${game.skills.slice(0, 2).join(' and ').toLowerCase()} through a short NeuroQuest gameplay loop.`,
    duration: '20 minutes',
    instructions: `Play ${game.title}, complete at least two rounds, record your score or completion evidence, and write one reflection explaining the strategy that helped you improve.`,
    createdAt: new Date().toISOString(),
  };
}

export function buildQuestLessonPrompt(assignment: NeuroQuestAssignment) {
  const game = getNeuroQuestGame(assignment.gameSlug);

  return [
    `Integrate NeuroQuest game: ${game.title}`,
    `Subject: ${game.subject}`,
    `Objective: ${assignment.objective}`,
    `Duration: ${assignment.duration}`,
    `Student task: ${assignment.instructions}`,
    `Include before-game instruction, live teacher prompts, after-game reflection, accommodations, and assessment evidence.`,
  ].join('\n');
}

export function buildQuestRubric(assignment: NeuroQuestAssignment) {
  const game = getNeuroQuestGame(assignment.gameSlug);

  return [
    `NeuroQuest Evidence Rubric for ${assignment.title}`,
    '',
    `Game: ${game.title}`,
    `Objective: ${assignment.objective}`,
    '',
    'Score out of 20:',
    '1. Gameplay evidence and completion - 5 points',
    '2. Accuracy, score improvement, or demonstrated mastery - 5 points',
    '3. Strategy reflection using subject vocabulary - 5 points',
    '4. Next-step correction or explanation of one mistake - 3 points',
    '5. Effort, focus, and responsible online participation - 2 points',
    '',
    'Provide a final score, one strength, one correction, and one next quest recommendation.',
  ].join('\n');
}

export function buildQuestProgressEmail(assignment: NeuroQuestAssignment) {
  const game = getNeuroQuestGame(assignment.gameSlug);

  return [
    `NeuroQuest progress update for ${assignment.title}.`,
    `Students used ${game.title} to practice ${game.skills.join(', ')}.`,
    'Mention their gameplay evidence, mastery trend, reflection quality, and one recommended next step.',
    'Keep the email clear for parents and connect game performance to academic growth.',
  ].join('\n');
}

export function saveActiveAssignment(assignment: NeuroQuestAssignment) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACTIVE_ASSIGNMENT_KEY, JSON.stringify(assignment));
  window.dispatchEvent(new CustomEvent('eduquest-active-assignment', { detail: assignment }));
}

export function loadActiveAssignment(): NeuroQuestAssignment | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(ACTIVE_ASSIGNMENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as NeuroQuestAssignment;
  } catch {
    return null;
  }
}
