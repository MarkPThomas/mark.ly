import { VertexNode } from "@markpthomas/geometry/polyline";

import {
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track";

import { Smoother } from "./Smoother";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @class StationarySmoother
 * @typedef {StationarySmoother}
 * @extends {Smoother}
 */
export class StationarySmoother extends Smoother {
  /**
 * Creates an instance of StationarySmoother.
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @constructor
 * @param {Track} track
 */
  constructor(track: Track) { super(track); }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @public
 * @param {number} minSpeedMS
 * @param {?boolean} [iterate]
 * @returns {*}
 */
  public smoothStationary(minSpeedMS: number, iterate?: boolean) {
    const nodesSmoothed = this._smoothManager.smooth(minSpeedMS, this.isStationary, iterate);
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
  protected isStationary(limit: number, coord: VertexNode<TrackPoint, TrackSegment>) {
    return coord.val?.path.speed && coord.val.path.speed < limit;
  }
}