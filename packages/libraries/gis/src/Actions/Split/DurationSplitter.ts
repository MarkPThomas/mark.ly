import { SegmentNode } from "@markpthomas/geometry/polyline";

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
 * @class DurationSplitter
 * @typedef {DurationSplitter}
 * @extends {Splitter}
 */
export class DurationSplitter extends Splitter {
  /**
 * Creates an instance of DurationSplitter.
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
 * @param {number} maxSegmentDuration
 * @param {?number} [minTrackDuration]
 * @returns {ISplitResult}
 */
  splitByMaxDuration(maxSegmentDuration: number, minTrackDuration?: number): ISplitResult {
    const tracksSplit = this._splitManager.splitBySegment(maxSegmentDuration, this.isTooLongDuration);

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
  protected isTooLongDuration(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.duration && segment.val.duration > Math.abs(limit);
  }
}