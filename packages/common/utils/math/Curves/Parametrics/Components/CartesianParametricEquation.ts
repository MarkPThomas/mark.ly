import { DivideByZeroException } from "../../../../../errors/exceptions";
import { ICloneable } from "../../../../../interfaces";
import { IParametricCartesian } from "./IParametricCartesian";
import { CartesianParametricComponent } from "./Types/CartesianParametricComponent";
import { CartesianParametricComponents } from "./Types/CartesianParametricComponents";

/**
 * Represents a set of parametric equations in a single `CartesianCoordinate` component.
 *
 * These equations can be scaled and differentiated.
 *
 * @export
 * @class CartesianParametricEquation
 * @implements {IParametricCartesian<CartesianParametricComponent>}
 * @implements {ICloneable<CartesianParametricEquation>}
 */
export class CartesianParametricEquation
      implements IParametricCartesian<CartesianParametricComponent>, ICloneable<CartesianParametricEquation> {

      protected _differentiationIndex: number = 0;

      protected _components: CartesianParametricComponents;
      get Component(): CartesianParametricComponent {
            return this._components.get(this._differentiationIndex);
      }

      protected constructor() { }

      /// <summary>
      /// Returns the differential of the current parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      public Differentiate(): CartesianParametricEquation {
            const differential = this.clone();
            differential._components = this._components.Differentiate(this._differentiationIndex) as CartesianParametricComponents;
            differential._differentiationIndex++;
            return differential;
      }

      /// <summary>
      /// Returns the current parametric function, differentiated to the specified # of times.
      /// </summary>
      /// <param name="index">The index to differentiate to, which must be greater than 0.</param>
      /// <returns>HyperbolicParametric.</returns>
      public DifferentiateBy(index: number): CartesianParametricEquation {
            const differential = this.clone();
            differential._components = this._components.DifferentiateBy(index) as CartesianParametricComponents;
            differential._differentiationIndex = index;
            return differential;
      }

      /// <summary>
      /// Returns the first differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      public DifferentialFirst(): CartesianParametricEquation {
            return this.DifferentiateBy(1);
      }

      /// <summary>
      /// Returns the second differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      public DifferentialSecond(): CartesianParametricEquation {
            return this.DifferentiateBy(2);
      }

      /// <summary>
      /// Determines whether this instance can be differentiated further.
      /// </summary>
      /// <returns><c>true</c> if this instance has differential; otherwise, <c>false</c>.</returns>
      public HasDifferential(): boolean {
            return (this._components.HasDifferential());
      }

      ///// <summary>
      ///// Implements the + operator.
      ///// </summary>
      ///// <param name="a">a.</param>
      ///// <param name="b">The b.</param>
      ///// <returns>The result of the operator.</returns>
      //public static VectorParametric operator +(VectorParametric a, VectorParametric b)
      //{
      //    return new VectorParametric(a.Xcomponent + b.Xcomponent, a.Ycomponent + b.Ycomponent);
      //}

      ///// <summary>
      ///// Implements the - operator.
      ///// </summary>
      ///// <param name="a">a.</param>
      ///// <param name="b">The b.</param>
      ///// <returns>The result of the operator.</returns>
      //public static VectorParametric operator -(VectorParametric a, VectorParametric b)
      //{
      //    return new VectorParametric(a.Xcomponent - b.Xcomponent, a.Ycomponent - b.Ycomponent);
      //}

      public multiplyBy(multiplier: number): CartesianParametricEquation {
            const parametric = this.clone();
            parametric._components.multiplyBy(multiplier);
            return parametric;
      }

      public divideBy(denominator: number): CartesianParametricEquation {
            if (denominator === 0) { throw new DivideByZeroException(); }

            const parametric = this.clone();
            parametric._components.divideBy(denominator);
            return parametric;
      }

      public clone(): CartesianParametricEquation {
            const parametric = new CartesianParametricEquation();
            parametric._components.Clone();
            parametric._differentiationIndex = this._differentiationIndex;
            return parametric;
      }
}