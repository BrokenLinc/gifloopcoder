import type { SchedulerListener } from '../types';

export interface SchedulerApi {
  loop(): void;
  playOnce(): void;
  stop(): void;
  isRunning(): boolean;
  setDuration(value: number): void;
  getDuration(): number;
  setFPS(value: number): void;
  getFPS(): number;
}

export function createScheduler(listener: SchedulerListener): SchedulerApi {
  let t = 0;
  let duration = 2;
  let fps = 30;
  let running = false;
  let stopping = false;
  let looping = false;

  const raf =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame.bind(globalThis)
      : (cb: FrameRequestCallback) =>
          setTimeout(() => cb(performance.now()), 16) as unknown as number;

  function render() {
    if (running && !stopping) {
      listener.onRender(t);
      advance();
      setTimeout(onTimeout, 1000 / fps);
    } else {
      running = false;
      looping = false;
      stopping = false;
      listener.onComplete();
    }
  }

  function onTimeout() {
    raf(render);
  }

  function advance() {
    const numFrames = duration * fps;
    const speed = 1 / numFrames;
    t += speed;
    if (Math.round(t * 10000) / 10000 >= 1) {
      if (looping) {
        t -= 1;
      } else {
        t = 0;
        stop();
      }
    }
  }

  function loop() {
    if (!running) {
      listener.onStart();
      t = 0;
      stopping = false;
      looping = true;
      running = true;
      render();
    }
  }

  function stop() {
    if (running) {
      stopping = true;
      t = 0;
    }
  }

  function playOnce() {
    if (!running) {
      listener.onStart();
      t = 0;
      looping = false;
      running = true;
      render();
    }
  }

  return {
    loop,
    playOnce,
    stop,
    isRunning: () => running,
    setDuration: (v) => {
      duration = v;
    },
    getDuration: () => duration,
    setFPS: (v) => {
      fps = v;
    },
    getFPS: () => fps,
  };
}
