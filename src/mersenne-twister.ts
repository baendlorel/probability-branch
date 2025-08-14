export class MersenneTwister {
  private static readonly N = 624;
  private static readonly M = 397;
  private static readonly MATRIX_A = 0x9908b0df;
  private static readonly UPPER_MASK = 0x80000000;
  private static readonly LOWER_MASK = 0x7fffffff;

  private mt: number[] = new Array(MersenneTwister.N);
  private mti: number = MersenneTwister.N + 1;

  constructor(seed: number = Date.now()) {
    this.init_genrand(seed);
  }

  private init_genrand(s: number) {
    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < MersenneTwister.N; this.mti++) {
      this.mt[this.mti] =
        (1812433253 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + this.mti) >>> 0;
    }
  }

  public randomInt(): number {
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
    return y >>> 0;
  }

  public random(): number {
    // 返回 [0,1) 的浮点数
    return this.randomInt() * (1.0 / 4294967296.0);
  }
}
