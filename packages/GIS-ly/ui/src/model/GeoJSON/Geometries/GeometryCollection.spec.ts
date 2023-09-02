import {
  BBox as SerialBBox,
  Point as SerialPoint,
  LineString as SerialLineString,
  GeometryCollection as SerialGeometryCollection
} from 'geojson';

import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { Position } from '../types';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { LineString } from './LineString';
import { GeometryCollection } from './GeometryCollection';
import { GeometryBuilder } from './GeometryBuilder';
import { GeometryType } from './Geometry';
import { MultiPoint } from './MultiPoint';

describe('##GeometryCollection', () => {
  let pointBBoxJsonProvided: SerialBBox;
  let pointBBoxJsonActual: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;

  let lineStringBBoxJsonProvided: SerialBBox;
  let lineStringBBoxJsonActual: SerialBBox;
  let lineStringJson: SerialLineString;
  let lineStringPoints: Point[];
  let lineStringPositions: Position[];

  let geometryCollectionBBoxJsonProvided: SerialBBox;
  let geometryCollectionBBoxJsonActual: SerialBBox;
  let geometryCollectionJson: SerialGeometryCollection;

  beforeEach(() => {
    geometryCollectionBBoxJsonProvided = [4, 3, 2, 1];
    geometryCollectionBBoxJsonActual = [-1, -2, 3, 4];

    pointBBoxJsonProvided = [1, 2, 3, 4];
    pointBBoxJsonActual = [-1.5, -2.5, -0.5, -1.5];
    pointPosition = [-1, -2];
    pointJson = {
      type: 'Point',
      coordinates: pointPosition
    };

    lineStringBBoxJsonProvided = [2, 3, 4, 5];
    lineStringBBoxJsonActual = [1, 2, 3, 4];
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
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make a collection of a Point object and LineString object from the associated GeoJSON object', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(geometryCollection.type).toEqual(GeoJsonGeometryTypes.GeometryCollection);

        const geometriesResult = geometryCollection.geometries;
        expect(geometriesResult.length).toEqual(2);
        expect(geometriesResult[0].type).toEqual(GeoJsonGeometryTypes.Point);
        expect(geometriesResult[1].type).toEqual(GeoJsonGeometryTypes.LineString);

        // Optional properties & Defaults
        expect(geometryCollection.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        geometryCollectionJson.bbox = geometryCollectionBBoxJsonProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should create an object with an empty list if no geometries are provided', () => {
        geometryCollectionJson.geometries = [];
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(geometryCollection.type).toEqual(GeoJsonGeometryTypes.GeometryCollection);
        expect(geometryCollection.hasBBox()).toBeFalsy();

        const geometriesResult = geometryCollection.geometries;
        expect(geometriesResult.length).toEqual(0);
      });

      it('should throw an InvalidGeometryException error if the provided GeoJSON object contains a nested GeometryCollection', () => {
        geometryCollectionJson.geometries = [geometryCollectionJson];

        expect(() => GeometryCollection.fromJson(geometryCollectionJson)).toThrow();
      });
    });

    describe('#fromGeometries', () => {
      it('should make a collection of a Point object and LineString object from the provided Geometry objects', () => {
        const geometryCollectionExpected = GeometryCollection.fromJson(geometryCollectionJson);

        const geometries = [
          Point.fromJson(pointJson),
          LineString.fromJson(lineStringJson)
        ];

        const geometryCollection = GeometryCollection.fromGeometries(geometries);

        expect(geometryCollection).toEqual(geometryCollectionExpected);
      });

      it('should make an object from the provided Geometry objects with a bounding box specified', () => {
        geometryCollectionJson.bbox = geometryCollectionBBoxJsonProvided;
        const geometryCollectionExpected = GeometryCollection.fromJson(geometryCollectionJson);

        const geometries = [
          Point.fromJson(pointJson),
          LineString.fromJson(lineStringJson)
        ];

        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);

        const geometryCollection = GeometryCollection.fromGeometries(geometries, boundingBox);

        expect(geometryCollection).toEqual(geometryCollectionExpected);

        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should create an object with an empty list if no geometries are provided', () => {
        geometryCollectionJson.geometries = [];
        const geometryCollectionExpected = GeometryCollection.fromJson(geometryCollectionJson);

        const geometryCollection = GeometryCollection.fromGeometries([]);

        expect(geometryCollection).toEqual(geometryCollectionExpected);

        expect(geometryCollection.hasBBox()).toBeFalsy();

        const geometriesResult = geometryCollection.geometries;
        expect(geometriesResult.length).toEqual(0);
      });

      it('should throw an InvalidGeometryException error if the geometries provided contain a nested GeometryCollection', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(() => GeometryCollection.fromGeometries([geometryCollection])).toThrow();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson();

        expect(result).toEqual(geometryCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        geometryCollectionJson.bbox = geometryCollectionBBoxJsonProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson();

        expect(result).toEqual(geometryCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson(BBoxState.Include);

        expect(result).not.toEqual(geometryCollectionJson);

        geometryCollectionJson.bbox = geometryCollectionBBoxJsonActual;
        geometryCollectionJson.geometries[0].bbox = pointBBoxJsonActual;
        geometryCollectionJson.geometries[1].bbox = lineStringBBoxJsonActual;

        expect(result).toEqual(geometryCollectionJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        geometryCollectionJson.bbox = geometryCollectionBBoxJsonProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(geometryCollectionJson);

        delete geometryCollectionJson.bbox;

        expect(result).toEqual(geometryCollectionJson);
      });
    });

    describe('#getGeometriesByType', () => {
      let geometries: GeometryType[];
      let geometryCollection: GeometryCollection;
      beforeEach(() => {
        const geometry1 = GeometryBuilder.fromJson(pointJson) as GeometryType;
        const geometry2 = GeometryBuilder.fromJson(lineStringJson) as GeometryType;
        geometries = [geometry1, geometry2];

        geometryCollection = GeometryCollection.fromGeometries(geometries);
      });

      it('should return an empty array if there are no geometries of the specified type', () => {
        const multiPoint = geometryCollection.getGeometriesByType(GeoJsonGeometryTypes.MultiPoint) as MultiPoint[];

        expect(multiPoint.length).toEqual(0);
      });

      it('should return an array of Geometries of the specified type', () => {
        const lineStrings = geometryCollection.getGeometriesByType(GeoJsonGeometryTypes.LineString) as LineString[];

        expect(lineStrings.length).toEqual(1);
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

        lineStringPositions.push([9, 10]);
        lineStringJson = {
          type: 'LineString',
          coordinates: lineStringPositions
        };

        geometryCollectionJson.geometries = [pointJson, lineStringJson];
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
        geometryCollectionJson.bbox = geometryCollectionBBoxJsonProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        const result = geometryCollection.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        geometryCollectionJson.bbox = geometryCollectionBBoxJsonProvided;
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);
        expect(geometryCollection.hasBBox()).toBeTruthy();

        const bboxExpected = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);

        const result = geometryCollection.bbox();
        expect(geometryCollection.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(geometryCollectionBBoxJsonActual);
        const geometryCollection = GeometryCollection.fromJson(geometryCollectionJson);

        expect(geometryCollection.hasBBox()).toBeFalsy();

        const result = geometryCollection.bbox();
        expect(geometryCollection.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });

    describe('#update', () => {

    });

    describe('#save', () => {

    });
  });

  describe('Collection Methods', () => {
    describe('#add', () => {
      it('should add an item to the collection', () => {
        const geometryCollection = GeometryCollection.fromGeometries([]);
        const geometry = LineString.fromJson(lineStringJson);

        expect(geometryCollection.geometries.length).toEqual(0);

        const result = geometryCollection.add(geometry);
        expect(result).toEqual(1);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometry);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometryCollection = GeometryCollection.fromGeometries([], boundingBox);
        const geometry = LineString.fromJson(lineStringJson);

        expect(geometryCollection.hasBBox()).toBeTruthy();

        geometryCollection.add(geometry);

        expect(geometryCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(lineStringBBoxJsonActual);

        const geometryCollection = GeometryCollection.fromGeometries([], boundingBoxProvided);
        const geometry = LineString.fromJson(lineStringJson);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxProvided);

        geometryCollection.add(geometry, true);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxActual);
      });

      it('should throw an InvalidGeometryException error if the provided object is a GeometryCollection', () => {
        const geometryCollection = GeometryCollection.fromGeometries([]);
        const invalidGeometry = GeometryCollection.fromJson(geometryCollectionJson);

        expect(() => geometryCollection.add(invalidGeometry)).toThrowError();
      });
    });

    describe('#addItems', () => {
      it('should do nothing if an empty array is provided', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometry = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry], boundingBox);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometry);
        expect(geometryCollection.hasBBox()).toBeTruthy();

        const result = geometryCollection.addItems([]);
        expect(result).toEqual(1);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometry);
        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should add all items to the collection', () => {
        const geometryCollection = GeometryCollection.fromGeometries([]);

        expect(geometryCollection.geometries.length).toEqual(0);

        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);

        const result = geometryCollection.addItems([geometry1, geometry2]);
        expect(result).toEqual(2);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometryCollection = GeometryCollection.fromGeometries([], boundingBox);

        expect(geometryCollection.hasBBox()).toBeTruthy();

        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);

        geometryCollection.addItems([geometry1, geometry2]);

        expect(geometryCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(geometryCollectionBBoxJsonActual);

        const geometryCollection = GeometryCollection.fromGeometries([], boundingBoxProvided);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxProvided);

        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);

        geometryCollection.addItems([geometry1, geometry2], true);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxActual);
      });

      it('should throw an InvalidGeometryException error if any provided object is a GeometryCollection', () => {
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2]);

        const invalidGeometry = GeometryCollection.fromJson(geometryCollectionJson);

        expect(() => geometryCollection.add(invalidGeometry)).toThrowError();
      });
    });

    describe('#indexOf', () => {
      it('should return -1 if the item is not found', () => {
        const geometryMissing = Point.fromJson(pointJson);
        const geometryPresent = LineString.fromJson(lineStringJson);

        const geometryCollection = GeometryCollection.fromGeometries([geometryPresent]);

        const result = geometryCollection.indexOf(geometryMissing);

        expect(result).toEqual(-1);
      });

      it('should return the index of the present item sought', () => {
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);

        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2]);

        const result = geometryCollection.indexOf(geometry2);

        expect(result).toEqual(1);
      });
    });

    describe('#remove', () => {
      it('should do nothing if the item to be removed is not in the collection', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometryMissing = Point.fromJson(pointJson);
        const geometryPresent = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometryPresent], boundingBox);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometryPresent);
        expect(geometryCollection.hasBBox()).toBeTruthy();

        const result = geometryCollection.remove(geometryMissing);

        expect(result).toBeUndefined();

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometryPresent);
        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should remove an item from the collection', () => {
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2]);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);

        const result = geometryCollection.remove(geometry2);

        expect(result).toEqual(geometry2);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2], boundingBox);

        expect(geometryCollection.hasBBox()).toBeTruthy();

        geometryCollection.remove(geometry2);

        expect(geometryCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(lineStringBBoxJsonActual);
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2], boundingBoxProvided);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxProvided);

        geometryCollection.remove(geometry1, true);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxActual);
      });
    });

    describe('#removeByIndex', () => {
      it('should do nothing if the index is negative', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometryPresent = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometryPresent], boundingBox);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometryPresent);
        expect(geometryCollection.hasBBox()).toBeTruthy();

        const result = geometryCollection.removeByIndex(-1);

        expect(result).toBeUndefined();

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometryPresent);
        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should do nothing if the index greater than the max index', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometryPresent = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometryPresent], boundingBox);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometryPresent);
        expect(geometryCollection.hasBBox()).toBeTruthy();

        const result = geometryCollection.removeByIndex(geometryCollection.geometries.length);

        expect(result).toBeUndefined();

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometryPresent);
        expect(geometryCollection.hasBBox()).toBeTruthy();
      });

      it('should remove an item from the collection', () => {
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2]);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);

        const result = geometryCollection.removeByIndex(1);

        expect(result).toEqual(geometry2);

        expect(geometryCollection.geometries.length).toEqual(1);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2], boundingBox);

        expect(geometryCollection.hasBBox()).toBeTruthy();

        geometryCollection.removeByIndex(1);

        expect(geometryCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(geometryCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(lineStringBBoxJsonActual);
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2], boundingBoxProvided);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxProvided);

        geometryCollection.removeByIndex(0, true);

        expect(geometryCollection.hasBBox()).toBeTruthy();
        expect(geometryCollection.bbox()).toEqual(boundingBoxActual);
      });
    });

    describe('#getItems', () => {
      it('should return all of the Geometries in the collection', () => {
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2]);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);

        const result = geometryCollection.getItems();

        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(geometry1);
        expect(result[1]).toEqual(geometry2);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);
      });
    });

    describe('#getByIndex', () => {
      it('should return undefined if the index is negative', () => {
        const geometryPresent = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometryPresent]);

        const result = geometryCollection.getByIndex(-1);

        expect(result).toBeUndefined();
      });

      it('should return undefined if the index is greater than the max index', () => {
        const geometryPresent = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometryPresent]);

        const result = geometryCollection.getByIndex(geometryCollection.geometries.length);

        expect(result).toBeUndefined();
      });

      it('should return the item at the specified index', () => {
        const geometry1 = Point.fromJson(pointJson);
        const geometry2 = LineString.fromJson(lineStringJson);
        const geometryCollection = GeometryCollection.fromGeometries([geometry1, geometry2]);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);

        const result = geometryCollection.getByIndex(1);

        expect(result).toEqual(geometry2);

        expect(geometryCollection.geometries.length).toEqual(2);
        expect(geometryCollection.geometries[0]).toEqual(geometry1);
        expect(geometryCollection.geometries[1]).toEqual(geometry2);
      });
    });
  });
});