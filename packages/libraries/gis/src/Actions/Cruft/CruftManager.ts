import { SegmentNode, VertexNode } from "@markpthomas/geometry";

import {
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track";
import { ITimeRange } from "../../Core/Time/TimeRange";
import { ISplitResult, SplitManager } from "../Split/SplitManager";


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @interface ICruftManager
 * @typedef {ICruftManager}
 */
export interface ICruftManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @type {Track}
 */
  track: Track;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {number} triggerDistanceKM
 * @returns {{
 *     segments: ITimeRange[];
 *     segmentKeep: ITimeRange;
 *   }\}
 */
  getTrackRangesByCruft(triggerDistanceKM: number): {
    segments: ITimeRange[];
    segmentKeep: ITimeRange;
  };
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {number} triggerDistanceKM
 * @returns {number}
 */
  trimTrackByCruft(triggerDistanceKM: number): number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {number} triggerDistanceKM
 * @returns {ISplitResult}
 */
  splitTrackSegmentByCruft(triggerDistanceKM: number): ISplitResult;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @class CruftManager
 * @typedef {CruftManager}
 * @implements {ICruftManager}
 */
export class CruftManager implements ICruftManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @private
 * @type {number}
 */
  private _totalSize: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @private
 * @type {number}
 */
  private _maxSize: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @private
 * @type {number}
 */
  private _pointSeparationLimit: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @private
 * @type {Track}
 */
  private _track: Track;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @readonly
 * @type {Track}
 */
  get track() {
    return this._track;
  }

  /**
 * Creates an instance of CruftManager.
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @constructor
 * @param {Track} track
 * @param {number} [pointSeparationLimit=5000]
 */
  constructor(track: Track, pointSeparationLimit: number = 5000) {
    this._track = track;
    this._pointSeparationLimit = pointSeparationLimit;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {?number} [triggerDistance]
 * @returns {{
 *     segments: ITimeRange[];
 *     segmentKeep: ITimeRange;
 *   }\}
 */
  getTrackRangesByCruft(
    triggerDistance?: number
  ): {
    segments: ITimeRange[];
    segmentKeep: ITimeRange;
  } {
    const triggerDistanceMeters = triggerDistance ?? this._pointSeparationLimit;
    const coordinates = this._track.trackPoints() as TrackPoint[];
    let point = this._track.firstPoint;

    this._maxSize = 0;
    this._totalSize = 0;

    const segments: ITimeRange[] = [];
    let segmentKeep: ITimeRange;
    let segment: ITimeRange = {
      startTime: point.val.timestamp,
      endTime: null
    };

    const updateSegmentKeep = (segmentCheck: ITimeRange, coordCount: number) => {
      segments.push(segmentCheck);

      if (coordCount > this._maxSize) {
        segmentKeep = segmentCheck;
        this._maxSize = coordCount;
      }
    }

    let coordCount = 0;
    while (point.next) {
      coordCount++;
      if (point.val.distanceTo(point.next.val) >= triggerDistanceMeters) {
        segment.endTime = point.val.timestamp;

        updateSegmentKeep(segment, coordCount);
        this._totalSize += coordCount;
        coordCount = 0;

        segment = {
          startTime: point.next.val.timestamp,
          endTime: null
        };
      }

      point = point.next as VertexNode<TrackPoint, TrackSegment>;
    }

    coordCount++;
    segment.endTime = coordinates[coordinates.length - 1].timestamp;
    updateSegmentKeep(segment, coordCount);
    this._totalSize += coordCount;

    return { segments, segmentKeep };
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {number} triggerDistance
 * @returns {number}
 */
  trimTrackByCruft(triggerDistance: number): number {
    const { segments, segmentKeep } = this.getTrackRangesByCruft(triggerDistance);

    if (segments.length > 1) {
      this._track.trimToRange(segmentKeep);
    };

    return this._totalSize - this._maxSize;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {?number} [triggerDistance]
 * @param {?number} [minMoveDuration]
 * @returns {ISplitResult}
 */
  splitTrackSegmentByCruft(triggerDistance?: number, minMoveDuration?: number): ISplitResult {
    const splitMngr = new SplitManager(this._track, minMoveDuration);

    triggerDistance = triggerDistance ?? this._pointSeparationLimit;

    // TODO: Replace w/ GapDistanceSplitter, add in GapTimeSplitter?
    const tracksSplit = splitMngr.splitBySegment(triggerDistance, this.isCruft)

    tracksSplit.tracks = splitMngr.removeShortTracks(tracksSplit.tracks, minMoveDuration);

    return tracksSplit;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @protected
 * @param {number} limit
 * @param {SegmentNode<TrackPoint, TrackSegment>} segment
 * @returns {boolean}
 */
  protected isCruft(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.length && segment.val.length >= Math.abs(limit);
  }
}