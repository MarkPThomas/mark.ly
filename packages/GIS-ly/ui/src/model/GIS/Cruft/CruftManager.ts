import { SegmentNode, VertexNode } from "../../Geometry";
import {
  Track,
  TrackPoint,
  TrackSegment
} from "../Track";
import { ITimeRange } from "../Time/TimeRange";
import { ISplitResult, SplitManager } from "../Split/SplitManager";


export interface ICruftManager {
  track: Track;

  getTrackRangesByCruft(triggerDistanceKM: number): {
    segments: ITimeRange[];
    segmentKeep: ITimeRange;
  };
  trimTrackByCruft(triggerDistanceKM: number): number;
  splitTrackSegmentByCruft(triggerDistanceKM: number): ISplitResult;
}

export class CruftManager implements ICruftManager {
  private _totalSize: number = 0;
  private _maxSize: number = 0;
  private _pointSeparationLimit: number;

  private _track: Track;
  get track() {
    return this._track;
  }

  constructor(track: Track, pointSeparationLimit: number = 5000) {
    this._track = track;
    this._pointSeparationLimit = pointSeparationLimit;
  }

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

  trimTrackByCruft(triggerDistance: number): number {
    const { segments, segmentKeep } = this.getTrackRangesByCruft(triggerDistance);

    if (segments.length > 1) {
      this._track.trimToRange(segmentKeep);
    };

    return this._totalSize - this._maxSize;
  }

  splitTrackSegmentByCruft(triggerDistance?: number, minMoveDuration?: number): ISplitResult {
    const splitMngr = new SplitManager(this._track, minMoveDuration);

    triggerDistance = triggerDistance ?? this._pointSeparationLimit;

    // TODO: Replace w/ GapDistanceSplitter, add in GapTimeSplitter?
    const tracksSplit = splitMngr.splitBySegment(triggerDistance, this.isCruft)

    tracksSplit.tracks = splitMngr.removeShortTracks(tracksSplit.tracks, minMoveDuration);

    return tracksSplit;
  }

  protected isCruft(limit: number, segment: SegmentNode<TrackPoint, TrackSegment>) {
    return segment.val?.length && segment.val.length >= Math.abs(limit);
  }
}