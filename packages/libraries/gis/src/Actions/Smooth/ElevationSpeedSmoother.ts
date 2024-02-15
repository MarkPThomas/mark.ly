import { VertexNode } from "@markpthomas/geometry/polyline";

import {
  EvaluatorArgs,
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
 * @class ElevationSpeedSmoother
 * @typedef {ElevationSpeedSmoother}
 * @extends {Smoother}
 */
export class ElevationSpeedSmoother extends Smoother {
  /**
 * Creates an instance of ElevationSpeedSmoother.
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @constructor
 * @param {Track} track
 */
  constructor(track: Track) { super(track); }

  /**
    * Removes coordinates that have adjacent segments that gain/lose elevation beyond the specified rate.
    *
    * @protected
    * @param {number} maxAscentRateMPS Elevation gain rate limit in meters/second.
    * @param {number} [maxDescentRateMPS] Elevation loss rate limit in meters/second. If not provided, the gain rate limit will be applied.
    * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
    * @return {number} Number of nodes smoothed.
    * @memberof Track
    */
  public smoothByElevationSpeed(
    maxAscentRateMPS: number,
    maxDescentRateMPS?: number,
    iterate?: boolean): number {
    const nodesSmoothed = this._smoothManager.smooth(
      { maxAscentRateMPS, maxDescentRateMPS },
      this.isExceedingElevationSpeedLimit,
      iterate
    );
    return nodesSmoothed.length;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @protected
 * @param {EvaluatorArgs} param0
 * @param {EvaluatorArgs} param0.maxAscentRateMPS
 * @param {EvaluatorArgs} param0.maxDescentRateMPS
 * @param {VertexNode<TrackPoint, TrackSegment>} coord
 * @returns {boolean}
 */
  protected isExceedingElevationSpeedLimit(
    { maxAscentRateMPS, maxDescentRateMPS }: EvaluatorArgs,
    coord: VertexNode<TrackPoint, TrackSegment>
  ): boolean {
    maxDescentRateMPS = maxDescentRateMPS ?? maxAscentRateMPS;
    if (coord.val?.path) {
      return coord.val.path.ascentRate > maxAscentRateMPS
        || coord.val.path.descentRate > maxDescentRateMPS;
    }

    return false;
  }
}