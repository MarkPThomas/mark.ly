import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { CircularCurve } from "../../CircularCurve";
import { CubicCurve } from "../../CubicCurve";
import { LinearCurve } from "../../LinearCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";

/**
 * Represents the intersection of a linear curve and a cubic curve.
 * @extends {IntersectionAbstract<LinearCurve, CubicCurve>}
 */
export class IntersectionLinearCubic extends IntersectionAbstract<LinearCurve, CubicCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the cubic curve.
   * @type {CubicCurve}
   */
  public get CubicCurve(): CubicCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearCubic class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CubicCurve} cubicCurve The cubic curve.
   */
  constructor(linearCurve: LinearCurve, cubicCurve: CubicCurve) {
    super(linearCurve, cubicCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearCubic.AreTangent(this.LinearCurve, this.CubicCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearCubic.AreIntersecting(this.LinearCurve, this.CubicCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearCubic.IntersectionCoordinates(this.LinearCurve, this.CubicCurve);
  }

  /**
   * Calculates the separation of the centers of the curves.
   * @param {CircularCurve} curve1 The first curve.
   * @param {CircularCurve} curve2 The second curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(curve1: CircularCurve, curve2: CircularCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Determines if two curves are tangent to each other.
   * @param {CircularCurve} curve1 The first curve.
   * @param {CircularCurve} curve2 The second curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(curve1: LinearCurve, curve2: CubicCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Determines if two curves intersect.
   * @param {LinearCurve} curve1 The first curve.
   * @param {CircularCurve} curve2 The second curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public static AreIntersecting(curve1: LinearCurve, curve2: CubicCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} curve1 The first curve.
   * @param {CircularCurve} curve2 The second curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(curve1: LinearCurve, curve2: CubicCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
