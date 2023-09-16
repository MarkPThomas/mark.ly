import {
  LinkedListDoubleGeneric as List,
  NodeDouble,
  INodeDouble
} from '../../../../../common/utils/dataStructures';

import { Segment } from './Segment';
import { IVertex, Vertex } from './Vertex';

export type EvaluatorArgs = { [name: string]: number | string };


export interface ICoordinateNode<TVertex, TSegment> extends INodeDouble<TVertex> {
  nextSeg: SegmentNode<TVertex, TSegment> | null;
  prevSeg: SegmentNode<TVertex, TSegment> | null;
}

export class CoordinateNode<TVertex, TSegment>
  extends NodeDouble<TVertex>
  implements ICoordinateNode<TVertex, TSegment>
{
  nextSeg: SegmentNode<TVertex, TSegment> | null;
  prevSeg: SegmentNode<TVertex, TSegment> | null;
}

export interface ISegmentNode<TVertex, TSegment> extends INodeDouble<TSegment> {
  nextCoord: CoordinateNode<TVertex, TSegment>;
  prevCoord: CoordinateNode<TVertex, TSegment>;
}

export class SegmentNode<TVertex, TSegment>
  extends NodeDouble<TSegment>
  implements ISegmentNode<TVertex, TSegment>
{
  nextCoord: CoordinateNode<TVertex, TSegment>;
  prevCoord: CoordinateNode<TVertex, TSegment>;

  constructor(
    prevCoord: CoordinateNode<TVertex, TSegment>,
    nextCoord: CoordinateNode<TVertex, TSegment>,
    segment?: TSegment
  ) {
    super(segment ?? null);
    this.prevCoord = prevCoord;
    this.nextCoord = nextCoord;
  }
}


export interface IPolylineSize {
  vertices: number;
  segments: number;
}


export interface IPolyline<TVertex, TSegment> {
  // Properties
  firstPoint: ICoordinateNode<TVertex, TSegment>;
  firstSegment: ISegmentNode<TVertex, TSegment>;

  lastPoint: ICoordinateNode<TVertex, TSegment>;
  lastSegment: ISegmentNode<TVertex, TSegment>;

  // Property Methods
  /**
   * Adds derived properties to Segments and Pointss based on initial properties in the Points.
   *
   * @memberof IPolyline
   */
  addProperties(): void;

  /**
   * Returns the number of {@link Vertex} and {@link Segment} items.
   *
   * @return {*}  {{
   *     vertices: number;
   *     segments: number;
   *   }}
   * @memberof IPolyline
   */
  size(): IPolylineSize;
  vertices(): TVertex[];
  segments(): TSegment[];

  // Query Methods
  getNodes(
    target: string | number | EvaluatorArgs,
    evaluator: (
      target: string | number | EvaluatorArgs,
      coord: CoordinateNode<TVertex, TSegment>
    ) => boolean
  ): CoordinateNode<TVertex, TSegment>[];

  removeNodes(nodes: CoordinateNode<TVertex, TSegment>[]): number;

