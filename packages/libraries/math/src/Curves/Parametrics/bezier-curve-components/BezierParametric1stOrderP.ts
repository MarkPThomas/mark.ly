import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { BezierCurve } from "../../BezierCurve";
import { BezierParametricCartesianComponents } from "./BezierParametricCartesianComponents";


/**
 * Represents a 1st-order Bezier curve in parametric equations defining the CartesianCoordinate component and differentials.
 * This class tends to be used as a base from which the x- and y-components are derived.
 * @extends {BezierParametricCartesianComponents}
 */
export class BezierParametric1stOrderP extends BezierParametricCartesianComponents {
  /**
   * Initializes a new instance of the {@linkcode BezierParametric1stOrderP} class.
   * @param {BezierCurve} parent The parent.
   */
  constructor(parent: BezierCurve) {
    super(parent);
  }

  /**
   * The component as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated CartesianCoordinate.
   */
  public override BaseByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy(1 - parameter).addTo(this._parent.B_3().multiplyBy(parameter));
  }

  /**
   * The component first differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated CartesianCoordinate.
   */
  public override PrimeByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy(-1).addTo(this._parent.B_3());
  }

  /**
   * The component second differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated CartesianCoordinate.
   */
  public override PrimeDoubleByParameter(parameter: number): CartesianCoordinate {
    return CartesianCoordinate.atOrigin();
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierParametric1stOrderP} A new object that is a copy of this instance.
   */
  public override Clone(): BezierParametric1stOrderP {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {BezierParametric1stOrderP} A new {@linkcode BezierParametric1stOrderP} object that is a copy of this instance.
   */
  public CloneParametric(): BezierParametric1stOrderP {
    return new BezierParametric1stOrderP(this._parent as BezierCurve);
  }
}
