import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { HyperbolicCurve } from "../../HyperbolicCurve";
import { LinearCurve } from "../../LinearCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of a linear curve and a hyperbolic curve.
 * @extends {IntersectionAbstract<LinearCurve, HyperbolicCurve>}
 */
export class IntersectionLinearHyperbolic extends IntersectionAbstract<LinearCurve, HyperbolicCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the hyperbolic curve.
   * @type {HyperbolicCurve}
   */
  public get HyperbolicCurve(): HyperbolicCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearHyperbolic class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {HyperbolicCurve} hyperbolicCurve The hyperbolic curve.
   */
  constructor(linearCurve: LinearCurve, hyperbolicCurve: HyperbolicCurve) {
    super(linearCurve, hyperbolicCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearHyperbolic.AreTangent(this.LinearCurve, this.HyperbolicCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearHyperbolic.AreIntersecting(this.LinearCurve, this.HyperbolicCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearHyperbolic.IntersectionCoordinates(this.LinearCurve, this.HyperbolicCurve);
  }

  /**
   * Calculates the separation of the centers of the curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {HyperbolicCurve} hyperbolicCurve The hyperbolic curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(linearCurve: LinearCurve, hyperbolicCurve: HyperbolicCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {HyperbolicCurve} hyperbolicCurve The hyperbolic curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(linearCurve: LinearCurve, hyperbolicCurve: HyperbolicCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves intersect and are not tangent.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {HyperbolicCurve} hyperbolicCurve The hyperbolic curve.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public static AreIntersecting(linearCurve: LinearCurve, hyperbolicCurve: HyperbolicCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {HyperbolicCurve} hyperbolicCurve The hyperbolic curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(linearCurve: LinearCurve, hyperbolicCurve: HyperbolicCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
