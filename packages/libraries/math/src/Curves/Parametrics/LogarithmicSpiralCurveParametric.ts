import { LogarithmicSpiralCurve } from "../LogarithmicSpiralCurve";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";
import { LogarithmicSpiralParametricX } from "./logarithmic-spiral-curve-components/LogarithmicSpiralParametricX";
import { LogarithmicSpiralParametricY } from "./logarithmic-spiral-curve-components/LogarithmicSpiralParametricY";


/**
 * Represents a logarithmic spiral curve in parametric equations about a local origin defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class LogarithmicSpiralCurveParametric extends CartesianParametricEquationXY {
  /**
   * Initializes a new instance of the {@linkcode LogarithmicSpiralCurveParametric} class.
   * @param {LogarithmicSpiralCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: LogarithmicSpiralCurve) {
    super();
    this._x = new LogarithmicSpiralParametricX(parent);
    this._y = new LogarithmicSpiralParametricY(parent);
  }
}
