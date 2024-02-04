import { TrigonometryLibrary } from "../../../Trigonometry/TrigonometryLibrary";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { ConicSectionEllipticCurve } from "../../ConicSectionEllipticCurve";
import { EllipticalCurve } from "../../EllipticalCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";


/**
 * Represents an elliptical curve in parametric equations defining the y-component and differentials.
 * @extends {ConicParametricDoubleComponents}
 */
export class EllipticalParametricY extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the `EllipticalParametricY` class.
   * @param {ConicSectionEllipticCurve} parent The parent.
   */
  constructor(parent: ConicSectionEllipticCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * Bases the by angle.
   * @param {number} angleRadians The angle radians.
   * @returns {number} The resulting value.
   */
  BaseByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * Primes the by angle.
   * @param {number} angleRadians The angle radians.
   * @returns {number} The resulting value.
   */
  PrimeByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Primes the double by angle.
   * @param {number} angleRadians The angle radians.
   * @returns {number} The resulting value.
   */
  PrimeDoubleByParameter(angleRadians: number): number {
    return -1 * this.parent.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {EllipticalParametricY} A new object that is a copy of this instance.
   */
  Clone(): EllipticalParametricY {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {EllipticalParametricY} The cloned curve.
   */
  CloneParametric(): EllipticalParametricY {
    const parametric = new EllipticalParametricY(this.parent as unknown as EllipticalCurve);
    return parametric;
  }
}
