/// <summary>
/// Represents a linear curve in parametric equations defining x- and y-components and their respective differentials.
/// Implements the <see cref="CartesianParametricEquationXY" />
/// </summary>

import { LinearCurve } from "../Curves/LinearCurve";
import { CartesianParametricEquationXY } from "./Components/CartesianParametricEquationXY";
import { LinearParametricX } from "./LinearCurveComponents/LinearParametricX";
import { LinearParametricY } from "./LinearCurveComponents/LinearParametricY";

export class LinearCurveParametric extends CartesianParametricEquationXY {
    /// <summary>
    /// Initializes a new instance of the <see cref="LinearCurveParametric" /> class.
    /// </summary>
    /// <param name="parent">The parent object whose properties are used in the associated parametric equations.</param>
    constructor(parent: LinearCurve) {
        super();
        this._x = new LinearParametricX(parent);
        this._y = new LinearParametricY(parent);
    }
}