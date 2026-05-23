'use client';

/**
 * 3D Cell explorer — animal vs plant cell with interactive organelle
 * highlighting. Wraps the legacy Cell3D component (still on disk in
 * src/components/science/interactives/) and adapts it for the grade8
 * platform's labs registry.
 */
import React from 'react';
import { Cell3D } from '@/components/science/interactives/Cell3D';
import { LEGACY_LESSON_STUB } from './legacyAdapter';

export function Cell3DLab() {
  return <Cell3D lesson={LEGACY_LESSON_STUB} />;
}
