import {
  Conversion,
  IUnits,
  eAngle,
  eLength,
  eTime,
  getLocalUnits
} from '../../../../../common/utils/units/conversion';

export interface ITrackCriteria extends IUnitOverrideable {
  activities: IActivity[]
  cruft: ICruft
  noiseCloud: INoiseCloud
  misc: IMisc
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
  activity: string
  speed: ISpeedCriteria
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

interface IUnitOverrideable {
  units?: IUnits
}


const globalUnits: IUnits = {
  length: eLength.meters,
  time: eTime.seconds,
  angle: eAngle.radians
}

const converter = new Conversion(globalUnits);

export function convertTrackToGlobalUnits(trackCriteria: ITrackCriteria): ITrackCriteria {
  const localUnits = trackCriteria.units ? trackCriteria.units : globalUnits;

  convertCruftToGlobalUnits(trackCriteria.cruft, localUnits);
  convertNoiseCloudToGlobalUnits(trackCriteria.noiseCloud, localUnits);
  convertMiscToGlobalUnits(trackCriteria.misc, localUnits);

  trackCriteria.activities.forEach((activity: IActivity) => {
    convertActivityToGlobalUnits(activity, localUnits);
  });

  return trackCriteria;
}

function convertCruftToGlobalUnits(cruft: ICruft, units: IUnits) {
  const localUnits = getLocalUnits(cruft.units, units);

  cruft.pointSeparationLimit = converter.convertLength(cruft.pointSeparationLimit, localUnits);

  if (cruft.timeSeparationLimit) {
    cruft.timeSeparationLimit = converter.convertTime(cruft.timeSeparationLimit, localUnits);
  }
}

function convertNoiseCloudToGlobalUnits(noiseCloud: INoiseCloud, units: IUnits) {
  const localUnits = getLocalUnits(noiseCloud.units, units);

  noiseCloud.speedMin = converter.convertLength(noiseCloud.speedMin, localUnits);

  if (noiseCloud.minPauseResumeTime) {
    noiseCloud.minPauseResumeTime = converter.convertTime(noiseCloud.minPauseResumeTime, localUnits);
  }
}

function convertMiscToGlobalUnits(misc: IMisc, units: IUnits) {
  const localUnits = getLocalUnits(misc.units, units);

  misc.gpsTimeInterval = converter.convertTime(misc.gpsTimeInterval, localUnits);
}

function convertActivityToGlobalUnits(activity: IActivity, units: IUnits) {
  const localUnits = getLocalUnits(activity.units, units);

  convertActivitySpeedToGlobalUnits(activity.speed, localUnits);
  convertActivityRotationToGlobalUnits(activity.rotation, localUnits);
  convertActivityElevationToGlobalUnits(activity.elevation, localUnits);
  convertActivitySlopeToGlobalUnits(activity.slope, localUnits);
}

function convertActivitySpeedToGlobalUnits(criteria: ISpeedCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  criteria.max = converter.convertSpeed(criteria.max, localUnits);
  criteria.min = converter.convertSpeed(criteria.min, localUnits);
}

function convertActivityRotationToGlobalUnits(criteria: IRotationCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  criteria.angularVelocityMax = converter.convertAngularSpeed(criteria.angularVelocityMax, localUnits);
}

function convertActivityElevationToGlobalUnits(criteria: IElevationCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  criteria.maxAscentRate = converter.convertSpeed(criteria.maxAscentRate, localUnits);
  criteria.maxDescentRate = converter.convertSpeed(criteria.maxDescentRate, localUnits);
}

function convertActivitySlopeToGlobalUnits(criteria: ISlopeCriteria, units: IUnits) {
  if (!criteria) {
    return;
  }

  const localUnits = getLocalUnits(criteria.units, units);

  criteria.max = converter.convertAngle(criteria.max, localUnits);
}






