import { BBox as SerialBBox } from "geojson";

import { LatLngBoundsExpression, LatLngExpression, LatLngLiteral } from "leaflet";

import { ICloneable, IEquatable } from "../../../../../../common/interfaces";

import { Coordinates } from "../Coordinate";
import { LatLngLiterals } from "./GeoJSON_Refactor";
import { IPoint, Point, PointProperties } from "./Geometries/Point";
import { Position } from "./types";

export type TBoundingBox = [number, number, number, number];

export interface IBoundingBox
  extends IEquatable<BoundingBox>,
  ICloneable<BoundingBox> {
  /**
   * North latitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  north: number,
  /**
   * South latitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  south: number,
  /**
   * West longitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  west: number,
  /**
   * East longitude.
   *
   * @type {number}
   * @memberof IBoundingBox
   */
  east: number,

  southwestAltitude?: number,

  northeastAltitude?: number,

  /**
   * Provides the `Point` which represents the northeast corner of this bounding box when the map is facing due north.
   *
   * @return {*}  {Point}
   * @memberof IBoundingBox
   */
  northeast(): Point,
  /**
   * Provides the `Point` which represents the southwest corner of this bounding box when the map is facing due north.
   *
   * @return {*}  {Point}
   * @memberof IBoundingBox
   */
  southwest(): Point,

  /**
  * This takes the currently defined values found inside this instance and converts it to a GeoJson string.
  *
  * @return {*}  {string}
  * @memberof IBoundingBox
  */
  toJson(): SerialBBox,

  toCornerPositions(): [Position, Position],

  toCornerPoints(): [Point, Point],
}

export class BoundingBox implements IBoundingBox {
  north: number;
  south: number;
  west: number;
  east: number;
  southwestAltitude?: number;
  northeastAltitude?: number;

  hasAltitude(): boolean {
    return this.southwestAltitude !== undefined && this.northeastAltitude !== undefined;
  }

  protected constructor() { }

  northeast(): Point {
    return Point.fromLngLat(this.east, this.north);
  }

  southwest(): Point {
    return Point.fromLngLat(this.west, this.south);
  }

  toJson(): SerialBBox {
    return this.hasAltitude()
      ? [this.north, this.south, this.southwestAltitude, this.west, this.east, this.northeastAltitude]
      : [this.north, this.south, this.west, this.east];
  }

  toCornerPositions(): [Position, Position] {
    return [
      [this.east, this.north],
      [this.west, this.south]
    ];
  }

  toCornerPoints(): [Point, Point] {
    return [
      Point.fromLngLat(this.east, this.north),
      Point.fromLngLat(this.west, this.south)
    ];
  }

  equals(item: BoundingBox): boolean {
    return this.north === item.north
      && this.south === item.south
      && this.west === item.west
      && this.east === item.east;
  }

  clone(): BoundingBox {
    const boundingBox = new BoundingBox();

    boundingBox.north = this.north;
    boundingBox.south = this.south;
    boundingBox.east = this.east;
    boundingBox.west = this.west;
    if (this.hasAltitude()) {
      boundingBox.southwestAltitude = this.southwestAltitude;
      boundingBox.northeastAltitude = this.northeastAltitude;
    }

    return boundingBox;
  }

