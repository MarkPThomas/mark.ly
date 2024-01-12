import { ICloneable, IEquatable } from '../../../../../../../common/interfaces';

import { FeatureCollection } from '../../../GeoJSON';
import { VertexNode, SegmentNode, IPolylineSize } from '../../../Geometry/Polyline';
import { GeoJsonManager } from '../GeoJsonManager';

import { TrackPoint } from './TrackPoint';
import { TrackSegment, TrackSegmentData } from './TrackSegment';
import { ITimeRange } from '../Time/TimeRange';
import { GeoJsonTrack } from './GeoJsonTrack';
import { PolylineTrack } from './PolylineTrack';
import { BoundingBox } from '../BoundingBox';
import { IPointProperties } from '../Point/Point';
import { ITrackStats, TimeStats, TrackStats } from './Stats';


export type EvaluatorArgs = { [name: string]: number };

export interface IEditedTrackStats extends ITrackStats {
  size: IPolylineSize
}

export interface ITrack
  extends
  ICloneable<Track>,
  IEquatable<Track> {

  name: string;
  time: string;

  firstPoint: VertexNode<TrackPoint, TrackSegment>;
  firstSegment: SegmentNode<TrackPoint, TrackSegment>;
  lastPoint: VertexNode<TrackPoint, TrackSegment>;
  lastSegment: SegmentNode<TrackPoint, TrackSegment>;

  boundingBox(): BoundingBox;

  trackPoints(): TrackPoint[]; // TODO: Add optional overload to limit range by ITrackSegmentLimits
  trackSegments(): TrackSegment[]; // TODO: Add optional overload to limit range by ITrackSegmentLimits
  toJson();

  addProperties(): void;
  addElevationProperties(): void;

  // updateBySegment(segData: TrackSegmentData): void;
  copyBySegment(segData: TrackSegmentData): Track;

  vertexNodeByTime(timestamp: string): VertexNode<TrackPoint, TrackSegment> | null | undefined;
  vertexNodesByPoint(point: IPointProperties): VertexNode<TrackPoint, TrackSegment>[];
  vertexNodesBy(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): VertexNode<TrackPoint, TrackSegment>[];

  getStats(): IEditedTrackStats;
}

export class Track implements ITrack {
  private _geoJsonTrack: GeoJsonTrack;
  private _polylineTrack: PolylineTrack;

  get name(): string {
    return this._geoJsonTrack.trackMetaData.name;
  }
  set name(name: string) {
    name = name?.trim();
    if (name) {
      this._geoJsonTrack.trackMetaData.name = name;
    }
  }

  get time(): string {
    return this._geoJsonTrack.trackMetaData.time;
  }

  get firstPoint() {
    return this._polylineTrack.firstVertex;
  }

  get firstSegment() {
    return this._polylineTrack.firstSegment;
  }

  get lastPoint() {
    return this._polylineTrack.lastVertex;
  }

  get lastSegment() {
    return this._polylineTrack.lastSegment;
  }

  // TODO: Currently instantiates a new one each time.
  // Make this lazy?
  boundingBox(): BoundingBox {
    return this._geoJsonTrack.boundingBox();
  }

  // TODO: This class should be initialized & returned from GeoJsonManager as part of track merging process.
  //  This ensures that the FeatureCollection is always a single LineString
  //  Other option in that class is to return a set of Track classes, one for each LineString in a collection of LineStrings or MultiLineStrings
  protected constructor() { }

  static fromGeoJson(geoJson: FeatureCollection): Track {
    // TODO: Check/enforce single LineString collections - Perhaps derive new type?
    const track = new Track();

    track._geoJsonTrack = new GeoJsonTrack(geoJson);

    const trkPts = track._geoJsonTrack.trackPoints();
    track._polylineTrack = new PolylineTrack(trkPts);

    return track;
  }

  static fromPoints(trkPts: TrackPoint[], name?: string): Track {
    const track = new Track();

    const featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trkPts);

    track._geoJsonTrack = new GeoJsonTrack(featureCollection, name);
    track._polylineTrack = new PolylineTrack(trkPts);

