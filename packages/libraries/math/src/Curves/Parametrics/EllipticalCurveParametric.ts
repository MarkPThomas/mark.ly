import { ConicSectionEllipticCurve } from "../ConicSectionEllipticCurve";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";
import { EllipticalParametricX } from "./conic-section-curve-components/EllipticalParametricX";
import { EllipticalParametricY } from "./conic-section-curve-components/EllipticalParametricY";


/**
 * Represents an elliptical about a local origin curve in parametric equations defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class EllipticalCurveParametric extends CartesianParametricEquationXY {
  /**
   * Initializes a new instance of the `EllipticalCurveParametric` class.
   * @param {ConicSectionEllipticCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: ConicSectionEllipticCurve) {
    super();
    this._x = new EllipticalParametricX(parent);
    this._y = new EllipticalParametricY(parent);
  }
}