import { TrigonometryLibrary } from "../../../trigonometry/TrigonometryLibrary";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { HyperbolicCurve } from "../../HyperbolicCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";

/**
 * Represents a hyperbolic curve in parametric equations defining the y-component and differentials.
 * @extends {ConicParametricDoubleComponents}
 * @see {@link https://www.ck12.org/book/ck-12-calculus-concepts/section/10.3/}
 */
export class HyperbolicParametricY extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the `HyperbolicParametricY` class.
   * @param {HyperbolicCurve} parent The parent curve.
   */
  constructor(parent: HyperbolicCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * Y-coordinate on the right curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} The Y-coordinate on the curve.
   */
  public override BaseByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.SinH(angleRadians);
  }

  /**
   * Y-component of the curve slope in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} The Y-component of the curve slope.
   */
  public override PrimeByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Y-component of the curve curvature in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} The Y-component of the curve curvature.
   */
  public override PrimeDoubleByParameter(angleRadians: number): number {
    return -this.parent.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {HyperbolicParametricY} A new object that is a copy of this instance.
   */
  public override Clone(): HyperbolicParametricY {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {HyperbolicParametricY} A cloned instance of the curve.
   */
  public CloneParametric(): HyperbolicParametricY {
    const parametric = new HyperbolicParametricY(this.parent as unknown as HyperbolicCurve);
    return parametric;
  }
}
