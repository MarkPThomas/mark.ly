import { SegmentNode } from "../../../../geometry/src/Polyline";

import {
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track";

import { ISplitResult } from "./SplitManager";
import { Splitter } from "./Splitter";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @class DistanceSplitter
 * @typedef {DistanceSplitter}
 * @extends {Splitter}
 */
export class DistanceSplitter extends Splitter {
  /**
 * Creates an instance of DistanceSplitter.
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @constructor
 * @param {Track} track
 * @param {number} [minTrackDuration=300]
 */
  constructor(track: Track, minTrackDuration: number = 300) {
    super(track, minTrackDuration);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {number} maxSegmentDistance
 * @param {?number} [minTrackDuration]
 * @returns {ISplitResult}
 */
  splitByMaxDistance(maxSegmentDistance: number, minTrackDuration?: number): ISplitResult {
    const tracksSplit = this._splitManager.splitBySegment(maxSegmentDistance, this.isTooLongLength);

    tracksSplit.tracks = this._splitManager.removeShortTracks(tracksSplit.tracks, minTrackDuration);

    return tracksSplit;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @protected
 * @param {number} limit
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 * @returns {boolean}
 */
  protected isTooLongLength(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.length && segment.val.length >= Math.abs(limit);
  }
}