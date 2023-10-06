import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import { Point, Position } from "../../GeoJSON";
import { IDirection } from "../Direction";
import { Vertex } from "../../Geometry/Vertex";

export interface IPointProperties {
  lat: number;
  lng: number;
  alt?: number | undefined;
  /**
     * Elevation [meters] obtained from an external source for the location, such as DEM/LIDAR data.
     *
     * @type {number}
     * @memberof Coordinate
     */
  elevation?: number | undefined;
}

export interface IPoint
  extends
  IPointProperties,
  ICloneable<PPoint>,
  IEquatable<IPointProperties> {

  toPosition(): Position;
  toPoint(): Point;

  distanceTo(otherLatLng: IPointProperties): number;
};

export type Points = PPoint | PPoint[] | PPoint[][] | PPoint[][][];

export class PPoint
  extends Vertex
  implements IPoint {

  lat: number;
  lng: number;
  alt?: number | undefined;
  elevation?: number | undefined;

  constructor(lat: number, lng: number, altitude?: number) {
    super();

    this.lat = lat;
    this.lng = lng;
    if (altitude) {
      this.alt = altitude;
    }
  }

  toPosition(): Position {
    return this.elevation
      ? [this.lng, this.lat, this.elevation]
      : this.alt
        ? [this.lng, this.lat, this.alt]
        : [this.lng, this.lat];
  }

  toPoint(): Point {
    return this.elevation
      ? Point.fromLngLat(this.lng, this.lat, this.elevation)
      : this.alt
        ? Point.fromLngLat(this.lng, this.lat, this.alt)
        : Point.fromLngLat(this.lng, this.lat);
  }

  distanceTo(pointJ: IPointProperties): number {
    return PPoint.calcDistanceBetween(this, pointJ);
  }

  static calcDistanceBetween(pointI: IPointProperties, pointJ: IPointProperties) {
    const toRads = Math.PI / 180;

    const latI = pointI.lat * toRads;
    const latJ = pointJ.lat * toRads;
    const lngI = pointI.lng * toRads;
    const lngJ = pointJ.lng * toRads;

    const radius = 6371; // km

    return Math.acos(Math.sin(latI) * Math.sin(latJ) + Math.cos(latI) * Math.cos(latJ) * Math.cos(lngJ - lngI)) * radius * 1000;
  }

  // === Common Interfaces ===
  clone(): PPoint {
    const point = new PPoint(this.lat, this.lng, this.alt);

    if (this.elevation) {
      point.elevation = this.elevation;
    }

    return point;
  }

  protected equalsBase(point: IPointProperties): boolean {
    return point.lat === this.lat
      && point.lng === this.lng
      && ((!this.alt && !point.alt) || point.alt === this.alt)
      && ((!this.elevation && !point.elevation) || point.elevation === this.elevation);
  }

  equals(point: IPointProperties): boolean {
    return this.equalsBase(point);
  }

  // == Factory Methods
  static fromPosition(position: Position) {
    const coordinate = new PPoint(position[1], position[0], position[2]);

    return coordinate;
  }

  static fromPoint(point: Point) {
    const coordinate = new PPoint(point.latitude, point.longitude, point.altitude);

    return coordinate;
  }

  // === Calc Methods ===
  /**
   * Returns the distance between two lat/long points in meters.
   *
   * @protected
   * @param {PPoint} ptI
   * @param {IPointProperties} ptJ
   * @return {*}
   * @memberof Track
   */
  static calcSegmentDistanceMeters(ptI: PPoint, ptJ: IPointProperties) {
    return ptI.distanceTo(ptJ);
  }

  static calcSegmentAngleRad(ptI: PPoint, ptJ: PPoint) {
    const latLength = ptI.distanceTo(new PPoint(ptJ.lat, ptI.lng)) * ((ptJ.lat > ptI.lat) ? 1 : -1);
    const lngLength = ptI.distanceTo(new PPoint(ptI.lat, ptJ.lng)) * ((ptJ.lng > ptI.lng) ? 1 : -1);

    return lngLength
      ? Math.atan2(latLength, lngLength)
      : latLength > 0 ? Math.PI / 2
        : latLength < 0 ? 3 * Math.PI / 2
          : null;
  }

  static calcSegmentDirection(ptI: IPointProperties, ptJ: IPointProperties): IDirection {
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

  static calcSegmentMeasuredAltitudeChange(ptI: IPointProperties, ptJ: IPointProperties) {
    return ptJ.alt && ptI.alt ? ptJ.alt - ptI.alt : undefined;
  }

  static calcSegmentMappedElevationChange(ptI: IPointProperties, ptJ: IPointProperties) {
    return ptJ.elevation && ptI.elevation ? ptJ.elevation - ptI.elevation : undefined;
  }
}