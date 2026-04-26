import type { InterpolationApi, InterpolationMode } from '../types';

export function createInterpolation(): InterpolationApi {
  let mode: InterpolationMode = 'bounce';
  let easing = true;

  function interpolate(t: number): number {
    switch (mode) {
      case 'bounce': {
        if (easing) {
          const a = t * Math.PI * 2;
          return 0.5 - Math.cos(a) * 0.5;
        }
        const wrapped = t % 1;
        return wrapped < 0.5 ? wrapped * 2 : (1 - wrapped) * 2;
      }
      case 'single':
      default: {
        let s = t;
        if (s > 1) {
          s %= 1;
        }
        if (easing) {
          const a = s * Math.PI;
          return 0.5 - Math.cos(a) * 0.5;
        }
        return s;
      }
    }
  }

  return {
    interpolate,
    setMode(pMode) {
      mode = String(pMode).toLowerCase() as InterpolationMode;
    },
    setEasing(pEasing) {
      easing = pEasing;
    },
    getMode() {
      return mode;
    },
    getEasing() {
      return easing;
    },
  };
}
