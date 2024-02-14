import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { LinearCurve } from "../../LinearCurve";
import { QuadraticCurve } from "../../QuadraticCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of a linear curve and a quadratic curve.
 * @extends {IntersectionAbstract<LinearCurve, QuadraticCurve>}
 */
export class IntersectionLinearQuadratic extends IntersectionAbstract<LinearCurve, QuadraticCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the quadratic curve.
   * @type {QuadraticCurve}
   */
  public get QuadraticCurve(): QuadraticCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearQuadratic class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {QuadraticCurve} quadraticCurve The quadratic curve.
   */
  constructor(linearCurve: LinearCurve, quadraticCurve: QuadraticCurve) {
    super(linearCurve, quadraticCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearQuadratic.AreTangent(this.LinearCurve, this.QuadraticCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearQuadratic.AreIntersecting(this.LinearCurve, this.QuadraticCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearQuadratic.IntersectionCoordinates(this.LinearCurve, this.QuadraticCurve);
  }

  /**
   * Calculates the separation of the centers of the curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {QuadraticCurve} quadraticCurve The quadratic curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(linearCurve: LinearCurve, quadraticCurve: QuadraticCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {QuadraticCurve} quadraticCurve The quadratic curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(linearCurve: LinearCurve, quadraticCurve: QuadraticCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves intersect and are not tangent.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {QuadraticCurve} quadraticCurve The quadratic curve.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public static AreIntersecting(linearCurve: LinearCurve, quadraticCurve: QuadraticCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {QuadraticCurve} quadraticCurve The quadratic curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(linearCurve: LinearCurve, quadraticCurve: QuadraticCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
