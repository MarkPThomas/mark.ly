import { BasicStats } from "../../Stats";
import { Polyline, VertexNode } from "../Polyline";
import { Segment } from "../Segment";
import { Vertex } from "../Vertex";
import { ILength, LengthStats } from "./LengthStats";

export interface IPolylineStatsCriteria {
  isLengthConsidered?: (number: number) => boolean;
}

export interface IPolylineStats extends ILength {
}

export class PolylineStats<
  TVertex extends Vertex,
  TSegment extends Segment,
  TStats extends IPolylineStats = IPolylineStats
> {

  protected _polyline: Polyline<TVertex, TSegment>
  protected _firstVertex: VertexNode<TVertex, TSegment>;
  protected _lastVertex: VertexNode<TVertex, TSegment>;
  protected _isStatConsidered: IPolylineStatsCriteria;

  protected _statsDirty: boolean;
  get isDirty(): boolean {
    return this._statsDirty;
  }

  protected _lengthStats: LengthStats<TVertex, TSegment>;
  get stats(): TStats {
    return this.compileStats();
  }

  protected constructor(
    polyline?: Polyline<TVertex, TSegment>,
    isStatConsidered?: IPolylineStatsCriteria,
    firstVertex?: VertexNode<TVertex, TSegment>,
    lastVertex?: VertexNode<TVertex, TSegment>
  ) {
    this._polyline = polyline;
    this._firstVertex = firstVertex;
    this._lastVertex = lastVertex;
    this._isStatConsidered = {
      isLengthConsidered: isStatConsidered?.isLengthConsidered
    };
    this._statsDirty = true;
  }

  static fromPolyline<TVertex extends Vertex, TSegment extends Segment>(
    polyline: Polyline<TVertex, TSegment>,
    isStatConsidered?: IPolylineStatsCriteria
  ): PolylineStats<TVertex, TSegment, IPolylineStats> {
    return new PolylineStats(polyline, isStatConsidered);
  }

  static fromVertices<TVertex extends Vertex, TSegment extends Segment>(
    firstVertex: VertexNode<TVertex, TSegment>,
    lastVertex: VertexNode<TVertex, TSegment>,
    isStatConsidered?: IPolylineStatsCriteria
  ): PolylineStats<TVertex, TSegment, IPolylineStats> {
    return new PolylineStats(null, isStatConsidered, firstVertex, lastVertex);
  }

  setDirty() {
    this._statsDirty = true;
  }

  addStats() {
    if (this._polyline || this._firstVertex) {
      this.initializeAndAddStats();
      this._statsDirty = false;
    }
  }

  protected initializeAndAddStats() {
    this._lengthStats = new LengthStats(this._isStatConsidered.isLengthConsidered);
    this.addStatsByState(this._lengthStats);
  }

  protected addStatsByState<TStat extends BasicStats<TVertex, TSegment>>(cb: TStat) {
    if (this._polyline) {
      cb.of(this._polyline);
    } else if (this._firstVertex) {
      cb.fromTo(this._firstVertex, this._lastVertex);
    }
  }

  protected compileStats(): TStats {
    if (!this._lengthStats || this._statsDirty) {
      this.addStats();
    }

    return this._lengthStats
      ? this._lengthStats.serialize() as TStats
      : { length: 0 } as TStats;
  }
}