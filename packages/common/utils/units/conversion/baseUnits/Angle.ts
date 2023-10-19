export class Angle {
  protected static RADIANS_PER_DEGREE = Math.PI / 180;

  static radiansToDegrees(radians: number = 1) {
    return radians / this.RADIANS_PER_DEGREE;
  }

  static degreesToRadians(degrees: number = 1) {
    return degrees * this.RADIANS_PER_DEGREE;
  }

  static radiansToPercent(radians: number = 1) {
    return 100 * Math.tan(radians);
  }

  static percentToRadians(percent: number = 1) {
    return Math.atan(percent / 100);
  }

  static degreesToPercent(degrees: number = 1) {
    return Math.tan(Angle.degreesToRadians(degrees));
  }

  static percentToDegrees(percent: number = 1) {
    return Angle.radiansToDegrees(Angle.percentToRadians(percent));
  }
}