'use client';

import React from 'react';
import type { SubjectLesson } from '@/lib/subjects/types';
import { ParticleModel3D } from './interactives/ParticleModel3D';
import { Cell3D } from './interactives/Cell3D';
import { ForcesMotionSim } from './interactives/ForcesMotionSim';
import { ElectricCircuitBuilder } from './interactives/ElectricCircuitBuilder';
import { ChemicalReactionLab } from './interactives/ChemicalReactionLab';
import { EcosystemSimulation } from './interactives/EcosystemSimulation';
import { EnergyTransferSim } from './interactives/EnergyTransferSim';
import { BodySystem3D } from './interactives/BodySystem3D';
import { EarthSpaceOrbit } from './interactives/EarthSpaceOrbit';
import { ScientificMethodLab } from './interactives/ScientificMethodLab';
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
    case 'chemical_reaction_lab':
      return <ChemicalReactionLab lesson={lesson} />;
    case 'ecosystem_simulation':
      return <EcosystemSimulation lesson={lesson} />;
    case 'energy_transfer_sim':
      return <EnergyTransferSim lesson={lesson} />;
    case 'body_system_3d':
      return <BodySystem3D lesson={lesson} />;
    case 'earth_space_orbit':
      return <EarthSpaceOrbit lesson={lesson} />;
    case 'scientific_method_lab':
      return <ScientificMethodLab lesson={lesson} />;
    default:
      return <SciencePlaceholder lesson={lesson} />;
  }
}