    return track;
  }

  static fromPolyline(trkPolyline: PolylineTrack, name?: string) {
    const track = new Track();

    const featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trkPolyline.vertices());
    track._geoJsonTrack = new GeoJsonTrack(featureCollection, name);

    track._polylineTrack = trkPolyline;

    return track;
  }

  clone(): Track {
    const track = new Track();

    track._geoJsonTrack = this._geoJsonTrack.clone();
    track._polylineTrack = this._polylineTrack.clone();

    return track;
  }

  equals(track: Track): boolean {
    // Assumed that with polylineTrack acting as a proxy, it is always in sync with the geoJson track whenever outside sources may care
    return this._geoJsonTrack.equals(track._geoJsonTrack);
  }

  // Properties Methods
  addProperties() {
    this._polylineTrack.addProperties();
  }

  addElevationProperties() {
    this._polylineTrack.addElevationProperties();
  }

  addElevations(elevations: Map<string, number> | { [key: string]: number }) {
    this._polylineTrack.addElevations(elevations);
  }

  addElevationsFromApi() {
    this._polylineTrack.addElevationsFromApi();
  }

  timestamps(): string[] {
    return this.trackPoints().map((trackPoint) => trackPoint.timestamp);
  }

  trackPoints(): TrackPoint[] {
    return this._polylineTrack.vertices();
  }

  trackSegments(): TrackSegment[] {
    return this._polylineTrack.segments();
  }

  // TODO:
  // Currently this is a copy that is NOT hooked into the track.
  // Work out a reasonable & efficient way to maintain the hooked state while exposing
  //    the geoJSON object for external hooking.
  toJson() {
    return this._geoJsonTrack.toJson();
  }

  vertexNodeByTime(timestamp: string): VertexNode<TrackPoint, TrackSegment> | null | undefined {
    return this._polylineTrack.vertexNodeByTime(timestamp);
  }

  vertexNodesByPoint(point: IPointProperties): VertexNode<TrackPoint, TrackSegment>[] {
    return this._polylineTrack.vertexNodesByPoint(point);
  }

  vertexNodesBy(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean
  ): VertexNode<TrackPoint, TrackSegment>[] {
    return this._polylineTrack.vertexNodesBy(target, evaluator);
  }

  // === Property Methods

  getStats() {
    const size = this._polylineTrack.size();
    const trackStats = TrackStats.fromTrack(this._polylineTrack);
    const statsResults = trackStats.stats;

    return {
      size,
      ...statsResults
    }
  }

  getDuration() {
    const timeStats = new TimeStats();
    timeStats.of(this._polylineTrack);

    return timeStats.duration;
  }

  updateGeoJsonTrack(trackChanged: boolean | number) {
    if (trackChanged) {
      const trackPoints = this._polylineTrack.vertices();
      this._geoJsonTrack.updateFromTrackPoints(trackPoints);
    }
  }

  // TODO: Not used
  updateBySegment(segment: TrackSegmentData): void {
    this.updateGivenTrack(segment, this);
  }

  // TODO: Not used once Split feature finished
  copyBySegment(segment: TrackSegmentData): Track {
    const track = new Track();
    return this.updateGivenTrack(segment, track);
  }

  // TODO: Not used once Split feature finished
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
  getSegmentBeforeTime(timestamp: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentBeforeTime(timestamp);
  }

  // TODO: Not used
  getSegmentAfterTime(timestamp: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentAfterTime(timestamp);
  }

  // TODO: Not used
  getSegmentBetweenTimes(timestampStart: string, timestampEnd: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);
  }

  // TODO: Not used once Split feature finished
  getSegmentsSplitByTimes(timestampsSplit: string[]): TrackSegmentData[] {
    return this._geoJsonTrack.getSegmentsSplitByTimes(timestampsSplit);
  }

  // ===== Remove Methods =====
  // === Trim Methods ===
  clear() {
    this._geoJsonTrack = null;
    this._polylineTrack.clear();
  }

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
  splitToSegment(segment: ITimeRange): Track | undefined {
    const splitSegments = this.splitByTimes([segment.startTime, segment.endTime]);

    return this.addSplittingSegment(segment, splitSegments)[0];
  }

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

  protected isTargetSplitSegment(times: string[], segment: ITimeRange): boolean {
    return (times[0] === segment.startTime
      || times[times.length] === segment.endTime);
  }

  // === Static Methods ===
  static nodesToTrackPoints(nodes: VertexNode<TrackPoint, TrackSegment>[]): TrackPoint[] {
    return nodes.flatMap((node) => Track.nodeHeadToTrackPoints(node));
  }

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