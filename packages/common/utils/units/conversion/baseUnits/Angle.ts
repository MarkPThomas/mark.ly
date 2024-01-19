export class Radians {
  protected static DEGREES_PER_RADIAN = 180 / Math.PI;

  static toDegrees(radians: number = 1) {
    return radians * Radians.DEGREES_PER_RADIAN;
  }

  static toPercent(radians: number = 1) {
    return 100 * Math.tan(radians);
  }
}

export class Degrees {
  protected static RADIANS_PER_DEGREE = Math.PI / 180;

  static toRadians(degrees: number = 1) {
    return degrees * Degrees.RADIANS_PER_DEGREE;
  }

  static toPercent(degrees: number = 1) {
    return 100 * Math.tan(Degrees.toRadians(degrees));
  }
}

export class Percent {
  static toRadians(percent: number = 1) {
    return Math.atan(percent / 100);
  }

  static toDegrees(percent: number = 1) {
    return Radians.toDegrees(Percent.toRadians(percent));
  }
}

declare namespace Angle {
  type Radians = typeof Angle.Radians.prototype;
  type Degrees = typeof Angle.Degrees.prototype;
  type Percent = typeof Angle.Percent.prototype;
}

export class Angle {
  static Radians = Radians;
  static Degrees = Degrees;
  static Percent = Percent;
}