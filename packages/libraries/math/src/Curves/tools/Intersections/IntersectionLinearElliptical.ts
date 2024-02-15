import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { EllipticalCurve } from "../../EllipticalCurve";
import { LinearCurve } from "../../LinearCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of a linear curve and an elliptical curve.
 * @extends {IntersectionAbstract<LinearCurve, EllipticalCurve>}
 */
export class IntersectionLinearElliptical extends IntersectionAbstract<LinearCurve, EllipticalCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the elliptical curve.
   * @type {EllipticalCurve}
   */
  public get EllipticalCurve(): EllipticalCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearElliptical class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {EllipticalCurve} ellipticalCurve The elliptical curve.
   */
  constructor(linearCurve: LinearCurve, ellipticalCurve: EllipticalCurve) {
    super(linearCurve, ellipticalCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearElliptical.AreTangent(this.LinearCurve, this.EllipticalCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearElliptical.AreIntersecting(this.LinearCurve, this.EllipticalCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearElliptical.IntersectionCoordinates(this.LinearCurve, this.EllipticalCurve);
  }

  /**
   * Calculates if two curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {EllipticalCurve} ellipticalCurve The elliptical curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(linearCurve: LinearCurve, ellipticalCurve: EllipticalCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates if two curves intersect and are not tangent.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {EllipticalCurve} ellipticalCurve The elliptical curve.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public static AreIntersecting(linearCurve: LinearCurve, ellipticalCurve: EllipticalCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {EllipticalCurve} ellipticalCurve The elliptical curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(linearCurve: LinearCurve, ellipticalCurve: EllipticalCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
