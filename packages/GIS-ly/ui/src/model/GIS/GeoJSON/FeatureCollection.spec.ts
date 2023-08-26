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
  let featureCollectionJson: SerialFeatureCollection;
  beforeEach(() => {
    const lineStringPosition: Position[] = [[1, 2], [3, 4]];
    const lineStringJson: SerialLineString = {
      type: 'LineString',
      coordinates: lineStringPosition
    };
    const featureLineStringJson: SerialFeature = {
      type: 'Feature',
      geometry: lineStringJson,
      properties: {}
    };

    const pointPosition: Position = [-1, -2];
    const pointJson: SerialPoint = {
      type: 'Point',
      coordinates: pointPosition
    };
    const featurePointJson: SerialFeature = {
      type: 'Feature',
      geometry: pointJson,
      properties: {}
    };

    featureCollectionJson = {
      type: 'FeatureCollection',
      features: [featurePointJson, featureLineStringJson]
    }
  });

  describe('Static Factory Methods', () => {
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
  });
});