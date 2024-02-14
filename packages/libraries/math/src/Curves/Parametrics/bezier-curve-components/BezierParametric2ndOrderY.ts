import { BezierCurve } from "../../BezierCurve";
import { BezierParametric2ndOrderP } from "./BezierParametric2ndOrderP";
import { BezierParametricDoubleComponents } from "./BezierParametricDoubleComponents";


/**
 * Represents a 2nd-order Bezier curve in parametric equations defining the y-component and differentials.
 * @extends {BezierParametricDoubleComponents}
 */
export class BezierParametric2ndOrderY extends BezierParametricDoubleComponents {
  /**
   * Initializes a new instance of the {@linkcode BezierParametric2ndOrderY} class.
   * @param {BezierCurve} parent The parent.
   */
  constructor(parent: BezierCurve) {
    super(parent);
  }

  /**
   * The component as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated y-component.
   */
  public override BaseByParameter(parameter: number): number {
    return new BezierParametric2ndOrderP(this._parent).BaseByParameter(parameter).Y;
  }

  /**
   * The component first differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated y-component first differential.
   */
  public override PrimeByParameter(parameter: number): number {
    return new BezierParametric2ndOrderP(this._parent).PrimeByParameter(parameter).Y;
  }

  /**
   * The component second differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated y-component second differential.
   */
  public override PrimeDoubleByParameter(parameter: number): number {
    return new BezierParametric2ndOrderP(this._parent).PrimeDoubleByParameter(parameter).Y;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierParametric2ndOrderY} A new object that is a copy of this instance.
   */
  public override Clone(): BezierParametric2ndOrderY {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {BezierParametric2ndOrderY} A new {@linkcode BezierParametric2ndOrderY} object that is a copy of this instance.
   */
  public CloneParametric(): BezierParametric2ndOrderY {
    return new BezierParametric2ndOrderY(this._parent as BezierCurve);
  }
}
