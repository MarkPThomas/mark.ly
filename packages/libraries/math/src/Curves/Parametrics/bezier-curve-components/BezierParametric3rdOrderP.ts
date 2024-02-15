import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { BezierCurve } from "../../BezierCurve";
import { BezierParametricCartesianComponents } from "./BezierParametricCartesianComponents";


/**
 * Represents a 3rd-order Bezier curve in parametric equations defining the {@linkcode CartesianCoordinate} component and differentials.
 * This class tends to be used as a base from which the x- and y-components are derived.
 * @extends {BezierParametricCartesianComponents}
 */
export class BezierParametric3rdOrderP extends BezierParametricCartesianComponents {
  /**
   * Initializes a new instance of the {@linkcode BezierParametric3rdOrderP} class.
   * @param {BezierCurve} parent The parent.
   */
  constructor(parent: BezierCurve) {
    super(parent);
  }

  /**
   * The component as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated {@linkcode CartesianCoordinate} component.
   */
  public override BaseByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy((1 - parameter) ** 3)
      .addTo(this._parent.B_1().multiplyBy(3 * parameter * (1 - parameter) ** 2))
      .addTo(this._parent.B_2().multiplyBy(3 * (parameter ** 2) * (1 - parameter)))
      .addTo(this._parent.B_3().multiplyBy(parameter ** 3));
  }

  /**
   * The component first differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated {@linkcode CartesianCoordinate} component first differential.
   */
  public override PrimeByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy(-3 * (1 - parameter) ** 2)
      .addTo(this._parent.B_1().multiplyBy(3 * (1 - 4 * parameter + 3 * parameter ** 2)))
      .addTo(this._parent.B_2().multiplyBy(3 * (2 * parameter - 3 * parameter ** 2)))
      .addTo(this._parent.B_3().multiplyBy(3 * parameter ** 2));
  }

  /**
   * The component second differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated {@linkcode CartesianCoordinate} component second differential.
   */
  public override PrimeDoubleByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy(6 * (1 - parameter))
      .addTo(this._parent.B_1().multiplyBy(3 * (-4 * parameter + 6 * parameter)))
      .addTo(this._parent.B_2().multiplyBy(3 * (2 - 6 * parameter)))
      .addTo(this._parent.B_3().multiplyBy(6 * parameter));
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierParametric3rdOrderP} A new object that is a copy of this instance.
   */
  public override Clone(): BezierParametric3rdOrderP {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {BezierParametric3rdOrderP} A new {@linkcode BezierParametric3rdOrderP} object that is a copy of this instance.
   */
  public CloneParametric(): BezierParametric3rdOrderP {
    return new BezierParametric3rdOrderP(this._parent as BezierCurve);
  }
}
