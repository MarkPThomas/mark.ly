import { Curve } from "./Curve";
import { CartesianParametricEquationXY } from "./Parametrics/Components/CartesianParametricEquationXY";

/**
 * Represents a quadratic curve.
 * @extends {Curve}
 */
export class QuadraticCurve extends Curve {
  protected createParametricEquation(): CartesianParametricEquationXY {
    throw new Error("Method not implemented.");
  }
  public clone(): Curve {
    throw new Error("Method not implemented.");
  }
}
