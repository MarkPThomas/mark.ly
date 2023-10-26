import { SegmentNode } from "../../Geometry/Polyline";
import {
  Track,
  TrackPoint,
  TrackSegment
} from "../Track";
import { ISplitResult } from "./SplitManager";

import { Splitter } from "./Splitter";

export class StopSplitter extends Splitter {
  constructor(track: Track, minMoveDuration: number = 300) {
    super(track, minMoveDuration);
  }

  splitByStopDuration(maxStopDuration: number, minMoveDuration?: number): ISplitResult {
    const tracksSplit = this._splitManager.splitBySegment(maxStopDuration, this.isDoneWithActivity);

    tracksSplit.tracks = this._splitManager.removeShortTracks(tracksSplit.tracks, minMoveDuration);

    return tracksSplit;
  }

  protected isNearEdge(track: Track, minEdgeTimes: number): boolean {
    const duration = track.getDuration();

    return duration <= Math.abs(minEdgeTimes);
  }

  protected isDoneWithActivity(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.duration && segment.val.duration > limit;
  }
}