/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Feet
 * @typedef {Feet}
 */
export class Feet {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @protected
 * @static
 * @type {number}
 */
  protected static PER_METER = 3.28084;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @protected
 * @static
 * @type {number}
 */
  protected static PER_MILE = 5280;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [feet=1]
 * @returns {number}
 */
  static toMeters(feet: number = 1) {
    return feet / Feet.PER_METER;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [feet=1]
 * @returns {number}
 */
  static toMiles(feet: number = 1) {
    return feet / Feet.PER_MILE;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [feet=1]
 * @returns {number}
 */
  static toKilometers(feet: number = 1) {
    return Feet.toMeters(feet) / 1000;
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Miles
 * @typedef {Miles}
 */
export class Miles {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [miles=1]
 * @returns {number}
 */
  static toFeet(miles: number = 1) {
    return miles / Feet.toMiles();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [miles=1]
 * @returns {number}
 */
  static toMeters(miles: number = 1) {
    return Feet.toMeters(Miles.toFeet(miles));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [miles=1]
 * @returns {number}
 */
  static toKilometers(miles: number = 1) {
    const meters = Feet.toMeters(Miles.toFeet(miles));
    return meters / 1000;
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Meters
 * @typedef {Meters}
 */
export class Meters {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [meters=1]
 * @returns {number}
 */
  static toKilometers(meters: number = 1) {
    return meters / 1000;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [meters=1]
 * @returns {number}
 */
  static toFeet(meters: number = 1) {
    return meters / Feet.toMeters();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [meters=1]
 * @returns {number}
 */
  static toMiles(meters: number = 1) {
    return Feet.toMiles(Meters.toFeet(meters));
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Kilometers
 * @typedef {Kilometers}
 */
export class Kilometers {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [kilometers=1]
 * @returns {number}
 */
  static toMeters(kilometers: number = 1) {
    return kilometers / 1000;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [kilometers=1]
 * @returns {number}
 */
  static toFeet(kilometers: number = 1) {
    return Meters.toFeet(Kilometers.toMeters(kilometers));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [kilometers=1]
 * @returns {number}
 */
  static toMiles(kilometers: number = 1) {
    const meters = kilometers * 1000;
    return Feet.toMiles(Meters.toFeet(meters));
  }
}


declare namespace Length {
  type Feet = typeof Length.Feet.prototype;
  type Miles = typeof Length.Miles.prototype;
  type Meters = typeof Length.Meters.prototype;
  type Kilometers = typeof Length.Kilometers.prototype;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Length
 * @typedef {Length}
 */
export class Length {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Feet}
 */
  static Feet = Feet;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Miles}
 */
  static Miles = Miles;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Meters}
 */
  static Meters = Meters;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Kilometers}
 */
  static Kilometers = Kilometers;
}