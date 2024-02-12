/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @interface IUnits
 * @typedef {IUnits}
 */
export interface IUnits {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {eLength}
 */
  length: eLength
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {eTime}
 */
  time: eTime
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {eAngle}
 */
  angle: eAngle
  // temperature: eTemp
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @interface IUnitOverrides
 * @typedef {IUnitOverrides}
 */
export interface IUnitOverrides {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {?eLength}
 */
  length?: eLength
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {?eTime}
 */
  time?: eTime
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @type {?eAngle}
 */
  angle?: eAngle
  // temperature?: eTemp
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @enum {number}
 */
export enum eLength {
  // 1/2, 1/4, 1/8, 1/16, 1/32 inch? Can convert to rounded number or string with binary search.
  // inches = 'inches',
  feet = 'feet',
  // yards = 'yards',
  miles = 'miles',
  // millimeters = 'millimeters',
  // centimeters = 'centimeters',
  meters = 'meters',
  kilometers = 'kilometers'
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @enum {number}
 */
export enum eTime {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @enum {number}
 */
export enum eAngle {
  radians = 'radians',
  degrees = 'degrees',  // decimal degrees
  // degreesMMSS = 'degreesMMSS', // format to mm:ss.xx - only as string?
  percent = 'percent'
}

// export enum eTemp {
//   fahrenheight = 'fahrenheight',
//   celcius = 'celcius',
//   kelvin = 'kelvin'
// }