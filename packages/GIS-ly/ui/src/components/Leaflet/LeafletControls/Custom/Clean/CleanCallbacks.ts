import { Track } from "../../../../../model/GIS";
import { IActivity, ICruft, ISplit, ITrackCriteria } from "../../../../../model/GIS/settings";

import {
  StationarySmoother,
  SpeedSmoother,
  NoiseCloudSmoother,
  AngularSpeedSmoother,
  ElevationSpeedSmoother
} from '../../../../../model/GIS/Actions/Smooth';

import { DurationSplitter } from '../../../../../model/GIS/Actions/Split';
import { ISplitResult } from "../../../../../model/GIS/Actions/Split/SplitManager";

import { CruftManager } from '../../../../../model/GIS/Actions/Cruft/CruftManager';
import { ActivitySplitter } from "../../../../../model/GIS/Actions/Split/ActivitySplitter";

export interface ICleanCallback {
  criteria: string;
  cb: () => void;
}

export interface ICleanCallbacks {
  trim: {
    cruft: ICleanCallback;
  };
  smooth: {
    stopped: ICleanCallback;
    noiseCloud: ICleanCallback;
    speed: ICleanCallback;
    angularSpeed: ICleanCallback;
    elevationSpeed: ICleanCallback;
  };
  split: {
    movement: ICleanCallback;
    activity: ICleanCallback;
  }
}

const smoothStationary = (track: Track, criteria: IActivity) => {
  if (track && criteria) {
    const manager = new StationarySmoother(track);
    const minSpeedMS = criteria.speed.min;
    return manager.smoothStationary(minSpeedMS, true);
  }
}

const smoothBySpeed = (track: Track, criteria: IActivity) => {
  if (track && criteria) {
    const manager = new SpeedSmoother(track);
    const speedLimitMS = criteria.speed.max;
    return manager.smoothBySpeed(speedLimitMS, true);
  }
}

const smoothByAngularSpeed = (track: Track, criteria: IActivity) => {
  if (track && criteria) {
    const manager = new AngularSpeedSmoother(track);
    const angularSpeedLimitRadS = criteria.rotation.angularVelocityMax;
    return manager.smoothByAngularSpeed(angularSpeedLimitRadS, true);
  }
}

const smoothNoiseCloud = (track: Track, criteria: ITrackCriteria) => {
  if (track && criteria) {
    const gpsTimeIntervalS = criteria.misc.gpsTimeInterval;
    const manager = new NoiseCloudSmoother(track, gpsTimeIntervalS);

    const minSpeedMS = criteria.noiseCloud.speedMin;
    return manager.smoothNoiseClouds(minSpeedMS, true);
  }
}

const smoothByElevationSpeed = (track: Track, criteria: IActivity) => {
  if (track && criteria) {
    const manager = new ElevationSpeedSmoother(track);

    const ascentSpeedLimitMS = criteria.elevation.ascentRateMax;
    const descentSpeedLimitMS = criteria.elevation.descentRateMax;
    return manager.smoothByElevationSpeed(ascentSpeedLimitMS, descentSpeedLimitMS, true);
  }
}


const trimByCruft = (track: Track, criteria: ICruft) => {
  if (track && criteria) {
    const manager = new CruftManager(track);

    console.log('trimByCruft')
    console.log('criteria.gapDistanceMax', criteria.gapDistanceMax)
    const triggerDistanceM = criteria.gapDistanceMax;
    return manager.trimTrackByCruft(triggerDistanceM);
  }
}


const splitOnStop = (track: Track, criteria: ISplit) => {
  if (track && criteria) {
    const manager = new DurationSplitter(track);

    const maxStopDurationS = criteria.stopDurationMax;
    const minMoveDurationS = criteria.moveDurationMin;
    return manager.splitByMaxDuration(maxStopDurationS, minMoveDurationS);
  }
}

const splitOnActivity = (track: Track, criteria: IActivity) => {
  if (track && criteria) {
    const manager = new ActivitySplitter(track);
    return manager.splitByActivity(criteria);
  }
}

type CleanCb = (
  cleanCb: (track: Track, criteria: {}) => number,
  criteria: {}
) => void

type NoiseCloudCb = (
  noiseCloudCb: (track: Track, criteria: ITrackCriteria) => {
    nodes: number;
    clouds: number;
  },
  criteria: ITrackCriteria
) => void;

type SplitWithPreviewCb = (
  splitCb: (track: Track, criteria: ISplit | IActivity) => ISplitResult,
  criteria: ISplit | IActivity
) => void;

export function getCleanCallbacks(
  activityCriteria: IActivity,
  trackCriteria: ITrackCriteria,
  handleClean: CleanCb,
  handleNoiseCloud: NoiseCloudCb,
  handleSplitWithPreview: SplitWithPreviewCb
): ICleanCallbacks {

  return {
    trim: {
      cruft: {
        criteria: 'cruft',
        cb: () => handleClean(trimByCruft, trackCriteria.cruft)
      },
    },
    smooth: {
      stopped: {
        criteria: 'stopped',
        cb: () => handleClean(smoothStationary, activityCriteria)
      },
      noiseCloud: {
        criteria: 'noise cloud',
        cb: () => handleNoiseCloud(smoothNoiseCloud, trackCriteria)
      },
      speed: {
        criteria: 'speed',
        cb: () => handleClean(smoothBySpeed, activityCriteria)
      },
      angularSpeed: {
        criteria: 'angular rate',
        cb: () => handleClean(smoothByAngularSpeed, activityCriteria)
      },
      elevationSpeed: {
        criteria: 'elevation rate',
        cb: () => handleClean(smoothByElevationSpeed, activityCriteria)
      },
    },
    split: {
      movement: {
        criteria: 'movements',
        cb: () => handleSplitWithPreview(splitOnStop, trackCriteria.split)
      },
      activity: {
        criteria: 'activities',
        cb: () => handleSplitWithPreview(splitOnActivity, activityCriteria)
      },
    }
  }
}