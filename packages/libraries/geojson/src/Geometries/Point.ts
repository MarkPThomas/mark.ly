import { Point as SerialPoint } from 'geojson';

import { GeoJsonTypes } from "../enums";
import { InvalidGeometryException, LngLatOutOfRangeException } from '../exceptions';
import { GeoJsonConstants } from '../GeoJsonConstants';
import { Position } from "../types";
import { BoundingBox } from "../BoundingBox";

import {
  CoordinateContainer,
  CoordinateContainerProperties
} from "./CoordinateContainer";


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @typedef {PointOptions}
 */
export type PointOptions = {
  longitude: number,
  latitude: number,
  altitude?: number,
  bBox?: BoundingBox,
  buffer?: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @interface PointProperties
 * @typedef {PointProperties}
 * @extends {CoordinateContainerProperties<Point>}
 */
export interface PointProperties extends CoordinateContainerProperties<Point> {
  /**
     * This returns a value representing the y or northing position of this point.
     *
     * @type {number}
     * @memberof IPoint
     */
  latitude: number,
  /**
   * This returns a value representing the x or easting position of this point.
   *
   * @type {number}
   * @memberof IPoint
   */
  longitude: number
  /**
   * Optionally, the coordinate spec in GeoJson allows for altitude values to be placed inside the coordinate array.
   *
   * @type {number}
   * @memberof IPoint
   */
  altitude?: number,
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @interface IPoint
 * @typedef {IPoint}
 * @extends {PointProperties}
 */
export interface IPoint extends PointProperties {
  /**
   * Returns true if `altitude` is not undefined.
   *
   * @return {*}  {boolean}
   * @memberof IPoint
   */
  hasAltitude(): boolean,
}

/**
 * A point represents a single geographic position and is one of the seven Geometries found in the GeoJson spec.
This adheres to the RFC 7946 internet standard when serialized into JSON. When deserialized, this class becomes an immutable object which should be initiated using its static factory methods.

Coordinates are in x, y order (easting, northing for projected coordinates), longitude, and latitude for geographic coordinates), precisely in that order and using numeric values. Altitude or elevation MAY be included as an optional third parameter while creating this object.

The size of a GeoJson text in bytes is a major interoperability consideration, and precision of coordinate values has a large impact on the size of texts when serialized. For geographic coordinates with units of degrees, 6 decimal places (a common default) amounts to about 10 centimeters, a precision well within that of current GPS systems. Implementations should consider the cost of using a greater precision than necessary.

Furthermore, pertaining to altitude, the WGS 84 datum is a relatively coarse approximation of the geoid, with the height varying by up to 5 m (but generally between 2 and 3 meters) higher or lower relative to a surface parallel to Earth's mean sea level.

A sample GeoJson Point's provided below (in its serialized state).

 {
   "type": "Point",
   "coordinates": [100.0, 0.0]
 }
 *
 * @export
 * @class Point
 * @extends {CoordinateContainer<Position>}
 * @implements {IPoint}
 */
export class Point
  extends CoordinateContainer<Position, IPoint, SerialPoint>
  implements IPoint {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {GeoJsonTypes.Point}
 */
  readonly type = GeoJsonTypes.Point;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {number}
 */
  get buffer(): number {
    return this._buffer;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @protected
 * @type {Position}
 */
  protected _positions: Position = [0, 0];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {Position}
 */
  toPositions(): Position {
    return [...this._positions];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {Point}
 */
  get points(): Point {
    return this;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {number}
 */
  get latitude(): number {
    return this._positions[1];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {number}
 */
  get longitude(): number {
    return this._positions[0];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {(number | undefined)}
 */
  get altitude(): number | undefined {
    return this._positions[2];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {boolean}
 */
  hasAltitude(): boolean {
    return this.altitude !== undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @param {PointProperties} item
 * @returns {boolean}
 */
  equals(item: PointProperties): boolean {
    return this.latitude === item.latitude
      && this.longitude === item.longitude
      && this.altitude === this.altitude;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {Point}
 */
  clone(): Point {
    const point = Point.fromPosition(this._positions);
    point._bbox = this._bbox;
    return point;
  }

  /**
 * Creates an instance of Point.
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() {
    super();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {SerialPoint} json
 * @returns {Point}
 */
  static fromJson(json: SerialPoint): Point {
    const coordinates = json.coordinates as Position;

    if (!(coordinates.length === 2 || coordinates.length === 3)) {
      throw new InvalidGeometryException(
        `Invalid Coordinates type for "${GeoJsonTypes.Point}". Must be a "Position" tuple of 2 or 3 elements.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.1
        \n ${json.coordinates}`);
    }

    const point = Point.fromPosition(coordinates);
    point._geoJson = json;

    if (json.bbox) {
      point._bbox = BoundingBox.fromJson(json.bbox);
    }


    return point;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {PointOptions} param0
 * @param {number} param0.longitude
 * @param {number} param0.latitude
 * @param {number} param0.altitude
 * @param {BoundingBox} param0.bBox
 * @param {number} param0.buffer
 * @returns {Point}
 */
  static fromOptions({ longitude, latitude, altitude, bBox, buffer }: PointOptions): Point {
    const point = Point.fromLngLat(longitude, latitude, altitude);

    if (buffer) {
      point._buffer = buffer;
    }
    point._bbox = bBox;

    return point;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {Position} position
 * @param {?number} [buffer]
 * @returns {Point}
 */
  static fromPosition(position: Position, buffer?: number): Point {
    return Point.fromLngLat(position[0], position[1], position[2], buffer);
  }

  /**
   *
   *
   * @static
   * @param {number} longitude
   * @param {number} latitude
   * @param {number} [altitude]
   * @param {number} [buffer=0.5] Buffer (in degrees) to add to each side of the bounding box for a point.
   * @return {*}  {Point}
   * @memberof Point
   */
  static fromLngLat(
    longitude: number, latitude: number, altitude?: number,
    buffer: number = GeoJsonConstants.DEFAULT_BUFFER
  ): Point {
    const point = new Point();

    if (longitude < GeoJsonConstants.MIN_LONGITUDE) {
      throw new LngLatOutOfRangeException(`Longitude ${longitude} cannot be less than ${GeoJsonConstants.MIN_LONGITUDE}`);
    }
    if (longitude > GeoJsonConstants.MAX_LONGITUDE) {
      throw new LngLatOutOfRangeException(`Longitude ${longitude} cannot be greater than ${GeoJsonConstants.MAX_LONGITUDE}`);
    }
    if (latitude < GeoJsonConstants.MIN_LATITUDE) {
      throw new LngLatOutOfRangeException(`Latitude ${latitude} cannot be less than ${GeoJsonConstants.MIN_LATITUDE}`);
    }
    if (latitude > GeoJsonConstants.MAX_LATITUDE) {
      throw new LngLatOutOfRangeException(`Latitude ${latitude} cannot be greater than ${GeoJsonConstants.MAX_LATITUDE}`);
    }

    point._positions = [longitude, latitude]
    if (altitude !== undefined && altitude !== null) {
      point._positions = [...point._positions, altitude];
    }

    point._buffer = buffer;

    return point;
  }
}