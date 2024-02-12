import { AlgebraLibrary } from "../Algebra/AlgebraLibrary";
import { Angle } from "../Coordinates/Angle";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { PolarCoordinate } from "../Coordinates/PolarCoordinate";
import { TrigonometryLibrary as Trig } from '../Trigonometry/TrigonometryLibrary';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @export
 * @class Cartesian2DPolarConverter
 * @typedef {Cartesian2DPolarConverter}
 */
export class Cartesian2DPolarConverter {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {CartesianCoordinate} coordinate
 * @returns {PolarCoordinate}
 */
  static toPolar(coordinate: CartesianCoordinate): PolarCoordinate {
    return PolarCoordinate.fromAngle(
      AlgebraLibrary.SRSS(coordinate.X, coordinate.Y),
      Angle.CreateFromPoint(coordinate),
      coordinate.Tolerance
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {PolarCoordinate} coordinate
 * @returns {CartesianCoordinate}
 */
  static toCartesian(coordinate: PolarCoordinate): CartesianCoordinate {
    const x: number = coordinate.radius * Trig.Cos(coordinate.azimuth.Radians);
    const y: number = coordinate.radius * Trig.Sin(coordinate.azimuth.Radians);
    return CartesianCoordinate.fromXY(x, y, coordinate.Tolerance);
  }
}