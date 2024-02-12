import { Point } from '@MPT/geojson/Geometries';
import {
  ISegmentProperties as ISegmentGeometryProperties,
  Segment as SegmentGeometry
} from '@MPT/geometry';

import { ICloneable, IEquatable } from 'common/interfaces';

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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRouteSegmentProperties
 * @typedef {IRouteSegmentProperties}
 * @extends {ISegmentGeometryProperties}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {?number}
 */
  slope?: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRouteSegment
 * @typedef {IRouteSegment}
 * @extends {IRouteSegmentProperties}
 * @extends {ICloneable<RouteSegment>}
 * @extends {IEquatable<IRouteSegmentProperties>}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {number}
 */
  angle: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {IDirection}
 */
  direction: IDirection;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {number}
 */
  height: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @private
 * @type {number}
 */
  private _slope: number = undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {number}
 */
  get slope(): number {
    if (this._slope === undefined) {
      this._slope = PPoint.calcSegmentSlopeRadByRiseRun(this.height, this.length)
    }
    return this._slope;
  }

  /**
 * Creates an instance of RouteSegment.
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @constructor
 * @param {?number} [length]
 * @param {?number} [angle]
 * @param {?IDirection} [direction]
 * @param {?number} [height]
 */
  constructor(length?: number, angle?: number, direction?: IDirection, height?: number) {
    super(length);

    this.angle = angle;
    this.direction = direction;
    this.height = height;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @param {RoutePoint} prevCoord
 * @param {RoutePoint} nextCoord
 * @returns {RouteSegment}
 */
  static fromRoutePoints(prevCoord: RoutePoint, nextCoord: RoutePoint) {
    const trackSegment = new RouteSegment();

    trackSegment.addSegmentProperties(prevCoord, nextCoord);

    return trackSegment;
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @returns {RouteSegment}
 */
  clone(): RouteSegment {
    const segment = new RouteSegment(this.length, this.angle, this.direction, this.height);

    return segment;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {IRouteSegmentProperties} segment
 * @returns {boolean}
 */
  equals(segment: IRouteSegmentProperties): boolean {
    return super.equals(segment)
      && this.angle === segment.angle
      && ((!this.direction && !segment.direction) || segment.direction === this.direction)
      && ((!this.height && !segment.height) || segment.height === this.height);
  }

  // === Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {PPoint} prevCoord
 * @param {PPoint} nextCoord
 */
  addSegmentProperties(prevCoord: PPoint, nextCoord: PPoint) {
    this.length = PPoint.calcSegmentDistanceMeters(prevCoord, nextCoord);
    this.angle = PPoint.calcSegmentAngleRad(prevCoord, nextCoord);

    this.direction = PPoint.calcSegmentDirection(prevCoord, nextCoord);

    const altitudeChange = PPoint.calcSegmentMeasuredAltitudeChange(prevCoord, nextCoord);
    if (altitudeChange !== undefined) {
      this.height = altitudeChange;
    }

    this.addElevationData(prevCoord, nextCoord);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {IPointProperties} prevCoord
 * @param {IPointProperties} nextCoord
 */
  addElevationData(prevCoord: IPointProperties, nextCoord: IPointProperties) {
    const elevationChange = PPoint.calcSegmentMappedElevationChange(prevCoord, nextCoord);
    if (elevationChange !== undefined) {
      this.height = elevationChange;
    }
  }


  // === Calc Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @param {IRouteSegmentProperties} segI
 * @param {IRouteSegmentProperties} segJ
 * @returns {number}
 */
  static calcPathRotationRad(segI: IRouteSegmentProperties, segJ: IRouteSegmentProperties) {
    return (segJ?.angle === undefined || segJ.angle === null
      || segI?.angle === undefined || segI.angle === null
      || Number.isNaN(segJ.angle - segI.angle)
    )
      ? null
      : segJ.angle - segI.angle;
  }
}