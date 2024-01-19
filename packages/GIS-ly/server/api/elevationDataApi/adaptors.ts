import { CartesianCoordinate } from '../../../../common/utils/math/Coordinates/CartesianCoordinate';
import { PointIntersection } from '../../../../common/utils/geometry/Intersections/PointIntersection';

import { ICoordinate } from "./model";
import { IBoundingBox } from "./model/IBoundingBox";
import { Position } from 'geojson';

export interface IGeometry {
  isIn(boundingBox: IBoundingBox, region: Position[]): boolean;
}

export class Geometry implements IGeometry {
  isIn(boundingBox: IBoundingBox, region: Position[]): boolean {
    const shape = Geometry.shapeConversion(region);

    const swCoord = new CartesianCoordinate(boundingBox.west, boundingBox.south);
    if (!PointIntersection.IsWithinShape(swCoord, shape)) {
      return false;
    }

    const seCoord = new CartesianCoordinate(boundingBox.east, boundingBox.south);
    if (!PointIntersection.IsWithinShape(seCoord, shape)) {
      return false;
    }

    const neCoord = new CartesianCoordinate(boundingBox.east, boundingBox.north);
    if (!PointIntersection.IsWithinShape(neCoord, shape)) {
      return false;
    }

    const nwCoord = new CartesianCoordinate(boundingBox.west, boundingBox.north);
    return PointIntersection.IsWithinShape(nwCoord, shape);
  }

  private static shapeConversion(shape: Position[]): CartesianCoordinate[] {
    const convertedShape: CartesianCoordinate[] = [];

    shape.forEach((coord) => {
      convertedShape.push(this.coordinateConversion({ lat: coord[1], lng: coord[0] }));
    })

    return convertedShape;
  }

  private static coordinateConversion(coordinate: ICoordinate): CartesianCoordinate {
    return new CartesianCoordinate(coordinate.lat, coordinate.lng);
  }
}

