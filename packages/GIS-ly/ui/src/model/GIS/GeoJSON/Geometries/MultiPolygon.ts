import { MultiPolygon as SerialMultiPolygon } from 'geojson';

import { ArgumentOutOfRangeException } from "../../../../../../../common/errors/exceptions";

import { BoundingBox } from "../BoundingBox";
import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { Position } from "../types";
import { Point } from "./Point";
import { Polygon } from "./Polygon";
import { GeoJsonTypes } from "../enums";
import { LineString } from "./LineString";
import { InvalidGeometryException } from '../exceptions';

export interface MultiPolygonProperties extends ICoordinateContainer<Position[][][], Point[][][], SerialMultiPolygon> {
}

export interface IMultiPolygon
  extends MultiPolygonProperties {

  /**
   * Returns a list of `Polygons` which make up this `MultiPolygon` instance.
   *
   * @return {*}  {MultiPolygonType}
   * @memberof IMultiPolygon
   */
  polygons: Polygon[]

  pointAtIndex(polygonIndex: number, lineStringIndex: number, pointIndex: number): Point;
  lineStringAtIndex(polygonIndex: number, lineStringIndex: number): LineString;
  polygonAtIndex(polygonIndex: number): Polygon;
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

  readonly type = GeoJsonTypes.MultiPolygon;

  get positions(): Position[][][] {
    return this._points.map(
      (polygon) => polygon.map(
        (lineString) => lineString.map(
          (point) => point.positions
        )));
  }

  get points(): Point[][][] {
    return this._points.map(
      (polygon) => polygon.map(
        (lineString) => lineString.map(
          (point) => point.clone()
        )));
  }

  get polygons(): Polygon[] {
    return this._points.map((polygon) => Polygon.fromPoints(polygon));
  }

  pointAtIndex(polygonIndex: number, lineStringIndex: number, pointIndex: number): Point {
    if (polygonIndex < 0 || this._points.length <= polygonIndex) {
      throw new ArgumentOutOfRangeException(
        `Polygon index ${polygonIndex} must be between 0 and ${this._points.length}`);
    }

    const polygon = this._points[polygonIndex];

    if (lineStringIndex < 0 || polygon.length <= lineStringIndex) {
      throw new ArgumentOutOfRangeException(
        `LineString index ${lineStringIndex} must be between 0 and ${this._points.length} at Polygon index ${polygonIndex}`);
    }

    const points = polygon[lineStringIndex];
    if (pointIndex < 0 || points.length <= pointIndex) {
      throw new ArgumentOutOfRangeException(
        `Point index ${pointIndex} must be between 0 and ${points.length} at LineString index ${lineStringIndex}`);
    }

    return points[pointIndex].clone();
  }

  lineStringAtIndex(polygonIndex: number, lineStringIndex: number): LineString {
    if (polygonIndex < 0 || this._points.length <= polygonIndex) {
      throw new ArgumentOutOfRangeException(
        `Polygon index ${polygonIndex} must be between 0 and ${this._points.length}`);
    }

    const polygon = this._points[polygonIndex];

    if (lineStringIndex < 0 || polygon.length <= lineStringIndex) {
      throw new ArgumentOutOfRangeException(
        `LineString index ${lineStringIndex} must be between 0 and ${polygon.length} at Polygon index ${polygonIndex}`);
    }
    return LineString.fromPoints(polygon[lineStringIndex]);
  }

  polygonAtIndex(polygonIndex: number): Polygon {
    if (polygonIndex < 0 || this._points.length <= polygonIndex) {
      throw new ArgumentOutOfRangeException(
        `Polygon index ${polygonIndex} must be between 0 and ${this._points.length}`);
    }
    return Polygon.fromPoints(this._points[polygonIndex]);
  }

  toJson(includeBoundingBox: boolean = false): SerialMultiPolygon {
    const jsonBase = super.toJsonBase(includeBoundingBox);
    const json = {
      ...jsonBase,
      coordinates: this.positions
    } as SerialMultiPolygon;

    return json;
  }

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

  clone(): MultiPolygon {
    return MultiPolygon.fromPoints(this._points, this._bbox);
  }

  protected constructor() {
    super();
  }

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

    return multiPolygon;
  }

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

  static fromPoints(points: Point[][][], bbox?: BoundingBox): MultiPolygon {
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

  static fromPolygons(polygons: Polygon[], bbox?: BoundingBox): MultiPolygon {
    const multiPolygon = new MultiPolygon();

    multiPolygon._points = polygons.map((polygon) => polygon.points);
    multiPolygon._bbox = bbox;

    return multiPolygon;
  }
}