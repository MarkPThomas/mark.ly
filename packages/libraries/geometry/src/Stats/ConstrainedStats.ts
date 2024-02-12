/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @abstract
 * @class ConstrainedStats
 * @typedef {ConstrainedStats}
 */
export abstract class ConstrainedStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @protected
 * @type {((number: number) => boolean) | null}
 */
  protected _isConsidered: ((number: number) => boolean) | null;

  /**
 * Creates an instance of ConstrainedStats.
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @constructor
 * @param {((number: number) => boolean) | null} [isConsidered=null]
 */
  constructor(isConsidered: ((number: number) => boolean) | null = null) {
    this._isConsidered = isConsidered;
  }
}