import { Angle } from "../../../coordinates/Angle";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { ConicParametricAngularComponents } from "./ConicParametricAngularComponents";

/**
 * Class containing the assigned components of a parametric equation in coordinates about the conic focus and the corresponding curve object for conic sections.
 * This class has the basic components of differentiating and accessing the different parametric equations.
 * Also contains operators to implement scaling of the parametric equations.
 * @extends {ConicParametricAngularComponents}
 * @internal
 */
export class ConicFocusParametricAngularComponents extends ConicParametricAngularComponents {
  /**
   * Initializes a new instance of the ConicFocusParametricAngularComponents class.
   * @param {ConicSectionCurve} parent The parent conic section curve.
   */
  public constructor(parent: ConicSectionCurve) {
    super(parent);
  }

  /**
   * Bases the by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {Angle} The base by parameter value.
   */
  public override BaseByParameter(angleRadians: number): Angle {
    return new Angle(angleRadians);
  }

  /**
   * Primes the by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {Angle} The prime by parameter value.
   */
  public override PrimeByParameter(angleRadians: number): Angle {
    return new Angle(0);
  }

  /**
   * Primes the double by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {Angle} The double prime by parameter value.
   * @throws {Error} If the method is not implemented.
   */
  public override PrimeDoubleByParameter(angleRadians: number): Angle {
    throw new Error('Method not implemented');
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {ConicFocusParametricAngularComponents} A new object that is a copy of this instance.
   */
  public override Clone(): ConicFocusParametricAngularComponents {
    return this.cloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {ConicFocusParametricAngularComponents} A new instance of ConicFocusParametricAngularComponents.
   */
  public cloneParametric(): ConicFocusParametricAngularComponents {
    const parametric = new ConicFocusParametricAngularComponents(this.parent);
    return parametric;
  }
}
