import {
  BBox as SerialBBox,
  MultiLineString as SerialMultiLineString
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { MultiLineString } from './MultiLineString';

describe('##MultiLineString', () => {
  let multiLineStringBBoxJson: SerialBBox;
  let multiLineStringJson: SerialMultiLineString;
  let multiLineStringPoints: Point[][];
  let multiLineStringPositions: Position[][];
  let multiLineStringBBox: BoundingBox;

  beforeEach(() => {
    multiLineStringBBoxJson = [1, 2, 3, 4];
    multiLineStringPositions = [
      [[1, 2], [3, 4]],
      [[5, 6], [7, 8]],
    ];
    multiLineStringJson = {
      type: 'MultiLineString',
      coordinates: multiLineStringPositions
    };

    multiLineStringPoints = [
      [
        Point.fromPosition(multiLineStringPositions[0][0]),
        Point.fromPosition(multiLineStringPositions[0][1])
      ],
      [
        Point.fromPosition(multiLineStringPositions[1][0]),
        Point.fromPosition(multiLineStringPositions[1][1])
      ],
    ];

    multiLineStringBBox = BoundingBox.fromPositions(multiLineStringPositions.flat(1));
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        expect(multiLineString.type).toEqual(GeoJsonGeometryTypes.MultiLineString);
        expect(multiLineString.toPositions()).toEqual(multiLineStringPositions);
        expect(multiLineString.points).toEqual(multiLineStringPoints);

        // Optional properties & Defaults
        expect(multiLineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        multiLineStringJson.bbox = multiLineStringBBoxJson;
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        expect(multiLineString.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should make an object from the associated Positions', () => {
        const multiLineString = MultiLineString.fromPositions(multiLineStringPositions);

        expect(multiLineString.type).toEqual(GeoJsonGeometryTypes.MultiLineString);
        expect(multiLineString.toPositions()).toEqual(multiLineStringPositions);
        expect(multiLineString.points).toEqual(multiLineStringPoints);

        // Optional properties & Defaults
        expect(multiLineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Positions with a bounding box specified', () => {
        const multiLineString = MultiLineString.fromPositions(multiLineStringPositions, multiLineStringBBox);

        expect(multiLineString.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPoints', () => {
      it('should make an object from the associated Points', () => {
        const multiLineString = MultiLineString.fromPoints(multiLineStringPoints);

        expect(multiLineString.type).toEqual(GeoJsonGeometryTypes.MultiLineString);
        expect(multiLineString.toPositions()).toEqual(multiLineStringPositions);
        expect(multiLineString.points).toEqual(multiLineStringPoints);

        // Optional properties & Defaults
        expect(multiLineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const multiLineString = MultiLineString.fromPoints(multiLineStringPoints, multiLineStringBBox);

        expect(multiLineString.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromLineStrings', () => {
      it('should make an object from the associated LineStrings', () => {

      });

      it('should make an object from the associated LineStrings with a bounding box specified', () => {

      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson();

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        multiLineStringJson.bbox = multiLineStringBBoxJson;
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson();

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson(BBoxState.Include);

        expect(result).not.toEqual(multiLineStringJson);

        const bboxJson: SerialBBox = [1, 2, 7, 8];
        multiLineStringJson.bbox = bboxJson;

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        multiLineStringJson.bbox = multiLineStringBBoxJson;
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(multiLineStringJson);

        delete multiLineStringJson.bbox;

        expect(result).toEqual(multiLineStringJson);
      });
    });

    describe('#toPositions', () => {
      it('should return a Positions array representing the Points forming the Geometry', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toPositions();

        expect(result).toEqual(multiLineStringPositions);
      });
    });

    describe('#points', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.points;

        expect(result).toEqual(multiLineStringPoints);
      });
    });

    describe('#lineStrings', () => {
      it('should return a LineStrings array representing the Points forming the Geometry', () => {
        // const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        // const result = multiLineString.lineStrings;

        // expect(result).toEqual(multiLineStringLineStrings);
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

    describe('#lineStringAtIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });
});