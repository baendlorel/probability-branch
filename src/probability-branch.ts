import { MAX_NUM, NOT_PROVIDED, PRIVATE } from './common.js';
import { err, expectPrivate } from './expect.js';
import { MersenneTwister } from './mersenne-twister.js';

let gen: RandomGenerator = new MersenneTwister();
class ProbabilityBranch {
  private sum: number = 0;
  private probabilities: number[] = [];
  private handlers: Fn[] = [];
  private count: number = 0;

  // options
  private limit: number;

  constructor(priv: symbol, opts?: Partial<ProbabilityBranchOptions>) {
    expectPrivate(priv);

    const { limit = 1 } = Object(opts) as ProbabilityBranchOptions;
    this.limit = limit;
  }

  /**
   * Set the seed for the internal Mersenne Twister generator
   * - The generator is **GLOBAL**, will affect all instances of ProbabilityBranch
   * @param seed - The seed to initialize the Mersenne Twister generator
   */
  static setSeed(seed: number) {
    ProbabilityBranch.generator.setSeed(seed);
    return this;
  }

  /**
   * Get the seed for the internal Mersenne Twister generator
   * - The generator is **GLOBAL**, will affect all instances of ProbabilityBranch
   */
  static getSeed() {
    return ProbabilityBranch.generator.getSeed();
  }

  /**
   * Get how many random numbers have been generated since the Mersenne Twister generator is initialized
   * - The generator is **GLOBAL**, will affect all instances of ProbabilityBranch
   */
  static getCount() {
    return ProbabilityBranch.generator.getCount();
  }

  /**
   * Get how many times this instance has been run
   */
  getCount() {
    return this.count;
  }

  /**
   * Add a branch with a given probability and handler
   * - if the weight is 0, this branch will be ignored
   * - all weights will be summed up, and the probability of entering each branch is `weight / sum`
   * @param weight the probability of this branch, must be a non-negative number
   * @param handler the function to call when this branch is selected
   */
  add(weight: number, handler: Fn): ProbabilityBranch {
    if (typeof weight !== 'number') {
      throw err(`'pointProbability' must be a number`);
    }
    if (typeof handler !== 'function') {
      throw err(`'handler' must be a function`);
    }
    if (weight === 0) {
      return this;
    }
    if (weight < 0) {
      throw err(`'pointProbability' must be non-negative`);
    }
    if (weight > MAX_NUM) {
      throw err(`'pointProbability' must < ${MAX_NUM}`);
    }

    this.sum += weight;
    this.probabilities.push(weight);
    this.handlers.push(handler);
    return this;
  }

  /**
   * Run this probability branch with a given probability
   * @param probability if not provided, a random value will be generated with a internal Mersenne Twister generator
   * @returns what the handler returns
   */
  run(probability: number = NOT_PROVIDED as any): unknown {
    if (Object.is(probability, NOT_PROVIDED)) {
      probability = ProbabilityBranch.generator.random() * this.sum;
    }

    if (typeof probability !== 'number') {
      throw err(`'p' must be a number`);
    }

    if (this.sum === 0 || this.handlers.length === 0) {
      return;
    }

    if (this.limit >= this.count) {
      throw err(`This branch can only be run ${this.limit} time(s)`);
    }

    this.count++;

    let cumulative = 0;
    const len = this.probabilities.length;
    for (let i = 0; i < len; i++) {
      cumulative += this.probabilities[i];
      if (probability < cumulative) {
        const r = this.handlers[i]();
        this.clear(PRIVATE); // clear the branch after running
        return r;
      }
    }

    // & prevent some edge cases where the probability is very close to the sum
    const r = this.handlers[len - 1]();
    this.clear(PRIVATE); // clear the branch after running
    return r;
  }

  private clear(priv: symbol) {
    expectPrivate(priv);
    if (this.limit === 0) {
      return;
    }
    if (this.limit > this.count) {
      return;
    }
    this.sum = 0;
    this.probabilities.length = 0;
    this.handlers.length = 0;
  }
}

interface ProbabilityBranchCreator {
  (opts?: Partial<ProbabilityBranchOptions>): ProbabilityBranch;

  setGenerator(generator: RandomGenerator): ProbabilityBranchCreator;
  setSeed(seed: number): ProbabilityBranchCreator;
  getSeed(): number;
  getCount(): number;
}

/**
 * Create a new ProbabilityBranch instance
 */
export const pb: ProbabilityBranchCreator = (options?: Partial<ProbabilityBranchOptions>) =>
  new ProbabilityBranch(PRIVATE, options);

pb.setGenerator = function setGenerator(generator: RandomGenerator) {
  return pb;
};

pb.setSeed = function setSeed(seed: number) {
  gen.setSeed(seed);
  return pb;
};

pb.getSeed = function getSeed() {
  return gen.getSeed();
};

pb.getCount = function getCount() {
  return gen.getCount();
};
