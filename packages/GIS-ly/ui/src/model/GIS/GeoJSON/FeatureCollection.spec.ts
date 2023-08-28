import {
  BBox as SerialBBox,
  Point as SerialPoint,
  LineString as SerialLineString,
  Feature as SerialFeature,
  FeatureCollection as SerialFeatureCollection,
} from 'geojson';

import { BBoxState, GeoJsonGeometryTypes, GeoJsonTypes } from './enums';
import { Position } from './types';
import { Feature } from './Feature';
import { LineString, MultiPoint } from './Geometries';
import { BoundingBox } from './BoundingBox';

import { FeatureCollection } from './FeatureCollection';

describe('##FeatureCollection', () => {
  let pointBBoxJson: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;
  let featurePointJson: SerialFeature;

  let lineStringBBoxJson: SerialBBox;
  let lineStringJson: SerialLineString;
  // let lineStringPoints: Point[];
  let lineStringPositions: Position[];
  let featureLineStringJson: SerialFeature;

  let featureCollectionBBoxJsonProvided: SerialBBox;
  let featureCollectionBBoxJsonActual: SerialBBox;
  // let featureCollectionBBox: SerialBBox;
  let featureCollectionJson: SerialFeatureCollection;
  // let featureCollectionPoints: Point[];
  // let featureCollectionPositions: Position[];
  let featureBBox: BoundingBox;

  beforeEach(() => {
    pointBBoxJson = [1, 2, 3, 4];
    pointPosition = [-1, -2];
    pointJson = {
      type: 'Point',
      coordinates: pointPosition
    };
    featurePointJson = {
      type: 'Feature',
      geometry: pointJson,
      properties: {}
    };

    lineStringBBoxJson = [1, 2, 3, 4];
    lineStringPositions = [[1, 2], [3, 4]];
    lineStringJson = {
      type: 'LineString',
      coordinates: lineStringPositions
    };
    featureLineStringJson = {
      type: 'Feature',
      geometry: lineStringJson,
      properties: {}
    };

    // lineStringPoints = [
    //   Point.fromPosition(lineStringPositions[0]),
    //   Point.fromPosition(lineStringPositions[1])
    // ];
    featureCollectionBBoxJsonProvided = [1, 2, 3, 4];
    featureCollectionBBoxJsonActual = [-1, -2, 3, 4];
    featureCollectionJson = {
      type: 'FeatureCollection',
      features: [featurePointJson, featureLineStringJson]
    }

    featureBBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        expect(featureCollection.type).toEqual(GeoJsonTypes.FeatureCollection);

        const features = featureCollection.features;
        expect(features.length).toEqual(2);
        expect(features[0].geometry.type).toEqual(GeoJsonTypes.Point);
        expect(features[1].geometry.type).toEqual(GeoJsonTypes.LineString);

        // Optional properties & Defaults
        expect(featureCollection.hasBBox()).toBeFalsy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        featureCollectionJson.bbox = featureCollectionBBoxJsonProvided;

        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        expect(featureCollection.type).toEqual(GeoJsonTypes.FeatureCollection);
        expect(featureCollection.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromFeatures', () => {
      let features: Feature[];
      beforeEach(() => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        features = [feature1, feature2];
      });

      it('should make an object from the associated Features', () => {
        const expectedFeatureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const featureCollection = FeatureCollection.fromFeatures(features);

        expect(featureCollection).toEqual(expectedFeatureCollection);
      });

      it('should make an object from the associated Features with a bounding box specified', () => {
        featureCollectionJson.bbox = featureCollectionBBoxJsonProvided;
        const expectedFeatureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const featureCollection = FeatureCollection.fromFeatures(features, featureBBox);

        expect(featureCollection).toEqual(expectedFeatureCollection);
      });
    });
  });

  describe('Export', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson();

        expect(result).toEqual(featureCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        featureCollectionJson.bbox = featureCollectionBBoxJsonProvided;
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson();

        expect(result).toEqual(featureCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson(BBoxState.Include);

        expect(result).not.toEqual(featureCollectionJson);

        featureCollectionJson.bbox = featureCollectionBBoxJsonActual;

        expect(result).toEqual(featureCollectionJson);
      });

      it('should make a GeoJSON object without a specified bounding box', () => {
        featureCollectionJson.bbox = featureCollectionBBoxJsonProvided;
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(featureCollectionJson);

        delete featureCollectionJson.bbox;

        expect(result).toEqual(featureCollectionJson);
      });
    });

    describe('#features', () => {
      it('should return a Features array representing the Features forming the Collection', () => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);

        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.features;

        expect(result[0]).toEqual(feature1);
        expect(result[1]).toEqual(feature2);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const featureCollectionClone = featureCollection.clone();

        expect(featureCollectionClone).toEqual(featureCollection);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);
        const featureCollectionSame = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.equals(featureCollectionSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        pointJson.coordinates = [3, 4];
        featurePointJson.geometry = pointJson;
        featureCollectionJson.features = [featurePointJson, featureLineStringJson];
        const featureCollectionDiff = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.equals(featureCollectionDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        featureCollectionJson.bbox = featureCollectionBBoxJsonProvided;
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);

        featureCollectionJson.bbox = featureCollectionBBoxJsonProvided;
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        expect(featureCollection.hasBBox()).toBeTruthy();

        const result = featureCollection.bbox();
        expect(featureCollection.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(featureCollectionBBoxJsonActual);
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        expect(featureCollection.hasBBox()).toBeFalsy();

        const result = featureCollection.bbox();
        expect(featureCollection.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });

    describe('#getGeometriesByType', () => {
      let features: Feature[];
      let featureCollection: FeatureCollection;
      beforeEach(() => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        features = [feature1, feature2];

        featureCollection = FeatureCollection.fromFeatures(features);
      });

      it('should return an empty array if there are no geometries of the specified type', () => {
        const multiPoints = featureCollection.getGeometriesByType(GeoJsonGeometryTypes.MultiPoint) as MultiPoint[];

        expect(multiPoints.length).toEqual(0);
      });

      it('should return an array of Geometries of the specified type', () => {
        const lineStrings = featureCollection.getGeometriesByType(GeoJsonGeometryTypes.LineString) as LineString[];

        expect(lineStrings.length).toEqual(1);
      });
    });

    describe('#getFeaturesByType', () => {
      let features: Feature[];
      let featureCollection: FeatureCollection;
      beforeEach(() => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        features = [feature1, feature2];

        featureCollection = FeatureCollection.fromFeatures(features);
      });

      it('should return an empty array if there are no Features containing Geometries of the specified type', () => {
        const multiPointFeatures = featureCollection.getFeaturesByType(GeoJsonGeometryTypes.MultiPoint);

        expect(multiPointFeatures.length).toEqual(0);
      });

      it('should return an array of Features containing Geometries of the specified type', () => {
        const lineStringFeatures = featureCollection.getFeaturesByType(GeoJsonGeometryTypes.LineString);

        expect(lineStringFeatures.length).toEqual(1);
      });
    });
  });

  describe('Collection Methods', () => {
    describe('#add', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#addItems', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#indexOf', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#remove', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#removeByIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#getItems', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#getByIndex', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });
});