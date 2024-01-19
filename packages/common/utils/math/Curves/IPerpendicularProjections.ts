import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";

export interface IPerpendicularProjections {
  /**
   * oordinate of where a perpendicular projection from a curve tangent intersects the provided coordinate.
   *
   * @param {CartesianCoordinate} point
   * @return {*}  {CartesianCoordinate}
   * @memberof IPerpendicularProjections
   */
  CoordinateOfPerpendicularProjection(point: CartesianCoordinate): CartesianCoordinate;
}