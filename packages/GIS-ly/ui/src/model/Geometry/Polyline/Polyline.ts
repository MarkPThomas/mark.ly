import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import {
  LinkedListDoubleGeneric as List,
  NodeDouble,
  INodeDouble
} from '../../../../../../common/utils/dataStructures';

import { IPolylineStats, PolylineStats } from './Stats/PolylineStats';
import { Segment } from './Segment';
import { Vertex } from './Vertex';

export type EvaluatorArgs = { [name: string]: any };

export type Range<T> = {
  start: T | null,
  end: T | null
}

export type Reference<T> = {
  prev: T | null,
  next: T | null
}

type PolylineRange<TVertex extends Vertex, TSegment extends Segment> = {
  vertices: Range<VertexNode<TVertex, TSegment>>,
  segments: Range<SegmentNode<TVertex, TSegment>>
}

type PolylineReference<TVertex extends Vertex, TSegment extends Segment> = {
  vertices: Reference<VertexNode<TVertex, TSegment>>,
  segments: Reference<SegmentNode<TVertex, TSegment>>
}

export interface IVertexNode<TVertex extends Vertex, TSegment extends Segment> extends INodeDouble<TVertex> {
  nextSeg: SegmentNode<TVertex, TSegment> | null;
  prevSeg: SegmentNode<TVertex, TSegment> | null;
}

export class VertexNode<TVertex extends Vertex, TSegment extends Segment>
  extends NodeDouble<TVertex>
  implements
  IVertexNode<TVertex, TSegment>,
  ICloneable<VertexNode<TVertex, TSegment>>
{
  nextSeg: SegmentNode<TVertex, TSegment> | null = null;
  prevSeg: SegmentNode<TVertex, TSegment> | null = null;

  constructor(
    vertex?: TVertex,
    prevSeg: SegmentNode<TVertex, TSegment> = null,
    nextSeg: SegmentNode<TVertex, TSegment> = null
  ) {
    super(vertex ?? null);
    this.prevSeg = prevSeg;
    this.nextSeg = nextSeg;
  }

  clone(): VertexNode<TVertex, TSegment> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<TVertex>).clone();
    }

    return new VertexNode<TVertex, TSegment>(val);
  }

  static isVertexNode(vertex: any) {
    return vertex && (vertex instanceof VertexNode || 'prevSeg' in vertex);
  }
}

export interface ISegmentNode<TVertex extends Vertex, TSegment extends Segment> extends INodeDouble<TSegment> {
  nextVert: VertexNode<TVertex, TSegment>;
  prevVert: VertexNode<TVertex, TSegment>;
}

export class SegmentNode<TVertex extends Vertex, TSegment extends Segment>
  extends NodeDouble<TSegment>
  implements
  ISegmentNode<TVertex, TSegment>,
  ICloneable<SegmentNode<TVertex, TSegment>>
{
  nextVert: VertexNode<TVertex, TSegment>;
  prevVert: VertexNode<TVertex, TSegment>;

  constructor(
    prevCoord: VertexNode<TVertex, TSegment>,
    nextCoord: VertexNode<TVertex, TSegment>,
    segment?: TSegment
  ) {
    super(segment ?? null);
    this.prevVert = prevCoord;
    this.nextVert = nextCoord;
  }

  clone(): SegmentNode<TVertex, TSegment> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<TSegment>).clone();
    }

    return new SegmentNode<TVertex, TSegment>(null, null, val);
  }

  static isSegmentNode(segment: any) {
    return segment instanceof SegmentNode || 'prevVert' in segment;
  }
}


export interface IPolylineSize {
  vertices: number;
  segments: number;
}

export interface IPolyline<TVertex extends Vertex, TSegment extends Segment> {
  // Properties
  stats: IPolylineStats;

  firstVertex: VertexNode<TVertex, TSegment>;
  firstSegment: SegmentNode<TVertex, TSegment>;

  lastVertex: VertexNode<TVertex, TSegment>;
  lastSegment: SegmentNode<TVertex, TSegment>;

  // Property Methods
  /**
   * Adds derived properties to Segments and Pointss based on initial properties in the Points.
   *
   * @memberof IPolyline
   */
  addProperties(): void;


  // Query Methods
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
  vertexNodesBy(
    target: string | number | EvaluatorArgs,
    evaluator: (
      target: string | number | EvaluatorArgs,
      vertex: VertexNode<TVertex, TSegment>
    ) => boolean
  ): VertexNode<TVertex, TSegment>[];

  // Delete Methods
  trimBefore(vertex: VertexNode<TVertex, TSegment>): VertexNode<TVertex, TSegment> | null;
  trimAfter(vertex: VertexNode<TVertex, TSegment>): VertexNode<TVertex, TSegment> | null;
  trimTo(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): (VertexNode<TVertex, TSegment> | null)[];
  clear(): void;

  removeAt(vertex: VertexNode<TVertex, TSegment>): VertexNode<TVertex, TSegment> | null;
  removeAtAny(vertices: VertexNode<TVertex, TSegment>[]): VertexNode<TVertex, TSegment>[];
  removeBetween(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): VertexNode<TVertex, TSegment> | null;
  removeFromTo(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): VertexNode<TVertex, TSegment> | null;

  // Update Methods
  prepend(item: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>): void;
  append(item: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>): void;

  insertBefore(
    target: VertexNode<TVertex, TSegment>,
    item: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): number
  insertAfter(
    target: VertexNode<TVertex, TSegment>,
    item: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): number

