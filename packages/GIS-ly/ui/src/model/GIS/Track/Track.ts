import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import { FeatureCollection, Point } from '../../GeoJSON';
import { VertexNode, SegmentNode } from '../../Geometry';
import { GeoJsonManager } from '../GeoJsonManager';

import { ITrimmable } from './ITrimmable';
import { IQuery } from './IQuery';
import { ISplittable } from './ISplittable';

import { TrackPoint } from './TrackPoint';
import { TrackSegment, TrackSegmentData } from './TrackSegment';
import { ITimeRange } from './TimeRange';
import { GeoJsonTrack } from './GeoJsonTrack';
import { PolylineTrack } from './PolylineTrack';
import { BoundingBox } from '../BoundingBox';
import { IPointProperties } from '../Point/Point';


export type EvaluatorArgs = { [name: string]: number };

export interface ITrack
  extends
  IQuery,
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
}

export class Track implements ITrack {
  private _geoJsonTrack: GeoJsonTrack;
  private _polylineTrack: PolylineTrack;

  get name(): string {
    return this._geoJsonTrack.trackMetaData.name;
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

  static fromTrackPoints(trkPts: TrackPoint[]): Track {
    const track = new Track();

    const featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trkPts);

    track._geoJsonTrack = new GeoJsonTrack(featureCollection);
    track._polylineTrack = new PolylineTrack(trkPts);

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

  addProperties() {
    this._polylineTrack.addProperties();
  }

  addElevationProperties() {
    this._polylineTrack.addElevationProperties();
  }

  addElevations(elevations: Map<string, number>) {
    this._polylineTrack.addElevations(elevations);
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


  updateGeoJsonTrack(trackChanged: boolean | number, mergedItem: any = null) {
    if (trackChanged) {
      const trackPoints = this._polylineTrack.vertices();
      this._geoJsonTrack.updateGeoJsonTrackFromTrackPoints(trackPoints);
    }
  }


  // insertNodesBefore(
  //   node: VertexNode<TrackPoint, TrackSegment>,
  //   nodes: VertexNode<TrackPoint, TrackSegment>[]
  // ): number {
  //   const numberInserted = this._polylineTrack.insertBefore(node, nodes);

  //   this.updateGeoJsonTrack(numberInserted);

  //   return numberInserted;
  // }

  // insertNodesAfter(
  //   node: VertexNode<TrackPoint, TrackSegment>,
  //   nodes: VertexNode<TrackPoint, TrackSegment>[]
  // ): number {
  //   const numberInserted = this._polylineTrack.insertAfter(node, nodes);

  //   this.updateGeoJsonTrack(numberInserted);

  //   return numberInserted;
  // }


  // replaceCoordsBetween(
  //   lastTimestamp: string,
  //   nextTimestamp: string,
  //   coords: VertexNode<TrackPoint, TrackSegment>[],
  //   iterating: boolean = false
  // ): {
  //   removed: VertexNode<TrackPoint, TrackSegment>;
  //   inserted: number;
  // } {
  //   const startNode = this.vertexNodeByTime(lastTimestamp)[0];
  //   const endNode = this.vertexNodeByTime(nextTimestamp)[0];

  //   const results = this._polylineTrack.replaceBetween(startNode, endNode, coords);

  //   const resultsCount = results.inserted + (results.removed ? 1 : 0);
  //   if (!iterating) {
  //     this.updateGeoJsonTrack(resultsCount);
  //   }

  //   return results;
  // }

  // replacePointsBetween(
  //   startPoint: VertexNode<TrackPoint, TrackSegment>,
  //   endPoint: VertexNode<TrackPoint, TrackSegment>,
  //   points: VertexNode<TrackPoint, TrackSegment>[],
  //   iterating: boolean = false
  // ): {
  //   removed: VertexNode<TrackPoint, TrackSegment>;
  //   inserted: number;
  // } {
  //   const results = this._polylineTrack.replaceBetween(startPoint, endPoint, points);

  //   const resultsCount = results.inserted + (results.removed ? 1 : 0);
  //   if (!iterating) {
  //     this.updateGeoJsonTrack(resultsCount);
  //   }

  //   return results;
  // }

  // replaceNodesFromTo(
  //   startNode: VertexNode<TrackPoint, TrackSegment>,
  //   endNode: VertexNode<TrackPoint, TrackSegment>,
  //   nodes: VertexNode<TrackPoint, TrackSegment>[],
  //   iterating: boolean = false
  // ): {
  //   removed: VertexNode<TrackPoint, TrackSegment>;
  //   inserted: number;
  // } {
  //   const results = this._polylineTrack.replaceFromTo(startNode, endNode, nodes);

  //   const resultsCount = results.inserted + (results.removed ? 1 : 0);
  //   if (!iterating) {
  //     this.updateGeoJsonTrack(resultsCount);
  //   }

  //   return results;
  // }

  // TODO: This could potentially be made private/protected
  updateBySegment(segment: TrackSegmentData): void {
    this.updateGivenTrack(segment, this);
  }

  copyBySegment(segment: TrackSegmentData): Track {
    const track = new Track();
    return this.updateGivenTrack(segment, track);
  }

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
  getSegmentBeforeTime(timestamp: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentBeforeTime(timestamp);
  }

  getSegmentAfterTime(timestamp: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentAfterTime(timestamp);
  }

  getSegmentBetweenTimes(timestampStart: string, timestampEnd: string): TrackSegmentData {
    return this._geoJsonTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);
  }

  getSegmentsSplitByTimes(timestampsSplit: string[]): TrackSegmentData[] {
    return this._geoJsonTrack.getSegmentsSplitByTimes(timestampsSplit);
  }

  // ===== Remove Methods =====
  // === Trim Methods ===

  // === ITrimmable
  // // TODO: These might be better on the Polyline and then updating the geoJson collection object
  // trimBeforeTime(timestamp: string) {
  //   const trimmedHead = this._polylineTrack.trimBeforeTime(timestamp); // O(1) time
  //   if (trimmedHead) {
  //     const trackPoints = this._polylineTrack.vertices(); // O(N) time
  //     this._geoJsonTrack.updateGeoJsonTrackFromTrackPoints(trackPoints); // O(N) time?
  //   }
  // }

  // trimAfterTime(timestamp: string) {
  //   const segmentData = this.getSegmentAfterTime(timestamp);

  //   return this.updateBySegment(segmentData);
  // }

  // trimByTimes(timestampStart: string, timestampEnd: string) {
  //   const segmentData = this.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //   return this.updateBySegment(segmentData);
  // }

  // trimToTimeSegment(segment: ITimeRange): number {
  //   const numberTrimmed = this._polylineTrack.trimToTimeRange(segment);

  //   this.updateGeoJsonTrack(numberTrimmed.length);

  //   return numberTrimmed.length;
  // }

  // trimToPoints(
  //   startPoint: VertexNode<TrackPoint, TrackSegment>,
  //   endPoint: VertexNode<TrackPoint, TrackSegment>
  // ): number {
  //   const numberTrimmed = this._polylineTrack.trimTo(startPoint, endPoint);

  //   this.updateGeoJsonTrack(numberTrimmed.length);

  //   return numberTrimmed.length;
  // }

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
      this.updateGeoJsonTrack(numberAdded, items);
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
      this.updateGeoJsonTrack(numberAdded, items);
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
      this.updateGeoJsonTrack(numberAdded, items);
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
      this.updateGeoJsonTrack(numberAdded, items);
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
      this.updateGeoJsonTrack(this.replaceChangedTrack(replaceResult), items);
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
      this.updateGeoJsonTrack(this.replaceChangedTrack(replaceResult), items);
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
      this.updateGeoJsonTrack(this.replaceChangedTrack(replaceResult), items);
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
  // splitBy(
  //   target: string | IPointProperties | VertexNode<TrackPoint, TrackSegment> | Track,
  //   iterating: boolean = false
  // ): Track[] {
  //   let splitResult: PolylineTrack[];

  //   if (typeof target === 'string') {
  //     splitResult = this._polylineTrack.splitByTime(target);
  //   } else if (VertexNode.isVertexNode(target)) {
  //     splitResult = this._polylineTrack.splitBy(target as VertexNode<TrackPoint, TrackSegment>);
  //   } else {
  //     splitResult = this._polylineTrack.splitByPoint(target as IPointProperties);
  //   }

  //   if (!iterating) {
  //     this.updateGeoJsonTrack(splitResult.length);
  //   }
  //   return splitResult as PolylineTrack[];
  // }

  // splitByMany(
  //   targets: string[] | IPointProperties[] | VertexNode<TrackPoint, TrackSegment>[] | Track[],
  //   iterating: boolean = false
  // ): Track[] {
  //   let splitResult: PolylineTrack[];

  //   if (typeof target === 'string') {
  //     splitResult = this._polylineTrack.splitByManyTime(targets);
  //   } else if (VertexNode.isVertexNode(targets[0])) {
  //     splitResult = this._polylineTrack.splitByMany(targets as VertexNode<TrackPoint, TrackSegment>[]);
  //   } else {
  //     splitResult = this._polylineTrack.splitByManyPoint(targets as IPointProperties[]);
  //   }

  //   if (!iterating) {
  //     this.updateGeoJsonTrack(splitResult.length);
  //   }
  //   return splitResult as PolylineTrack[];
  // }

  // === ISplittable
  // TODO: These might be better on the Polyline and then updating the geoJson collection object
  // TODO: Still need to implement these, decide how to do in polyline,
  // e.g. using hashmap node from timestamp here
  splitByTimes(timestampsSplit: string[]): Track[] {
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

  splitToSegment(segment: ITimeRange): Track | undefined {
    const splitSegments = this.splitByTimes([segment.startTime, segment.endTime]);

    return this.addSplittingSegment(segment, splitSegments)[0];
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

  splitBySegments(segmentLimits: ITimeRange[]): Track[] {
    throw new Error();

    // const splitTimes = [];
    // for (const segment of segmentLimits) {
    //   splitTimes.push(segment.startTime);
    //   splitTimes.push(segment.endTime);
    // }

    // const splitSegments = this.splitByTimes(splitTimes);

    // const tracks: FeatureCollection[] = this.addSplittedSegments(segmentLimits, splitSegments);

    // const finalTracks = this.trimSingleSegmentSegments(tracks);

    // return finalTracks.length ? finalTracks : [this._geoJson.clone()];
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



// export type SegmentLimits = {
//   startCoord: TrackPoint,
//   endCoord: TrackPoint | null
// };

// export interface ITrack extends IPolyline<TrackPoint, TrackSegment> {
//   // Properties Methods
//   firstPoint: CoordinateNode<TrackPoint, TrackSegment>;
//   firstSegment: SegmentNode<TrackPoint, TrackSegment>;

//   /**
//    * Adds derived properties to {@link TrackSegment}s and {@link TrackPoint}s based on initial properties in the {@link TrackPoint}s.
//    *
//    * @memberof ITrack
//    */
//   addProperties(): void;

//   /**
//    * Adds elevation data to the track for matching lat/long points.
//    *
//    * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
//    * form { lat: number, lng: number } as a JSON string.
//    * @memberof Track
//    */
//   addElevations(elevations: Map<string, number>): void;

//   /**
//    * Adds derived elevation properties to {@link TrackSegment}s and {@link TrackPoint}s based on elevation data in the {@link TrackPoint}s.
//    *
//    * @memberof ITrack
//    */
//   addElevationProperties(): void;

//   /**
//    * Queries an API to add mapped elevation data to the track.
//    *
//    * @memberof Track
//    */
//   addElevationsFromApi(): void;


//   // Methods
//   getNodes(
//     target: number | EvaluatorArgs,
//     evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
//   ): CoordinateNode<TrackPoint, TrackSegment>[];

//   getTrackSegmentBeforeCoord(coord: LatLngGPS);
//   getTrackSegmentAfterCoord(coord: LatLngGPS);
//   getTrackSegmentBetweenCoords(
//     coordStart: LatLngGPS,
//     coordEnd: LatLngGPS
//   );
//   getTrackSegmentsSplitByCoords(coords: LatLngGPS[]);

//   removeNodes(nodes: CoordinateNode<TrackPoint, TrackSegment>[]): number;

//   insertNodes(
//     tempHeadNode: CoordinateNode<TrackPoint, TrackSegment>,
//     tempTailNode: CoordinateNode<TrackPoint, TrackSegment>,
//     nodes: CoordinateNode<TrackPoint, TrackSegment>[]
//   ): number;
// }

// export class Track
//   extends PolylineTrack
//   implements ITrack {

//   get firstPoint() {
//     return this._points.getHead();
//   }

//   get firstSegment() {
//     return this._segments.getHead();
//   }

//   constructor(coords: TrackPoint[]) {
//     super(coords);
//   }

//   public addProperties() {
//     this.addPropertiesToNodes();
//   }

//   protected addPropertiesToNodes() {
//     this.addPropertiesToSegments();

//     let coord = this._points.getHead() as CoordinateNode<TrackPoint, TrackSegment>;
//     while (coord) {
//       this.addNodePropertiesFromPath(coord);

//       coord = coord.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }
//   }


//   public addElevations(elevations: Map<string, number>) {
//     this.addNodeElevations(elevations);
//     this.addSegmentElevationDataFromNodes();
//     this.addNodeElevationSpeedsFromSegments();
//   }

//   public addElevationProperties() {
//     this.addSegmentElevationDataFromNodes();
//     this.addNodeElevationSpeedsFromSegments();
//   }

//   public addElevationsFromApi() {
//     const coords = this._points.toArray();
//     const boundingBox = BoundingBox.fromPoints(coords);
//     console.log(`Getting elevations for ${coords.length} coords`);

//     const elevationsApi = new ElevationRequestApi();
//     elevationsApi.getElevations(coords, boundingBox)
//       // TODO: How does this work with requests 100 at a time?
//       .then((result) => {
//         if (result.elevations) {
//           console.log(`Received elevations for ${result.elevations.size} coords`);
//           console.log('Result: ', result);

//           this.addElevations(result.elevations);
//         } else {
//           console.log('No elevations received');
//         }
//       });
//   }

//   protected addNodeElevations(elevations: Map<string, number>) {
//     console.log('Adding elevations to points...')
//     let coord = this._points.getHead() as CoordinateNode<TrackPoint, TrackSegment>;
//     while (coord) {
//       const elevation = elevations.get(JSON.stringify({ lat: coord.val.lat, lng: coord.val.lng }));
//       if (elevation) {
//         coord.val.elevation = elevation;
//       }

//       coord = coord.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }
//   }

//   protected addSegmentElevationDataFromNodes() {
//     console.log('Deriving elevation data for segments...')
//     let coord = this._points.getHead()?.next as CoordinateNode<TrackPoint, TrackSegment>;
//     while (coord) {
//       const prevCoord = coord.prev as CoordinateNode<TrackPoint, TrackSegment>;
//       const prevSegment = prevCoord.nextSeg;

//       const elevationChange = TrackPoint.calcSegmentMappedElevationChange(prevCoord.val, coord.val);
//       if (elevationChange !== undefined) {
//         prevSegment.val.height = elevationChange;
//         const elevationSpeed = Track.calcSegmentMappedElevationSpeedMPS(prevSegment.val.height, prevSegment.val.duration);
//         prevSegment.val.heightRate = elevationSpeed;
//       }

//       coord = coord.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }
//   }

//   protected addNodeElevationSpeedsFromSegments() {
//     console.log('Deriving elevation data for points...')
//     let coord = this._points.getHead() as CoordinateNode<TrackPoint, TrackSegment>;
//     while (coord) {
//       if (coord.val.path) {
//         if (this.pointIsMaximaMinima(coord.prevSeg?.val, coord.nextSeg?.val)) {
//           if (coord.prevSeg?.val?.heightRate > 0) {
//             coord.val.path.ascentRate = coord.prevSeg.val.heightRate
//             coord.val.path.descentRate = Math.abs(coord.nextSeg.val.heightRate);
//           } else {
//             coord.val.path.ascentRate = coord.nextSeg.val.heightRate
//             coord.val.path.descentRate = Math.abs(coord.prevSeg.val.heightRate);
//           }
//         } else {
//           const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
//           if (elevationSpeed !== undefined && elevationSpeed > 0) {
//             coord.val.path.ascentRate = elevationSpeed;
//           } else if (elevationSpeed !== undefined && elevationSpeed < 0) {
//             coord.val.path.descentRate = Math.abs(elevationSpeed);
//           }
//         }
//       }

//       coord = coord.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }
//   }

//   protected pointIsMaximaMinima(segI: ITrackSegment, segJ: ITrackSegment): boolean {
//     return segI?.heightRate && segJ?.heightRate
//       ? Numbers.Sign(segI.heightRate) !== Numbers.Sign(segJ.heightRate)
//       : false;
//   }

//   protected addNodePropertiesFromPath(coord: CoordinateNode<TrackPoint, TrackSegment>) {
//     coord.val.speedAvg = TrackSegment.calcCoordAvgSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
//     coord.val.path = {
//       rotation: TrackSegment.calcPathRotationRad(coord.prevSeg?.val, coord.nextSeg?.val),
//       rotationRate: TrackSegment.calcPathAngularSpeedRadPerSec(coord.prevSeg?.val, coord.nextSeg?.val),
//       ascentRate: 0,
//       descentRate: 0
//     }
//   }

//   protected addPropertiesToSegments() {
//     let coord = this._points.getHead()?.next as CoordinateNode<TrackPoint, TrackSegment>;
//     while (coord) {
//       const prevCoord = coord.prev as CoordinateNode<TrackPoint, TrackSegment>;
//       this.addSegmentProperties(prevCoord, coord);

//       coord = coord.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }
//   }

//   protected addSegmentProperties(coordI: CoordinateNode<TrackPoint, TrackSegment>, coordJ: CoordinateNode<TrackPoint, TrackSegment>) {
//     const segment = new TrackSegment();

//     segment.length = TrackPoint.calcSegmentDistanceMeters(coordI.val, coordJ.val);
//     segment.angle = TrackPoint.calcSegmentAngleRad(coordI.val, coordJ.val);
//     segment.direction = TrackPoint.calcSegmentDirection(coordI.val, coordJ.val);
//     segment.duration = TimeStamp.calcIntervalSec(coordI.val.timestamp, coordJ.val.timestamp)
//     segment.speed = TrackPoint.calcSegmentSpeedMPS(coordI.val, coordJ.val);

//     // if (coordI.val.altExt && coordJ.val.altExt) {
//     //   segment.elevationChange = Track.calcSegmentElevationChange(coordI.val, coordJ.val);
//     //   segment.elevationRate = Track.calcSegmentElevationRateMPS(segment.elevationChange, segment.duration);
//     // }

//     coordI.nextSeg.val = segment;
//   }

//   public getNodes(
//     target: number | EvaluatorArgs,
//     evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
//   ): CoordinateNode<TrackPoint, TrackSegment>[] {
//     const nodes: CoordinateNode<TrackPoint, TrackSegment>[] = [];

//     let node = this._points.getHead() as CoordinateNode<TrackPoint, TrackSegment>;
//     while (node) {
//       if (evaluator(target, node)) {
//         nodes.push(node);
//       }

//       node = node.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }

//     return nodes;
//   }

//   public removeNodes(nodes: CoordinateNode<TrackPoint, TrackSegment>[]) {
//     let count = 0;

//     nodes.forEach((node) => {
//       if (this._points.remove(node)) {
//         count++;
//       }
//     });

//     this.updateTrack(count);

//     return count;
//   }

//   public splitAtNode(
//     target: number | EvaluatorArgs,
//     evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
//   ): [Track, Track] {
//     const nodes: CoordinateNode<TrackPoint, TrackSegment>[] = [];

//     let node = this._points.getHead() as CoordinateNode<TrackPoint, TrackSegment>;
//     while (node) {
//       if (evaluator(target, node)) {
//         const points = this._points.splitAt(node);
//         // list2 head set to clone of list1 tail, prev pointer set to null
//         // list1 tail set to node, next pointer set to null

//         const point1Tail = points[0].getTail();
//         const point2Head = points[1].getHead();

//         const prevSegment = point1Tail.prevSeg;
//         const nextSegment = point1Tail.nextSeg;

//         const segments = this._segments.splitBetween(point1Tail.prevSeg, point1Tail.nextSeg);

//         point1Tail.nextSeg = null;
//         point2Head.prevSeg = null;

//         segments[0].getTail()


//         return [track1, track2];
//       }

//       node = node.next as CoordinateNode<TrackPoint, TrackSegment>;
//     }

//     return [this, null];
//   }

//   public insertNodes(
//     tempHeadNode: CoordinateNode<TrackPoint, TrackSegment>,
//     tempTailNode: CoordinateNode<TrackPoint, TrackSegment>,
//     nodes: CoordinateNode<TrackPoint, TrackSegment>[]
//   ): number {
//     let count = 0;
//     if (tempHeadNode && tempTailNode) {
//       let priorNode = tempHeadNode as CoordinateNode<TrackPoint, TrackSegment>;
//       nodes.forEach((insertNode) => {
//         this._points.insertAfter(priorNode, insertNode);
//         priorNode = insertNode;
//         count++;
//       })
//     } else if (tempHeadNode) {
//       // End of track
//       this._points.insertAfter(tempHeadNode as CoordinateNode<TrackPoint, TrackSegment>, nodes[0]);
//       count++;
//     } else if (tempTailNode) {
//       // Start of track
//       this._points.insertBefore(tempTailNode as CoordinateNode<TrackPoint, TrackSegment>, nodes[nodes.length]);
//       count++;
//     } else {
//       throw new Error('No head or tail nodes within which to insert replacement cloud nodes!')
//     }

//     this.updateTrack(count);

//     return count;
//   }

//   protected updateTrack(numberNodesAffected: number) {
//     if (numberNodesAffected) {
//       // regenerate all segments
//       this.buildSegments();
//       //    optimize: replace segment
//       //     // coord.prevSeg
//       //     // coord.nextSeg

//       // update segment properties
//       this.addProperties();
//       //    optimize: update new segment properties and adjacent node properties
//     }
//   }

//   // === Get Functions
//   getTrackSegmentBeforeCoord(coord: LatLngGPS) {
//     let currentCoord = this._points.getHead() as CoordinateNode<TrackPoint, TrackSegment>;
//     while (currentCoord) {
//       if (evaluator(target, coord)) {
//         currentCoord.push(coord);
//       }

//       currentCoord = coord.currentCoord as CoordinateNode<TrackPoint, TrackSegment>;
//     }


//     const trackPoints = (geoJson.features[0].geometry as LineString).points;
//     const coordinateIndex = coordinatesIndexAt(coord, trackPoints);

//     if (coordinateIndex) {
//       const coordinatesSegment = trackPoints.slice(0, coordinateIndex + 1);
//       const timeStampsSegment: string[] = geoJson.features[0].properties?.coordinateProperties?.times.slice(0, coordinateIndex + 1);

//       return { coordinatesSegment, timeStampsSegment };
//     }
//   }

//   getTrackSegmentAfterCoord(coord: LatLngGPS) {
//     const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
//     const coordinateIndex = coordinatesIndexAt(coord, coordinates);

//     if (coordinateIndex) {
//       const coordinatesSegment = coordinates.slice(coordinateIndex);
//       const timeStampsSegment: string[] = geoJson.features[0].properties?.coordinateProperties?.times.slice(coordinateIndex);

//       return { coordinatesSegment, timeStampsSegment };
//     }
//   }

//   // Inclusive with coords
//   getTrackSegmentBetweenCoords(
//     coordStart: LatLngGPS,
//     coordEnd: LatLngGPS
//   ) {
//     const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
//     const coordinateStartIndex = coordinatesIndexAt(coordStart, coordinates);
//     const coordinateEndIndex = coordinatesIndexAt(coordEnd, coordinates);

//     if (coordinateStartIndex && coordinateEndIndex) {
//       const coordinatesSegment = coordinates.slice(coordinateStartIndex, coordinateEndIndex + 1);
//       const timeStampsSegment: string[] =
//         geoJson.features[0].properties?.coordinateProperties?.times.slice(coordinateStartIndex, coordinateEndIndex + 1);

//       return { coordinatesSegment, timeStampsSegment };
//     }
//   }

//   // Coord is duplicated between tracks, ignored if end coord. Coords assumed to be in order along track.
//   getTrackSegmentsSplitByCoords(coords: LatLngGPS[]) {
//     const coordinatesSegments = [];
//     const timeStampsSegments = [];

//     let coordinates = (geoJson.features[0].geometry as LineString).coordinates;
//     let timeStamps: string[] = geoJson.features[0].properties?.coordinateProperties?.times;
//     coords.forEach((coord) => {
//       const coordinateIndex = coordinatesIndexAt(coord, coordinates);
//       if (coordinateIndex && coordinateIndex < coordinates.length - 1) {
//         const segment = coordinates.slice(0, coordinateIndex + 1);
//         if (segment.length) {
//           coordinatesSegments.push(segment);
//           coordinates = coordinates.slice(coordinateIndex);


//           if (timeStamps) {
//             timeStampsSegments.push(timeStamps.slice(0, coordinateIndex + 1));
//             timeStamps = timeStamps.slice(coordinateIndex);
//           }
//         }
//       }
//     });
//     if (coordinates.length) {
//       coordinatesSegments.push(coordinates);
//       timeStampsSegments.push(timeStamps);
//     }

//     return { coordinatesSegments, timeStampsSegments };
//   }