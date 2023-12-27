export interface IUnits {
  length: eLength
  time: eTime
  angle: eAngle
  // temperature: eTemp
}

export interface IUnitOverrides {
  length?: eLength
  time?: eTime
  angle?: eAngle
  // temperature?: eTemp
}

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

export enum eTime {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
}

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