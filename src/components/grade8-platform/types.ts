export type SubjectId = 'math' | 'english' | 'science';
export type UnitId = 'unit1' | 'unit2' | 'unit3' | 'unit4' | 'unit5' | 'unit6';
export type TabType = 'overview' | 'learn' | 'lesson' | 'practice' | 'assessment' | 'assets' | 'exam' | 'assignments';

export interface ConceptDef {
  title: string;
  description: string;
  /** Long-form teaching paragraphs shown below the description. */
  paragraphs?: string[];
  /** Bullet-point key ideas a student should walk away knowing. */
  keyIdeas?: string[];
  media?: { type: 'image' | 'video'; url: string; caption: string }[];
  vocabulary: { term: string; definition: string; example?: string }[];
  formulas?: { name: string; equation: string; explanation: string; stepByStep?: string[] }[];
  /**
   * Optional interactive lab to render INSIDE this concept. The LearnView
   * dispatches the id to a registered React component, so labs can be
   * authored once and surfaced anywhere a curriculum entry references them.
   */
  interactiveLab?:
    | 'mcdonalds-ads'
    | 'states-of-matter'
    | 'cell-3d'
    | 'chemical-reaction'
    | 'electric-circuit'
    | 'forces-motion'
    | 'ecosystem-simulation';
}

export interface Example {
  id: string;
  title: string;
  problem: string;
  context: string;
  method1Name?: string;
  method1Steps?: string[];
  method2Name?: string;
  method2Steps?: string[];
  techniques?: { name: string; description: string; color?: string; excerpt?: string }[];
  interactiveUrl?: string;
  solvedExamples?: { question: string; solution: string[] }[];
}

export interface PracticeQuestion {
  id: number;
  question: string;
  hint?: string;
  answerFullWorking: string;
  interactiveOptions?: string[];
  interactiveAnswer?: string;
  type?: 'multiple-choice' | 'free-text' | 'reveal';
}

export interface Asset {
  id: string;
  type: 'novel' | 'newspaper' | 'advertisement' | 'video' | 'article' | 'image' | 'diagram';
  title: string;
  description: string;
  url: string;
  link?: string;
}
