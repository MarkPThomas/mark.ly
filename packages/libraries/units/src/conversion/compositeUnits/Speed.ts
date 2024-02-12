import { Length, Time } from '../baseUnits';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class MetersPerSecond
 * @typedef {MetersPerSecond}
 */
export class MetersPerSecond {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [metersPerSecond=1]
 * @returns {number}
 */
  static toFeetPerSecond(metersPerSecond: number = 1) {
    return Length.Meters.toFeet(metersPerSecond);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [metersPerSecond=1]
 * @returns {number}
 */
  static toFeetPerHour(metersPerSecond: number = 1) {
    const feetPerSecond = Speed.MetersPerSecond.toFeetPerSecond(metersPerSecond);
    return feetPerSecond / Time.Seconds.toHours();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [metersPerSecond=1]
 * @returns {number}
 */
  static toKph(metersPerSecond: number = 1) {
    const kilometersPerSecond = metersPerSecond / 1000;
    return kilometersPerSecond / Time.Seconds.toHours();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [metersPerSecond=1]
 * @returns {number}
 */
  static toMph(metersPerSecond: number = 1) {
    const milesPerSecond = Length.Meters.toMiles(metersPerSecond);
    return milesPerSecond / Time.Seconds.toHours();
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class KilometersPerHour
 * @typedef {KilometersPerHour}
 */
export class KilometersPerHour {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [kph=1]
 * @returns {number}
 */
  static toMetersPerSecond(kph: number = 1) {
    const metersPerHour = kph * 1000;
    return metersPerHour * Time.Seconds.toHours();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [kph=1]
 * @returns {number}
 */
  static toMph(kph: number = 1) {
    return Length.Kilometers.toMiles(kph);
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class FeetPerSecond
 * @typedef {FeetPerSecond}
 */
export class FeetPerSecond {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [feetPerSecond=1]
 * @returns {number}
 */
  static toMetersPerSecond(feetPerSecond: number = 1) {
    return Length.Feet.toMeters(feetPerSecond);
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class FeetPerHour
 * @typedef {FeetPerHour}
 */
export class FeetPerHour {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [feetPerHour=1]
 * @returns {number}
 */
  static toMetersPerSecond(feetPerHour: number = 1) {
    const metersPerHour = Length.Feet.toMeters(feetPerHour);
    return metersPerHour * Time.Seconds.toHours();
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class MilesPerHour
 * @typedef {MilesPerHour}
 */
export class MilesPerHour {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [mph=1]
 * @returns {number}
 */
  static toMetersPerSecond(mph: number = 1) {
    const metersPerHour = Length.Miles.toKilometers(mph) * 1000;
    return metersPerHour * Time.Seconds.toHours();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @param {number} [mph=1]
 * @returns {number}
 */
  static toKph(mph: number = 1) {
    return Length.Miles.toKilometers(mph);
  }
}

declare namespace Speed {
  type MetersPerSecond = typeof Speed.MetersPerSecond.prototype;
  type KilometersPerHour = typeof Speed.KilometersPerHour.prototype;
  type FeetPerSecond = typeof Speed.FeetPerSecond.prototype;
  type FeetPerHour = typeof Speed.FeetPerHour.prototype;
  type MilesPerHour = typeof Speed.MilesPerHour.prototype;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class Speed
 * @typedef {Speed}
 */
export class Speed {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof MetersPerSecond}
 */
  static MetersPerSecond = MetersPerSecond;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof KilometersPerHour}
 */
  static KilometersPerHour = KilometersPerHour;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof FeetPerSecond}
 */
  static FeetPerSecond = FeetPerSecond;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof FeetPerHour}
 */
  static FeetPerHour = FeetPerHour;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof MilesPerHour}
 */
  static MilesPerHour = MilesPerHour;
}

// TODO: Add Knots = 1 = 1.15078 mph