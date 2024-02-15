import { BBox as SerialBBox } from "geojson";

import {
  BoundingBox as GeoBoundingBox,
  IBoundingBox as IGeoBoundingBox
} from "@markpthomas/geojson";

import { LatLngBounds } from "../types";
import { TrackPoint } from "./Track/TrackPoint";

/**
 * Description placeholder
 * @date 2/5/2024 - 4:28:09 PM
 *
 * @export
 * @interface ITrackBoundingBox
 * @typedef {ITrackBoundingBox}
 * @extends {IGeoBoundingBox}
 */
export interface ITrackBoundingBox extends IGeoBoundingBox {
  /**
   * Description placeholder
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @returns {LatLngBounds}
   */
  toCornerLatLng(): LatLngBounds;
}

/**
 * Description placeholder
 * @date 2/5/2024 - 4:28:09 PM
 *
 * @export
 * @class BoundingBox
 * @typedef {BoundingBox}
 * @extends {GeoBoundingBox}
 */
export class BoundingBox extends GeoBoundingBox {
  /**
   * Creates an instance of BoundingBox.
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @constructor
   * @protected
   */
  protected constructor() { super() }

  /**
   * Description placeholder
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @returns {LatLngBounds}
   */
  toCornerLatLng(): LatLngBounds {
    return [[this.south, this.west], [this.north, this.east]];
  }

  /**
   * Description placeholder
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @static
   * @param {(GeoBoundingBox | BoundingBox)} boundingBox
   * @returns {BoundingBox}
   */
  static fromBoundingBox(boundingBox: GeoBoundingBox | BoundingBox): BoundingBox {
    const trackBoundingBox = new BoundingBox();

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

  /**
   * Description placeholder
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @static
   * @param {TrackPoint} trackPoint
   * @param {?number} [bufferDegree]
   * @returns {BoundingBox}
   */
  static fromTrackPoint(trackPoint: TrackPoint, bufferDegree?: number): BoundingBox {
    const point = trackPoint.toPoint();
    const bbox = BoundingBox.fromPoint(point, bufferDegree);
    return BoundingBox.fromBoundingBox(bbox);
  }

  /**
   * Description placeholder
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @static
   * @param {TrackPoint[]} trackPoints
   * @returns {BoundingBox}
   */
  static fromTrackPoints(trackPoints: TrackPoint[]): BoundingBox {
    if (trackPoints.length === 1) {
      return BoundingBox.fromTrackPoint(trackPoints[0]);
    }

    const trackPointsFlat = trackPoints.flat(Infinity);
    const pointsFlat = trackPointsFlat.map((trackPoint) => trackPoint.toPoint());

    const bbox = BoundingBox.fromPoints(pointsFlat);
    return BoundingBox.fromBoundingBox(bbox);
  }

  /**
   * Description placeholder
   * @date 2/5/2024 - 4:28:09 PM
   *
   * @static
   * @param {SerialBBox} json
   * @returns {BoundingBox}
   */
  static fromJson(json: SerialBBox): BoundingBox {
    const bbox = GeoBoundingBox.fromJson(json);
    return BoundingBox.fromBoundingBox(bbox);
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
