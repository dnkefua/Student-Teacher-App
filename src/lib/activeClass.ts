// Cross-app store for the "currently selected class". Lets multi-class
// teachers scope assignments, submissions and analytics to one of their
// classrooms without changing demoUser.

const STORAGE_KEY = 'eis-active-class-v1';
const EVENT_NAME = 'eis-active-class';

export type ClassMeta = {
  id: string;
  name: string;
  /** Optional roster size for display. */
  size?: number;
};

export const DEFAULT_DEMO_CLASSES: ClassMeta[] = [
  { id: 'class-grade8a', name: 'Grade 8A', size: 24 },
  { id: 'class-grade8b', name: 'Grade 8B', size: 21 },
  { id: 'demo-class-eis-g8', name: 'EIS Demo Class', size: 12 },
];

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function loadActiveClass(): ClassMeta {
  if (!canUseStorage()) return DEFAULT_DEMO_CLASSES[0];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO_CLASSES[0];
    const parsed = JSON.parse(raw) as ClassMeta;
    return DEFAULT_DEMO_CLASSES.find((c) => c.id === parsed.id) ?? parsed;
  } catch {
    return DEFAULT_DEMO_CLASSES[0];
  }
}

export function setActiveClass(cls: ClassMeta) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cls));
  window.dispatchEvent(new CustomEvent<ClassMeta>(EVENT_NAME, { detail: cls }));
}

export function subscribeActiveClass(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onChange = () => callback();
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function getActiveClassId(): string {
  return loadActiveClass().id;
}
