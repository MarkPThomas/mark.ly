import { ConicSectionCurve } from "../../ConicSectionCurve";
import { Curve } from "../../Curve";
import { DoubleParametricComponent } from "../components/Types/DoubleParametricComponent";
import { ParametricComponents } from "../components/Types/ParametricComponents";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";

/**
 * Class containing the assigned components of a parametric equation in coordinates about the conic focus and the corresponding curve object for conic sections.
 * This class has the basic components of differentiating and accessing the different parametric equations.
 * Also contains operators to implement scaling of the parametric equations.
 * @extends {ConicParametricDoubleComponents}
 * @internal
 */
export class ConicFocusParametricDoubleComponents extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the ConicFocusParametricDoubleComponents class.
   * @param {ConicSectionCurve} parent The parent conic section curve.
   */
  public constructor(parent: ConicSectionCurve) {
    super(parent);
  }

  /**
   * The radius measured from the focus as a function of the angle in local coordinates.
   * @param {number} angleRadians The angle in radians in local coordinates.
   * @returns {number} The radius measured from the focus.
   */
  public override BaseByParameter(angleRadians: number): number {
    return this.parent.Eccentricity * this.parent.DistanceFromFocusToDirectrix / (1 - this.parent.Eccentricity * Math.cos(angleRadians));
  }

  /**
   * The differential change in radius corresponding with a differential change in the angle, measured from the focus as a function of the angle in local coordinates.
   * @param {number} angleRadians The angle in radians in local coordinates.
   * @returns {number} The prime by parameter value.
   */
  public override PrimeByParameter(angleRadians: number): number {
    return -1 * this.parent.Eccentricity ** 2 * this.parent.DistanceFromFocusToDirectrix * Math.sin(angleRadians) / (1 - this.parent.Eccentricity * Math.cos(angleRadians));
  }

  /**
   * Primes the double by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The double prime by parameter value.
   * @throws {Error} If the method is not implemented.
   */
  public override PrimeDoubleByParameter(angleRadians: number): number {
    throw new Error('Method not implemented');
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {ConicFocusParametricDoubleComponents} A new object that is a copy of this instance.
   */
  public override Clone(): ConicFocusParametricDoubleComponents {
    return this.cloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {ConicFocusParametricDoubleComponents} A new instance of ConicFocusParametricDoubleComponents.
   */
  public cloneParametric(): ConicFocusParametricDoubleComponents {
    const parametric = new ConicFocusParametricDoubleComponents(this.parent);
    return parametric;
  }
}
