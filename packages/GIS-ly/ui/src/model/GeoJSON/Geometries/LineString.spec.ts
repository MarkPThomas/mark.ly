import {
  BBox as SerialBBox,
  LineString as SerialLineString
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { MultiPoint } from './MultiPoint';
import { LineString } from './LineString';

describe('##LineString', () => {
  let lineStringBBoxJsonProvided: SerialBBox;
  let lineStringBBoxJsonActual: SerialBBox;
  let lineStringJson: SerialLineString;
  let lineStringPoints: Point[];
  let lineStringPositions: Position[];
  let lineStringBBox: BoundingBox;

  beforeEach(() => {
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

    lineStringBBox = BoundingBox.fromPositions(lineStringPositions);
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const lineString = LineString.fromJson(lineStringJson);

        expect(lineString.type).toEqual(GeoJsonGeometryTypes.LineString);
        expect(lineString.toPositions()).toEqual(lineStringPositions);
        expect(lineString.points).toEqual(lineStringPoints);

        // Optional properties & Defaults
        expect(lineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        lineStringJson.bbox = lineStringBBoxJsonProvided;
        const lineString = LineString.fromJson(lineStringJson);

        expect(lineString.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should make an object from the associated Positions', () => {
        const lineString = LineString.fromPositions(lineStringPositions);

        expect(lineString.type).toEqual(GeoJsonGeometryTypes.LineString);
        expect(lineString.toPositions()).toEqual(lineStringPositions);
        expect(lineString.points).toEqual(lineStringPoints);

        // Optional properties & Defaults
        expect(lineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Positions with a bounding box specified', () => {
        const lineString = LineString.fromPositions(lineStringPositions, lineStringBBox);

        expect(lineString.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPoints', () => {
      it('should make an object from the associated Points', () => {
        const lineString = LineString.fromPoints(lineStringPoints);

        expect(lineString.type).toEqual(GeoJsonGeometryTypes.LineString);
        expect(lineString.toPositions()).toEqual(lineStringPositions);
        expect(lineString.points).toEqual(lineStringPoints);

        // Optional properties & Defaults
        expect(lineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const lineString = LineString.fromPoints(lineStringPoints, lineStringBBox);

        expect(lineString.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromMultiPoint', () => {
      let multiPoint: MultiPoint;
      beforeEach(() => {
        multiPoint = MultiPoint.fromPositions(lineStringPositions);
      })
      it('should make an object from the associated Points', () => {
        const expectedLineString = LineString.fromJson(lineStringJson);

        const lineString = LineString.fromMultiPoint(multiPoint);

        expect(lineString).toEqual(expectedLineString);
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const lineString = LineString.fromMultiPoint(multiPoint, lineStringBBox);

        expect(lineString.hasBBox()).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson();

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        lineStringJson.bbox = lineStringBBoxJsonProvided;
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson();

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson(BBoxState.Include);

        expect(result).not.toEqual(lineStringJson);

        lineStringJson.bbox = lineStringBBoxJsonActual;

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        lineStringJson.bbox = lineStringBBoxJsonProvided;
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(lineStringJson);

        delete lineStringJson.bbox;

        expect(result).toEqual(lineStringJson);
      });
    });

    describe('#toPositions', () => {
      it('should return a Positions array representing the Points forming the Geometry', () => {
        const multiPoint = LineString.fromJson(lineStringJson);

        const result = multiPoint.toPositions();

        expect(result).toEqual(lineStringPositions);
      });
    });

    describe('#points', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        const multiPoint = LineString.fromJson(lineStringJson);

        const result = multiPoint.points;

        expect(result).toEqual(lineStringPoints);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const lineString = LineString.fromJson(lineStringJson);

        const lineStringClone = lineString.clone();

        expect(lineStringClone).toEqual(lineString);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const lineString = LineString.fromJson(lineStringJson);
        const lineStringSame = LineString.fromJson(lineStringJson);

        const result = lineString.equals(lineStringSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const lineString = LineString.fromJson(lineStringJson);

        lineStringJson.coordinates = [[1, 2], [5, 6]];
        const lineStringDiff = LineString.fromJson(lineStringJson);

        const result = lineString.equals(lineStringDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        lineStringJson.bbox = lineStringBBoxJsonProvided;
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(lineStringBBoxJsonProvided);

        lineStringJson.bbox = lineStringBBoxJsonProvided;
        const lineString = LineString.fromJson(lineStringJson);

        expect(lineString.hasBBox()).toBeTruthy();

        const result = lineString.bbox();
        expect(lineString.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(lineStringBBoxJsonActual);
        const lineString = LineString.fromJson(lineStringJson);

        expect(lineString.hasBBox()).toBeFalsy();

        const result = lineString.bbox();
        expect(lineString.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });

    describe('#save', () => {

    });
  });
});