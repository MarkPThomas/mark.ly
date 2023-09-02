import { BoundingBox, IBoundingBox } from "../../GeoJSON";
import { LatLngBounds } from "../types";
import { TrackPoint } from "./TrackPoint";

export interface ITrackBoundingBox extends IBoundingBox {
  toCornerLatLng(): LatLngBounds;
}

export class TrackBoundingBox extends BoundingBox {
  protected constructor() { super() }


  toCornerLatLng(): LatLngBounds {
    return [[this.south, this.west], [this.north, this.east]];
  }

  static fromTrackPoint(trackPoint: TrackPoint): TrackBoundingBox {
    const point = trackPoint.toPoint();
    return BoundingBox.fromPoint(point) as TrackBoundingBox;
  }

  static fromTrackPoints(trackPoints: TrackPoint[]): TrackBoundingBox {
    if (trackPoints.length === 1) {
      return TrackBoundingBox.fromTrackPoint(trackPoints[0]);
    }

    const trackPointsFlat = trackPoints.flat(Infinity);
    const pointsFlat = trackPointsFlat.map((trackPoint) => trackPoint.toPoint());

    return BoundingBox.fromPoints(pointsFlat) as TrackBoundingBox;
  }
}