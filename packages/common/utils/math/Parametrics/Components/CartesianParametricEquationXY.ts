import { DivideByZeroException } from "../../../../errors/exceptions";
import { ICloneable } from "../../../../interfaces";
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

      protected _differentiationIndex: number = 0;

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

      protected constructor() { }

      /// <summary>
      /// Returns the differential of the current parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      public Differentiate(): CartesianParametricEquationXY {
            const differential = this.Clone();
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
      public DifferentiateBy(index: number): CartesianParametricEquationXY {
            const differential = this.Clone();
            differential._x = this._x.DifferentiateBy(index) as DoubleParametricComponents;
            differential._y = this._y.DifferentiateBy(index) as DoubleParametricComponents;
            differential._differentiationIndex = index;
            return differential;
      }

      /// <summary>
      /// Returns the first differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      public DifferentialFirst(): CartesianParametricEquationXY {
            return this.DifferentiateBy(1);
      }

      /// <summary>
      /// Returns the second differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      public DifferentialSecond(): CartesianParametricEquationXY {
            return this.DifferentiateBy(2);
      }

      /// <summary>
      /// Determines whether this instance can be differentiated further.
      /// </summary>
      /// <returns><c>true</c> if this instance has differential; otherwise, <c>false</c>.</returns>
      public HasDifferential(): boolean {
            return (this._x.HasDifferential() || this._y.HasDifferential());
      }


      /// <summary>
      /// Implements the * operator.
      /// </summary>
      /// <param name="a">a.</param>
      /// <param name="b">The b.</param>
      /// <returns>The result of the operator.</returns>
      public multiplyBy(multiplier: number): CartesianParametricEquationXY {
            const parametric = this.Clone();
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
      public divideBy(denominator: number): CartesianParametricEquationXY {
            if (denominator === 0) { throw new DivideByZeroException(); }

            const parametric = this.Clone();
            parametric._x.divideBy(denominator);
            parametric._y.divideBy(denominator);
            return parametric;
      }

      public Clone(): CartesianParametricEquationXY {
            const parametric = new CartesianParametricEquationXY();
            parametric._x = this._x;
            parametric._y = this._y;
            parametric._differentiationIndex = this._differentiationIndex;
            return parametric;
      }
}