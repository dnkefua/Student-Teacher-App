'use client';

import React, { useMemo } from 'react';
import { Box, Sparkles } from 'lucide-react';
import { ExplainerByType } from '@/components/Math3DExplainers';
import { ScienceInteractiveRenderer } from '@/components/science/ScienceInteractiveRenderer';
import { EnglishInteractiveRenderer } from '@/components/english/EnglishInteractiveRenderer';
import { cinematicMathMap, cinematicScienceMap, cinematicEnglishMap, lessonFromCinematicSpec } from '@/lib/cinematic/subjectLessonAdapter';
import type { CinematicInteractionEvent, CinematicLessonSpec } from '@/lib/cinematic/types';

type Props = {
  spec: CinematicLessonSpec;
  currentStepId?: string;
  onInteraction?: (event: CinematicInteractionEvent) => void;
};

export function CinematicSceneRenderer({ spec, currentStepId, onInteraction }: Props) {
  const activeStep = spec.storyboard.find((step) => step.id === currentStepId) ?? spec.storyboard[0];
  const lesson = useMemo(() => {
    const interactiveType = cinematicScienceMap[spec.sceneType] ?? cinematicEnglishMap[spec.sceneType] ?? spec.sceneType;
    return lessonFromCinematicSpec(spec, interactiveType);
  }, [spec]);

  const emit = (interactionId: string, action: string, value?: unknown) => {
    onInteraction?.({ lessonId: spec.id, stepId: activeStep?.id, interactionId, action, value });
  };

  let rendered: React.ReactNode = null;
  const mathType = cinematicMathMap[spec.sceneType];
  if (mathType) rendered = <ExplainerByType type={mathType} />;
  else if (spec.subject === 'science') rendered = <ScienceInteractiveRenderer lesson={lesson} />;
  else if (spec.subject === 'english') rendered = <EnglishInteractiveRenderer lesson={lesson} />;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Interactive app-rendered scene</p>
          <p className="truncate text-sm font-semibold text-slate-200">{activeStep?.visualAction ?? spec.concept}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
          <Sparkles className="h-3 w-3" />
          {spec.sceneType.replace(/_/g, ' ')}
        </span>
      </div>

      {rendered ?? <PremiumPlaceholder spec={spec} />}

      <div className="grid gap-2 sm:grid-cols-2">
        {spec.interactiveScene.interactions.slice(0, 4).map((interaction) => (
          <button
            key={interaction.id}
            type="button"
            onClick={() => emit(interaction.id, interaction.type, interaction.defaultValue ?? interaction.label)}
            className="rounded-md border border-white/10 bg-[#061126] px-3 py-2 text-left text-xs font-bold text-slate-200 transition hover:border-[#49c8ff]/60 hover:text-white"
          >
            {interaction.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function PremiumPlaceholder({ spec }: { spec: CinematicLessonSpec }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-8 text-center">
      <div>
        <Box className="mx-auto h-10 w-10 text-[#8ddfff]" />
        <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#ffc43b]">Interactive cinematic template coming soon for this concept.</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
          The lesson still runs with storyboard, checkpoints, analytics, assignment, and HeyGen video assets. Scene type: {spec.sceneType}.
        </p>
      </div>
    </div>
  );
}
