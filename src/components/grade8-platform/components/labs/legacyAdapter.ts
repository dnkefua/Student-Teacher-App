import type { SubjectLesson } from '@/lib/subjects/types';

/**
 * The legacy science interactives accept a `lesson: SubjectLesson` prop
 * they never read (`void _lesson`). The grade8 platform doesn't carry
 * the SubjectLesson shape, so the wrappers feed each component this
 * minimal stub — type-cast to satisfy TypeScript without inventing
 * fake content the component will discard anyway.
 */
export const LEGACY_LESSON_STUB = {} as SubjectLesson;
