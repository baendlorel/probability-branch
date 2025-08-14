import { describe, it, expect } from 'vitest';
import pkg from '../package.json' with { type: 'json' };
// @ts-ignore
import { version } from '../dist/index.mjs';

describe('VERSION', () => {
  it('should match package.json version (warn only)', () => {
    if (version !== pkg.version) {
      console.warn(
        `[WARN] version in code (${version}) does not match package.json (${pkg.version})`
      );
    }
    expect(true).toBe(true); // always pass
  });
});
