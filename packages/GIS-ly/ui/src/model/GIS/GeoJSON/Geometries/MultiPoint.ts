import { MultiPoint as SerialMultiPoint } from 'geojson';

import { ArgumentOutOfRangeException } from "../../../../../../../common/errors/exceptions";

import { GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { Position } from "../types";

import { BoundingBox } from "../BoundingBox";

import { CoordinateContainer, ICoordinateContainer } from "./CoordinateContainer";
import { Point } from "./Point";

export interface MultiPointProperties extends ICoordinateContainer<Position[], Point[], SerialMultiPoint> {
}

export interface IMultiPoint
  extends MultiPointProperties {
  pointAtIndex(index: number): Point;
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

  readonly type = GeoJsonTypes.MultiPoint;

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

  clone(): MultiPoint {
    return MultiPoint.fromPoints(this._points, this._bbox);
  }

  protected constructor() {
    super();
  }

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

    return multiPoint;
  }

  static fromPositions(positions: Position[], bbox?: BoundingBox): MultiPoint {
    const multiPoint = new MultiPoint();

    multiPoint._points = positions.map((position) => Point.fromPosition(position));
    multiPoint._bbox = bbox;

    return multiPoint;
  }

  static fromPoints(points: Point[], bbox?: BoundingBox): MultiPoint {
    const multiPoint = new MultiPoint();

    multiPoint._points = [...points];
    multiPoint._bbox = bbox;

    return multiPoint;
  }
}