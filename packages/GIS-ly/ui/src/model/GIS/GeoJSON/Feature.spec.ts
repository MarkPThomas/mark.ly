import {
  BBox as SerialBBox,
  LineString as SerialLineString,
  GeoJsonProperties as SerialGeoJsonProperties,
  Feature as SerialFeature,
} from 'geojson';

import { GeoJsonTypes } from './enums';
import { Position } from './types';

import { Feature, FeatureProperty, FeaturePropertyProperties } from './Feature';
import { BoundingBox } from './BoundingBox';

describe('##FeatureProperty', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const propertiesJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };

        const properties = FeatureProperty.fromJson(propertiesJson);

        expect(properties['foo']).toEqual('bar');
        expect(properties['moo']).toEqual(2);
      });
    });
  });

  describe('Main Interface Tests', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const propertiesJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };
        const properties = FeatureProperty.fromJson(propertiesJson);

        const propertiesClone = properties.clone();

        expect(propertiesClone).toEqual(properties);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const propertiesJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };
        const properties = FeatureProperty.fromJson(propertiesJson);

        const propertiesSameJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };
        const propertiesSame = FeatureProperty.fromJson(propertiesSameJson);

        const result = properties.equals(propertiesSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are equal by certain properties', () => {
        const propertiesJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };
        const properties = FeatureProperty.fromJson(propertiesJson);

        const propertiesDiffValJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 3
        };
        const propertiesDiffVal = FeatureProperty.fromJson(propertiesDiffValJson);

        const resultDiffVal = properties.equals(propertiesDiffVal);
        expect(resultDiffVal).toBeFalsy();


        const propertiesDiffPropJson: SerialGeoJsonProperties = {
          bar: 'foo',
          moo: 3
        };
        const propertiesDiffProp = FeatureProperty.fromJson(propertiesDiffPropJson);

        const resultDiffProp = properties.equals(propertiesDiffProp);
        expect(resultDiffProp).toBeFalsy();


        const propertiesDiffPropNumJson: SerialGeoJsonProperties = {
          foo: 'bar',
        };
        const propertiesDiffPropNum = FeatureProperty.fromJson(propertiesDiffPropNumJson);

        const resultDiffPropNum = properties.equals(propertiesDiffPropNum);
        expect(resultDiffPropNum).toBeFalsy();
      });
    });
  });
});

describe('##Feature', () => {
  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      let featureJson: SerialFeature;
      beforeEach(() => {
        const lineStringPosition: Position[] = [[1, 2], [3, 4]];
        const lineStringJson: SerialLineString = {
          type: 'LineString',
          coordinates: lineStringPosition
        };

        featureJson = {
          type: 'Feature',
          geometry: lineStringJson,
          properties: {}
        };
      })

      it('should make an object from the associated GeoJSON object', () => {
        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});

        // Optional properties & Defaults
        expect(feature.hasBBox()).toBeFalsy();
      });

      it('should make an object with properties from the associated GeoJSON object', () => {
        const propertiesJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };
        featureJson.properties = propertiesJson;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();

        const properties: FeaturePropertyProperties = {
          foo: 'bar',
          moo: 2
        }

        expect(feature.properties).toEqual(properties);
      });

      it('should make an object with an id from the associated GeoJSON object', () => {
        featureJson.id = 1;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.properties).toEqual({});
        expect(feature.hasBBox()).toBeFalsy();

        expect(feature.id).toEqual('1');
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        const bbox: SerialBBox = [1, 2, 3, 4];
        featureJson.bbox = bbox;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});

        expect(feature.hasBBox()).toBeTruthy();
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified in the contained Geometry object', () => {
        const bbox: SerialBBox = [1, 2, 3, 4];
        featureJson.geometry.bbox = bbox;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});

        expect(feature.hasBBox()).toBeTruthy();
      });

      it(`should make an object from the associated GeoJSON object with a bounding box specified
          in the contained Geometry object governing over one specified at the Feature level`, () => {

        const bboxFeature: SerialBBox = [1, 2, 3, 4];
        featureJson.bbox = bboxFeature;

        const bboxGeometry: SerialBBox = [5, 6, 7, 8];
        featureJson.geometry.bbox = bboxGeometry;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});
        expect(feature.hasBBox()).toBeTruthy();

        const boundingBoxFeature = BoundingBox.fromJson(bboxFeature);
        expect(feature.bbox()).not.toEqual(boundingBoxFeature);

        const boundingBoxGeometry = BoundingBox.fromJson(bboxGeometry);
        expect(feature.bbox()).toEqual(boundingBoxGeometry);
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

    describe('#fromJson', () => {
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