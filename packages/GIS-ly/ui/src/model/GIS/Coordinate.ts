import { Position } from "geojson";
import { LatLng } from "leaflet";
// import { ISegment } from "../Geometry/Segment";

export interface ICoordinate extends LatLng {

};

type CoordinateIndex = {
  coordIndex: number,
  segmentIndex?: number,
  polygonIndex?: number,
};

export class Coordinate extends LatLng {
  timeStamp?: string;
  speedAvg?: number;
  path?: {
    rotation: number;
    angularSpeed: number;
  }
  indices?: CoordinateIndex;
  // pathProperties?: {
  //   segmentProperties: {
  //     prev: ISegment | null;
  //     next: ISegment | null;
  //   }
  // }

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