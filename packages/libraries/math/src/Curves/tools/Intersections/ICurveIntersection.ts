import { CartesianCoordinate } from "../../../Coordinates/CartesianCoordinate";
import { ICurve } from "../../ICurve";


/**
 * Interface representing the intersection between two curves.
 * @template T1 The type of curve 1.
 * @template T2 The type of curve 2.
 */
export interface ICurveIntersection<T1 extends ICurve, T2 extends ICurve> {
  /**
   * Gets the first curve.
   * @type {T1}
   */
  Curve1: T1;

  /**
   * Gets the second curve.
   * @type {T2}
   */
  Curve2: T2;

  /**
   * Determines if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  AreTangent(): boolean;

  /**
   * Determines if the curves intersect.
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  AreIntersecting(): boolean;

  /**
   * Gets the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  IntersectionCoordinates(): CartesianCoordinate[];
}
