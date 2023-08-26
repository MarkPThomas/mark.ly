import { BBox as SerialBBox, Point as SerialPoint } from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';

import { Point, PointProperties, PointOptions } from './Point';

describe('##Point', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const position: Position = [1, 2];

        const json: SerialPoint = {
          type: 'Point',
          coordinates: position
        };

        const point = Point.fromJson(json);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(position);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(Point.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with an altitude specified', () => {
        const position: Position = [1, 2, 3];

        const json: SerialPoint = {
          type: 'Point',
          coordinates: position
        };

        const point = Point.fromJson(json);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(position);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeTruthy();
        expect(point.altitude).toEqual(3);
        expect(point.buffer).toEqual(Point.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const position: Position = [1, 2];
        const bbox: SerialBBox = [1, 2, 3, 4];

        const json: SerialPoint = {
          type: 'Point',
          bbox: bbox,
          coordinates: position
        };

        const point = Point.fromJson(json);

        expect(point.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromLngLat', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPosition', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromOptions', () => {
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

    describe('#hasAltitude', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

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
  });
});