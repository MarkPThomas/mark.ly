import {
  BBox as SerialBBox,
  Point as SerialPoint,
  LineString as SerialLineString,
  GeometryCollection as SerialGeometryCollection
} from 'geojson';

import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { Position } from '../types';

import { Point } from './Point';
import { GeometryCollection } from './GeometryCollection';
import { BoundingBox } from '../BoundingBox';

describe('##GeometryCollection', () => {
  let pointBBoxJson: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;

  let lineStringBBoxJson: SerialBBox;
  let lineStringJson: SerialLineString;
  let lineStringPoints: Point[];
  let lineStringPositions: Position[];

  let geometryCollectionBBoxProvided: SerialBBox;
  let geometryCollectionBBoxActual: SerialBBox;
  let geometryCollectionJson: SerialGeometryCollection;
  // let geometryCollectionPoints: Point[][][];
  // let geometryCollectionPositions: Position[][][];

  beforeEach(() => {
    pointBBoxJson = [1, 2, 3, 4];
    pointPosition = [1, 2];
    pointJson = {
      type: 'Point',
      coordinates: pointPosition
    };

    lineStringBBoxJson = [1, 2, 3, 4];
    lineStringPositions = [[1, 2], [3, 4]];
    lineStringJson = {
      type: 'LineString',
      coordinates: lineStringPositions
    };

    lineStringPoints = [
      Point.fromPosition(lineStringPositions[0]),
      Point.fromPosition(lineStringPositions[1])
    ];

    geometryCollectionJson = {
      type: 'GeometryCollection',
      geometries: [pointJson, lineStringJson]
    }
    // geometryCollectionBBoxProvided = [];
    // geometryCollectionBBoxActual = [];
  });

  describe('Creation', () => {
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

  describe('Exporting', () => {
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

    describe('#toPositions', () => {
      it('should return a Positions array representing the Points forming the Geometry', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toPositions();

        expect(result).toEqual(multiPointPositions);
      });
    });

    describe('#points', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.points;

        expect(result).toEqual(multiPointPoints);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const pointClone = geometryCollection.clone();

        expect(pointClone).toEqual(geometryCollection);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);
        const geometryCollectionSame = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.equals(geometryCollectionSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        geometryCollectionJson.geometries = [3, 4];
        const geometryCollectionDiff = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.equals(geometryCollectionDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        geometryCollectionJson.bbox = geometryCollectionBBoxProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(geometryCollectionBBoxProvided);

        geometryCollectionJson.bbox = geometryCollectionBBoxProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(geometryCollection.hasBBox()).toBeTruthy();

        const result = geometryCollection.bbox();
        expect(geometryCollection.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(geometryCollectionBBoxActual);
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(geometryCollection.hasBBox()).toBeFalsy();

        const result = geometryCollection.bbox();
        expect(geometryCollection.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });
  });

  describe('Collection Methods', () => {
    describe('#add', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#addItems', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#indexOf', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#remove', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#removeByIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#getItems', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#getByIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });
});