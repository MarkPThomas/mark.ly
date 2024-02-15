import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { LinearCurve } from "../../LinearCurve";
import { LogarithmicSpiralCurve } from "../../LogarithmicSpiralCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of a linear curve and a logarithmic spiral curve.
 * @extends {IntersectionAbstract<LinearCurve, LogarithmicSpiralCurve>}
 */
export class IntersectionLinearLogarithmicSpiral extends IntersectionAbstract<LinearCurve, LogarithmicSpiralCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get LinearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the logarithmic spiral curve.
   * @type {LogarithmicSpiralCurve}
   */
  public get LogarithmicSpiralCurve(): LogarithmicSpiralCurve {
    return this.Curve2;
  }

  /**
   * Initializes a new instance of the IntersectionLinearLogarithmicSpiral class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {LogarithmicSpiralCurve} logarithmicSpiralCurve The logarithmic spiral curve.
   */
  constructor(linearCurve: LinearCurve, logarithmicSpiralCurve: LogarithmicSpiralCurve) {
    super(linearCurve, logarithmicSpiralCurve);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionLinearLogarithmicSpiral.AreTangent(this.LinearCurve, this.LogarithmicSpiralCurve);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionLinearLogarithmicSpiral.AreIntersecting(this.LinearCurve, this.LogarithmicSpiralCurve);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearLogarithmicSpiral.IntersectionCoordinates(this.LinearCurve, this.LogarithmicSpiralCurve);
  }

  /**
   * Calculates the separation of the centers of the curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {LogarithmicSpiralCurve} logarithmicSpiralCurve The logarithmic spiral curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(linearCurve: LinearCurve, logarithmicSpiralCurve: LogarithmicSpiralCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {LogarithmicSpiralCurve} logarithmicSpiralCurve The logarithmic spiral curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(linearCurve: LinearCurve, logarithmicSpiralCurve: LogarithmicSpiralCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Checks if two curves intersect and are not tangent.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {LogarithmicSpiralCurve} logarithmicSpiralCurve The logarithmic spiral curve.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public static AreIntersecting(linearCurve: LinearCurve, logarithmicSpiralCurve: LogarithmicSpiralCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {LogarithmicSpiralCurve} logarithmicSpiralCurve The logarithmic spiral curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(linearCurve: LinearCurve, logarithmicSpiralCurve: LogarithmicSpiralCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
