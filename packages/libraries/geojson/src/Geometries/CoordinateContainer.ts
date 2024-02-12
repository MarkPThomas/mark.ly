import { Geometry as SerialGeometry } from 'geojson';

import { GeoJsonProperties } from '../GeoJson';
import { BoundingBox } from "../BoundingBox";

import { Geometry, IGeometry } from "./Geometry";
import { PointProperties } from "./Point";
import { BBoxState } from '../enums';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @export
 * @interface CoordinateContainerProperties
 * @typedef {CoordinateContainerProperties}
 * @template TPoint
 * @extends {GeoJsonProperties}
 */
export interface CoordinateContainerProperties<TPoint> extends GeoJsonProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @type {TPoint}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {BoundingBox}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {boolean}
 */
  hasBBox(): boolean {
    return this._bbox !== undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @abstract
 * @returns {TPosition}
 */
  abstract toPositions(): TPosition;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @protected
 * @type {TPoint}
 */
  protected _points: TPoint;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @abstract
 * @readonly
 * @type {TPoint}
 */
  abstract get points(): TPoint;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {TSerial}
 */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): TSerial {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      coordinates: this.toPositions()
    };

    return json as unknown as TSerial;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 */
  save(): void {
    this.saveBBox();
  }
}