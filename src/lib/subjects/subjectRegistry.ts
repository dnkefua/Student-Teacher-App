// Per-subject brand + experience metadata. The Sidebar, Studios, Dashboard
// and Hub all read from this — adding a future subject (Humanities,
// Languages) is one new entry.

import type { SubjectId } from './types';

export type SubjectRegistryEntry = {
  id: SubjectId;
  label: 'Mathematics' | 'Science' | 'English';
  studioLabel: string;
  /** TabType slug the Sidebar uses. */
  tabId: 'maths-studio' | 'science-studio' | 'english-studio';
  theme: {
    primary: string;
    accent: string;
  };
  experience: string;
  description: string;
};

export const subjectRegistry: Record<SubjectId, SubjectRegistryEntry> = {
  mathematics: {
    id: 'mathematics',
    label: 'Mathematics',
    studioLabel: 'Maths Studio',
    tabId: 'maths-studio',
    theme: { primary: '#49c8ff', accent: '#ffc43b' },
    experience: '3D concept mastery and problem-solving',
    description:
      'Grade 8 maths lessons paired with interactive 3D explainers — ratios, equations, geometry, probability and data.',
  },
  science: {
    id: 'science',
    label: 'Science',
    studioLabel: 'Science Studio',
    tabId: 'science-studio',
    theme: { primary: '#34d399', accent: '#49c8ff' },
    experience: 'Simulations, virtual labs, models, and scientific reasoning',
    description:
      'Grade 8 science taught through particle models, virtual labs, force simulations, cell exploration and circuit building.',
  },
  english: {
    id: 'english',
    label: 'English',
    studioLabel: 'English Studio',
    tabId: 'english-studio',
    theme: { primary: '#c084fc', accent: '#ffc43b' },
    experience: 'Reading annotation, writing workshops, speaking, and AI feedback',
    description:
      'Grade 8 English through annotation, essay planning, poetry analysis, grammar building and revision feedback.',
  },
};

export const subjectList: SubjectId[] = ['mathematics', 'science', 'english'];
