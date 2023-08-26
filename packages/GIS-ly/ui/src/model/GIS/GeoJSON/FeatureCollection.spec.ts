import {
  BBox as SerialBBox,
  Point as SerialPoint,
  LineString as SerialLineString,
  Feature as SerialFeature,
  FeatureCollection as SerialFeatureCollection,
} from 'geojson';

import { GeoJsonTypes } from './enums';
import { Position } from './types';

import { FeatureCollection } from './FeatureCollection';

describe('##Feature', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
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

        const pointPosition: Position = [1, 2];
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
      })

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
    describe('#hasAltitude', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#toJson', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });
});