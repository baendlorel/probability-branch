import { PRIVATE } from './common.js';

export function err(message: string): Error {
  return new Error('[__NAME__] ' + message);
}

export function preventPublicCalling(priv: symbol): asserts priv is typeof PRIVATE {
  if (priv !== PRIVATE) {
    throw err(`This method is private!`);
  }
}
