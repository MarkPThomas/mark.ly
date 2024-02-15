import { INodeOfInterest } from "@markpthomas/geometry/stats";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRateProperty
 * @typedef {IRateProperty}
 */
export interface IRateProperty {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {INodeOfInterest<TrackPoint, TrackSegment>}
 */
  max: INodeOfInterest<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {INodeOfInterest<TrackPoint, TrackSegment>}
 */
  min: INodeOfInterest<TrackPoint, TrackSegment>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {number}
 */
  avg: number;
  // median: number;
  // stdDev1: number;
}