  replaceAt(
    target: VertexNode<TVertex, TSegment>,
    item: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null;

  replaceBetween(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>,
    item: VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null;

  replaceFromTo(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>,
    item: VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null;

  splitBy(
    marker: TVertex | VertexNode<TVertex, TSegment> | Polyline<TVertex, TSegment>
  ): Polyline<TVertex, TSegment>[];
  splitByMany(
    markers: TVertex[] | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>[]
  ): Polyline<TVertex, TSegment>[];
}

export class Polyline<TVertex extends Vertex, TSegment extends Segment>
  implements
  IPolyline<TVertex, TSegment>,
  IEquatable<Polyline<TVertex, TSegment>>,
  ICloneable<Polyline<TVertex, TSegment>>
{
  protected _vertices: List<VertexNode<TVertex, TSegment>, TVertex> = new List<VertexNode<TVertex, TSegment>, TVertex>();
  protected _segments: List<SegmentNode<TVertex, TSegment>, TSegment> = new List<SegmentNode<TVertex, TSegment>, TSegment>();

  protected _stats: PolylineStats<TVertex, TSegment>;
  get stats(): IPolylineStats {
    if (!this._stats || this._stats.isDirty) {
      this._stats = new PolylineStats(this.firstVertex, this.lastVertex);
    }
    return this._stats.stats;
  }

  get firstVertex() {
    return this._vertices.head;
  }

  get firstSegment() {
    return this._segments.head;
  }

  get lastVertex() {
    return this._vertices.tail;
  }

  get lastSegment() {
    return this._segments.tail;
  }

  // Create/Clone/Copy Methods
  constructor(vertices: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | TVertex[]) {
    if (vertices) {
      if (Array.isArray(vertices)) {
        vertices.forEach((vertex: TVertex | VertexNode<TVertex, TSegment>) => {
          this.appendVertex(vertex);
        });
      } else if (VertexNode.isVertexNode(vertices)) {
        this.appendVertex(vertices);
      }
    }
  }

  /**
   * Appends vertex/node to polyline.
   *
   * This method appropriately handes cases of the node being standalone or part of an existing linked list with or without associated segments.
   *
   * @protected
   * @param {(TVertex | VertexNode<TVertex, TSegment>)} vertex
   * @memberof Polyline
   */
  protected appendVertex(vertex: TVertex | VertexNode<TVertex, TSegment>) {
    if (VertexNode.isVertexNode(vertex)) {
      let headNode = vertex as VertexNode<TVertex, TSegment>;
      while (headNode.prev) {
        headNode = headNode.prev as VertexNode<TVertex, TSegment>;
      }
      this.appendHeadVertexNode(headNode);
    } else {
      this.appendSingleVertex(vertex);
    }
    this.lastVertex.nextSeg = null;
  }

  /**
   * Appends a vertex node to the list.
   *
   * If node is the head of another linked list of vertices, this entire set of vertices is appended.
   *
   * If linked list of vertices has associated segments, the entire set of segments is also appended.
   *
   * @protected
   * @param {VertexNode<TVertex, TSegment>} vertex
   * @memberof Polyline
   */
  protected appendHeadVertexNode(vertex: VertexNode<TVertex, TSegment>) {
    this.appendSingleVertex(vertex);
    if (!vertex.nextSeg) {
      while (vertex.next) {
        const vertexNext = vertex.next as VertexNode<TVertex, TSegment>;
        this.appendSegment(vertex, vertexNext);

        vertex = vertexNext;
      }
    } else {
      this._segments.append(vertex.nextSeg);
    }
  }

  /**
   * Appends provided vertex/node to the vertices list and generates/adds an associated segment node to the segments list.
   *
   * It is assumed that this vertex has no prior references to other vertex or segment nodes.
   *
   * @protected
   * @param {(TVertex | VertexNode<TVertex, TSegment>)} vertex
   * @memberof Polyline
   */
  protected appendSingleVertex(vertex: TVertex | VertexNode<TVertex, TSegment>) {
    const vertexI = this.lastVertex;

    this._vertices.append(vertex);

    const vertexJ = this.lastVertex;

    this.appendSegment(vertexI, vertexJ);

    if (this.firstVertex === this.lastVertex) {
      this.firstVertex.prevSeg = null;
    }
  }

  /**
   * Creates a new segment node, with value properties, and appends it to the existing segments list.
   *
   * @protected
   * @param {VertexNode<TVertex, TSegment>} vertexI
   * @param {VertexNode<TVertex, TSegment>} vertexJ
   * @memberof Polyline
   */
  protected appendSegment(
    vertexI: VertexNode<TVertex, TSegment>,
    vertexJ: VertexNode<TVertex, TSegment>
  ) {
    if (vertexI) {
      const segment = this.addSegment(vertexI, vertexJ);
      this._segments.append(segment);
    }
  }

  /**
   * Adds a new segment node associated with the provided vertices.
   *
   * First-order segment properties derived from the nodes are also generated.
   *
   * @protected
   * @param {VertexNode<TVertex, TSegment>} vertexI
   * @param {(VertexNode<TVertex, TSegment> | null)} vertexJ
   * @return {*}  {(SegmentNode<TVertex, TSegment> | null)}
   * @memberof Polyline
   */
  protected addSegment(
    vertexI: VertexNode<TVertex, TSegment>,
    vertexJ: VertexNode<TVertex, TSegment> | null
  ): SegmentNode<TVertex, TSegment> | null {
    if (!vertexI || !vertexJ) {
      return null;
    }

    const segmentVal = this.createSegmentValue(vertexI.val, vertexJ.val);
    const segmentInsert = new SegmentNode(vertexI, vertexJ, segmentVal);

    vertexI.nextSeg = segmentInsert;
    vertexJ.prevSeg = segmentInsert;

    return segmentInsert;
  }

  /**
   * Updates the segment value properties of the provided segment node based on the provided vertex values.
   *
   * @protected
   * @param {SegmentNode<TVertex, TSegment>} segment
   * @param {TVertex} vertexI
   * @param {TVertex} vertexJ
   * @memberof Polyline
   */
  protected updateSegment(
    segment: SegmentNode<TVertex, TSegment>,
    vertexI: TVertex,
    vertexJ: TVertex
  ) {

    const updatedSegVal = this.createSegmentValue(vertexI, vertexJ);
    segment.val = updatedSegVal;
  }

  /**
   * Sets/updates/derives segment value properties for all existing segments in the polyline based on their adjacent nodes.
   *
   * @protected
   * @memberof Polyline
   */
  protected addPropertiesToSegments() {
    let coord = this._vertices.head?.next as VertexNode<TVertex, TSegment>;

    while (coord) {
      const prevCoord = coord.prev as VertexNode<TVertex, TSegment>;
      const segmentValue = this.createSegmentValue(prevCoord.val, coord.val);
      coord.prevSeg.val = segmentValue;

      coord = coord.next as VertexNode<TVertex, TSegment>;
    }
  }

  /**
   * This is mostly used as a convenient hook for deriving classes to create the appropriate segment type.
   *
   * @protected
   * @param {TVertex} prevCoord
   * @param {TVertex} nextCoord
   * @return {*}  {TSegment}
   * @memberof Polyline
   */
  protected createSegmentValue(prevCoord: TVertex, nextCoord: TVertex): TSegment {
    return new Segment() as TSegment;
  }

  /**
   * Updates 2nd-order properties of the provided vertex.
   *
   * This is empty in the {@link Polyline} class and can be used by overrides in subclasses to hook update procedures into
   * base class functionality.
   *
   * @protected
   * @param {VertexNode<TVertex, TSegment>[]} vertices
   * @memberof Polyline
   */
  protected updatePathProperties(vertices: VertexNode<TVertex, TSegment>[]) {
    this.setDirty();
  }

  protected setDirty() {
    this._stats.setDirty();
  }

  /**
   * Lazy way to update segments & vertices.
   *
   * Updates ALL 1st-order segment values and ALL 2nd order vertex values.
   *
   * @protected
   * @param {number} numberNodesAffected
   * @memberof Polyline
   */
  protected updateAllSegmentsAndProperties(numberNodesAffected: number) {
    if (numberNodesAffected) {
      this._segments = new List();

      let currNode = this._vertices.head?.next as VertexNode<TVertex, TSegment>;
      while (currNode) {
        const vertexI = currNode.prev as VertexNode<TVertex, TSegment>;
        const vertexJ = currNode;
        this.appendSegment(vertexI, vertexJ);

        currNode = currNode.next as VertexNode<TVertex, TSegment>;
      }

      this.addProperties();
    }
  }

  protected createPolyline(coords: VertexNode<TVertex, TSegment>[] = []): Polyline<TVertex, TSegment> {
    // TODO: Consider making abstract class so that this is abstracted

    return new Polyline<TVertex, TSegment>(coords);
  }

  equals(polyline: Polyline<TVertex, TSegment>): boolean {
    return this._vertices.equals(polyline._vertices);
  }

  clone(): Polyline<TVertex, TSegment> {
    return this.cloneFromTo();
  }

  cloneFromTo(
    startVertex: VertexNode<TVertex, TSegment> | null = null,
    endVertex: VertexNode<TVertex, TSegment> | null = null
  ): Polyline<TVertex, TSegment> | null {
    startVertex = startVertex ?? this.firstVertex;
    if (!startVertex) {
      return null;
    }

    endVertex = endVertex ?? this.lastVertex;

    const polylineClone = this.createPolyline();

    const vertexI = startVertex;
    let vertexIClone = vertexI.clone();
    let vertexJ = vertexI.next as VertexNode<TVertex, TSegment>;
    let segment = this.firstSegment as SegmentNode<TVertex, TSegment>;

    polylineClone._vertices.append(vertexIClone);

    while (vertexJ && vertexJ.prev !== endVertex) {
      const vertexJClone = vertexJ.clone();
      const segmentClone = segment.clone();

      vertexIClone.nextSeg = segmentClone;
      vertexJClone.prevSeg = segmentClone;
      segmentClone.prevVert = vertexIClone;
      segmentClone.nextVert = vertexJClone;

      polylineClone._vertices.append(vertexJClone);
      polylineClone._segments.append(segmentClone);

      vertexIClone = vertexJClone;
      vertexJ = vertexJ.next as VertexNode<TVertex, TSegment>;
      segment = segment.next as SegmentNode<TVertex, TSegment>;
    }

    if (startVertex !== this.firstVertex) {
      polylineClone.updatePathProperties([polylineClone.firstVertex as VertexNode<TVertex, TSegment>]);
    }
    if (endVertex !== this.lastVertex) {
      polylineClone.updatePathProperties([polylineClone.lastVertex as VertexNode<TVertex, TSegment>]);
    }

    return polylineClone as Polyline<TVertex, TSegment>;
  }

  // Property Methods

  // TODO: These are hooks for updating properties. Mostly redundant now? See about removing after done w. Route/Track polylines
  addProperties() {
    this.addPropertiesToNodes();
  }

  protected addPropertiesToNodes() {
    this.addPropertiesToSegments();
  }

  // Query Methods
  size(): {
    vertices: number;
    segments: number;
  } {
    return {
      vertices: this._vertices.size(),
      segments: this._segments.size()
    }
  }

  vertices(): TVertex[] {
    return this._vertices.toArray() as TVertex[];
  }

  segments(): TSegment[] {
    return this._segments.toArray() as TSegment[];
  }

  vertexNodesBy(
    target: any,
    evaluator: (
      target: any,
      vertexNode: VertexNode<TVertex, TSegment>
    ) => boolean
  ): VertexNode<TVertex, TSegment>[] {
    const nodes: VertexNode<TVertex, TSegment>[] = [];

    let node = this._vertices.head as VertexNode<TVertex, TSegment>;
    while (node) {
      if (evaluator(target, node)) {
        nodes.push(node);
      }

      node = node.next as VertexNode<TVertex, TSegment>;
    }

    return nodes;
  }

  vertexNodesByVertex(vertex: TVertex) {
    return this.vertexNodesBy(
      vertex,
      (target: TVertex, vertexNode: VertexNode<TVertex, TSegment>) => vertexNode.equals(target));
  }

  statsFromTo(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>
  ): IPolylineStats {
    const stats = new PolylineStats(startVertex, endVertex);
    return stats.stats;
  }

  static isPolyline(polyline: any) {
    return polyline instanceof Polyline || 'firstVertex' in polyline;
  }

  protected polylineIsEmpty(): boolean {
    return !this.firstVertex;
  }

  protected isOnlyVertexInPolyline(vertex: VertexNode<TVertex, TSegment>): boolean {
    return vertex && !vertex.next && !vertex.prev && vertex === this.firstVertex;
  }

  protected isOnlySegmentInPolyline(segment: SegmentNode<TVertex, TSegment>): boolean {
    return !segment.next && !segment.prev && segment === this.firstSegment;
  }
  /**
   * Very rough spot check.
   * Basically, any vertex that is in the polyline should have at least either one next/prev vertex, or be the
   * sole vertex in the polyline, so is concurrently the first index.
   *
   * @protected
   * @param {VertexNode<TVertex, TSegment>} vertex
   * @return {*}  {boolean}
   * @memberof Polyline
   */
  protected isNotInPolyline(vertex: VertexNode<TVertex, TSegment>): boolean {
    return !vertex
      || (!vertex.next && !vertex.prev && vertex !== this.firstVertex);
  }

  /**
   * Very rough spot check determining if neither vertex is in the polyline.
   * Uses {@link isNotInPolyline}
   *
   * @protected
   * @param {VertexNode<TVertex, TSegment>} vertexStart
   * @param {VertexNode<TVertex, TSegment>} vertexEnd
   * @return {*}
   * @memberof Polyline
   */
  protected areNotInPolyline(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): boolean {
    return ((!vertexStart || this.isNotInPolyline(vertexStart))
      && (!vertexEnd || this.isNotInPolyline(vertexEnd)))
  }

  protected areAdjacent(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): boolean {
    return vertexStart?.next === vertexEnd && vertexEnd?.prev === vertexStart;
  }

  protected isSpecified(value: any): boolean {
    return value !== undefined && value !== null;
  }

  protected isValidSplitPolyline(): boolean {
    return !(this.polylineIsEmpty() || this.isOnlyVertexInPolyline(this.firstVertex) || this.isOnlySegmentInPolyline(this.firstSegment));
  }

  protected isValidSplitPolylineTarget(polyline: IPolyline<TVertex, TSegment>): boolean {
    return polyline.firstVertex && polyline.firstVertex !== polyline.lastVertex;
  }

  protected getAsPolyline(
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): Polyline<TVertex, TSegment> {
    if (VertexNode.isVertexNode(item)) {
      return new Polyline<TVertex, TSegment>(item as VertexNode<TVertex, TSegment>);
    } else if (Array.isArray(item)) {
      return new Polyline<TVertex, TSegment>(item);
    } else if (Polyline.isPolyline(item)) {
      return item as Polyline<TVertex, TSegment>;
    } else if (item instanceof Vertex) {
      const itemNode = new VertexNode<TVertex, TSegment>(item);
      return new Polyline<TVertex, TSegment>(itemNode);
    }
  }

  protected getItemRange(
    item: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>
  ): PolylineRange<TVertex, TSegment> {

    let startVertex: VertexNode<TVertex, TSegment>;
    let endVertex: VertexNode<TVertex, TSegment>;
    let startSegment: SegmentNode<TVertex, TSegment>;
    let endSegment: SegmentNode<TVertex, TSegment>;

    if (VertexNode.isVertexNode(item)) {
      const itemNode = item as VertexNode<TVertex, TSegment>
      startVertex = itemNode;
      endVertex = itemNode;
      startSegment = null;
      endSegment = null;
    } else if (Array.isArray(item)) {
      const prePolyline = this.getAsPolyline(item);

      return this.getItemRange(prePolyline);

    } else if (Polyline.isPolyline(item)) {
      const itemPolyline = item as Polyline<TVertex, TSegment>;
      startVertex = itemPolyline.firstVertex;
      endVertex = itemPolyline.lastVertex;
      startSegment = itemPolyline.firstSegment;
      endSegment = itemPolyline.lastSegment;
    }

    return {
      vertices: {
        start: startVertex,
        end: endVertex
      },
      segments: {
        start: startSegment,
        end: endSegment
      }
    }
  }

  protected getLocalNodes(uniqueMarkers: Set<IVertexNode<TVertex, TSegment>>) {
    const localMarkers: Set<IVertexNode<TVertex, TSegment>> = new Set();

    const markers = Array.from(uniqueMarkers);
    for (let i = 0; i < markers.length; i++) {
      const marker = this.vertexNodesByVertex(markers[i].val)[0];
      if (marker) {
        localMarkers.add(marker);
      }
    }

    return localMarkers;
  }

  // Delete Methods
  trimBefore(
    vertex: VertexNode<TVertex, TSegment>
  ): VertexNode<TVertex, TSegment> | null {
    if (!vertex || this.polylineIsEmpty() || this.isNotInPolyline(vertex)) {
      return null;
    }

    const lastSegment = this.lastVertex.prevSeg;
    const trimmedHead = this._vertices.trimHead(vertex);

    if (trimmedHead) {
      if (this.isOnlyVertexInPolyline(this.firstVertex)) {
        this._segments.remove(lastSegment).node;
        lastSegment.nextVert = null;

        this.firstVertex.prevSeg = null;
        this.firstVertex.nextSeg = null;
      } else {
        if (vertex.nextSeg) {
          this._segments.trimHead(vertex.nextSeg);
        }

        if (vertex && vertex.prevSeg) {
          const lastHeadSegment = vertex.prevSeg;
          lastHeadSegment.nextVert = null;
          vertex.prevSeg = null;
        }
      }

      if (vertex) {
        this.updatePathProperties([vertex]);
      }

      return trimmedHead;
    } else {
      return null;
    }
  }

  trimAfter(
    vertex: VertexNode<TVertex, TSegment>
  ): VertexNode<TVertex, TSegment> | null {
    if (!vertex || this.polylineIsEmpty() || this.isNotInPolyline(vertex)) {
      return null;
    }

    const firstSegment = this.firstVertex.nextSeg;
    const trimmedTailHead = this._vertices.trimTail(vertex);

    if (trimmedTailHead) {
      if (this.isOnlyVertexInPolyline(this.firstVertex)) {
        this._segments.remove(firstSegment).node;
        firstSegment.prevVert = null;

        this.firstVertex.prevSeg = null;
        this.firstVertex.nextSeg = null;
      } else {
        if (vertex.prevSeg) {
          this._segments.trimTail(vertex.prevSeg);
        }

        if (vertex.nextSeg) {
          const firstTailSegment = vertex.nextSeg;
          firstTailSegment.prevVert = null;
          vertex.nextSeg = null;
        }
      }

      if (vertex) {
        this.updatePathProperties([vertex]);
      }

      return trimmedTailHead;
    } else {
      return null;
    }
  }

  trimTo(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): (VertexNode<TVertex, TSegment> | null)[] {
    const headTrim = vertexStart ? this.trimBefore(vertexStart) : null;
    const tailTrim = vertexEnd ? this.trimAfter(vertexEnd) : null;

    if (vertexStart) {
      this.updatePathProperties([vertexStart]);
    }
    if (vertexEnd) {
      this.updatePathProperties([vertexEnd]);
    }

    return [headTrim, tailTrim];
  }

  clear() {
    this._vertices = new List<VertexNode<TVertex, TSegment>, TVertex>();
    this._segments = new List<SegmentNode<TVertex, TSegment>, TSegment>();
  }


  removeAt(vertex: VertexNode<TVertex, TSegment>): VertexNode<TVertex, TSegment> | null {
    if (!vertex || this.polylineIsEmpty() || this.isNotInPolyline(vertex)) {
      return null;
    } else if (this.isOnlyVertexInPolyline(vertex)) {
      return this._vertices.remove(vertex).node;
    } else if (vertex === this.firstVertex) {
      return this.trimBefore(vertex.next as VertexNode<TVertex, TSegment>);
    } else if (vertex === this.lastVertex) {
      return this.trimAfter(vertex.prev as VertexNode<TVertex, TSegment>);
    }

    const vertNext = vertex.next as VertexNode<TVertex, TSegment>;
    const segment = vertex.nextSeg as SegmentNode<TVertex, TSegment>;
    const segPrev = segment.prev as SegmentNode<TVertex, TSegment>;

    if (segment && this._segments.remove(segment).node && this._vertices.remove(vertex).node) {
      vertNext.prevSeg = segPrev;
      segPrev.nextVert = vertNext;

      vertex.prevSeg = null;
      segment.nextVert = null;

      this.updatePriorSegmentProps(segPrev);
      this.updatePathProperties([segPrev.prevVert, segPrev.nextVert]);

      return vertex;
    }
    return null;
  }

  removeAtAny(vertices: VertexNode<TVertex, TSegment>[]): VertexNode<TVertex, TSegment>[] {
    if (this.polylineIsEmpty()) {
      return [];
    }

    const removed = [];

    vertices.forEach((vertex) => {
      if (this.removeAt(vertex)) {
        removed.push(vertex);
      }
    });

    return removed;
  }

  removeBetween(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): VertexNode<TVertex, TSegment> | null {
    if (this.polylineIsEmpty()
      || this.areNotInPolyline(vertexStart, vertexEnd)
      || this.areAdjacent(vertexStart, vertexEnd)
      || vertexStart === vertexEnd) {
      return null;
    }

    if ((!vertexStart || this.isNotInPolyline(vertexStart))) {
      return this.trimBefore(vertexEnd);
    }
    if (!vertexEnd || this.isNotInPolyline(vertexEnd)) {
      return this.trimAfter(vertexStart);
    }

    const vertPrev = vertexStart as VertexNode<TVertex, TSegment>;
    const vertNext = vertexEnd;

    const segPrev = vertPrev.nextSeg;
    const segNext = vertNext === this.lastVertex ? segPrev : vertNext.nextSeg;

    const removedVertexHead = vertPrev.next as VertexNode<TVertex, TSegment>;
    const removedSegmentTail = vertNext === this.lastVertex ? this.lastSegment : segNext.prev as SegmentNode<TVertex, TSegment>;

    // Remove Vertices & Segments
    this._vertices.removeBetween(vertPrev, vertNext);
    if (segNext === segPrev) {
      this._segments.trimTail(segNext);
    } else {
      this._segments.removeBetween(segPrev, segNext);
    }

    // Correct cross-references
    segPrev.nextVert = vertNext;
    vertNext.prevSeg = segPrev;

    // Disconnect cross-references of removed section
    removedVertexHead.prevSeg = null;
    if (removedSegmentTail) {
      removedSegmentTail.nextVert = null;
    }

    this.updatePriorSegmentProps(segPrev);
    this.updatePathProperties([segPrev.prevVert, segPrev.nextVert]);

    if (removedVertexHead) {
      return removedVertexHead;
    } else {
      return null;
    }
  }

  removeFromTo(
    vertexStart: VertexNode<TVertex, TSegment>,
    vertexEnd: VertexNode<TVertex, TSegment>
  ): VertexNode<TVertex, TSegment> | null {
    if (vertexStart === vertexEnd) {
      return this.removeAt(vertexStart) ? vertexStart : null;
    }

    if (this.firstVertex === vertexStart && this.lastVertex === vertexEnd) {
      const removedHead = this.firstVertex;
      this.clear();
      return removedHead;
    }

    const prevVertexStart = vertexStart?.prev as VertexNode<TVertex, TSegment>;
    const nextVertexEnd = vertexEnd?.next as VertexNode<TVertex, TSegment>;

    return this.removeBetween(prevVertexStart, nextVertexEnd);
  }



  // Update Methods
  prepend(
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    const reference = {
      vertices: {
        prev: null,
        next: this.firstVertex
      },
      segments: {
        prev: null,
        next: this.firstSegment
      }
    }

    return this.insert(item, reference, returnListCount);
  }

  append(
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    const reference = {
      vertices: {
        prev: this.lastVertex,
        next: null
      },
      segments: {
        prev: this.lastSegment,
        next: null
      }
    }

    return this.insert(item, reference, returnListCount);
  }

  insertBefore(
    target: VertexNode<TVertex, TSegment>,
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    if (this.polylineIsEmpty() || !target || this.isNotInPolyline(target)) {
      return 0;
    } else if (target) {
      const reference = {
        vertices: {
          prev: target.prev as VertexNode<TVertex, TSegment>,
          next: target
        },
        segments: {
          prev: target.prevSeg,
          next: target.nextSeg
        }
      }

      return this.insert(item, reference, returnListCount);
    } else {
      return 0;
    }
  }

  insertAfter(
    target: VertexNode<TVertex, TSegment>,
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    if (this.polylineIsEmpty() || !target || this.isNotInPolyline(target)) {
      return 0;
    } else if (target) {
      const reference = {
        vertices: {
          prev: target,
          next: target.next as VertexNode<TVertex, TSegment>
        },
        segments: {
          prev: target!.nextSeg ?? target!.prevSeg,
          next: target!.nextSeg
            ? target!.nextSeg.next as SegmentNode<TVertex, TSegment>
            : null
        }
      }

      return this.insert(item, reference, returnListCount);
    } else {
      return 0;
    }
  }

  replaceAt(
    target: VertexNode<TVertex, TSegment>,
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null {
    if (this.polylineIsEmpty() || !target || this.isNotInPolyline(target)) {
      return null;
    }

    const startVertex = target.prev as VertexNode<TVertex, TSegment>;
    const endVertex = target.next as VertexNode<TVertex, TSegment>;

    return this.replaceBetween(startVertex, endVertex, item, returnListCount);
  }

  replaceBetween(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>,
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null {
    if (this.polylineIsEmpty()
      || (!startVertex && !endVertex)
      || this.areNotInPolyline(startVertex, endVertex)
      || startVertex === endVertex) {
      return null;
    }
    const removedHead = this.removeBetween(startVertex, endVertex);
    const insertedCount = startVertex
      ? this.insertAfter(startVertex, item, returnListCount)
      : this.insertBefore(endVertex, item, returnListCount);

    return {
      removed: removedHead,
      inserted: insertedCount
    };
  }

  replaceFromTo(
    startVertex: VertexNode<TVertex, TSegment>,
    endVertex: VertexNode<TVertex, TSegment>,
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null {
    if (this.polylineIsEmpty() || (!startVertex && !endVertex) || this.areNotInPolyline(startVertex, endVertex)) {
      return null;
    }

    if (startVertex === null && endVertex === this.firstVertex) {
      return this.replaceBetween(startVertex, endVertex.next as VertexNode<TVertex, TSegment>, item, returnListCount);
    }

    if (endVertex === null && startVertex === this.lastVertex) {
      return this.replaceBetween(startVertex.prev as VertexNode<TVertex, TSegment>, endVertex, item, returnListCount);
    }


    const prevVertexStart = startVertex.prev as VertexNode<TVertex, TSegment>;
    const nextVertexEnd = endVertex.next as VertexNode<TVertex, TSegment>;

    if (!prevVertexStart && !nextVertexEnd) {
      const removedHead = this.firstVertex;
      this.clear();

      let insertedCount = 0;
      if (Array.isArray(item)) {
        item.forEach((vertex: TVertex | VertexNode<TVertex, TSegment>) => {
          this.appendVertex(vertex);
        });
        insertedCount = item.length;
      } else if (VertexNode.isVertexNode(item)) {
        this.appendVertex(item as VertexNode<TVertex, TSegment>);
        insertedCount = 1;
      } else if (Polyline.isPolyline(item)) {
        const itemPolyline = item as Polyline<TVertex, TSegment>
        this._vertices = itemPolyline._vertices;
        this._segments = itemPolyline._segments;

        if (returnListCount) {
          insertedCount = itemPolyline.size().vertices;
        } else {
          insertedCount = 1;
        }
      } else {
        return undefined;
      }
      return {
        removed: removedHead,
        inserted: insertedCount
      };
    } else {
      return this.replaceBetween(prevVertexStart, nextVertexEnd, item, returnListCount);
    }
  }


  protected insert(
    item: TVertex | TVertex[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>,
    reference: PolylineReference<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    if (!item || (Array.isArray(item) && !item.length)) {
      return 0;
    }

    const polyline = this.getAsPolyline(item);
    const itemRange = this.getItemRange(polyline);

    const numberInsertedVertices = this.insertVertices(polyline._vertices, reference.vertices, returnListCount);

    this.insertSegmentSplice(itemRange.vertices, reference.vertices, polyline._segments);
    this.updatePriorSegmentConnections(itemRange.vertices.start, reference.segments);

    this.insertSegments(polyline._segments, reference.segments);

    this.updatePriorSegmentProps(reference.segments.prev);

    if (numberInsertedVertices) {
      if (reference.vertices.prev) {
        this.updatePathProperties([reference.vertices.prev as VertexNode<TVertex, TSegment>]);
      }
      if (reference.vertices.next) {
        this.updatePathProperties([reference.vertices.next as VertexNode<TVertex, TSegment>]);
      }
      if (itemRange.vertices.start) {
        this.updatePathProperties([itemRange.vertices.start as VertexNode<TVertex, TSegment>]);
      }
      if (itemRange.vertices.end) {
        this.updatePathProperties([itemRange.vertices.end as VertexNode<TVertex, TSegment>]);
      }
    }

    return numberInsertedVertices;
  }

  protected insertVertices(
    insert: List<VertexNode<TVertex, TSegment>, TVertex>,
    reference: Reference<VertexNode<TVertex, TSegment>>,
    returnListCount: boolean = false
  ): number {
    if (!reference.prev) {
      return this._vertices.prependMany(insert, returnListCount);
    } else if (!reference.next) {
      return this._vertices.appendMany(insert, returnListCount);
    } else {
      return this._vertices.insertManyBefore(reference.next, insert, returnListCount);
    }
  }

  protected insertSegmentSplice(
    insert: Range<VertexNode<TVertex, TSegment>>,
    reference: Reference<VertexNode<TVertex, TSegment>>,
    segments: List<SegmentNode<TVertex, TSegment>, TSegment>
  ): void {
    if (this.firstVertex === this.lastVertex) {
      return
    } else if (reference.next) {
      const segmentSplice = this.addSegment(insert.end, reference.next);
      segments.append(segmentSplice);
    } else {
      const segmentSplice = this.addSegment(reference.prev, insert.start);
      segments.prepend(segmentSplice);
    }
  }

  protected updatePriorSegmentConnections(
    insertStartVertex: VertexNode<TVertex, TSegment>,
    segments: Reference<SegmentNode<TVertex, TSegment>> | null
  ) {
    if (segments.prev && segments.next) {
      segments.prev.nextVert = insertStartVertex;
      insertStartVertex.prevSeg = segments.prev;
    }
  }

  protected insertSegments(
    insert: List<SegmentNode<TVertex, TSegment>, TSegment>,
    reference: Reference<SegmentNode<TVertex, TSegment>>
  ) {
    if (!reference) {
      return;
    } else if (!reference.prev) {
      this._segments.prependMany(insert);
    } else if (!reference.next) {
      this._segments.appendMany(insert);
    } else {
      this._segments.insertManyBefore(reference.next, insert);
    }
  }

  protected updatePriorSegmentProps(segmentPrev: SegmentNode<TVertex, TSegment>) {
    if (segmentPrev) {
      this.updateSegment(segmentPrev, segmentPrev.prevVert?.val, segmentPrev.nextVert?.val);
    }
  }

  // Split Methods
  splitBy(
    marker: TVertex | VertexNode<TVertex, TSegment> | Polyline<TVertex, TSegment>
  ): Polyline<TVertex, TSegment>[] {
    if (!this.isValidSplitPolyline() || !marker) {
      return [this];
    }

    if (VertexNode.isVertexNode(marker)) {
      return this.splitByVertex(marker as VertexNode<TVertex, TSegment>);
    } else if (Polyline.isPolyline(marker)) {
      return this.splitBySubPolyline(marker as Polyline<TVertex, TSegment>);
    } else if (Array.isArray(marker)) {
      const markerReference = this.vertexNodesByVertex(marker as TVertex)[0] as VertexNode<TVertex, TSegment>;
      return this.splitByVertex(markerReference);
    } else {
      return [this];
    }
  }

  splitByMany(
    markers: TVertex[] | VertexNode<TVertex, TSegment>[] | Polyline<TVertex, TSegment>[]
  ): Polyline<TVertex, TSegment>[] {
    if (!markers.length || !this.isValidSplitPolyline()) {
      return [this];
    }

    if (VertexNode.isVertexNode(markers)) {
      return this.splitByVertices(markers as VertexNode<TVertex, TSegment>[]);
    } else if (Polyline.isPolyline(markers)) {
      return this.splitBySubPolylines(markers as Polyline<TVertex, TSegment>[]);
    } else if (Array.isArray(markers)) {
      if (VertexNode.isVertexNode(markers[0])) {
        return this.splitByVertices(markers as VertexNode<TVertex, TSegment>[]);
      } else {
        const markerReferences = markers.map((marker) => this.vertexNodesByVertex(marker)[0]) as VertexNode<TVertex, TSegment>[];
        return this.splitByVertices(markerReferences);
      }
    } else {
      return [this];
    }
  }

  protected splitByVertices(vertices: VertexNode<TVertex, TSegment>[]): Polyline<TVertex, TSegment>[] {
    const markerSet = new Set<VertexNode<TVertex, TSegment>>();
    vertices.forEach((vertex) => {
      markerSet.add(vertex);
    });

    return this.splitByUniqueVertices(markerSet);
  }

  protected splitBySubPolyline(
    polyline: IPolyline<TVertex, TSegment>
  ): Polyline<TVertex, TSegment>[] {
    if (!this.isValidSplitPolylineTarget(polyline)) {
      return [this];
    }

    const uniqueMarkers = new Set<IVertexNode<TVertex, TSegment>>();
    uniqueMarkers.add(polyline.firstVertex);
    uniqueMarkers.add(polyline.lastVertex);

    const localMarkers = this.getLocalNodes(uniqueMarkers);

    return this.splitByUniqueVertices(localMarkers);
  }

  protected splitBySubPolylines(polylines: IPolyline<TVertex, TSegment>[]): Polyline<TVertex, TSegment>[] {
    const uniqueMarkers = new Set<IVertexNode<TVertex, TSegment>>();
    polylines.forEach((polyline) => {
      if (this.isValidSplitPolylineTarget(polyline)) {
        uniqueMarkers.add(polyline.firstVertex);
        uniqueMarkers.add(polyline.lastVertex);
      };
    });

    const localMarkers = this.getLocalNodes(uniqueMarkers);

    return this.splitByUniqueVertices(localMarkers);
  }

  protected splitByUniqueVertices(vertices: Set<IVertexNode<TVertex, TSegment>>): Polyline<TVertex, TSegment>[] {
    const splitPolys: Polyline<TVertex, TSegment>[] = [];
    let target: Polyline<TVertex, TSegment> = this;

    const uniqueVertices: IVertexNode<TVertex, TSegment>[] = Array.from(vertices);
    for (let i = 0; i < uniqueVertices.length; i++) {
      const currentSplit = target.splitByVertex(uniqueVertices[i]);

      if (currentSplit.length === 2) {
        splitPolys.push(currentSplit[0]);
        target = currentSplit[1];
      } else {
        target = currentSplit[0];
      }

      if (i === uniqueVertices.length - 1) {
        if (currentSplit.length === 2) {
          splitPolys.push(currentSplit[1]);
        } else {
          splitPolys.push(currentSplit[0]);
        }
      }
    }

    return splitPolys;
  }

  protected splitByVertex(vertex: IVertexNode<TVertex, TSegment>): Polyline<TVertex, TSegment>[] {
    if (!vertex || this.firstVertex.equals(vertex.val) || this.lastVertex.equals(vertex.val)) {
      return [this];
    }

    const nextVert = vertex.next as IVertexNode<TVertex, TSegment>;
    const prevSeg = vertex.prevSeg;
    const nextSeg = vertex.nextSeg;

    // Clone & Connect
    const cloneVert = (vertex as VertexNode<TVertex, TSegment>).clone();
    cloneVert.prev = null;
    cloneVert.next = nextVert;
    cloneVert.prevSeg = null;
    cloneVert.nextSeg = nextSeg;

    nextVert.prev = cloneVert;
    nextSeg.prevVert = cloneVert;

    // Disconnect
    vertex.next = null;
    vertex.nextSeg = null;
    prevSeg.next = null;
    nextSeg.prev = null

    // Regenerate
    const polylineI = this.createPolyline([this.firstVertex]);
    const polylineJ = this.createPolyline([cloneVert]);

    this.updatePathProperties([
      polylineI.lastVertex,
      polylineJ.firstVertex
    ]);

    return [polylineI, polylineJ];
  }
}