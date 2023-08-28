import {
  BBox as SerialBBox,
  MultiLineString as SerialMultiLineString
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { LineString } from './LineString';
import { MultiLineString } from './MultiLineString';

describe('##MultiLineString', () => {
  let multiLineStringBBoxJsonProvided: SerialBBox;
  let multiLineStringBBoxJsonActual: SerialBBox;
  let multiLineStringJson: SerialMultiLineString;
  let multiLineStringPoints: Point[][];
  let multiLineStringPositions: Position[][];
  let multiLineStringBBox: BoundingBox;

  beforeEach(() => {
    multiLineStringBBoxJsonProvided = [1, 2, 3, 4];
    multiLineStringBBoxJsonActual = [1, 2, 7, 8];
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
        multiLineStringJson.bbox = multiLineStringBBoxJsonProvided;
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
      let lineStrings: LineString[];
      beforeEach(() => {
        const lineString1 = LineString.fromPositions(multiLineStringPositions[0]);
        const lineString2 = LineString.fromPositions(multiLineStringPositions[1]);
        lineStrings = [lineString1, lineString2];
      });

      it('should make an object from the associated LineStrings', () => {
        const expectedMultiLineString = MultiLineString.fromJson(multiLineStringJson);

        const multiLineString = MultiLineString.fromLineStrings(lineStrings);

        expect(multiLineString).toEqual(expectedMultiLineString);
      });

      it('should make an object from the associated LineStrings with a bounding box specified', () => {
        const multiLineString = MultiLineString.fromLineStrings(lineStrings, multiLineStringBBox);

        expect(multiLineString.hasBBox()).toBeTruthy();
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
        multiLineStringJson.bbox = multiLineStringBBoxJsonProvided;
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson();

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson(BBoxState.Include);

        expect(result).not.toEqual(multiLineStringJson);

        multiLineStringJson.bbox = multiLineStringBBoxJsonActual;

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        multiLineStringJson.bbox = multiLineStringBBoxJsonProvided;
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
        const lineString1 = LineString.fromPositions(multiLineStringPositions[0]);
        const lineString2 = LineString.fromPositions(multiLineStringPositions[1]);

        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.lineStrings;

        expect(result[0]).toEqual(lineString1);
        expect(result[1]).toEqual(lineString2);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const multiLineStringClone = multiLineString.clone();

        expect(multiLineStringClone).toEqual(multiLineString);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);
        const multiLineStringSame = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.equals(multiLineStringSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        multiLineStringJson.coordinates = [
          [[1, 2], [3, 4]],
          [[5, 6], [9, 10]],
        ];
        const multiLineStringDiff = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.equals(multiLineStringDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        multiLineStringJson.bbox = multiLineStringBBoxJsonProvided;
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(multiLineStringBBoxJsonProvided);

        multiLineStringJson.bbox = multiLineStringBBoxJsonProvided;
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        expect(multiLineString.hasBBox()).toBeTruthy();

        const result = multiLineString.bbox();
        expect(multiLineString.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(multiLineStringBBoxJsonActual);
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        expect(multiLineString.hasBBox()).toBeFalsy();

        const result = multiLineString.bbox();
        expect(multiLineString.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });
  });
});