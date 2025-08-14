# Probability Branch

A lightweight TypeScript library for probabilistic branching and random selection, powered by the Mersenne Twister algorithm. 🎲✨

---

## Features

- Define multiple branches with custom probabilities and handlers
- Select a branch randomly or deterministically
- Limit the number of times a branch can be executed
- Pluggable random number generator (default: Mersenne Twister)
- Global control of random seed and generator

---

## Installation

```bash
pnpm add probability-branch
# or
npm install probability-branch
```

---

## Usage

```typescript
import { pb } from 'probability-branch';

// Create a probability branch instance
pb()
  .br(70, () => console.log('Branch A'))
  .br(30, () => console.log('Branch B'))
  .br(23.3, () => console.log('Branch C'))
  .br(103.6, () => console.log('Branch D'))
  .run(); // Randomly runs one branch based on weights
```

---

## API Reference

### `pb(options?: Partial<ProbabilityBranchOptions>): ProbabilityBranch`

Create a new probability branch instance.

- `options.limit`: Maximum number of times the branch can be run (default: 1, set to 0 for unlimited).
- **Returns** An `ProbabilityBranch` instance.

### `instance.add(weight: number, handler: Fn)`

Add a branch with a given probability and handler.

- `weight`: Non-negative number, probability weight for this branch.
- `handler`: Function to execute if this branch is selected.

### `instance.run(probability?: number)`

Run the probability branch. If `probability` is not provided, a random value is generated.

- Default random number generator is Mersenne Twister.

- **Returns** the result of the selected handler.

### `instance.getCount(): number`

Get how many times this instance has been run.

### Random Generator Control (Global)

#### `pb.setSeed(seed: number): ProbabilityBranchCreator`

Set the seed for the global random number generator.

#### `pb.getSeed(): number`

Get the current seed.

#### `pb.getCount(): number`

Get how many random numbers have been generated since initialization.

#### `pb.setGenerator(generator: RandomGenerator): ProbabilityBranchCreator`

Replace the global random number generator.

- The generator must implement the `RandomGenerator` interface. [See example below](#example-custom-random-generator)

#### `pb.restoreDefaultGenerator(): ProbabilityBranchCreator`

Restore the default Mersenne Twister generator.

## Example: Custom Random Generator

In this interface, only `random` method is strictly required.

Other methods will fallback to a default implementation that does nothing.

```typescript
class MyRandom implements RandomGenerator {
  private seed = 42;
  private count = 0;
  random() {
    this.count++;
    return Math.random();
  }
  setSeed(seed: number) {
    this.seed = seed;
  }
  getSeed() {
    return this.seed;
  }
  getCount() {
    return this.count;
  }
}

pb.setGenerator(new MyRandom());
pb.setSeed(123);
```

## Bonus: Mersenne Twister

You can import the Mersenne Twister directly if you want to use it as a custom random generator:

```typescript
import { MersenneTwister } from 'probability-branch';

new MersenneTwister(); // equivalent to `new MersenneTwister(0)`
new MersenneTwister(23);
```

---

## License

MIT

---

## Author

**KasukabeTsumugi**  
Email: futami16237@gmail.com
