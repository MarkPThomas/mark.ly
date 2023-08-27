import {
  BBox as SerialBBox,
  Point as SerialPoint
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';

import { Point, PointProperties, PointOptions } from './Point';

describe('##Point', () => {
  let pointBBoxJson: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;

  beforeEach(() => {
    pointBBoxJson = [1, 2, 3, 4];
    pointPosition = [1, 2];
    pointJson = {
      type: 'Point',
      coordinates: pointPosition
    };
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const point = Point.fromJson(pointJson);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(pointPosition);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(Point.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with an altitude specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];
        pointJson.coordinates = positionWithAltitude;

        const point = Point.fromJson(pointJson);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(positionWithAltitude);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeTruthy();
        expect(point.altitude).toEqual(3);
        expect(point.buffer).toEqual(Point.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        pointJson.bbox = pointBBoxJson;

        const point = Point.fromJson(pointJson);

        expect(point.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromPosition', () => {
      it('should make an object from the associated Position with no altitude', () => {
        const point = Point.fromPosition(pointPosition);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(pointPosition);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(Point.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];

        const point = Point.fromPosition(positionWithAltitude);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(positionWithAltitude);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeTruthy();
        expect(point.altitude).toEqual(3);
        expect(point.buffer).toEqual(Point.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated Position with a buffer specified', () => {
        const point = Point.fromPosition(pointPosition, 2);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(pointPosition);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(2);
        expect(point.hasBBox()).toBeFalsy();
      });
    });

    describe('#fromLngLat', () => {
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

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const point = Point.fromJson(pointJson);

        const result = point.toJson();

        expect(result).toEqual(pointJson);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];
        pointJson.coordinates = positionWithAltitude;
        const point = Point.fromJson(pointJson);

        const result = point.toJson();

        expect(result).toEqual(pointJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        pointJson.bbox = pointBBoxJson;
        const point = Point.fromJson(pointJson);

        const result = point.toJson();

        expect(result).toEqual(pointJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const point = Point.fromJson(pointJson);

        const result = point.toJson(BBoxState.Include);

        expect(result).not.toEqual(pointJson);

        const bboxJsonExpected: SerialBBox = [
          1 - Point.DEFAULT_BUFFER,
          2 - Point.DEFAULT_BUFFER,
          3 + Point.DEFAULT_BUFFER,
          4 + Point.DEFAULT_BUFFER
        ];
        pointJson.bbox = bboxJsonExpected;

        expect(result).not.toEqual(pointJson);
      });

      it('should make a GeoJSON object without a specified bounding box', () => {
        pointJson.bbox = pointBBoxJson;
        const point = Point.fromJson(pointJson);

        const result = point.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(pointJson);

        delete pointJson.bbox;

        expect(result).toEqual(pointJson);
      });
    });

    describe('#toPositions', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const point = Point.fromJson(pointJson);

        const result = point.toPositions();

        expect(result).toEqual(pointPosition);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];
        pointJson.coordinates = positionWithAltitude;
        const point = Point.fromJson(pointJson);

        const result = point.toPositions();

        expect(result).toEqual(positionWithAltitude);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should create a copy of the object', () => {

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

  describe('Methods', () => {
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

    describe('#hasAltitude', () => {
      it('should return False when no altitude was specified', () => {
        const point = Point.fromJson(pointJson);

        expect(point.hasAltitude()).toBeFalsy();
      });

      it('should return True when altitudes were specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];
        pointJson.coordinates = positionWithAltitude;
        const point = Point.fromJson(pointJson);

        expect(point.hasAltitude()).toBeTruthy();
      });
    });
  });
});