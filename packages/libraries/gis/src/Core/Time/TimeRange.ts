
/**
 * Simple data storage for how to determine sub-paths within an existing larger path.
*
* @export
* @interface ISegmentLimits
* @template TCoord
*/
export interface ITimeRange {
  /**
   * First timestamp, indicating the start of a segment.
  *
  * @type {string}
  * @memberof ITrackSegmentLimits
  */
  startTime: string,

  /**
   * Last timestamp, indicating the end of a segment.
  *
  * @type {(string | null)}
  * @memberof ITrackSegmentLimits
  */
  endTime: string | null
};

// TODO: Add validation - at least that end time > start time, if not also format of timestamp
// TODO: Add method for mergeInterval cases, where multiple time ranges are consolidated/simplified
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @class TimeRange
 * @typedef {TimeRange}
 * @implements {ITimeRange}
 */
export class TimeRange implements ITimeRange {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {string}
 */
  _startTime: string;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @readonly
 * @type {string}
 */
  get startTime() {
    return this._startTime;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {string}
 */
  _endTime: string;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @readonly
 * @type {string}
 */
  get endTime() {
    return this._endTime;
  }

  /**
 * Creates an instance of TimeRange.
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @constructor
 * @param {string} startTime
 * @param {string} endTime
 */
  constructor(startTime: string, endTime: string) {
    this._startTime = startTime;
    this._endTime = endTime;
  }
}