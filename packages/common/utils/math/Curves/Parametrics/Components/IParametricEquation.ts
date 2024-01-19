/**
 * Represents a parametric equation.
 *
 * @export
 * @interface IParametricEquation
 * @template T
 */
export interface IParametricEquation<T> {
  /**
   * The value, at position s.
   *
   * @param {number} s The parametric position, s.
   * @return {*}  {T}
   * @memberof IParametricEquation
   */
  ValueAt(s: number): T;
}