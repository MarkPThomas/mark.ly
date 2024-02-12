import { CartesianCoordinate } from "../../../Coordinates/CartesianCoordinate";
import { BezierCurve } from "../../BezierCurve";
import { BezierParametricCartesianComponents } from "./BezierParametricCartesianComponents";


/**
 * Represents a 2nd-order Bezier curve in parametric equations defining the {@linkcode CartesianCoordinate} component and differentials.
 * This class tends to be used as a base from which the x- and y-components are derived.
 * @extends {BezierParametricCartesianComponents}
 */
export class BezierParametric2ndOrderP extends BezierParametricCartesianComponents {
  /**
   * Initializes a new instance of the {@linkcode BezierParametric2ndOrderP} class.
   * @param {BezierCurve} parent The parent.
   */
  constructor(parent: BezierCurve) {
    super(parent);
  }

  /**
   * The component as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated CartesianCoordinate component.
   */
  public override BaseByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy((1 - parameter) ** 2)
      .addTo(this._parent.B_1().multiplyBy(2 * parameter * (1 - parameter)))
      .addTo(this._parent.B_3().multiplyBy(parameter ** 2));
  }

  /**
   * The component first differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated CartesianCoordinate component first differential.
   */
  public override PrimeByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy(-2 * (1 - parameter))
      .addTo(this._parent.B_1().multiplyBy(2 * (1 - 2 * parameter)))
      .addTo(this._parent.B_3().multiplyBy(2 * parameter));
  }

  /**
   * The component second differential as a function of the supplied parameter.
   * @param {number} parameter The parameter, such as relative position between 0 & 1, or the angle in radians.
   * @returns {CartesianCoordinate} The calculated CartesianCoordinate component second differential.
   */
  public override PrimeDoubleByParameter(parameter: number): CartesianCoordinate {
    return this._parent.B_0().multiplyBy(2)
      .addTo(this._parent.B_1().multiplyBy(-4))
      .addTo(this._parent.B_3().multiplyBy(2));
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierParametric2ndOrderP} A new object that is a copy of this instance.
   */
  public override Clone(): BezierParametric2ndOrderP {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {BezierParametric2ndOrderP} A new {@linkcode BezierParametric2ndOrderP} object that is a copy of this instance.
   */
  public CloneParametric(): BezierParametric2ndOrderP {
    return new BezierParametric2ndOrderP(this._parent as BezierCurve);
  }
}
