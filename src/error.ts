export function err(message: string): Error {
  return new Error('[__NAME__] ' + message);
}
