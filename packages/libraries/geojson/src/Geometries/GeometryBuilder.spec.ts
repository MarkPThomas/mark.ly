import {
  BBox as SerialBBox,
  Geometry as SerialGeometry,
  Point as SerialPoint,
  MultiPoint as SerialMultiPoint,
  LineString as SerialLineString,
  MultiLineString as SerialMultiLineString,
  Polygon as SerialPolygon,
  MultiPolygon as SerialMultiPolygon,
  GeometryCollection as SerialGeometryCollection,
  Feature as SerialFeature,
  FeatureCollection as SerialFeatureCollection
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
import { GeometryCollection } from './GeometryCollection';

import { GeometryBuilder } from './GeometryBuilder';
import { GeometryType, IGeometry } from './Geometry';
import { GeoJsonProperties } from '../GeoJson';
import { Feature } from '../Feature';
import { FeatureCollection } from '../FeatureCollection';

describe('##GeometryBuilder', () => {
  describe('#fromJson', () => {
    it('should make a GeometryCollection of a Point object and LineString object from the associated GeoJSON object', () => {
      const pointPosition: Position = [1, 2];
      const pointJson: SerialPoint = {
        type: 'Point',
        coordinates: pointPosition
      };

      const lineStringPosition: Position[] = [[1, 2], [3, 4]];
      const lineStringJson: SerialLineString = {
        type: 'LineString',
        coordinates: lineStringPosition
      };

      const geometryCollectionJson: SerialGeometryCollection = {
        type: 'GeometryCollection',
        geometries: [pointJson, lineStringJson]
      };

      const geometryCollection = GeometryBuilder.fromJson(geometryCollectionJson);

      expect(geometryCollection.type).toEqual(GeoJsonGeometryTypes.GeometryCollection);

      const geometryCollectionCast = geometryCollection as GeometryCollection;
      const geometriesResult = geometryCollectionCast.geometries;
      expect(geometriesResult.length).toEqual(2);
      expect(geometriesResult[0].type).toEqual(GeoJsonGeometryTypes.Point);
      expect(geometriesResult[1].type).toEqual(GeoJsonGeometryTypes.LineString);

      // Optional properties & Defaults
      expect(geometryCollection.hasBBox()).toBeFalsy();
    });

    it('should make a GeometryCollection from the associated GeoJSON object with a bounding box specified', () => {
      const bbox: SerialBBox = [1, 2, 3, 4];

      const pointPosition: Position = [1, 2];
      const pointJson: SerialPoint = {
        type: 'Point',
        coordinates: pointPosition
      };

      const lineStringPosition: Position[] = [[1, 2], [3, 4]];
      const lineStringJson: SerialLineString = {
        type: 'LineString',
        coordinates: lineStringPosition
      };

      const geometryCollectionJson: SerialGeometryCollection = {
        type: 'GeometryCollection',
        bbox: bbox,
        geometries: [pointJson, lineStringJson]
      };

      const geometryCollection = GeometryBuilder.fromJson(geometryCollectionJson);

      expect(geometryCollection.hasBBox()).toBeTruthy();
    });

    it('should make a Point object from the associated GeoJSON object', () => {
      const position: Position = [1, 2];

      const json: SerialPoint = {
        type: 'Point',
        coordinates: position
      };

      const point = GeometryBuilder.fromJson(json);

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

    it('should throw an InvalidGeometryException error if null or undefined is provided', () => {
      expect(() => GeometryBuilder.fromJson(undefined)).toThrow();
      expect(() => GeometryBuilder.fromJson(null)).toThrow();
    });
  });

  describe('#getCoordinates', () => {
    it('should get coordinates for a Point geometry', () => {
      const pointJson: SerialPoint = {
        type: 'Point',
        coordinates: [-1, -2]
      };
      const point: IGeometry<GeoJsonProperties, SerialGeometry> = Point.fromJson(pointJson);

      const expectedPoints = [Point.fromPosition(pointJson.coordinates as Position)];

      const points = GeometryBuilder.getCoordinates(point);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a MultiPoint geometry', () => {
      const multiPointJson: SerialMultiPoint = {
        type: 'MultiPoint',
        coordinates: [[1, 2], [3, 4]]
      };
      const multiPoint: IGeometry<GeoJsonProperties, SerialGeometry> = MultiPoint.fromJson(multiPointJson);

      const expectedPoints = (multiPointJson.coordinates as Position[]).map((coordinate: Position) => Point.fromPosition(coordinate));

      const points = GeometryBuilder.getCoordinates(multiPoint);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a LineString geometry', () => {
      const lineStringJson: SerialLineString = {
        type: 'LineString',
        coordinates: [[1, 2], [3, 4]]
      };
      const lineString: IGeometry<GeoJsonProperties, SerialGeometry> = LineString.fromJson(lineStringJson);

      const expectedPoints = (lineStringJson.coordinates as Position[]).map((coordinate: Position) => Point.fromPosition(coordinate));

      const points = GeometryBuilder.getCoordinates(lineString);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a MultiLineString geometry', () => {
      const multiLineStringJson: SerialMultiLineString = {
        type: 'MultiLineString',
        coordinates: [[[1, 2], [3, 4]]]
      };
      const multiLineString: IGeometry<GeoJsonProperties, SerialGeometry> = MultiLineString.fromJson(multiLineStringJson);

      const expectedPoints = (multiLineStringJson.coordinates.flat(1) as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );

      const points = GeometryBuilder.getCoordinates(multiLineString);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a Polygon geometry', () => {
      const polygonJson: SerialPolygon = {
        type: 'Polygon',
        coordinates: [[[3, 4], [-3, 3], [-3, -4], [3, -3], [3, 4]]]
      };
      const polygon: IGeometry<GeoJsonProperties, SerialGeometry> = Polygon.fromJson(polygonJson);

      const expectedPoints = (polygonJson.coordinates.flat(1) as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );

      const points = GeometryBuilder.getCoordinates(polygon);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a MultiPolygon geometry', () => {
      const multiPolygonJson: SerialMultiPolygon = {
        type: 'MultiPolygon',
        coordinates: [
          [[[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]]],
          [[[6, 6], [5, 6], [5, 5], [6, 5], [6, 6]]],
        ]
      };
      const multiPolygon: IGeometry<GeoJsonProperties, SerialGeometry> = MultiPolygon.fromJson(multiPolygonJson);

      const expectedPoints = (multiPolygonJson.coordinates.flat(2) as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );

      const points = GeometryBuilder.getCoordinates(multiPolygon);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a GeometryCollection geometry', () => {
      const geometryCollectionJson: SerialGeometryCollection = {
        type: 'GeometryCollection',
        geometries: [{
          type: 'Point',
          coordinates: [-1, -2]
        }, {
          type: 'LineString',
          coordinates: [[1, 2], [3, 4]]
        }]
      }
      const geometryCollection: IGeometry<GeoJsonProperties, SerialGeometry> = GeometryCollection.fromJson(geometryCollectionJson);

      const expectedPoints = ([[-1, -2], [1, 2], [3, 4]] as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );

      const points = GeometryBuilder.getCoordinates(geometryCollection);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a Feature containing a MultiPoint geometry', () => {
      const featureJson: SerialFeature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPoint',
          coordinates: [[1, 2], [3, 4]]
        }
      };
      const feature: Feature = Feature.fromJson(featureJson);

      const expectedPoints = ((featureJson.geometry as SerialMultiPoint).coordinates as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );

      const points = GeometryBuilder.getCoordinates(feature);

      expect(points).toEqual(expectedPoints);
    });

    it('should get coordinates for a FeatureCollection geometry', () => {
      const featureCollectionJson: SerialFeatureCollection = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {
            _gpxType: 'trk', //trk
            name: 'FooTrack',
            time: 'BarTime', //timestamp
            coordinateProperties: {
              times: [ // MultiLineString
                [ // LineString
                  'Foo1',
                  'Foo2'
                ]
              ]
            }
          },
          geometry: {
            type: 'MultiPoint',
            coordinates: [[1, 2], [3, 4]]
          }
        }, {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[[3, 4], [-3, 3], [-3, -4], [3, -3], [3, 4]]]
          }
        }]
      };
      const featureCollection: FeatureCollection = FeatureCollection.fromJson(featureCollectionJson);

      const expectedMultiPointPoints = ((featureCollectionJson.features[0].geometry as SerialMultiPoint).coordinates as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );
      const expectedPolygonPoints = ((featureCollectionJson.features[1].geometry as SerialPolygon).coordinates.flat(1) as Position[]).map(
        (coordinate: Position) => Point.fromPosition(coordinate)
      );
      const expectedPoints = expectedMultiPointPoints.concat(expectedPolygonPoints);

      const points = GeometryBuilder.getCoordinates(featureCollection);

      expect(points).toEqual(expectedPoints);
    });

    //// TODO: Not sure how to test, or if this case is even possible?
    // it('should return an empty array for any type that is not a Feature or Geometry', () => {
    //   const otherJson: IGeometry<GeometryType, SerialGeometry> = {
    //     type: 'Other',
    //     coordinates: [[1, 2], [3, 4]]
    //   };

    //   const other: FeatureCollection = FeatureCollection.fromJson(otherJson);


    //   const points = GeometryBuilder.getCoordinates(other);

    //   expect(points).toEqual([]);
    // });
  });
});