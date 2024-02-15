import {
  Feature as SerialFeature,
  FeatureCollection as SerialFeatureCollection
} from 'geojson';

import { BoundingBox } from "./BoundingBox";
import { GeoCollection, GeoCollectionMethods } from "./GeoCollection";
import { Feature } from "./Feature";
import { GeoJson, GeoJsonProperties } from "./GeoJson";
import { BBoxState, GeoJsonGeometryTypes, GeoJsonTypes } from "./enums";
import { Geometry } from './geometries';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @class FeatureCollectionDelegate
 * @typedef {FeatureCollectionDelegate}
 * @extends {GeoCollection<Feature, SerialFeature>}
 */
class FeatureCollectionDelegate extends GeoCollection<Feature, SerialFeature> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {FeatureCollectionDelegate}
 */
  clone(): FeatureCollectionDelegate {
    const collectionDelegate = new FeatureCollectionDelegate();

    const items: Feature[] = [];
    this._items.forEach((item) => {
      items.push(item.clone());
    })
    collectionDelegate._items = items;

    collectionDelegate._length = this._length;

    if (this._bbox) {
      collectionDelegate._bbox = this._bbox;
    }

    return collectionDelegate;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {Feature[]}
 */
  getFeaturesByType(type: GeoJsonGeometryTypes): Feature[] {
    const features: Feature[] = [];
    this._items.forEach((item) => {
      if (item.geometry.type === type) {
        features.push(item);
      }
    });

    return features;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {Geometry[]}
 */
  getGeometriesByType(type: GeoJsonGeometryTypes): Geometry[] {
    const geometries: Geometry[] = [];
    this._items.forEach((item) => {
      if (item.geometry.type === type) {
        geometries.push(item.geometry as unknown as Geometry);
      }
    });

    return geometries;
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @export
 * @interface FeatureCollectionProperties
 * @typedef {FeatureCollectionProperties}
 * @extends {GeoJsonProperties}
 */
export interface FeatureCollectionProperties extends GeoJsonProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @type {Feature[]}
 */
  features: Feature[];
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @export
 * @interface IFeatureCollection
 * @typedef {IFeatureCollection}
 * @extends {FeatureCollectionProperties}
 * @extends {GeoCollectionMethods<Feature>}
 */
export interface IFeatureCollection
  extends
  FeatureCollectionProperties,
  GeoCollectionMethods<Feature> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {Feature[]}
 */
  getFeaturesByType(type: GeoJsonGeometryTypes): Feature[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {Geometry[]}
 */
  getGeometriesByType(type: GeoJsonGeometryTypes): Geometry[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {Feature} target
 * @param {Feature} replacement
 */
  update(target: Feature, replacement: Feature): void;
}

/**
 * This represents a GeoJson Feature Collection which holds a list of Feature objects (when serialized the feature list becomes a JSON array).
Note that the feature list could potentially be empty. Features within the list must follow the specifications defined inside the Feature class.

An example of a Feature Collections given below:

 {
   "type": "FeatureCollection",
   "bbox": [100.0, 0.0, -100.0, 105.0, 1.0, 0.0],
   "features": [
     //...
   ]
 }
 *
 * @export
 * @class FeatureCollection
 * @implements {IGeoJSON}
 */
export class FeatureCollection
  extends GeoJson
  implements IFeatureCollection {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _collectionDirty: boolean = false;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @protected
 * @type {FeatureCollectionDelegate}
 */
  protected _collection: FeatureCollectionDelegate = new FeatureCollectionDelegate();

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @readonly
 * @type {GeoJsonTypes.FeatureCollection}
 */
  readonly type = GeoJsonTypes.FeatureCollection;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {BoundingBox}
 */
  bbox(): BoundingBox {
    if (!this._bbox) {
      this.updateBBox(true);
    }
    return this._bbox!;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @protected
 * @param {boolean} [updateCache=false]
 */
  protected updateBBox(updateCache: boolean = false) {
    if (updateCache) {
      this._bbox = this._collection.bbox();
    } else {
      this._bbox = null;
    }
    this._bboxDirty = true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {boolean}
 */
  hasBBox(): boolean {
    return !!(this._bbox);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @readonly
 * @type {Feature[]}
 */
  get features(): Feature[] {
    return this._collection.items as Feature[];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {Feature[]}
 */
  getFeaturesByType(type: GeoJsonGeometryTypes): Feature[] {
    return this._collection.getFeaturesByType(type);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {Geometry[]}
 */
  getGeometriesByType(type: GeoJsonGeometryTypes): Geometry[] {
    return this._collection.getGeometriesByType(type);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {Feature} target
 * @param {Feature} replacement
 * @param {boolean} [updateBBox=false]
 */
  update(target: Feature, replacement: Feature, updateBBox: boolean = false): void {
    if (this._collection.updateItem(target, replacement)) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 */
  save(): void {
    if (this._geoJson) {
      this.saveBBox();

      if (this._collectionDirty) {
        (this._geoJson as SerialFeatureCollection).features = this._collection.toJson();
        this._collectionDirty = false;
      } else {
        this._collection.save();
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {SerialFeatureCollection}
 */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialFeatureCollection {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      features: this.features.map((feature) => feature.toJson(includeBBox))
    } as SerialFeatureCollection

    return json;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {Feature[]}
 */
  getItems(): Feature[] {
    return this._collection.items as Feature[];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {number} index
 * @returns {Feature}
 */
  getByIndex(index: number): Feature {
    return this._collection.getByIndex(index) as Feature;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {Feature} feature
 * @param {boolean} [updateBBox=false]
 * @returns {number}
 */
  add(feature: Feature, updateBBox: boolean = false): number {
    const originalLength = this._collection.length;
    const lengthResult = this._collection.add(feature);

    if (lengthResult > originalLength) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return lengthResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {Feature[]} features
 * @param {boolean} [updateBBox=false]
 * @returns {number}
 */
  addItems(features: Feature[], updateBBox: boolean = false): number {
    const originalLength = this._collection.length;
    const lengthResult = this._collection.addItems(features);

    if (lengthResult > originalLength) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return lengthResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {Feature} feature
 * @returns {number}
 */
  indexOf(feature: Feature): number {
    return this._collection.indexOf(feature);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {Feature} feature
 * @param {boolean} [updateBBox=false]
 * @returns {Feature}
 */
  remove(feature: Feature, updateBBox: boolean = false): Feature {
    const removedItem = this._collection.remove(feature, updateBBox) as Feature;

    if (removedItem) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return removedItem;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {number} index
 * @param {boolean} [updateBBox=false]
 * @returns {Feature}
 */
  removeByIndex(index: number, updateBBox: boolean = false): Feature {
    const removedItem = this._collection.removeByIndex(index) as Feature;

    if (removedItem) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return removedItem;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @param {FeatureCollection} featureCollection
 * @returns {boolean}
 */
  equals(featureCollection: FeatureCollection): boolean {
    return this._collection.equals(featureCollection._collection);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @returns {FeatureCollection}
 */
  clone(): FeatureCollection {
    return FeatureCollection.fromFeatures(this._collection.clone().items as Feature[], this._bbox);
  }

  /**
 * Creates an instance of FeatureCollection.
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() {
    super();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @static
 * @param {SerialFeatureCollection} json
 * @returns {FeatureCollection}
 */
  static fromJson(json: SerialFeatureCollection): FeatureCollection {
    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined

    const features = json.features.map((feature) => Feature.fromJson(feature));
    const featureCollection = FeatureCollection.fromFeatures(features, bbox);

    featureCollection._geoJson = json;
    featureCollection._collection.setJson(json.features);
    if (bbox) {
      featureCollection._bboxDirty = false;
    }

    return featureCollection;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @static
 * @param {Feature[]} features
 * @param {?(BoundingBox | null)} [bbox]
 * @returns {FeatureCollection}
 */
  static fromFeatures(features: Feature[], bbox?: BoundingBox | null): FeatureCollection {
    const featureCollection = new FeatureCollection();
    featureCollection.addItems(features);
    featureCollection._bbox = bbox;

    return featureCollection;
  }
}