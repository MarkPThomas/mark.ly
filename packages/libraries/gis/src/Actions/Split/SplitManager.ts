import { SegmentNode, VertexNode } from "../../../../geometry/src/Polyline";

import {
  EvaluatorArgs,
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @interface ISplitResult
 * @typedef {ISplitResult}
 */
export interface ISplitResult {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @type {Track[]}
 */
  tracks: Track[]
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @type {?VertexNode<TrackPoint, TrackSegment>[]}
 */
  points?: VertexNode<TrackPoint, TrackSegment>[]
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @type {?SegmentNode<TrackPoint, TrackSegment>[]}
 */
  segments?: SegmentNode<TrackPoint, TrackSegment>[]
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @interface ISplitManager
 * @typedef {ISplitManager}
 */
export interface ISplitManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @type {Track}
 */
  track: Track;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @returns {ISplitResult}
 */
  splitByPoint(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): ISplitResult

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, segment: SegmentNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @returns {ISplitResult}
 */
  splitBySegment(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, segment: SegmentNode<TrackPoint, TrackSegment>) => boolean
  ): ISplitResult
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @class SplitManager
 * @typedef {SplitManager}
 * @implements {ISplitManager}
 */
export class SplitManager implements ISplitManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @private
 * @type {number}
 */
  private _minTrackDuration: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @private
 * @type {Track}
 */
  private _track: Track;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @readonly
 * @type {Track}
 */
  get track() {
    return this._track;
  }

  /**
 * Creates an instance of SplitManager.
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @constructor
 * @param {Track} track
 * @param {number} [minTrackDuration=300]
 */
  constructor(track: Track, minTrackDuration: number = 300) {
    this._track = track;

    this._minTrackDuration = Math.abs(minTrackDuration);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @returns {ISplitResult}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, coord: SegmentNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @returns {ISplitResult}
 */
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
    } else {
      let counter = 1;
      splitTracksKeep.forEach((track) => {
        track.name = `${track.name} (${counter})`;
        counter++;
      });
    }

    return {
      tracks: splitTracksKeep,
      points: splitPoints,
      segments: splitSegments
    };
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @private
 * @param {Track[]} splitTracks
 * @returns {{}\}
 */
  private keepOddTracks(splitTracks: Track[]) {
    const tracksKeep = [];

    splitTracks.forEach((splitTrack, index) => {
      if (this.indexIsOddCount(index)) {
        tracksKeep.push(splitTrack);
      }
    });

    return tracksKeep;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @private
 * @param {Track[]} splitTracks
 * @returns {{}\}
 */
  private keepEvenTracks(splitTracks: Track[]) {
    const tracksKeep = [];

    splitTracks.forEach((splitTrack, index) => {
      if (!this.indexIsOddCount(index)) {
        tracksKeep.push(splitTrack);
      }
    });

    return tracksKeep;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @private
 * @param {*} index
 * @returns {number}
 */
  private indexIsOddCount(index) {
    return (index + 1) % 2;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {Track[]} tracks
 * @param {?number} [minMoveDuration]
 * @returns {Track[]}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @private
 * @param {Track} track
 * @param {number} minMoveDuration
 * @returns {boolean}
 */
  private isTooShortDuration(track: Track, minMoveDuration: number): boolean {
    const duration = track.getDuration();

    return duration <= Math.abs(minMoveDuration);
  }
}