  static getBoundingBox(coords: LatLngLiterals | Coordinates): LatLngBoundsExpression | LatLngExpression {
    let minLat = Infinity;
    let minLong = Infinity;
    let maxLat = -Infinity;
    let maxLong = -Infinity;

    function setBounds(coord: LatLngLiteral) {
      minLat = Math.min(minLat, coord.lat);
      minLong = Math.min(minLong, coord.lng);

      maxLat = Math.max(maxLat, coord.lat);
      maxLong = Math.max(maxLong, coord.lng);
    }

    if ((coords as any[]).length) {
      if ((coords as any[][])[0].length) {
        if ((coords as any[][][])[0][0].length) {
          coords = coords as LatLngLiteral[][][];
          for (let polygon = 0; polygon < coords.length; polygon++) {
            for (let segment = 0; segment < coords[polygon].length; segment++) {
              for (let coord = 0; coord < coords[polygon][segment].length; coord++) {
                setBounds(coords[polygon][segment][coord]);
              }
            }
          }
        } else {
          coords = coords as LatLngLiteral[][];
          for (let segment = 0; segment < coords.length; segment++) {
            for (let coord = 0; coord < coords[segment].length; coord++) {
              setBounds(coords[segment][coord]);
            }
          }
        }
      } else {
        coords = coords as LatLngLiteral[];
        for (let coord = 0; coord < coords.length; coord++) {
          setBounds(coords[coord]);
        }
      }
    } else {
      coords = coords as LatLngLiteral;
      return [coords.lat, coords.lng];
    }

    return [[minLat, minLong], [maxLat, maxLong]];
  }

  /**
   * Create a new instance of this class by passing in a formatted valid JSON String.
   *
   * @static
   * @param {string} json
   * @return {*}  {BoundingBox}
   * @memberof BoundingBox
   */
  static fromJson(json: SerialBBox): BoundingBox {
    const bbox = new BoundingBox();

    if (json.length === 4) {
      bbox.west = json[0];
      bbox.south = json[1];
      bbox.east = json[2];
      bbox.north = json[3];
    } else if (json.length === 6) {
      bbox.west = json[0];
      bbox.south = json[1];
      bbox.southwestAltitude = json[2];
      bbox.east = json[3];
      bbox.north = json[4];
      bbox.northeastAltitude = json[5];
    }

    return bbox;
  }

  /**
   * Define a new instance of this class by passing in four coordinates in the same order they would appear in the serialized GeoJson form.
   *
   * @static
   * @param {number} west longitude
   * @param {number} south latitude
   * @param {number} east longitude
   * @param {number} north latitude
   * @param {number} [southwestAltitude] meters
   * @param {number} [northeastAltitude] meters
   * @return {*}  {BoundingBox}
   * @memberof BoundingBox
   */
  static fromLngLats(
    west: number, south: number, east: number, north: number,
    southwestAltitude?: number, northeastAltitude?: number
  ): BoundingBox {
    const bbox = new BoundingBox();

    bbox.east = east;
    bbox.north = north;
    bbox.west = west;
    bbox.south = south;

    if (southwestAltitude && northeastAltitude) {
      bbox.southwestAltitude = southwestAltitude;
      bbox.northeastAltitude = northeastAltitude;
    } else if (southwestAltitude) {
      bbox.southwestAltitude = southwestAltitude;
      bbox.northeastAltitude = southwestAltitude;
    } else if (northeastAltitude) {
      bbox.southwestAltitude = northeastAltitude;
      bbox.northeastAltitude = northeastAltitude;
    }

    return bbox;
  }

  static fromPosition(position: Position, bufferDegree: number): BoundingBox {
    const bbox = new BoundingBox();

    bbox.east = position[0] + bufferDegree;
    bbox.north = position[1] + bufferDegree;
    bbox.west = position[0] - bufferDegree;
    bbox.south = position[1] - bufferDegree;

    if (position[2]) {
      bbox.southwestAltitude = position[2];
      bbox.northeastAltitude = position[2];
    }

    return bbox;
  }

  static fromCornerPositions(southwest: Position, northeast: Position): BoundingBox {
    const bbox = new BoundingBox();

    bbox.east = northeast[0];
    bbox.north = northeast[1];
    bbox.west = southwest[0];
    bbox.south = southwest[1];

    if (southwest[2] && northeast[2]) {
      bbox.southwestAltitude = southwest[2];
      bbox.northeastAltitude = northeast[2];
    } else if (southwest[2]) {
      bbox.southwestAltitude = southwest[2];
      bbox.northeastAltitude = southwest[2];
    } else if (northeast[2]) {
      bbox.southwestAltitude = northeast[2];
      bbox.northeastAltitude = northeast[2];
    }

    return bbox;
  }

