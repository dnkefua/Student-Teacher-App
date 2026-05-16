'use client';

import React from 'react';
import type { SubjectLesson } from '@/lib/subjects/types';
import { TextAnnotationLab } from './interactives/TextAnnotationLab';
import { EssayPlanner } from './interactives/EssayPlanner';
import { PoetryDeviceHighlighter } from './interactives/PoetryDeviceHighlighter';
import { GrammarSentenceBuilder } from './interactives/GrammarSentenceBuilder';
import { WritingRevisionStudio } from './interactives/WritingRevisionStudio';
import { EnglishPlaceholderInteractive } from './interactives/EnglishPlaceholderInteractive';

export function EnglishInteractiveRenderer({ lesson }: { lesson: SubjectLesson }) {
  switch (lesson.interactiveType) {
    case 'text_annotation_lab':
      return <TextAnnotationLab lesson={lesson} />;
    case 'essay_planner':
      return <EssayPlanner lesson={lesson} />;
    case 'poetry_device_highlighter':
      return <PoetryDeviceHighlighter lesson={lesson} />;
    case 'grammar_sentence_builder':
      return <GrammarSentenceBuilder lesson={lesson} />;
    case 'writing_revision_studio':
      return <WritingRevisionStudio lesson={lesson} />;
    default:
      return <EnglishPlaceholderInteractive lesson={lesson} />;
  }
}
