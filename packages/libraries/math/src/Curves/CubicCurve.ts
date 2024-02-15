import { Curve } from "./Curve";
import { CartesianParametricEquationXY } from "./parametrics/components/CartesianParametricEquationXY";

/**
 * Represents a cubic curve.
 * @extends {Curve}
 */
export class CubicCurve extends Curve {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @returns {CartesianParametricEquationXY}
 */
  protected createParametricEquation(): CartesianParametricEquationXY {
    throw new Error("Method not implemented.");
  }
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {Curve}
 */
  public clone(): Curve {
    throw new Error("Method not implemented.");
  }
}
