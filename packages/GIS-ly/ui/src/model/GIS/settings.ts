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
  activities: IActivities
  cruft?: ICruft
  split?: ISplit
  noiseCloud?: INoiseCloud
  misc?: IMisc
}

export interface ICruft extends IUnitOverrideable {
  gapDistanceMax: number
  gapTimeMax?: number
}

export interface INoiseCloud extends IUnitOverrideable {
  speedMin: number
  /**
   * Minimum time between pausing & resuming movement that determines how to handle the noise cloud.
   * @type {string}
   * @memberof INoiseCloud
   */
  stopDurationMin?: number
}

export interface ISplit extends IUnitOverrideable {
  stopDurationMax: number
  moveDurationMin: number
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

export interface IActivities {
  [key: string]: IActivity;
}

export interface IActivity extends IUnitOverrideable {
  name: string
  speed?: ISpeedCriteria
  rotation?: IRotationCriteria
  elevation?: IElevationCriteria
  slope?: ISlopeCriteria
  gapDistanceMax?: number
}

export interface ISpeedCriteria extends IUnitOverrideable {
  min: number,
  max: number
}

export interface IRotationCriteria extends IUnitOverrideable {
  angularVelocityMax: number
}

export interface IElevationCriteria extends IUnitOverrideable {
  ascentRateMax: number,
  descentRateMax: number
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

  convertCruftToGlobalUnits(trackCriteria.cruft, sessionTrackCriteria, localUnits);
  convertNoiseCloudToGlobalUnits(trackCriteria.noiseCloud, sessionTrackCriteria, localUnits);
  convertSplitToGlobalUnits(trackCriteria.split, sessionTrackCriteria, localUnits);
  convertMiscToGlobalUnits(trackCriteria.misc, sessionTrackCriteria, localUnits);

  if (trackCriteria.activities) {
    const activityKeys = Object.keys(trackCriteria.activities);
    activityKeys.forEach((activityKey: string) => {
      const configActivity = trackCriteria.activities[activityKey];
      const sessionActivity = sessionTrackCriteria.activities[activityKey];

      if (configActivity && sessionActivity) {
        convertActivityToGlobalUnits(configActivity, sessionActivity, localUnits);
      } else {
        sessionTrackCriteria[activityKey] = configActivity;
      }
    });
  }

  sessionTrackCriteria.units = globalUnits;

  return sessionTrackCriteria;
}

function convertCruftToGlobalUnits(cruft: ICruft, sessionTrackCriteria: ITrackCriteria, units: IUnits) {
  if (!cruft) {
    return;
  }

  const localUnits = getLocalUnits(cruft.units, units);

  sessionTrackCriteria.cruft.gapDistanceMax = converter.convertLength(cruft.gapDistanceMax, localUnits);

  if (cruft.gapTimeMax) {
    sessionTrackCriteria.cruft.gapTimeMax = converter.convertTime(cruft.gapTimeMax, localUnits);
  }

  delete sessionTrackCriteria.cruft.units;
}

function convertNoiseCloudToGlobalUnits(noiseCloud: INoiseCloud, sessionTrackCriteria: ITrackCriteria, units: IUnits) {
  if (!noiseCloud) {
    return;
  }

  const localUnits = getLocalUnits(noiseCloud.units, units);

  sessionTrackCriteria.noiseCloud.speedMin = converter.convertSpeed(noiseCloud.speedMin, localUnits);

  if (noiseCloud.stopDurationMin) {
    sessionTrackCriteria.noiseCloud.stopDurationMin = converter.convertTime(noiseCloud.stopDurationMin, localUnits);
  }

  delete sessionTrackCriteria.noiseCloud.units;
}

function convertSplitToGlobalUnits(split: ISplit, sessionTrackCriteria: ITrackCriteria, units: IUnits) {
  if (!split) {
    return;
  }

  const localUnits = getLocalUnits(split.units, units);

  sessionTrackCriteria.split.stopDurationMax = converter.convertTime(split.stopDurationMax, localUnits);
  sessionTrackCriteria.split.moveDurationMin = converter.convertTime(split.moveDurationMin, localUnits);

  delete sessionTrackCriteria.split.units;
}

function convertMiscToGlobalUnits(misc: IMisc, sessionTrackCriteria: ITrackCriteria, units: IUnits) {
  if (!misc) {
    return;
  }

  const localUnits = getLocalUnits(misc.units, units);

  sessionTrackCriteria.misc.gpsTimeInterval = converter.convertTime(misc.gpsTimeInterval, localUnits);

  delete sessionTrackCriteria.misc.units;
}

function convertActivityToGlobalUnits(activity: IActivity, sessionActivity: IActivity, units: IUnits) {
  if (!activity) {
    return;
  }

  const localUnits = getLocalUnits(activity.units, units);

  convertActivitySpeedToGlobalUnits(activity.speed, sessionActivity.speed, localUnits);
  convertActivityRotationToGlobalUnits(activity.rotation, sessionActivity.rotation, localUnits);
  convertActivityElevationToGlobalUnits(activity.elevation, sessionActivity.elevation, localUnits);
  convertActivitySlopeToGlobalUnits(activity.slope, sessionActivity.slope, localUnits);

  sessionActivity.gapDistanceMax = converter.convertLength(activity.gapDistanceMax, localUnits);

  delete sessionActivity.units;
}

function convertActivitySpeedToGlobalUnits(criteria: ISpeedCriteria, sessionCriteria: ISpeedCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.max = converter.convertSpeed(criteria.max, localUnits);
  sessionCriteria.min = converter.convertSpeed(criteria.min, localUnits);

  delete sessionCriteria.units;
}

function convertActivityRotationToGlobalUnits(criteria: IRotationCriteria, sessionCriteria: IRotationCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.angularVelocityMax = converter.convertAngularSpeed(criteria.angularVelocityMax, localUnits);

  delete sessionCriteria.units;
}

function convertActivityElevationToGlobalUnits(criteria: IElevationCriteria, sessionCriteria: IElevationCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.ascentRateMax = converter.convertSpeed(criteria.ascentRateMax, localUnits);
  sessionCriteria.descentRateMax = converter.convertSpeed(criteria.descentRateMax, localUnits);

  delete sessionCriteria.units;
}

function convertActivitySlopeToGlobalUnits(criteria: ISlopeCriteria, sessionCriteria: ISlopeCriteria, units: IUnits) {
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
        ascentRateMax: 3000,
        descentRateMax: 4500
      },
      gapDistanceMax: 0.25
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
        ascentRateMax: 2000,
        descentRateMax: 6000
      },
      slope: {
        units: {
          angle: eAngle.percent
        },
        max: 30
      },
      gapDistanceMax: 1
    }
  },
  cruft: {
    gapDistanceMax: 3
  },
  split: {
    stopDurationMax: 3,
    moveDurationMin: 0.083
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