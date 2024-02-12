import { ConstrainedStats } from "./ConstrainedStats";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @interface ISumMean
 * @typedef {ISumMean}
 */
export interface ISumMean {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {number}
 */
  count: number,
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {number}
 */
  value: number,
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @returns {number}
 */
  mean(): number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @class SumMean
 * @typedef {SumMean}
 * @extends {ConstrainedStats}
 * @implements {ISumMean}
 */
export class SumMean
  extends ConstrainedStats
  implements ISumMean {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {number}
 */
  private _count: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @readonly
 * @type {number}
 */
  get count(): number {
    return this._count;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @private
 * @type {number}
 */
  private _value: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @readonly
 * @type {number}
 */
  get value(): number {
    return this._value;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @param {number} number
 */
  add(number: number) {
    if (this._isConsidered === null || this._isConsidered(number)) {
      this._count++;
      this._value += number;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @param {number} number
 */
  remove(number: number) {
    if ((this._isConsidered === null || this._isConsidered(number)) && this._count) {
      this._count--;
      this._value -= number;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @returns {number}
 */
  mean() {
    return this._count ? this._value / this._count : 0;
  }
}