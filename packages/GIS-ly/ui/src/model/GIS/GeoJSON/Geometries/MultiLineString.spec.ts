import { BBox as SerialBBox, MultiLineString as SerialMultiLineString } from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { MultiLineString } from './MultiLineString';

describe('##MultiLineString', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const json: SerialMultiLineString = {
          type: 'MultiLineString',
          coordinates: position
        };

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
      it('should make a GeoJSON object', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const multiLineStringJson: SerialMultiLineString = {
          type: 'MultiLineString',
          coordinates: position
        };
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson();

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const multiLineStringJson: SerialMultiLineString = {
          type: 'MultiLineString',
          coordinates: position,
          bbox: bboxJson
        };
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson();

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const multiLineStringJson: SerialMultiLineString = {
          type: 'MultiLineString',
          coordinates: position
        };
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson(BBoxState.Include);

        expect(result).not.toEqual(multiLineStringJson);

        const bboxJson: SerialBBox = [1, 2, 7, 8];
        multiLineStringJson.bbox = bboxJson;

        expect(result).toEqual(multiLineStringJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[][] = [
          [[1, 2], [3, 4]],
          [[5, 6], [7, 8]],
        ];
        const multiLineStringJson: SerialMultiLineString = {
          type: 'MultiLineString',
          coordinates: position,
          bbox: bboxJson
        };
        const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        const result = multiLineString.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(multiLineStringJson);

        delete multiLineStringJson.bbox;

        expect(result).toEqual(multiLineStringJson);
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