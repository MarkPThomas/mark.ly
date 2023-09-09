import {
  Feature as SerialFeature,
  FeatureCollection as SerialFeatureCollection
} from 'geojson';

import { BoundingBox } from "./BoundingBox";
import { GeoCollection, GeoCollectionMethods } from "./GeoCollection";
import { Feature } from "./Feature";
import { GeoJson, GeoJsonProperties } from "./GeoJson";
import { BBoxState, GeoJsonGeometryTypes, GeoJsonTypes } from "./enums";
import { Geometry } from './Geometries';

class FeatureCollectionDelegate extends GeoCollection<Feature, SerialFeature> {
  clone(): FeatureCollectionDelegate {
    const featureCollectionDelegate = new FeatureCollectionDelegate();

    featureCollectionDelegate._items = this._items;
    featureCollectionDelegate._length = this._length;
    if (this._bbox) {
      featureCollectionDelegate._bbox = this._bbox;
    }

    return featureCollectionDelegate;
  }

  getFeaturesByType(type: GeoJsonGeometryTypes): Feature[] {
    const features = [];
    this._items.forEach((item) => {
      if (item.geometry.type === type) {
        features.push(item);
      }
    });

    return features;
  }

  getGeometriesByType(type: GeoJsonGeometryTypes): Geometry[] {
    const geometries = [];
    this._items.forEach((item) => {
      if (item.geometry.type === type) {
        geometries.push(item.geometry);
      }
    });

    return geometries;
  }
}

export interface FeatureCollectionProperties extends GeoJsonProperties {
  features: Feature[];
}

export interface IFeatureCollection
  extends
  FeatureCollectionProperties,
  GeoCollectionMethods<Feature> {

  getFeaturesByType(type: GeoJsonGeometryTypes): Feature[];
  getGeometriesByType(type: GeoJsonGeometryTypes): Geometry[];
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

  protected _collectionDirty: boolean;
  protected _collection: FeatureCollectionDelegate = new FeatureCollectionDelegate();

  readonly type = GeoJsonTypes.FeatureCollection;

  bbox(): BoundingBox {
    if (!this._bbox) {
      this.updateBBox(true);
    }
    return this._bbox;
  }

  protected updateBBox(updateCache: boolean = false) {
    if (updateCache) {
      this._bbox = this._collection.bbox();
    } else {
      this._bbox = null;
    }
    this._bboxDirty = true;
  }

  hasBBox(): boolean {
    return !!(this._bbox);
  }

  get features(): Feature[] {
    return this._collection.items as Feature[];
  }

  getFeaturesByType(type: GeoJsonGeometryTypes): Feature[] {
    return this._collection.getFeaturesByType(type);
  }

  getGeometriesByType(type: GeoJsonGeometryTypes): Geometry[] {
    return this._collection.getGeometriesByType(type);
  }

  update(target: Feature, replacement: Feature): void {
    this._collection.updateItem(target, replacement);
    this._collectionDirty = true;
  }

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

  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialFeatureCollection {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      features: this.features.map((feature) => feature.toJson(includeBBox))
    } as SerialFeatureCollection

    return json;
  }

  getItems(): Feature[] {
    return this._collection.items as Feature[];
  }

  getByIndex(index: number): Feature {
    return this._collection.getByIndex(index) as Feature;
  }

  add(feature: Feature, updateBBox: boolean = false): number {
    const originalLength = this._collection.length;
    const lengthResult = this._collection.add(feature);

    if (lengthResult > originalLength) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return lengthResult;
  }

  addItems(features: Feature[], updateBBox: boolean = false): number {
    const originalLength = this._collection.length;
    const lengthResult = this._collection.addItems(features);

    if (lengthResult > originalLength) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return lengthResult;
  }

  indexOf(feature: Feature): number {
    return this._collection.indexOf(feature);
  }

  remove(feature: Feature, updateBBox: boolean = false): Feature {
    const removedItem = this._collection.remove(feature, updateBBox) as Feature;

    if (removedItem) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return removedItem;
  }

  removeByIndex(index: number, updateBBox: boolean = false): Feature {
    const removedItem = this._collection.removeByIndex(index) as Feature;

    if (removedItem) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return removedItem;
  }

  equals(featureCollection: FeatureCollection): boolean {
    return this._collection.equals(featureCollection._collection);
  }

  clone(): FeatureCollection {
    return FeatureCollection.fromFeatures(this._collection.items as Feature[], this._bbox);
  }

  protected constructor() {
    super();
  }

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

  static fromFeatures(features: Feature[], bbox?: BoundingBox): FeatureCollection {
    const featureCollection = new FeatureCollection();
    featureCollection.addItems(features);
    featureCollection._bbox = bbox;

    return featureCollection;
  }
}

// // from FeatureCollection<Geometry, {[name: string]: any;}>
// type MyFeatureCollection = {
//   type: string // FeatureCollection
//   // bbox?: BBox[] // of n x n dimensions for lower-left-bottom & upper-right-top corners
//   features: [
//     {
//       type: string, // Feature
//       // bbox?: BBox[] // of n x n dimensions for lower-left-bottom & upper-right-top corners
//       geometry: {
//         type: string, // 'MultiLineString',
//         // array of track segments, each as an array of coord properties
//         //    each of which is an array of 3 indices:
//         //      0 = longitude
//         //      1 = latitude
//         //      2 = elevation (m)
//         coordinates: string[][][]
//       },
//       properties: {
//         _gpxType: string, //trk
//         name: string,
//         time: string, //timestamp
//         coordinateProperties: {
//           // array of track segments, each as an array of timestamps for each coord
//           times: string[][]
//         }
//       },
//     }
//   ],
// }