import { Point, Position } from "../../GeoJSON";

import { ICloneable, IEquatable } from '../../../../../../common/interfaces';

import { PPoint, IPointProperties } from '../Point/Point';

import { IRoutePathProps, RoutePathProps } from "./RoutePathProps";

export type IRoutePoints = IRoutePoint | IRoutePoint[] | IRoutePoint[][] | IRoutePoint[][][];

export interface IRoutePointProperties extends IPointProperties {
  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {IRoutePathProps}
   * @memberof IRoutePointProperties
   */
  path: IRoutePathProps
}

export interface IRoutePoint
  extends
  IRoutePointProperties,
  ICloneable<RoutePoint>,
  IEquatable<IRoutePointProperties> {
};

export type RoutePoints = RoutePoint | RoutePoint[] | RoutePoint[][] | RoutePoint[][][];

export class RoutePoint
  extends PPoint
  implements IRoutePoint {
  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {IRoutePathProps}
   * @memberof RoutePoint
   */
  _path: IRoutePathProps;
  get path(): IRoutePathProps {
    if (!this._path) {
      this._path = new RoutePathProps();
    }
    return this._path;
  }

  constructor(lat: number, lng: number, altitude?: number) {
    super(lat, lng, altitude);
  }

  protected initialize() {
    this._path = new RoutePathProps();
  }

  // == Factory Methods
  static fromPosition(position: Position): RoutePoint {
    const coordinate = new RoutePoint(position[1], position[0], position[2]);
    coordinate.initialize();
    return coordinate;
  }

  static fromPoint(point: Point): RoutePoint {
    const coordinate = new RoutePoint(point.latitude, point.longitude, point.altitude);
    coordinate.initialize();
    return coordinate;
  }

  static fromProperties(properties: IRoutePointProperties): RoutePoint {
    const point = new RoutePoint(properties.lat, properties.lng, properties.alt);
    point.elevation = properties.elevation;
    point._path = properties.path;

    return point;
  }

  // === Common Interfaces ===
  clone(): RoutePoint {
    const routePoint = new RoutePoint(this.lat, this.lng, this.alt);

    if (this.elevation) {
      routePoint.elevation = this.elevation;
    }

    if (this._path) {
      routePoint._path = this._path.clone();
    }

    return routePoint;
  }

  equals(routePoint: IRoutePointProperties): boolean {
    return this.equalsBase(routePoint)
      && this.path.equals(routePoint.path);
  }
}


