import { HyperbolicCurve } from "../HyperbolicCurve";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";
import { HyperbolicParametricX } from "./conic-section-curve-components/HyperbolicParametricX";
import { HyperbolicParametricY } from "./conic-section-curve-components/HyperbolicParametricY";


/**
 * Represents a hyperbolic curve in parametric equations about a local origin defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class HyperbolicCurveParametric extends CartesianParametricEquationXY {
  /**
   * Initializes a new instance of the `HyperbolicCurveParametric` class.
   * @param {HyperbolicCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: HyperbolicCurve) {
    super();
    this._x = new HyperbolicParametricX(parent);
    this._y = new HyperbolicParametricY(parent);
  }
}
