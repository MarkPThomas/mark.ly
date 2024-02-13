import {
  Geometry as SerialGeometry,
  GeometryCollection as SerialGeometryCollection
} from 'geojson';

import { BBoxState, GeoJsonGeometryTypes, GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';

import { GeoJsonProperties } from '../GeoJson';
import { BoundingBox } from "../BoundingBox";
import { GeoCollection, GeoCollectionMethods } from "../GeoCollection";

import { Geometry, GeometryType } from "./Geometry";
import { CoordinateContainerBuilder } from './CoordinateContainerBuilder';


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @class GeometryCollectionDelegate
 * @typedef {GeometryCollectionDelegate}
 * @extends {GeoCollection<GeometryType, SerialGeometry>}
 */
class GeometryCollectionDelegate extends GeoCollection<GeometryType, SerialGeometry> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @returns {GeometryCollectionDelegate}
 */
  clone(): GeometryCollectionDelegate {
    const collectionDelegate = new GeometryCollectionDelegate();

    const items: any[] = [];
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
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {GeometryType[]}
 */
  getGeometriesByType(type: GeoJsonGeometryTypes): GeometryType[] {
    const geometries: GeometryType[] = [];
    this._items.forEach((item) => {
      if (item.type === type) {
        geometries.push(item);
      }
    })

    return geometries;
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @export
 * @interface GeometryCollectionProperties
 * @typedef {GeometryCollectionProperties}
 * @extends {GeoJsonProperties}
 */
export interface GeometryCollectionProperties extends GeoJsonProperties {
  /**
   * This provides the list of geometry making up this Geometry Collection.
   *
   * @return {*}  {Geometry[]}
   * @memberof IGeometryCollection
   */
  geometries: GeometryType[]
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @export
 * @interface IGeometryCollection
 * @typedef {IGeometryCollection}
 * @extends {GeometryCollectionProperties}
 * @extends {GeoCollectionMethods<GeometryType>}
 */
export interface IGeometryCollection
  extends
  GeometryCollectionProperties,
  GeoCollectionMethods<GeometryType> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {GeometryType[]}
 */
  getGeometriesByType(type: GeoJsonGeometryTypes): GeometryType[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryType} target
 * @param {GeometryType} replacement
 */
  update(target: GeometryType, replacement: GeometryType): void;
}

/**
 * A GeoJson object with TYPE "GeometryCollection" is a `Geometry` object.
A `GeometryCollection` has a member with the name "geometries". Each element of this property list is a GeoJson `Geometry` object. It is possible for this list to be empty.

Unlike the other geometry types, a `GeometryCollection` can be a heterogeneous composition of smaller Geometry objects. For example, a Geometry object in the shape of a lowercase roman "i" can be composed of one `Point` and one `LineString`.

`GeometryCollections` have a different syntax from single TYPE `Geometry` objects (`Point`, `LineString`, and `Polygon`) and homogeneously typed multipart `Geometry` objects (`MultiPoint`, `MultiLineString`, and `MultiPolygon`) but have no different semantics. Although a `GeometryCollection` object has no "coordinates" member, it does have coordinates: the coordinates of all its parts belong to the collection. The "geometries" member of a GeometryCollection describes the parts of this composition. Implementations SHOULD NOT apply any additional semantics to the "geometries" array.

To maximize interoperability, implementations SHOULD avoid nested `GeometryCollection`s. Furthermore, `GeometryCollection`s composed of a single part or a number of parts of a single TYPE SHOULD be avoided when that single part or a single object of multipart TYPE (`MultiPoint`, `MultiLineString`, or `MultiPolygon`) could be used instead.

An example of a serialized `GeometryCollection`s given below:

 {
   "type": "GeometryCollection",
   "geometries": [{
     "type": "Point",
     "coordinates": [100.0, 0.0]
   }, {
     "type": "LineString",
     "coordinates": [
       [101.0, 0.0],
       [102.0, 1.0]
     ]
   }]
 }
 *
 * @export
 * @class GeometryCollection
 * @extends {CoordinateContainer<Position[][][]>}
 * @implements {IGeometryCollection}
 */
export class GeometryCollection
  extends Geometry<GeometryCollectionProperties, SerialGeometryCollection>
  implements IGeometryCollection {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _collectionDirty: boolean = false;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @protected
 * @type {GeometryCollectionDelegate}
 */
  protected _collection: GeometryCollectionDelegate = new GeometryCollectionDelegate();

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @readonly
 * @type {GeoJsonTypes.GeometryCollection}
 */
  readonly type = GeoJsonTypes.GeometryCollection;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
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
 * @date 2/11/2024 - 6:35:29 PM
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
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @returns {boolean}
 */
  hasBBox(): boolean {
    return !!(this._bbox);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @readonly
 * @type {GeometryType[]}
 */
  get geometries(): GeometryType[] {
    return this._collection.items as GeometryType[];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeoJsonGeometryTypes} type
 * @returns {GeometryType[]}
 */
  getGeometriesByType(type: GeoJsonGeometryTypes): GeometryType[] {
    return this._collection.getGeometriesByType(type);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryType} target
 * @param {GeometryType} replacement
 * @param {boolean} [updateBBox=false]
 */
  update(target: GeometryType, replacement: GeometryType, updateBBox: boolean = false): void {
    if (this._collection.updateItem(target, replacement)) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 */
  save(): void {
    if (this._geoJson) {
      this.saveBBox();

      if (this._collectionDirty) {
        (this._geoJson as SerialGeometryCollection).geometries = this._collection.toJson();
        this._collectionDirty = false;
      } else {
        this._collection.save();
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {SerialGeometryCollection}
 */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialGeometryCollection {
    const jsonBase = super.toJsonBase(includeBBox);
    const json = {
      ...jsonBase,
      geometries: this.geometries.map((geometry) => geometry.toJson(includeBBox))
    } as SerialGeometryCollection

    return json;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @returns {GeometryType[]}
 */
  getItems(): GeometryType[] {
    return this._collection.items as GeometryType[];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {number} index
 * @returns {GeometryType}
 */
  getByIndex(index: number): GeometryType {
    return this._collection.getByIndex(index) as GeometryType;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryType} geometry
 * @param {boolean} [updateBBox=false]
 * @returns {number}
 */
  add(geometry: GeometryType, updateBBox: boolean = false): number {
    if (geometry.type === GeoJsonTypes.GeometryCollection) {
      throw new InvalidGeometryException(
        `Cannot add "${geometry.type}" to type "${GeoJsonTypes.GeometryCollection}"
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8`);
    }

    const originalLength = this._collection.length;
    const lengthResult = this._collection.add(geometry);

    if (lengthResult > originalLength) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return lengthResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryType[]} geometries
 * @param {boolean} [updateBBox=false]
 * @returns {number}
 */
  addItems(geometries: GeometryType[], updateBBox: boolean = false): number {
    geometries.forEach((geometry, index) => {
      if (geometry.type === GeoJsonTypes.GeometryCollection) {
        throw new InvalidGeometryException(
          `Cannot add "${geometry.type}" at index ${index} to type "${GeoJsonTypes.GeometryCollection}"
          \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8`);
      }
    });

    const originalLength = this._collection.length;
    const lengthResult = this._collection.addItems(geometries);

    if (lengthResult > originalLength) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return lengthResult;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryType} item
 * @returns {number}
 */
  indexOf(item: GeometryType): number {
    return this._collection.indexOf(item);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryType} item
 * @param {boolean} [updateBBox=false]
 * @returns {GeometryType}
 */
  remove(item: GeometryType, updateBBox: boolean = false): GeometryType {
    const removedItem = this._collection.remove(item, updateBBox) as GeometryType;

    if (removedItem) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return removedItem;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {number} index
 * @param {boolean} [updateBBox=false]
 * @returns {GeometryType}
 */
  removeByIndex(index: number, updateBBox: boolean = false): GeometryType {
    const removedItem = this._collection.removeByIndex(index, updateBBox) as GeometryType;

    if (removedItem) {
      this._collectionDirty = true;
      this.updateBBox(updateBBox);
    }

    return removedItem;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @param {GeometryCollection} geometryCollection
 * @returns {boolean}
 */
  equals(geometryCollection: GeometryCollection): boolean {
    return this._collection.equals(geometryCollection._collection);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @returns {GeometryCollection}
 */
  clone(): GeometryCollection {
    return GeometryCollection.fromGeometries(this._collection.clone().items as GeometryType[], this._bbox);
  }

  /**
 * Creates an instance of GeometryCollection.
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() {
    super();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @static
 * @param {SerialGeometryCollection} json
 * @returns {GeometryCollection}
 */
  static fromJson(json: SerialGeometryCollection): GeometryCollection {
    const bbox = json.bbox ? BoundingBox.fromJson(json.bbox) : undefined
    const geometries = json.geometries.map((geometry) => CoordinateContainerBuilder.fromJson(geometry)) as GeometryType[];

    const geometryCollection = GeometryCollection.fromGeometries(geometries, bbox);
    geometryCollection._bbox = bbox;

    geometryCollection._geoJson = json;
    geometryCollection._collection.setJson(json.geometries);
    if (bbox) {
      geometryCollection._bboxDirty = false;
    }

    return geometryCollection;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @static
 * @param {GeometryType[]} geometries
 * @param {?(BoundingBox | null)} [bbox]
 * @returns {GeometryCollection}
 */
  static fromGeometries(geometries: GeometryType[], bbox?: BoundingBox | null): GeometryCollection {
    const geometryCollection = new GeometryCollection();

    geometries.forEach((geometry) => {
      if (geometry.type === GeoJsonTypes.GeometryCollection) {
        throw new InvalidGeometryException(
          `Invalid Geometry for "${GeoJsonTypes.GeometryCollection}".
          Geometry cannot be a GeometryCollection as nested GeometryCollections are to be avoided.`);
      }
      geometryCollection.add(geometry.clone());
    });
    geometryCollection._bbox = bbox;

    return geometryCollection;
  }
}