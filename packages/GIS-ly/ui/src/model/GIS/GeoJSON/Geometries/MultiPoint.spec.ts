import {
  BBox as SerialBBox,
  MultiPoint as SerialMultiPoint
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { MultiPoint } from './MultiPoint';

describe('##MultiPoint', () => {
  let multiPointBBoxJson: SerialBBox;
  let multiPointJson: SerialMultiPoint;
  let multiPointPoints: Point[];
  let multiPointPositions: Position[];
  let multiPointBBox: BoundingBox;

  beforeEach(() => {
    multiPointBBoxJson = [1, 2, 3, 4];
    multiPointPositions = [[1, 2], [3, 4]];
    multiPointJson = {
      type: 'MultiPoint',
      coordinates: multiPointPositions
    };

    multiPointPoints = [
      Point.fromPosition(multiPointPositions[0]),
      Point.fromPosition(multiPointPositions[1])
    ];

    multiPointBBox = BoundingBox.fromPositions(multiPointPositions);
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        expect(multiPoint.type).toEqual(GeoJsonGeometryTypes.MultiPoint);
        expect(multiPoint.toPositions()).toEqual(multiPointPositions);
        expect(multiPoint.points).toEqual(multiPointPoints);

        // Optional properties & Defaults
        expect(multiPoint.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        multiPointJson.bbox = multiPointBBoxJson;
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        expect(multiPoint.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should make an object from the associated Positions', () => {
        const multiPoint = MultiPoint.fromPositions(multiPointPositions);

        expect(multiPoint.type).toEqual(GeoJsonGeometryTypes.MultiPoint);
        expect(multiPoint.toPositions()).toEqual(multiPointPositions);
        expect(multiPoint.points).toEqual(multiPointPoints);

        // Optional properties & Defaults
        expect(multiPoint.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Positions with a bounding box specified', () => {
        const multiPoint = MultiPoint.fromPositions(multiPointPositions, multiPointBBox);

        expect(multiPoint.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPoints', () => {
      it('should make an object from the associated Points', () => {
        const multiPoint = MultiPoint.fromPoints(multiPointPoints);

        expect(multiPoint.type).toEqual(GeoJsonGeometryTypes.MultiPoint);
        expect(multiPoint.toPositions()).toEqual(multiPointPositions);
        expect(multiPoint.points).toEqual(multiPointPoints);

        // Optional properties & Defaults
        expect(multiPoint.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const multiPoint = MultiPoint.fromPoints(multiPointPoints, multiPointBBox);

        expect(multiPoint.hasBBox()).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson();

        expect(result).toEqual(multiPointJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        multiPointJson.bbox = multiPointBBoxJson;
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson();

        expect(result).toEqual(multiPointJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson(BBoxState.Include);

        expect(result).not.toEqual(multiPointJson);

        const bboxJson: SerialBBox = [1, 2, 3, 4];
        multiPointJson.bbox = bboxJson;

        expect(result).toEqual(multiPointJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        multiPointJson.bbox = multiPointBBoxJson;
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(multiPointJson);

        delete multiPointJson.bbox;

        expect(result).toEqual(multiPointJson);
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
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const pointClone = multiPoint.clone();

        expect(pointClone).toEqual(multiPoint);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);
        const multiPointSame = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.equals(multiPointSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        multiPointJson.coordinates = [[1, 2], [5, 6]];
        const multiPointDiff = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.equals(multiPointDiff);
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
  });
});