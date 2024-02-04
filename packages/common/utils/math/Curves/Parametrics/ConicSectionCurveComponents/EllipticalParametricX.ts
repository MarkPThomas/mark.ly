import { TrigonometryLibrary } from "../../../Trigonometry/TrigonometryLibrary";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { ConicSectionEllipticCurve } from "../../ConicSectionEllipticCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";

/**
 * Represents an elliptical curve in parametric equations defining the x-component and differentials.
 * @extends {ConicParametricDoubleComponents}
 * @internal
 */
export class EllipticalParametricX extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the EllipticalParametricX class.
   * @param {ConicSectionEllipticCurve} parent The parent elliptical curve.
   */
  public constructor(parent: ConicSectionEllipticCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * Bases the by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The base by parameter value.
   */
  public override BaseByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Primes the by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The prime by parameter value.
   */
  public override PrimeByParameter(angleRadians: number): number {
    return -1 * this.parent.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * Primes the double by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The double prime by parameter value.
   */
  public override PrimeDoubleByParameter(angleRadians: number): number {
    return -1 * this.parent.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {EllipticalParametricX} A new object that is a copy of this instance.
   */
  public override Clone(): EllipticalParametricX {
    return this.cloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {EllipticalParametricX} A new instance of EllipticalParametricX.
   */
  public cloneParametric(): EllipticalParametricX {
    const parametric = new EllipticalParametricX(this.parent as unknown as ConicSectionEllipticCurve);
    return parametric;
  }
}
