import { isSafeInteger, MAX_NUM, NOT_PROVIDED, PRIVATE } from './common.js';
import { expect, expectPrivate, warn } from './expect.js';
import { MersenneTwister } from './mersenne-twister.js';

const defaultGen = new MersenneTwister();
let gen: RandomGenerator = defaultGen;
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
    expect(limit >= 0 && isSafeInteger(limit), `'limit' must be a non-negative integer`);
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
    expect(typeof weight === 'number', `'pointProbability' must be a number`);
    expect(typeof handler === 'function', `'handler' must be a function`);
    expect(weight >= 0, `'pointProbability' must be non-negative`);
    expect(weight <= MAX_NUM, `'pointProbability' must < ${MAX_NUM}`);

    if (weight === 0) {
      return this;
    }

    this.sum += weight;
    this.probabilities.push(weight);
    this.handlers.push(handler);
    return this;
  }

  /**
   * Run this probability branch with a given probability
   * @param probability if not provided, a random value will be generated with a random number generator(default is Mersenne Twister)
   * - will **not** throw if `probability` is `NaN` or `Infinity`
   * @returns what the handler returns
   */
  run(probability: number = NOT_PROVIDED as any): unknown {
    if (Object.is(probability, NOT_PROVIDED)) {
      probability = gen.random() * this.sum;
    }
    if (this.limit > 0) {
      expect(this.limit > this.count, `This branch can only be run ${this.limit} time(s)`);
    }

    expect(
      typeof probability === 'number',
      `'probability' must be a number, please check your input or the generator`
    );

    if (this.sum === 0 || this.handlers.length === 0) {
      return;
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

  /**
   * Recover the default Mersenne Twister generator
   * - this is the same instance as before
   */
  restoreDefaultGenerator(): ProbabilityBranchCreator;

  /**
   * Get the seed for the random number generator(default is Mersenne Twister)
   * - The generator is **GLOBAL**, will affect all instances of `ProbabilityBranch`
   */
  setGenerator(generator: RandomGenerator): ProbabilityBranchCreator;

  /**
   * Get the seed for the random number generator(default is Mersenne Twister)
   * - The generator is **GLOBAL**, will affect all instances of `ProbabilityBranch`
   * @param seed the seed to set for the random number generator
   */
  setSeed(seed: number): ProbabilityBranchCreator;

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

/**
 * Create a new `ProbabilityBranch` instance
 * @param options.limit The maximum number of times this branch can be run, default is 1
 */
export const pb: ProbabilityBranchCreator = (options?: Partial<ProbabilityBranchOptions>) =>
  new ProbabilityBranch(PRIVATE, options);

pb.restoreDefaultGenerator = function () {
  gen = defaultGen;
  return pb;
};

pb.setGenerator = function (generator: RandomGenerator) {
  const { random, getCount, getSeed, setSeed } = generator;
  expect(typeof random === 'function', `'random' must be an instance of MersenneTwister`);
  const o = Object.create(null) as RandomGenerator;

  if (typeof getCount === 'function') {
    o.getCount = getCount.bind(generator);
  } else {
    o.getCount = () => NaN;
    warn(`'getCount' is not implemented, set to () => NaN`);
  }

  if (typeof generator.getSeed === 'function') {
    o.getSeed = getSeed.bind(generator);
  } else {
    o.getSeed = () => NaN;
    warn(`'getSeed' is not implemented, set to () => NaN`);
  }

  if (typeof generator.setSeed === 'function') {
    o.setSeed = setSeed.bind(generator);
  } else {
    o.setSeed = () => {};
    warn(`'setSeed' is not implemented, set to () => {}`);
  }

  return pb;
};

pb.setSeed = function (seed: number) {
  gen.setSeed(seed);
  return pb;
};

pb.getSeed = function () {
  return gen.getSeed();
};

pb.getCount = function () {
  return gen.getCount();
};
