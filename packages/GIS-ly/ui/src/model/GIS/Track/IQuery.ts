import { TrackSegmentData } from "./TrackSegment";

/**
 * Track objects that implement this are able to perform special queries on tracks that assist in further searches and manipulations.
 *
 * @export
 * @interface IQuery
 */
export interface IQuery {
  /**
   * Returns {@link TrackSegmentData} from the track before the given timestamp, exclusive of the timestamp.
   *
   * @param {string} timestamp
   * @return {*}  {TrackSegmentData}
   * @memberof IQuery
   */
  getSegmentBeforeTime(timestamp: string): TrackSegmentData;

  /**
   * Returns {@link TrackSegmentData} from the track after the given timestamp, exclusive of the timestamp.
   *
   * @param {string} timestamp
   * @return {*}  {TrackSegmentData}
   * @memberof IQuery
   */
  getSegmentAfterTime(timestamp: string): TrackSegmentData;

  /**
   * Returns {@link TrackSegmentData} from the track between the given timestamps, inclusive of the timestamps.
   *
   * @param {string} timestampStart
   * @param {string} timestampEnd
   * @return {*}  {TrackSegmentData}
   * @memberof IQuery
   */
  getSegmentBetweenTimes(timestampStart: string, timestampEnd: string): TrackSegmentData;

  /**
   * Returns {@link TrackSegmentData} from the track split at each of the given timestamps.
   *
   * Points at a given timestamp are duplicated such that they are the last Point of segment I, and first Point of segment J.
   *
   * @param {string[]} timestamps
   * @return {*}  {TrackSegmentData}
   * @memberof IQuery
   */
  getSegmentsSplitByTimes(timestamps: string[]): TrackSegmentData[];
}