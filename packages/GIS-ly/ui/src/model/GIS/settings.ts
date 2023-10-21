import {
  Conversion,
  IUnitOverrides,
  IUnits,
  eAngle,
  eLength,
  eTime,
  getLocalUnits
} from '../../../../../common/utils/units/conversion';

export interface ITrackCriteria extends IUnitOverrideable {
  activities: { [key: string]: IActivity; }
  cruft?: ICruft
  noiseCloud?: INoiseCloud
  misc?: IMisc
}

export interface ICruft extends IUnitOverrideable {
  pointSeparationLimit: number
  timeSeparationLimit?: number
}

export interface INoiseCloud extends IUnitOverrideable {
  speedMin: number
  /**
   * Minimum time between pausing & resuming movement that determines how to handle the noise cloud.
   * @type {string}
   * @memberof INoiseCloud
   */
  minPauseResumeTime?: number
}

export interface IMisc extends IUnitOverrideable {
  /**
   * This is the minimum time interval for which a GPS device records its position.
   *
   * @type {number}
   * @memberof IMisc
   */
  gpsTimeInterval: number
}

export interface IActivity extends IUnitOverrideable {
  name: string
  speed?: ISpeedCriteria
  rotation?: IRotationCriteria
  elevation?: IElevationCriteria
  slope?: ISlopeCriteria
}

export interface ISpeedCriteria extends IUnitOverrideable {
  min: number,
  max: number
}

export interface IRotationCriteria extends IUnitOverrideable {
  angularVelocityMax: number
}

export interface IElevationCriteria extends IUnitOverrideable {
  maxAscentRate: number,
  maxDescentRate: number
}

export interface ISlopeCriteria extends IUnitOverrideable {
  max: number
}

export interface IUnitOverrideable {
  units?: IUnitOverrides
}

export function convertTrackToGlobalUnits(trackCriteria: ITrackCriteria): ITrackCriteria {
  const localUnits: IUnits = getLocalUnits(trackCriteria.units, globalUnits);
  const sessionTrackCriteria = globalDefaults;

  convertCruftToGlobalUnits(trackCriteria.cruft, localUnits, sessionTrackCriteria);
  convertNoiseCloudToGlobalUnits(trackCriteria.noiseCloud, localUnits, sessionTrackCriteria);
  convertMiscToGlobalUnits(trackCriteria.misc, localUnits, sessionTrackCriteria);

  if (trackCriteria.activities) {
    const activityKeys = Object.keys(trackCriteria.activities);
    activityKeys.forEach((activityKey: string) => {
      const configActivity = trackCriteria.activities[activityKey];
      const sessionActivity = sessionTrackCriteria.activities[activityKey];

      if (configActivity && sessionActivity) {
        convertActivityToGlobalUnits(configActivity, localUnits, sessionActivity);
      } else {
        sessionTrackCriteria[activityKey] = configActivity;
      }
    });
  }

  sessionTrackCriteria.units = globalUnits;

  return sessionTrackCriteria;
}

function convertCruftToGlobalUnits(cruft: ICruft, units: IUnits, sessionTrackCriteria: ITrackCriteria) {
  if (!cruft) {
    return;
  }

  const localUnits = getLocalUnits(cruft.units, units);

  sessionTrackCriteria.cruft.pointSeparationLimit = converter.convertLength(cruft.pointSeparationLimit, localUnits);

  if (cruft.timeSeparationLimit) {
    sessionTrackCriteria.cruft.timeSeparationLimit = converter.convertTime(cruft.timeSeparationLimit, localUnits);
  }

  delete sessionTrackCriteria.cruft.units;
}

function convertNoiseCloudToGlobalUnits(noiseCloud: INoiseCloud, units: IUnits, sessionTrackCriteria: ITrackCriteria) {
  if (!noiseCloud) {
    return;
  }

  const localUnits = getLocalUnits(noiseCloud.units, units);

  sessionTrackCriteria.noiseCloud.speedMin = converter.convertSpeed(noiseCloud.speedMin, localUnits);

  if (noiseCloud.minPauseResumeTime) {
    sessionTrackCriteria.noiseCloud.minPauseResumeTime = converter.convertTime(noiseCloud.minPauseResumeTime, localUnits);
  }

  delete sessionTrackCriteria.noiseCloud.units;
}

