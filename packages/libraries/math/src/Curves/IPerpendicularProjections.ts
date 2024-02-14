import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @export
 * @interface IPerpendicularProjections
 * @typedef {IPerpendicularProjections}
 */
export interface IPerpendicularProjections {
  /**
   * Coordinate of where a perpendicular projection from a curve tangent intersects the provided coordinate.
   *
   * @param {CartesianCoordinate} point
   * @return {*}  {CartesianCoordinate}
   * @memberof IPerpendicularProjections
   */
  CoordinateOfPerpendicularProjection(point: CartesianCoordinate): CartesianCoordinate;
}