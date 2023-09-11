import { CoordinateNode } from "../../Geometry/Polyline";
import { TrackPoint } from "../Track/TrackPoint";
import { TrackSegment } from "../Track/TrackSegment";
import { EvaluatorArgs, Track } from "../Track/Track";

export interface ISmoothManager {
  track: Track;

  /**
   *  Removes nodes based on the target criteria & evaluator function.
   *
   * @protected
   * @param {number} target
   * @param {(target: number, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean} evaluator
   * @param {boolean} iterate If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}  {CoordinateNode<TrackPoint, TrackSegment>[]} Coordinates removed in the smoothing operation.
   * @memberof ISmoothManager
   */
  smooth(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean,
    iterate: boolean
  ): CoordinateNode<TrackPoint, TrackSegment>[]
}

export class SmoothManager implements ISmoothManager {
  private _track: Track;
  get track() {
    return this._track;
  }

  constructor(track: Track) {
    this._track = track;
  }

  smooth(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) => boolean,
    iterate: boolean = false
  ): CoordinateNode<TrackPoint, TrackSegment>[] {
    let smoothCoordsCurrent: CoordinateNode<TrackPoint, TrackSegment>[];
    let smoothCoords: CoordinateNode<TrackPoint, TrackSegment>[] = [];
    do {
      smoothCoordsCurrent = this._track.getNodesBy(target, evaluator);
      smoothCoords.push(...smoothCoordsCurrent);
      this._track.removeNodes(smoothCoordsCurrent);
    } while (iterate && smoothCoordsCurrent.length)

    return smoothCoords;
  }
}