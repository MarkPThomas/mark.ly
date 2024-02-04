import { TrigonometryLibrary } from "../../../Trigonometry/TrigonometryLibrary";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { HyperbolicCurve } from "../../HyperbolicCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";

/**
 * Represents a hyperbolic curve in parametric equations defining the x-component and differentials.
 * @extends {ConicParametricDoubleComponents}
 * @see {@link https://www.ck12.org/book/ck-12-calculus-concepts/section/10.3/}
 */
export class HyperbolicParametricX extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the HyperbolicParametricX class.
   * @param {HyperbolicCurve} parent The parent hyperbolic curve.
   */
  public constructor(parent: HyperbolicCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * X-coordinate on the right curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} The base by parameter value.
   */
  public override BaseByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.CosH(angleRadians);
  }

  /**
   * X-component of the curve slope in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} The prime by parameter value.
   */
  public override PrimeByParameter(angleRadians: number): number {
    return -1 * this.parent.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * X-component of the curve curvature in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} The double prime by parameter value.
   */
  public override PrimeDoubleByParameter(angleRadians: number): number {
    return -1 * this.parent.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {HyperbolicParametricX} A new object that is a copy of this instance.
   */
  public override Clone(): HyperbolicParametricX {
    return this.cloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {HyperbolicParametricX} A new instance of HyperbolicParametricX.
   */
  public cloneParametric(): HyperbolicParametricX {
    const parametric = new HyperbolicParametricX(this.parent as unknown as HyperbolicCurve);
    return parametric;
  }
}
