import {
  VertexNode,
  Polyline
} from '@markpthomas/geometry/polyline';

import { ICloneable, IEquatable } from 'common/interfaces';

import { ITimeRange } from '../Time/TimeRange';
import { IPolylineRouteMethods, PolylineRoute } from '../Route/PolylineRoute';

import { ITrackPointProperties, TrackPoint } from './TrackPoint';
import { TrackSegment } from './TrackSegment';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @typedef {CoordNode}
 */
type CoordNode = VertexNode<TrackPoint, TrackSegment>;

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface IPolylineTrackMethods
 * @typedef {IPolylineTrackMethods}
 * @extends {IPolylineRouteMethods<TrackPoint, TrackSegment>}
 */
export interface IPolylineTrackMethods
  extends IPolylineRouteMethods<TrackPoint, TrackSegment> {
  // Properties Methods

  // Misc Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  generateTimestampMap(): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} startTime
 * @param {string} endTime
 * @returns {(PolylineTrack | null)}
 */
  cloneFromToTimes(startTime: string, endTime: string): PolylineTrack | null;

  // Query Methods
  // Use optional enum for these options?
  // vertexNodeClosestToTime
  // vertexNodeBeforeTime
  // vertexNodeAfterTime
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestamp
 * @returns {(CoordNode | null | undefined)}
 */
  vertexNodeByTime(timestamp: string): CoordNode | null | undefined;

  // vertexNodesByTimeRange
  // use boolean for the following?
  // vertexNodesFromToTime
  // vertexNodesBetweenTime
  // use boolean for exact vs. bounds

  // these can all be used in all methods. Testing need only be done here, just method signatures changed.

  // Delete Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @returns {CoordNode}
 */
  trimBeforeTime(time: string): CoordNode;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @returns {CoordNode}
 */
  trimAfterTime(time: string): CoordNode;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timeStart
 * @param {string} timeEnd
 * @returns {CoordNode[]}
 */
  trimToTimes(
    timeStart: string,
    timeEnd: string
  ): CoordNode[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @returns {CoordNode[]}
 */
  trimToTimeRange(segment: ITimeRange): CoordNode[];

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @returns {CoordNode}
 */
  removeAtTime(time: string): CoordNode;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} times
 * @returns {CoordNode[]}
 */
  removeAtAnyTime(times: string[]): CoordNode[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timeStart
 * @param {string} timeEnd
 * @returns {CoordNode}
 */
  removeBetweenTimes(
    timeStart: string,
    timeEnd: string
  ): CoordNode;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timeStart
 * @param {string} timeEnd
 * @returns {CoordNode}
 */
  removeFromToTimes(
    timeStart: string,
    timeEnd: string
  ): CoordNode;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @returns {CoordNode}
 */
  removeTimeRange(segment: ITimeRange): CoordNode;

  // Update Methods

  // TODO: Add & test the following capabilities:
  //  1. Timestamp validation - must lie between start/end values, etc. This may be what requires non-string timestamps.
  //    1.a. Perhaps failure is a thrown error w/ a message that can be relayed to used.
  //    1.b. User could opt to override timestamps, which first calls a method to clear timestamps of insertion before trying again.
  //  2. For each inserted item where timestamp is missing, add timestamp interpolated between prior & next point times and relative distances between them.
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} targetTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | PolylineTrack)} items
 * @param {boolean} returnListCount
 * @returns {number}
 */
  insertBeforeTime(
    targetTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | PolylineTrack,
    returnListCount: boolean
  ): number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} targetTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | PolylineTrack)} items
 * @param {boolean} returnListCount
 * @returns {number}
 */
  insertAfterTime(
    targetTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | PolylineTrack,
    returnListCount: boolean
  ): number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} targetTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | PolylineTrack)} items
 * @param {boolean} returnListCount
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceAtTime(
    targetTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | PolylineTrack,
    returnListCount: boolean
  ): {
    removed: CoordNode,
    inserted: number
  } | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} startTime
 * @param {string} endTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | PolylineTrack)} items
 * @param {boolean} returnListCount
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceBetweenTimes(
    startTime: string,
    endTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | PolylineTrack,
    returnListCount: boolean
  ): {
    removed: CoordNode,
    inserted: number
  } | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} startTime
 * @param {string} endTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | PolylineTrack)} items
 * @param {boolean} returnListCount
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceFromToTimes(
    startTime: string,
    endTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | PolylineTrack,
    returnListCount: boolean
  ): {
    removed: CoordNode,
    inserted: number
  } | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @param {(ITrackPointProperties | ITrackPointProperties[] | PolylineTrack)} items
 * @param {boolean} returnListCount
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceTimeRange(
    segment: ITimeRange,
    items: ITrackPointProperties | ITrackPointProperties[] | PolylineTrack,
    returnListCount: boolean
  ): {
    removed: CoordNode,
    inserted: number
  } | null;

  // Split Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @param {boolean} includeTimeStampMap
 * @returns {PolylineTrack[]}
 */
  splitByTime(
    time: string,
    includeTimeStampMap: boolean
  ): PolylineTrack[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} times
 * @param {boolean} includeTimeStampMap
 * @returns {PolylineTrack[]}
 */
  splitByTimes(
    times: string[],
    includeTimeStampMap: boolean
  ): PolylineTrack[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @param {boolean} includeTimeStampMap
 * @returns {PolylineTrack[]}
 */
  splitByTimeRange(
    segment: ITimeRange, // | PolylineTrack
    includeTimeStampMap: boolean
  ): PolylineTrack[];

  // TODO: Implement later
  //  Create method. Before calling child methods, it should handle interval-merge operations/validations on the time ranges
  // splitByTimeRanges
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface IPolylineTrack
 * @typedef {IPolylineTrack}
 * @extends {IPolylineTrackMethods}
 * @extends {ICloneable<PolylineTrack>}
 */
export interface IPolylineTrack
  extends
  IPolylineTrackMethods,
  ICloneable<PolylineTrack> {

}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @class PolylineTrack
 * @typedef {PolylineTrack}
 * @extends {PolylineRoute<TrackPoint, TrackSegment>}
 * @implements {IPolylineTrack}
 */
export class PolylineTrack
  extends PolylineRoute<TrackPoint, TrackSegment>
  implements IPolylineTrack {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @type {Map<string, CoordNode>}
 */
  protected _pointsByTimestamp: Map<string, CoordNode>;

  /**
 * Creates an instance of PolylineTrack.
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @constructor
 * @param {(VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | TrackPoint[])} coords
 * @param {boolean} [includeTimeStampMap=true]
 */
  constructor(
    coords: VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | TrackPoint[],
    includeTimeStampMap: boolean = true
  ) {
    super(coords);

    if (includeTimeStampMap) {
      this.generateTimestampMap();
    }
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {VertexNode<TrackPoint, TrackSegment>[]} [coords=[]]
 * @returns {PolylineTrack}
 */
  protected override createPolyline(coords: VertexNode<TrackPoint, TrackSegment>[] = []): PolylineTrack {
    const includeTimeStampMap: boolean = this._pointsByTimestamp?.size > 0;

    return new PolylineTrack(coords, includeTimeStampMap);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 */
  generateTimestampMap() {
    this._pointsByTimestamp = new Map();
    let currNode = this._vertices.head;
    while (currNode) {
      this._pointsByTimestamp.set(currNode.val.timestamp, currNode);
      currNode = currNode.next as CoordNode;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {number} count
 * @param {(CoordNode | CoordNode[])} nodes
 */
  protected addNodesToMap(count: number, nodes: CoordNode | CoordNode[]) {
    if (count && nodes) {
      if (Array.isArray(nodes)) {
        nodes.forEach((node) => {
          if (node) {
            this._pointsByTimestamp.set(node.val.timestamp, node);
          }
        });
      } else {
        this._pointsByTimestamp.set(nodes.val.timestamp, nodes);
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {CoordNode} node
 */
  protected addAllNodesToMap(node: CoordNode) {
    let currNode = node;
    while (currNode && !this._pointsByTimestamp.has(currNode.val.timestamp)) {
      this._pointsByTimestamp.set(currNode.val.timestamp, currNode);

      currNode = currNode.next as CoordNode;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(CoordNode | CoordNode[])} nodes
 */
  protected removeNodesFromMap(nodes: CoordNode | CoordNode[]) {
    if (nodes) {
      if (Array.isArray(nodes)) {
        nodes.forEach((node) => {
          if (node) {
            this._pointsByTimestamp.delete(node.val.timestamp);
          }
        });
      } else {
        this._pointsByTimestamp.delete(nodes.val.timestamp);
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {CoordNode} node
 */
  protected removeAllNodesFromMap(node: CoordNode) {
    let currNode = node;
    while (currNode) {
      this._pointsByTimestamp.delete(currNode.val.timestamp);

      currNode = currNode.next as CoordNode;
    }
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {PolylineTrack}
 */
  override clone(): PolylineTrack {
    const clone = super.clone() as unknown as PolylineTrack;

    if (this._pointsByTimestamp.size) {
      clone.generateTimestampMap();
    }

    return clone;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {(string | null)} [startTime=null]
 * @param {(string | null)} [endTime=null]
 * @param {boolean} [includeTimeStampMap=true]
 * @returns {(PolylineTrack | null)}
 */
  cloneFromToTimes(
    startTime: string | null = null,
    endTime: string | null = null,
    includeTimeStampMap: boolean = true
  ): PolylineTrack | null {
    let startVertex: VertexNode<TrackPoint, TrackSegment> | null;
    let endVertex: VertexNode<TrackPoint, TrackSegment> | null;

    startVertex = startTime === null ? null : this.vertexNodeByTime(startTime);
    endVertex = endTime === null ? null : this.vertexNodeByTime(endTime);

    if (startVertex === undefined || endVertex === undefined) {
      return null;
    }

    const clone = super.cloneFromTo(startVertex, endVertex) as PolylineTrack;

    if (clone && includeTimeStampMap) {
      clone.generateTimestampMap();
    }

    return clone;
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {ITrackPointProperties} point
 * @returns {TrackPoint}
 */
  protected override initializePoint(point: ITrackPointProperties): TrackPoint {
    return TrackPoint.fromProperties(point);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {(ITrackPointProperties | VertexNode<TrackPoint, TrackSegment>)} point
 * @returns {VertexNode<TrackPoint, TrackSegment>}
 */
  protected override initializeVertex(point: ITrackPointProperties | VertexNode<TrackPoint, TrackSegment>): VertexNode<TrackPoint, TrackSegment> {
    return VertexNode.isVertexNode(point)
      ? point as VertexNode<TrackPoint, TrackSegment>
      : new VertexNode<TrackPoint, TrackSegment>(this.initializePoint(point as ITrackPointProperties));
  }

  // === Property Methods
  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {CoordNode[]} vertices
 */
  protected override updatePathProperties(vertices: CoordNode[]) {
    this.incrementVersion();
    vertices.forEach((vertex) => {
      vertex.val.path.addPropertiesFromPath(vertex.prevSeg?.val, vertex.nextSeg?.val);
      if (vertex.val.elevation || vertex.val.alt) {
        vertex.val.path.addElevationSpeedsFromPath(vertex.prevSeg?.val, vertex.nextSeg?.val);
      }
    });
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {TrackPoint} prevCoord
 * @param {TrackPoint} nextCoord
 * @returns {TrackSegment}
 */
  protected override createSegmentValue(prevCoord: TrackPoint, nextCoord: TrackPoint): TrackSegment {
    return TrackSegment.fromTrackPoints(prevCoord, nextCoord);
  }

  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:34:55 PM
 */
  override addElevationProperties() {
    super.addElevationProperties();

    let currNode = this._vertices.head;
    while (currNode) {
      currNode.val.path.addElevationSpeedsFromPath(currNode.prevSeg?.val, currNode.nextSeg?.val);
      currNode = currNode.next as CoordNode;
    }
  }

  // === Query Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timestamp
 * @returns {(CoordNode | null | undefined)}
 */
  vertexNodeByTime(timestamp: string): CoordNode | null | undefined {
    if (!timestamp) {
      return undefined;
    } else if (this._pointsByTimestamp) {
      // Use optimization
      if (this._pointsByTimestamp.has(timestamp)) {
        return this._pointsByTimestamp.get(timestamp);
      }
      return undefined;
    } else {
      return this.vertexNodesBy(
        timestamp,
        (timestamp: string, coord: CoordNode) => coord.val.timestamp === timestamp
      )[0];
    }
  }

  // TODO: What is a unique property. By node value?
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {*} polyline
 * @returns {boolean}
 */
  static isPolylineTrack(polyline: any) {
    return polyline instanceof PolylineTrack || '_pointsByTimestamp' in polyline;
  }

  // === Delete Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @returns {CoordNode}
 */
  trimBeforeTime(time: string): CoordNode {
    const point = time ? this._pointsByTimestamp.get(time) : null;
    if (!point) {
      return null;
    }

    const trimmedHead = super.trimBefore(point);
    this.removeNodesFromMap(trimmedHead);
    return trimmedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @returns {CoordNode}
 */
  trimAfterTime(time: string): CoordNode {
    const point = time ? this._pointsByTimestamp.get(time) : null;
    if (!point) {
      return null;
    }

    const trimmedHead = super.trimAfter(point);
    this.removeNodesFromMap(trimmedHead);
    return trimmedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timeStart
 * @param {string} timeEnd
 * @returns {CoordNode[]}
 */
  trimToTimes(
    timeStart: string,
    timeEnd: string
  ): CoordNode[] {
    const headTrim = this.trimBeforeTime(timeStart);
    const tailTrim = this.trimAfterTime(timeEnd);

    this.removeNodesFromMap([headTrim, tailTrim]);

    return [headTrim, tailTrim];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @returns {CoordNode[]}
 */
  trimToTimeRange(segment: ITimeRange): CoordNode[] {
    return this.trimToTimes(segment.startTime, segment.endTime);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @returns {CoordNode}
 */
  removeAtTime(time: string): CoordNode {
    const point = this._pointsByTimestamp.get(time);
    if (!point) {
      return null;
    }

    const removedHead = this.removeAt(point);
    this.removeNodesFromMap(removedHead);
    return removedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} times
 * @returns {CoordNode[]}
 */
  removeAtAnyTime(times: string[]): CoordNode[] {
    const vertices = [];

    times.forEach(
      (time) => {
        const vertex = this.vertexNodeByTime(time) as CoordNode;
        if (vertex) {
          vertices.push(vertex);
        }
      }
    );

    const removedHeads = this.removeAtAny(vertices);
    this.removeNodesFromMap(removedHeads);
    return removedHeads;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timeStart
 * @param {string} timeEnd
 * @returns {CoordNode}
 */
  removeBetweenTimes(
    timeStart: string,
    timeEnd: string
  ): CoordNode {
    const startVertex = this._pointsByTimestamp.get(timeStart);
    const endVertex = this._pointsByTimestamp.get(timeEnd);

    const removedHead = this.removeBetween(startVertex, endVertex);

    this.removeNodesFromMap(removedHead);

    return removedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} timeStart
 * @param {string} timeEnd
 * @returns {CoordNode}
 */
  removeFromToTimes(
    timeStart: string,
    timeEnd: string
  ): CoordNode {
    const startVertex = this._pointsByTimestamp.get(timeStart);
    const endVertex = this._pointsByTimestamp.get(timeEnd);

    const removedHead = this.removeFromTo(startVertex, endVertex);
    this.removeNodesFromMap(removedHead);
    return removedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @returns {CoordNode}
 */
  removeTimeRange(segment: ITimeRange): CoordNode {
    return this.removeFromToTimes(segment.startTime, segment.endTime);
  }

  // === Update Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} targetTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @returns {number}
 */
  insertBeforeTime(
    targetTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): number {
    const targetPoint = this._pointsByTimestamp.get(targetTime);
    if (!targetPoint) {
      return 0;
    }

    let insertCount = 0;

    if (Array.isArray(items)) {
      const insertionVertices = items.map((point) => this.initializeVertex(point));
      insertCount = this.insertBefore(targetPoint, insertionVertices, returnListCount);

      this.addNodesToMap(insertCount, insertionVertices);
    } else if (items instanceof PolylineTrack || items instanceof PolylineRoute || items instanceof Polyline) {
      insertCount = this.insertBefore(targetPoint, items, returnListCount);

      this.addAllNodesToMap(items.firstVertex);
    } else if (VertexNode.isVertexNode(items)) {
      insertCount = this.insertBefore(targetPoint, items as VertexNode<TrackPoint, TrackSegment>, returnListCount);

      this.addNodesToMap(insertCount, items as VertexNode<TrackPoint, TrackSegment>);
    } else {
      const insertionVertex = this.initializeVertex(items as ITrackPointProperties);
      insertCount = this.insertBefore(targetPoint, insertionVertex, returnListCount);

      this.addNodesToMap(insertCount, insertionVertex);
    }

    return insertCount;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} targetTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @returns {number}
 */
  insertAfterTime(
    targetTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): number {
    const targetPoint = this._pointsByTimestamp.get(targetTime);
    if (!targetPoint) {
      return 0;
    }

    let insertCount = 0;

    if (Array.isArray(items)) {
      const insertionVertices = items.map((point) => this.initializeVertex(point));
      insertCount = this.insertAfter(targetPoint, insertionVertices, returnListCount);

      this.addNodesToMap(insertCount, insertionVertices);
    } else if (items instanceof PolylineTrack || items instanceof PolylineRoute || items instanceof Polyline) {
      insertCount = this.insertAfter(targetPoint, items, returnListCount);

      this.addAllNodesToMap(items.firstVertex);
    } else {
      const insertionVertex = this.initializeVertex(items);
      insertCount = this.insertAfter(targetPoint, insertionVertex, returnListCount);

      this.addNodesToMap(insertCount, insertionVertex);
    }

    return insertCount;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} targetTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceAtTime(
    targetTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: CoordNode,
    inserted: number
  } | null {
    const targetPoint = this._pointsByTimestamp.get(targetTime);
    if (!targetPoint) {
      return null;
    }

    let result: {
      removed: CoordNode;
      inserted: number;
    };

    if (Array.isArray(items)) {
      const replacementVertices = items.map((point) => this.initializeVertex(point));
      result = this.replaceAt(targetPoint, replacementVertices, returnListCount);

      if (result) {
        this.removeNodesFromMap(result.removed);
        this.addNodesToMap(result.inserted, replacementVertices);
      }
    } else if (items instanceof PolylineTrack || items instanceof PolylineRoute || items instanceof Polyline) {
      result = this.replaceAt(targetPoint, items, returnListCount);

      if (result) {
        this.removeAllNodesFromMap(result.removed);
        this.addAllNodesToMap(items.firstVertex);
      }
    } else {
      const replacementVertex = this.initializeVertex(items);
      result = this.replaceAt(targetPoint, replacementVertex, returnListCount);

      if (result) {
        this.removeNodesFromMap(result.removed);
        this.addNodesToMap(result.inserted, replacementVertex);
      }
    }

    return result;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} startTime
 * @param {string} endTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceBetweenTimes(
    startTime: string,
    endTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: CoordNode,
    inserted: number
  } | null {
    const startVertex = this._pointsByTimestamp.get(startTime);
    const endVertex = this._pointsByTimestamp.get(endTime);

    let result: {
      removed: CoordNode;
      inserted: number;
    };

    if (Array.isArray(items)) {
      const replacementVertices = items.map((point) => this.initializeVertex(point));
      result = this.replaceBetween(startVertex, endVertex, replacementVertices, returnListCount);

      if (result) {
        this.removeNodesFromMap(result.removed);
        this.addNodesToMap(result.inserted, replacementVertices);
      }
    } else if (items instanceof PolylineTrack || items instanceof PolylineRoute || items instanceof Polyline) {
      result = this.replaceBetween(startVertex, endVertex, items, returnListCount);

      if (result) {
        this.removeAllNodesFromMap(result.removed);
        this.addAllNodesToMap(items.firstVertex);
      }
    } else {
      const replacementVertex = this.initializeVertex(items);
      result = this.replaceBetween(startVertex, endVertex, replacementVertex, returnListCount);

      if (result) {
        this.removeNodesFromMap(result.removed);
        this.addNodesToMap(result.inserted, replacementVertex);
      }
    }

    return result;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} startTime
 * @param {string} endTime
 * @param {(ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceFromToTimes(
    startTime: string,
    endTime: string,
    items: ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: CoordNode,
    inserted: number
  } | null {

    if (!startTime && !endTime) {
      return null;
    }

    const startVertex = this._pointsByTimestamp.get(startTime) ?? null;
    const endVertex = this._pointsByTimestamp.get(endTime) ?? null;

    if (startTime === null && endVertex.val === this.firstVertex.val) {
      return this.replaceBetweenTimes(startTime, endVertex.next.val.timestamp, items, returnListCount);
    }

    if (endTime === null && startVertex.val === this.lastVertex.val) {
      return this.replaceBetweenTimes(startVertex.prev.val.timestamp, endTime, items, returnListCount);
    }

    let result: {
      removed: CoordNode;
      inserted: number;
    };

    if (Array.isArray(items)) {
      const replacementVertices = items.map((point) => this.initializeVertex(point));
      result = this.replaceFromTo(startVertex, endVertex, replacementVertices, returnListCount);

      if (result) {
        this.removeNodesFromMap(result.removed);
        this.addNodesToMap(result.inserted, replacementVertices);
      }
    } else if (items instanceof PolylineTrack || items instanceof PolylineRoute || items instanceof Polyline) {
      result = this.replaceFromTo(startVertex, endVertex, items, returnListCount);

      if (result) {
        this.removeAllNodesFromMap(result.removed);
        this.addAllNodesToMap(items.firstVertex);
      }
    } else {
      const replacementVertex = this.initializeVertex(items);
      result = this.replaceFromTo(startVertex, endVertex, replacementVertex, returnListCount);

      if (result) {
        this.removeNodesFromMap(result.removed);
        this.addNodesToMap(result.inserted, replacementVertex);
      }
    }

    return result;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @param {(ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack)} items
 * @param {boolean} [returnListCount=false]
 * @returns {({
 *     removed: CoordNode,
 *     inserted: number
 *   } | null)\}
 */
  replaceTimeRange(
    segment: ITimeRange,
    items: ITrackPointProperties | ITrackPointProperties[] | VertexNode<TrackPoint, TrackSegment> | VertexNode<TrackPoint, TrackSegment>[] | PolylineTrack,
    returnListCount: boolean = false
  ): {
    removed: CoordNode,
    inserted: number
  } | null {
    return this.replaceFromToTimes(segment.startTime, segment.endTime, items, returnListCount);
  }

  // === Split Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string} time
 * @param {boolean} [includeTimeStampMap=true]
 * @returns {PolylineTrack[]}
 */
  splitByTime(
    time: string,
    includeTimeStampMap: boolean = true
  ): PolylineTrack[] {
    const point = this._pointsByTimestamp.get(time);
    if (!point) {
      return [this];
    }

    const polylines = this.splitBy(point) as unknown as PolylineTrack[];

    if (includeTimeStampMap) {
      polylines.forEach((polyline) => {
        polyline.generateTimestampMap();
      })
    }

    return polylines;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} times
 * @param {boolean} [includeTimeStampMap=true]
 * @returns {PolylineTrack[]}
 */
  splitByTimes(
    times: string[],
    includeTimeStampMap: boolean = true
  ): PolylineTrack[] {

    const points = [];
    times.forEach(
      (time) => {
        const vertex = this._pointsByTimestamp.get(time);
        if (vertex) {
          points.push(vertex);
        }
      }
    );
    if (!points.length) {
      return [this];
    }

    const polylines = this.splitByMany(points) as unknown as PolylineTrack[];

    if (includeTimeStampMap) {
      polylines.forEach((polyline) => {
        polyline.generateTimestampMap();
      })
    }

    return polylines;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITimeRange} segment
 * @param {boolean} [includeTimeStampMap=true]
 * @returns {PolylineTrack[]}
 */
  splitByTimeRange(
    segment: ITimeRange,
    includeTimeStampMap: boolean = true
  ): PolylineTrack[] {
    return this.splitByTimes([segment.startTime, segment.endTime], includeTimeStampMap);
  }
}