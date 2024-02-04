import { BezierCurve } from "../../BezierCurve";
import { BezierParametric1stOrderP } from "./BezierParametric1stOrderP";
import { BezierParametricDoubleComponents } from "./BezierParametricDoubleComponents";


/**
 * Represents a 1st-order Bezier curve in parametric equations defining the y-component and differentials.
 * @extends {BezierParametricDoubleComponents}
 */
export class BezierParametric1stOrderY extends BezierParametricDoubleComponents {
  /**
   * Initializes a new instance of the {@linkcode BezierParametric1stOrderY} class.
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
    return new BezierParametric1stOrderP(this._parent).BaseByParameter(parameter).Y;
  }

  /**
   * The component first differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated y-component first differential.
   */
  public override PrimeByParameter(parameter: number): number {
    return new BezierParametric1stOrderP(this._parent).PrimeByParameter(parameter).Y;
  }

  /**
   * The component second differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated y-component second differential.
   */
  public override PrimeDoubleByParameter(parameter: number): number {
    return new BezierParametric1stOrderP(this._parent).PrimeDoubleByParameter(parameter).Y;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierParametric1stOrderY} A new object that is a copy of this instance.
   */
  public override Clone(): BezierParametric1stOrderY {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {BezierParametric1stOrderY} A new {@linkcode BezierParametric1stOrderY} object that is a copy of this instance.
   */
  public CloneParametric(): BezierParametric1stOrderY {
    return new BezierParametric1stOrderY(this._parent as BezierCurve);
  }
}
