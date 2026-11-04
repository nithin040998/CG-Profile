/* ══════════════════════════════════════════════════════════════════════
   THE FRAME LOOP — the single rAF scheduler every `frame`-form motion shares.

   H perf rule: one rAF loop for the whole page. Two independent loops both
   reading layout and writing transforms is how thrash gets introduced, so
   tasks register here by name and run in registration order inside ONE
   requestAnimationFrame callback. Scheduling is idempotent per frame; a task
   that still has work (the descent mid-walk) simply schedules itself again.
   ══════════════════════════════════════════════════════════════════════ */

export type FrameTask = (now: number) => void;

export interface FrameLoop {
  /** Register a task. Returns an unregister function. */
  add(name: string, task: FrameTask): () => void;
  /** Mark a task dirty for the next frame. */
  schedule(name: string): void;
  destroy(): void;
}

export function createFrameLoop(): FrameLoop {
  const tasks: Array<[string, FrameTask]> = [];
  const dirty = new Set<string>();
  let raf = 0;

  const run = (now: number) => {
    raf = 0;
    // snapshot first: a task that reschedules itself lands in the NEXT frame
    const batch = new Set(dirty);
    dirty.clear();
    for (const [name, task] of tasks) if (batch.has(name)) task(now);
  };

  return {
    add(name, task) {
      tasks.push([name, task]);
      return () => {
        const i = tasks.findIndex(([n]) => n === name);
        if (i >= 0) tasks.splice(i, 1);
      };
    },
    schedule(name) {
      dirty.add(name);
      if (!raf) raf = requestAnimationFrame(run);
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      dirty.clear();
      tasks.length = 0;
    },
  };
}
