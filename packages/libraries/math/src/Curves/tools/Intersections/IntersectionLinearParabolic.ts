import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { LinearCurve } from "../../LinearCurve";
import { ParabolicCurve } from "../../ParabolicCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of a linear curve and a parabolic curve.
 * @extends {IntersectionAbstract<LinearCurve, ParabolicCurve>}
 */
export class IntersectionLinearParabolic extends IntersectionAbstract<LinearCurve, ParabolicCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the parabolic curve.
   * @type {ParabolicCurve}
   */
  public get ParabolicCurve(): ParabolicCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearParabolic class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {ParabolicCurve} parabolicCurve The parabolic curve.
   */
  constructor(linearCurve: LinearCurve, parabolicCurve: ParabolicCurve) {
    super(linearCurve, parabolicCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearParabolic.AreTangent(this.LinearCurve, this.ParabolicCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearParabolic.AreIntersecting(this.LinearCurve, this.ParabolicCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearParabolic.IntersectionCoordinates(this.LinearCurve, this.ParabolicCurve);
  }

  /**
   * Calculates the separation of the centers of the curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {ParabolicCurve} parabolicCurve The parabolic curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(linearCurve: LinearCurve, parabolicCurve: ParabolicCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {ParabolicCurve} parabolicCurve The parabolic curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(linearCurve: LinearCurve, parabolicCurve: ParabolicCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves intersect and are not tangent.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {ParabolicCurve} parabolicCurve The parabolic curve.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public static AreIntersecting(linearCurve: LinearCurve, parabolicCurve: ParabolicCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {ParabolicCurve} parabolicCurve The parabolic curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(linearCurve: LinearCurve, parabolicCurve: ParabolicCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
