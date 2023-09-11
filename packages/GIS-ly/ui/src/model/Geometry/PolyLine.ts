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


export interface IPolylineSize {
  vertices: number;
  segments: number;
}


export interface IPolyline<TVertex, TSegment> {
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
}

export class Polyline<TVertex extends IVertex, TSegment extends Segment> implements IPolyline<TVertex, TSegment>{
  protected _vertices: List<CoordinateNode<TVertex, TSegment>, TVertex> = new List<CoordinateNode<TVertex, TSegment>, TVertex>();
  protected _segments: List<SegmentNode<TVertex, TSegment>, TSegment> = new List<SegmentNode<TVertex, TSegment>, TSegment>();

  constructor(coords: TVertex[]) {
    if (coords) {
      this._vertices.appendMany(coords);
      this.buildSegments();
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