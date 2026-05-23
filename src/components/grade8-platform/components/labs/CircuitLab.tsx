'use client';

/**
 * Electric circuit builder — series vs parallel, bulb count, voltage,
 * Ohm's-law readouts. Click any bulb to break it and watch the rest
 * stay lit (parallel) or all go dark (series). Wraps the legacy
 * ElectricCircuitBuilder for the grade8 platform.
 */
import React from 'react';
import { ElectricCircuitBuilder } from '@/components/science/interactives/ElectricCircuitBuilder';
import { LEGACY_LESSON_STUB } from './legacyAdapter';

export function CircuitLab() {
  return <ElectricCircuitBuilder lesson={LEGACY_LESSON_STUB} />;
}
