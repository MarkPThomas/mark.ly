import { Geometry as SerialGeometry } from 'geojson';

import { BoundingBox } from "../BoundingBox";
import { Geometry, IGeometry } from "./Geometry";
import { Point, PointProperties } from "./Point";
import { GeoJsonProperties } from '../IGeoJSON';
import { GeoJsonTypes } from '../enums';
import { LineString } from './LineString';
import { MultiPoint } from './MultiPoint';
import { MultiPolygon } from './MultiPolygon';
import { MultiLineString } from './MultiLineString';
import { Polygon } from './Polygon';
import { InvalidGeometryException } from '../exceptions';

export interface CoordinateContainerProperties<TPosition, TPoint> extends GeoJsonProperties {
  /**
  * The coordinates which define the geometry.
  *
  * Typically a list of points but for some geometry such as polygon this can be a list of a list of points,
  * thus the return is generic here.
  *
  * @return {*}  {T} The `Point`s which make up the coordinates defining the geometry.
  * @memberof ICoordinateContainer
  */
  positions: TPosition
  points: TPoint
}

/**
 * Each of the 6 geometries which make up GeoJson implement this interface and consume a varying dimension of `Position` or `Point` list.
 *
 * Since this is varying, each geometry object fulfills the contract by replacing the generic with a well defined list of `Point`s.
 *
 * @export
 * @interface ICoordinateContainer
 * @extends {IGeometry<TJson>}
 * @template TPosition a generic allowing varying dimensions for each GeoJson geometry.
 * @template TJson a generic of the serializable type for each GeoJson geometry.
 */
export interface ICoordinateContainer<TPosition, TPoint, TSerial extends SerialGeometry>
  extends
  IGeometry<CoordinateContainerProperties<TPosition, TPoint>, TSerial>,
  CoordinateContainerProperties<TPosition, TPoint> {

}

/**
 * Each of the 6 geometries which make up GeoJson implement this interface and consume a varying dimension of `Position` or `Point` list.
 *
 * Since this is varying, each geometry object fulfills the contract by replacing the generic with a well defined list of `Point`s.
 *
 *
 * @export
 * @abstract
 * @class CoordinateContainer
 * @extends {Geometry<CoordinateContainerType<TPosition>>}
 * @implements {ICoordinateContainer<TPosition>}
 * @template TPosition
 */
export abstract class CoordinateContainer<TPosition, TPoint, TSerial extends SerialGeometry>
  extends Geometry<CoordinateContainerProperties<TPosition, TPoint>, TSerial>
  implements ICoordinateContainer<TPosition, TPoint, TSerial> {

  /**
   * Buffer applied to bounding boxes around single points.
   *
   * @protected
   * @type {number}
   * @memberof CoordinateContainer
   */
  protected _buffer: number = 0;
  get bbox(): BoundingBox {
    if (!this._bbox) {
      if (Array.isArray(this._points)) {
        const points = this._points.flat(Infinity);
        this._bbox = BoundingBox.fromPoints(points);
      } else {
        this._bbox = BoundingBox.fromPoint(this._points as PointProperties, this._buffer);
      }
    }
    return this._bbox;
  }

  abstract get positions(): TPosition;

  protected _points: TPoint;
  abstract get points(): TPoint;

  toJson(includeBoundingBox: boolean = false): TSerial {
    const jsonBase = super.toJsonBase(includeBoundingBox);
    const json = {
      ...jsonBase,
      coordinates: this.positions as TPosition
    };

    return json as unknown as TSerial;
  }

  static fromJson(json: SerialGeometry): IGeometry<GeoJsonProperties, SerialGeometry> {
    switch (json.type) {
      case GeoJsonTypes.Point:
        return Point.fromJson(json);
      case GeoJsonTypes.MultiPoint:
        return MultiPoint.fromJson(json);
      case GeoJsonTypes.LineString:
        return LineString.fromJson(json);
      case GeoJsonTypes.MultiLineString:
        return MultiLineString.fromJson(json);
      case GeoJsonTypes.Polygon:
        return Polygon.fromJson(json);
      case GeoJsonTypes.MultiPolygon:
        return MultiPolygon.fromJson(json);
      default:
        throw new InvalidGeometryException(`${InvalidGeometryException.DEFAULT_MESSAGE} \n ${json}`);
    }
  }
}