import { BezierCurve } from "../../BezierCurve";
import { BezierParametric1stOrderP } from "./BezierParametric1stOrderP";
import { BezierParametricDoubleComponents } from "./BezierParametricDoubleComponents";


/**
 * Represents a 1st-order Bezier curve in parametric equations defining the x-component and differentials.
 * @extends {BezierParametricDoubleComponents}
 */
export class BezierParametric1stOrderX extends BezierParametricDoubleComponents {
  /**
   * Initializes a new instance of the {@linkcode BezierParametric1stOrderX} class.
   * @param {BezierCurve} parent The parent.
   */
  constructor(parent: BezierCurve) {
    super(parent);
  }

  /**
   * The component as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated x-component.
   */
  public override BaseByParameter(parameter: number): number {
    return new BezierParametric1stOrderP(this._parent).BaseByParameter(parameter).X;
  }

  /**
   * The component first differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated x-component first differential.
   */
  public override PrimeByParameter(parameter: number): number {
    return new BezierParametric1stOrderP(this._parent).PrimeByParameter(parameter).X;
  }

  /**
   * The component second differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {number} The calculated x-component second differential.
   */
  public override PrimeDoubleByParameter(parameter: number): number {
    return new BezierParametric1stOrderP(this._parent).PrimeDoubleByParameter(parameter).X;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierParametric1stOrderX} A new object that is a copy of this instance.
   */
  public override Clone(): BezierParametric1stOrderX {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {BezierParametric1stOrderP} A new {@linkcode BezierParametric1stOrderP} object that is a copy of this instance.
   */
  public CloneParametric(): BezierParametric1stOrderX {
    return new BezierParametric1stOrderX(this._parent as BezierCurve);
  }
}
