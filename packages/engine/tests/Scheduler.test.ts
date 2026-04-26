import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createScheduler } from '../src/core/Scheduler';

describe('Scheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports duration and fps', () => {
    const sched = createScheduler({
      onStart: () => {},
      onRender: () => {},
      onComplete: () => {},
    });
    sched.setDuration(3);
    sched.setFPS(60);
    expect(sched.getDuration()).toBe(3);
    expect(sched.getFPS()).toBe(60);
  });

  it('isRunning toggles for playOnce / stop', () => {
    const sched = createScheduler({
      onStart: () => {},
      onRender: () => {},
      onComplete: () => {},
    });
    sched.setDuration(1);
    sched.setFPS(30);
    expect(sched.isRunning()).toBe(false);
    sched.playOnce();
    expect(sched.isRunning()).toBe(true);
    sched.stop();
    vi.advanceTimersByTime(200);
    expect(sched.isRunning()).toBe(false);
  });

  it('emits onStart, onRender, onComplete in order for playOnce', () => {
    const events: string[] = [];
    const sched = createScheduler({
      onStart: () => events.push('start'),
      onRender: () => events.push('render'),
      onComplete: () => events.push('complete'),
    });
    sched.setDuration(0.1);
    sched.setFPS(10);
    sched.playOnce();
    vi.advanceTimersByTime(2000);
    expect(events[0]).toBe('start');
    expect(events).toContain('render');
    expect(events[events.length - 1]).toBe('complete');
  });
});
