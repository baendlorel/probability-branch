type Fn<T extends unknown[] = unknown[], R extends unknown = unknown> = (...args: T) => R;

class ProbabilityBranch {
  static version = '__VERSION__';
  private probabilities: number[] = [];
  private handlers: Fn[] = [];
  private random: Fn<unknown[], number> = Math.random;

  constructor() {}

  add(probability: number, handler: Fn) {
    this.probabilities.push(probability);
    this.handlers.push(handler);
    return this;
  }
}
