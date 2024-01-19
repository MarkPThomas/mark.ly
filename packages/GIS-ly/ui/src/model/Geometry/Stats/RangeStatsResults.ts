import { INodeOfInterest } from ".";
import { Vertex, Segment } from "../Polyline";
import { NodeOfInterest } from "./INodeOfInterest";

export interface IRangeStatsResults<
  TVertex extends Vertex,
  TSegment extends Segment
> {
  min: INodeOfInterest<TVertex, TSegment>;
  stdMin2?: number;
  stdMin1?: number;
  avg: number;
  mdn?: INodeOfInterest<TVertex, TSegment>;
  stdMax1?: number;
  stdMax2?: number;
  max: INodeOfInterest<TVertex, TSegment>;
  std?: number;
}

type RangeStatsResultsProps<
  TVertex extends Vertex,
  TSegment extends Segment
> = {
  avg?: number,
  min?: INodeOfInterest<TVertex, TSegment>,
  max?: INodeOfInterest<TVertex, TSegment>,
  mdn?: INodeOfInterest<TVertex, TSegment>,
  std?: number
}

export class RangeStatsResults<
  TVertex extends Vertex,
  TSegment extends Segment
> {
  private _avg: number;
  private _min: INodeOfInterest<TVertex, TSegment>;
  private _max: INodeOfInterest<TVertex, TSegment>;
  private _mdn: INodeOfInterest<TVertex, TSegment>;
  private _std: number;

  constructor(props: RangeStatsResultsProps<TVertex, TSegment>) {
    this._avg = props.avg ?? 0;
    this._min = props.min ?? NodeOfInterest.empty();
    this._max = props.max ?? NodeOfInterest.empty();
    this._mdn = props.mdn ?? NodeOfInterest.empty();
    this._std = props.std ?? 0;
  }

  protected static emptyINodeOfInterest() {
    return { value: 0, nodes: [] };
  }

  serialize(): IRangeStatsResults<TVertex, TSegment> {
    const statsBase = {
      min: this._min,
      avg: this._avg,
      max: this._max
    };

    let mdnStats = this._mdn.nodes.length ? {
      mdn: this._mdn
    } : {};

    let stdStats = this._std ? {
      stdMin1: this._avg - this._std,
      stdMax1: this._avg + this._std,
      stdMin2: this._avg - 2 * this._std,
      stdMax2: this._avg + 2 * this._std,
      std: this._std
    } : {};

    return {
      ...statsBase,
      ...stdStats,
      ...mdnStats
    };
  }
}