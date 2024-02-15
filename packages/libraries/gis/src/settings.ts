import {
  Conversion,
  IUnitOverrides,
  IUnits,
  eAngle,
  eLength,
  eTime,
  getLocalUnits
} from '@markpthomas/units/conversion';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface ITrackCriteria
 * @typedef {ITrackCriteria}
 * @extends {IUnitOverrideable}
 */
export interface ITrackCriteria extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {IActivities}
 */
  activities: IActivities
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?ICruft}
 */
  cruft?: ICruft
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?ISplit}
 */
  split?: ISplit
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?INoiseCloud}
 */
  noiseCloud?: INoiseCloud
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?IMisc}
 */
  misc?: IMisc
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface ICruft
 * @typedef {ICruft}
 * @extends {IUnitOverrideable}
 */
export interface ICruft extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  gapDistanceMax: number
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?number}
 */
  gapTimeMax?: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface INoiseCloud
 * @typedef {INoiseCloud}
 * @extends {IUnitOverrideable}
 */
export interface INoiseCloud extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  speedMin: number
  /**
   * Minimum time between pausing & resuming movement that determines how to handle the noise cloud.
   * @type {string}
   * @memberof INoiseCloud
   */
  stopDurationMin?: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface ISplit
 * @typedef {ISplit}
 * @extends {IUnitOverrideable}
 */
export interface ISplit extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  stopDurationMax: number
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  moveDurationMin: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IMisc
 * @typedef {IMisc}
 * @extends {IUnitOverrideable}
 */
export interface IMisc extends IUnitOverrideable {
  /**
   * This is the minimum time interval for which a GPS device records its position.
   *
   * @type {number}
   * @memberof IMisc
   */
  gpsTimeInterval: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IActivities
 * @typedef {IActivities}
 */
export interface IActivities {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  [key: string]: IActivity;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IActivity
 * @typedef {IActivity}
 * @extends {IUnitOverrideable}
 */
export interface IActivity extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {string}
 */
  name: string
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?ISpeedCriteria}
 */
  speed?: ISpeedCriteria
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?IRotationCriteria}
 */
  rotation?: IRotationCriteria
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?IElevationCriteria}
 */
  elevation?: IElevationCriteria
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?ISlopeCriteria}
 */
  slope?: ISlopeCriteria
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?number}
 */
  gapDistanceMax?: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface ISpeedCriteria
 * @typedef {ISpeedCriteria}
 * @extends {IUnitOverrideable}
 */
export interface ISpeedCriteria extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  min: number,
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  max: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IRotationCriteria
 * @typedef {IRotationCriteria}
 * @extends {IUnitOverrideable}
 */
export interface IRotationCriteria extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  angularVelocityMax: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IElevationCriteria
 * @typedef {IElevationCriteria}
 * @extends {IUnitOverrideable}
 */
export interface IElevationCriteria extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  ascentRateMax: number,
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  descentRateMax: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface ISlopeCriteria
 * @typedef {ISlopeCriteria}
 * @extends {IUnitOverrideable}
 */
export interface ISlopeCriteria extends IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {number}
 */
  max: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IUnitOverrideable
 * @typedef {IUnitOverrideable}
 */
export interface IUnitOverrideable {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {?IUnitOverrides}
 */
  units?: IUnitOverrides
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {ITrackCriteria} globalDefaults
 * @param {IUnits} localUnits
 * @returns {ITrackCriteria}
 */
function convertGlobalDefaults(globalDefaults: ITrackCriteria, localUnits: IUnits) {
  return convertTracks(globalDefaults, globalDefaults, localUnits);
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {ITrackCriteria} trackCriteria
 * @param {ITrackCriteria} sessionTrackCriteria
 * @param {IUnits} localUnits
 * @returns {ITrackCriteria}
 */
function convertTracks(trackCriteria: ITrackCriteria, sessionTrackCriteria: ITrackCriteria, localUnits: IUnits) {
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
        sessionTrackCriteria[activityKey] = convertActivityToGlobalUnits(configActivity, configActivity, localUnits);
      }
    });
  }

  sessionTrackCriteria.units = globalUnits;

  return sessionTrackCriteria;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @param {ITrackCriteria} trackCriteria
 * @returns {ITrackCriteria}
 */
