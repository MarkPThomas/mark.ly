import { LatLng } from "leaflet";

import { Point, Position } from "../../GeoJSON";

import { IDirection } from "../Direction";
import { TimeStamp } from "./TimeStamp";

export interface PositionIndex {
  coordIndex: number;
  segmentIndex?: number;
  polygonIndex?: number;
};

interface PositionProperties {
  position: Position;
  indices?: PositionIndex;
  timeStamp?: string;
}

export type ITrackPoints = ITrackPoint | ITrackPoint[] | ITrackPoint[][] | ITrackPoint[][][];

export interface LatLngGPS {
  lat: number;
  lng: number;
  alt?: number | undefined;
  timeStamp?: string;
}

export interface ITrackPoint {
  lat: number;
  lng: number;
  alt?: number | undefined;

  timeStamp?: string;

  /**
   * Elevation [meters] obtained from an external source for the location, such as DEM/LIDAR data.
   *
   * @type {number}
   * @memberof Coordinate
   */
  elevation?: number;

  /**
   * Average speed [m/s] at the node based on the speed of the segments before and after.
   * If one segment is missing or has no speed, this is the speed of the other segment.
   *
   * @type {number}
   * @memberof Coordinate
   */
  speedAvg?: number;

  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {{
   *     rotation: number;
   *     angularSpeed: number;
   *   }}
   * @memberof Coordinate
   */
  path?: {
    rotation: number;
    rotationRate: number;
    ascentRate: number;
    descentRate: number;
  }

  /**
   * Index location(s) of the lat/lng within a possible nesting of polygons->segments->coordinates found in a GeoJSON object.
   *
   * @type {PositionIndex}
   * @memberof Coordinate
   */
  indices?: PositionIndex;
};

export type TrackPoints = TrackPoint | TrackPoint[] | TrackPoint[][] | TrackPoint[][][];

export class TrackPoint
  extends LatLng
  implements ITrackPoint {

  constructor(lat: number, lng: number, altitude?: number, timeStamp?: string) {
    super(lat, lng, altitude);
    if (timeStamp) {
      this._timeStamp = new TimeStamp(timeStamp);
    }
  }

  protected _timeStamp: TimeStamp;
  get timeStamp(): string {
    return this._timeStamp.time;
  }
  set timeStamp(timeStamp: string) {
    this._timeStamp = new TimeStamp(timeStamp);
  }

  /**
   * Elevation [meters] obtained from an external source for the location, such as DEM/LIDAR data.
   *
   * @type {number}
   * @memberof Coordinate
   */
  elevation?: number;

  /**
   * Average speed [m/s] at the node based on the speed of the segments before and after.
   * If one segment is missing or has no speed, this is the speed of the other segment.
   *
   * @type {number}
   * @memberof Coordinate
   */
  speedAvg?: number;

  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {{
   *     rotation: number;
   *     angularSpeed: number;
   *   }}
   * @memberof Coordinate
   */
  path?: {
    rotation: number;
    rotationRate: number;
    ascentRate: number;
    descentRate: number;
  }

  /**
   * Index location(s) of the lat/lng within a possible nesting of polygons->segments->coordinates found in a GeoJSON object.
   *
   * @type {PositionIndex}
   * @memberof Coordinate
   */
  indices?: PositionIndex;

  toPoint(): Point {
    return this.elevation
      ? Point.fromLngLat(this.lng, this.lat, this.elevation)
      : Point.fromLngLat(this.lng, this.lat);
  }

  toPosition(): Position {
    return this.elevation
      ? [this.lng, this.lat, this.elevation]
      : [this.lng, this.lat];
  }

  // == Factory Methods
  static fromPosition({ position, indices, timeStamp }: PositionProperties) {
    const coordinate = new TrackPoint(position[1], position[0], position[2]);

    if (timeStamp) {
      coordinate._timeStamp = new TimeStamp(timeStamp);
    }

    if (indices) {
      coordinate.indices = indices;
    }

    return coordinate;
  }

  static toPosition(coord: LatLng): Position {
    const position = [coord.lng, coord.lat];
    if (coord.alt) {
      position.push(coord.alt);
    }

    return position as Position;
  }

  // == Calc Methods
  /**
 * Returns the distance between two lat/long points in meters.
 *
 * @protected
 * @param {TrackPoint} ptI
 * @param {TrackPoint} ptJ
 * @return {*}
 * @memberof Track
 */
  static calcSegmentDistanceMeters(ptI: TrackPoint, ptJ: TrackPoint) {
    return ptI.distanceTo(ptJ);
  }

  static calcSegmentAngleRad(ptI: TrackPoint, ptJ: TrackPoint) {
    const latLength = ptI.distanceTo(new TrackPoint(ptJ.lat, ptI.lng)) * ((ptJ.lat > ptI.lat) ? 1 : -1);
    const lngLength = ptI.distanceTo(new TrackPoint(ptI.lat, ptJ.lng)) * ((ptJ.lng > ptI.lng) ? 1 : -1);


    return lngLength
      ? Math.atan2(latLength, lngLength)
      : latLength > 0 ? Math.PI / 2
        : latLength < 0 ? 3 * Math.PI / 2
          : null;
  }

  static calcSegmentDirection(ptI: TrackPoint, ptJ: TrackPoint): IDirection {
    const deltaLat = ptJ.lat - ptI.lat;
    const lat = deltaLat > 0
      ? 'N'
      : deltaLat < 0
        ? 'S'
        : null;

    const deltaLng = ptJ.lng - ptI.lng;
    const lng = deltaLng > 0
      ? 'E'
      : deltaLng < 0
        ? 'W'
        : null;
    return { lat, lng };
  }

  static calcSegmentMappedElevationChange(ptI: TrackPoint, ptJ: TrackPoint) {
    return ptJ.elevation && ptI.elevation ? ptJ.elevation - ptI.elevation : undefined;
  }

  /**
 * Returns the speed of a straight-line segment joining two points in meters/second.
 *
 * @protected
 * @param {TrackPoint} ptI
 * @param {TrackPoint} ptJ
 * @return {*}
 * @memberof Track
 */
  static calcSegmentSpeedMPS(ptI: TrackPoint, ptJ: TrackPoint) {
    const distanceMeter = TrackPoint.calcSegmentDistanceMeters(ptI, ptJ);
    const timeSec = TimeStamp.calcIntervalSec(ptI.timeStamp, ptJ.timeStamp);

    return timeSec === 0
      ? 0 :
      timeSec ? Math.abs(distanceMeter / timeSec)
        : undefined;
  }
}


