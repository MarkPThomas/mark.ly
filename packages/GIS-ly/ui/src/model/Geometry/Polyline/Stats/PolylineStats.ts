import { VertexNode } from "../Polyline";
import { Segment } from "../Segment";
import { Vertex } from "../Vertex";
import { ILength, LengthStats } from "./LengthStats";

export interface IPolylineProperties extends ILength {

}

export class PolylineStats<
  TVertex extends Vertex,
  TSegment extends Segment,
  TStats extends IPolylineProperties = IPolylineProperties
> {

  protected _firstVertex: VertexNode<TVertex, TSegment>;
  protected _lastVertex: VertexNode<TVertex, TSegment>;

  protected _statsDirty: boolean;
  get isDirty(): boolean {
    return this._statsDirty;
  }

  protected _lengthStats: LengthStats<TVertex, TSegment>;
  get stats(): TStats {
    return this.compileStats();
  }

  constructor(
    firstVertex: VertexNode<TVertex, TSegment>,
    lastVertex: VertexNode<TVertex, TSegment>
  ) {
    this._firstVertex = firstVertex;
    this._lastVertex = lastVertex;
  }

  setDirty() {
    this._statsDirty = true;
  }

  addStats() {
    this._lengthStats = new LengthStats(this._firstVertex);
    this._lengthStats.fromTo(this._firstVertex, this._lastVertex);
  }

  protected compileStats(): TStats {
    if (!this._lengthStats || this._statsDirty) {
      this.addStats();
      this._statsDirty = false;
    }

    return this._lengthStats.serialize() as TStats;
  }
}