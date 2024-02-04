import { Curve } from "./Curve";
import { CartesianParametricEquationXY } from "./Parametrics/Components/CartesianParametricEquationXY";

/**
 * Represents a cubic curve.
 * @extends {Curve}
 */
export class CubicCurve extends Curve {
  protected createParametricEquation(): CartesianParametricEquationXY {
    throw new Error("Method not implemented.");
  }
  public clone(): Curve {
    throw new Error("Method not implemented.");
  }
}
