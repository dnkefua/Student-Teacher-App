'use client';

import React, { useSyncExternalStore } from 'react';
import {
  defaultDemoAssignment,
  loadDemoAssignment,
  type DemoAssignment,
  type LearningMode,
} from '@/lib/demoAssignments';
import { StudentLessonPlayer } from './StudentLessonPlayer';
import { TeacherLessonWorkspace } from './TeacherLessonWorkspace';
import type { TabType } from './Sidebar';

// Cache the snapshot so React can compare references between renders.
// Without this, loadDemoAssignment() returns a fresh object every call
// and useSyncExternalStore enters an infinite render loop.
let cachedSnapshot: DemoAssignment | null = null;

function invalidate() {
  cachedSnapshot = null;
}

function getSnapshot(): DemoAssignment {
  if (cachedSnapshot === null) {
    cachedSnapshot = loadDemoAssignment();
  }
  return cachedSnapshot;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onChange = () => {
    invalidate();
    callback();
  };
  window.addEventListener('eis-demo-assignment', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('eis-demo-assignment', onChange);
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot: DemoAssignment = defaultDemoAssignment;
const getServerSnapshot = () => serverSnapshot;

export function InteractiveLessonRenderer({
  mode,
  setActiveTab,
}: {
  mode: LearningMode;
  setActiveTab: (tab: TabType) => void;
}) {
  const assignment = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const close = () => setActiveTab('dashboard');

  if (mode === 'teacher') {
    return (
      <TeacherLessonWorkspace
        assignment={assignment}
        onTeachLive={() => setActiveTab('classroom')}
        onOpenGenerator={() => setActiveTab('place-value-lesson')}
        onClose={close}
      />
    );
  }

  return <StudentLessonPlayer assignment={assignment} onClose={close} />;
}
