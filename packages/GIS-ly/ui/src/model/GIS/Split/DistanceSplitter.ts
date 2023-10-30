import { SegmentNode } from "../../Geometry/Polyline";
import {
  Track,
  TrackPoint,
  TrackSegment
} from "../Track";
import { ISplitResult } from "./SplitManager";

import { Splitter } from "./Splitter";

export class DistanceSplitter extends Splitter {
  constructor(track: Track, minTrackDuration: number = 300) {
    super(track, minTrackDuration);
  }

  splitByMaxDistance(maxSegmentDistance: number, minTrackDuration?: number): ISplitResult {
    const tracksSplit = this._splitManager.splitBySegment(maxSegmentDistance, this.isTooLongLength);

    tracksSplit.tracks = this._splitManager.removeShortTracks(tracksSplit.tracks, minTrackDuration);

    return tracksSplit;
  }

  protected isTooLongLength(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.length && segment.val.length >= Math.abs(limit);
  }
}