  static fromPositions(positions: Position[]): BoundingBox {
    let minLat = Infinity;
    let minLong = Infinity;
    let maxLat = -Infinity;
    let maxLong = -Infinity;
    let minAltitude = Infinity;
    let maxAltitude = -Infinity;

    function setBounds(position: Position) {
      minLat = Math.min(minLat, position[1]);
      minLong = Math.min(minLong, position[0]);

      maxLat = Math.max(maxLat, position[1]);
      maxLong = Math.max(maxLong, position[0]);

      if (position[2]) {
        minAltitude = Math.min(minAltitude, position[2]);
        maxAltitude = Math.max(maxAltitude, position[2]);
      }
    }

    function getArrayDepth(value) {
      return Array.isArray(value) ?
        1 + Math.max(0, ...value.map(getArrayDepth)) :
        0;
    }

    const positionsFlat = positions.flat(getArrayDepth(positions) - 2) as Position[];
    positionsFlat.forEach((position) => setBounds(position));

    const bbox = new BoundingBox();

    bbox.east = maxLong;
    bbox.north = maxLat;
    bbox.west = minLong;
    bbox.south = minLat;

    if (minAltitude !== Infinity) {
      bbox.southwestAltitude = minAltitude;
      bbox.northeastAltitude = maxAltitude;
    }

    return bbox;
  }

  static fromPoint(point: PointProperties, bufferDegree: number): BoundingBox {
    const bbox = new BoundingBox();

    bbox.east = point.longitude + bufferDegree;
    bbox.north = point.latitude + bufferDegree;
    bbox.west = point.longitude - bufferDegree;
    bbox.south = point.latitude - bufferDegree;

    if (point.altitude) {
      bbox.southwestAltitude = point.altitude;
      bbox.northeastAltitude = point.altitude;
    }

    return bbox;
  }

  /**
   * Define a new instance of this class by passing in two `Point`s, representing both the southwest and northwest corners of the bounding box.
   *
   * @static
   * @param {Point} southwest
   * @param {Point} northeast
   * @return {*}  {BoundingBox}
   * @memberof BoundingBox
   */
  static fromCornerPoints(southwest: IPoint, northeast: IPoint): BoundingBox {
    const bbox = new BoundingBox();

    bbox.east = northeast.longitude;
    bbox.north = northeast.latitude;
    bbox.west = southwest.longitude;
    bbox.south = southwest.latitude;

    if (southwest.altitude && northeast.altitude) {
      bbox.southwestAltitude = southwest.altitude;
      bbox.northeastAltitude = northeast.altitude;
    } else if (southwest.altitude) {
      bbox.southwestAltitude = southwest.altitude;
      bbox.northeastAltitude = southwest.altitude;
    } else if (northeast.altitude) {
      bbox.southwestAltitude = northeast.altitude;
      bbox.northeastAltitude = northeast.altitude;
    }

    return bbox;
  }

  static fromPoints(points: IPoint[]): BoundingBox {
    let minLat = Infinity;
    let minLong = Infinity;
    let maxLat = -Infinity;
    let maxLong = -Infinity;
    let minAltitude = Infinity;
    let maxAltitude = -Infinity;

    function setBounds(point: IPoint) {
      minLat = Math.min(minLat, point.latitude);
      minLong = Math.min(minLong, point.longitude);

      maxLat = Math.max(maxLat, point.latitude);
      maxLong = Math.max(maxLong, point.longitude);

      if (point.altitude) {
        minAltitude = Math.min(minAltitude, point.altitude);
        maxAltitude = Math.max(maxAltitude, point.altitude);
      }
    }

    const pointsFlat = points.flat(Infinity);
    pointsFlat.forEach((point) => setBounds(point));

    const bbox = new BoundingBox();

    bbox.east = maxLong;
    bbox.north = maxLat;
    bbox.west = minLong;
    bbox.south = minLat;

    if (minAltitude !== Infinity) {
      bbox.southwestAltitude = minAltitude;
      bbox.northeastAltitude = maxAltitude;
    }

    return bbox;
  }
}