import { VertexNode } from "../../../Geometry/Polyline";
import {
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track";

import { Smoother } from "./Smoother";

export class AngularSpeedSmoother extends Smoother {
  constructor(track: Track) { super(track); }

  /**
   * Removes coordinates that have adjacent segments that rotate beyond the specified rotation rate.
   *
   * @param {number} maxAngSpeedRadS Rotation rate limit in radians/second.
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {number} Number of nodes smoothed.
   * @memberof Track
   */
  public smoothByAngularSpeed(maxAngSpeedRadS: number, iterate?: boolean): number {
    const nodesSmoothed = this._smoothManager.smooth(maxAngSpeedRadS, this.isExceedingAngularSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  protected isExceedingAngularSpeedLimit(limit: number, coord: VertexNode<TrackPoint, TrackSegment>) {
    return coord.val?.path && Math.abs(coord.val.path.rotationRate) > limit;
  }
}