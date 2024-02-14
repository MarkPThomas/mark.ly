import { ParabolicCurve } from "../ParabolicCurve";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";
import { ParabolicFocusParametricX } from "./conic-section-curve-components/ParabolicFocusParametricX";
import { ParabolicFocusParametricY } from "./conic-section-curve-components/ParabolicFocusParametricY";


/**
 * Represents a parabolic curve in parametric equations about the focus defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class ParabolicCurveFocusParametric extends CartesianParametricEquationXY {
  /**
   * Initializes a new instance of the `ParabolicCurveFocusParametric` class.
   * @param {ParabolicCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: ParabolicCurve) {
    super();
    this._x = new ParabolicFocusParametricX(parent);
    this._y = new ParabolicFocusParametricY(parent);
  }
}
