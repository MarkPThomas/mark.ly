import { BBox as SerialBBox } from "geojson";

import { BoundingBox, IBoundingBox, IPoint, PointProperties } from "../../GeoJSON";
import { LatLngBounds, LatLngs, TrackPoints } from "../types";
import { TrackPoint } from "./TrackPoint";

export interface ITrackBoundingBox extends IBoundingBox {
  toCornerLatLng(): LatLngBounds;
}

export class TrackBoundingBox extends BoundingBox {
  protected constructor() { super() }


  toCornerLatLng(): LatLngBounds {
    return this.southwestAltitude
      ? [[this.south, this.west, this.southwestAltitude], [this.north, this.east, this.northeastAltitude]]
      : [[this.south, this.west], [this.north, this.east]];
  }

  static fromBoundingBox(boundingBox: BoundingBox): TrackBoundingBox {
    const trackBoundingBox = new TrackBoundingBox();

    trackBoundingBox.west = boundingBox.west;
    trackBoundingBox.south = boundingBox.south;
    trackBoundingBox.east = boundingBox.east;
    trackBoundingBox.north = boundingBox.north;

    if (boundingBox.hasAltitude()) {
      trackBoundingBox.southwestAltitude = boundingBox.southwestAltitude;
      trackBoundingBox.northeastAltitude = boundingBox.northeastAltitude;
    }

    return trackBoundingBox;
  }

  static fromTrackPoint(trackPoint: TrackPoint, bufferDegree?: number): TrackBoundingBox {
    const point = trackPoint.toPoint();
    const bbox = BoundingBox.fromPoint(point, bufferDegree);
    return TrackBoundingBox.fromBoundingBox(bbox);
  }

  static fromTrackPoints(trackPoints: TrackPoint[]): TrackBoundingBox {
    if (trackPoints.length === 1) {
      return TrackBoundingBox.fromTrackPoint(trackPoints[0]);
    }

    const trackPointsFlat = trackPoints.flat(Infinity);
    const pointsFlat = trackPointsFlat.map((trackPoint) => trackPoint.toPoint());

    const bbox = BoundingBox.fromPoints(pointsFlat);
    return TrackBoundingBox.fromBoundingBox(bbox);
  }

  static fromJson(json: SerialBBox): TrackBoundingBox {
    const bbox = BoundingBox.fromJson(json);
    return TrackBoundingBox.fromBoundingBox(bbox);
  }

  // TODO: Might be irrelevant, even as a convenience method. See after refactoring is more complete.
  // /**
  //  * Returns bounding box tuple of [SW, NE] coords of [Lat, Lng] tuples base on the provided list of LatLngs.
  //  *
  //  * @static
  //  * @param {LatLng[]} coords
  //  * @memberof TrackBoundingBox
  //  */
  // static getBoundingBox(coords: LatLngs): LatLngBounds {
  //   if (Array.isArray(coords)) {
  //     const newCoords: LatLngs[] = coords.flat(Infinity) as LatLngs[];
  //     const newTrackPoints = newCoords.map((coord) => TrackPoint.f)
  //     return TrackBoundingBox.fromTrackPoints(newCoords).toCornerLatLng();
  //   } else {
  //     return TrackBoundingBox.fromTrackPoint(coords, 0).toCornerLatLng();
  //   }
  // }
}
