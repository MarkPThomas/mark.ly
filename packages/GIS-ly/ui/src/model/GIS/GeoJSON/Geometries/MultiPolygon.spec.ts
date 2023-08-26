import { BBox as SerialBBox, MultiPolygon as SerialMultiPolygon } from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { MultiPolygon } from './MultiPolygon';

describe('##MultiPolygon', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const position: Position[][][] = [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
        ];
        const points: Point[][][] = [
          [[
            Point.fromPosition(position[0][0][0]),
            Point.fromPosition(position[0][0][1]),
            Point.fromPosition(position[0][0][2]),
            Point.fromPosition(position[0][0][3]),
            Point.fromPosition(position[0][0][4]),
          ]], [[
            Point.fromPosition(position[1][0][0]),
            Point.fromPosition(position[1][0][1]),
            Point.fromPosition(position[1][0][2]),
            Point.fromPosition(position[1][0][3]),
            Point.fromPosition(position[1][0][4]),
          ]],
        ];

        const json: SerialMultiPolygon = {
          type: 'MultiPolygon',
          coordinates: position
        };

        const multiPolygon = MultiPolygon.fromJson(json);

        expect(multiPolygon.type).toEqual(GeoJsonGeometryTypes.MultiPolygon);
        expect(multiPolygon.toPositions()).toEqual(position);
        expect(multiPolygon.points).toEqual(points);

        // Optional properties & Defaults
        expect(multiPolygon.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const position: Position[][][] = [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
        ];
        const bbox: SerialBBox = [1, 2, 3, 4];

        const json: SerialMultiPolygon = {
          type: 'MultiPolygon',
          bbox: bbox,
          coordinates: position
        };

        const multiPolygon = MultiPolygon.fromJson(json);

        expect(multiPolygon.hasBBox()).toBeTruthy();
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