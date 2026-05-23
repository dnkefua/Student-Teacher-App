'use client';

/**
 * Ecosystem simulation — Lotka-Volterra-style population dynamics
 * across plants, rabbits and foxes with sunlight + hunting sliders
 * and a live SVG population plot. Wraps the legacy
 * EcosystemSimulation for the grade8 platform.
 */
import React from 'react';
import { EcosystemSimulation } from '@/components/science/interactives/EcosystemSimulation';
import { LEGACY_LESSON_STUB } from './legacyAdapter';

export function EcosystemLab() {
  return <EcosystemSimulation lesson={LEGACY_LESSON_STUB} />;
}
