import { SegmentNode } from "../../Geometry/Polyline";
import {
  Track,
  TrackPoint,
  TrackSegment
} from "../Track";
import { ISplitResult } from "./SplitManager";

import { Splitter } from "./Splitter";

export class DurationSplitter extends Splitter {
  constructor(track: Track, minTrackDuration: number = 300) {
    super(track, minTrackDuration);
  }

  splitByMaxDuration(maxSegmentDuration: number, minTrackDuration?: number): ISplitResult {
    const tracksSplit = this._splitManager.splitBySegment(maxSegmentDuration, this.isTooLongDuration);

    tracksSplit.tracks = this._splitManager.removeShortTracks(tracksSplit.tracks, minTrackDuration);

    return tracksSplit;
  }

  protected isTooLongDuration(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.duration && segment.val.duration > Math.abs(limit);
  }
}