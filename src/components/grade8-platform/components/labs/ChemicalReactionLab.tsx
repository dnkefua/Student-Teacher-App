'use client';

/**
 * Acid + alkali / pH interactive — pick reagents, set volumes, watch the
 * universal indicator change colour with the pH. Wraps the legacy
 * ChemicalReactionLab for use inside the grade8 platform.
 */
import React from 'react';
import { ChemicalReactionLab } from '@/components/science/interactives/ChemicalReactionLab';
import { LEGACY_LESSON_STUB } from './legacyAdapter';

export function ChemicalReactionLabComponent() {
  return <ChemicalReactionLab lesson={LEGACY_LESSON_STUB} />;
}
