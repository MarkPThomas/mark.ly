import { LatLng } from "leaflet";

import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import { Point, Position } from "../../GeoJSON";
import { IDirection } from "../Direction";

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
  extends LatLng    // TODO: Factor out this leaflet dependency
  implements IPoint {

  // lat: number;
  // lng: number;
  // alt?: number | undefined;
  elevation?: number | undefined;

  constructor(lat: number, lng: number, altitude?: number) {
    super(lat, lng, altitude);
    // this.lat = lat;
    // this.lng = lng;
    // if (altitude) {
    //   this.alt = altitude;
    // }
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

  distanceTo(otherLatLng: IPointProperties): number {
    // TODO: Replace this with local method to avoid Leaflet dependency
    return super.distanceTo(otherLatLng);
  }

  // === Common Interfaces ===
  clone(): PPoint {
    const point = new PPoint(this.lat, this.lng, this.alt);

    if (this.elevation) {
      point.elevation = this.elevation;
    }

    return point;
  }

  equals(trackPoint: IPointProperties): boolean {
    return trackPoint.lat === this.lat
      && trackPoint.lng === this.lng
      && ((!this.alt && !trackPoint.alt) || trackPoint.alt === this.alt)
      && ((!this.elevation && !trackPoint.elevation) || trackPoint.elevation === this.elevation)
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