import { FeatureCollection } from '@markpthomas/geojson';
import { VertexNode, SegmentNode, IPolylineSize } from '@markpthomas/geometry/polyline';

import { ICloneable, IEquatable } from 'common/interfaces';

import { GeoJsonManager } from '../GeoJsonManager';

import { TrackPoint } from './TrackPoint';
import { TrackSegment, TrackSegmentData } from './TrackSegment';
import { ITimeRange } from '../Time/TimeRange';
import { GeoJsonTrack } from './GeoJsonTrack';
import { PolylineTrack } from './PolylineTrack';
import { BoundingBox } from '../BoundingBox';
import { IPointProperties } from '../point/Point';
import { ITrackStats, TimeStats, TrackStats } from './stats';
import { ApiElevations } from '../route';


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @typedef {EvaluatorArgs}
 */
export type EvaluatorArgs = { [name: string]: number };

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface IEditedTrackStats
 * @typedef {IEditedTrackStats}
 * @extends {ITrackStats}
 */
export interface IEditedTrackStats extends ITrackStats {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {IPolylineSize}
 */
  size: IPolylineSize
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrack
 * @typedef {ITrack}
 * @extends {ICloneable<Track>}
 * @extends {IEquatable<Track>}
 */
export interface ITrack
  extends
  ICloneable<Track>,
  IEquatable<Track> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  name: string;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  time: string;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {VertexNode<TrackPoint, TrackSegment>}
 */
  firstPoint: VertexNode<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {SegmentNode<TrackPoint, TrackSegment>}
 */
  firstSegment: SegmentNode<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {VertexNode<TrackPoint, TrackSegment>}
 */
  lastPoint: VertexNode<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {SegmentNode<TrackPoint, TrackSegment>}
 */
  lastSegment: SegmentNode<TrackPoint, TrackSegment>;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {BoundingBox}
 */
  boundingBox(): BoundingBox;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackPoint[]}
 */
  trackPoints(): TrackPoint[]; // TODO: Add optional overload to limit range by ITrackSegmentLimits
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackSegment[]}
 */
  trackSegments(): TrackSegment[]; // TODO: Add optional overload to limit range by ITrackSegmentLimits
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {*}
 */
  toJson();

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  addProperties(): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  addElevationProperties(): void;

  // updateBySegment(segData: TrackSegmentData): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {TrackSegmentData} segData
 * @returns {Track}
 */
  copyBySegment(segData: TrackSegmentData): Track;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestamp
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null | undefined)}
 */
  vertexNodeByTime(timestamp: string): VertexNode<TrackPoint, TrackSegment> | null | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {IPointProperties} point
 * @returns {VertexNode<TrackPoint, TrackSegment>[]}
 */
  vertexNodesByPoint(point: IPointProperties): VertexNode<TrackPoint, TrackSegment>[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @returns {VertexNode<TrackPoint, TrackSegment>[]}
 */
  vertexNodesBy(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): VertexNode<TrackPoint, TrackSegment>[];

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {IEditedTrackStats}
 */
  getStats(): IEditedTrackStats;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @class Track
 * @typedef {Track}
 * @implements {ITrack}
 */
export class Track implements ITrack {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @private
 * @type {GeoJsonTrack}
 */
  private _geoJsonTrack: GeoJsonTrack;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @private
 * @type {PolylineTrack}
 */
  private _polylineTrack: PolylineTrack;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @public
 * @type {string}
 */
  public id: string;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  get name(): string {
    return this._geoJsonTrack.trackMetaData.name;
  }
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  set name(name: string) {
    name = name?.trim();
    if (name) {
      this._geoJsonTrack.trackMetaData.name = name;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @readonly
 * @type {string}
 */
  get time(): string {
    return this._geoJsonTrack.trackMetaData.time;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @readonly
 * @type {*}
 */
  get firstPoint() {
    return this._polylineTrack.firstVertex;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @readonly
 * @type {*}
 */
  get firstSegment() {
    return this._polylineTrack.firstSegment;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @readonly
 * @type {*}
 */
  get lastPoint() {
    return this._polylineTrack.lastVertex;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @readonly
 * @type {*}
 */
  get lastSegment() {
    return this._polylineTrack.lastSegment;
  }

  // TODO: Currently instantiates a new one each time.
  // Make this lazy?
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {BoundingBox}
 */
  boundingBox(): BoundingBox {
    return this._geoJsonTrack.boundingBox();
  }

  // TODO: This class should be initialized & returned from GeoJsonManager as part of track merging process.
  //  This ensures that the FeatureCollection is always a single LineString
  //  Other option in that class is to return a set of Track classes, one for each LineString in a collection of LineStrings or MultiLineStrings
  /**
 * Creates an instance of Track.
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() { }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {FeatureCollection} geoJson
 * @returns {Track}
 */
  static fromGeoJson(geoJson: FeatureCollection): Track {
    // TODO: Check/enforce single LineString collections - Perhaps derive new type?
    const track = new Track();

    track._geoJsonTrack = new GeoJsonTrack(geoJson);

    const trkPts = track._geoJsonTrack.trackPoints();
    track._polylineTrack = new PolylineTrack(trkPts);

    return track;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {TrackPoint[]} trkPts
 * @param {?string} [name]
 * @returns {Track}
 */
  static fromPoints(trkPts: TrackPoint[], name?: string): Track {
    const track = new Track();

    const featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trkPts);

    track._geoJsonTrack = new GeoJsonTrack(featureCollection, name);
    track._polylineTrack = new PolylineTrack(trkPts);

    return track;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {PolylineTrack} trkPolyline
 * @param {?string} [name]
 * @returns {Track}
 */
  static fromPolyline(trkPolyline: PolylineTrack, name?: string) {
    const track = new Track();

    const featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trkPolyline.vertices());
    track._geoJsonTrack = new GeoJsonTrack(featureCollection, name);

    track._polylineTrack = trkPolyline;

    return track;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {Track}
 */
  clone(): Track {
    const track = new Track();

    track.id = this.id;
    track._geoJsonTrack = this._geoJsonTrack.clone();
    track._polylineTrack = this._polylineTrack.clone();

    return track;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {Track} track
 * @returns {boolean}
 */
  equals(track: Track): boolean {
    // Assumed that with polylineTrack acting as a proxy, it is always in sync with the geoJson track whenever outside sources may care
    return this._geoJsonTrack.equals(track._geoJsonTrack);
  }

  // Properties Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  addProperties() {
    this._polylineTrack.addProperties();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  addElevationProperties() {
    this._polylineTrack.addElevationProperties();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(Map<string, number> | { [key: string]: number })\} elevations
 */
  addElevations(elevations: Map<string, number> | { [key: string]: number }) {
    this._polylineTrack.addElevations(elevations);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  addElevationsFromApi(getElevationsApi: ApiElevations) {
    this._polylineTrack.addElevationsFromApi(getElevationsApi);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {string[]}
 */
  timestamps(): string[] {
    return this.trackPoints().map((trackPoint) => trackPoint.timestamp);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackPoint[]}
 */
  trackPoints(): TrackPoint[] {
    return this._polylineTrack.vertices();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackSegment[]}
 */
  trackSegments(): TrackSegment[] {
    return this._polylineTrack.segments();
  }

  // TODO:
  // Currently this is a copy that is NOT hooked into the track.
  // Work out a reasonable & efficient way to maintain the hooked state while exposing
  //    the geoJSON object for external hooking.
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {*}
 */
  toJson() {
    return this._geoJsonTrack.toJson();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestamp
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null | undefined)}
 */
  vertexNodeByTime(timestamp: string): VertexNode<TrackPoint, TrackSegment> | null | undefined {
    return this._polylineTrack.vertexNodeByTime(timestamp);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {IPointProperties} point
 * @returns {VertexNode<TrackPoint, TrackSegment>[]}
 */
  vertexNodesByPoint(point: IPointProperties): VertexNode<TrackPoint, TrackSegment>[] {
    return this._polylineTrack.vertexNodesByPoint(point);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @returns {VertexNode<TrackPoint, TrackSegment>[]}
 */
  vertexNodesBy(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): VertexNode<TrackPoint, TrackSegment>[] {
    return this._polylineTrack.vertexNodesBy(target, evaluator);
  }

  // === Property Methods

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {{ time: ITime; speed: IRateProperty; heightRate: IHeightRate; height: IHeight; slope: ISlope; size: any; }\}
 */
  getStats() {
    const size = this._polylineTrack.size();
    const trackStats = TrackStats.fromTrack(this._polylineTrack);
    const statsResults = trackStats.stats;

    return {
      size,
      ...statsResults
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {number}
 */
  getDuration() {
    const timeStats = new TimeStats();
    timeStats.of(this._polylineTrack);

    return timeStats.duration;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(boolean | number)} trackChanged
 */
  updateGeoJsonTrack(trackChanged: boolean | number) {
    if (trackChanged) {
      const trackPoints = this._polylineTrack.vertices();
      this._geoJsonTrack.updateFromTrackPoints(trackPoints);
    }
  }

  // TODO: Not used
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {TrackSegmentData} segment
 */
  updateBySegment(segment: TrackSegmentData): void {
    this.updateGivenTrack(segment, this);
  }

  // TODO: Not used once Split feature finished
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {TrackSegmentData} segment
 * @returns {Track}
 */
  copyBySegment(segment: TrackSegmentData): Track {
    const track = new Track();
    return this.updateGivenTrack(segment, track);
  }

  // TODO: Not used once Split feature finished
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {TrackSegmentData} segData
 * @param {Track} track
 * @returns {Track}
 */
  protected updateGivenTrack(
    segData: TrackSegmentData,
    track: Track
  ): Track {
    if (segData.segPoints.length) {
      const geoJson = track._geoJsonTrack.copyBySegmentData(segData);
      track._geoJsonTrack = new GeoJsonTrack(geoJson);
    }

    if (segData.segTimestamps) {
      const timestamps = segData.segTimestamps;
      const startTime = timestamps[0];
      const endTime = timestamps[timestamps.length - 1];
      track._polylineTrack = track._polylineTrack.cloneFromToTimes(startTime, endTime);
    }

    return track;
  }

  // === IQuery
  // TODO: These might be better on the Polyline w/ ITrackSegmentLimits returned and then updating the geoJson collection object on modifying methods
  // TODO: Not used
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestamp
 * @returns {TrackSegmentData}
 */
  getSegmentBeforeTime(timestamp: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentBeforeTime(timestamp);
  }

  // TODO: Not used
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestamp
 * @returns {TrackSegmentData}
 */
  getSegmentAfterTime(timestamp: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentAfterTime(timestamp);
  }

  // TODO: Not used
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestampStart
 * @param {string} timestampEnd
 * @returns {TrackSegmentData}
 */
  getSegmentBetweenTimes(timestampStart: string, timestampEnd: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);
  }

  // TODO: Not used once Split feature finished
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} timestampsSplit
 * @returns {TrackSegmentData[]}
 */
  getSegmentsSplitByTimes(timestampsSplit: string[]): TrackSegmentData[] {
    return this._geoJsonTrack.getSegmentsSplitByTimes(timestampsSplit);
  }

  // ===== Remove Methods =====
  // === Trim Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  clear() {
    this._geoJsonTrack = null;
    this._polylineTrack.clear();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)}
 */
  trimBefore(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    iterating: boolean = false
  ): VertexNode<TrackPoint, TrackSegment> | null {

    let trimmedHead: VertexNode<TrackPoint, TrackSegment>;
    if (typeof target === 'string') {
      trimmedHead = this._polylineTrack.trimBeforeTime(target);
    } else if (VertexNode.isVertexNode(target)) {
      trimmedHead = this._polylineTrack.trimBefore(target as VertexNode<TrackPoint, TrackSegment>);
    } else {
      trimmedHead = this._polylineTrack.trimBeforePoint(target as IPointProperties);
    }

    if (!iterating) {
      this.updateGeoJsonTrack(!!trimmedHead);
    }
    return trimmedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)}
 */
  trimAfter(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    iterating: boolean = false
  ): VertexNode<TrackPoint, TrackSegment> | null {

    let trimmedHead: VertexNode<TrackPoint, TrackSegment>;
    if (typeof target === 'string') {
      trimmedHead = this._polylineTrack.trimAfterTime(target);
    } else if (VertexNode.isVertexNode(target)) {
      trimmedHead = this._polylineTrack.trimAfter(target as VertexNode<TrackPoint, TrackSegment>);
    } else {
      trimmedHead = this._polylineTrack.trimAfterPoint(target as IPointProperties);
    }

    if (!iterating) {
      this.updateGeoJsonTrack(!!trimmedHead);
    }
    return trimmedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)[]}
 */
  trimTo(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    iterating: boolean = false
  ): (VertexNode<TrackPoint, TrackSegment> | null)[] {

    let trimmedHeads: VertexNode<TrackPoint, TrackSegment>[];
    if (typeof startPoint === 'string' && typeof endPoint === 'string') {
      trimmedHeads = this._polylineTrack.trimToTimes(startPoint, endPoint);
    } else if ((startPoint && VertexNode.isVertexNode(startPoint)) || (endPoint && VertexNode.isVertexNode(endPoint))) {
      trimmedHeads = this._polylineTrack.trimTo(
        startPoint as VertexNode<TrackPoint, TrackSegment>,
        endPoint as VertexNode<TrackPoint, TrackSegment>);
    } else {
      trimmedHeads = this._polylineTrack.trimToPoints(
        startPoint as IPointProperties,
        endPoint as IPointProperties);
    }

    if (!iterating) {
      this.updateGeoJsonTrack(trimmedHeads.length);
    }
    return trimmedHeads;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} timeRange
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)[]}
 */
  trimToRange(
    timeRange: ITimeRange,
    iterating: boolean = false
  ): (VertexNode<TrackPoint, TrackSegment> | null)[] {
    const trimmedHeads = this._polylineTrack.trimToTimeRange(timeRange);

    if (!iterating && trimmedHeads.length) {
      this.updateGeoJsonTrack(!!trimmedHeads);
    }
    return trimmedHeads;
  }

  // === Remove Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)}
 */
  removeAt(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    iterating: boolean = false
  ): VertexNode<TrackPoint, TrackSegment> | null {

    let removedPoint: VertexNode<TrackPoint, TrackSegment>;
    if (typeof target === 'string') {
      removedPoint = this._polylineTrack.removeAtTime(target);
    } else if (VertexNode.isVertexNode(target)) {
      removedPoint = this._polylineTrack.removeAt(target as VertexNode<TrackPoint, TrackSegment>);
    } else {
      removedPoint = this._polylineTrack.removeAtPoint(target as IPointProperties);
    }

    if (!iterating) {
      this.updateGeoJsonTrack(!!removedPoint);
    }
    return removedPoint;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string[] | IPointProperties[] | VertexNode<TrackPoint, TrackSegment>[])} targets
 * @param {boolean} [iterating=false]
 * @returns {VertexNode<TrackPoint, TrackSegment>[]}
 */
  removeAtAny(
    targets: string[] | IPointProperties[] | VertexNode<TrackPoint, TrackSegment>[],
    iterating: boolean = false
  ): VertexNode<TrackPoint, TrackSegment>[] {

    let removedPoints: VertexNode<TrackPoint, TrackSegment>[];
    if (typeof targets[0] === 'string') {
      removedPoints = this._polylineTrack.removeAtAnyTime(targets as string[]);
    } else if (VertexNode.isVertexNode(targets[0])) {
      removedPoints = this._polylineTrack.removeAtAny(targets as VertexNode<TrackPoint, TrackSegment>[]);
    } else {
      removedPoints = this._polylineTrack.removeAtAnyPoint(targets as IPointProperties[]);
    }

    if (!iterating) {
      this.updateGeoJsonTrack(removedPoints.length);
    }
    return removedPoints;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)}
 */
  removeBetween(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    iterating: boolean = false
  ): VertexNode<TrackPoint, TrackSegment> | null {

    let removedHead: VertexNode<TrackPoint, TrackSegment>;
    if (typeof startPoint === 'string' && typeof endPoint === 'string') {
      removedHead = this._polylineTrack.removeBetweenTimes(startPoint, endPoint);
    } else if ((startPoint && VertexNode.isVertexNode(startPoint)) || (endPoint && VertexNode.isVertexNode(endPoint))) {
      removedHead = this._polylineTrack.removeBetween(
        startPoint as VertexNode<TrackPoint, TrackSegment>,
        endPoint as VertexNode<TrackPoint, TrackSegment>);
    } else {
      removedHead = this._polylineTrack.removeBetweenPoints(
        startPoint as IPointProperties,
        endPoint as IPointProperties);
    }

    if (!iterating) {
      this.updateGeoJsonTrack(!!removedHead);
    }
    return removedHead;
  }

  // TODO: Add/test convenience method?
  // removeBetweenRange()

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {boolean} [iterating=false]
 * @returns {(VertexNode<TrackPoint, TrackSegment> | null)}
 */
  removeFromTo(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    iterating: boolean = false
  ): VertexNode<TrackPoint, TrackSegment> | null {

    let removedHead: VertexNode<TrackPoint, TrackSegment>;
    if (typeof startPoint === 'string' && typeof endPoint === 'string') {
      removedHead = this._polylineTrack.removeFromToTimes(
        startPoint,
        endPoint
      );
    } else if ((startPoint && VertexNode.isVertexNode(startPoint)) || (endPoint && VertexNode.isVertexNode(endPoint))) {
      removedHead = this._polylineTrack.removeFromTo(
        startPoint as VertexNode<TrackPoint, TrackSegment>,
        endPoint as VertexNode<TrackPoint, TrackSegment>
      );
    } else {
      removedHead = this._polylineTrack.removeFromToPoints(
        startPoint as IPointProperties,
        endPoint as IPointProperties
      );
    }

    if (!iterating) {
      this.updateGeoJsonTrack(!!removedHead);
    }
    return removedHead;
  }

  // TODO: Add/test convenience method?
  // removeFromToRange()

  // ===== Update Methods =====
  // === Insert Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  prependTrack(
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {
    const numberAdded = this.prepend(track._polylineTrack, returnListCount, iterating);

    if (numberAdded) {
      track.clear();
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  prepend(
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {

    const numberAdded = this._polylineTrack.prepend(items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(numberAdded);
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  appendTrack(
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {
    const numberAdded = this.append(track._polylineTrack, returnListCount, iterating);

    if (numberAdded) {
      track.clear();
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  append(
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {

    const numberAdded = this._polylineTrack.append(items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(numberAdded);
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  insertTrackBefore(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {
    const numberAdded = this.insertBefore(target, track._polylineTrack, returnListCount, iterating);

    if (numberAdded) {
      track.clear();
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  insertBefore(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {

    const numberAdded = this.insertBeforeBase(target, items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(numberAdded);
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} item
 * @param {boolean} [returnListCount=false]
 * @returns {number}
 */
  protected insertBeforeBase(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    item: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): number {

    if (typeof target === 'string') {
      return this._polylineTrack.insertBeforeTime(
        target,
        item,
        returnListCount
      );
    } else if (VertexNode.isVertexNode(target)) {
      return this._polylineTrack.insertBefore(
        target as VertexNode<TrackPoint, TrackSegment>,
        item,
        returnListCount
      );
    } else {
      return this._polylineTrack.insertBeforePoint(
        target as IPointProperties,
        item,
        returnListCount
      );
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  insertTrackAfter(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {
    const numberAdded = this.insertAfter(target, track._polylineTrack, returnListCount, iterating);

    if (numberAdded) {
      track.clear();
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {number}
 */
  insertAfter(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): number {

    const numberAdded = this.insertAfterBase(target, items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(numberAdded);
    }

    return numberAdded;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} item
 * @param {boolean} [returnListCount=false]
 * @returns {number}
 */
  protected insertAfterBase(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    item: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): number {

    if (typeof target === 'string') {
      return this._polylineTrack.insertAfterTime(
        target,
        item,
        returnListCount
      );
    } else if (VertexNode.isVertexNode(target)) {
      return this._polylineTrack.insertAfter(
        target as VertexNode<TrackPoint, TrackSegment>,
        item,
        returnListCount
      );
    } else {
      return this._polylineTrack.insertAfterPoint(
        target as IPointProperties,
        item,
        returnListCount
      );
    }
  }

  // === Replace Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  replaceWithTrackAt(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {
    const replaceResult = this.replaceAt(target, track._polylineTrack, returnListCount, iterating);

    if (replaceResult) {
      track.clear();
    }

    return replaceResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  replaceAt(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {

    const replaceResult = this.replaceAtBase(target, items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(this.replaceChangedTrack(replaceResult));
    }

    return replaceResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} item
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  protected replaceAtBase(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    item: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {
    if (typeof target === 'string') {
      return this._polylineTrack.replaceAtTime(
        target,
        item,
        returnListCount
      );
    } else if (VertexNode.isVertexNode(target)) {
      return this._polylineTrack.replaceAt(
        target as VertexNode<TrackPoint, TrackSegment>,
        item,
        returnListCount
      );
    } else {
      return this._polylineTrack.replaceAtPoint(
        target as IPointProperties,
        item,
        returnListCount
      );
    }
  }

  // TODO: Add/test convenience method?
  // replaceWithTrackBetweenRange()

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  replaceWithTrackBetween(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {
    const replaceResult = this.replaceBetween(startPoint, endPoint, track._polylineTrack, returnListCount, iterating);

    if (replaceResult) {
      track.clear();
    }

    return replaceResult;
  }

  // TODO: Add/test convenience method?
  // replaceBetweenRange()

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  replaceBetween(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {

    const replaceResult = this.replaceBetweenBase(startPoint, endPoint, items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(this.replaceChangedTrack(replaceResult));
    }

    return replaceResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} item
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  protected replaceBetweenBase(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    item: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {

    if (typeof startPoint === 'string' && typeof endPoint === 'string') {
      return this._polylineTrack.replaceBetweenTimes(
        startPoint,
        endPoint,
        item,
        returnListCount
      );
    } else if ((startPoint && VertexNode.isVertexNode(startPoint)) || (endPoint && VertexNode.isVertexNode(endPoint))) {
      return this._polylineTrack.replaceBetween(
        startPoint as VertexNode<TrackPoint, TrackSegment>,
        endPoint as VertexNode<TrackPoint, TrackSegment>,
        item,
        returnListCount
      );
    } else {
      return this._polylineTrack.replaceBetweenPoints(
        startPoint as IPointProperties,
        endPoint as IPointProperties,
        item,
        returnListCount
      );
    }
  }

  // TODO: Add/test convenience method?
  // replaceWithTrackFromToRange()

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {Track} track
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  replaceWithTrackFromTo(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    track: Track,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {
    const replaceResult = this.replaceFromTo(startPoint, endPoint, track._polylineTrack, returnListCount, iterating);

    if (replaceResult) {
      track.clear();
    }

    return replaceResult;
  }

  // TODO: Add/test convenience method?
  // replaceFromToRange()

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @param {boolean} [iterating=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  replaceFromTo(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    items: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false,
    iterating: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {

    const replaceResult = this.replaceFromToBase(startPoint, endPoint, items, returnListCount);

    if (!iterating) {
      this.updateGeoJsonTrack(this.replaceChangedTrack(replaceResult));
    }

    return replaceResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} startPoint
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} endPoint
 * @param {(TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} item
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: VertexNode<TrackPoint, TrackSegment>,
 *     inserted: number
 *   } | null)\}
 */
  protected replaceFromToBase(
    startPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    endPoint: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>,
    item: TrackPoint | TrackPoint[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TrackPoint, TrackSegment>,
    inserted: number
  } | null {

    if (typeof startPoint === 'string' && typeof endPoint === 'string') {
      return this._polylineTrack.replaceFromToTimes(
        startPoint,
        endPoint,
        item,
        returnListCount
      );
    } else if ((startPoint && VertexNode.isVertexNode(startPoint)) || (endPoint && VertexNode.isVertexNode(endPoint))) {
      return this._polylineTrack.replaceFromTo(
        startPoint as VertexNode<TrackPoint, TrackSegment>,
        endPoint as VertexNode<TrackPoint, TrackSegment>,
        item,
        returnListCount
      );
    } else {
      return this._polylineTrack.replaceFromToPoints(
        startPoint as IPointProperties,
        endPoint as IPointProperties,
        item,
        returnListCount
      );
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {({
 *       removed: VertexNode<TrackPoint, TrackSegment>,
 *       inserted: number
 *     } | null)} replaceResult
 * @returns {number\}
 */
  protected replaceChangedTrack(
    replaceResult: {
      removed: VertexNode<TrackPoint, TrackSegment>,
      inserted: number
    } | null) {

    if (replaceResult) {
      const removedCount = replaceResult.removed ? 1 : 0;
      return removedCount + replaceResult.inserted;
    } else {
      return 0;
    }
  }

  // ===== Split Methods =====
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | IPointProperties | VertexNode<TrackPoint, TrackSegment>)} target
 * @returns {Track[]}
 */
  splitBy(
    target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment>
  ): Track[] {
    let splitResult: PolylineTrack[];

    if (typeof target === 'string') {
      splitResult = this._polylineTrack.splitByTime(target);
    } else if (VertexNode.isVertexNode(target)) {
      splitResult = this._polylineTrack.splitBy(target as VertexNode<TrackPoint, TrackSegment>) as PolylineTrack[];
    } else {
      splitResult = this._polylineTrack.splitByPoint(target as IPointProperties) as PolylineTrack[];
    }

    const splitTracks = splitResult.map((polylineTrack) =>
      Track.fromPolyline(polylineTrack)
    );

    return splitTracks;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string[] | IPointProperties[] | VertexNode<TrackPoint, TrackSegment>[])} targets
 * @returns {Track[]}
 */
  splitByMany(
    targets: string[] | IPointProperties[] | VertexNode<TrackPoint, TrackSegment>[]
  ): Track[] {
    let splitResult: PolylineTrack[];

    if (typeof targets[0] === 'string') {
      splitResult = this._polylineTrack.splitByTimes(targets as string[]);
    } else if (VertexNode.isVertexNode(targets[0])) {
      splitResult = this._polylineTrack.splitByMany(targets as VertexNode<TrackPoint, TrackSegment>[]) as PolylineTrack[];
    } else {
      splitResult = this._polylineTrack.splitByPoints(targets as IPointProperties[]) as PolylineTrack[];
    }

    const splitTracks = splitResult.map((polylineTrack) =>
      Track.fromPolyline(polylineTrack)
    );

    return splitTracks;
  }

  // === ISplittable
  // TODO: Remove when doing split ticket, working from CruftManager on down.
  //    This can be handled in other/better ways
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @returns {(Track | undefined)}
 */
  splitToSegment(segment: ITimeRange): Track | undefined {
    const splitSegments = this.splitByTimes([segment.startTime, segment.endTime]);

    return this.addSplittingSegment(segment, splitSegments)[0];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {string[]} timestampsSplit
 * @returns {Track[]}
 */
  protected splitByTimes(timestampsSplit: string[]): Track[] {
    const trackLayers: Track[] = [];

    const segmentsData = this.getSegmentsSplitByTimes(timestampsSplit);
    if (segmentsData.length === 1) {
      return [];
    }

    segmentsData.forEach((segmentData) => {
      trackLayers.push(this.copyBySegment(segmentData));
    });

    return trackLayers;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {ITimeRange} segment
 * @param {Track[]} splitSegments
 * @returns {Track[]}
 */
  protected addSplittingSegment(
    segment: ITimeRange,
    splitSegments: Track[]
  ): Track[] {
    const tracks: Track[] = [];
    for (const splitSegment of splitSegments) {
      const times = splitSegment.timestamps();

      if (this.isTargetSplitSegment(times, segment)) {
        tracks.push(splitSegment);
      }
    }
    return tracks;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {string[]} times
 * @param {ITimeRange} segment
 * @returns {boolean}
 */
  protected isTargetSplitSegment(times: string[], segment: ITimeRange): boolean {
    return (times[0] === segment.startTime
      || times[times.length] === segment.endTime);
  }

  // === Static Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {VertexNode<TrackPoint, TrackSegment>[]} nodes
 * @returns {TrackPoint[]}
 */
  static nodesToTrackPoints(nodes: VertexNode<TrackPoint, TrackSegment>[]): TrackPoint[] {
    return nodes.flatMap((node) => Track.nodeHeadToTrackPoints(node));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {VertexNode<TrackPoint, TrackSegment>} node
 * @returns {TrackPoint[]}
 */
  static nodeHeadToTrackPoints(node: VertexNode<TrackPoint, TrackSegment>): TrackPoint[] {
    const trackPoints = [];
    let currNode = node;
    while (currNode) {
      trackPoints.push(currNode.val);
      currNode = currNode.next as VertexNode<TrackPoint, TrackSegment>;
    }
    return trackPoints;
  }
}