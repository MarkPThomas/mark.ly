import { BezierCurve } from "../BezierCurve";
import { BezierParametric3rdOrderX } from "./BezierCurveComponents/BezierParametric3rdOrderX";
import { BezierParametric3rdOrderY } from "./BezierCurveComponents/BezierParametric3rdOrderY";
import { CartesianParametricEquationXY } from "./Components/CartesianParametricEquationXY";


/**
 * Represents a 3rd-order Bezier curve in parametric equations defining x- and y-components and their respective differentials.
 * @extends {CartesianParametricEquationXY}
 */
export class BezierCurveParametric3rdOrder extends CartesianParametricEquationXY {
  /**
   * The x-component of the parametric equation.
   * @type {BezierParametric3rdOrderX}
   * @protected
   */
  protected _x: BezierParametric3rdOrderX;

  /**
   * The y-component of the parametric equation.
   * @type {BezierParametric3rdOrderY}
   * @protected
   */
  protected _y: BezierParametric3rdOrderY;

  /**
   * Initializes a new instance of the {@linkcode BezierCurveParametric3rdOrder} class, which represents an n = 3 parametric.
   * @param {BezierCurve} parent The parent object whose properties are used in the associated parametric equations.
   */
  constructor(parent: BezierCurve) {
    super();
    this._x = new BezierParametric3rdOrderX(parent);
    this._y = new BezierParametric3rdOrderY(parent);
  }
}
