import { DivideByZeroException } from "common/errors/exceptions";
import { ICloneable } from "common/interfaces";

import { IParametricCartesianXY } from "./IParametricCartesianXY";
import { DoubleParametricComponent } from "./Types/DoubleParametricComponent";
import { DoubleParametricComponents } from "./Types/DoubleParametricComponents";

/**
 * Represents a set of parametric equations in x- and y-components returned as <see cref="double"/>, such as 2D coordinate systems for x- and y-axes.
 *
 * These equations can be scaled and differentiated.
 *
 * @export
 * @class CartesianParametricEquationXY
 * @implements {IParametricCartesianXY<DoubleParametricComponent>}
 * @implements {ICloneable<CartesianParametricEquationXY>}
 */
export class CartesianParametricEquationXY
      implements IParametricCartesianXY<DoubleParametricComponent>, ICloneable<CartesianParametricEquationXY> {

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @protected
 * @type {number}
 */
      protected _differentiationIndex: number = 0;

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @protected
 * @type {DoubleParametricComponents}
 */
      protected _x: DoubleParametricComponents;
      /**
       * The x-component, at position s.
       *
       * @readonly
       * @memberof CartesianParametricEquationXY
       */
      get Xcomponent() {
            return this._x.get(this._differentiationIndex);
      }

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @protected
 * @type {DoubleParametricComponents}
 */
      protected _y: DoubleParametricComponents;
      /**
       * The y-component, at position s.
       *
       * @readonly
       * @memberof CartesianParametricEquationXY
       */
      get Ycomponent() {
            return this._y.get(this._differentiationIndex);
      }

      /**
 * Creates an instance of CartesianParametricEquationXY.
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @constructor
 * @protected
 */
      protected constructor() { }

      /// <summary>
      /// Returns the differential of the current parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @returns {CartesianParametricEquationXY}
 */
      public Differentiate(): CartesianParametricEquationXY {
            const differential = this.clone();
            differential._x = this._x.Differentiate(this._differentiationIndex) as DoubleParametricComponents;
            differential._y = this._y.Differentiate(this._differentiationIndex) as DoubleParametricComponents;
            differential._differentiationIndex++;
            return differential;
      }

      /// <summary>
      /// Returns the current parametric function, differentiated to the specified # of times.
      /// </summary>
      /// <param name="index">The index to differentiate to, which must be greater than 0.</param>
      /// <returns>HyperbolicParametric.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @param {number} index
 * @returns {CartesianParametricEquationXY}
 */
      public DifferentiateBy(index: number): CartesianParametricEquationXY {
            const differential = this.clone();
            differential._x = this._x.DifferentiateBy(index) as DoubleParametricComponents;
            differential._y = this._y.DifferentiateBy(index) as DoubleParametricComponents;
            differential._differentiationIndex = index;
            return differential;
      }

      /// <summary>
      /// Returns the first differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @returns {CartesianParametricEquationXY}
 */
      public DifferentialFirst(): CartesianParametricEquationXY {
            return this.DifferentiateBy(1);
      }

      /// <summary>
      /// Returns the second differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @returns {CartesianParametricEquationXY}
 */
      public DifferentialSecond(): CartesianParametricEquationXY {
            return this.DifferentiateBy(2);
      }

      /// <summary>
      /// Determines whether this instance can be differentiated further.
      /// </summary>
      /// <returns><c>true</c> if this instance has differential; otherwise, <c>false</c>.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @returns {boolean}
 */
      public HasDifferential(): boolean {
            return (this._x.HasDifferential() || this._y.HasDifferential());
      }


      /// <summary>
      /// Implements the * operator.
      /// </summary>
      /// <param name="a">a.</param>
      /// <param name="b">The b.</param>
      /// <returns>The result of the operator.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @param {number} multiplier
 * @returns {CartesianParametricEquationXY}
 */
      public multiplyBy(multiplier: number): CartesianParametricEquationXY {
            const parametric = this.clone();
            parametric._x.multiplyBy(multiplier);
            parametric._y.multiplyBy(multiplier);
            return parametric;
      }

      /// <summary>
      /// Implements the / operator.
      /// </summary>
      /// <param name="a">a.</param>
      /// <param name="b">The b.</param>
      /// <returns>The result of the operator.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @param {number} denominator
 * @returns {CartesianParametricEquationXY}
 */
      public divideBy(denominator: number): CartesianParametricEquationXY {
            if (denominator === 0) { throw new DivideByZeroException(); }

            const parametric = this.clone();
            parametric._x.divideBy(denominator);
            parametric._y.divideBy(denominator);
            return parametric;
      }

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @public
 * @returns {CartesianParametricEquationXY}
 */
      public clone(): CartesianParametricEquationXY {
            const parametric = new CartesianParametricEquationXY();
            parametric._x = this._x;
            parametric._y = this._y;
            parametric._differentiationIndex = this._differentiationIndex;
            return parametric;
      }
}