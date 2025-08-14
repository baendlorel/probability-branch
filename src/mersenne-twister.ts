import { PRIVATE } from './common.js';
import { preventPublicCalling } from './error.js';

export class MersenneTwister {
  private static readonly N = 624;
  private static readonly M = 397;
  private static readonly MATRIX_A = 0x9908b0df;
  private static readonly UPPER_MASK = 0x80000000;
  private static readonly LOWER_MASK = 0x7fffffff;
  private static readonly K = 1.0 / 0x100000000;

  private mt: number[] = new Array(MersenneTwister.N);
  private mti: number = MersenneTwister.N + 1;
  private seed: number;
  private count: number = 0;

  constructor() {
    this.seed = 0;
    this.init(PRIVATE, this.seed);
  }

  private init(priv: symbol, s: number) {
    preventPublicCalling(priv);

    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < MersenneTwister.N; this.mti++) {
      this.mt[this.mti] =
        (1812433253 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + this.mti) >>> 0;
    }
    this.seed = s;
    this.count = 0;
  }

  /**
   * Get how many random numbers have been generated since initialization
   */
  getCount(): number {
    return this.count;
  }

  /**
   * Get the seed that once used to initialize this generator
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Initialize the generator with a new seed
   * @param seed
   */
  setSeed(seed: number): void {
    this.init(PRIVATE, seed);
  }

  private randomInt(priv: symbol): number {
    preventPublicCalling(priv);

    let y: number;
    const mag01 = [0x0, MersenneTwister.MATRIX_A];

    if (this.mti >= MersenneTwister.N) {
      let kk: number;
      for (kk = 0; kk < MersenneTwister.N - MersenneTwister.M; kk++) {
        y =
          (this.mt[kk] & MersenneTwister.UPPER_MASK) |
          (this.mt[kk + 1] & MersenneTwister.LOWER_MASK);
        this.mt[kk] = this.mt[kk + MersenneTwister.M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (; kk < MersenneTwister.N - 1; kk++) {
        y =
          (this.mt[kk] & MersenneTwister.UPPER_MASK) |
          (this.mt[kk + 1] & MersenneTwister.LOWER_MASK);
        this.mt[kk] =
          this.mt[kk + (MersenneTwister.M - MersenneTwister.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y =
        (this.mt[MersenneTwister.N - 1] & MersenneTwister.UPPER_MASK) |
        (this.mt[0] & MersenneTwister.LOWER_MASK);
      this.mt[MersenneTwister.N - 1] = this.mt[MersenneTwister.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
      this.mti = 0;
    }

    y = this.mt[this.mti++];
    // Tempering
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    this.count++;
    return y >>> 0;
  }

  /**
   * Generate a random number in the range [0, 1)
   */
  random(): number {
    return this.randomInt(PRIVATE) * MersenneTwister.K;
  }
}
