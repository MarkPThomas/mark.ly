import { LineString as SerialLineString } from 'geojson';

import { ArgumentOutOfRangeException } from "../../../../../../../common/errors/exceptions";

import { GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { Position } from "../types";

import { BoundingBox } from "../BoundingBox";

import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { IMultiPoint } from "./MultiPoint";
import { Point } from "./Point";

export interface LineStringProperties extends ICoordinateContainer<Position[], Point[], SerialLineString> {
}

export interface ILineString
  extends LineStringProperties {
  pointAtIndex(index: number): Point;
  // toPolyline(precision: number): string;
}

/**
 * A linestring represents two or more geographic points that share a relationship and is one of the seven geometries found in the GeoJson spec.
This adheres to the RFC 7946 internet standard when serialized into JSON. When deserialized, this class becomes an immutable object which should be initiated using its static factory methods.

The list of points must be equal to or greater than 2. A `LineString` has non-zero length and zero area. It may approximate a curve and need not be straight. Unlike a `LinearRing`, a `LineString` is not closed.

When representing a `LineString` that crosses the antimeridian, interoperability is improved by modifying their geometry. Any geometry that crosses the antimeridian SHOULD be represented by cutting it in two such that neither part's representation crosses the antimeridian.

For example, a line extending from 45 degrees N, 170 degrees E across the antimeridian to 45 degrees N, 170 degrees W should be cut in two and represented as a `MultiLineString`.

A sample GeoJson `LineString`'s provided below (in it's serialized state).

 {
   "type": "LineString",
   "coordinates": [
     [100.0, 0.0],
     [101.0, 1.0]
   ]
 }

Look over the `Point` documentation to get more information about formatting your list of point objects correctly.
 *
 * @export
 * @class LineString
 * @extends {MultiPoint}
 * @implements {ILineString}
 */
export class LineString
  extends CoordinateContainer<Position[], Point[], SerialLineString>
  implements ILineString {

  readonly type = GeoJsonTypes.LineString;

  get points(): Point[] {
    return [...this._points];
  }

  toPositions(): Position[] {
    return this._points.map((point) => point.toPositions());
  }

  pointAtIndex(pointIndex: number): Point {
    if (pointIndex < 0 || this._points.length <= pointIndex) {
      throw new ArgumentOutOfRangeException(`Point index ${pointIndex} must be between 0 and ${this._points.length}`);
    }
    return this._points[pointIndex].clone();
  }

  // toPolyline(precision: number): string {
  //   // TODO: Implement
  //   throw new Error("Method not implemented.");
  // }

  equals(item: LineStringProperties): boolean {
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

  clone(): LineString {
    return LineString.fromPoints(this._points, this._bbox);
  }

  protected constructor() {
    super();
  }

  static fromJson(json: SerialLineString): LineString {
    const coordinates = json.coordinates as Position[];

    if (!coordinates) {
      throw new InvalidGeometryException(
        `Invalid Coordinates type for "${GeoJsonTypes.LineString}". Must be a "Position" array.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.4
        \n ${json.coordinates}`);
    }

    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined
    const lineString = LineString.fromPositions(coordinates, bbox);

    return lineString;
  }

  static fromPositions(positions: Position[], bbox?: BoundingBox): LineString {
    const lineString = new LineString();

    lineString._points = positions.map((position) => Point.fromPosition(position));
    lineString._bbox = bbox;

    return lineString;
  }

  static fromPoints(points: Point[], bbox?: BoundingBox): LineString {
    const lineString = new LineString();

    lineString._points = [...points];
    lineString._bbox = bbox;

    return lineString;
  }

  /**
   *
   *
   * @static
   * @param {MultiPoint} multiPoint
   * @param {BoundingBox} [bbox]
   * @return {*}  {LineString}
   * @memberof LineString
   */
  static fromMultiPoint(multiPoint: IMultiPoint, bbox?: BoundingBox): LineString {
    const lineString = new LineString();

    lineString._points = [...multiPoint.points];
    if (bbox) {
      lineString._bbox = bbox;
    }

    return lineString;
  }

  // /**
  //  * Create a new instance of this class by converting a polyline string into a lineString.
  //  *
  //  * This is handy when an API provides you with an encoded string representing the line geometry and you'd like to convert it to a useful `LineString` object.
  //  *
  //  * Note that the precision that the string geometry was encoded with needs to be known and passed into this method using the precision parameter.
  //  *
  //  * @static
  //  * @param {string} polyLine Encoded string geometry to decode into a new LineString instance
  //  * @param {number} precision The encoded precision which must match the same precision used when the string was first encoded
  //  * @param {BoundingBox} [bbox]
  //  * @memberof LineString
  //  */
  // static fromPolyLine(polyLine: string, precision: number, bbox?: BoundingBox): LineString {
  //   const lineString = new LineString();

  //   // lineString._points = // TODO: Conversion
  //   lineString._bbox = bbox;

  //   return lineString;
  // }
}