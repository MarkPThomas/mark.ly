import {
  BBox as SerialBBox,
  LineString as SerialLineString,
  GeoJsonProperties as SerialGeoJsonProperties,
  Feature as SerialFeature,
} from 'geojson';

import { BBoxState, GeoJsonTypes } from './enums';
import { Position } from './types';
import { LineString } from './Geometries';
import { BoundingBox } from './BoundingBox';
import { FeatureProperty, FeaturePropertyProperties } from './FeatureProperty';

import { Feature } from './Feature';

describe('##Feature', () => {
  let lineStringBBoxJsonProvided: SerialBBox;
  let lineStringBBoxJsonActual: SerialBBox;
  let lineStringJson: SerialLineString;
  let lineStringPositions: Position[];

  let propertiesFeatureJson: SerialGeoJsonProperties;

  let featureJson: SerialFeature;
  let featureBBox: BoundingBox;

  beforeEach(() => {
    lineStringBBoxJsonProvided = [2, 3, 4, 5];
    lineStringBBoxJsonActual = [1, 2, 3, 4];
    lineStringPositions = [[1, 2], [3, 4]];
    lineStringJson = {
      type: 'LineString',
      coordinates: lineStringPositions
    };

    propertiesFeatureJson = {
      foo: 'bar',
      moo: 2
    };

    featureJson = {
      type: 'Feature',
      geometry: lineStringJson,
      properties: {}
    };

    featureBBox = BoundingBox.fromPositions(lineStringPositions);
  });

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});

        // Optional properties & Defaults
        expect(feature.hasBBox()).toBeFalsy();
      });

      it('should make an object with properties from the associated GeoJSON object', () => {
        featureJson.properties = propertiesFeatureJson;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();

        const properties: FeaturePropertyProperties = {
          foo: 'bar',
          moo: 2
        }

        expect(feature.properties).toEqual(properties);
      });

      it('should make an object with an ID from the associated GeoJSON object', () => {
        featureJson.id = 1;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.properties).toEqual({});
        expect(feature.hasBBox()).toBeFalsy();

        expect(feature.id).toEqual('1');
      });

      it('should make an object from the associated GeoJSON object with a bounding box specified', () => {
        featureJson.bbox = lineStringBBoxJsonProvided;

        const feature = Feature.fromJson(featureJson);

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});

        expect(feature.hasBBox()).toBeTruthy();
      });
    });

    describe('#fromGeometry', () => {
      it('should make an object from the associated Geometry', () => {
        const expectedFeature = Feature.fromJson(featureJson);

        const geometry = LineString.fromJson(lineStringJson);
        const feature = Feature.fromGeometry(geometry);

        expect(feature.equals(expectedFeature)).toBeTruthy();
      });

      it('should make an object with properties from the associated Geometry', () => {
        const propertiesFeature: FeatureProperty = FeatureProperty.fromJson(propertiesFeatureJson);

        const geometry = LineString.fromJson(lineStringJson);
        const feature = Feature.fromGeometry(geometry, { properties: propertiesFeature });

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();

        const properties: FeaturePropertyProperties = {
          foo: 'bar',
          moo: 2
        }

        expect(feature.properties).toEqual(properties);
      });

      it('should make an object with an ID from the associated Geometry', () => {
        const geometry = LineString.fromJson(lineStringJson);
        const feature = Feature.fromGeometry(geometry, { id: '1' });

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.properties).toEqual({});
        expect(feature.hasBBox()).toBeFalsy();

        expect(feature.id).toEqual('1');
      });

      it('should make an object from the associated Geometry with a bounding box specified', () => {
        const geometry = LineString.fromJson(lineStringJson);
        const feature = Feature.fromGeometry(geometry, { bbox: featureBBox });

        expect(feature.type).toEqual(GeoJsonTypes.Feature);
        expect(feature.id).toBeNull();
        expect(feature.properties).toEqual({});

        expect(feature.hasBBox()).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object', () => {
        const feature = Feature.fromJson(featureJson);

        const result = feature.toJson();

        expect(result).toEqual(featureJson);
      });

      it('should make a GeoJSON object with an ID', () => {
        featureJson.id = '1';
        const feature = Feature.fromJson(featureJson);

        const result = feature.toJson();

        expect(result).toEqual(featureJson);
      });

      it('should make a GeoJSON object with properties', () => {
        const propertiesJson: SerialGeoJsonProperties = {
          foo: 'bar',
          moo: 2
        };
        featureJson.properties = propertiesJson;
        const feature = Feature.fromJson(featureJson);

        const result = feature.toJson();

        expect(result).toEqual(featureJson);
      });

      it('should make a GeoJSON object with a bounding box specified', () => {
        featureJson.bbox = lineStringBBoxJsonProvided;
        const feature = Feature.fromJson(featureJson);

        const result = feature.toJson();

        expect(result).toEqual(featureJson);
      });

      it('should make a GeoJSON object with a bounding box created', () => {
        const feature = Feature.fromJson(featureJson);

        const result = feature.toJson(BBoxState.Include);

        expect(result).not.toEqual(featureJson);

        featureJson.bbox = lineStringBBoxJsonActual;
        featureJson.geometry.bbox = lineStringBBoxJsonActual;

        expect(result).toEqual(featureJson);
      });

      it('should make a GeoJSON object without a bounding box specified', () => {
        featureJson.bbox = lineStringBBoxJsonProvided;
        const feature = Feature.fromJson(featureJson);

        const result = feature.toJson(BBoxState.Exclude);

        expect(result).not.toEqual(featureJson);

        delete featureJson.bbox;
        delete featureJson.geometry.bbox;

        expect(result).toEqual(featureJson);
      });
    });

    describe('#geometry', () => {
      it('should return a Geometry object representing the Feature', () => {
        const geometry = LineString.fromJson(lineStringJson);
        const feature = Feature.fromJson(featureJson);

        const result = feature.geometry;

        expect(result).toEqual(geometry);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object', () => {
        const feature = Feature.fromJson(featureJson);

        const featureClone = feature.clone();

        expect(featureClone.equals(feature)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties', () => {
        const feature = Feature.fromJson(featureJson);
        const featureSame = Feature.fromJson(featureJson);

        const result = feature.equals(featureSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by geometry', () => {
        const feature = Feature.fromJson(featureJson);

        lineStringJson.coordinates = [[1, 2], [5, 6]];
        featureJson.geometry = lineStringJson;
        const featureDiff = Feature.fromJson(featureJson);

        const result = feature.equals(featureDiff);
        expect(result).toBeFalsy();
      });

      it('should return False for objects that are not equal by properties', () => {
        featureJson.properties = { foo: 'bar' };
        const feature = Feature.fromJson(featureJson);

        featureJson.properties = { bar: 'foo' };
        const featureDiff = Feature.fromJson(featureJson);

        const result = feature.equals(featureDiff);
        expect(result).toBeFalsy();
      });

      it('should return False for objects that are not equal by id', () => {
        featureJson.id = '1';
        const feature = Feature.fromJson(featureJson);

        featureJson.id = '2';
        const featureDiff = Feature.fromJson(featureJson);

        const result = feature.equals(featureDiff);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Methods', () => {
    describe('#hasBBox', () => {
      it('should return False if no Bounding Box is present', () => {
        const feature = Feature.fromJson(featureJson);

        const result = feature.hasBBox();

        expect(result).toBeFalsy();
      });

      it('should return True if a Bounding Box is present', () => {
        featureJson.bbox = lineStringBBoxJsonProvided;
        const feature = Feature.fromJson(featureJson);

        const result = feature.hasBBox();

        expect(result).toBeTruthy();
      });
    });

    describe('#bbox', () => {
      it('should return the currently present Bounding Box', () => {
        const bboxExpected = BoundingBox.fromJson(lineStringBBoxJsonProvided);

        featureJson.bbox = lineStringBBoxJsonProvided;
        const feature = Feature.fromJson(featureJson);

        expect(feature.hasBBox()).toBeTruthy();

        const result = feature.bbox();
        expect(feature.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });

      it('should generate a new Bounding Box from Geometry Points if one is not already present', () => {
        const bboxExpected = BoundingBox.fromJson(lineStringBBoxJsonActual);
        const feature = Feature.fromJson(featureJson);

        expect(feature.hasBBox()).toBeFalsy();

        const result = feature.bbox();
        expect(feature.hasBBox()).toBeTruthy();

        expect(result).toEqual(bboxExpected);
      });
    });

    describe('#setGeometry', () => {
      it('should replace geometry in a feature', () => {
        const feature = Feature.fromJson(featureJson);

        const geometry = LineString.fromJson(lineStringJson);

        feature.setGeometry(geometry);

        expect(feature.geometry.equals(geometry)).toBeTruthy();


        lineStringJson.coordinates = [[5, 6], [7, 8]];
        const geometryReplaced = LineString.fromJson(lineStringJson);

        feature.setGeometry(geometryReplaced);

        expect(feature.geometry.equals(geometryReplaced)).toBeTruthy();
      });

      it('should add properties to a feature', () => {
        const feature = Feature.fromJson(featureJson);

        expect(feature.properties).toEqual({});

        const geometry = LineString.fromJson(lineStringJson);
        const properties = FeatureProperty.fromJson({
          foo: 'bar',
          moo: 2
        });

        feature.setGeometry(geometry, properties);

        expect(feature.properties).toEqual(properties);
      });

      it('should replace properties to a filled feature', () => {
        featureJson.properties = propertiesFeatureJson;
        const feature = Feature.fromJson(featureJson);

        const propertiesExpected = FeatureProperty.fromJson(propertiesFeatureJson);

        expect(feature.properties).toEqual(propertiesExpected);

        const geometry = LineString.fromJson(lineStringJson);
        const propertiesReplace = FeatureProperty.fromJson({
          foo: 'mar',
          moo: 3
        });

        feature.setGeometry(geometry, propertiesReplace);

        expect(feature.properties).toEqual(propertiesReplace);
      });

      it('should reset an existing Bounding Box in a filled feature', () => {
        const feature = Feature.fromJson(featureJson);
        feature.bbox();

        expect(feature.hasBBox()).toBeTruthy();

        const geometry = LineString.fromJson(lineStringJson);

        feature.setGeometry(geometry);

        expect(feature.hasBBox()).toBeFalsy();
      });
    });

    describe('#save', () => {
      it('should do nothing for objects not instantiated by a GeoJSON object', () => {
        const geometry = LineString.fromJson(lineStringJson);
        const feature = Feature.fromGeometry(geometry);

        expect(featureJson.bbox).toBeUndefined();
        expect(feature.hasBBox()).toBeFalsy();

        const bbox = feature.bbox();
        expect(featureJson.bbox).toBeUndefined();
        expect(feature.hasBBox()).toBeTruthy();

        feature.save();
        expect(featureJson.bbox).toBeUndefined();
      });

      it('should propagate updates in the object bounding box to the original GeoJSON object', () => {
        const feature = Feature.fromJson(featureJson);

        expect(featureJson.bbox).toBeUndefined();
        expect(feature.hasBBox()).toBeFalsy();

        const bbox = feature.bbox();
        expect(featureJson.bbox).toBeUndefined();
        expect(feature.hasBBox()).toBeTruthy();

        feature.save();
        expect(featureJson.bbox).toEqual(bbox.toJson());
      });

      it('should propagate updates in the object geometry', () => {
        const feature = Feature.fromJson(featureJson);
        const featureGeometryJson = featureJson.geometry as SerialLineString;

        expect(featureGeometryJson.coordinates).toEqual(lineStringPositions);

        const newLineStringPositions = [[5, 6], [7, 8]];
        const newLineStringJson: SerialLineString = {
          type: 'LineString',
          coordinates: newLineStringPositions
        };
        const geometryReplaced = LineString.fromJson(newLineStringJson);
        feature.setGeometry(geometryReplaced);

        expect(feature.geometry.equals(geometryReplaced)).toBeTruthy();
        expect(featureGeometryJson.coordinates).toEqual(lineStringPositions);

        feature.save();

        const expectedFeatureGeometryJson = featureJson.geometry as SerialLineString;
        expect(expectedFeatureGeometryJson.coordinates).toEqual(newLineStringPositions);
      });

      it('should propagate updates in the object properties', () => {
        const initialPropertiesJson = {
          foo: 'bar',
          moo: 2
        };
        const initialProperties = FeatureProperty.fromJson(initialPropertiesJson);
        featureJson.properties = initialProperties;
        const feature = Feature.fromJson(featureJson);

        expect(featureJson.properties).toEqual(initialPropertiesJson);

        const newPropertiesJson = {
          foo: 'foo',
          moo: 2
        };
        const newProperties = FeatureProperty.fromJson(newPropertiesJson);
        feature.setGeometry(feature.geometry, newProperties);

        expect(featureJson.properties).toEqual(initialPropertiesJson);

        feature.save();

        expect(featureJson.properties).toEqual(newPropertiesJson);
      });
    });
  });
});