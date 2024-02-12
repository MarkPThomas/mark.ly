import { MultiLineString as SerialMultiLineString } from 'geojson';

import { BBoxState, GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { Position } from "../types";

import { BoundingBox } from "../BoundingBox";

import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { Point } from "./Point";
import { LineString } from "./LineString";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @export
 * @interface MultiLineStringProperties
 * @typedef {MultiLineStringProperties}
 * @extends {ICoordinateContainer<Position[][], Point[][], SerialMultiLineString>}
 */
export interface MultiLineStringProperties extends ICoordinateContainer<Position[][], Point[][], SerialMultiLineString> {
}

/**
 * Returns a list of LineStrings which are currently making up this MultiLineString.
 *
 * @export
 * @interface IMultiLineString
 * @extends {ICoordinateContainer<Position[][]>}
 * @extends {IEquatable<MultiLineStringType>}
 * @extends {ICloneable<IMultiLineString>}
 */
export interface IMultiLineString
  extends MultiLineStringProperties {

  /**
   * Returns a list of `LineStrings` which are currently making up this `MultiLineString`.
   *
   * @type {LineStringType[]}
   * @memberof IMultiLineString
   */
  lineStrings: LineString[];
}

/**
 * A multilinestring is an array of `LineString` coordinate arrays.
This adheres to the RFC 7946 internet standard when serialized into JSON. When deserialized, this class becomes an immutable object which should be initiated using its static factory methods.

When representing a `LineString` that crosses the antimeridian, interoperability is improved by modifying their geometry. Any geometry that crosses the antimeridian SHOULD be represented by cutting it in two such that neither part's representation crosses the antimeridian.

For example, a line extending from 45 degrees N, 170 degrees E across the antimeridian to 45 degrees N, 170 degrees W should be cut in two and represented as a `MultiLineString`.

A sample GeoJson MultiLineString's provided below (in it's serialized state).

 {
   "type": "MultiLineString",
   "coordinates": [
     [
       [100.0, 0.0],
       [101.0, 1.0]
     ],
     [
       [102.0, 2.0],
       [103.0, 3.0]
     ]
   ]
 }

Look over the `LineString` documentation to get more information about formatting your list of linestring objects correctly.
 *
 * @export
 * @class MultiLineString
 * @extends {CoordinateContainer<Position[][]>}
 * @implements {IMultiLineString}
 */
export class MultiLineString
  extends CoordinateContainer<Position[][], Point[][], SerialMultiLineString>
  implements IMultiLineString {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @readonly
 * @type {GeoJsonTypes.MultiLineString}
 */
  readonly type = GeoJsonTypes.MultiLineString;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @readonly
 * @type {Point[][]}
 */
  get points(): Point[][] {
    return this._points.map(
      (lineString) => [...lineString]
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {Position[][]}
 */
  toPositions(): Position[][] {
    return this._points.map(
      (lineString) => lineString.map(
        (point) => point.toPositions()
      ));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @readonly
 * @type {LineString[]}
 */
  get lineStrings(): LineString[] {
    return this._points.map((lineString) => LineString.fromPoints(lineString))
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {SerialMultiLineString}
 */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialMultiLineString {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      coordinates: this.toPositions()
    } as SerialMultiLineString;

    return json;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {MultiLineString} item
 * @returns {boolean}
 */
  equals(item: MultiLineString): boolean {
    // TODO: Handle Interfaces/types. Currently using only Class to avoid unnecessary cloning.
    if (this._points.length !== item._points.length) {
      return false;
    }

    for (let lineString = 0; lineString < this._points.length; lineString++) {
      if (this._points[lineString].length !== item._points[lineString].length) {
        return false;
      }

      for (let point = 0; point < this._points[lineString].length; point++) {
        if (!this._points[lineString][point].equals(item._points[lineString][point])) {
          return false;
        }
      }
    }
    return true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {MultiLineString}
 */
  clone(): MultiLineString {
    return MultiLineString.fromPoints(this._points, this._bbox);
  }

  /**
 * Creates an instance of MultiLineString.
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() {
    super();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @static
 * @param {SerialMultiLineString} json
 * @returns {MultiLineString}
 */
  static fromJson(json: SerialMultiLineString): MultiLineString {
    const coordinates = json.coordinates as Position[][];

    if (!coordinates) {
      throw new InvalidGeometryException(
        `Invalid Coordinates type for "${GeoJsonTypes.MultiLineString}". Must be an array of "Position" arrays.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.5
        \n ${json.coordinates}`);
    }

    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined
    const multiLineString = MultiLineString.fromPositions(coordinates, bbox);
    multiLineString._geoJson = json;

    return multiLineString;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @static
 * @param {Position[][]} positions
 * @param {?BoundingBox} [bbox]
 * @returns {MultiLineString}
 */
  static fromPositions(positions: Position[][], bbox?: BoundingBox): MultiLineString {
    const multiLineString = new MultiLineString();

    multiLineString._points =
      positions.map(
        (lineString) => lineString.map(
          (position) => Point.fromPosition(position)
        ));
    multiLineString._bbox = bbox;

    return multiLineString;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @static
 * @param {Point[][]} points
 * @param {?(BoundingBox | null)} [bbox]
 * @returns {MultiLineString}
 */
  static fromPoints(points: Point[][], bbox?: BoundingBox | null): MultiLineString {
    const multiLineString = new MultiLineString();

    multiLineString._points =
      points.map(
        (lineString) => lineString.map(
          (point) => point.clone()
        ));
    multiLineString._bbox = bbox;

    return multiLineString;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @static
 * @param {LineString[]} lineStrings
 * @param {?BoundingBox} [bbox]
 * @returns {MultiLineString}
 */
  static fromLineStrings(lineStrings: LineString[], bbox?: BoundingBox): MultiLineString {
    const multiLineString = new MultiLineString();

    multiLineString._points = lineStrings.map((lineString) => lineString.points);
    multiLineString._bbox = bbox;

    return multiLineString;
  }
}