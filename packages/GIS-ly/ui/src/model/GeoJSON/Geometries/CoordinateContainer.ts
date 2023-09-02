import { Geometry as SerialGeometry } from 'geojson';

import { GeoJsonProperties } from '../GeoJson';
import { BoundingBox } from "../BoundingBox";

import { Geometry, IGeometry } from "./Geometry";
import { PointProperties } from "./Point";
import { BBoxState } from '../enums';

export interface CoordinateContainerProperties<TPoint> extends GeoJsonProperties {
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
  IGeometry<CoordinateContainerProperties<TPoint>, TSerial>,
  CoordinateContainerProperties<TPoint> {

  /**
  * The coordinates which define the geometry.
  *
  * Typically a list of points but for some geometry such as polygon this can be a list of a list of points,
  * thus the return is generic here.
  *
  * @return {*}  {T} The `Point`s which make up the coordinates defining the geometry.
  * @memberof ICoordinateContainer
  */
  toPositions(): TPosition
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
  extends Geometry<CoordinateContainerProperties<TPoint>, TSerial>
  implements ICoordinateContainer<TPosition, TPoint, TSerial> {

  /**
   * Buffer applied to bounding boxes around single points.
   *
   * @protected
   * @type {number}
   * @memberof CoordinateContainer
   */
  protected _buffer: number = 0;

  bbox(): BoundingBox {
    if (!this._bbox) {
      if (Array.isArray(this._points)) {
        const points = this._points.flat(Infinity);
        this._bbox = BoundingBox.fromPoints(points);
      } else {
        this._bbox = BoundingBox.fromPoint(this as unknown as PointProperties, this._buffer);
      }
      this._bboxDirty = true;
    }
    return this._bbox;
  }

  hasBBox(): boolean {
    return this._bbox !== undefined;
  }

  abstract toPositions(): TPosition;

  protected _points: TPoint;
  abstract get points(): TPoint;

  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): TSerial {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      coordinates: this.toPositions()
    };

    return json as unknown as TSerial;
  }

  save(): void {
    this.saveBBox();
  }
}