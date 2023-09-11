import { CoordinateNode } from "../../Geometry/Polyline";
import { EvaluatorArgs, Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";
import { TrackSegment } from "../Track/TrackSegment";

import { Smoother } from "./Smoother";

export class ElevationSpeedSmoother extends Smoother {
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
  public smoothByElevationSpeed(maxAscentRateMPS: number, maxDescentRateMPS?: number, iterate?: boolean): number {
    const nodesSmoothed = this._smoothManager.smooth(
      { maxAscentRateMPS, maxDescentRateMPS },
      this.isExceedingElevationSpeedLimit,
      iterate
    );
    return nodesSmoothed.length;
  }

  protected isExceedingElevationSpeedLimit(
    { maxAscentRateMPS, maxDescentRateMPS }: EvaluatorArgs,
    coord: CoordinateNode<TrackPoint, TrackSegment>
  ): boolean {
    maxDescentRateMPS = maxDescentRateMPS ?? maxAscentRateMPS;
    if (coord.val?.path) {
      return coord.val.path.ascentRate > maxAscentRateMPS
        || coord.val.path.descentRate > maxDescentRateMPS;
    }

    return false;
  }
}