import { expect, describe, it } from 'vitest';
import { pb } from '../src/probability-branch.js';

describe('ProbabilityBranch', () => {
  it('should select the correct branch by probability', () => {
    const result: number[] = [];
    const branch = pb()
      .add(1, () => result.push(1))
      .add(2, () => result.push(2))
      .add(3, () => result.push(3));

    // 手动指定概率，测试分支选择
    branch.run(0); // 选第一个
    branch.run(1.5); // 选第二个
    branch.run(3.5); // 选第三个

    expect(result).toEqual([1, 2, 3]);
  });

  it('should use random when probability not provided', () => {
    const branch = pb()
      .add(1, () => 1)
      .add(1, () => 2);

    const val = branch.run();
    expect([1, 2]).toContain(val);
  });

  it('should set and get seed', () => {
    const branch = pb();
    branch.setSeed(12345);
    expect(branch.getSeed()).toBe(12345);
  });

  it('should get count of random numbers generated', () => {
    const branch = pb();
    const before = branch.getCount();
    branch.run();
    const after = branch.getCount();
    expect(after).toBeGreaterThan(before);
  });

  it('should return undefined if no branches', () => {
    const branch = pb();
    expect(branch.run(0)).toBeUndefined();
  });
});
