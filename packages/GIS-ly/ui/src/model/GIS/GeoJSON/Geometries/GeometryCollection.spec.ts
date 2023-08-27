import {
  BBox as SerialBBox,
  Point as SerialPoint,
  LineString as SerialLineString
} from 'geojson';

import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { Position } from '../types';

import { GeometryCollection } from './GeometryCollection';

describe('##GeometryCollection', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make a collection of a Point object and LineString object from the associated GeoJSON object', () => {
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

        const geometriesJson = [pointJson, lineStringJson];

        const geometryCollection = GeometryCollection.fromJson(geometriesJson);

        expect(geometryCollection.type).toEqual(GeoJsonGeometryTypes.GeometryCollection);

        const geometriesResult = geometryCollection.geometries;
        expect(geometriesResult.length).toEqual(2);
        expect(geometriesResult[0].type).toEqual(GeoJsonGeometryTypes.Point);
        expect(geometriesResult[1].type).toEqual(GeoJsonGeometryTypes.LineString);

        // Optional properties & Defaults
        expect(geometryCollection.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
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

        const geometriesJson = [pointJson, lineStringJson];

        const geometryCollection = GeometryCollection.fromJson(geometriesJson, bbox);

        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should create an object with an empty list if no geometries are provided', () => {
        const geometryCollection = GeometryCollection.fromJson([]);

        expect(geometryCollection.type).toEqual(GeoJsonGeometryTypes.GeometryCollection);
        expect(geometryCollection.hasBBox()).toBeFalsy();

        const geometriesResult = geometryCollection.geometries;
        expect(geometriesResult.length).toEqual(0);
      });

      it('should throw an InvalidGeometryException error if null or undefined are provided', () => {
        expect(() => GeometryCollection.fromJson(null)).toThrow();
        expect(() => GeometryCollection.fromJson(undefined)).toThrow();
      });
    });

    describe('#fromLngLat', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPosition', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromOptions', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });


  describe('Main Interface Tests', () => {
    describe('#clone', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#equals', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });


  describe('Instance Tests', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
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

        const geometriesJson = [pointJson, lineStringJson];
        const geometryCollection = GeometryCollection.fromJson(geometriesJson);

        const result = geometryCollection.toJson();

        expect(result).toEqual(geometryCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[][][] = [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
        ];
        const geometryCollectionJson: SerialGeometryCollection = {
          type: 'GeometryCollection',
          coordinates: position,
          bbox: bboxJson
        };
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson();

        expect(result).toEqual(geometryCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const position: Position[][][] = [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
        ];
        const geometryCollectionJson: SerialGeometryCollection = {
          type: 'GeometryCollection',
          coordinates: position
        };
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson(BBoxState.Include);

        expect(result).not.toEqual(geometryCollectionJson);

        const bboxJson: SerialBBox = [-1, -1, 6, 6];
        geometryCollectionJson.bbox = bboxJson;

        expect(result).toEqual(geometryCollectionJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[][][] = [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
        ];
        const geometryCollectionJson: SerialGeometryCollection = {
          type: 'GeometryCollection',
          coordinates: position,
          bbox: bboxJson
        };
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(geometryCollectionJson);

        delete geometryCollectionJson.bbox;

        expect(result).toEqual(geometryCollectionJson);
      });
    });

  });
});