import {
  BBox as SerialBBox,
  LineString as SerialLineString
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';

import { Point } from './Point';
import { LineString } from './LineString';

describe('##LineString', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
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
      it('should make a GeoJSON object', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const lineStringJson: SerialLineString = {
          type: 'LineString',
          coordinates: position
        };
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson();

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[] = [[1, 2], [3, 4]];
        const lineStringJson: SerialLineString = {
          type: 'LineString',
          coordinates: position,
          bbox: bboxJson
        };
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson();

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const position: Position[] = [[1, 2], [3, 4]];
        const lineStringJson: SerialLineString = {
          type: 'LineString',
          coordinates: position
        };
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson(BBoxState.Include);

        expect(result).not.toEqual(lineStringJson);

        const bboxJson: SerialBBox = [1, 2, 3, 4];
        lineStringJson.bbox = bboxJson;

        expect(result).toEqual(lineStringJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const position: Position[] = [[1, 2], [3, 4]];
        const lineStringJson: SerialLineString = {
          type: 'LineString',
          coordinates: position,
          bbox: bboxJson
        };
        const lineString = LineString.fromJson(lineStringJson);

        const result = lineString.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(lineStringJson);

        delete lineStringJson.bbox;

        expect(result).toEqual(lineStringJson);
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