import { MultiPoint as SerialMultiPoint } from 'geojson';

import { GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { Position } from "../types";

import { BoundingBox } from "../BoundingBox";

import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { Point } from "./Point";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @interface MultiPointProperties
 * @typedef {MultiPointProperties}
 * @extends {ICoordinateContainer<Position[], Point[], SerialMultiPoint>}
 */
export interface MultiPointProperties extends ICoordinateContainer<Position[], Point[], SerialMultiPoint> {
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @interface IMultiPoint
 * @typedef {IMultiPoint}
 * @extends {MultiPointProperties}
 */
export interface IMultiPoint
  extends MultiPointProperties {
}

/**
 * A `MultiPoint` represents two or more geographic points that share a relationship and is one of the seven geometries found in the GeoJson spec.
This adheres to the RFC 7946 internet standard when serialized into JSON. When deserialized, this class becomes an immutable object which should be initiated using its static factory methods. The list of points must be equal to or greater than 2.

A sample GeoJson `MultiPoint`'s provided below (in it's serialized state).

 {
   "type": "MultiPoint",
   "coordinates": [
     [100.0, 0.0],
     [101.0, 1.0]
   ]
 }

Look over the `Point` documentation to get more information about formatting your list of point objects correctly.
 *
 * @export
 * @class MultiPoint
 * @extends {CoordinateContainer<Position[]>}
 * @implements {IMultiPoint}
 */
export class MultiPoint
  extends CoordinateContainer<Position[], Point[], SerialMultiPoint>
  implements IMultiPoint {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {GeoJsonTypes.MultiPoint}
 */
  readonly type = GeoJsonTypes.MultiPoint;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {Point[]}
 */
  get points(): Point[] {
    return [...this._points];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {Position[]}
 */
  toPositions(): Position[] {
    return this._points.map((point) => point.toPositions());
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @param {MultiPointProperties} item
 * @returns {boolean}
 */
  equals(item: MultiPointProperties): boolean {
    // TODO: Handle Interfaces/types. Currently using only Class to avoid unnecessary cloning.
    if (this._points.length !== item.points.length) {
      return false;
    }

    for (let point = 0; point < this._points.length; point++) {
      if (!this._points[point].equals(item.points[point])) {
        return false;
      }
    }
    return true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {MultiPoint}
 */
  clone(): MultiPoint {
    return MultiPoint.fromPoints(this._points, this._bbox);
  }

  /**
 * Creates an instance of MultiPoint.
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
 * @param {SerialMultiPoint} json
 * @returns {MultiPoint}
 */
  static fromJson(json: SerialMultiPoint): MultiPoint {
    const coordinates = json.coordinates as Position[];

    if (!coordinates) {
      throw new InvalidGeometryException(
        `Invalid Coordinates type for "${GeoJsonTypes.MultiPoint}". Must be a "Position" array.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.3
        \n ${json.coordinates}`);
    }

    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined
    const multiPoint = MultiPoint.fromPositions(coordinates, bbox);
    multiPoint._geoJson = json;

    return multiPoint;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {Position[]} positions
 * @param {?BoundingBox} [bbox]
 * @returns {MultiPoint}
 */
  static fromPositions(positions: Position[], bbox?: BoundingBox): MultiPoint {
    const multiPoint = new MultiPoint();

    multiPoint._points = positions.map((position) => Point.fromPosition(position));
    multiPoint._bbox = bbox;

    return multiPoint;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {Point[]} points
 * @param {?(BoundingBox | null)} [bbox]
 * @returns {MultiPoint}
 */
  static fromPoints(points: Point[], bbox?: BoundingBox | null): MultiPoint {
    const multiPoint = new MultiPoint();

    multiPoint._points = [...points];
    multiPoint._bbox = bbox;

    return multiPoint;
  }
}