import { DivideByZeroException } from "common/errors/exceptions";
import { ICloneable } from "common/interfaces";

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

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @protected
 * @type {number}
 */
      protected _differentiationIndex: number = 0;

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @protected
 * @type {CartesianParametricComponents}
 */
      protected _components: CartesianParametricComponents;
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @readonly
 * @type {CartesianParametricComponent}
 */
      get Component(): CartesianParametricComponent {
            return this._components.get(this._differentiationIndex);
      }

      /**
 * Creates an instance of CartesianParametricEquation.
 * @date 2/11/2024 - 6:34:26 PM
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
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @returns {CartesianParametricEquation}
 */
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
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @param {number} index
 * @returns {CartesianParametricEquation}
 */
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
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @returns {CartesianParametricEquation}
 */
      public DifferentialFirst(): CartesianParametricEquation {
            return this.DifferentiateBy(1);
      }

      /// <summary>
      /// Returns the second differential of the parametric function.
      /// </summary>
      /// <returns>HyperbolicParametric.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @returns {CartesianParametricEquation}
 */
      public DifferentialSecond(): CartesianParametricEquation {
            return this.DifferentiateBy(2);
      }

      /// <summary>
      /// Determines whether this instance can be differentiated further.
      /// </summary>
      /// <returns><c>true</c> if this instance has differential; otherwise, <c>false</c>.</returns>
      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @returns {boolean}
 */
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

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @param {number} multiplier
 * @returns {CartesianParametricEquation}
 */
      public multiplyBy(multiplier: number): CartesianParametricEquation {
            const parametric = this.clone();
            parametric._components.multiplyBy(multiplier);
            return parametric;
      }

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @param {number} denominator
 * @returns {CartesianParametricEquation}
 */
      public divideBy(denominator: number): CartesianParametricEquation {
            if (denominator === 0) { throw new DivideByZeroException(); }

            const parametric = this.clone();
            parametric._components.divideBy(denominator);
            return parametric;
      }

      /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:26 PM
 *
 * @public
 * @returns {CartesianParametricEquation}
 */
      public clone(): CartesianParametricEquation {
            const parametric = new CartesianParametricEquation();
            parametric._components.Clone();
            parametric._differentiationIndex = this._differentiationIndex;
            return parametric;
      }
}