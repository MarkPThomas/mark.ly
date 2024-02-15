import { VertexNode } from "@markpthomas/geometry/polyline";

import {
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track/index";

import { Smoother } from "./Smoother";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @class SpeedSmoother
 * @typedef {SpeedSmoother}
 * @extends {Smoother}
 */
export class SpeedSmoother extends Smoother {
  /**
 * Creates an instance of SpeedSmoother.
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @constructor
 * @param {Track} track
 */
  constructor(track: Track) { super(track); }

  /**
   * Removes coordinates that exceed the specified speed.
   *
   * @param {number} maxSpeedMS Speed in meters/second.
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @memberof Track
   */
  public smoothBySpeed(maxSpeedMS: number, iterate?: boolean) {
    const nodesSmoothed = this._smoothManager.smooth(maxSpeedMS, this.isExceedingSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @protected
 * @param {number} limit
 * @param {VertexNode<TrackPoint, TrackSegment>} coord
 * @returns {boolean}
 */
  protected isExceedingSpeedLimit(limit: number, coord: VertexNode<TrackPoint, TrackSegment>) {
    return coord.val?.path.speed && coord.val.path.speed > limit;
  }
}