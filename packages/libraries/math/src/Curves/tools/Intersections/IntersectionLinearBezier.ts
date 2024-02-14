import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { BezierCurve } from "../../BezierCurve";
import { LinearCurve } from "../../LinearCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of a linear curve and a Bezier curve.
 * @extends {IntersectionAbstract<LinearCurve, BezierCurve>}
 */
export class IntersectionLinearBezier extends IntersectionAbstract<LinearCurve, BezierCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the Bezier curve.
   * @type {BezierCurve}
   */
  public get BezierCurve(): BezierCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearBezier class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {BezierCurve} bezierCurve The Bezier curve.
   */
  constructor(linearCurve: LinearCurve, bezierCurve: BezierCurve) {
    super(linearCurve, bezierCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearBezier.AreTangent(this.LinearCurve, this.BezierCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearBezier.AreIntersecting(this.LinearCurve, this.BezierCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearBezier.IntersectionCoordinates(this.LinearCurve, this.BezierCurve);
  }

  /**
   * Calculates the separation of the centers of the curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {BezierCurve} bezierCurve The Bezier curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(linearCurve: LinearCurve, bezierCurve: BezierCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Determines if two curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {BezierCurve} bezierCurve The Bezier curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(linearCurve: LinearCurve, bezierCurve: BezierCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Determines if two curves intersect.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {BezierCurve} bezierCurve The Bezier curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public static AreIntersecting(linearCurve: LinearCurve, bezierCurve: BezierCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {BezierCurve} bezierCurve The Bezier curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(linearCurve: LinearCurve, bezierCurve: BezierCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
