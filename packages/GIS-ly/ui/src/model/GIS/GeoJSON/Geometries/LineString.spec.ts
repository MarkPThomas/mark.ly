import {
  BBox as SerialBBox,
  LineString as SerialLineString
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { LineString } from './LineString';

describe('##LineString', () => {
  let lineStringBBoxJson: SerialBBox;
  let lineStringJson: SerialLineString;
  let lineStringPoints: Point[];
  let lineStringPositions: Position[];
  let lineStringBBox: BoundingBox;

  beforeEach(() => {
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
        lineStringJson.bbox = lineStringBBoxJson;
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
      it('should make an object from the associated Points', () => {

      });

      it('should make an object from the associated Points with a bounding box specified', () => {

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
        lineStringJson.bbox = lineStringBBoxJson;
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson();

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson(BBoxState.Include);

        expect(result).not.toEqual(lineStringJson);

        const bboxJson: SerialBBox = [1, 2, 3, 4];
        lineStringJson.bbox = bboxJson;

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        lineStringJson.bbox = lineStringBBoxJson;
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