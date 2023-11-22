import { SegmentNode, VertexNode } from "../../../Geometry/Polyline";
import {
  EvaluatorArgs,
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track";

export interface ISplitResult {
  tracks: Track[]
  points?: VertexNode<TrackPoint, TrackSegment>[]
  segments?: SegmentNode<TrackPoint, TrackSegment>[]
}

export interface ISplitManager {
  track: Track;

  splitByPoint(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): ISplitResult

  splitBySegment(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, segment: SegmentNode<TrackPoint, TrackSegment>) => boolean
  ): ISplitResult
}

export class SplitManager implements ISplitManager {
  private _minTrackDuration: number;

  private _track: Track;
  get track() {
    return this._track;
  }

  constructor(track: Track, minTrackDuration: number = 300) {
    this._track = track;

    this._minTrackDuration = Math.abs(minTrackDuration);
  }

  splitByPoint(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): ISplitResult {
    const splitPoints: VertexNode<TrackPoint, TrackSegment>[] = this._track.vertexNodesBy(target, evaluator);
    const splitTracks = this._track.splitByMany(splitPoints);

    return {
      tracks: splitTracks,
      points: splitPoints
    };
  }

  splitBySegment(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: SegmentNode<TrackPoint, TrackSegment>) => boolean
  ): ISplitResult {
    let segmentNode = this._track.firstSegment;
    const splitPoints: VertexNode<TrackPoint, TrackSegment>[] = [];
    const splitSegments: SegmentNode<TrackPoint, TrackSegment>[] = [];

    while (segmentNode) {
      if (evaluator(target, segmentNode)) {
        splitSegments.push(segmentNode);
        splitPoints.push(segmentNode.prevVert);
        splitPoints.push(segmentNode.nextVert);
      }

      segmentNode = segmentNode.next as SegmentNode<TrackPoint, TrackSegment>;
    }

    const splitTracks = this._track.splitByMany(splitPoints);

    let splitTracksKeep: Track[];
    if (splitSegments.length >= 1 && splitTracks.length > 1
      && splitSegments[0].nextVert.val.timestamp === splitTracks[1].firstPoint.val.timestamp) {
      splitTracksKeep = this.keepEvenTracks(splitTracks);
    } else {
      splitTracksKeep = this.keepOddTracks(splitTracks);
    }

    if (splitTracksKeep.length === 0) {
      splitTracksKeep = [this._track];
    }

    return {
      tracks: splitTracksKeep,
      points: splitPoints,
      segments: splitSegments
    };
  }

  private keepOddTracks(splitTracks: Track[]) {
    const tracksKeep = [];

    splitTracks.forEach((splitTrack, index) => {
      if (this.indexIsOddCount(index)) {
        tracksKeep.push(splitTrack);
      }
    });

    return tracksKeep;
  }

  private keepEvenTracks(splitTracks: Track[]) {
    const tracksKeep = [];

    splitTracks.forEach((splitTrack, index) => {
      if (!this.indexIsOddCount(index)) {
        tracksKeep.push(splitTrack);
      }
    });

    return tracksKeep;
  }

  private indexIsOddCount(index) {
    return (index + 1) % 2;
  }

  removeShortTracks(tracks: Track[], minMoveDuration?: number): Track[] {
    minMoveDuration = minMoveDuration ?? this._minTrackDuration;
    const tracksKeep = [];
    tracks.forEach((track) => {
      if (!this.isTooShortDuration(track, minMoveDuration)) {
        tracksKeep.push(track);
      }
    });

    return tracksKeep;
  }

  private isTooShortDuration(track: Track, minMoveDuration: number): boolean {
    const duration = track.getDuration();

    return duration <= Math.abs(minMoveDuration);
  }
}