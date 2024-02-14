import { Angle } from "../../../coordinates/Angle";
import { ParametricEquation } from "./ParametricEquation";

/**
 * Represents a parametric equation in spherical coordinates.
 */
export interface IParametricSpherical {
  /**
   * The radial length, r, at position s.
   * @type {ParametricEquation<number>}
   */
  Radius: ParametricEquation<number>;

  /**
   * The inclination angle, θ, at position s, which lies in the vertical plane sweeping out from the Z-axis.
   * @type {ParametricEquation<Angle>}
   */
  Inclination: ParametricEquation<Angle>;

  /**
   * The azimuth angle, φ, at position s, which lies in the x-y plane sweeping out from the X-axis.
   * @type {ParametricEquation<Angle>}
   */
  Azimuth: ParametricEquation<Angle>;
}
