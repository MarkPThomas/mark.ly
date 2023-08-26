import {
  BBox as SerialBBox,
  Point as SerialPoint,
  MultiPoint as SerialMultiPoint,
  LineString as SerialLineString,
  GeometryCollection as SerialGeometryCollection
} from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';
import { Point } from './Point';
import { GeometryCollection } from './GeometryCollection';

import { GeometryBuilder } from './GeometryBuilder';

describe('##GeometryBuilder', () => {
  describe('#fromJson', () => {
    it('should make a GeometryCollection of a Point object and LineString object from the associated GeoJSON object', () => {
      const pointPosition: Position = [1, 2];
      const pointJson: SerialPoint = {
        type: 'Point',
        coordinates: pointPosition
      };

      const lineStringPosition: Position[] = [[1, 2], [3, 4]];
      const lineStringJson: SerialLineString = {
        type: 'LineString',
        coordinates: lineStringPosition
      };

      const geometryCollectionJson: SerialGeometryCollection = {
        type: 'GeometryCollection',
        geometries: [pointJson, lineStringJson]
      };

      const geometryCollection = GeometryBuilder.fromJson(geometryCollectionJson);

      expect(geometryCollection.type).toEqual(GeoJsonGeometryTypes.GeometryCollection);

      const geometryCollectionCast = geometryCollection as GeometryCollection;
      const geometriesResult = geometryCollectionCast.geometries;
      expect(geometriesResult.length).toEqual(2);
      expect(geometriesResult[0].type).toEqual(GeoJsonGeometryTypes.Point);
      expect(geometriesResult[1].type).toEqual(GeoJsonGeometryTypes.LineString);

      // Optional properties & Defaults
      expect(geometryCollection.hasBBox()).toBeFalsy();
    });

    it('should make a GeometryCollection from the associated GeoJSON object with a bounding box specified', () => {
      const bbox: SerialBBox = [1, 2, 3, 4];

      const pointPosition: Position = [1, 2];
      const pointJson: SerialPoint = {
        type: 'Point',
        coordinates: pointPosition
      };

      const lineStringPosition: Position[] = [[1, 2], [3, 4]];
      const lineStringJson: SerialLineString = {
        type: 'LineString',
        coordinates: lineStringPosition
      };

      const geometryCollectionJson: SerialGeometryCollection = {
        type: 'GeometryCollection',
        bbox: bbox,
        geometries: [pointJson, lineStringJson]
      };

      const geometryCollection = GeometryBuilder.fromJson(geometryCollectionJson);

      expect(geometryCollection.hasBBox()).toBeTruthy();
    });

    it('should make a Point object from the associated GeoJSON object', () => {
      const position: Position = [1, 2];

      const json: SerialPoint = {
        type: 'Point',
        coordinates: position
      };

      const point = GeometryBuilder.fromJson(json);

      expect(point.type).toEqual(GeoJsonGeometryTypes.Point);

      const pointCast = point as Point;

      expect(pointCast.latitude).toEqual(2);
      expect(pointCast.longitude).toEqual(1);
      expect(pointCast.toPositions()).toEqual(position);
      expect(pointCast.points.equals(pointCast)).toBeTruthy();

      // Optional properties & Defaults
      expect(pointCast.altitude).toBeUndefined();
      expect(pointCast.buffer).toEqual(Point.DEFAULT_BUFFER);
      expect(pointCast.hasBBox()).toBeFalsy();
    });

    it('should throw an InvalidGeometryException error if null or undefined is provided', () => {
      expect(() => GeometryBuilder.fromJson(undefined)).toThrow();
      expect(() => GeometryBuilder.fromJson(null)).toThrow();
    });
  });
});