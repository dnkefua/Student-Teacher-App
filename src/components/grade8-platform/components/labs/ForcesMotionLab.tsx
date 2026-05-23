'use client';

/**
 * Forces & motion — push slider vs friction, live resultant force,
 * velocity readout, box bounces off walls. Wraps the legacy
 * ForcesMotionSim for use inside the grade8 platform.
 */
import React from 'react';
import { ForcesMotionSim } from '@/components/science/interactives/ForcesMotionSim';
import { LEGACY_LESSON_STUB } from './legacyAdapter';

export function ForcesMotionLab() {
  return <ForcesMotionSim lesson={LEGACY_LESSON_STUB} />;
}
