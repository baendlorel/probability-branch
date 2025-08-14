import { describe, it, expect } from 'vitest';
import pkg from '../package.json' with { type: 'json' };
// @ts-ignore
import { version } from '../dist/index.mjs';

describe('VERSION', () => {
  it('should match package.json version', () => {
    expect(version).toBe(pkg.version);
  });
});
