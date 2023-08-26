import { BBox as SerialBBox, MultiLineString as SerialMultiLineString } from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { MultiLineString } from './MultiLineString';

describe('##MultiLineString', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const points: Point[][] = [
          [
            Point.fromPosition(position[0][0]),
            Point.fromPosition(position[0][1])
          ],
          [
            Point.fromPosition(position[1][0]),
            Point.fromPosition(position[1][1])
          ],
        ];

        const json: SerialMultiLineString = {
          type: 'MultiLineString',
          coordinates: position
        };

        const multiLineString = MultiLineString.fromJson(json);

        expect(multiLineString.type).toEqual(GeoJsonGeometryTypes.MultiLineString);
        expect(multiLineString.toPositions()).toEqual(position);
        expect(multiLineString.points).toEqual(points);

        // Optional properties & Defaults
        expect(multiLineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const bbox: SerialBBox = [1, 2, 3, 4];

        const json: SerialMultiLineString = {
          type: 'MultiLineString',
          bbox: bbox,
          coordinates: position
        };

        const multiLineString = MultiLineString.fromJson(json);

        expect(multiLineString.hasBBox()).toBeTruthy();
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