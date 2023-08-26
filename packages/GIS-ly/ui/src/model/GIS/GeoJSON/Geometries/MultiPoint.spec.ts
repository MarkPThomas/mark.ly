import { BBox as SerialBBox, MultiPoint as SerialMultiPoint } from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { MultiPoint } from './MultiPoint';

describe('##MultiPoint', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const json: SerialMultiPoint = {
          type: 'MultiPoint',
          coordinates: position
        };

        const points: Point[] = [
          Point.fromPosition(position[0]),
          Point.fromPosition(position[1])
        ];

        const multiPoint = MultiPoint.fromJson(json);

        expect(multiPoint.type).toEqual(GeoJsonGeometryTypes.MultiPoint);
        expect(multiPoint.toPositions()).toEqual(position);
        expect(multiPoint.points).toEqual(points);

        // Optional properties & Defaults
        expect(multiPoint.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const bbox: SerialBBox = [1, 2, 3, 4];
        const position: Position[] = [[1, 2], [3, 4]];
        const json: SerialMultiPoint = {
          type: 'MultiPoint',
          bbox: bbox,
          coordinates: position
        };

        const multiPoint = MultiPoint.fromJson(json);

        expect(multiPoint.hasBBox()).toBeTruthy();
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
        const position: Position[] = [[1, 2], [3, 4]];
        const multiPointJson: SerialMultiPoint = {
          type: 'MultiPoint',
          coordinates: position
        };
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson();

        expect(result).toEqual(multiPointJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[] = [[1, 2], [3, 4]];
        const multiPointJson: SerialMultiPoint = {
          type: 'MultiPoint',
          coordinates: position,
          bbox: bboxJson
        };
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson();

        expect(result).toEqual(multiPointJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const multiPointJson: SerialMultiPoint = {
          type: 'MultiPoint',
          coordinates: position
        };
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson(BBoxState.Include);

        expect(result).not.toEqual(multiPointJson);

        const bboxJson: SerialBBox = [1, 2, 3, 4];
        multiPointJson.bbox = bboxJson;

        expect(result).toEqual(multiPointJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[] = [[1, 2], [3, 4]];
        const multiPointJson: SerialMultiPoint = {
          type: 'MultiPoint',
          coordinates: position,
          bbox: bboxJson
        };
        const multiPoint = MultiPoint.fromJson(multiPointJson);

        const result = multiPoint.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(multiPointJson);

        delete multiPointJson.bbox;

        expect(result).toEqual(multiPointJson);
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