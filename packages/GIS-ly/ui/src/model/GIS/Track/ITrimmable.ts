/**
 * Track objects that implement this interface are able to clip tracks. Clipping modifies the existing track.
 *
 * @export
 * @interface ITrimmable
 */
export interface ITrimmable {

  /**
   * Clips track before the given timestamp, exclusive of the timestamp. The original track is modified.
   *
   * @param {string} timestamp
   * @memberof IClippable
   */
  trimBeforeTime(timestamp: string): void;

  /**
   * Clips track after the given timestamp, exclusive of the timestamp. The original track is modified.
   *
   * @param {string} timestamp
   * @memberof IClippable
   */
  trimAfterTime(timestamp: string): void;

  /**
   * Clips track between the given timestamps, inclusive of the timestamps. The original track is modified.
   *
   * @param {string} timestampStart
   * @param {string} timestampEnd
   * @memberof IClippable
   */
  trimByTimes(timestampStart: string, timestampEnd: string): void;
}