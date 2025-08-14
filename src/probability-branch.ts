import { MAX_NUM, NOT_PROVIDED, PRIVATE } from './common.js';
import { err, preventPublicCalling } from './error.js';
import { MersenneTwister } from './mersenne-twister.js';

type Fn<T extends unknown[] = unknown[], R extends unknown = unknown> = (...args: T) => R;

class ProbabilityBranch {
  private static mersenneTwister = new MersenneTwister();

  private sum = 0;
  private probabilities: number[] = [];
  private handlers: Fn[] = [];

  constructor(priv: symbol) {
    preventPublicCalling(priv);
  }

  /**
   * Set the seed for the internal Mersenne Twister generator
   * - The generator is **GLOBAL**, will affect all instances of ProbabilityBranch
   * @param seed - The seed to initialize the Mersenne Twister generator
   */
  setSeed(seed: number) {
    ProbabilityBranch.mersenneTwister.setSeed(seed);
    return this;
  }

  /**
   * Get the seed for the internal Mersenne Twister generator
   * - The generator is **GLOBAL**, will affect all instances of ProbabilityBranch
   */
  getSeed() {
    return ProbabilityBranch.mersenneTwister.getSeed();
  }

  /**
   * Get how many random numbers have been generated since the Mersenne Twister generator is initialized
   * - The generator is **GLOBAL**, will affect all instances of ProbabilityBranch
   */
  getCount() {
    return ProbabilityBranch.mersenneTwister.getCount();
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
      probability = ProbabilityBranch.mersenneTwister.random() * this.sum;
    }

    if (typeof probability !== 'number') {
      throw err(`'p' must be a number`);
    }

    if (this.sum === 0 || this.handlers.length === 0) {
      return;
    }

    let cumulative = 0;
    for (let i = 0; i < this.probabilities.length; i++) {
      cumulative += this.probabilities[i];
      if (probability < cumulative) {
        return this.handlers[i]();
      }
    }

    // & prevent some edge cases where the probability is very close to the sum
    return this.handlers[this.handlers.length - 1]();
  }
}

/**
 * Create a new ProbabilityBranch instance
 */
export const pb = () => new ProbabilityBranch(PRIVATE);
