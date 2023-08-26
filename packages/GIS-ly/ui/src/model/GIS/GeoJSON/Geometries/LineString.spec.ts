import {
  BBox as SerialBBox,
  LineString as SerialLineString
} from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { LineString } from './LineString';

describe('##LineString', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const json: SerialLineString = {
          type: 'LineString',
          coordinates: position
        };

        const points: Point[] = [
          Point.fromPosition(position[0]),
          Point.fromPosition(position[1])
        ];

        const lineString = LineString.fromJson(json);

        expect(lineString.type).toEqual(GeoJsonGeometryTypes.LineString);
        expect(lineString.toPositions()).toEqual(position);
        expect(lineString.points).toEqual(points);

        // Optional properties & Defaults
        expect(lineString.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const bbox: SerialBBox = [1, 2, 3, 4];

        const json: SerialLineString = {
          type: 'LineString',
          bbox: bbox,
          coordinates: position
        };

        const lineString = LineString.fromJson(json);

        expect(lineString.hasBBox()).toBeTruthy();
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