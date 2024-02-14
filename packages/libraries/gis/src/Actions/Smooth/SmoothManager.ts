import { VertexNode } from "@markpthomas/geometry/polyline";

import {
  EvaluatorArgs,
  Track,
  TrackPoint,
  TrackSegment
} from "../../Core/Track/index";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @interface ISmoothManager
 * @typedef {ISmoothManager}
 */
export interface ISmoothManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @type {Track}
 */
  track: Track;

  /**
   *  Removes nodes based on the target criteria & evaluator function.
   *
   * @protected
   * @param {number} target
   * @param {(target: number, coord: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
   * @param {boolean} iterate If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}  {CoordinateNode<TrackPoint, TrackSegment>[]} Coordinates removed in the smoothing operation.
   * @memberof ISmoothManager
   */
  smooth(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean,
    iterate: boolean
  ): VertexNode<TrackPoint, TrackSegment>[]
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @class SmoothManager
 * @typedef {SmoothManager}
 * @implements {ISmoothManager}
 */
export class SmoothManager implements ISmoothManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @private
 * @type {Track}
 */
  private _track: Track;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @readonly
 * @type {Track}
 */
  get track() {
    return this._track;
  }

  /**
 * Creates an instance of SmoothManager.
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @constructor
 * @param {Track} track
 */
  constructor(track: Track) {
    this._track = track;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @param {(number | EvaluatorArgs)} target
 * @param {(target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
 * @param {boolean} [iterate=false]
 * @returns {VertexNode<TrackPoint, TrackSegment>[]}
 */
  smooth(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, point: VertexNode<TrackPoint, TrackSegment>) => boolean,
    iterate: boolean = false
  ): VertexNode<TrackPoint, TrackSegment>[] {
    let smoothCoordsCurrent: VertexNode<TrackPoint, TrackSegment>[];
    let smoothCoords: VertexNode<TrackPoint, TrackSegment>[] = [];
    do {
      smoothCoordsCurrent = this._track.vertexNodesBy(target, evaluator);
      smoothCoords.push(...smoothCoordsCurrent);
      this._track.removeAtAny(smoothCoordsCurrent, iterate);
    } while (iterate && smoothCoordsCurrent.length)

    if (iterate) {
      this._track.updateGeoJsonTrack(smoothCoords.length);
    }

    return smoothCoords;
  }
}