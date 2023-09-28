import { ICloneable } from '../../../../../../common/interfaces';

import {
  LinkedListDoubleGeneric as List,
} from '../../../../../../common/utils/dataStructures';

import {
  VertexNode,
  SegmentNode
} from '../../Geometry/Polyline';

import { ITrimmable } from './ITrimmable';
import { IQuery } from './IQuery';
import { ISplittable } from './ISplittable';

import { TrackPoint } from './TrackPoint';
import { ITrackSegment, ITrackSegmentLimits, TrackSegment, TrackSegmentData } from './TrackSegment';
import { TimeStamp } from './TimeStamp';
import { IPolylineRoute, IPolylineRouteMethods, PolylineRoute } from '../Route/PolylineRoute';

type CoordNode = VertexNode<TrackPoint, TrackSegment>;
type SegNode = SegmentNode<TrackPoint, TrackSegment>;

export interface IPolylineTrackMethods
  extends IPolylineRouteMethods<TrackPoint, TrackSegment> {
  // Misc Methods
  generateTimestampMap(): void;
  copyRangeByTimestamp(startTime: string, endTime: string): PolylineTrack | null;

  // Query Methods
  getNodeByTimestamp(timestamp: string): CoordNode;
}

export interface IPolylineTrack
  extends
  IPolylineTrackMethods//,
// IClippable,
// ISplittable<PolylineTrack>,
// IQuery,
// ICloneable<PolylineTrack>
{

  // Property Methods
  // /**
  //  * Adds derived properties to {@link TrackSegment}s and {@link TrackPoint}s based on initial properties in the {@link TrackPoint}s.
  //  *
  //  * @memberof ITrack
  //  */
  // addProperties(): void;

  // /**
  //  * Adds elevation data to the track for matching lat/long points.
  //  *
  //  * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
  //  * form { lat: number, lng: number } as a JSON string.
  //  * @memberof Track
  //  */
  // addElevations(elevations: Map<string, number>): void;

  // /**
  //  * Adds derived elevation properties to {@link TrackSegment}s and {@link TrackPoint}s based on elevation data in the {@link TrackPoint}s.
  //  *
  //  * @memberof ITrack
  //  */
  // addElevationProperties(): void;

  // /**
  //  * Queries an API to add mapped elevation data to the track.
  //  *
  //  * @memberof Track
  //  */
  // addElevationsFromApi(): void;

  // getNodes(
  //   target: string | number | EvaluatorArgs,
  //   evaluator: (target: string | number | EvaluatorArgs, coord: CoordNode) => boolean
  // ): CoordNode[];


  // Modifying Methods

  // TODO: For any methods modifying nodes & tracks:
  //   work out how to modify derived properties on nodes & segments kept
  //        Currently handled in remove/insert/replace by  this.updateTrack(nodesAffected); being called at end
  //   Including: ISplittable, IClippable methods
  //   Including copyRangeByTimestamp when not copying the full track
  //

  // removeNodes(nodes: CoordNode[]): number;

  // insertNodesBefore(
  //   node: CoordNode,
  //   nodes: CoordNode[]
  // ): number;

  // insertNodesAfter(
  //   node: CoordNode,
  //   nodes: CoordNode[]
  // ): number;

  // replaceNodesBetween(
  //   tempHeadNode: CoordNode,
  //   tempTailNode: CoordNode,
  //   nodes: CoordNode[]
  // ): number;
}

