export interface ITrackCriteria {
  units?: IUnits
  activities: IActivity[]
  cruft: {
    units?: IUnits
    pointSeparationLimit: number
  }
  noiseCloud: {
    units?: IUnits
    speedMin: number
  }
  misc: {
    units?: IUnits
    gpsTimeInterval: number
  }
}

export interface IActivity {
  activity: string
  units?: IUnits
  speed: {
    units?: IUnits
    min: number,
    max: number
  }
  rotation?: {
    units?: IUnits
    angularVelocityMax: number
  }
  elevation?: {
    units?: IUnits
    maxAscentRate: number,
    maxDescentRate: number
  }
  slope?: {
    units?: IUnits
    maxPercent: number
  }
}

export interface IUnits {
  length?: 'miles' | 'feet' | 'kilometers' | 'meters'
  time?: 'seconds' | 'minutes' | 'hours'
  angle?: 'radians' | 'degrees' | 'percent'
}

const globalDefaults: IUnits = {
  length: 'meters',
  time: 'seconds',
  angle: 'radians'
}

export function convertToGlobalDefaults(trackCriteria: ITrackCriteria): ITrackCriteria {
  // TODO: Finish conversion
  return trackCriteria;
}