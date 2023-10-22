import { VertexNode } from "../../Geometry/Polyline";
import {
  Track,
  TrackPoint,
  TrackSegment
} from "../Track";

import { Smoother } from "./Smoother";

export class StationarySmoother extends Smoother {
  constructor(track: Track) { super(track); }

  public smoothStationary(minSpeedMS: number, iterate?: boolean) {
    const nodesSmoothed = this._smoothManager.smooth(minSpeedMS, this.isStationary, iterate);
    return nodesSmoothed.length;
  }

  protected isStationary(limit: number, coord: VertexNode<TrackPoint, TrackSegment>) {
    return coord.val?.path.speed && coord.val.path.speed < limit;
  }
}