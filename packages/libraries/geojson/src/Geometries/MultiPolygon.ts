import { MultiPolygon as SerialMultiPolygon } from 'geojson';

import { ArgumentOutOfRangeException } from "../../../../common/errors/exceptions";

import { BBoxState, GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { Position } from "../types";

import { BoundingBox } from "../BoundingBox";

import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { Point } from "./Point";
import { LineString } from "./LineString";
import { Polygon } from "./Polygon";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @interface MultiPolygonProperties
 * @typedef {MultiPolygonProperties}
 * @extends {ICoordinateContainer<Position[][][], Point[][][], SerialMultiPolygon>}
 */
export interface MultiPolygonProperties extends ICoordinateContainer<Position[][][], Point[][][], SerialMultiPolygon> {
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @export
 * @interface IMultiPolygon
 * @typedef {IMultiPolygon}
 * @extends {MultiPolygonProperties}
 */
export interface IMultiPolygon
  extends MultiPolygonProperties {

  /**
   * Returns a list of `Polygons` which make up this `MultiPolygon` instance.
   *
   * @return {*}  {MultiPolygonType}
   * @memberof IMultiPolygon
   */
  polygons: Polygon[]
}

/**
 * A multiPolygon is an array of `Polygon` coordinate arrays.
This adheres to the RFC 7946 internet standard when serialized into JSON. When deserialized, this class becomes an immutable object which should be initiated using its static factory methods.

When representing a `Polygon` that crosses the antimeridian, interoperability is improved by modifying their geometry. Any geometry that crosses the antimeridian SHOULD be represented by cutting it in two such that neither part's representation crosses the antimeridian.

For example, a line extending from 45 degrees N, 170 degrees E across the antimeridian to 45 degrees N, 170 degrees W should be cut in two and represented as a `MultiLineString`.

A sample GeoJson `MultiPolygon` is provided below (in it's serialized state).

 {
   "type": "MultiPolygon",
   "coordinates": [
     [
       [
         [102.0, 2.0],
         [103.0, 2.0],
         [103.0, 3.0],
         [102.0, 3.0],
         [102.0, 2.0]
       ]
     ],
     [
       [
         [100.0, 0.0],
         [101.0, 0.0],
         [101.0, 1.0],
         [100.0, 1.0],
         [100.0, 0.0]
       ],
       [
         [100.2, 0.2],
         [100.2, 0.8],
         [100.8, 0.8],
         [100.8, 0.2],
         [100.2, 0.2]
       ]
     ]
   ]
 }

Look over the Polygon documentation to get more information about formatting your list of Polygon objects correctly.
 *
 * @export
 * @class MultiPolygon
 * @extends {CoordinateContainer<Position[][][]>}
 * @implements {IMultiPolygon}
 */
export class MultiPolygon
  extends CoordinateContainer<Position[][][], Point[][][], SerialMultiPolygon>
  implements IMultiPolygon {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {GeoJsonTypes.MultiPolygon}
 */
  readonly type = GeoJsonTypes.MultiPolygon;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {Point[][][]}
 */
  get points(): Point[][][] {
    return this._points.map(
      (polygon) => polygon.map(
        (lineString) => [...lineString]
      ));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {Position[][][]}
 */
  toPositions(): Position[][][] {
    return this._points.map(
      (polygon) => polygon.map(
        (lineString) => lineString.map(
          (point) => point.toPositions()
        )));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @readonly
 * @type {Polygon[]}
 */
  get polygons(): Polygon[] {
    return this._points.map((polygon) => Polygon.fromPoints(polygon));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {SerialMultiPolygon}
 */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialMultiPolygon {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      coordinates: this.toPositions()
    } as SerialMultiPolygon;

    return json;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @param {MultiPolygon} item
 * @returns {boolean}
 */
  equals(item: MultiPolygon): boolean {
    // TODO: Better implementation is to add IContains rather than below with equals. Perhaps with internal hash lookup.
    // TODO: Handle Interfaces/types. Currently using only Class to avoid unnecessary cloning.
    if (this._points.length !== item._points.length) {
      return false;
    }

    for (let polygon = 0; polygon < this._points.length; polygon++) {
      if (this._points[polygon].length !== item._points[polygon].length) {
        return false;
      }

      for (let lineString = 0; lineString < this._points[polygon].length; lineString++) {
        if (this._points[polygon][lineString].length !== item._points[polygon][lineString].length) {
          return false;
        }

        for (let point = 0; point < this._points[polygon][lineString].length; point++) {
          if (!this._points[polygon][lineString][point].equals(item._points[polygon][lineString][point])) {
            return false;
          }
        }
      }
    }


    return true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @returns {MultiPolygon}
 */
  clone(): MultiPolygon {
    return MultiPolygon.fromPoints(this._points, this._bbox);
  }

  /**
 * Creates an instance of MultiPolygon.
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
 * @param {SerialMultiPolygon} json
 * @returns {MultiPolygon}
 */
  static fromJson(json: SerialMultiPolygon): MultiPolygon {
    const coordinates = json.coordinates as Position[][][];

    if (!coordinates) {
      throw new InvalidGeometryException(
        `Invalid Coordinates type for "${GeoJsonTypes.Polygon}". Must be an outer array of an inner array of "Position" arrays.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.7
        \n ${json.coordinates}`);
    }

    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined
    const multiPolygon = MultiPolygon.fromPositions(coordinates, bbox);
    multiPolygon._geoJson = json;

    return multiPolygon;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {Position[][][]} positions
 * @param {?BoundingBox} [bbox]
 * @returns {MultiPolygon}
 */
  static fromPositions(positions: Position[][][], bbox?: BoundingBox): MultiPolygon {
    const multiPolygon = new MultiPolygon();

    multiPolygon._points =
      positions.map(
        (polygon) => polygon.map(
          (lineString) => lineString.map(
            (position) => Point.fromPosition(position)
          )));
    multiPolygon._bbox = bbox;

    return multiPolygon;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {Point[][][]} points
 * @param {?(BoundingBox | null)} [bbox]
 * @returns {MultiPolygon}
 */
  static fromPoints(points: Point[][][], bbox?: BoundingBox | null): MultiPolygon {
    const multiPolygon = new MultiPolygon();

    multiPolygon._points =
      points.map(
        (polygon) => polygon.map(
          (lineString) => lineString.map(
            (coordinate) => coordinate.clone()
          )));
    multiPolygon._bbox = bbox;

    return multiPolygon;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:28 PM
 *
 * @static
 * @param {Polygon[]} polygons
 * @param {?BoundingBox} [bbox]
 * @returns {MultiPolygon}
 */
  static fromPolygons(polygons: Polygon[], bbox?: BoundingBox): MultiPolygon {
    const multiPolygon = new MultiPolygon();

    multiPolygon._points = polygons.map((polygon) => polygon.points);
    multiPolygon._bbox = bbox;

    return multiPolygon;
  }
}