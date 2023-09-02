import {
  LinkedListDoubleGeneric as List,
  NodeDouble,
  INodeDouble
} from '../../../../../common/utils/dataStructures';

import { Segment } from './Segment';
import { IVertex } from './Vertex';

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

  constructor(prevCoord: CoordinateNode<TVertex, TSegment>, nextCoord: CoordinateNode<TVertex, TSegment>, segment?: TSegment) {
    super(segment ?? null);
    this.prevCoord = prevCoord;
    this.nextCoord = nextCoord;
  }
}

export interface IPolyline<TPoint, TSegment> {
  /**
   * Returns the number of {@link Point} and {@link Segment} items.
   *
   * @return {*}  {{
   *     points: number;
   *     segments: number;
   *   }}
   * @memberof IPolyline
   */
  size(): {
    points: number;
    segments: number;
  };
  points(): TPoint[];
  segments(): TSegment[];
}

export class PolyLine<P extends IVertex, S extends Segment> implements IPolyline<P, S>{
  protected _points: List<CoordinateNode<P, S>, P> = new List<CoordinateNode<P, S>, P>();
  protected _segments: List<SegmentNode<P, S>, S> = new List<SegmentNode<P, S>, S>();

  constructor(coords: P[]) {
    if (coords) {
      this._points.appendMany(coords);
      this.buildSegments();
    }
  }

  size() {
    return {
      points: this._points.size(),
      segments: this._segments.size()
    }
  }

  points() {
    return this._points.toArray() as P[];
  }

  segments() {
    return this._segments.toArray() as S[];
  }

  protected buildSegments() {
    if (this._points.size() === 0) {
      return;
    }

    this._segments = new List<SegmentNode<P, S>, S>();

    let coord = this._points.getHead()?.next as CoordinateNode<P, S>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<P, S>;
      this.buildSegment(prevCoord, coord);

      coord = coord.next as CoordinateNode<P, S>;
    }
    if (this._points.size() !== this._segments.size() + 1) {
      throw new Error(`Polyline of ${this._points.size()} vertices generated ${this._segments.size()} segments`);
    }
  }

  protected buildSegment(coordI: CoordinateNode<P, S>, coordJ: CoordinateNode<P, S>) {
    const segmentNode = new SegmentNode<P, S>(coordI, coordJ);
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