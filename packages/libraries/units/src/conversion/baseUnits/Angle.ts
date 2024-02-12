/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Radians
 * @typedef {Radians}
 */
export class Radians {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @protected
 * @static
 * @type {number}
 */
  protected static DEGREES_PER_RADIAN = 180 / Math.PI;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [radians=1]
 * @returns {number}
 */
  static toDegrees(radians: number = 1) {
    return radians * Radians.DEGREES_PER_RADIAN;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [radians=1]
 * @returns {number}
 */
  static toPercent(radians: number = 1) {
    return 100 * Math.tan(radians);
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Degrees
 * @typedef {Degrees}
 */
export class Degrees {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @protected
 * @static
 * @type {number}
 */
  protected static RADIANS_PER_DEGREE = Math.PI / 180;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [degrees=1]
 * @returns {number}
 */
  static toRadians(degrees: number = 1) {
    return degrees * Degrees.RADIANS_PER_DEGREE;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [degrees=1]
 * @returns {number}
 */
  static toPercent(degrees: number = 1) {
    return 100 * Math.tan(Degrees.toRadians(degrees));
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Percent
 * @typedef {Percent}
 */
export class Percent {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [percent=1]
 * @returns {*}
 */
  static toRadians(percent: number = 1) {
    return Math.atan(percent / 100);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [percent=1]
 * @returns {number}
 */
  static toDegrees(percent: number = 1) {
    return Radians.toDegrees(Percent.toRadians(percent));
  }
}

declare namespace Angle {
  type Radians = typeof Angle.Radians.prototype;
  type Degrees = typeof Angle.Degrees.prototype;
  type Percent = typeof Angle.Percent.prototype;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Angle
 * @typedef {Angle}
 */
export class Angle {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Radians}
 */
  static Radians = Radians;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Degrees}
 */
  static Degrees = Degrees;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Percent}
 */
  static Percent = Percent;
}