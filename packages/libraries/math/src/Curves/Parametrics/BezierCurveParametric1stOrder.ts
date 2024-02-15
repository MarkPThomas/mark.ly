import { BezierCurve } from "../BezierCurve";
import { BezierParametric1stOrderX } from "./bezier-curve-components/BezierParametric1stOrderX";
import { BezierParametric1stOrderY } from "./bezier-curve-components/BezierParametric1stOrderY";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";


/**
 * Represents a 1st-order Bezier curve in parametric equations defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class BezierCurveParametric1stOrder extends CartesianParametricEquationXY {
  /**
   * The x-component of the parametric equation.
   * @type {BezierParametric1stOrderX}
   * @protected
   */
  protected _x: BezierParametric1stOrderX;

  /**
   * The y-component of the parametric equation.
   * @type {BezierParametric1stOrderY}
   * @protected
   */
  protected _y: BezierParametric1stOrderY;

  /**
   * Initializes a new instance of the {@linkcode BezierCurveParametric1stOrder} class, which represents an n = 1 parametric.
   * @param {BezierCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: BezierCurve) {
    super();
    this._x = new BezierParametric1stOrderX(parent);
    this._y = new BezierParametric1stOrderY(parent);
  }
}
