import { Angle } from "../../../Coordinates/Angle";
import { TrigonometryLibrary } from "../../../Trigonometry/TrigonometryLibrary";
import { ConicSectionCurve } from "../../ConicSectionCurve";
import { ParabolicCurve } from "../../ParabolicCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";

/**
 * Represents a parabolic curve in parametric equations defining the y-component about the focus and differentials.
 * @extends {ConicParametricDoubleComponents}
 */
export class ParabolicFocusParametricY extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the `ParabolicFocusParametricY` class.
   * @param {ParabolicCurve} parent The parent curve.
   */
  constructor(parent: ParabolicCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * Y-coordinate on the curve in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number} The Y-coordinate on the curve.
   */
  public override BaseByParameter(angleRadians: number): number {
    return this.parent.RadiusAboutFocusRight(Angle.fromRadians(angleRadians)) * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * Y-component of the curve slope in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number} The Y-component of the curve slope.
   */
  public override PrimeByParameter(angleRadians: number): number {
    return this.parent.RadiusAboutFocusRight(Angle.fromRadians(angleRadians)) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Y-component of the curve curvature in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number} The Y-component of the curve curvature.
   */
  public override PrimeDoubleByParameter(angleRadians: number): number {
    return -1 * this.parent.RadiusAboutFocusRight(Angle.fromRadians(angleRadians)) * TrigonometryLibrary.Sin(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {ParabolicFocusParametricY} A new object that is a copy of this instance.
   */
  public override Clone(): ParabolicFocusParametricY {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {ParabolicFocusParametricY} A cloned instance of the curve.
   */
  public CloneParametric(): ParabolicFocusParametricY {
    const parametric = new ParabolicFocusParametricY(this.parent as unknown as ParabolicCurve);
    return parametric;
  }
}
