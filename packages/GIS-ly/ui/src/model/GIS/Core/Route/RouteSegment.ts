import { ICloneable, IEquatable } from '../../../../../../../common/interfaces';

import { Point } from '../../../GeoJSON';

import {
  ISegmentProperties as ISegmentGeometryProperties,
  Segment as SegmentGeometry
} from '../../../Geometry/Segment';

import { IDirection } from '../Direction';
import { IPointProperties, PPoint } from '../Point/Point';
import { RoutePoint } from './RoutePoint';

/**
 * Basic data of {@link Point}s that lie within the segment.
 *
 * @export
 * @interface RouteSegmentData
 */
export interface RouteSegmentData {
  /**
   * All of the {@link Point}s contained within the segment.
   *
   * @type {Point[]}
   * @memberof RouteSegmentData
   */
  segPoints: Point[];
};

export interface IRouteSegmentProperties extends ISegmentGeometryProperties {
  /**
   * Angle in radians, measured the Cartesian/Polar origin, or from due East, projected onto a 2D plane.
   *
   * @type {number}
   * @memberof ISegment
   */
  angle: number;

  /**
   * Cardinal direction that the segment is pointing, directed from {@link TrackPoint} I towards {@link TrackPoint} J.
   *
   * @type {{
   *     lat: string;
   *     lng: string;
   *   }}
   * @memberof ITrackSegment
   */
  direction?: IDirection;

  /**
   * Height in meters.
   *
   * @type {number}
   * @memberof ITrackSegment
   */
  height?: number;

  slope?: number;
}

export interface IRouteSegment
  extends
  IRouteSegmentProperties,
  ICloneable<RouteSegment>,
  IEquatable<IRouteSegmentProperties> {

}

/**
 *
 *
 * @export
 * @class Segment
 * @extends {SegmentGeometry}
 * @implements {ISegment}
 */
export class RouteSegment
  extends SegmentGeometry
  implements IRouteSegment {

  angle: number;
  direction: IDirection;
  height: number;

  private _slope: number = undefined;
  get slope(): number {
    if (this._slope === undefined) {
      this._slope = PPoint.calcSegmentSlopeRadByRiseRun(this.height, this.length)
    }
    return this._slope;
  }

  constructor(length?: number, angle?: number, direction?: IDirection, height?: number) {
    super(length);

    this.angle = angle;
    this.direction = direction;
    this.height = height;
  }

  static fromRoutePoints(prevCoord: RoutePoint, nextCoord: RoutePoint) {
    const trackSegment = new RouteSegment();

    trackSegment.addSegmentProperties(prevCoord, nextCoord);

    return trackSegment;
  }

  // === Common Interfaces ===
  clone(): RouteSegment {
    const segment = new RouteSegment(this.length, this.angle, this.direction, this.height);

    return segment;
  }

  equals(segment: IRouteSegmentProperties): boolean {
    return super.equals(segment)
      && this.angle === segment.angle
      && ((!this.direction && !segment.direction) || segment.direction === this.direction)
      && ((!this.height && !segment.height) || segment.height === this.height);
  }

  // === Methods ===
  addSegmentProperties(prevCoord: PPoint, nextCoord: PPoint) {
    this.length = PPoint.calcSegmentDistanceMeters(prevCoord, nextCoord);
    this.angle = PPoint.calcSegmentAngleRad(prevCoord, nextCoord);

    this.direction = PPoint.calcSegmentDirection(prevCoord, nextCoord);

    const altitudeChange = PPoint.calcSegmentMeasuredAltitudeChange(prevCoord, nextCoord);
    if (altitudeChange !== undefined) {
      this.height = altitudeChange;
    }
  }

  addElevationData(prevCoord: IPointProperties, nextCoord: IPointProperties) {
    const elevationChange = PPoint.calcSegmentMappedElevationChange(prevCoord, nextCoord);
    if (elevationChange !== undefined) {
      this.height = elevationChange;
    }
  }


  // === Calc Methods ===
  static calcPathRotationRad(segI: IRouteSegmentProperties, segJ: IRouteSegmentProperties) {
    return (segJ?.angle === undefined || segJ.angle === null
      || segI?.angle === undefined || segI.angle === null
      || Number.isNaN(segJ.angle - segI.angle)
    )
      ? null
      : segJ.angle - segI.angle;
  }
}