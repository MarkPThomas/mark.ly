import {
  BBox as SerialBBox,
  Polygon as SerialPolygon
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { LineString } from './LineString';
import { Polygon } from './Polygon';

describe('##Polygon', () => {
  let polygonBBoxJsonProvided: SerialBBox;
  let polygonBBoxJsonActual: SerialBBox;
  let polygonJson: SerialPolygon;
  let polygonOuterPoints: Point[][];
  let polygonOuterPositions: Position[][];
  let polygonInnerPositions: Position[][];
  let polygonBBox: BoundingBox;

  beforeEach(() => {
    polygonBBoxJsonProvided = [1, 2, 3, 4];
    polygonBBoxJsonActual = [-3, -4, 3, 4];
    polygonOuterPositions = [
      [[3, 4], [-3, 3], [-3, -4], [3, -3], [3, 4]]
    ];
    polygonInnerPositions = [
      [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]],
      [[-1, -1], [-1, -2], [-2, -2], [-2, -1], [-1, -1]]
    ];
    polygonJson = {
      type: 'Polygon',
      coordinates: polygonOuterPositions
    };

    polygonOuterPoints = [
      [
        Point.fromPosition(polygonOuterPositions[0][0]),
        Point.fromPosition(polygonOuterPositions[0][1]),
        Point.fromPosition(polygonOuterPositions[0][2]),
        Point.fromPosition(polygonOuterPositions[0][3]),
        Point.fromPosition(polygonOuterPositions[0][4]),
      ],
    ];

    polygonBBox = BoundingBox.fromPositions(polygonOuterPositions.flat(1));
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(polygonOuterPositions);
        expect(polygon.points).toEqual(polygonOuterPoints);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        polygonJson.bbox = polygonBBoxJsonProvided;
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should make an object from the associated Positions', () => {
        const polygon = Polygon.fromPositions(polygonOuterPositions);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(polygonOuterPositions);
        expect(polygon.points).toEqual(polygonOuterPoints);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Positions with a bounding box specified', () => {
        const polygon = Polygon.fromPositions(polygonOuterPositions, polygonBBox);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPoints', () => {
      it('should make an object from the associated Points', () => {
        const polygon = Polygon.fromPoints(polygonOuterPoints);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(polygonOuterPositions);
        expect(polygon.points).toEqual(polygonOuterPoints);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const polygon = Polygon.fromPoints(polygonOuterPoints, polygonBBox);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromOuterInner', () => {
      it('should make an object from the associated outer LineString', () => {
        const expectedPolygon = Polygon.fromJson(polygonJson);

        const lineStringOuter = LineString.fromPositions(polygonOuterPositions[0]);

        const polygon = Polygon.fromOuterInner(lineStringOuter);

        expect(polygon.equals(expectedPolygon)).toBeTruthy();
      });

      it('should make an object from the associated outer LineString with an inner LineString', () => {
        const lineStringOuter = LineString.fromPositions(polygonOuterPositions[0]);

        const lineStringInner1 = LineString.fromPositions(polygonInnerPositions[0]);
        const lineStringInner2 = LineString.fromPositions(polygonInnerPositions[1]);
        const lineStringsInner = [lineStringInner1, lineStringInner2];

        const polygon = Polygon.fromOuterInner(lineStringOuter, { inner: lineStringsInner });

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual([
          polygonOuterPositions[0],
          polygonInnerPositions[0],
          polygonInnerPositions[1]
        ]);

        const polygonOuterPoints1 = [
          Point.fromPosition(polygonInnerPositions[0][0]),
          Point.fromPosition(polygonInnerPositions[0][1]),
          Point.fromPosition(polygonInnerPositions[0][2]),
          Point.fromPosition(polygonInnerPositions[0][3]),
          Point.fromPosition(polygonInnerPositions[0][4]),
        ];

        const polygonOuterPoints2 = [
          Point.fromPosition(polygonInnerPositions[1][0]),
          Point.fromPosition(polygonInnerPositions[1][1]),
          Point.fromPosition(polygonInnerPositions[1][2]),
          Point.fromPosition(polygonInnerPositions[1][3]),
          Point.fromPosition(polygonInnerPositions[1][4]),
        ];

        expect(polygon.points).toEqual([
          polygonOuterPoints[0],
          polygonOuterPoints1,
          polygonOuterPoints2,
        ]);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated outer LineString with a bounding box specified', () => {
        const lineStringOuter = LineString.fromPositions(polygonOuterPositions[0]);

        const polygon = Polygon.fromOuterInner(lineStringOuter, { bbox: polygonBBox });

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson();

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        polygonJson.bbox = polygonBBoxJsonProvided;
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson();

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson(BBoxState.Include);

        expect(result).not.toEqual(polygonJson);

        polygonJson.bbox = polygonBBoxJsonActual;

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        polygonJson.bbox = polygonBBoxJsonProvided;
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(polygonJson);

        delete polygonJson.bbox;

        expect(result).toEqual(polygonJson);
      });
    });

    describe('#toPositions', () => {
      it('should return a Positions array representing the Points forming the Geometry', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toPositions();

        expect(result).toEqual(polygonOuterPositions);
      });
    });

    describe('#points', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.points;

        expect(result).toEqual(polygonOuterPoints);
      });
    });

    describe('#outer', () => {
      it('should return a LineString representing the Points forming the Polygon', () => {
        const lineStringOuter = LineString.fromPositions(polygonOuterPositions[0]);
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.outer();

        expect(result).toEqual(lineStringOuter);
      });
    });

    describe('#inner', () => {
      it('should return a LineString array representing the LineStrings forming holes in the Polygon', () => {
        const lineStringInner1 = LineString.fromPositions(polygonInnerPositions[0]);
        const lineStringInner2 = LineString.fromPositions(polygonInnerPositions[1]);

        polygonJson.coordinates.push(polygonInnerPositions[0]);
        polygonJson.coordinates.push(polygonInnerPositions[1]);
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.inner();

        expect(result[0]).toEqual(lineStringInner1);
        expect(result[1]).toEqual(lineStringInner2);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const polygonClone = polygon.clone();

        expect(polygonClone.equals(polygon)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const polygonString = Polygon.fromJson(polygonJson);
        const polygonStringSame = Polygon.fromJson(polygonJson);

        const result = polygonString.equals(polygonStringSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const polygonString = Polygon.fromJson(polygonJson);

        polygonJson.coordinates = [
          [[1, 2], [3, 4]],
          [[5, 6], [9, 10]],
        ];
        const polygonStringDiff = Polygon.fromJson(polygonJson);

        const result = polygonString.equals(polygonStringDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        polygonJson.bbox = polygonBBoxJsonProvided;
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(polygonBBoxJsonProvided);

        polygonJson.bbox = polygonBBoxJsonProvided;
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygon.hasBBox()).toBeTruthy();

        const result = polygon.bbox();
        expect(polygon.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(polygonBBoxJsonActual);
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygon.hasBBox()).toBeFalsy();

        const result = polygon.bbox();
        expect(polygon.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });

    describe('#save', () => {
      it('should do nothing for objects not instantiated by a GeoJSON object', () => {
        const polygon = Polygon.fromPositions(polygonOuterPositions);

        expect(polygonJson.bbox).toBeUndefined();
        expect(polygon.hasBBox()).toBeFalsy();

        const bbox = polygon.bbox();
        expect(polygonJson.bbox).toBeUndefined();
        expect(polygon.hasBBox()).toBeTruthy();

        polygon.save();
        expect(polygonJson.bbox).toBeUndefined();
      });

      it('should propagate updates in the object to the original GeoJSON object', () => {
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygonJson.bbox).toBeUndefined();
        expect(polygon.hasBBox()).toBeFalsy();

        const bbox = polygon.bbox();
        expect(polygonJson.bbox).toBeUndefined();
        expect(polygon.hasBBox()).toBeTruthy();

        polygon.save();
        expect(polygonJson.bbox).toEqual(bbox.toJson());
      });
    });
  });
});