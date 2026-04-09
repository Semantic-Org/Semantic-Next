import { bench, describe } from 'vitest';
import { Dependency } from '../src/dependency.js';
import { Reaction } from '../src/reaction.js';
import { Scheduler } from '../src/scheduler.js';

import { DependencyBaseline } from './baseline/dependency.js';
import { ReactionBaseline } from './baseline/reaction.js';
import { SchedulerBaseline } from './baseline/scheduler.js';

/*******************************
     A/B — Reaction.run (forEach vs for...of on deps)
*******************************/

describe('Reaction.run — cleanup 5 dependencies', () => {
  const makeDeps = (DepClass) => {
    const deps = [];
    for (let i = 0; i < 5; i++) {
      deps.push(new DepClass());
    }
    return deps;
  };

  bench('baseline', () => {
    const deps = makeDeps(DependencyBaseline);
    const r = new ReactionBaseline(() => {});
    for (const d of deps) {
      r.dependencies.add(d);
      d.subscribers.add(r);
    }
    r.run();
  });

  bench('optimized', () => {
    const deps = makeDeps(Dependency);
    const r = new Reaction(() => {});
    for (const d of deps) {
      r.dependencies.add(d);
      d.subscribers.add(r);
    }
    r.run();
  });
});

/*******************************
     A/B — Dependency.changed (forEach vs for...of on subscribers)
*******************************/

describe('Dependency.changed — notify 10 subscribers', () => {
  bench('baseline', () => {
    const dep = new DependencyBaseline();
    for (let i = 0; i < 10; i++) {
      dep.subscribers.add({
        invalidate() {},
        addContext() {},
        active: true,
      });
    }
    dep.changed();
  });

  bench('optimized', () => {
    const dep = new Dependency();
    for (let i = 0; i < 10; i++) {
      dep.subscribers.add({
        invalidate() {},
        addContext() {},
        active: true,
      });
    }
    dep.changed();
  });
});

/*******************************
     A/B — Scheduler.flush (Set spread vs current)
*******************************/

describe('Scheduler.flush — 20 pending reactions', () => {
  bench('baseline', () => {
    for (let i = 0; i < 20; i++) {
      const r = new ReactionBaseline(() => {});
      r.dependencies = new Set();
      SchedulerBaseline.pendingReactions.add(r);
    }
    SchedulerBaseline.flush();
  });

  bench('optimized', () => {
    for (let i = 0; i < 20; i++) {
      const r = new Reaction(() => {});
      r.dependencies = new Set();
      Scheduler.pendingReactions.add(r);
    }
    Scheduler.flush();
  });
});

/*******************************
     A/B — Dependency.depend (hot path, no changes — sanity check)
*******************************/

describe('Dependency.depend — in active reaction', () => {
  bench('baseline', () => {
    const r = new ReactionBaseline(() => {});
    SchedulerBaseline.current = r;
    const dep = new DependencyBaseline();
    dep.depend();
    dep.depend(); // duplicate — should be no-op
    dep.depend();
    SchedulerBaseline.current = null;
  });

  bench('optimized', () => {
    const r = new Reaction(() => {});
    Scheduler.current = r;
    const dep = new Dependency();
    dep.depend();
    dep.depend();
    dep.depend();
    Scheduler.current = null;
  });
});
