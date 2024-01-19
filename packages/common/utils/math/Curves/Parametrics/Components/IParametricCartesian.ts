import { CartesianCoordinate } from "../../../Coordinates/CartesianCoordinate";
import { ParametricEquation } from "./ParametricEquation";

/**
 * Represents a parametric equation in a single `CartesianCoordinate` component, such as 2D coordinate systems for x- and y-axes.
 *
 * @export
 * @interface IParametricCartesian
 * @template T
 */
export interface IParametricCartesian<T extends ParametricEquation<CartesianCoordinate>> {
  /**
   * The component, at position s.
   *
   * @type {T}
   * @memberof IParametricCartesian
   */
  readonly Component: T;
}