import {
  BBox as SerialBBox,
  Polygon as SerialPolygon
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';
import { BoundingBox } from '../BoundingBox';

import { Point } from './Point';
import { Polygon } from './Polygon';

describe('##Polygon', () => {
  let polygonBBoxJson: SerialBBox;
  let polygonJson: SerialPolygon;
  let polygonPoints: Point[][];
  let polygonPositions: Position[][];
  let polygonBBox: BoundingBox;

  beforeEach(() => {
    polygonBBoxJson = [1, 2, 3, 4];
    polygonPositions = [
      [[1, 2], [-1, 1], [-1, -2], [1, -1], [1, 2]]
    ];
    polygonJson = {
      type: 'Polygon',
      coordinates: polygonPositions
    };

    polygonPoints = [
      [
        Point.fromPosition(polygonPositions[0][0]),
        Point.fromPosition(polygonPositions[0][1]),
        Point.fromPosition(polygonPositions[0][2]),
        Point.fromPosition(polygonPositions[0][3]),
        Point.fromPosition(polygonPositions[0][4]),
      ],
    ];

    polygonBBox = BoundingBox.fromPositions(polygonPositions.flat(1));
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(polygonPositions);
        expect(polygon.points).toEqual(polygonPoints);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        polygonJson.bbox = polygonBBoxJson;
        const polygon = Polygon.fromJson(polygonJson);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should make an object from the associated Positions', () => {
        const polygon = Polygon.fromPositions(polygonPositions);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(polygonPositions);
        expect(polygon.points).toEqual(polygonPoints);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Positions with a bounding box specified', () => {
        const polygon = Polygon.fromPositions(polygonPositions, polygonBBox);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPoints', () => {
      it('should make an object from the associated Points', () => {
        const polygon = Polygon.fromPoints(polygonPoints);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(polygonPositions);
        expect(polygon.points).toEqual(polygonPoints);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Points with a bounding box specified', () => {
        const polygon = Polygon.fromPoints(polygonPoints, polygonBBox);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromOuterInner', () => {
      it('should make an object from the associated outer LineString', () => {

      });

      it('should make an object from the associated outer LineString with an inner LineString', () => {

      });

      it('should make an object from the associated outer LineString with a bounding box specified', () => {

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
        polygonJson.bbox = polygonBBoxJson;
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson();

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson(BBoxState.Include);

        expect(result).not.toEqual(polygonJson);

        const bboxJson: SerialBBox = [-1, -2, 1, 2];
        polygonJson.bbox = bboxJson;

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        polygonJson.bbox = polygonBBoxJson;
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

        expect(result).toEqual(polygonPositions);
      });
    });

    describe('#points', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.points;

        expect(result).toEqual(polygonPoints);
      });
    });

    describe('#outer', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        // const polygon = Polygon.fromJson(polygonJson);

        // const result = polygon.outer;

        // expect(result).toEqual(polygonOuterLineString);
      });
    });

    describe('#inner', () => {
      it('should return a Points array representing the Points forming the Geometry', () => {
        // const polygon = Polygon.fromJson(polygonJson);

        // const result = polygon.inner;

        // expect(result).toEqual(polygonInnerLineStrings);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const polygonString = Polygon.fromJson(polygonJson);

        const polygonStringClone = polygonString.clone();

        expect(polygonStringClone).toEqual(polygonString);
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