export function convertTrackToGlobalUnits(trackCriteria: ITrackCriteria): ITrackCriteria {
  const globalDefaults = getGlobalDefaults();
  const localUnits: IUnits = trackCriteria.units
    ? getLocalUnits(trackCriteria.units, globalUnits)
    : getLocalUnits(globalDefaults.units, globalUnits);
  const sessionTrackCriteria = convertGlobalDefaults(globalDefaults, localUnits);

  return convertTracks(trackCriteria, sessionTrackCriteria, localUnits);
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {ICruft} cruft
 * @param {ITrackCriteria} sessionTrackCriteria
 * @param {IUnits} units
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {INoiseCloud} noiseCloud
 * @param {ITrackCriteria} sessionTrackCriteria
 * @param {IUnits} units
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {ISplit} split
 * @param {ITrackCriteria} sessionTrackCriteria
 * @param {IUnits} units
 */
function convertSplitToGlobalUnits(split: ISplit, sessionTrackCriteria: ITrackCriteria, units: IUnits) {
  if (!split) {
    return;
  }

  const localUnits = getLocalUnits(split.units, units);

  sessionTrackCriteria.split.stopDurationMax = converter.convertTime(split.stopDurationMax, localUnits);
  sessionTrackCriteria.split.moveDurationMin = converter.convertTime(split.moveDurationMin, localUnits);

  delete sessionTrackCriteria.split.units;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {IMisc} misc
 * @param {ITrackCriteria} sessionTrackCriteria
 * @param {IUnits} units
 */
function convertMiscToGlobalUnits(misc: IMisc, sessionTrackCriteria: ITrackCriteria, units: IUnits) {
  if (!misc) {
    return;
  }

  const localUnits = getLocalUnits(misc.units, units);

  sessionTrackCriteria.misc.gpsTimeInterval = converter.convertTime(misc.gpsTimeInterval, localUnits);

  delete sessionTrackCriteria.misc.units;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {IActivity} activity
 * @param {IActivity} sessionActivity
 * @param {IUnits} units
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {ISpeedCriteria} criteria
 * @param {ISpeedCriteria} sessionCriteria
 * @param {IUnits} units
 */
function convertActivitySpeedToGlobalUnits(criteria: ISpeedCriteria, sessionCriteria: ISpeedCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.max = converter.convertSpeed(criteria.max, localUnits);
  sessionCriteria.min = converter.convertSpeed(criteria.min, localUnits);

  delete sessionCriteria.units;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {IRotationCriteria} criteria
 * @param {IRotationCriteria} sessionCriteria
 * @param {IUnits} units
 */
function convertActivityRotationToGlobalUnits(criteria: IRotationCriteria, sessionCriteria: IRotationCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.angularVelocityMax = converter.convertAngularSpeed(criteria.angularVelocityMax, localUnits);

  delete sessionCriteria.units;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {IElevationCriteria} criteria
 * @param {IElevationCriteria} sessionCriteria
 * @param {IUnits} units
 */
function convertActivityElevationToGlobalUnits(criteria: IElevationCriteria, sessionCriteria: IElevationCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.ascentRateMax = converter.convertSpeed(criteria.ascentRateMax, localUnits);
  sessionCriteria.descentRateMax = converter.convertSpeed(criteria.descentRateMax, localUnits);

  delete sessionCriteria.units;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @param {ISlopeCriteria} criteria
 * @param {ISlopeCriteria} sessionCriteria
 * @param {IUnits} units
 */
function convertActivitySlopeToGlobalUnits(criteria: ISlopeCriteria, sessionCriteria: ISlopeCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  sessionCriteria.max = converter.convertAngle(criteria.max, localUnits);

  delete sessionCriteria.units;
}


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * */
const getGlobalDefaults = (): ITrackCriteria => {
  return {
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
}


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {IUnits}
 */
const globalUnits: IUnits = {
  length: eLength.meters,
  time: eTime.seconds,
  angle: eAngle.radians
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {*}
 */
const converter = new Conversion(globalUnits);