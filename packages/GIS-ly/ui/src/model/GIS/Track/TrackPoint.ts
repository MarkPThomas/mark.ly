import { ICloneable, IEquatable } from '../../../../../../common/interfaces';

import { Point, Position } from "../../GeoJSON";

import { IDirection } from "../Direction";
import { TimeStamp } from "./TimeStamp";
import { ITrackPathProps, TrackPathProps } from "./TrackPathProps";
import { IRoutePointProperties, RoutePoint } from "../Route/RoutePoint";
import { ITrackSegmentProperties } from './TrackSegment';

interface PositionProperties {
  position: Position;
  // indices?: PositionIndex;
  timestamp?: string;
}

interface PointProperties {
  point: Point;
  // indices?: PositionIndex;
  timestamp?: string;
}

export type ITrackPoints = ITrackPoint | ITrackPoint[] | ITrackPoint[][] | ITrackPoint[][][];

export interface LatLngGPS {
  lat: number;
  lng: number;
  alt?: number | undefined;
  timestamp?: string;
}

export interface ITrackPointProperties extends IRoutePointProperties {
  timestamp: string;

  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {{
   *     rotation: number;
   *     angularSpeed: number;
   *   }}
   * @memberof Coordinate
   */
  path: ITrackPathProps;
}

export interface ITrackPoint
  extends
  ITrackPointProperties,
  ICloneable<TrackPoint>,
  IEquatable<ITrackPointProperties> {
};

export type TrackPoints = TrackPoint | TrackPoint[] | TrackPoint[][] | TrackPoint[][][];

export class TrackPoint
  extends RoutePoint
  implements ITrackPoint {

  protected _timestamp: TimeStamp;
  get timestamp(): string {
    return this._timestamp?.time;
  }
  set timestamp(timestamp: string) {
    this._timestamp = new TimeStamp(timestamp);
  }

  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {{
   *     rotation: number;
   *     angularSpeed: number;
   *   }}
   * @memberof Coordinate
   */
  _path: ITrackPathProps;
  get path(): ITrackPathProps {
    if (!this._path) {
      this._path = new TrackPathProps();
    }
    return this._path;
  }

  constructor(lat: number, lng: number, altitude?: number, timestamp?: string) {
    super(lat, lng, altitude);
    if (timestamp) {
      this._timestamp = new TimeStamp(timestamp);
    }
  }

  protected initialize() {
    this._path = new TrackPathProps();
  }


  // == Factory Methods
  static fromPositionInTime({ position, timestamp }: PositionProperties): TrackPoint {
    const trackPoint = new TrackPoint(position[1], position[0], position[2], timestamp);
    trackPoint.initialize();
    return trackPoint;
  }

  static fromPointInTime({ point, timestamp }: PointProperties): TrackPoint {
    const trackPoint = new TrackPoint(point.latitude, point.longitude, point.altitude, timestamp);
    trackPoint.initialize();
    return trackPoint;
  }

  static fromProperties(properties: ITrackPointProperties): TrackPoint {
    const point = new TrackPoint(properties.lat, properties.lng, properties.alt, properties.timestamp);
    point.elevation = properties.elevation;
    point._path = properties.path;

    return point;
  }

  // === Common Interfaces ===
  clone(): TrackPoint {
    const trackPoint = new TrackPoint(this.lat, this.lng, this.alt, this.timestamp);

    if (this.elevation) {
      trackPoint.elevation = this.elevation;
    }

    if (this._path) {
      trackPoint._path = this._path.clone();
    }

    return trackPoint;
  }

  equals(trackPoint: ITrackPointProperties): boolean {
    return super.equals(trackPoint)
      && ((!this.timestamp && !trackPoint.timestamp) || trackPoint.timestamp === this.timestamp)
      && this.path.equals(trackPoint.path);

  }
}


