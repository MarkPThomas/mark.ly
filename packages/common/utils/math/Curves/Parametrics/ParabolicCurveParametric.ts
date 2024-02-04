import { ParabolicCurve } from "../ParabolicCurve";
import { CartesianParametricEquationXY } from "./Components/CartesianParametricEquationXY";
import { ParabolicParametricX } from "./ConicSectionCurveComponents/ParabolicParametricX";
import { ParabolicParametricY } from "./ConicSectionCurveComponents/ParabolicParametricY";


/**
 * Represents a parabolic curve in parametric equations about a local origin defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class ParabolicCurveParametric extends CartesianParametricEquationXY {
  /**
   * Initializes a new instance of the `ParabolicCurveParametric` class.
   * @param {ParabolicCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: ParabolicCurve) {
    super();
    this._x = new ParabolicParametricX(parent);
    this._y = new ParabolicParametricY(parent);
  }
}
