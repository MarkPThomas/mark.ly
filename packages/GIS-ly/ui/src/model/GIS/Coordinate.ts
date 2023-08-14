import { Position } from "geojson";
import { LatLng } from "leaflet";

export interface ICoordinate extends LatLng {

};

export type CoordinateIndex = {
  coordIndex: number,
  segmentIndex?: number,
  polygonIndex?: number,
};

export class Coordinate extends LatLng {
  timeStamp?: string;
  /**
   * Altitude [meters] obtained from an external source for the location, such as DEM/LIDAR data.
   *
   * @type {number}
   * @memberof Coordinate
   */
  altExt?: number;
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
    angularSpeed: number;
    elevationRate?: number;
  }

  /**
   * Index location(s) of the lat/lng within a possible nesting of polygons->segments->coordinates found in a GeoJSON object.
   *
   * @type {CoordinateIndex}
   * @memberof Coordinate
   */
  indices?: CoordinateIndex;

  // TODO: Rename to: fromPosition
  static getCoordinate({ position, indices, timeStamp }: CoordinateProperties) {
    const coordinate = new Coordinate(position[1], position[0], position[2]);

    if (timeStamp) {
      coordinate.timeStamp = timeStamp;
    }

    if (indices) {
      coordinate.indices = indices;
    }

    return coordinate;
  }

  toPosition(): Position {
    const position = [this.lng, this.lat];
    if (this.alt) {
      position.push(this.alt);
    }

    return position;
  }
}

// TODO: rename to: PositionProperties
type CoordinateProperties = {
  position: Position;
  indices?: CoordinateIndex;
  timeStamp?: string;
}


export type Coordinates = Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];
export type ICoordinates = ICoordinate | ICoordinate[] | ICoordinate[][] | ICoordinate[][][];