import { BezierCurve } from "../BezierCurve";
import { BezierParametric2ndOrderX } from "./bezier-curve-components/BezierParametric2ndOrderX";
import { BezierParametric2ndOrderY } from "./bezier-curve-components/BezierParametric2ndOrderY";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";


/**
 * Represents a 2nd-order Bezier curve in parametric equations defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class BezierCurveParametric2ndOrder extends CartesianParametricEquationXY {
  /**
   * The x-component of the parametric equation.
   * @type {BezierParametric2ndOrderX}
   * @protected
   */
  protected _x: BezierParametric2ndOrderX;

  /**
   * The y-component of the parametric equation.
   * @type {BezierParametric2ndOrderY}
   * @protected
   */
  protected _y: BezierParametric2ndOrderY;

  /**
   * Initializes a new instance of the {@linkcode BezierCurveParametric2ndOrder} class, which represents an n = 2 parametric.
   * @param {BezierCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: BezierCurve) {
    super();
    this._x = new BezierParametric2ndOrderX(parent);
    this._y = new BezierParametric2ndOrderY(parent);
  }
}
