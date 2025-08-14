import { describe, it, expect } from 'vitest';
import pkg from '../package.json' with { type: 'json' };
// @ts-ignore
import { ReflectDeep } from '../dist/index.mjs';

describe('测试版本获取', () => {
  it('ReflectDeep.version should match package.json version', () => {
    console.log('ReflectDeep.version:', ReflectDeep.version);
    expect(ReflectDeep.version).toBe(pkg.version);
  });
});
