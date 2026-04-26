import type { GLC, InterpolationMode } from '@glc/engine';
import { create } from 'zustand';
import { DEFAULT_SKETCH } from '../defaultSketch';

const STORAGE_KEY = 'glcCode';

function loadInitialCode(): string {
  if (typeof localStorage === 'undefined') return DEFAULT_SKETCH;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ?? DEFAULT_SKETCH;
}

export type Status = 'idle' | 'playing' | 'encoding';

export interface OutputImage {
  url: string;
  width: number;
  height: number;
  type: 'gif' | 'png' | 'spritesheet';
}

interface GLCState {
  code: string;
  status: Status;
  duration: number;
  fps: number;
  maxColors: number;
  mode: InterpolationMode;
  easing: boolean;
  output: OutputImage | null;
  showOutput: boolean;
  showAbout: boolean;
  showExamples: boolean;
  splitPercent: number;
  errorMessage: string | null;

  setCode(code: string, persist?: boolean): void;
  setStatus(status: Status): void;
  setDuration(d: number): void;
  setFPS(f: number): void;
  setMaxColors(m: number): void;
  setMode(m: InterpolationMode): void;
  setEasing(e: boolean): void;
  setOutput(o: OutputImage | null): void;
  setShowOutput(v: boolean): void;
  setShowAbout(v: boolean): void;
  setShowExamples(v: boolean): void;
  setSplitPercent(p: number): void;
  setError(message: string | null): void;
  syncFromGLC(glc: GLC): void;
}

export const useGLCStore = create<GLCState>((set) => ({
  code: loadInitialCode(),
  status: 'idle',
  duration: 2,
  fps: 30,
  maxColors: 256,
  mode: 'bounce',
  easing: true,
  output: null,
  showOutput: false,
  showAbout: false,
  showExamples: false,
  splitPercent: 0.45,
  errorMessage: null,
  setCode(code, persist = true) {
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
    set({ code });
  },
  setStatus(status) {
    set({ status });
  },
  setDuration(duration) {
    set({ duration });
  },
  setFPS(fps) {
    set({ fps });
  },
  setMaxColors(maxColors) {
    set({ maxColors });
  },
  setMode(mode) {
    set({ mode });
  },
  setEasing(easing) {
    set({ easing });
  },
  setOutput(output) {
    set({ output, showOutput: !!output });
  },
  setShowOutput(showOutput) {
    set({ showOutput });
  },
  setShowAbout(showAbout) {
    set({ showAbout });
  },
  setShowExamples(showExamples) {
    set({ showExamples });
  },
  setSplitPercent(splitPercent) {
    set({ splitPercent: Math.max(0.15, Math.min(0.85, splitPercent)) });
  },
  setError(errorMessage) {
    set({ errorMessage });
  },
  syncFromGLC(glc) {
    set({
      duration: glc.scheduler.getDuration(),
      fps: glc.scheduler.getFPS(),
    });
  },
}));
