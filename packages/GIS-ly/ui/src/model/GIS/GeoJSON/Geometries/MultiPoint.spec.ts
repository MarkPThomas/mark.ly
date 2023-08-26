import { BBox as SerialBBox, MultiPoint as SerialMultiPoint } from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { MultiPoint } from './MultiPoint';

describe('##MultiPoint', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const points: Point[] = [
          Point.fromPosition(position[0]),
          Point.fromPosition(position[1])
        ];

        const json: SerialMultiPoint = {
          type: 'MultiPoint',
          coordinates: position
        };

        const multiPoint = MultiPoint.fromJson(json);

        expect(multiPoint.type).toEqual(GeoJsonGeometryTypes.MultiPoint);
        expect(multiPoint.toPositions()).toEqual(position);
        expect(multiPoint.points).toEqual(points);

        // Optional properties & Defaults
        expect(multiPoint.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const bbox: SerialBBox = [1, 2, 3, 4];

        const json: SerialMultiPoint = {
          type: 'MultiPoint',
          bbox: bbox,
          coordinates: position
        };

        const point = MultiPoint.fromJson(json);

        expect(point.hasBBox()).toBeTruthy();
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