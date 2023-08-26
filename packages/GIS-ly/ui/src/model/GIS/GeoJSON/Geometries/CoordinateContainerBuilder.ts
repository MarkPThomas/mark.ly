import { Geometry as SerialGeometry } from "geojson";

import { GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';
import { GeoJsonProperties } from "../GeoJson";

import { IGeometry } from "./Geometry";
import { Point } from './Point';
import { MultiPoint } from './MultiPoint';
import { LineString } from './LineString';
import { MultiLineString } from './MultiLineString';
import { Polygon } from './Polygon';
import { MultiPolygon } from './MultiPolygon';

export class CoordinateContainerBuilder {
  /* istanbul ignore next */
  private constructor() { };

  static fromJson(json: SerialGeometry): IGeometry<GeoJsonProperties, SerialGeometry> {
    switch (json?.type) {
      case GeoJsonTypes.Point:
        return Point.fromJson(json);
      case GeoJsonTypes.MultiPoint:
        return MultiPoint.fromJson(json);
      case GeoJsonTypes.LineString:
        return LineString.fromJson(json);
      case GeoJsonTypes.MultiLineString:
        return MultiLineString.fromJson(json);
      case GeoJsonTypes.Polygon:
        return Polygon.fromJson(json);
      case GeoJsonTypes.MultiPolygon:
        return MultiPolygon.fromJson(json);
      default:
        throw new InvalidGeometryException(
          `${InvalidGeometryException.DEFAULT_MESSAGE}
          \n Type: ${json?.type}
          \n ${JSON.stringify(json)}`);
    }
  }
}