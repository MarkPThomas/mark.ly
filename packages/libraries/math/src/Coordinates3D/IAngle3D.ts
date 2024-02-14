import { Angle } from "../coordinates/Angle";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface IAngle3D
 * @typedef {IAngle3D}
 */
export interface IAngle3D {
  /**
   * Gets or sets the inclination angle, θ, which lies in the vertical plane sweeping out from the Z-axis.
   * @type {Angle}
   */
  inclination: Angle;

  /**
   * Gets or sets the azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis.
   * @type {Angle}
   */
  azimuth: Angle;
}