import { IParametricEquation } from "./IParametricEquation";

/**
 * Represents a set of parametric equations in x- and y-components as <see cref="double"/>, such as 2D coordinate systems for x- and y-axes.

 *
 * @export
 * @interface IParametricCartesianXY
 * @template T
 */
export interface IParametricCartesianXY<T extends IParametricEquation<number>> {
  /**
   * The x-component, at position s.
   *
   * @type {T}
   * @memberof IParametricCartesianXY
   */
  readonly Xcomponent: T;

  /**
   * The y-component, at position s.
   *
   * @type {T}
   * @memberof IParametricCartesianXY
   */
  readonly Ycomponent: T
}