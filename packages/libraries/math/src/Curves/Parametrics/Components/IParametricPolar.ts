import { Angle } from "../../../coordinates/Angle";
import { ParametricEquation } from "./ParametricEquation";

/**
 * Represents a set of parametric equations in radius number and rotational {@link Angle} components, such as polar coordinates systems.
 *
 * @export
 * @interface IParametricPolar
 * @template T1
 * @template T2
 */
export interface IParametricPolar<T1 extends ParametricEquation<number>, T2 extends ParametricEquation<Angle>> {
  /**
   * The radial length, r, at position s.
   *
   * @type {T1}
   * @memberof IParametricPolar
   */
  Radius: T1;
  /**
   * The azimuth angle, φ, at position s.
   *
   * @type {T2}
   * @memberof IParametricPolar
   */
  Azimuth: T2;
}