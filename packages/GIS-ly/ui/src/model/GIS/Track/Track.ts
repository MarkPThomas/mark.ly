// import { ElevationRequestApi } from '../../elevationDataApi';
import { ElevationRequestApi } from '../../../../../server/api/elevationDataApi';

import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import { FeatureCollection } from '../../GeoJSON';
import { CoordinateNode, SegmentNode } from '../../Geometry/Polyline';
import { GeoJsonManager } from '../GeoJsonManager';

import { ITrimmable } from './ITrimmable';
import { IQuery } from './IQuery';
import { ISplittable } from './ISplittable';

import { TrackPoint } from './TrackPoint';
import { ITrackSegmentLimits, TrackSegment, TrackSegmentData } from './TrackSegment';
import { TimeStamp } from './TimeStamp';
import { GeoJsonTrack } from './GeoJsonTrack';
import { PolylineTrack } from './PolylineTrack';
import { TrackBoundingBox } from './TrackBoundingBox';


export type EvaluatorArgs = { [name: string]: number };

export interface ITrack
  extends
  ITrimmable,
  ISplittable<Track>,
  IQuery,
  ICloneable<Track>,
  IEquatable<Track> {

  name: string;
  time: string;

  firstPoint: CoordinateNode<TrackPoint, TrackSegment>;
  firstSegment: SegmentNode<TrackPoint, TrackSegment>;
  lastPoint: CoordinateNode<TrackPoint, TrackSegment>;
  lastSegment: SegmentNode<TrackPoint, TrackSegment>;

  boundingBox(): TrackBoundingBox;

  trackPoints(): TrackPoint[];
  trackSegments(): TrackSegment[];

  // trackPointsByLimits(segment: ITrackSegmentLimits): TrackPoint[];
  // trackSegmentsByLimits(segment: ITrackSegmentLimits): TrackSegment[];

  addProperties(): void;
  addElevationProperties(): void;

  // updateBySegment(segData: TrackSegmentData): void;
  // extractBySegment for below?
  copyBySegment(segData: TrackSegmentData): Track;

  getNodesByTime(timestamp: string): CoordinateNode<TrackPoint, TrackSegment>[];

  getNodesBy(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
  ): CoordinateNode<TrackPoint, TrackSegment>[];
  // getPointsBy(target, evaluator<CoordType>): TrackPoint[]

  removeNodes(nodes: CoordinateNode<TrackPoint, TrackSegment>[]): number;
  // removePoints(points: TrackPoint[]) or removePoints(timestamps: string[])

  insertNodesBefore(
    node: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;

  insertNodesAfter(
    node: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;

  replaceCoordsBetween(
    lastTimestamp: string,
    nextTimestamp: string,
    coords: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;

  replaceNodesBetween(
    startNode: CoordinateNode<TrackPoint, TrackSegment>,
    endNode: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number

  replaceNodesFromTo(
    startNode: CoordinateNode<TrackPoint, TrackSegment>,
    endNode: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;
  //^^ insertTrackPoints(lastTimestamp, nextTimestamp, [smoothedPauseTrkPt, smoothedResumeTrkPt])

  // splitAt
}

// TODO: Finish refactor
// TODO: Current uses of 'clip' and similar methods is on GeoJsonTrack with SegmentData.
//      May be better instead to call these on the PolylineTrack with ITrackSegmentLimits
// TODO: Smooth & other managers interact with this class.
//  Calls are delegated appropriately to the correspind child track
//  Background geoJson is automatically updates when specified
//  New values/objects can be returned
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
    return this._polylineTrack.firstPoint;
  }

  get firstSegment() {
    return this._polylineTrack.firstSegment;
  }

  get lastPoint() {
    return this._polylineTrack.lastPoint;
  }

  get lastSegment() {
    return this._polylineTrack.lastSegment;
  }

  boundingBox(): TrackBoundingBox {
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


  getNodesByTime(timestamp: string): CoordinateNode<TrackPoint, TrackSegment>[] {
    return this._polylineTrack.getNodes(
      timestamp,
      (timestamp: string, coord: CoordinateNode<TrackPoint, TrackSegment>) => coord.val.timestamp === timestamp
    );
  }

  getNodesBy(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
  ): CoordinateNode<TrackPoint, TrackSegment>[] {
    return this._polylineTrack.getNodes(target, evaluator);
  }


  protected updateGeoJsonTrack(numberAffected: number) {
    if (numberAffected) {
      const trackPoints = this._polylineTrack.vertices();
      this._geoJsonTrack.updateGeoJsonTrackFromTrackPoints(trackPoints);
    }
  }

  removeNodes(nodes: CoordinateNode<TrackPoint, TrackSegment>[]): number {
    const numberRemoved = this._polylineTrack.removeNodes(nodes);

    // TODO: Should this be called here?
    //    The method is called repeatedly for smooth operations when iterate = true
    //    Perhaps a suppression flag is added here, whereby the GeoJson can be manually updated once at the end
    //    The same may apply to any modification operation.
    this.updateGeoJsonTrack(numberRemoved);

    return numberRemoved;
  }


  insertNodesBefore(
    node: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number {
    const numberInserted = this._polylineTrack.insertNodesBefore(node, nodes);

    this.updateGeoJsonTrack(numberInserted);

    return numberInserted;
  }

  insertNodesAfter(
    node: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number {
    const numberInserted = this._polylineTrack.insertNodesAfter(node, nodes);

    this.updateGeoJsonTrack(numberInserted);

    return numberInserted;
  }


  replaceCoordsBetween(lastTimestamp: string, nextTimestamp: string, coords: CoordinateNode<TrackPoint, TrackSegment>[]): number {
    const startNode = this.getNodesByTime(lastTimestamp)[0];
    const endNode = this.getNodesByTime(nextTimestamp)[0];

    const numberInserted = this._polylineTrack.replaceNodesBetween(startNode, endNode, coords);

    this.updateGeoJsonTrack(numberInserted);

    return numberInserted;
  }

  replaceNodesBetween(
    startNode: CoordinateNode<TrackPoint, TrackSegment>,
    endNode: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number {
    const numberInserted = this._polylineTrack.replaceNodesBetween(startNode, endNode, nodes);

    this.updateGeoJsonTrack(numberInserted);

    return numberInserted;
  }

  replaceNodesFromTo(
    startNode: CoordinateNode<TrackPoint, TrackSegment>,
    endNode: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number {
    const numberInserted = this._polylineTrack.replaceNodesFromTo(startNode, endNode, nodes);

    this.updateGeoJsonTrack(numberInserted);

    return numberInserted;
  }

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
    track._geoJsonTrack.copyBySegmentData(segData);

    const timestamps = segData.segTimestamps;
    const startTime = timestamps[0];
    const endTime = timestamps[timestamps.length];
    track._polylineTrack.copyRangeByTimestamp(startTime, endTime);

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


  // === IClippable
  // TODO: These might be better on the Polyline and then updating the geoJson collection object
  trimBeforeTime(timestamp: string) {
    const segmentData = this.getSegmentBeforeTime(timestamp);

    return this.updateBySegment(segmentData);
  }

  trimAfterTime(timestamp: string) {
    const segmentData = this.getSegmentAfterTime(timestamp);

    return this.updateBySegment(segmentData);
  }

  trimByTimes(timestampStart: string, timestampEnd: string) {
    const segmentData = this.getSegmentBetweenTimes(timestampStart, timestampEnd);

    return this.updateBySegment(segmentData);
  }


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

  splitToSegment(segment: ITrackSegmentLimits): Track | undefined {
    const splitSegments = this.splitByTimes([segment.startTime, segment.endTime]);

    return this.addSplittingSegment(segment, splitSegments)[0];
  }

  protected addSplittingSegment(
    segment: ITrackSegmentLimits,
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

  protected isTargetSplitSegment(times: string[], segment: ITrackSegmentLimits): boolean {
    return (times[0] === segment.startTime
      || times[times.length] === segment.endTime);
  }

  splitBySegments(segmentLimits: ITrackSegmentLimits[]): Track[] {
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
  static nodesToTrackPoints(nodes: CoordinateNode<TrackPoint, TrackSegment>[]): TrackPoint[] {
    return nodes.map((node) => node.val);
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
//   extends Polyline<TrackPoint, TrackSegment>
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