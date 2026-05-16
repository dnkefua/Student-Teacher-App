'use client';

import React from 'react';
import type { SubjectLesson } from '@/lib/subjects/types';
import { ParticleModel3D } from './interactives/ParticleModel3D';
import { Cell3D } from './interactives/Cell3D';
import { ForcesMotionSim } from './interactives/ForcesMotionSim';
import { ElectricCircuitBuilder } from './interactives/ElectricCircuitBuilder';
import { SciencePlaceholder } from './interactives/SciencePlaceholder';

export function ScienceInteractiveRenderer({ lesson }: { lesson: SubjectLesson }) {
  switch (lesson.interactiveType) {
    case 'particle_model_3d':
      return <ParticleModel3D lesson={lesson} />;
    case 'cell_3d':
      return <Cell3D lesson={lesson} />;
    case 'forces_motion_sim':
      return <ForcesMotionSim lesson={lesson} />;
    case 'electric_circuit_builder':
      return <ElectricCircuitBuilder lesson={lesson} />;
    default:
      return <SciencePlaceholder lesson={lesson} />;
  }
}
