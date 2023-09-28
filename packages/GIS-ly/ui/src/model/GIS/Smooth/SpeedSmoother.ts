import { VertexNode } from "../../Geometry/Polyline";
import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";
import { TrackSegment } from "../Track/TrackSegment";

import { Smoother } from "./Smoother";

export class SpeedSmoother extends Smoother {
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

  protected isExceedingSpeedLimit(limit: number, coord: VertexNode<TrackPoint, TrackSegment>) {
    return coord.val?.path.speed && coord.val.path.speed > limit;
  }
}