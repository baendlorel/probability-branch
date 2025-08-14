import { describe, it, expect } from 'vitest';
import { pb } from '../src/probability-branch.js';

describe('Integration', () => {
  it('randomly selects branch', () => {
    const values: string[] = [];
    const branch = pb({ limit: 0 })
      .add(1, () => values.push('A'))
      .add(1, () => values.push('B'));
    branch.run();
    expect(['A', 'B']).toContain(values[0]);
  });

  it('works with custom generator', () => {
    class FixedGen {
      random() {
        return 0.99;
      }
      setSeed() {}
      getSeed() {
        return 0;
      }
      getCount() {
        return 0;
      }
    }
    pb.setGenerator(new FixedGen());
    const branch = pb({ limit: 0 })
      .add(1, () => 'A')
      .add(1, () => 'B');
    expect(branch.run()).toBe('B');
    pb.restoreDefaultGenerator();
  });
});
