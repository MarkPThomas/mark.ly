import { ICloneable, IEquatable } from 'common/interfaces';

import { Position } from "@markpthomas/geojson";
import { Point } from "@markpthomas/geojson/Geometries";

import { PPoint, IPointProperties } from '../Point/Point';

import { IRoutePathProps, RoutePathProps } from "./RoutePathProps";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @typedef {IRoutePoints}
 */
export type IRoutePoints = IRoutePoint | IRoutePoint[] | IRoutePoint[][] | IRoutePoint[][][];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRoutePointProperties
 * @typedef {IRoutePointProperties}
 * @extends {IPointProperties}
 */
export interface IRoutePointProperties extends IPointProperties {
  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {IRoutePathProps}
   * @memberof IRoutePointProperties
   */
  path: IRoutePathProps
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRoutePoint
 * @typedef {IRoutePoint}
 * @extends {IRoutePointProperties}
 * @extends {ICloneable<RoutePoint>}
 * @extends {IEquatable<IRoutePointProperties>}
 */
export interface IRoutePoint
  extends
  IRoutePointProperties,
  ICloneable<RoutePoint>,
  IEquatable<IRoutePointProperties> {
};

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @typedef {RoutePoints}
 */
export type RoutePoints = RoutePoint | RoutePoint[] | RoutePoint[][] | RoutePoint[][][];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @class RoutePoint
 * @typedef {RoutePoint}
 * @extends {PPoint}
 * @implements {IRoutePoint}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @readonly
 * @type {IRoutePathProps}
 */
  get path(): IRoutePathProps {
    if (!this._path) {
      this._path = new RoutePathProps();
    }
    return this._path;
  }

  /**
 * Creates an instance of RoutePoint.
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @constructor
 * @param {number} lat
 * @param {number} lng
 * @param {?number} [altitude]
 */
  constructor(lat: number, lng: number, altitude?: number) {
    super(lat, lng, altitude);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @protected
 */
  protected initialize() {
    this._path = new RoutePathProps();
  }

  // == Factory Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @param {Position} position
 * @returns {RoutePoint}
 */
  static fromPosition(position: Position): RoutePoint {
    const coordinate = new RoutePoint(position[1], position[0], position[2]);
    coordinate.initialize();
    return coordinate;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @param {Point} point
 * @returns {RoutePoint}
 */
  static fromPoint(point: Point): RoutePoint {
    const coordinate = new RoutePoint(point.latitude, point.longitude, point.altitude);
    coordinate.initialize();
    return coordinate;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @static
 * @param {IRoutePointProperties} properties
 * @returns {RoutePoint}
 */
  static fromProperties(properties: IRoutePointProperties): RoutePoint {
    const point = new RoutePoint(properties.lat, properties.lng, properties.alt);
    point.elevation = properties.elevation;
    point._path = properties.path;

    return point;
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @returns {RoutePoint}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {IRoutePointProperties} routePoint
 * @returns {boolean}
 */
  equals(routePoint: IRoutePointProperties): boolean {
    return this.equalsBase(routePoint)
      && this.path.equals(routePoint.path);
  }
}


