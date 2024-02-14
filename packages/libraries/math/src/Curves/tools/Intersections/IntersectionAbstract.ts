import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { Curve } from "../../Curve";
import { ICurveIntersection } from "./ICurveIntersection";


/**
 * Abstract class representing the intersection between two curves.
 * @template T1 The type of curve 1.
 * @template T2 The type of curve 2.
 * @abstract
 * @implements {ICurveIntersection<T1, T2>}
 */
export abstract class IntersectionAbstract<T1 extends Curve, T2 extends Curve> implements ICurveIntersection<T1, T2> {
  /**
   * Gets the first curve.
   * @type {T1}
   */
  public Curve1: T1;

  /**
   * Gets the second curve.
   * @type {T2}
   */
  public Curve2: T2;

  /**
   * Creates an instance of IntersectionAbstract.
   * @param {T1} curve1 The first curve.
   * @param {T2} curve2 The second curve.
   */
  protected constructor(curve1: T1, curve2: T2) {
    this.Curve1 = curve1;
    this.Curve2 = curve2;
  }

  /**
   * Determines if the curves are tangent to each other.
   * @abstract
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public abstract AreTangent(): boolean;

  /**
   * Determines if the curves intersect and are not tangent.
   * @abstract
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public abstract AreIntersecting(): boolean;

  /**
   * Gets the coordinates of the intersection of two curves.
   * @abstract
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  public abstract IntersectionCoordinates(): CartesianCoordinate[];
}
