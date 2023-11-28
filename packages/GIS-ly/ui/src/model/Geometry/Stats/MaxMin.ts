import { NodeDouble } from "common/utils/dataStructures/LinkedListDouble";
import { Segment, Vertex } from "../Polyline";
import { INodeOfInterest } from "./INodeOfInterest";
import { ConstrainedStats } from "./ConstrainedStats";

export interface IMaxMin<TVertex extends Vertex, TSegment extends Segment> {
  min: INodeOfInterest<TVertex, TSegment>,
  max: INodeOfInterest<TVertex, TSegment>
}

export class MaxMin<TVertex extends Vertex, TSegment extends Segment>
  extends ConstrainedStats
  implements IMaxMin<TVertex, TSegment>
{
  protected _tolerance: number;
  protected _getProperty: (val: TVertex | TSegment) => number;

  private _min: INodeOfInterest<TVertex, TSegment>;
  get min(): INodeOfInterest<TVertex, TSegment> {
    return this._min;
  }

  private _max: INodeOfInterest<TVertex, TSegment>;
  get max(): INodeOfInterest<TVertex, TSegment> {
    return this._max;
  }

  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isConsidered: (number: number) => boolean | null = null,
    tolerance: number = 1e-6
  ) {
    super(isConsidered);

    if (tolerance) {
      this._tolerance = Math.abs(tolerance);
    } else {
      this._tolerance = 1e-6
    }
    this._getProperty = getProperty;

    this.initializeNodesOfInterest();
  }

  protected initializeNodesOfInterest() {
    this._min = {
      value: Infinity,
      nodes: []
    }

    this._max = {
      value: -Infinity,
      nodes: []
    }
  }

  add(
    node: NodeDouble<TVertex | TSegment>
  ) {
    if (!node) {
      return;
    }

    const number = this._getProperty(node.val);

    if (this._isConsidered === null || this._isConsidered(number)) {
      if (this._min.value === Infinity || number - this._min.value < -this._tolerance) {
        this._min.value = number;
        this._min.nodes = [];
      }

      if (Math.abs(number - this._min.value) <= this._tolerance) {
        this._min.nodes.push(node);
      }

      if (this._max.value === -Infinity || number - this._max.value > this._tolerance) {
        this._max.value = number;
        this._max.nodes = [];
      }

      if (Math.abs(number - this._max.value) <= this._tolerance) {
        this._max.nodes.push(node);
      }
    }
  }
}