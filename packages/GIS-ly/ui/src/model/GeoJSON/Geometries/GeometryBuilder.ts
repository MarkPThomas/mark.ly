import { Geometry as SerialGeometry } from "geojson";

import { GeoJsonTypes } from "../enums";
import { GeoJson, GeoJsonProperties } from "../GeoJson";

import {
  GeometryCollection,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Polygon,
  LineString,
  Point
} from ".";
import { GeometryType, IGeometry } from "./Geometry";
import { CoordinateContainerBuilder } from "./CoordinateContainerBuilder";

import { Feature } from "../Feature";
import { FeatureCollection } from "../FeatureCollection";

export class GeometryBuilder {
  /* istanbul ignore next */
  private constructor() { };

  static fromJson(json: SerialGeometry): IGeometry<GeoJsonProperties, SerialGeometry> {
    switch (json.type) {
      case GeoJsonTypes.GeometryCollection:
        return GeometryCollection.fromJson(json);
      default:
        return CoordinateContainerBuilder.fromJson(json);
    }
  }

  static getCoordinates<TItem extends GeoJson>(item: TItem | IGeometry<GeometryType, SerialGeometry>): Point[] {
    switch (item.type) {
      case GeoJsonTypes.Point:
        return [(item as unknown as Point).points];
      case GeoJsonTypes.MultiPoint:
        return (item as unknown as MultiPoint).points.flat(Infinity);
      case GeoJsonTypes.LineString:
        return (item as unknown as LineString).points.flat(Infinity);
      case GeoJsonTypes.MultiLineString:
        return (item as unknown as MultiLineString).points.flat(Infinity) as Point[];
      case GeoJsonTypes.Polygon:
        return (item as unknown as Polygon).points.flat(Infinity) as Point[];
      case GeoJsonTypes.MultiPolygon:
        return (item as unknown as MultiPolygon).points.flat(Infinity) as Point[];
      case GeoJsonTypes.GeometryCollection:
        const geometries = (item as unknown as GeometryCollection).geometries.flat(Infinity);
        const points = geometries.map((geometry) => GeometryBuilder.getCoordinates(geometry));

        return points.flat(Infinity) as Point[];
      case GeoJsonTypes.Feature:
        return GeometryBuilder.getCoordinates((item as unknown as Feature).geometry);
      case GeoJsonTypes.FeatureCollection:
        return (item as unknown as FeatureCollection).features.map(
          (feature) => GeometryBuilder.getCoordinates(feature)
        ).flat(Infinity) as Point[];
      default:
        return [];
    }
  }
}
