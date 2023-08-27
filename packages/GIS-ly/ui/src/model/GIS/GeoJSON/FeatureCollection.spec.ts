import {
  BBox as SerialBBox,
  Point as SerialPoint,
  LineString as SerialLineString,
  Feature as SerialFeature,
  FeatureCollection as SerialFeatureCollection,
} from 'geojson';

import { BBoxState, GeoJsonTypes } from './enums';
import { Position } from './types';

import { FeatureCollection } from './FeatureCollection';

describe('##Feature', () => {
  let pointBBoxJson: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;
  let featurePointJson: SerialFeature;

  let lineStringBBoxJson: SerialBBox;
  let lineStringJson: SerialLineString;
  // let lineStringPoints: Point[];
  let lineStringPositions: Position[];
  let featureLineStringJson: SerialFeature;

  // let featureCollectionBBox: SerialBBox;
  let featureCollectionJson: SerialFeatureCollection;
  // let featureCollectionPoints: Point[];
  // let featureCollectionPositions: Position[];

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

    featureCollectionJson = {
      type: 'FeatureCollection',
      features: [featurePointJson, featureLineStringJson]
    }
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
        const bbox: SerialBBox = [1, 2, 3, 4];
        featureCollectionJson.bbox = bbox;

        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        expect(featureCollection.type).toEqual(GeoJsonTypes.FeatureCollection);
        expect(featureCollection.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromFeatures', () => {
      it('should', () => {

      });

      it('should', () => {

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
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        featureCollectionJson.bbox = bboxJson;
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson();

        expect(result).toEqual(featureCollectionJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson(BBoxState.Include);

        expect(result).not.toEqual(featureCollectionJson);

        const bboxJson: SerialBBox = [-1, -2, 3, 4];
        featureCollectionJson.bbox = bboxJson;

        expect(result).toEqual(featureCollectionJson);
      });

      it('should make a GeoJSON object without a specified bounding box', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        featureCollectionJson.bbox = bboxJson;
        const featureCollection = FeatureCollection.fromJson(featureCollectionJson);

        const result = featureCollection.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(featureCollectionJson);

        delete featureCollectionJson.bbox;

        expect(result).toEqual(featureCollectionJson);
      });
    });

    describe('#features', () => {
      it('should return a Features array representing the Features forming the Collection', () => {
        // const multiLineString = MultiLineString.fromJson(multiLineStringJson);

        // const result = multiLineString.lineStrings;

        // expect(result).toEqual(multiLineStringLineStrings);
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

    describe('#getGeometriesByType', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#getFeaturesByType', () => {
      it('should', () => {

      });

      it('should', () => {

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