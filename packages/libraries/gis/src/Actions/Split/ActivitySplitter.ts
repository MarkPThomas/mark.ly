import {
  Track
} from "../../Core/Track/index";
import { SpeedSmoother } from "../smooth/index";
import { IActivities, IActivity } from "../../settings";

import { DistanceSplitter } from "./DistanceSplitter";
import { ISplitResult } from "./SplitManager";
import { Splitter } from "./Splitter";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @interface IActivitySplitResult
 * @typedef {IActivitySplitResult}
 * @extends {ISplitResult}
 */
export interface IActivitySplitResult extends ISplitResult {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @type {{
 *     [key: string]: Track[]
 *   }\}
 */
  tracksByActivity: {
    [key: string]: Track[]
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @class ActivitySplitter
 * @typedef {ActivitySplitter}
 * @extends {Splitter}
 */
export class ActivitySplitter extends Splitter {
  /**
 * Creates an instance of ActivitySplitter.
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @constructor
 * @param {Track} track
 * @param {number} [minMoveDuration=300]
 */
  constructor(track: Track, minMoveDuration: number = 300) {
    super(track, minMoveDuration);
  }

  // TODO: Finish in v1.
  // splitByActivities(
  //   activities: IActivities,
  //   isSmoothed: boolean = false,
  //   minTrackDuration?: number
  // ): IActivitySplitResult {

  //   // TODO: Activities should be sorted by ascending max speed.
  //   //    Should that be assumed to be done outside the method, or here?
  //   //    Should that be done by a separate sorted activities array?
  //    //    Note: smoothing should be for each sport, working from fastest down.
  //    //    This might compromise current strategy. At least requires more thinking.

  //   let track: Track = this._splitManager.track;
  //   const activityKeys = Object.keys(activities);
  //   if (activityKeys.length > 1) {
  //     track = track.clone();
  //   }

  //   const results: IActivitySplitResult = {
  //     points: [],
  //     segments: [],
  //     tracks: [],
  //     tracksByActivity: {
  //       other: []
  //     }
  //   }

  //   // Instead of forEach, should we just:
  //   //  1. do the first activity
  //   //  2. delete the activity property from activities
  //   //  3. recurse this method with new activities property & keys list, passing down results object as well
  //   activityKeys.forEach((activityKey) => {
  //     const activity = activities[activityKey];

  //     const splitTracks = this.splitByActivity(activity, isSmoothed, track, minTrackDuration);

  //     results.points.push(...splitTracks.points);
  //     results.segments.push(...splitTracks.segments);
  //     results.tracks.push(...splitTracks.tracks);

  //     if (!results.tracksByActivity[activityKey]) {
  //       results.tracksByActivity[activityKey] = [];
  //     }
  //     results.tracksByActivity[activityKey].push(...splitTracks.tracks);

  //     // TODO: Remove points from ISplitResult return? They can be accessed by segments returned

  //     // Get time interval of split points by segment
  //     // From base track, copy out segments for each time interval
  //     // For each segment, iterate from next activity on down

  //   });

  //   return results;
  // }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @param {IActivity} activity
 * @param {boolean} [isSmoothed=false]
 * @param {?Track} [track]
 * @param {?number} [minTrackDuration]
 * @param {?number} [gapDistanceMax]
 * @returns {ISplitResult}
 */
  splitByActivity(
    activity: IActivity,
    isSmoothed: boolean = false,
    track?: Track,
    minTrackDuration?: number,
    gapDistanceMax?: number
  ): ISplitResult {
    track = track ?? this._splitManager.track;
    gapDistanceMax = gapDistanceMax ?? activity?.gapDistanceMax;

    if (!gapDistanceMax) {
      return {
        tracks: [track],
        points: [],
        segments: []
      };
    }

    if (!isSmoothed) {
      const speedSmoother = new SpeedSmoother(track);
      speedSmoother.smoothBySpeed(activity.speed.max, true);
    }

    minTrackDuration = minTrackDuration ?? this._minTrackDuration;
    const distanceSplitter = new DistanceSplitter(track, minTrackDuration);

    return distanceSplitter.splitByMaxDistance(activity.gapDistanceMax);
  }
}