# Probability Branch

> A flexible probability branching utility for JavaScript/TypeScript projects. 🎲

## Features

- Add multiple branches with custom probabilities
- Execute a branch based on a given or random probability
- Global Mersenne Twister random generator for reproducible results
- Set and get the random seed for deterministic testing
- Track how many random numbers have been generated
- TypeScript support

## Installation

```bash
pnpm add probability-branch
# or
yarn add probability-branch
# or
npm install probability-branch
```

## Usage

```typescript
import { pb } from 'probability-branch';

const result = pb()
  .add(1, () => 'A')
  .add(2, () => 'B')
  .add(3, () => 'C')
  .run(); // Randomly returns 'A'(1/6), 'B'(1/3), or 'C'(1/2) based on probability

await pb()
  .add(0.1, () => 'A')
  .add(0.5, () => 'B')
  .add(0.4, () => 'C')
  .run(); // Randomly returns 'A'(0.1), 'B'(0.5), or 'C'(0.4) based on probability
```

### Set and Get Seed

```typescript
branch.setSeed(12345); // Set the global seed
console.log(branch.getSeed()); // Get the current seed
console.log(branch.getCount()); // How many random numbers have been generated
```

### Manual Probability

```typescript
branch.run(0); // Always selects the first branch
branch.run(2.5); // Selects the branch based on cumulative probability
```

## API

### pb()

Create a new ProbabilityBranch instance.

### ProbabilityBranch.add(pointProbability, handler)

Add a branch with a given probability and handler function.

- `pointProbability`: number, must be non-negative
- `handler`: function to execute when this branch is selected

### ProbabilityBranch.run(probability?)

Run the branch selection. If `probability` is not provided, a random value is generated using the internal Mersenne Twister generator.

### ProbabilityBranch.setSeed(seed)

Set the seed for the internal random generator (global for all instances).

### ProbabilityBranch.getSeed()

Get the current seed of the internal random generator.

### ProbabilityBranch.getCount()

Get how many random numbers have been generated since initialization.

---

## Bonus: Mersenne Twister 🎁

This package includes a standalone Mersenne Twister random number generator for advanced use cases.

```typescript
import { MersenneTwister } from 'probability-branch';

const mt = new MersenneTwister();
mt.setSeed(2025);
console.log(mt.random()); // Get a random float in [0, 1)
console.log(mt.getSeed()); // Get the current seed
console.log(mt.getCount()); // Get how many random numbers have been generated
```

---

## License

MIT
