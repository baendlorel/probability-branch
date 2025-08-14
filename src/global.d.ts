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

  /**
   * Get the seed for the random number generator(default is Mersenne Twister)
   * - The generator is **GLOBAL**, will affect all instances of `ProbabilityBranch`
   * @param seed the seed to set for the random number generator
   */
  setSeed(seed: number): void;

  /**
   * Get the seed for the random number generator(default is Mersenne Twister)
   * - The generator is **GLOBAL**, will affect all instances of `ProbabilityBranch`
   */
  getSeed(): number;

  /**
   * Get how many random numbers have been generated since the generator is initialized
   * - The generator is **GLOBAL**, will affect all instances of `ProbabilityBranch`
   */
  getCount(): number;
}
