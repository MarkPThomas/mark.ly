import { NodeDouble } from "../../../../../../common/utils/dataStructures/LinkedListDouble";
import { Segment, Vertex } from "../Polyline";
import { INodeOfInterest } from "./INodeOfInterest";
import { ConstrainedStats } from "./ConstrainedStats";

export interface IMedian<TVertex extends Vertex, TSegment extends Segment> {
  median: INodeOfInterest<TVertex, TSegment>
  count: number
}

export class Median<TVertex extends Vertex, TSegment extends Segment>
  extends ConstrainedStats
  implements IMedian<TVertex, TSegment>
{
  private _getProperty: (val: TVertex | TSegment) => number;

  get count(): number {
    return this._items.size;
  }

  private _isDirty: boolean = false;
  private _items: Map<NodeDouble<TVertex | TSegment>, number> = new Map<NodeDouble<TVertex | TSegment>, number>;
  private _median: INodeOfInterest<TVertex, TSegment> = Median.emptyEntry();
  get median(): INodeOfInterest<TVertex, TSegment> {
    return this._isDirty ? this.calculate() : this._median;
  }


  constructor(
    getProperty: (val: TVertex | TSegment) => number,
    isConsidered: (number: number) => boolean | null = null
  ) {
    super(isConsidered);

    this._getProperty = getProperty;
  }

  add(node: NodeDouble<TVertex | TSegment>) {
    if (!node) {
      return;
    }

    const number = this._getProperty(node.val);

    if (this._isConsidered === null || this._isConsidered(number)) {
      this._items.set(node, number);

      if (!this._isDirty) {
        this._isDirty = true;
        this._median = Median.emptyEntry();
      }
    }
  }

  remove(node: NodeDouble<TVertex | TSegment>) {
    if (!node) {
      return;
    }

    const number = this._getProperty(node.val);

    if (this._isConsidered === null || this._isConsidered(number)) {
      this._items.delete(node);

      if (!this._isDirty) {
        this._isDirty = true;
        this._median = Median.emptyEntry();
      }
    }
  }

  calculate() {
    const items = [...this._items].map(([node, value]) => ({ node, value }));
    items.sort((a, b) => a.value - b.value);

    this._median.nodes = [];
    this._median.value = 0;
    this._isDirty = false;

    const count = this._items.size;
    if (count) {
      if (count === 1) {
        this._median.nodes.push(items[0].node);
        this._median.value = items[0].value;
      } else {
        const halfIndexFloor = Math.floor(count / 2);
        if (count % 2 === 0) {
          const medianItemPre = items[halfIndexFloor - 1];
          const medianItemPost = items[halfIndexFloor];

          this._median.nodes.push(medianItemPre.node, medianItemPost.node);
          this._median.value = 0.5 * (medianItemPre.value + medianItemPost.value);
        } else {
          const medianItem = items[halfIndexFloor];

          this._median.nodes.push(medianItem.node);
          this._median.value = medianItem.value;
        }
      }
    }

    return this._median;
  }

  static empty() {
    return {
      count: 0,
      value: Median.emptyEntry()
    };
  }

  static emptyEntry() {
    return {
      value: 0,
      nodes: []
    };
  }
}