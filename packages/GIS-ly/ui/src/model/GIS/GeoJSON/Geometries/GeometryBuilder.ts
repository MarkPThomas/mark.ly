import { Geometry as SerialGeometry } from "geojson";

import { GeoJsonTypes } from "../enums";
import { GeoJsonProperties } from "../GeoJson";

import { IGeometry } from "./Geometry";
import { GeometryCollection } from "./GeometryCollection";
import { CoordinateContainerBuilder } from "./CoordinateContainerBuilder";

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
}
