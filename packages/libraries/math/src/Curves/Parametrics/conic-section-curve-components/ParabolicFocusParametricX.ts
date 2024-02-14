import { Angle } from "../../../coordinates/Angle";
import { TrigonometryLibrary } from "../../../trigonometry/TrigonometryLibrary";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { ParabolicCurve } from "../../ParabolicCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";


/**
 * Represents a parabolic curve in parametric equations defining the x-component and differentials.
 * @extends {ConicParametricDoubleComponents}
 */
export class ParabolicFocusParametricX extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the `ParabolicFocusParametricX` class.
   * @param {ParabolicCurve} parent The parent curve.
   */
  constructor(parent: ParabolicCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * X-coordinate on the curve in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number} The X-coordinate on the curve.
   */
  public override BaseByParameter(angleRadians: number): number {
    return this.parent.DistanceFromVertexMajorToLocalOrigin - this.parent.RadiusAboutFocusRight(Angle.fromRadians(angleRadians)) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * X-component of the curve slope in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number} The X-component of the curve slope.
   * @throws {Error} Throws an error if the method is not implemented.
   */
  public override PrimeByParameter(angleRadians: number): number {
    throw new Error('Method not implemented');
    // return this._parent.RadiusByAngle(angleRadians) * TrigonometryLibrary.Sin(angleRadians) - this._parent.radiusPrimeByAngle(angleRadians) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * X-component of the curve curvature in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number} The X-component of the curve curvature.
   * @throws {Error} Throws an error if the method is not implemented.
   */
  public override PrimeDoubleByParameter(angleRadians: number): number {
    throw new Error('Method not implemented');
    // return 2 * this._parent.DistanceFromVertexMajorToOrigin;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {ParabolicFocusParametricX} A new object that is a copy of this instance.
   */
  public override Clone(): ParabolicFocusParametricX {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {ParabolicFocusParametricX} A cloned instance of the curve.
   */
  public CloneParametric(): ParabolicFocusParametricX {
    const parametric = new ParabolicFocusParametricX(this.parent as unknown as ParabolicCurve);
    return parametric;
  }
}
