import { GeoJsonProperties as SerialGeoJsonProperties } from 'geojson';

import { FeatureProperty } from './FeatureProperty';

describe('##FeatureProperty', () => {
  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an empty object from null, undefined, or an empty object', () => {
        const propertiesJson: SerialGeoJsonProperties = {};

        const properties = FeatureProperty.fromJson(propertiesJson);
        expect(Object.keys(properties).length).toEqual(0);

        const propertiesNull = FeatureProperty.fromJson(null);
        expect(Object.keys(propertiesNull).length).toEqual(0);

        const propertiesUndefined = FeatureProperty.fromJson(undefined);
        expect(Object.keys(propertiesUndefined).length).toEqual(0);
      });

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

  describe('Common Interfaces', () => {
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

      it('should return False for objects that are not equal by certain properties', () => {
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