import { BBox as SerialBBox, Polygon as SerialPolygon } from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { Polygon } from './Polygon';

describe('##Polygon', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
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
      it('should', () => {

      });

      it('should', () => {

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