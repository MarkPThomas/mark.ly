import {
  LinkedListDoubleGeneric,
  LinkedListDouble,
  NodeDouble
} from '../../../../../common/utils/dataStructures';

import { Coordinate } from '../GIS/Coordinate';
import { Segment } from './Segment';

export class CoordinateNode<V, S> extends NodeDouble<V> {
  nextSeg: SegmentNode<V, S> | null;
  prevSeg: SegmentNode<V, S> | null;
}

export class SegmentNode<V, S> extends NodeDouble<S> {
  nextCoord: CoordinateNode<V, S>;
  prevCoord: CoordinateNode<V, S>;

  constructor(prevCoord: CoordinateNode<V, S>, nextCoord: CoordinateNode<V, S>, segment?: S) {
    super(segment ?? null);
    this.prevCoord = prevCoord;
    this.nextCoord = nextCoord;
  }
}

export class PolyLine<V extends Coordinate, S extends Segment> {
  protected _coords: LinkedListDoubleGeneric<CoordinateNode<V, S>, V>
    = new LinkedListDoubleGeneric<CoordinateNode<V, S>, V>();
  protected _segments: LinkedListDouble<SegmentNode<V, S>> = new LinkedListDouble<SegmentNode<V, S>>();

  constructor(coords: V[]) {
    this._coords.appendMany(coords);
    this.buildSegments();
  }

  size() {
    return {
      coords: this._coords.size(),
      segments: this._segments.size()
    }
  }

  coords() {
    return this._coords.toArray() as V[];
  }

  segments() {
    return this._segments.toArray() as S[];
  }

  protected buildSegments() {
    if (this._coords.size() === 0) {
      return;
    }

    this._segments = new LinkedListDouble<SegmentNode<V, S>>();

    let coord = this._coords.getHead()?.next as CoordinateNode<V, S>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<V, S>;

      this.buildSegment(prevCoord, coord);

      coord = coord.next as CoordinateNode<V, S>;
    }
  }

  protected buildSegment(coordI: CoordinateNode<V, S>, coordJ: CoordinateNode<V, S>) {
    const segmentNode = new SegmentNode<V, S>(coordI, coordJ);
    this._segments.append(segmentNode);

    coordI.nextSeg = segmentNode;
    coordJ.prevSeg = segmentNode;
  }

  // addProperties() {
  //   this.addPropertiesToSegments();
  // }

  // protected addPropertiesToSegments() {
  //   let coord = this._coords.getHead()?.next as CoordinateNode<V, S>;
  //   while (coord) {
  //     const prevCoord = coord.prev as CoordinateNode<V, S>;
  //     this.addSegmentProperties(prevCoord, coord);

  //     coord = coord.next as CoordinateNode<V, S>;
  //   }
  // }

  // protected addSegmentProperties(coordI: CoordinateNode<V, S>, coordJ: CoordinateNode<V, S>) {
  //   const segment = new Segment();

  //   segment.length = PolyLine.calcSegmentDistance(coordI.val, coordJ.val);
  //   segment.angle = PolyLine.calcSegmentAngleRads(coordI.val, coordJ.val);

  //   coordI.nextSeg.val = segment as S;
  // }

  //   /**
  //  * Returns the distance between two points in a 2D Cartesian coordinate system.
  //  *
  //  * @protected
  //  * @param {Coordinate} ptI
  //  * @param {Coordinate} ptJ
  //  * @return {*}
  //  * @memberof Track
  //  */
  //   static calcSegmentDistance(ptI: Coordinate, ptJ: Coordinate) {
  //     // TODO: Update this once base coord of cartesian pts is implemented
  //     return ptI.distanceTo(ptJ);
  //   }

  //   static calcSegmentAngleRads(ptI: Coordinate, ptJ: Coordinate) {
  //     // TODO: Update this once base coord of cartesian pts is implemented
  //     // This might need to be overridden in Track for lat/long vs. cartesian coordinate systems
  //     const latLength = ptI.distanceTo(new Coordinate(ptJ.lat, ptI.lng));
  //     const lngLength = ptI.distanceTo(new Coordinate(ptI.lat, ptJ.lng));

  //     return lngLength
  //       ? Math.tan(latLength / lngLength)
  //       : latLength > 0 ? Math.PI / 2
  //         : latLength < 0 ? 3 * Math.PI / 2
  //           : null;
  //   }
}