import { Numbers } from '../../../../../../common/utils/math/Numbers';
import { ICloneable } from '../../../../../../common/interfaces';

import {
  LinkedListDoubleGeneric as List,
} from '../../../../../../common/utils/dataStructures';

import { BoundingBox } from '../../GeoJSON/BoundingBox';

import {
  CoordinateNode,
  IPolyline,
  Polyline,
  SegmentNode
} from '../../Geometry/Polyline';

// import { ElevationRequestApi } from '../../elevationDataApi';
import { ElevationRequestApi } from '../../../../../server/api/elevationDataApi';

import { IClippable } from './IClippable';
import { IQuery } from './IQuery';
import { ISplittable } from './ISplittable';

import { LatLngGPS, TrackPoint } from './TrackPoint';
import { ITrackSegment, ITrackSegmentLimits, TrackSegment, TrackSegmentData } from './TrackSegment';
import { TimeStamp } from './TimeStamp';


export type EvaluatorArgs = { [name: string]: number | string };

type CoordNode = CoordinateNode<TrackPoint, TrackSegment>;
type SegNode = SegmentNode<TrackPoint, TrackSegment>;

export interface IPolylineTrack
  extends
  IPolyline<TrackPoint, TrackSegment>,//,
  // IClippable,
  // ISplittable<PolylineTrack>,
  // IQuery,
  ICloneable<PolylineTrack> {

  // Properties Methods
  firstPoint: CoordinateNode<TrackPoint, TrackSegment>;
  firstSegment: SegmentNode<TrackPoint, TrackSegment>;

  /**
   * Adds derived properties to {@link TrackSegment}s and {@link TrackPoint}s based on initial properties in the {@link TrackPoint}s.
   *
   * @memberof ITrack
   */
  addProperties(): void;

  /**
   * Adds elevation data to the track for matching lat/long points.
   *
   * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
   * form { lat: number, lng: number } as a JSON string.
   * @memberof Track
   */
  addElevations(elevations: Map<string, number>): void;

  /**
   * Adds derived elevation properties to {@link TrackSegment}s and {@link TrackPoint}s based on elevation data in the {@link TrackPoint}s.
   *
   * @memberof ITrack
   */
  addElevationProperties(): void;

  /**
   * Queries an API to add mapped elevation data to the track.
   *
   * @memberof Track
   */
  addElevationsFromApi(): void;


  // Methods
  getNodes(
    target: string | number | EvaluatorArgs,
    evaluator: (target: string | number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
  ): CoordinateNode<TrackPoint, TrackSegment>[];

  removeNodes(nodes: CoordinateNode<TrackPoint, TrackSegment>[]): number;

  insertNodesBefore(
    node: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;

  insertNodesAfter(
    node: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;

  replaceNodesBetween(
    tempHeadNode: CoordinateNode<TrackPoint, TrackSegment>,
    tempTailNode: CoordinateNode<TrackPoint, TrackSegment>,
    nodes: CoordinateNode<TrackPoint, TrackSegment>[]
  ): number;



  // getSegmentBeforeTime(coord: LatLngGPS);
  // getSegmentAfterTime(coord: LatLngGPS);
  // getSegmentBetweenTimes(
  //   coordStart: LatLngGPS,
  //   coordEnd: LatLngGPS
  // );
  // getSegmentsSplitByTimes(coords: LatLngGPS[]);
}

export class PolylineTrack
  extends Polyline<TrackPoint, TrackSegment>
  implements IPolylineTrack {

  protected _pointsByTimestamp: Map<string, CoordNode>;

  get firstPoint() {
    return this._vertices.head;
  }

  get firstSegment() {
    return this._segments.head;
  }

  get lastPoint() {
    return this._vertices.tail;
  }

  get lastSegment() {
    return this._segments.tail;
  }

  constructor(coords: TrackPoint[]) {
    super(coords);

    this.generateTimestampMap();
  }

  generateTimestampMap() {
    this._pointsByTimestamp = new Map();
    let currNode = this._vertices.head;
    while (currNode) {
      this._pointsByTimestamp.set(currNode.val.timestamp, currNode);
      currNode = currNode.next as CoordNode;
    }
  }

  protected addNodesToMap(count: number, nodes: CoordNode[]) {
    if (count) {
      nodes.forEach((node) => {
        this._pointsByTimestamp.set(node.val.timestamp, node);
      })
    }
  }

  protected removeNodeFromMap(node: CoordNode) {
    this._pointsByTimestamp.delete(node.val.timestamp);
  }

  // TODO: handle Replace operations with Map.
  // May need to pass in a callback to separately handle removal vs. insertion.

  clone(): PolylineTrack {
    const polylineTrk = new PolylineTrack(this._vertices.toArray());

    // TODO: Iterate over segments and reassign properties

    return polylineTrk;
  }

  addProperties() {
    this.addPropertiesToNodes();
  }

  protected addPropertiesToNodes() {
    this.addPropertiesToSegments();

    let coord = this._vertices.head as CoordNode;
    while (coord) {
      this.addNodePropertiesFromPath(coord);

      coord = coord.next as CoordNode;
    }
  }

  /**
   * Adds elevation-derived properties from nodes to segments.
   * Adds further elevation-derived properties from segments back to nodes.
   *
   * Does nothing if nodes do not have elevation properties.
   *
   * @memberof PolylineTrack
   */
  addElevationProperties() {
    this.addSegmentElevationDataFromNodes();
    this.addNodeElevationSpeedsFromSegments();
  }


  addElevations(elevations: Map<string, number>) {
    this.addNodeElevations(elevations);
    this.addElevationProperties();
  }

  protected addNodeElevations(elevations: Map<string, number>) {
    console.log('Adding elevations to points...')
    let coord = this._vertices.head as CoordNode;
    while (coord) {
      const elevation = elevations.get(JSON.stringify({ lat: coord.val.lat, lng: coord.val.lng }));
      if (elevation) {
        coord.val.elevation = elevation;
      }

      coord = coord.next as CoordNode;
    }
  }

  addElevationsFromApi() {
    const coords = this._vertices.toArray();
    const boundingBox = BoundingBox.fromPoints(coords);
    console.log(`Getting elevations for ${coords.length} coords`);

    const elevationsApi = new ElevationRequestApi();
    elevationsApi.getElevations(coords, boundingBox)
      // TODO: How does this work with requests 100 at a time?
      .then((result) => {
        if (result.elevations) {
          console.log(`Received elevations for ${result.elevations.size} coords`);
          console.log('Result: ', result);

          this.addElevations(result.elevations);
        } else {
          console.log('No elevations received');
        }
      });
  }

  protected addSegmentElevationDataFromNodes() {
    console.log('Deriving elevation data for segments...')
    let coord = this._vertices.head?.next as CoordNode;
    while (coord) {
      const prevCoord = coord.prev as CoordNode;
      const prevSegment = prevCoord.nextSeg;

      const elevationChange = TrackPoint.calcSegmentMappedElevationChange(prevCoord.val, coord.val);
      if (elevationChange !== undefined) {
        prevSegment.val.height = elevationChange;
        const elevationSpeed = PolylineTrack.calcSegmentMappedElevationSpeedMPS(prevSegment.val.height, prevSegment.val.duration);
        prevSegment.val.heightRate = elevationSpeed;
      }

      coord = coord.next as CoordNode;
    }
  }

  protected addNodeElevationSpeedsFromSegments() {
    console.log('Deriving elevation data for points...')
    let coord = this._vertices.head as CoordNode;
    while (coord) {
      if (coord.val.path) {
        if (this.pointIsMaximaMinima(coord.prevSeg?.val, coord.nextSeg?.val)) {
          if (coord.prevSeg?.val?.heightRate > 0) {
            coord.val.path.ascentRate = coord.prevSeg.val.heightRate
            coord.val.path.descentRate = Math.abs(coord.nextSeg.val.heightRate);
          } else {
            coord.val.path.ascentRate = coord.nextSeg.val.heightRate
            coord.val.path.descentRate = Math.abs(coord.prevSeg.val.heightRate);
          }
        } else {
          const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
          if (elevationSpeed !== undefined && elevationSpeed > 0) {
            coord.val.path.ascentRate = elevationSpeed;
          } else if (elevationSpeed !== undefined && elevationSpeed < 0) {
            coord.val.path.descentRate = Math.abs(elevationSpeed);
          }
        }
      }

      coord = coord.next as CoordNode;
    }
  }

  protected pointIsMaximaMinima(segI: ITrackSegment, segJ: ITrackSegment): boolean {
    return segI?.heightRate && segJ?.heightRate
      ? Numbers.Sign(segI.heightRate) !== Numbers.Sign(segJ.heightRate)
      : false;
  }

  protected addNodePropertiesFromPath(coord: CoordNode) {
    coord.val.speedAvg = TrackSegment.calcCoordAvgSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
    coord.val.path = {
      rotation: TrackSegment.calcPathRotationRad(coord.prevSeg?.val, coord.nextSeg?.val),
      rotationRate: TrackSegment.calcPathAngularSpeedRadPerSec(coord.prevSeg?.val, coord.nextSeg?.val),
      ascentRate: 0,
      descentRate: 0
    }
  }

  // TODO: Consider initial generation vs. selective segment updating from changed coordinates
  protected addPropertiesToSegments() {
    let coord = this._vertices.head?.next as CoordNode;
    while (coord) {
      const prevCoord = coord.prev as CoordNode;
      this.addSegmentProperties(prevCoord, coord);

      coord = coord.next as CoordNode;
    }
  }

  protected addSegmentProperties(coordI: CoordNode, coordJ: CoordNode) {
    const segment = new TrackSegment();

    segment.length = TrackPoint.calcSegmentDistanceMeters(coordI.val, coordJ.val);
    segment.angle = TrackPoint.calcSegmentAngleRad(coordI.val, coordJ.val);
    segment.direction = TrackPoint.calcSegmentDirection(coordI.val, coordJ.val);
    segment.duration = TimeStamp.calcIntervalSec(coordI.val.timestamp, coordJ.val.timestamp)
    segment.speed = TrackPoint.calcSegmentSpeedMPS(coordI.val, coordJ.val);

    // if (coordI.val.altExt && coordJ.val.altExt) {
    //   segment.elevationChange = Track.calcSegmentElevationChange(coordI.val, coordJ.val);
    //   segment.elevationRate = Track.calcSegmentElevationRateMPS(segment.elevationChange, segment.duration);
    // }

    coordI.nextSeg.val = segment;
  }

  // === Consider moving these to PolyLine base class?
  getNodeByTimestamp(timestamp: string) {
    if (this._pointsByTimestamp) {
      // Use optimization
      if (this._pointsByTimestamp.has(timestamp)) {
        return this._pointsByTimestamp.get(timestamp);
      }
      return null;
    } else {
      return this.getNodes(
        timestamp,
        (timestamp: string, coord: CoordNode) => coord.val.timestamp === timestamp
      )[0]
    }
  }

  getNodes(
    target: string | number | EvaluatorArgs,
    evaluator: (target: string | number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
  ): CoordinateNode<TrackPoint, TrackSegment>[] {
    const nodes: CoordinateNode<TrackPoint, TrackSegment>[] = [];

    let node = this._vertices.head as CoordinateNode<TrackPoint, TrackSegment>;
    while (node) {
      if (evaluator(target, node)) {
        nodes.push(node);
      }

      node = node.next as CoordinateNode<TrackPoint, TrackSegment>;
    }

    return nodes;
  }

  removeNodes(nodes: CoordNode[]): number {
    let count = 0;

    nodes.forEach((node) => {
      if (this._vertices.remove(node)) {
        count++;
        this.removeNodeFromMap(node)
      }
    });

    this.updateTrack(count);

    return count;
  }

  insertNodesBefore(
    node: CoordNode,
    nodes: CoordNode[]
  ): number {
    const count = this._vertices.insertManyBefore(node, nodes);

    this.addNodesToMap(count, nodes);
    this.updateTrack(count);

    return count;
  }

  insertNodesAfter(
    node: CoordNode,
    nodes: CoordNode[]
  ): number {
    const count = this._vertices.insertManyAfter(node, nodes);

    this.addNodesToMap(count, nodes);
    this.updateTrack(count);

    return count;
  }

  // TODO: Remove?
  protected isSpecified(node: CoordNode) {
    return node !== undefined && node !== null;
  }

  replaceNodesBetween(
    startNode: CoordNode,
    endNode: CoordNode,
    nodes: CoordNode[]
  ): number {
    const results = this._vertices.replaceBetween(startNode, endNode, nodes);
    const nodesAffected = results.insertedCount + results.removedCount;

    this.updateTrack(nodesAffected);

    return nodesAffected;
  }

  replaceNodesFromTo(
    startNode: CoordNode,
    endNode: CoordNode,
    nodes: CoordNode[]
  ): number {
    const results = this._vertices.replaceFromTo(startNode, endNode, nodes);
    const nodesAffected = results.insertedCount + results.removedCount;

    this.updateTrack(nodesAffected);

    return nodesAffected;
  }

  // public splitAtNode(
  //   target: number | EvaluatorArgs,
  //   evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean
  // ): [PolylineTrack, PolylineTrack] {
  //   const nodes: CoordinateNode<TrackPoint, TrackSegment>[] = [];

  //   let node = this._points.head as CoordinateNode<TrackPoint, TrackSegment>;
  //   while (node) {
  //     if (evaluator(target, node)) {
  //       const points = this._points.splitAt(node);
  //       // list2 head set to clone of list1 tail, prev pointer set to null
  //       // list1 tail set to node, next pointer set to null

  //       const point1Tail = points[0].tail;
  //       const point2Head = points[1].head;

  //       const prevSegment = point1Tail.prevSeg;
  //       const nextSegment = point1Tail.nextSeg;

  //       const segments = this._segments.splitBetween(point1Tail.prevSeg, point1Tail.nextSeg);

  //       point1Tail.nextSeg = null;
  //       point2Head.prevSeg = null;

  //       segments[0].tail


  //       return [track1, track2];
  //     }

  //     node = node.next as CoordinateNode<TrackPoint, TrackSegment>;
  //   }

  //   return [this, null];
  // }

  // Redundant to protected update() below?

  copyRangeByTimestamp(startTime: string, endTime: string): PolylineTrack | null {
    let startNode = this.getNodeByTimestamp(startTime);

    if (!startNode) {
      startNode = this.firstPoint;
      if (!startNode) {
        return null;
      }
    }

    const startNodeClone = startNode.clone() as CoordNode;

    // Duplicate vertices
    let currNode = startNode;
    let currNodeClone = startNodeClone;
    while (currNode) {
      // Duplicate next & connect
      const nextNode = currNode.next as CoordNode;
      const nextNodeClone = nextNode.clone() as CoordNode;

      currNodeClone.next = nextNodeClone;
      nextNodeClone.prev = currNodeClone;

      if (currNode.val.timestamp === endTime) {
        break;
      } else {
        currNode = nextNode;
      }
    }

    // Duplicate segments
    let startSegmentClone: SegNode;
    currNode = startNode;
    currNodeClone = startNodeClone;
    while (currNode) {
      const currSegment = currNode.nextSeg;
      const nextNode = currNode.next as CoordNode;
      const nextNodeClone = currNodeClone.next as CoordNode;

      const segmentClone = currSegment.clone() as SegNode;
      if (!startSegmentClone) {
        startSegmentClone = segmentClone;
      }
      segmentClone.prevCoord = currNodeClone;
      segmentClone.nextCoord = nextNodeClone;

      currNodeClone.nextSeg = segmentClone;
      nextNodeClone.prevSeg = segmentClone;

      if (nextNode.val.timestamp === endTime) {
        break;
      } else {
        currNode = nextNode;
        currNodeClone = nextNodeClone;
      }
    }

    const polylineTrack = new PolylineTrack([]);
    polylineTrack._vertices = List.fromHead<CoordNode, TrackPoint>(startNodeClone);
    polylineTrack._segments = List.fromHead<SegNode, TrackSegment>(startSegmentClone);

    return polylineTrack;
  }
  // ===

  protected updateTrack(numberNodesAffected: number) {
    if (numberNodesAffected) {
      // regenerate all segments
      this.buildSegments();
      //    optimize: replace segment
      //     // coord.prevSeg
      //     // coord.nextSeg

      // update segment properties
      this.addProperties();
      //    optimize: update new segment properties and adjacent node properties
    }
  }

  // // === IQuery
  // getSegmentBeforeTime(coord: LatLngGPS) {
  //   let currentCoord = this._points.head as CoordinateNode<TrackPoint, TrackSegment>;
  //   while (currentCoord) {
  //     if (evaluator(target, coord)) {
  //       currentCoord.push(coord);
  //     }

  //     currentCoord = coord.currentCoord as CoordinateNode<TrackPoint, TrackSegment>;
  //   }


  //   const trackPoints = (geoJson.features[0].geometry as LineString).points;
  //   const coordinateIndex = coordinatesIndexAt(coord, trackPoints);

  //   if (coordinateIndex) {
  //     const coordinatesSegment = trackPoints.slice(0, coordinateIndex + 1);
  //     const timeStampsSegment: string[] = geoJson.features[0].properties?.coordinateProperties?.times.slice(0, coordinateIndex + 1);

  //     return { coordinatesSegment, timeStampsSegment };
  //   }
  // }

  // getSegmentAfterTime(coord: LatLngGPS) {
  //   const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  //   const coordinateIndex = coordinatesIndexAt(coord, coordinates);

  //   if (coordinateIndex) {
  //     const coordinatesSegment = coordinates.slice(coordinateIndex);
  //     const timeStampsSegment: string[] = geoJson.features[0].properties?.coordinateProperties?.times.slice(coordinateIndex);

  //     return { coordinatesSegment, timeStampsSegment };
  //   }
  // }

  // // Inclusive with coords
  // getSegmentBetweenTimes(
  //   coordStart: LatLngGPS,
  //   coordEnd: LatLngGPS
  // ) {
  //   const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  //   const coordinateStartIndex = coordinatesIndexAt(coordStart, coordinates);
  //   const coordinateEndIndex = coordinatesIndexAt(coordEnd, coordinates);

  //   if (coordinateStartIndex && coordinateEndIndex) {
  //     const coordinatesSegment = coordinates.slice(coordinateStartIndex, coordinateEndIndex + 1);
  //     const timeStampsSegment: string[] =
  //       geoJson.features[0].properties?.coordinateProperties?.times.slice(coordinateStartIndex, coordinateEndIndex + 1);

  //     return { coordinatesSegment, timeStampsSegment };
  //   }
  // }

  // // Coord is duplicated between tracks, ignored if end coord. Coords assumed to be in order along track.
  // getSegmentsSplitByTimes(coords: LatLngGPS[]) {
  //   const coordinatesSegments = [];
  //   const timeStampsSegments = [];

  //   let coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  //   let timeStamps: string[] = geoJson.features[0].properties?.coordinateProperties?.times;
  //   coords.forEach((coord) => {
  //     const coordinateIndex = coordinatesIndexAt(coord, coordinates);
  //     if (coordinateIndex && coordinateIndex < coordinates.length - 1) {
  //       const segment = coordinates.slice(0, coordinateIndex + 1);
  //       if (segment.length) {
  //         coordinatesSegments.push(segment);
  //         coordinates = coordinates.slice(coordinateIndex);


  //         if (timeStamps) {
  //           timeStampsSegments.push(timeStamps.slice(0, coordinateIndex + 1));
  //           timeStamps = timeStamps.slice(coordinateIndex);
  //         }
  //       }
  //     }
  //   });
  //   if (coordinates.length) {
  //     coordinatesSegments.push(coordinates);
  //     timeStampsSegments.push(timeStamps);
  //   }

  //   return { coordinatesSegments, timeStampsSegments };
  // }

  // // === IClippable
  // clipBeforeTime(timestamp: string) {
  //   const segmentData = this.getSegmentBeforeTime(timestamp);

  //   return this.updateTrack(segmentData);
  // }

  // clipAfterTime(timestamp: string) {
  //   const segmentData = this.getSegmentAfterTime(timestamp);

  //   return this.updateTrack(segmentData);
  // }

  // clipBetweenTimes(timestampStart: string, timestampEnd: string) {
  //   const segmentData = this.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //   return this.updateTrack(segmentData);
  // }


  // // === ISplittable
  // splitByTimes(timestampsSplit: string[]): PolylineTrack[] {
  //   throw new Error();

  //   // const trackLayers: FeatureCollection[] = [];

  //   // const segmentsData = this.getSegmentsSplitByTimes(timestampsSplit);
  //   // if (segmentsData.length === 1) {
  //   //   return [];
  //   // }

  //   // segmentsData.forEach((segmentData) => {
  //   //   trackLayers.push(this.generateGeoJsonTrack(segmentData));
  //   // });

  //   // return this.trimSingleNodeSegments(trackLayers);
  // }

  // splitToSegment(segment: ITrackSegmentLimits): PolylineTrack | undefined {
  //   throw new Error();

  //   // const splitSegments = this.splitByTimes([segment.startTime, segment.endTime]);

  //   // return this.trimSingleNodeSegments(
  //   //   this.addSplittingSegment(segment, splitSegments)
  //   // )[0];
  // }

  // splitBySegments(segmentLimits: ITrackSegmentLimits[]): PolylineTrack[] {
  //   throw new Error();

  //   // const splitTimes = [];
  //   // for (const segment of segmentLimits) {
  //   //   splitTimes.push(segment.startTime);
  //   //   splitTimes.push(segment.endTime);
  //   // }

  //   // const splitSegments = this.splitByTimes(splitTimes);

  //   // const tracks: FeatureCollection[] = this.addSplittedSegments(segmentLimits, splitSegments);

  //   // const finalTracks = this.trimSingleSegmentSegments(tracks);

  //   // return finalTracks.length ? finalTracks : [this._geoJson.clone()];
  // }

  // == Static Methods
  static calcSegmentMappedElevationSpeedMPS(elevationChange: number, duration: number) {
    return duration ? elevationChange / duration : Infinity;
  }
}