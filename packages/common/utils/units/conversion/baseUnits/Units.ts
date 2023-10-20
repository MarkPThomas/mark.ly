export interface IUnits {
  length: eLength
  time: eTime
  angle: eAngle
}

export enum eLength {
  feet = 'feet',
  miles = 'miles',
  meters = 'meters',
  kilometers = 'kilometers'
}

export enum eTime {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours'
}

export enum eAngle {
  radians = 'radians',
  degrees = 'degrees',
  percent = 'percent'
}