function convertMiscToGlobalUnits(misc: IMisc, units: IUnits, sessionTrackCriteria: ITrackCriteria) {
  if (!misc) {
    return;
  }

  const localUnits = getLocalUnits(misc.units, units);

  sessionTrackCriteria.misc.gpsTimeInterval = converter.convertTime(misc.gpsTimeInterval, localUnits);

  delete sessionTrackCriteria.misc.units;
}

function convertActivityToGlobalUnits(activity: IActivity, units: IUnits, sessionActivity: IActivity) {
  if (!activity) {
    return;
  }

  const localUnits = getLocalUnits(activity.units, units);

  convertActivitySpeedToGlobalUnits(activity.speed, localUnits, sessionActivity.speed);
  convertActivityRotationToGlobalUnits(activity.rotation, localUnits, sessionActivity.rotation);
  convertActivityElevationToGlobalUnits(activity.elevation, localUnits, sessionActivity.elevation);
  convertActivitySlopeToGlobalUnits(activity.slope, localUnits, sessionActivity.slope);

  delete sessionActivity.units;
}

function convertActivitySpeedToGlobalUnits(criteria: ISpeedCriteria, units: IUnits, sessionCriteria: ISpeedCriteria) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.max = converter.convertSpeed(criteria.max, localUnits);
  sessionCriteria.min = converter.convertSpeed(criteria.min, localUnits);

  delete sessionCriteria.units;
}

function convertActivityRotationToGlobalUnits(criteria: IRotationCriteria, units: IUnits, sessionCriteria: IRotationCriteria) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.angularVelocityMax = converter.convertAngularSpeed(criteria.angularVelocityMax, localUnits);

  delete sessionCriteria.units;
}

function convertActivityElevationToGlobalUnits(criteria: IElevationCriteria, units: IUnits, sessionCriteria: IElevationCriteria) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.maxAscentRate = converter.convertSpeed(criteria.maxAscentRate, localUnits);
  sessionCriteria.maxDescentRate = converter.convertSpeed(criteria.maxDescentRate, localUnits);

  delete sessionCriteria.units;
}

function convertActivitySlopeToGlobalUnits(criteria: ISlopeCriteria, units: IUnits, sessionCriteria: ISlopeCriteria) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.max = converter.convertAngle(criteria.max, localUnits);

  delete sessionCriteria.units;
}


const globalDefaults: ITrackCriteria = {
  units: {
    length: eLength.miles,
    time: eTime.hours,
    angle: eAngle.degrees
  },
  activities: {
    hiking: {
      name: "Hiking",
      speed: {
        min: 0.25,
        max: 4
      },
      rotation: {
        units: {
          angle: eAngle.degrees,
          time: eTime.seconds
        },
        angularVelocityMax: 60
      },
      elevation: {
        units: {
          length: eLength.feet
        },
        maxAscentRate: 3000,
        maxDescentRate: 4500
      }
    },
    cycling: {
      name: "Cycling",
      speed: {
        min: 0.25,
        max: 60
      },
      rotation: {
        units: {
          angle: eAngle.degrees,
          time: eTime.seconds
        },
        angularVelocityMax: 120
      },
      elevation: {
        units: {
          length: eLength.feet
        },
        maxAscentRate: 2000,
        maxDescentRate: 6000
      },
      slope: {
        units: {
          angle: eAngle.percent
        },
        max: 30
      }
    }
  },
  cruft: {
    pointSeparationLimit: 3
  },
  noiseCloud: {
    speedMin: 0.25
  },
  misc: {
    units: {
      time: eTime.seconds
    },
    gpsTimeInterval: 30
  }
}


const globalUnits: IUnits = {
  length: eLength.meters,
  time: eTime.seconds,
  angle: eAngle.radians
}

const converter = new Conversion(globalUnits);