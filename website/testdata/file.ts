import * as BigNum from "some-bignum-lib";

/**
 * A class to compute sum of two given numbers.
 */
export class Sum {
  /**
   * Private data containing cache of sum operation.
   */
  private cache: BigNum.number;

  // Let's have no comment for this one
  constructor(private a: BigNum.number, private b: BigNum.number) {
  
  }

  /**
   * Returns the result.
   */
  compute() {
    if (!this.cache) {
      this.cache = BigNum.sum(this.a + this.b);
    }
    return this.cache;
  }
}
