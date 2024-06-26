import { BBox as SerialBBox } from "geojson";

import { ICloneable, IEquatable } from "common/interfaces";

import { Position } from "./types";

import { IPoint, Point, PointProperties } from "./geometries";
import { GeoJsonConstants } from "./GeoJsonConstants";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @typedef {TBoundingBox}
 */
export type TBoundingBox = [number, number, number, number];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface IBoundingBox
 * @typedef {IBoundingBox}
 * @extends {IEquatable<BoundingBox>}
 * @extends {ICloneable<BoundingBox>}
 */
export interface IBoundingBox
  extends IEquatable<BoundingBox>,
  ICloneable<BoundingBox> {
  /**
   * North latitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  north: number,
  /**
   * South latitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  south: number,
  /**
   * West longitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  west: number,
  /**
   * East longitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  east: number,

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {?number}
 */
  southwestAltitude?: number,

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {?number}
 */
  northeastAltitude?: number,

  /**
   * Provides the `Point` which represents the northeast corner of this bounding box when the map is facing due north.
   *
   * @return {*}  {Point}
   * @memberof IBoundingBox
   */
  northeast(): Point,
  /**
   * Provides the `Point` which represents the southwest corner of this bounding box when the map is facing due north.
   *
   * @return {*}  {Point}
   * @memberof IBoundingBox
   */
  southwest(): Point,

  /**
  * This takes the currently defined values found inside this instance and converts it to a GeoJson string.
  *
  * @return {*}  {string}
  * @memberof IBoundingBox
  */
  toJson(): SerialBBox,

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {[Position, Position]}
 */
  toCornerPositions(): [Position, Position],

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {[Point, Point]}
 */
  toCornerPoints(): [Point, Point],
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @typedef {BoundsArgs}
 */
type BoundsArgs = {
  minLat: number
  minLong: number
  maxLat: number
  maxLong: number
  minAltitude: number
  maxAltitude: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @typedef {BoundPtArgs}
 */
type BoundPtArgs = { altitude?: number, bufferDegree?: number };

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @class BoundingBox
 * @typedef {BoundingBox}
 * @implements {IBoundingBox}
 */
export class BoundingBox implements IBoundingBox {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {number}
 */
  north: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {number}
 */
  south: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {number}
 */
  west: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {number}
 */
  east: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {?number}
 */
  southwestAltitude?: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {?number}
 */
  northeastAltitude?: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {boolean}
 */
  hasAltitude(): boolean {
    return this.southwestAltitude !== undefined && this.northeastAltitude !== undefined;
  }

  /**
 * Creates an instance of BoundingBox.
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() { }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {Point}
 */
  northeast(): Point {
    return Point.fromLngLat(this.east, this.north, this.northeastAltitude);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {Point}
 */
  southwest(): Point {
    return Point.fromLngLat(this.west, this.south, this.southwestAltitude);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {SerialBBox}
 */
  toJson(): SerialBBox {
    return this.hasAltitude()
      ? [this.west, this.south, this.southwestAltitude!, this.east, this.north, this.northeastAltitude!]
      : [this.west, this.south, this.east, this.north];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {[Position, Position]}
 */
  toCornerPositions(): [Position, Position] {
    const positions = [
      [this.west, this.south],
      [this.east, this.north]
    ];

    if (this.southwestAltitude) {
      positions[0].push(this.southwestAltitude);
    }
    if (this.northeastAltitude) {
      positions[1].push(this.northeastAltitude);
    }

    return positions as [Position, Position];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {[Point, Point]}
 */
  toCornerPoints(): [Point, Point] {
    return [
      Point.fromLngLat(this.west, this.south, this.southwestAltitude),
      Point.fromLngLat(this.east, this.north, this.northeastAltitude),
    ];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {BoundingBox} item
 * @returns {boolean}
 */
  equals(item: BoundingBox): boolean {
    return this.north === item.north
      && this.south === item.south
      && this.west === item.west
      && this.east === item.east
      && this.southwestAltitude === item.southwestAltitude
      && this.northeastAltitude === item.northeastAltitude;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {BoundingBox}
 */
  clone(): BoundingBox {
    const boundingBox = new BoundingBox();

    boundingBox.north = this.north;
    boundingBox.south = this.south;
    boundingBox.east = this.east;
    boundingBox.west = this.west;
    if (this.hasAltitude()) {
      boundingBox.southwestAltitude = this.southwestAltitude;
      boundingBox.northeastAltitude = this.northeastAltitude;
    }

    return boundingBox;
  }

  /**
   * Create a new instance of this class by passing in a formatted valid JSON String.
   *
   * @static
   * @param {string} json
   * @return {*}  {BoundingBox}
   * @memberof BoundingBox
   */
  static fromJson(json: SerialBBox): BoundingBox {
    const bbox = new BoundingBox();

    if (json.length === 4) {
      bbox.west = json[0];
      bbox.south = json[1];
      bbox.east = json[2];
      bbox.north = json[3];
    } else if (json.length === 6) {
      bbox.west = json[0];
      bbox.south = json[1];
      bbox.southwestAltitude = json[2];
      bbox.east = json[3];
      bbox.north = json[4];
      bbox.northeastAltitude = json[5];
    }

    return bbox;
  }

  /**
   * Define a new instance of this class by passing in two coordinates in the same order they would appear
   * in the serialized {@link Position} form.
   *
   * In order to create a box from the point, a default (or specified) buffer in degrees is applied to all sides of the point.
   *
   * @static
   * @param {number} longitude
   * @param {number} latitude
   * @param {BoundPtArgs} { altitude,
   *       bufferDegree = GeoJsonConstants.DEFAULT_BUFFER }
   * @return {*}
   * @memberof BoundingBox
   */
  static fromLngLat(
    longitude: number,
    latitude: number,
    { altitude,
      bufferDegree }: BoundPtArgs = {}
  ) {
    let bufferDegreeUsed = bufferDegree ?? GeoJsonConstants.DEFAULT_BUFFER
    return BoundingBox.fromLngLats(
      longitude - bufferDegreeUsed,
      latitude - bufferDegreeUsed,
      longitude + bufferDegreeUsed,
      latitude + bufferDegreeUsed,
      altitude,
      altitude
    );
  }

  /**
   * Define a new instance of this class by passing in four coordinates in the same order they would appear in the serialized GeoJson form.
   *
   * @static
   * @param {number} west longitude
   * @param {number} south latitude
   * @param {number} east longitude
   * @param {number} north latitude
   * @param {number} [southwestAltitude] meters
   * @param {number} [northeastAltitude] meters
   * @return {*}  {BoundingBox}
   * @memberof BoundingBox
   */
  static fromLngLats(
    west: number, south: number, east: number, north: number,
    southwestAltitude?: number, northeastAltitude?: number
  ): BoundingBox {
    const bbox = new BoundingBox();

    bbox.east = east;
    bbox.north = north;
    bbox.west = west;
    bbox.south = south;

    if (southwestAltitude !== undefined && northeastAltitude !== undefined) {
      bbox.southwestAltitude = southwestAltitude;
      bbox.northeastAltitude = northeastAltitude;
    } else if (southwestAltitude !== undefined) {
      bbox.southwestAltitude = southwestAltitude;
      bbox.northeastAltitude = southwestAltitude;
    } else if (northeastAltitude !== undefined) {
      bbox.southwestAltitude = northeastAltitude;
      bbox.northeastAltitude = northeastAltitude;
    }

    return bbox;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @param {Position} position
 * @param {?number} [bufferDegree]
 * @returns {BoundingBox}
 */
  static fromPosition(position: Position, bufferDegree?: number): BoundingBox {
    return BoundingBox.fromLngLat(position[0], position[1], { altitude: position[2], bufferDegree });
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @param {Position} southwest
 * @param {Position} northeast
 * @returns {BoundingBox}
 */
  static fromCornerPositions(southwest: Position, northeast: Position): BoundingBox {
    return BoundingBox.fromLngLats(
      southwest[0], southwest[1],
      northeast[0], northeast[1],
      southwest[2], northeast[2]
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @param {Position[]} positions
 * @returns {BoundingBox}
 */
  static fromPositions(positions: Position[]): BoundingBox {
    if (positions.length === 1) {
      return BoundingBox.fromPosition(positions[0]);
    }

    const bounds = BoundingBox.getInitialBounds();

    function getArrayDepth(value: any[]): number {
      return Array.isArray(value) ?
        1 + Math.max(0, ...value.map(getArrayDepth)) :
        0;
    }

    const positionsFlat = positions.flat(getArrayDepth(positions) - 2) as Position[];
    positionsFlat.forEach((position) => BoundingBox.setBounds(bounds, position[0], position[1], position[2]));

    return BoundingBox.fromBoundsArgs(bounds);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @param {PointProperties} point
 * @param {?number} [bufferDegree]
 * @returns {BoundingBox}
 */
  static fromPoint(point: PointProperties, bufferDegree?: number): BoundingBox {
    return BoundingBox.fromLngLat(point.longitude, point.latitude, { altitude: point.altitude, bufferDegree });
  }

  /**
   * Define a new instance of this class by passing in two `Point`s, representing both the southwest and northwest corners of the bounding box.
   *
   * @static
   * @param {Point} southwest
   * @param {Point} northeast
   * @return {*}  {BoundingBox}
   * @memberof BoundingBox
   */
  static fromCornerPoints(southwest: IPoint, northeast: IPoint): BoundingBox {
    return BoundingBox.fromLngLats(
      southwest.longitude, southwest.latitude,
      northeast.longitude, northeast.latitude,
      southwest.altitude, northeast.altitude
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @param {IPoint[]} points
 * @returns {BoundingBox}
 */
  static fromPoints(points: IPoint[]): BoundingBox {
    if (points.length === 1) {
      return BoundingBox.fromPoint(points[0]);
    }

    const bounds = BoundingBox.getInitialBounds();

    const pointsFlat = points.flat(Infinity);
    pointsFlat.forEach((point) => BoundingBox.setBounds(bounds, point.longitude, point.latitude, point.altitude));

    return BoundingBox.fromBoundsArgs(bounds);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @static
 * @param {BoundsArgs} bounds
 * @returns {BoundingBox}
 */
  protected static fromBoundsArgs(bounds: BoundsArgs): BoundingBox {
    return BoundingBox.fromLngLats(
      bounds.minLong, bounds.minLat,
      bounds.maxLong, bounds.maxLat,
      bounds.minAltitude !== Infinity ? bounds.minAltitude : undefined,
      bounds.maxAltitude !== -Infinity ? bounds.maxAltitude : undefined
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @static
 * @returns {BoundsArgs}
 */
  protected static getInitialBounds(): BoundsArgs {
    return {
      minLat: Infinity,
      minLong: Infinity,
      minAltitude: Infinity,
      maxLat: -Infinity,
      maxLong: -Infinity,
      maxAltitude: -Infinity
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @static
 * @param {BoundsArgs} bounds
 * @param {number} longitude
 * @param {number} latitude
 * @param {?number} [altitude]
 */
  protected static setBounds(bounds: BoundsArgs, longitude: number, latitude: number, altitude?: number) {

    bounds.minLat = Math.min(bounds.minLat, latitude);
    bounds.minLong = Math.min(bounds.minLong, longitude);

    bounds.maxLat = Math.max(bounds.maxLat, latitude);
    bounds.maxLong = Math.max(bounds.maxLong, longitude);

    if (altitude !== undefined) {
      bounds.minAltitude = Math.min(bounds.minAltitude, altitude);
      bounds.maxAltitude = Math.max(bounds.maxAltitude, altitude);
    }
  }
}