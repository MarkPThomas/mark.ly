import { BBox as SerialBBox, Polygon as SerialPolygon } from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { Polygon } from './Polygon';

describe('##Polygon', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const position: Position[][] = [
          [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]
        ];
        const points: Point[][] = [
          [
            Point.fromPosition(position[0][0]),
            Point.fromPosition(position[0][1]),
            Point.fromPosition(position[0][2]),
            Point.fromPosition(position[0][3]),
            Point.fromPosition(position[0][4]),
          ],
        ];

        const json: SerialPolygon = {
          type: 'Polygon',
          coordinates: position
        };

        const polygon = Polygon.fromJson(json);

        expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);
        expect(polygon.toPositions()).toEqual(position);
        expect(polygon.points).toEqual(points);

        // Optional properties & Defaults
        expect(polygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const position: Position[][] = [
          [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]
        ];
        const bbox: SerialBBox = [1, 2, 3, 4];

        const json: SerialPolygon = {
          type: 'Polygon',
          bbox: bbox,
          coordinates: position
        };

        const polygon = Polygon.fromJson(json);

        expect(polygon.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPositions', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPoints', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });


  describe('Main Interface Tests', () => {
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


  describe('Instance Tests', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const polygonJson: SerialPolygon = {
          type: 'Polygon',
          coordinates: position
        };
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson();

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const polygonJson: SerialPolygon = {
          type: 'Polygon',
          coordinates: position,
          bbox: bboxJson
        };
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson();

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const polygonJson: SerialPolygon = {
          type: 'Polygon',
          coordinates: position
        };
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson(BBoxState.Include);

        expect(result).not.toEqual(polygonJson);

        const bboxJson: SerialBBox = [1, 2, 7, 8];
        polygonJson.bbox = bboxJson;

        expect(result).toEqual(polygonJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const polygonJson: SerialPolygon = {
          type: 'Polygon',
          coordinates: position,
          bbox: bboxJson
        };
        const polygon = Polygon.fromJson(polygonJson);

        const result = polygon.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(polygonJson);

        delete polygonJson.bbox;

        expect(result).toEqual(polygonJson);
      });
    });

    describe('#points', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });


    describe('#positions', () => {
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