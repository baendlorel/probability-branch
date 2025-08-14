type Fn<T extends unknown[] = unknown[], R extends unknown = unknown> = (...args: T) => R;

interface ProbabilityBranchOptions {
  /**
   * Default is `1`, means you can only run the branch once
   * - if you want to run the branch multiple times, set this to `0`
   */
  limit: number;
}

interface RandomGenerator {
  random(): number;
  getSeed(): number;
  setSeed(seed: number): void;
  getCount(): number;
}
