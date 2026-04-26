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
export declare function createScheduler(listener: SchedulerListener): SchedulerApi;
//# sourceMappingURL=Scheduler.d.ts.map