import { Polygon as SerialPolygon } from 'geojson';

import { GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { Position } from "../types";

import { BoundingBox } from "../BoundingBox";

import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { Point } from "./Point";
import { LineString } from "./LineString";

export type PolygonOptions = {
  /**
   * `LineString`s that define holes within the polygon.
   *
   * @type {LineStringType[]}
   */
  inner?: LineString[],
  bbox?: BoundingBox
}

export interface PolygonProperties extends ICoordinateContainer<Position[][], Point[][], SerialPolygon> {
}

export interface IPolygon
  extends PolygonProperties {

  /**
   * Convenience method to get the outer `LineString` which defines the outer perimeter of the polygon.
   *
   * @return {*}  {LineStringType}
   * @memberof IPolygon
   */
  outer(): LineString;

  /**
   * Convenience method to get a list of inner `LineStrings` defining holes inside the polygon.
   *
   * @return {*}  {LineStringType[]}
   * @memberof IPolygon
   */
  inner(): LineString[];
}

/**
 * This class represents a GeoJson `Polygon` which may or may not include polygon holes.
To specify a constraint specific to Polygons, it is useful to introduce the concept of a linear ring:

A linear ring is a closed `LineString` with four or more coordinates.
The first and last coordinates are equivalent, and they MUST contain identical values; their representation SHOULD also be identical.
A linear ring is the boundary of a surface or the boundary of a hole in a surface.
A linear ring MUST follow the right-hand rule with respect to the area it bounds, i.e., exterior rings are counterclockwise, and holes are clockwise.
Note that most of the rules listed above are checked when a `Polygon` instance is created (the exception being the last rule). If one of the rules is broken, a RuntimeException will occur.
Though a linear ring is not explicitly represented as a GeoJson geometry TYPE, it leads to a canonical formulation of the `Polygon` geometry TYPE. When initializing a new instance of this class, a `LineString` for the outer and optionally an inner are checked to ensure a valid linear ring.

An example of a serialized `Polygon` with no holes is given below:

 {
   "type": "Polygon",
   "coordinates": [
     [[100.0, 0.0],
     [101.0, 0.0],
     [101.0, 1.0],
     [100.0, 1.0],
     [100.0, 0.0]]
   ]
 }
 *
 * @export
 * @class Polygon
 * @extends {MultiLineString}
 * @implements {IPolygon}
 */
export class Polygon
  extends CoordinateContainer<Position[][], Point[][], SerialPolygon>
  implements IPolygon {

  readonly type = GeoJsonTypes.Polygon;

  get points(): Point[][] {
    return this._points.map(
      (lineString) => [...lineString]
    );
  }

  toPositions(): Position[][] {
    return this._points.map(
      (lineString) => lineString.map(
        (point) => point.toPositions()
      ));
  }

  outer(): LineString {
    return LineString.fromPoints(this._points[0]);
  }

  inner(): LineString[] {
    const lineStrings = [];

    for (let lineString = 1; lineString < this._points.length; lineString++) {
      lineStrings.push(LineString.fromPoints(this._points[lineString]));
    }

    return lineStrings;
  }

  equals(item: Polygon): boolean {
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

  clone(): Polygon {
    return Polygon.fromPoints(this._points, this._bbox);
  }

  protected constructor() {
    super();
  }

  // TODO: Add shape validations
  // 1. Linear Ring check - and fix by capping?
  // 2. Segment crossover check - throw error
  // 3. Order check - vector determining holes vs. solids - and fix by reversing?
  // 4. Overlap check? - Must all holes lie entirely within solid? Generate bounding boxes to check.
  //    Can also be used to programmatically determine solid vs. hole, alongside order check, but index position may be better.
  // Add appropriate InvalidGeometryExceptions for cases that cannot be handled.

  static fromJson(json: SerialPolygon): Polygon {
    const coordinates = json.coordinates as Position[][];

    if (!coordinates) {
      throw new InvalidGeometryException(
        `Invalid Coordinates type for "${GeoJsonTypes.Polygon}". Must be an array of "Position" arrays.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.6
        \n ${json.coordinates}`);
    }

    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined
    const polygon = Polygon.fromPositions(coordinates, bbox);

    return polygon;
  }

  /**
   *
   *
   * @static
   * @param {Position[][]} positions Convention is for the outer shape to be the first item in the array. Later items are holes.
   * @param {BoundingBox} [bbox]
   * @return {*}  {Polygon}
   * @memberof Polygon
   */
  static fromPositions(positions: Position[][], bbox?: BoundingBox): Polygon {
    const polygon = new Polygon();

    polygon._points =
      positions.map(
        (lineString) => lineString.map(
          (position) => Point.fromPosition(position)
        ));
    polygon._bbox = bbox;

    return polygon;
  }

  /**
   *
   *
   * @static
   * @param {Point[][]} points Convention is for the outer shape to be the first item in the array. Later items are holes.
   * @param {BoundingBox} [bbox]
   * @return {*}  {Polygon}
   * @memberof Polygon
   */
  static fromPoints(points: Point[][], bbox?: BoundingBox): Polygon {
    const polygon = new Polygon();

    polygon._points =
      points.map(
        (lineString) => lineString.map(
          (coordinate) => coordinate.clone()
        ));
    polygon._bbox = bbox;

    return polygon;
  }

  /**
   *
   *
   * @static
   * @param {LineString} outer
   * @param {PolygonOptions} { inner, bbox }
   * @return {*}  {Polygon}
   * @memberof Polygon
   */
  static fromOuterInner(outer: LineString, { inner, bbox }: PolygonOptions): Polygon {
    const polygon = new Polygon();

    polygon._points = [outer.points];

    if (inner) {
      inner.forEach((hole) => {
        polygon._points.push(hole.points);
      })
    }

    polygon._bbox = bbox;

    return polygon;
  }
}