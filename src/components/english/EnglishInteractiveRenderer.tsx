'use client';

import React from 'react';
import type { SubjectLesson } from '@/lib/subjects/types';
import { TextAnnotationLab } from './interactives/TextAnnotationLab';
import { EssayPlanner } from './interactives/EssayPlanner';
import { PoetryDeviceHighlighter } from './interactives/PoetryDeviceHighlighter';
import { GrammarSentenceBuilder } from './interactives/GrammarSentenceBuilder';
import { WritingRevisionStudio } from './interactives/WritingRevisionStudio';
import { StoryStructureMap } from './interactives/StoryStructureMap';
import { CharacterAnalysisBoard } from './interactives/CharacterAnalysisBoard';
import { VocabularyPractice } from './interactives/VocabularyPractice';
import { DebateSimulator } from './interactives/DebateSimulator';
import { SpeakingFeedback } from './interactives/SpeakingFeedback';
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
    case 'story_structure_map':
      return <StoryStructureMap lesson={lesson} />;
    case 'character_analysis_board':
      return <CharacterAnalysisBoard lesson={lesson} />;
    case 'vocabulary_practice':
      return <VocabularyPractice lesson={lesson} />;
    case 'debate_simulator':
      return <DebateSimulator lesson={lesson} />;
    case 'speaking_feedback':
      return <SpeakingFeedback lesson={lesson} />;
    default:
      return <EnglishPlaceholderInteractive lesson={lesson} />;
  }
}
