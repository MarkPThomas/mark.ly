import { Position } from "@markpthomas/geojson";
import { Point } from "@markpthomas/geojson/geometries";
import { Vertex } from "@markpthomas/geometry";

import { ICloneable, IEquatable } from '@markpthomas/common-libraries/interfaces';

import { IDirection } from "../Direction";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @interface IPointProperties
 * @typedef {IPointProperties}
 */
export interface IPointProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  lat: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  lng: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {?(number | undefined)}
 */
  alt?: number | undefined;
  /**
     * Elevation [meters] obtained from an external source for the location, such as DEM/LIDAR data.
     *
     * @type {number}
     * @memberof Coordinate
     */
  elevation?: number | undefined;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @interface IPoint
 * @typedef {IPoint}
 * @extends {IPointProperties}
 * @extends {ICloneable<PPoint>}
 * @extends {IEquatable<IPointProperties>}
 */
export interface IPoint
  extends
  IPointProperties,
  ICloneable<PPoint>,
  IEquatable<IPointProperties> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {Position}
 */
  toPosition(): Position;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {Point}
 */
  toPoint(): Point;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @param {IPointProperties} otherLatLng
 * @returns {number}
 */
  distanceTo(otherLatLng: IPointProperties): number;
};

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @typedef {Points}
 */
export type Points = PPoint | PPoint[] | PPoint[][] | PPoint[][][];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @export
 * @class PPoint
 * @typedef {PPoint}
 * @extends {Vertex}
 * @implements {IPoint}
 */
