import {
  BBox as SerialBBox,
  Point as SerialPoint
} from 'geojson';

import { Position } from '../types';
import { BBoxState, GeoJsonGeometryTypes } from '../enums';

import { Point, PointOptions } from './Point';
import { BoundingBox } from '../BoundingBox';
import { GeoJsonConstants } from '../GeoJsonConstants';

describe('##Point', () => {
  let pointBBoxJsonProvided: SerialBBox;
  let pointBBoxJsonActual: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;

  beforeEach(() => {
    pointBBoxJsonActual = [
      1 - GeoJsonConstants.DEFAULT_BUFFER,
      2 - GeoJsonConstants.DEFAULT_BUFFER,
      1 + GeoJsonConstants.DEFAULT_BUFFER,
      2 + GeoJsonConstants.DEFAULT_BUFFER,
    ];
    pointBBoxJsonProvided = [1, 2, 3, 4];
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
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
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
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        pointJson.bbox = pointBBoxJsonProvided;

        const point = Point.fromJson(pointJson);

        expect(point.hasBBox()).toBeTruthy();
      });

      it('should throw an InvalidGeometryException if coordinates are missing from the GeoJSON object', () => {
        pointJson.coordinates = [1];
        expect(() => Point.fromJson(pointJson)).toThrowError();
      })
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
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
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
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
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
      it('should make an object with no altitude', () => {
        const point = Point.fromLngLat(1, 2);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(pointPosition);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object with an altitude specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];

        const point = Point.fromLngLat(1, 2, 3);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(positionWithAltitude);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeTruthy();
        expect(point.altitude).toEqual(3);
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object with a buffer specified', () => {
        const point = Point.fromLngLat(1, 2, undefined, 2);

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

      it('should throw an LngLatOutOfRangeException when latitude is greater than +/-90 degrees', () => {
        expect(() => Point.fromLngLat(1, 91)).toThrow()
        expect(() => Point.fromLngLat(1, -91)).toThrow()
      });

      it('should throw an LngLatOutOfRangeException when longitude is greater than +/-180 degrees', () => {
        expect(() => Point.fromLngLat(181, 2)).toThrow()
        expect(() => Point.fromLngLat(-181, 2)).toThrow()
      });
    });

    describe('#fromOptions', () => {
      it('should make an object with no altitude', () => {
        const options: PointOptions = {
          longitude: 1,
          latitude: 2
        };
        const point = Point.fromOptions(options);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(pointPosition);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object with an altitude specified', () => {
        const positionWithAltitude: Position = [1, 2, 3];

        const options: PointOptions = {
          longitude: 1,
          latitude: 2,
          altitude: 3
        };
        const point = Point.fromOptions(options);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(positionWithAltitude);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeTruthy();
        expect(point.altitude).toEqual(3);
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeFalsy();
      });

      it('should make an object with a buffer specified', () => {
        const options: PointOptions = {
          longitude: 1,
          latitude: 2,
          buffer: 2
        };
        const point = Point.fromOptions(options);

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

      it('should make an object with a bounding box specified', () => {
        const options: PointOptions = {
          longitude: 1,
          latitude: 2,
          bBox: BoundingBox.fromJson(pointBBoxJsonProvided)
        };
        const point = Point.fromOptions(options);

        expect(point.type).toEqual(GeoJsonGeometryTypes.Point);
        expect(point.latitude).toEqual(2);
        expect(point.longitude).toEqual(1);
        expect(point.toPositions()).toEqual(pointPosition);
        expect(point.points.equals(point)).toBeTruthy();

        // Optional properties & Defaults
        expect(point.hasAltitude()).toBeFalsy();
        expect(point.altitude).toBeUndefined();
        expect(point.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
        expect(point.hasBBox()).toBeTruthy();
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
        pointJson.bbox = pointBBoxJsonProvided;
        const point = Point.fromJson(pointJson);

        const result = point.toJson();

        expect(result).toEqual(pointJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const point = Point.fromJson(pointJson);

        const result = point.toJson(BBoxState.Include);

        expect(result).not.toEqual(pointJson);

        pointJson.bbox = pointBBoxJsonActual;

        expect(result).toEqual(pointJson);
      });

      it('should make a GeoJSON object without a specified bounding box', () => {
        pointJson.bbox = pointBBoxJsonProvided;
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
      it('should return a copy of the values object', () => {
        const point = Point.fromJson(pointJson);

        const pointClone = point.clone();

        expect(pointClone.equals(point)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const point = Point.fromJson(pointJson);
        const pointSame = Point.fromJson(pointJson);

        const result = point.equals(pointSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const point = Point.fromJson(pointJson);

        pointJson.coordinates = [3, 4];
        const pointDiff = Point.fromJson(pointJson);

        const result = point.equals(pointDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const point = Point.fromJson(pointJson);

        const result = point.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        pointJson.bbox = pointBBoxJsonProvided;
        const point = Point.fromJson(pointJson);

        const result = point.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(pointBBoxJsonProvided);
        pointJson.bbox = pointBBoxJsonProvided;
        const point = Point.fromJson(pointJson);

        expect(point.hasBBox()).toBeTruthy();

        const result = point.bbox();
        expect(point.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(pointBBoxJsonActual);
        const point = Point.fromJson(pointJson);

        expect(point.hasBBox()).toBeFalsy();

        const result = point.bbox();
        expect(point.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
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

    describe('#save', () => {
      it('should do nothing for objects not instantiated by a GeoJSON object', () => {
        const point = Point.fromPosition(pointPosition);

        expect(pointJson.bbox).toBeUndefined();
        expect(point.hasBBox()).toBeFalsy();

        const bbox = point.bbox();
        expect(pointJson.bbox).toBeUndefined();
        expect(point.hasBBox()).toBeTruthy();

        point.save();
        expect(pointJson.bbox).toBeUndefined();
      });

      it('should propagate updates in the object to the original GeoJSON object', () => {
        const point = Point.fromJson(pointJson);

        expect(pointJson.bbox).toBeUndefined();
        expect(point.hasBBox()).toBeFalsy();

        const bbox = point.bbox();
        expect(pointJson.bbox).toBeUndefined();
        expect(point.hasBBox()).toBeTruthy();

        point.save();
        expect(pointJson.bbox).toEqual(bbox.toJson());
      });
    });
  });
});