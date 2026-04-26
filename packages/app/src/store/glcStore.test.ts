import { beforeEach, describe, expect, it } from 'vitest';
import { useGLCStore } from './glcStore';

describe('glcStore', () => {
  beforeEach(() => {
    useGLCStore.setState({
      status: 'idle',
      duration: 2,
      fps: 30,
      maxColors: 256,
      mode: 'bounce',
      easing: true,
      output: null,
      showOutput: false,
      showAbout: false,
      splitPercent: 0.45,
      errorMessage: null,
    });
  });

  it('updates status', () => {
    useGLCStore.getState().setStatus('playing');
    expect(useGLCStore.getState().status).toBe('playing');
  });

  it('clamps splitPercent to [0.15, 0.85]', () => {
    useGLCStore.getState().setSplitPercent(0.05);
    expect(useGLCStore.getState().splitPercent).toBe(0.15);
    useGLCStore.getState().setSplitPercent(0.95);
    expect(useGLCStore.getState().splitPercent).toBe(0.85);
  });

  it('setOutput shows the output modal', () => {
    useGLCStore.getState().setOutput({
      url: 'data:image/gif;base64,abc',
      width: 100,
      height: 100,
      type: 'gif',
    });
    expect(useGLCStore.getState().showOutput).toBe(true);
    expect(useGLCStore.getState().output?.type).toBe('gif');
  });
});
