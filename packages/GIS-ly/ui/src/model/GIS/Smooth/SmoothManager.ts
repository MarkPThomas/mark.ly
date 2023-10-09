import { VertexNode } from "../../Geometry/Polyline";
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
   * @param {(target: number, coord: VertexNode<TrackPoint, TrackSegment>) => boolean} evaluator
   * @param {boolean} iterate If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}  {CoordinateNode<TrackPoint, TrackSegment>[]} Coordinates removed in the smoothing operation.
   * @memberof ISmoothManager
   */
  smooth(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean,
    iterate: boolean
  ): VertexNode<TrackPoint, TrackSegment>[]
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
    evaluator: (target: number | EvaluatorArgs, coord: VertexNode<TrackPoint, TrackSegment>) => boolean,
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