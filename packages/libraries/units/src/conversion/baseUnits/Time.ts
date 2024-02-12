/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {60}
 */
const SECONDS_PER_MINUTE = 60;
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {60}
 */
const MINUTES_PER_HOUR = 60;
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {24}
 */
const HOURS_PER_DAY = 24;
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {7}
 */
const DAYS_PER_WEEK = 7;

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Seconds
 * @typedef {Seconds}
 */
export class Seconds {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [seconds=1]
 * @returns {number}
 */
  static toMinutes(seconds: number = 1) {
    return seconds / SECONDS_PER_MINUTE;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [seconds=1]
 * @returns {number}
 */
  static toHours(seconds: number = 1) {
    return Minutes.toHours(Seconds.toMinutes(seconds));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [seconds=1]
 * @returns {number}
 */
  static toDays(seconds: number = 1) {
    return Hours.toDays(Seconds.toHours(seconds));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [seconds=1]
 * @returns {number}
 */
  static toWeeks(seconds: number = 1) {
    return Days.toWeeks(Seconds.toDays(seconds));
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Minutes
 * @typedef {Minutes}
 */
export class Minutes {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [minutes=1]
 * @returns {number}
 */
  static toSeconds(minutes: number = 1) {
    return minutes * SECONDS_PER_MINUTE;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [minutes=1]
 * @returns {number}
 */
  static toHours(minutes: number = 1) {
    return minutes / MINUTES_PER_HOUR;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [minutes=1]
 * @returns {number}
 */
  static toDays(minutes: number = 1) {
    return Hours.toDays(Minutes.toHours(minutes));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [minutes=1]
 * @returns {number}
 */
  static toWeeks(minutes: number = 1) {
    return Days.toWeeks(Minutes.toDays(minutes));
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Hours
 * @typedef {Hours}
 */
export class Hours {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [hours=1]
 * @returns {number}
 */
  static toSeconds(hours: number = 1) {
    return Minutes.toSeconds(Hours.toMinutes(hours));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [hours=1]
 * @returns {number}
 */
  static toMinutes(hours: number = 1) {
    return hours * MINUTES_PER_HOUR;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [hours=1]
 * @returns {number}
 */
  static toDays(hours: number = 1) {
    return hours / HOURS_PER_DAY;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [hours=1]
 * @returns {number}
 */
  static toWeeks(hours: number = 1) {
    return Days.toWeeks(Hours.toDays(hours));
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Days
 * @typedef {Days}
 */
export class Days {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [days=1]
 * @returns {number}
 */
  static toSeconds(days: number = 1) {
    return Minutes.toSeconds(Days.toMinutes(days));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [days=1]
 * @returns {number}
 */
  static toMinutes(days: number = 1) {
    return Hours.toMinutes(Days.toHours(days));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [days=1]
 * @returns {number}
 */
  static toHours(days: number = 1) {
    return days * HOURS_PER_DAY;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [days=1]
 * @returns {number}
 */
  static toWeeks(days: number = 1) {
    return days / DAYS_PER_WEEK;
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Weeks
 * @typedef {Weeks}
 */
export class Weeks {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [weeks=1]
 * @returns {number}
 */
  static toSeconds(weeks: number = 1) {
    return Minutes.toSeconds(Weeks.toMinutes(weeks));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [weeks=1]
 * @returns {number}
 */
  static toMinutes(weeks: number = 1) {
    return Hours.toMinutes(Weeks.toHours(weeks));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [weeks=1]
 * @returns {number}
 */
  static toHours(weeks: number = 1) {
    return Days.toHours(Weeks.toDays(weeks));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @param {number} [weeks=1]
 * @returns {number}
 */
  static toDays(weeks: number = 1) {
    return weeks * DAYS_PER_WEEK;
  }
}

declare namespace Time {
  type Seconds = typeof Time.Seconds.prototype;
  type Minutes = typeof Time.Minutes.prototype;
  type Hours = typeof Time.Hours.prototype;
  type Days = typeof Time.Days.prototype;
  type Weeks = typeof Time.Weeks.prototype;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @class Time
 * @typedef {Time}
 */
export class Time {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Seconds}
 */
  static Seconds = Seconds;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Minutes}
 */
  static Minutes = Minutes;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Hours}
 */
  static Hours = Hours;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Days}
 */
  static Days = Days;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @static
 * @type {typeof Weeks}
 */
  static Weeks = Weeks;
}