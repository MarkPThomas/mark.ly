import { AlgebraLibrary } from "../Algebra/AlgebraLibrary";
import { Angle } from "../Coordinates/Angle";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { PolarCoordinate } from "../Coordinates/PolarCoordinate";
import { TrigonometryLibrary as Trig } from '../Trigonometry/TrigonometryLibrary';

export class Cartesian2DPolarConverter {
  static toPolar(coordinate: CartesianCoordinate): PolarCoordinate {
    return PolarCoordinate.fromAngle(
      AlgebraLibrary.SRSS(coordinate.X, coordinate.Y),
      Angle.CreateFromPoint(coordinate),
      coordinate.Tolerance
    );
  }

  static toCartesian(coordinate: PolarCoordinate): CartesianCoordinate {
    const x: number = coordinate.radius * Trig.Cos(coordinate.azimuth.Radians);
    const y: number = coordinate.radius * Trig.Sin(coordinate.azimuth.Radians);
    return CartesianCoordinate.fromXY(x, y, coordinate.Tolerance);
  }
}