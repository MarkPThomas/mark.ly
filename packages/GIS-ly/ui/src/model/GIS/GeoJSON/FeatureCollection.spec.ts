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
  let pointBBoxJsonProvided: SerialBBox;
  let pointBBoxJsonActual: SerialBBox;
  let pointJson: SerialPoint;
  let pointPosition: Position;
  let featurePointJson: SerialFeature;

  let lineStringBBoxJsonProvided: SerialBBox;
  let lineStringBBoxJsonActual: SerialBBox;
  let lineStringJson: SerialLineString;
  let lineStringPositions: Position[];
  let featureLineStringJson: SerialFeature;

  let featureCollectionBBoxJsonProvided: SerialBBox;
  let featureCollectionBBoxJsonActual: SerialBBox;
  let featureCollectionJson: SerialFeatureCollection;
  let featureBBox: BoundingBox;

  beforeEach(() => {
    pointBBoxJsonProvided = [1, 2, 3, 4];
    pointBBoxJsonActual = [-1.5, -2.5, -0.5, -1.5];
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

    lineStringBBoxJsonProvided = [2, 3, 4, 5];
    lineStringBBoxJsonActual = [1, 2, 3, 4];
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

    featureCollectionBBoxJsonProvided = [4, 3, 2, 1];
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
        featureCollectionJson.features[0].bbox = pointBBoxJsonActual;
        featureCollectionJson.features[0].geometry.bbox = pointBBoxJsonActual;
        featureCollectionJson.features[1].bbox = lineStringBBoxJsonActual;
        featureCollectionJson.features[1].geometry.bbox = lineStringBBoxJsonActual;

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

      it('should return an empty array if there are no features of the specified type', () => {
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
      it('should add an item to the collection', () => {
        const featureCollection = FeatureCollection.fromFeatures([]);
        const feature = Feature.fromJson(featureLineStringJson);

        expect(featureCollection.features.length).toEqual(0);

        const result = featureCollection.add(feature);
        expect(result).toEqual(1);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(feature);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const featureCollection = FeatureCollection.fromFeatures([], boundingBox);
        const feature = Feature.fromJson(featureLineStringJson);

        expect(featureCollection.hasBBox()).toBeTruthy();

        featureCollection.add(feature);

        expect(featureCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);

        const lineStringBBoxJson: SerialBBox = [1, 2, 3, 4];
        const boundingBoxActual = BoundingBox.fromJson(lineStringBBoxJson);

        const featureCollection = FeatureCollection.fromFeatures([], boundingBoxProvided);
        const feature = Feature.fromJson(featureLineStringJson);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxProvided);

        featureCollection.add(feature, true);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxActual);
      });
    });

    describe('#addItems', () => {
      it('should do nothing if an empty array is provided', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const feature = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature], boundingBox);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(feature);
        expect(featureCollection.hasBBox()).toBeTruthy();

        const result = featureCollection.addItems([]);
        expect(result).toEqual(1);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(feature);
        expect(featureCollection.hasBBox()).toBeTruthy();
      });

      it('should add all items to the collection', () => {
        const featureCollection = FeatureCollection.fromFeatures([]);

        expect(featureCollection.features.length).toEqual(0);

        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);

        const result = featureCollection.addItems([feature1, feature2]);
        expect(result).toEqual(2);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const featureCollection = FeatureCollection.fromFeatures([], boundingBox);

        expect(featureCollection.hasBBox()).toBeTruthy();

        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);

        featureCollection.addItems([feature1, feature2]);

        expect(featureCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(featureCollectionBBoxJsonActual);

        const featureCollection = FeatureCollection.fromFeatures([], boundingBoxProvided);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxProvided);

        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);

        featureCollection.addItems([feature1, feature2], true);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxActual);
      });
    });

    describe('#indexOf', () => {
      it('should return -1 if the item is not found', () => {
        const featureMissing = Feature.fromJson(featurePointJson);
        const featurePresent = Feature.fromJson(featureLineStringJson);

        const featureCollection = FeatureCollection.fromFeatures([featurePresent]);

        const result = featureCollection.indexOf(featureMissing);

        expect(result).toEqual(-1);
      });

      it('should return the index of the present item sought', () => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);

        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2]);

        const result = featureCollection.indexOf(feature2);

        expect(result).toEqual(1);
      });
    });

    describe('#remove', () => {
      it('should do nothing if the item to be removed is not in the collection', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const featureMissing = Feature.fromJson(featurePointJson);
        const featurePresent = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([featurePresent], boundingBox);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(featurePresent);
        expect(featureCollection.hasBBox()).toBeTruthy();

        const result = featureCollection.remove(featureMissing);

        expect(result).toBeUndefined();

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(featurePresent);
        expect(featureCollection.hasBBox()).toBeTruthy();
      });

      it('should remove an item from the collection', () => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2]);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);

        const result = featureCollection.remove(feature2);

        expect(result).toEqual(feature2);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(feature1);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2], boundingBox);

        expect(featureCollection.hasBBox()).toBeTruthy();

        featureCollection.remove(feature2);

        expect(featureCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(lineStringBBoxJsonActual);
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2], boundingBoxProvided);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxProvided);

        featureCollection.remove(feature1, true);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxActual);
      });
    });

    describe('#removeByIndex', () => {
      it('should do nothing if the index is negative', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const featurePresent = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([featurePresent], boundingBox);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(featurePresent);
        expect(featureCollection.hasBBox()).toBeTruthy();

        const result = featureCollection.removeByIndex(-1);

        expect(result).toBeUndefined();

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(featurePresent);
        expect(featureCollection.hasBBox()).toBeTruthy();
      });

      it('should do nothing if the index greater than the max index', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const featurePresent = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([featurePresent], boundingBox);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(featurePresent);
        expect(featureCollection.hasBBox()).toBeTruthy();

        const result = featureCollection.removeByIndex(featureCollection.features.length);

        expect(result).toBeUndefined();

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(featurePresent);
        expect(featureCollection.hasBBox()).toBeTruthy();
      });

      it('should remove an item from the collection', () => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2]);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);

        const result = featureCollection.removeByIndex(1);

        expect(result).toEqual(feature2);

        expect(featureCollection.features.length).toEqual(1);
        expect(featureCollection.features[0]).toEqual(feature1);
      });

      it('should reset the Bounding Box to null by default', () => {
        const boundingBox = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2], boundingBox);

        expect(featureCollection.hasBBox()).toBeTruthy();

        featureCollection.removeByIndex(1);

        expect(featureCollection.hasBBox()).toBeFalsy();
      });

      it('should update the Bounding Box as specified', () => {
        const boundingBoxProvided = BoundingBox.fromJson(featureCollectionBBoxJsonProvided);
        const boundingBoxActual = BoundingBox.fromJson(lineStringBBoxJsonActual);
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2], boundingBoxProvided);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxProvided);

        featureCollection.removeByIndex(0, true);

        expect(featureCollection.hasBBox()).toBeTruthy();
        expect(featureCollection.bbox()).toEqual(boundingBoxActual);
      });
    });

    describe('#getItems', () => {
      it('should return all of the Geometries in the collection', () => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2]);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);

        const result = featureCollection.getItems();

        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(feature1);
        expect(result[1]).toEqual(feature2);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);
      });
    });

    describe('#getByIndex', () => {
      it('should return undefined if the index is negative', () => {
        const featurePresent = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([featurePresent]);

        const result = featureCollection.getByIndex(-1);

        expect(result).toBeUndefined();
      });

      it('should return undefined if the index is greater than the max index', () => {
        const featurePresent = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([featurePresent]);

        const result = featureCollection.getByIndex(featureCollection.features.length);

        expect(result).toBeUndefined();
      });

      it('should return the item at the specified index', () => {
        const feature1 = Feature.fromJson(featurePointJson);
        const feature2 = Feature.fromJson(featureLineStringJson);
        const featureCollection = FeatureCollection.fromFeatures([feature1, feature2]);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);

        const result = featureCollection.getByIndex(1);

        expect(result).toEqual(feature2);

        expect(featureCollection.features.length).toEqual(2);
        expect(featureCollection.features[0]).toEqual(feature1);
        expect(featureCollection.features[1]).toEqual(feature2);
      });
    });
  });
});