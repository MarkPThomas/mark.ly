
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
export class TimeRange implements ITimeRange {
  _startTime: string;
  get startTime() {
    return this._startTime;
  }

  _endTime: string;
  get endTime() {
    return this._endTime;
  }

  constructor(startTime: string, endTime: string) {
    this._startTime = startTime;
    this._endTime = endTime;
  }
}