export class PPoint
  extends Vertex
  implements IPoint {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  lat: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {number}
 */
  lng: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {?(number | undefined)}
 */
  alt?: number | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @type {?(number | undefined)}
 */
  elevation?: number | undefined;

  /**
 * Creates an instance of PPoint.
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @constructor
 * @param {number} lat
 * @param {number} lng
 * @param {?number} [altitude]
 */
  constructor(lat: number, lng: number, altitude?: number) {
    super();

    this.lat = lat;
    this.lng = lng;
    if (!PPoint.isNullOrUndefined(altitude)) {
      this.alt = altitude;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {Position}
 */
  toPosition(): Position {
    return this.elevation
      ? [this.lng, this.lat, this.elevation]
      : this.alt
        ? [this.lng, this.lat, this.alt]
        : [this.lng, this.lat];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {Point}
 */
  toPoint(): Point {
    return this.elevation
      ? Point.fromLngLat(this.lng, this.lat, this.elevation)
      : this.alt
        ? Point.fromLngLat(this.lng, this.lat, this.alt)
        : Point.fromLngLat(this.lng, this.lat);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @param {IPointProperties} pointJ
 * @returns {number}
 */
  distanceTo(pointJ: IPointProperties): number {
    return PPoint.calcDistanceBetween(this, pointJ);
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @returns {PPoint}
 */
  clone(): PPoint {
    const point = new PPoint(this.lat, this.lng, this.alt);

    if (this.elevation) {
      point.elevation = this.elevation;
    }

    return point;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @protected
 * @param {IPointProperties} point
 * @returns {boolean}
 */
  protected equalsBase(point: IPointProperties): boolean {
    return point.lat === this.lat
      && point.lng === this.lng
      && ((!this.alt && !point.alt) || point.alt === this.alt)
      && ((!this.elevation && !point.elevation) || point.elevation === this.elevation);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @param {IPointProperties} point
 * @returns {boolean}
 */
  equals(point: IPointProperties): boolean {
    return this.equalsBase(point);
  }

  // == Factory Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {Position} position
 * @returns {PPoint}
 */
  static fromPosition(position: Position) {
    const coordinate = new PPoint(position[1], position[0], position[2]);

    return coordinate;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {Point} point
 * @returns {PPoint}
 */
  static fromPoint(point: Point) {
    const coordinate = new PPoint(point.latitude, point.longitude, point.altitude);

    return coordinate;
  }

  // === Calc Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {IPointProperties} pointI
 * @param {IPointProperties} pointJ
 * @returns {number}
 */
  static calcDistanceBetween(pointI: IPointProperties, pointJ: IPointProperties) {
    const toRads = Math.PI / 180;

    const latI = pointI.lat * toRads;
    const latJ = pointJ.lat * toRads;
    const lngI = pointI.lng * toRads;
    const lngJ = pointJ.lng * toRads;

    const radius = 6371; // km

    return Math.acos(Math.sin(latI) * Math.sin(latJ) + Math.cos(latI) * Math.cos(latJ) * Math.cos(lngJ - lngI)) * radius * 1000;
  }

  /**
   * Returns the distance between two lat/long points in meters.
   *
   * @protected
   * @param {PPoint} ptI
   * @param {IPointProperties} ptJ
   * @return {*}
   * @memberof Track
   */
  static calcSegmentDistanceMeters(ptI: PPoint, ptJ: IPointProperties) {
    return ptI.distanceTo(ptJ);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {PPoint} ptI
 * @param {PPoint} ptJ
 * @returns {*}
 */
  static calcSegmentAngleRad(ptI: PPoint, ptJ: PPoint) {
    const latLength = ptI.distanceTo(new PPoint(ptJ.lat, ptI.lng)) * ((ptJ.lat > ptI.lat) ? 1 : -1);
    const lngLength = ptI.distanceTo(new PPoint(ptI.lat, ptJ.lng)) * ((ptJ.lng > ptI.lng) ? 1 : -1);

    return lngLength
      ? Math.atan2(latLength, lngLength)
      : latLength > 0 ? Math.PI / 2
        : latLength < 0 ? 3 * Math.PI / 2
          : null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {IPointProperties} ptI
 * @param {IPointProperties} ptJ
 * @returns {IDirection}
 */
  static calcSegmentDirection(ptI: IPointProperties, ptJ: IPointProperties): IDirection {
    const deltaLat = ptJ.lat - ptI.lat;
    const lat = deltaLat > 0
      ? 'N'
      : deltaLat < 0
        ? 'S'
        : null;

    const deltaLng = ptJ.lng - ptI.lng;
    const lng = deltaLng > 0
      ? 'E'
      : deltaLng < 0
        ? 'W'
        : null;
    return { lat, lng };
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {IPointProperties} ptI
 * @param {IPointProperties} ptJ
 * @returns {number}
 */
  static calcSegmentMeasuredAltitudeChange(ptI: IPointProperties, ptJ: IPointProperties) {
    return PPoint.bothHaveAltitudes(ptI, ptJ)
      ? ptJ.alt - ptI.alt
      : undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @static
 * @param {IPointProperties} ptI
 * @param {IPointProperties} ptJ
 * @returns {boolean}
 */
  private static bothHaveAltitudes(ptI: IPointProperties, ptJ: IPointProperties) {
    return !PPoint.isNullOrUndefined(ptI.alt) && !PPoint.isNullOrUndefined(ptJ.alt);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {IPointProperties} ptI
 * @param {IPointProperties} ptJ
 * @returns {number}
 */
  static calcSegmentMappedElevationChange(ptI: IPointProperties, ptJ: IPointProperties) {
    return PPoint.bothHaveElevations(ptI, ptJ)
      ? ptJ.elevation - ptI.elevation
      : undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @static
 * @param {IPointProperties} ptI
 * @param {IPointProperties} ptJ
 * @returns {boolean}
 */
  private static bothHaveElevations(ptI: IPointProperties, ptJ: IPointProperties) {
    return !PPoint.isNullOrUndefined(ptI.elevation) && !PPoint.isNullOrUndefined(ptJ.elevation);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {PPoint} ptI
 * @param {PPoint} ptJ
 * @returns {(number | null)}
 */
  static calcSegmentSlopeRad(ptI: PPoint, ptJ: PPoint): number | null {
    const height = PPoint.bothHaveElevations(ptI, ptJ)
      ? ptJ.elevation - ptI.elevation
      : PPoint.bothHaveAltitudes(ptI, ptJ) ?
        ptJ.alt - ptI.alt
        : null;

    if (height === null) {
      return null;
    }

    const length = ptI.distanceTo(ptJ);

    return PPoint.calcSegmentSlopeRadByRiseRun(height, length);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @static
 * @param {number} rise
 * @param {number} run
 * @returns {(number | null)}
 */
  static calcSegmentSlopeRadByRiseRun(rise: number, run: number): number | null {
    if (PPoint.isNullOrUndefined(rise)
      || PPoint.isNullOrUndefined(run)) {
      return null;
    }

    const sign = run < 0 ? -1 : 1;

    return run
      ? sign * Math.atan(rise / run)
      : rise > 0 ? sign * Math.PI / 2
        : rise < 0 ? sign * 3 * Math.PI / 2
          : 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:53 PM
 *
 * @private
 * @static
 * @param {*} val
 * @returns {boolean}
 */
  private static isNullOrUndefined(val: any) {
    return val === null || val === undefined;
  }
}