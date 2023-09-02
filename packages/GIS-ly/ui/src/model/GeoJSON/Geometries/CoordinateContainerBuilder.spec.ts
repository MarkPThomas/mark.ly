import {
  Point as SerialPoint,
  MultiPoint as SerialMultiPoint,
  LineString as SerialLineString,
  MultiLineString as SerialMultiLineString,
  Polygon as SerialPolygon,
  MultiPolygon as SerialMultiPolygon,
  GeometryCollection as SerialGeometryCollection
} from 'geojson';

import { Position } from '../types';
import { GeoJsonGeometryTypes } from '../enums';
import { GeoJsonConstants } from '../GeoJsonConstants';

import { Point } from './Point';
import { MultiPoint } from './MultiPoint';
import { LineString } from './LineString';
import { MultiLineString } from './MultiLineString';
import { Polygon } from './Polygon';
import { MultiPolygon } from './MultiPolygon';

import { CoordinateContainerBuilder } from './CoordinateContainerBuilder';

describe('##CoordinateContainerBuilder', () => {
  describe('#fromJson', () => {
    it('should make a Point object from the associated GeoJSON object', () => {
      const position: Position = [1, 2];

      const json: SerialPoint = {
        type: 'Point',
        coordinates: position
      };

      const point = CoordinateContainerBuilder.fromJson(json);

      expect(point.type).toEqual(GeoJsonGeometryTypes.Point);

      const pointCast = point as Point;

      expect(pointCast.latitude).toEqual(2);
      expect(pointCast.longitude).toEqual(1);
      expect(pointCast.toPositions()).toEqual(position);
      expect(pointCast.points.equals(pointCast)).toBeTruthy();

      // Optional properties & Defaults
      expect(pointCast.altitude).toBeUndefined();
      expect(pointCast.buffer).toEqual(GeoJsonConstants.DEFAULT_BUFFER);
      expect(pointCast.hasBBox()).toBeFalsy();
    });

    it('should make a MultiPoint object from the associated GeoJSON object', () => {
      const position: Position[] = [[1, 2], [3, 4]];
      const points: Point[] = [
        Point.fromPosition(position[0]),
        Point.fromPosition(position[1])
      ];

      const json: SerialMultiPoint = {
        type: 'MultiPoint',
        coordinates: position
      };

      const multiPoint = CoordinateContainerBuilder.fromJson(json);

      expect(multiPoint.type).toEqual(GeoJsonGeometryTypes.MultiPoint);

      const multiPointCast = multiPoint as MultiPoint;

      expect(multiPointCast.toPositions()).toEqual(position);
      expect(multiPointCast.points).toEqual(points);

      // Optional properties & Defaults
      expect(multiPointCast.hasBBox()).toBeFalsy();
    });

    it('should make a LineString object from the associated GeoJSON object', () => {
      const position: Position[] = [[1, 2], [3, 4]];
      const points: Point[] = [
        Point.fromPosition(position[0]),
        Point.fromPosition(position[1])
      ];

      const json: SerialLineString = {
        type: 'LineString',
        coordinates: position
      };

      const lineString = CoordinateContainerBuilder.fromJson(json);

      expect(lineString.type).toEqual(GeoJsonGeometryTypes.LineString);

      const lineStringCast = lineString as LineString;

      expect(lineStringCast.toPositions()).toEqual(position);
      expect(lineStringCast.points).toEqual(points);

      // Optional properties & Defaults
      expect(lineStringCast.hasBBox()).toBeFalsy();
    });

    it('should make a MultiLineString object from the associated GeoJSON object', () => {
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

      const multiLineString = CoordinateContainerBuilder.fromJson(json);

      expect(multiLineString.type).toEqual(GeoJsonGeometryTypes.MultiLineString);

      const multiLineStringCast = multiLineString as MultiLineString;

      expect(multiLineStringCast.toPositions()).toEqual(position);
      expect(multiLineStringCast.points).toEqual(points);

      // Optional properties & Defaults
      expect(multiLineStringCast.hasBBox()).toBeFalsy();
    });

    it('should make a Polygon object from the associated GeoJSON object', () => {
      const position: Position[][] = [
        [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]
      ];
      const points: Point[][] = [
        [
          Point.fromPosition(position[0][0]),
          Point.fromPosition(position[0][1]),
          Point.fromPosition(position[0][2]),
          Point.fromPosition(position[0][3]),
          Point.fromPosition(position[0][4]),
        ],
      ];

      const json: SerialPolygon = {
        type: 'Polygon',
        coordinates: position
      };

      const polygon = CoordinateContainerBuilder.fromJson(json);

      expect(polygon.type).toEqual(GeoJsonGeometryTypes.Polygon);

      const polygonCast = polygon as Polygon;

      expect(polygonCast.toPositions()).toEqual(position);
      expect(polygonCast.points).toEqual(points);

      // Optional properties & Defaults
      expect(polygonCast.hasBBox()).toBeFalsy();
    });

    it('should make a MultiPolygon object from the associated GeoJSON object', () => {
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

      const multiPolygon = CoordinateContainerBuilder.fromJson(json);

      expect(multiPolygon.type).toEqual(GeoJsonGeometryTypes.MultiPolygon);

      const multiPolygonCast = multiPolygon as MultiPolygon;

      expect(multiPolygonCast.toPositions()).toEqual(position);
      expect(multiPolygonCast.points).toEqual(points);

      // Optional properties & Defaults
      expect(multiPolygonCast.hasBBox()).toBeFalsy();
    });

    it('should throw an InvalidGeometryException error if a non-standard GeoJSON type is provided', () => {
      const json: SerialGeometryCollection = {
        type: 'GeometryCollection',
        geometries: []
      };

      expect(() => CoordinateContainerBuilder.fromJson(json)).toThrow();
    });

    it('should throw an InvalidGeometryException error if null or undefined is provided', () => {
      expect(() => CoordinateContainerBuilder.fromJson(undefined)).toThrow();
      expect(() => CoordinateContainerBuilder.fromJson(null)).toThrow();
    });
  });
});