export class PolylineTrack
  // extends Polyline<TrackPoint, TrackSegment>
  extends PolylineRoute<TrackPoint, TrackSegment>
  implements IPolylineTrack {

  protected _pointsByTimestamp: Map<string, CoordNode>;

  constructor(coords: TrackPoint[]) {
    super(coords);

    // TODO: Consider adding a constructor flag so that this isn't always called. May be lazy invokation.
    this.generateTimestampMap();
  }

  // TODO: handle Replace operations with Map.
  // May need to pass in a callback to separately handle removal vs. insertion.
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

  // clone(): PolylineTrack {
  //   const track = this.copyRangeByTimestamp('', '') as PolylineTrack;

  //   return track ?? new PolylineTrack([]);
  // }

  copyRangeByTimestamp(startTime: string, endTime: string): PolylineTrack | null {
    let startNode = this.getNodeByTimestamp(startTime);

    if (!startNode) {
      startNode = this.firstVertex;
      if (!startNode) {
        return null;
      }
    }

    const startNodeClone = startNode.clone() as CoordNode;

    // Duplicate vertices
    let currNode = startNode;
    let currNodeClone = startNodeClone;
    while (currNode && currNode.next) {
      // Duplicate next & connect
      const nextNode = currNode.next as CoordNode;
      const nextNodeClone = nextNode.clone() as CoordNode;

      currNodeClone.next = nextNodeClone;
      nextNodeClone.prev = currNodeClone;

      if (nextNode.val.timestamp === endTime) {
        break;
      } else {
        currNodeClone = nextNodeClone;
        currNode = nextNode;
      }
    }

    // Duplicate segments
    let startSegmentClone: SegNode;
    let prevSegmentClone: SegNode;
    currNode = startNode;
    currNodeClone = startNodeClone;
    while (currNode && currNode.next) {
      const currSegment = currNode.nextSeg;
      const nextNode = currNode.next as CoordNode;
      const nextNodeClone = currNodeClone.next as CoordNode;

      const segmentClone = currSegment.clone() as SegNode;
      if (!startSegmentClone) {
        startSegmentClone = segmentClone;
      } else {
        segmentClone.prev = prevSegmentClone;
        prevSegmentClone.next = segmentClone;
      }
      segmentClone.prevVert = currNodeClone;
      segmentClone.nextVert = nextNodeClone;

      currNodeClone.nextSeg = segmentClone;
      nextNodeClone.prevSeg = segmentClone;

      if (nextNode.val.timestamp === endTime) {
        break;
      } else {
        prevSegmentClone = segmentClone;
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

  protected updateAllSegmentsAndProperties(numberNodesAffected: number) {
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



  addProperties() {
    this.addPropertiesToNodes();
  }

  protected addPropertiesToNodes() {
    super.addPropertiesToNodes();
    this.addPathPropertiesToCoords();
  }

  addElevationProperties() {
    super.addElevationProperties();

    let currNode = this._vertices.head;
    while (currNode) {
      currNode.val.path.addElevationSpeedsFromPath(currNode.prevSeg?.val, currNode.nextSeg?.val);
      currNode = currNode.next as CoordNode;
    }
  }

  protected updatePointProperties(point: CoordNode) {
    point.val.path.addPropertiesFromPath(point.prevSeg?.val, point.nextSeg?.val);
    if (point.val.elevation) {
      point.val.path.addElevationSpeedsFromPath(point.prevSeg?.val, point.nextSeg?.val);
    }
  }

  protected createSegmentValue(prevCoord: TrackPoint, nextCoord: TrackPoint): TrackSegment {
    return TrackSegment.fromTrackPoints(prevCoord, nextCoord);
  }

  // === Consider moving these to PolyLine base class?
  getNodeByTimestamp(timestamp: string): CoordNode {
    if (this._pointsByTimestamp) {
      // Use optimization
      if (this._pointsByTimestamp.has(timestamp)) {
        return this._pointsByTimestamp.get(timestamp);
      }
      return null;
    } else {
      return this.vertexNodesBy(
        timestamp,
        (timestamp: string, coord: CoordNode) => coord.val.timestamp === timestamp
      )[0]
    }
  }

  // === IQuery
  // getSegmentBeforeTime(timestamp: string): ITrackSegmentLimits {
  // }

  // getSegmentAfterTime(timestamp: string): ITrackSegmentLimits {

  // }

  // getSegmentBetweenTimes(
  //   startTimestamp: string,
  //   endTimestampt: string
  // ): ITrackSegmentLimits {

  // }

  // getSegmentsSplitByTimes(timestamp: string[]) {

  // }

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

  // === IClippable
  // TODO: Consider modifying existing Polyine vs. duplicating it to keep it immutable
  //    Duplication is slower than operating on GeoJsonTrack, Modification is faster
  //    Overall result is comparable once state is saved, but for active modification,
  //       these methods might be better done on the PolylineTrack proxy until state is saved.

  // trimBeforeTime(timestamp: string): void {
  //   // const nodeExcluded = this._pointsByTimestamp.get(timestamp);
  //   // const nodeIncluded = nodeExcluded.prev;

  //   this.trimByTimes(timestamp, null);
  //   // this.trimByTimes2(nodeExcluded.val.timestamp, nodeIncluded.val.timestamp)[1];
  // }

  // trimAfterTime(timestamp: string): void {
  //   // const nodeExcluded = this._pointsByTimestamp.get(timestamp);
  //   // const nodeIncluded = nodeExcluded.prev;

  //   this.trimByTimes(null, timestamp);
  //   // this.trimByTimes2(nodeIncluded.val.timestamp, nodeExcluded.val.timestamp)[0];
  // }


  // trimByTimes(timestampStart: string, timestampEnd: string): void {
  //   if (timestampStart === timestampEnd) {
  //     return;
  //   }

  //   const vertexStart = this._pointsByTimestamp.get(timestampStart);
  //   const vertexEnd = this._pointsByTimestamp.get(timestampEnd);

  //   this._vertices.trim(vertexStart, vertexEnd);
  //   this._segments.trim(vertexStart.nextSeg, vertexEnd.prevSeg);

  //   if (vertexStart) {
  //     vertexStart.prevSeg.nextCoord = null;
  //     vertexStart.prevSeg = null;

  //     vertexStart.val.path.addPropertiesFromPath(null, vertexStart.nextSeg.val);

  //     const segmentStart = vertexStart.nextSeg.val;
  //     segmentStart.addElevationData(vertexStart.val, vertexStart.next.val);
  //   }

  //   if (vertexEnd) {
  //     vertexEnd.nextSeg.prevCoord = null;
  //     vertexEnd.nextSeg = null;
  //     vertexEnd.val.path.addPropertiesFromPath(vertexEnd.prevSeg.val, null);

  //     vertexEnd.val.path.addPropertiesFromPath(vertexEnd.nextSeg.val, null);

  //     const segmentEnd = vertexEnd.prevSeg.val;
  //     segmentEnd.addElevationData(vertexEnd.prev.val, vertexEnd.val);
  //   }
  // }

  trimBeforeTime(
    time: string,
    returnListCount: boolean = false
  ): number {
    const point = this._pointsByTimestamp.get(time);
    if (!point) {
      return 0;
    }

    const trimCount = super.trimBefore(point, returnListCount);

    if (trimCount) {
      this.updatePointProperties(point);
    }

    return trimCount;
  }

  trimAfterTime(
    time: string,
    returnListCount: boolean = false
  ): number {
    const point = this._pointsByTimestamp.get(time);
    if (!point) {
      return 0;
    }

    const trimCount = super.trimAfter(point, returnListCount)

    if (trimCount) {
      this.updatePointProperties(point);
    }

    return trimCount;
  }

  trimToTimes(
    timeStart: string,
    timeEnd: string,
    returnListCount: boolean = false
  ): number {
    const headTrim = this.trimBeforeTime(timeStart, returnListCount);
    const tailTrim = this.trimAfterTime(timeEnd, returnListCount);

    return headTrim + tailTrim;
  }

  trimToTimeSegment(
    segment: ITrackSegmentLimits,
    returnListCount: boolean = false
  ): number {
    return this.trimToTimes(segment.startTime, segment.endTime, returnListCount)
  }

  // trimByTimes2(timestampStop: string, timestampResume: string): void {
  //   // Get Key Vertices & Segments
  //   const trackIEndNode = this._pointsByTimestamp.get(timestampStop);
  //   let trackJStartNode = this._pointsByTimestamp.get(timestampResume);

  //   if (trackIEndNode === trackJStartNode) {
  //     trackJStartNode = trackJStartNode.clone() as CoordNode;
  //     trackJStartNode.next = trackIEndNode.next;
  //     trackJStartNode.nextSeg = trackIEndNode.nextSeg;
  //   }

  //   // Remove any joining segments
  //   this.splitAdjacentNodes(trackIEndNode, trackIEndNode.next as CoordNode, trackIEndNode.nextSeg);
  //   this.splitAdjacentNodes(trackJStartNode.prev as CoordNode, trackJStartNode, trackJStartNode.prevSeg);

  //   // TODO: Here is where derived properties can be updated for start/end nodes of each track
  // }

  // protected splitAdjacentNodes(nodeI: CoordNode, nodeJ: CoordNode, segIJ: SegNode) {
  //   if (nodeI) {
  //     nodeI.next = null;
  //     nodeI.nextSeg = null;
  //   }

  //   if (nodeJ) {
  //     nodeJ.prev = null;
  //     nodeJ.prevSeg = null;
  //   }

  //   if (segIJ) {
  //     segIJ.next = null;
  //     segIJ.nextCoord = null;

  //     segIJ.prev = null;
  //     segIJ.prevCoord = null;
  //   }
  // }


  // === ISplittable
  //  Modifies track
  // splitAtTime(timestamp: string) {
  //   return this.clipBetweenTimes(timestamp, timestamp);
  // }

  // splitByTimes(timestamps: string[]) {
  //   return timestamps.map((timestamp) => this.splitAtTime(timestamp));
  // };

  // Duplicates track
  splitAtTime(timestamp: string) {
    const trackI = this.copyRangeByTimestamp('', timestamp);
    const trackJ = this.copyRangeByTimestamp(timestamp, '');

    return [trackI, trackJ];
  }

  splitByTimes(timestamps: string[]): PolylineTrack[] {
    const tracks: PolylineTrack[] = [];

    for (let i = 0; i <= timestamps.length; i++) {
      const startTime = i === 0 ? '' : timestamps[i - 1];
      const endTime = i === timestamps.length ? '' : timestamps[i];

      const splitTrack = this.copyRangeByTimestamp(startTime, endTime);
      tracks.push(splitTrack);
    }

    return tracks;
  }

  splitToSegment(segment: ITrackSegmentLimits): PolylineTrack | undefined {
    return this.copyRangeByTimestamp(segment.startTime, segment.endTime);
  }

  splitBySubPolylines(segmentLimits: ITrackSegmentLimits[]): PolylineTrack[] {
    const tracks: PolylineTrack[] = [];

    let splitTrack = this.copyRangeByTimestamp('', segmentLimits[0].startTime);
    tracks.push(splitTrack);

    for (let i = 0; i < segmentLimits.length - 1; i++) {
      const limitsPrev = segmentLimits[i];
      const limitsNext = segmentLimits[i + 1];

      const startTime = limitsPrev.endTime;
      const endTime = limitsNext.startTime;

      splitTrack = this.copyRangeByTimestamp(startTime, endTime);
      tracks.push(splitTrack);
    }

    splitTrack = this.copyRangeByTimestamp(segmentLimits[segmentLimits.length].endTime, '');
    tracks.push(splitTrack);

    return tracks;


    // const splitTimes = [];
    // for (const segment of segmentLimits) {
    //   splitTimes.push(segment.startTime);
    //   splitTimes.push(segment.endTime);
    // }

    // const splitSegments = this.splitByTimes(splitTimes);

    // const tracks: PolylineTrack[] = this.addSplittedSegments(segmentLimits, splitSegments);

    // const finalTracks = this.trimSingleSegmentSegments(tracks);

    // return finalTracks.length ? finalTracks : [this.clone()];
  }
}