  insertNodesBefore(
    node: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number;

  insertNodesAfter(
    node: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number;

  replaceNodesBetween(
    tempHeadNode: CoordinateNode<TVertex, TSegment>,
    tempTailNode: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number;

  replaceNodesFromTo(
    startNode: CoordinateNode<TVertex, TSegment>,
    endNode: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number;
}

export class Polyline<TVertex extends Vertex, TSegment extends Segment>
  implements IPolyline<TVertex, TSegment>
{
  protected _vertices: List<CoordinateNode<TVertex, TSegment>, TVertex> = new List<CoordinateNode<TVertex, TSegment>, TVertex>();
  protected _segments: List<SegmentNode<TVertex, TSegment>, TSegment> = new List<SegmentNode<TVertex, TSegment>, TSegment>();

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

  constructor(coords: TVertex[]) {
    if (coords) {
      this._vertices.appendMany(coords);
      this.buildSegments();
    }
  }

  protected updateProperties(numberNodesAffected: number) {
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

  size() {
    return {
      vertices: this._vertices.size(),
      segments: this._segments.size()
    }
  }

  vertices() {
    return this._vertices.toArray() as TVertex[];
  }

  segments() {
    return this._segments.toArray() as TSegment[];
  }

  protected buildSegments() {
    if (this._vertices.size() === 0) {
      return;
    }

    this._segments = new List<SegmentNode<TVertex, TSegment>, TSegment>();

    let coord = this._vertices.head?.next as CoordinateNode<TVertex, TSegment>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<TVertex, TSegment>;
      this.buildSegment(prevCoord, coord);

      coord = coord.next as CoordinateNode<TVertex, TSegment>;
    }
    if (this._vertices.size() !== this._segments.size() + 1) {
      throw new Error(`Polyline of ${this._vertices.size()} vertices generated ${this._segments.size()} segments`);
    }
  }

  protected buildSegment(coordI: CoordinateNode<TVertex, TSegment>, coordJ: CoordinateNode<TVertex, TSegment>) {
    const segmentNode = new SegmentNode<TVertex, TSegment>(coordI, coordJ);
    this._segments.append(segmentNode);

    coordI.nextSeg = segmentNode;
    coordJ.prevSeg = segmentNode;
  }

  addProperties() {
    this.addPropertiesToNodes();
  }

  protected addPropertiesToNodes() {
    this.addPropertiesToSegments();
  }

  protected addPropertiesToSegments() {
    let coord = this._vertices.head?.next as CoordinateNode<TVertex, TSegment>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<TVertex, TSegment>;
      const segment = this.getSegment(prevCoord.val, coord.val);
      coord.prevSeg.val = segment;

      coord = coord.next as CoordinateNode<TVertex, TSegment>;
    }
  }

  protected getSegment(prevCoord: TVertex, nextCoord: TVertex): TSegment {
    return new Segment() as TSegment;
  }

  getNodes(
    target: string | number | EvaluatorArgs,
    evaluator: (
      target: string | number | EvaluatorArgs,
      coord: CoordinateNode<TVertex, TSegment>
    ) => boolean
  ): CoordinateNode<TVertex, TSegment>[] {
    const nodes: CoordinateNode<TVertex, TSegment>[] = [];

    let node = this._vertices.head as CoordinateNode<TVertex, TSegment>;
    while (node) {
      if (evaluator(target, node)) {
        nodes.push(node);
      }

      node = node.next as CoordinateNode<TVertex, TSegment>;
    }

    return nodes;
  }

  removeNodes(nodes: CoordinateNode<TVertex, TSegment>[]): number {
    let count = 0;

    nodes.forEach((node) => {
      if (this._vertices.remove(node)) {
        count++;
      }
    });

    this.updateProperties(count);

    return count;
  }

  insertNodesBefore(
    node: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number {
    const count = this._vertices.insertManyBefore(node, nodes);

    this.updateProperties(count);

    return count;
  }

  insertNodesAfter(
    node: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number {
    const count = this._vertices.insertManyAfter(node, nodes);

    this.updateProperties(count);

    return count;
  }

  replaceNodesBetween(
    startNode: CoordinateNode<TVertex, TSegment>,
    endNode: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number {
    const results = this._vertices.replaceBetween(startNode, endNode, nodes);
    const nodesAffected = results.insertedCount + results.removedCount;

    this.updateProperties(nodesAffected);

    return nodesAffected;
  }

  replaceNodesFromTo(
    startNode: CoordinateNode<TVertex, TSegment>,
    endNode: CoordinateNode<TVertex, TSegment>,
    nodes: CoordinateNode<TVertex, TSegment>[]
  ): number {
    const results = this._vertices.replaceFromTo(startNode, endNode, nodes);
    const nodesAffected = results.insertedCount + results.removedCount;

    this.updateProperties(nodesAffected);

    return nodesAffected;
  }


  protected splitAdjacentNodes(
    nodeI: CoordinateNode<TVertex, TSegment>,
    nodeJ: CoordinateNode<TVertex, TSegment>,
    segIJ: SegmentNode<TVertex, TSegment>
  ) {
    if (nodeI) {
      nodeI.next = null;
      nodeI.nextSeg = null;
    }

    if (nodeJ) {
      nodeJ.prev = null;
      nodeJ.prevSeg = null;
    }

    if (segIJ) {
      segIJ.next = null;
      segIJ.nextCoord = null;

      segIJ.prev = null;
      segIJ.prevCoord = null;
    }
  }

  protected isSpecified(node: any) {
    return node !== undefined && node !== null;
  }
}