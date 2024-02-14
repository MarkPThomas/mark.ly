/// <summary>
/// Represents a linear curve in parametric equations defining x- and y-components and their respective differentials.
/// Implements the <see cref="CartesianParametricEquationXY" />
/// </summary>

import { LinearCurve } from "../LinearCurve";
import { CartesianParametricEquationXY } from "./components/CartesianParametricEquationXY";
import { LinearParametricX } from "./linear-curve-components/LinearParametricX";
import { LinearParametricY } from "./linear-curve-components/LinearParametricY";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:22 PM
 *
 * @export
 * @class LinearCurveParametric
 * @typedef {LinearCurveParametric}
 * @extends {CartesianParametricEquationXY}
 */
export class LinearCurveParametric extends CartesianParametricEquationXY {
    /// <summary>
    /// Initializes a new instance of the <see cref="LinearCurveParametric" /> class.
    /// </summary>
    /// <param name="parent">The parent object whose properties are used in the associated parametric equations.</param>
    /**
 * Creates an instance of LinearCurveParametric.
 * @date 2/11/2024 - 6:34:22 PM
 *
 * @constructor
 * @param {LinearCurve} parent
 */
    constructor(parent: LinearCurve) {
        super();
        this._x = new LinearParametricX(parent);
        this._y = new LinearParametricY(parent);
    }
}