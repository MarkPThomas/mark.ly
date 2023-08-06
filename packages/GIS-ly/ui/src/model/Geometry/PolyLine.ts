import {
  LinkedListDoubleGeneric,
  LinkedListDouble,
  NodeDouble
} from '../../../../../common/utils/dataStructures';

import { Coordinate } from '../GIS/Coordinate';
import { Segment } from './Segment';

export class CoordinateNode<V> extends NodeDouble<V> {
  nextSeg: SegmentNode<V> | null;
  prevSeg: SegmentNode<V> | null;
}

export class SegmentNode<V> extends NodeDouble<Segment> {
  nextCoord: CoordinateNode<V>;
  prevCoord: CoordinateNode<V>;

  constructor(prevCoord: CoordinateNode<V>, nextCoord: CoordinateNode<V>, segment?: Segment) {
    super(segment ?? null);
    this.prevCoord = prevCoord;
    this.nextCoord = nextCoord;
  }
}

export class PolyLine<V extends Coordinate> {
  protected coords: LinkedListDoubleGeneric<CoordinateNode<V>, V>
    = new LinkedListDoubleGeneric<CoordinateNode<V>, V>();
  protected segments: LinkedListDouble<SegmentNode<V>> = new LinkedListDouble<SegmentNode<V>>();

  constructor(coords: V[]) {
    this.coords.appendMany(coords);
    this.buildSegments();
  }

  size() {
    return {
      coords: this.coords.size(),
      segments: this.segments.size()
    }
  }

  protected buildSegments() {
    if (this.coords.size() === 0) {
      return;
    }

    this.segments = new LinkedListDouble<SegmentNode<V>>();

    let coord = this.coords.getHead()?.next as CoordinateNode<V>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<V>;
      const segmentNode = new SegmentNode<V>(prevCoord, coord);
      this.segments.append(segmentNode);

      prevCoord.nextSeg = segmentNode;
      coord.prevSeg = segmentNode;

      coord = coord.next as CoordinateNode<V>;
    }
  }
}