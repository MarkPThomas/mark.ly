import {
  BBox as SerialBBox,
  MultiPolygon as SerialMultiPolygon
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { MultiPolygon } from './MultiPolygon';

describe('##MultiPolygon', () => {
  let multiPolygonBBoxJson: SerialBBox;
  let multiPolygonJson: SerialMultiPolygon;
  let multiPolygonPoints: Point[][][];
  let multiPolygonPositions: Position[][][];
  let multiPolygonBBox: BoundingBox;

  beforeEach(() => {
    multiPolygonBBoxJson = [1, 2, 3, 4];
    multiPolygonPositions = [
      [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
      [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
    ];
    multiPolygonJson = {
      type: 'MultiPolygon',
      coordinates: multiPolygonPositions
    };

    multiPolygonPoints = [
      [[
        Point.fromPosition(multiPolygonPositions[0][0][0]),
        Point.fromPosition(multiPolygonPositions[0][0][1]),
        Point.fromPosition(multiPolygonPositions[0][0][2]),
        Point.fromPosition(multiPolygonPositions[0][0][3]),
        Point.fromPosition(multiPolygonPositions[0][0][4]),
      ]], [[
        Point.fromPosition(multiPolygonPositions[1][0][0]),
        Point.fromPosition(multiPolygonPositions[1][0][1]),
        Point.fromPosition(multiPolygonPositions[1][0][2]),
        Point.fromPosition(multiPolygonPositions[1][0][3]),
        Point.fromPosition(multiPolygonPositions[1][0][4]),
      ]],
    ];

    multiPolygonBBox = BoundingBox.fromPositions(multiPolygonPositions.flat(2));
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        expect(multiPolygon.type).toEqual(GeoJsonGeometryTypes.MultiPolygon);
        expect(multiPolygon.toPositions()).toEqual(multiPolygonPositions);
        expect(multiPolygon.points).toEqual(multiPolygonPoints);

        // Optional properties & Defaults
        expect(multiPolygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        multiPolygonJson.bbox = multiPolygonBBoxJson;
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        expect(multiPolygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should make an object from the associated Positions', () => {
        const multiPolygon = MultiPolygon.fromPositions(multiPolygonPositions);

        expect(multiPolygon.type).toEqual(GeoJsonGeometryTypes.MultiPolygon);
        expect(multiPolygon.toPositions()).toEqual(multiPolygonPositions);
        expect(multiPolygon.points).toEqual(multiPolygonPoints);

        // Optional properties & Defaults
        expect(multiPolygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Positions with a bounding box specified', () => {
        const multiPolygon = MultiPolygon.fromPositions(multiPolygonPositions, multiPolygonBBox);

        expect(multiPolygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPoints', () => {
      it('should make an object from the associated Points', () => {
        const multiPolygon = MultiPolygon.fromPoints(multiPolygonPoints);

        expect(multiPolygon.type).toEqual(GeoJsonGeometryTypes.MultiPolygon);
        expect(multiPolygon.toPositions()).toEqual(multiPolygonPositions);
        expect(multiPolygon.points).toEqual(multiPolygonPoints);

        // Optional properties & Defaults
        expect(multiPolygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const multiPolygon = MultiPolygon.fromPoints(multiPolygonPoints, multiPolygonBBox);

        expect(multiPolygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPolygons', () => {
      it('should make an object from the associated Polygons', () => {

      });

      it('should make an object from the associated Polygons with a bounding box specified', () => {

      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.toJson();

        expect(result).toEqual(multiPolygonJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        multiPolygonJson.bbox = multiPolygonBBoxJson;
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.toJson();

        expect(result).toEqual(multiPolygonJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.toJson(BBoxState.Include);

        expect(result).not.toEqual(multiPolygonJson);

        const bboxJson: SerialBBox = [-1, -1, 6, 6];
        multiPolygonJson.bbox = bboxJson;

        expect(result).toEqual(multiPolygonJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        multiPolygonJson.bbox = multiPolygonBBoxJson;
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(multiPolygonJson);

        delete multiPolygonJson.bbox;

        expect(result).toEqual(multiPolygonJson);
      });
    });

    describe('#toPositions', () => {
      it('should return a Positions array representing the Points forming the Geometry', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.toPositions();

        expect(result).toEqual(multiPolygonPositions);
      });
    });

    describe('#points', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.points;

        expect(result).toEqual(multiPolygonPoints);
      });
    });

    describe('#polygons', () => {
      it('should return a Polygons array representing the Points forming the Geometry', () => {
        // const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        // const result = multiPolygon.polygons;

        // expect(result).toEqual(multiPolygonPolygons);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        const multiPolygonClone = multiPolygon.clone();

        expect(multiPolygonClone).toEqual(multiPolygon);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);
        const multiPolygonSame = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.equals(multiPolygonSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const multiPolygon = MultiPolygon.fromJson(multiPolygonJson);

        multiPolygonJson.coordinates = [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [7, 8]]],
        ];
        const multiPolygonDiff = MultiPolygon.fromJson(multiPolygonJson);

        const result = multiPolygon.equals(multiPolygonDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#bbox', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#pointAtIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#lineStringAtIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#polygonAtIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });
});