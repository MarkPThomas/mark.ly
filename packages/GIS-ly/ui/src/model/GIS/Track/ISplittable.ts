import { ITimeRange } from "./TrackSegment";

/**
 *  Track objects that implement this interface are able to split tracks into sub-tracks.
 *  Splitting returns copies of the sub-tracks and should not modify the original track.
 *
 * @export
 * @interface ISplittable
 * @template TTrack
 */
export interface ISplittable<TTrack> {
  /**
   * Splits track at each of the given timestamps. The original track is not modified.
   *
   * Points at a given timestamp are duplicated such that they are the last Point of segment I, and first Point of segment J.
   *
   * @param {string[]} timestampsSplit
   * @return {*}  {TTrack[]} Duplicated sub-tracks split by the timestamps.
   * @memberof ISplittable
   */
  splitByTimes(timestampsSplit: string[]): TTrack[];

  /**
   * Splits track at the given segment limits to return only those portions of the track.
   *
   * The original track is not modified.
   *
   * If no valid split is found, returns undefined.
   *
   * @param {ITimeRange} segment
   * @return {*}  {TTrack} The a copy of the track that lies within the specified limits.
   * @memberof ISplittable
   */
  splitToSegment(segment: ITimeRange): TTrack | undefined;

  /**
   * Splits track at each of the given segment limits to return portions of the track that do not
   * lie within those limits.
   *
   * The original track is not modified.
   *
   * @param {ITimeRange[]} segments
   * @return {*}  {TTrack[]} Duplicated sub-tracks that are copies of each track portion that lies within each specified pairs of limits.
   * @memberof ISplittable
   */
  splitBySegments(segments: ITimeRange[]): TTrack[];
}