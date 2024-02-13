import { GeoJsonObject as SerialGeoJsonObject } from "geojson";

import { BoundingBox } from "./BoundingBox";
import {
  GeoJson,
  GeoJsonBaseProperties,
  IGeoJsonBase,
  IJson
} from "./GeoJson";
import { BBoxState } from "./enums";
import { GeometryBuilder } from "./Geometries";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface GeoCollectionProperties
 * @typedef {GeoCollectionProperties}
 * @template {GeoJson} TItem
 * @extends {GeoJsonBaseProperties}
 */
export interface GeoCollectionProperties<TItem extends GeoJson> extends GeoJsonBaseProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {number}
 */
  length: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @type {TItem[]}
 */
  items: TItem[];
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface GeoCollectionMethods
 * @typedef {GeoCollectionMethods}
 * @template {GeoJson} TItem
 */
export interface GeoCollectionMethods<TItem extends GeoJson> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {number} index
 * @returns {TItem}
 */
  getByIndex(index: number): TItem;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} item
 * @returns {number}
 */
  indexOf(item: TItem): number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} item
 * @param {boolean} updateBBox
 * @returns {number}
 */
  add(item: TItem, updateBBox: boolean): number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem[]} items
 * @param {boolean} updateBBox
 * @returns {number}
 */
  addItems(items: TItem[], updateBBox: boolean): number
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} item
 * @param {boolean} updateBBox
 * @returns {(TItem | null | undefined)}
 */
  remove(item: TItem, updateBBox: boolean): TItem | null | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {number} index
 * @param {boolean} updateBBox
 * @returns {(TItem | null | undefined)}
 */
  removeByIndex(index: number, updateBBox: boolean): TItem | null | undefined;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface IGeoCollection
 * @typedef {IGeoCollection}
 * @template {GeoJson} TItem
 * @template {SerialGeoJsonObject} TSerial
 * @extends {GeoCollectionProperties<TItem>}
 * @extends {GeoCollectionMethods<TItem>}
 * @extends {IGeoJsonBase<GeoCollectionProperties<TItem>>}
 * @extends {IJson<TSerial[]>}
 */
export interface IGeoCollection<TItem extends GeoJson, TSerial extends SerialGeoJsonObject>
  extends
  GeoCollectionProperties<TItem>,
  GeoCollectionMethods<TItem>,
  IGeoJsonBase<GeoCollectionProperties<TItem>>,
  IJson<TSerial[]> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} target
 * @param {TItem} replacement
 */
  updateItem(target: TItem, replacement: TItem): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 */
  save(): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {SerialGeoJsonObject[]} json
 */
  setJson(json: SerialGeoJsonObject[]): void;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @abstract
 * @class GeoCollection
 * @typedef {GeoCollection}
 * @template {GeoJson} TItem
 * @template {SerialGeoJsonObject} TSerial
 * @implements {IGeoCollection<TItem, TSerial>}
 */
export abstract class GeoCollection<TItem extends GeoJson, TSerial extends SerialGeoJsonObject>
  implements IGeoCollection<TItem, TSerial>
{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {SerialGeoJsonObject[]}
 */
  protected _geoJson: SerialGeoJsonObject[] = [];

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {number}
 */
  protected _length: number = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @readonly
 * @type {number}
 */
  get length() {
    return this._length;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _bboxDirty: boolean = false;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {(BoundingBox | null | undefined)}
 */
  protected _bbox: BoundingBox | null | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {BoundingBox}
 */
  bbox(): BoundingBox {
    if (!this._bbox) {
      this._bbox = this.createBBox();
    }
    return this._bbox;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {boolean}
 */
  hasBBox(): boolean {
    return !!(this._bbox);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @param {boolean} [updateCache=false]
 */
  protected updateBBox(updateCache: boolean = false) {
    if (updateCache) {
      this._bbox = this.createBBox();
    } else {
      this._bbox = null;
    }
    this._bboxDirty = true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @returns {BoundingBox}
 */
  protected createBBox(): BoundingBox {
    const bboxes: any[] = [];
    this._items.forEach((item) => {
      if (item.hasBBox()) {
        bboxes.push(item.bbox().toCornerPoints());
      } else {
        bboxes.push(GeometryBuilder.getCoordinates(item));
      }
    });

    return BoundingBox.fromPoints(bboxes.flat(Infinity));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {boolean[]}
 */
  protected _itemsDirty: boolean[] = [];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {TItem[]}
 */
  protected _items: TItem[] = [];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @readonly
 * @type {TItem[]}
 */
  get items(): TItem[] {
    // Items not cloned as they should be immutable
    return [...this._items];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} target
 * @param {TItem} replacement
 * @param {boolean} [updateBBox=false]
 * @returns {boolean}
 */
  updateItem(target: TItem, replacement: TItem, updateBBox: boolean = false): boolean {
    const index = this.indexOf(target);
    if (index === -1) {
      console.log('Target item not found in collection. Target will not be updated with replacement');
      return false;
    } else {
      this._items[index] = replacement;
      this._itemsDirty[index] = true;
      this.updateBBox(updateBBox);
      return true;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 */
  save(): void {
    this._items.forEach((item, index) => {
      if (this._itemsDirty[index] && this._geoJson) {
        this._geoJson[index] = this._items[index].toJson(BBoxState.IncludeIfPresent);
        this._itemsDirty[index] = false;
      } else {
        item.save();
      }
    });
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {SerialGeoJsonObject[]} json
 */
  setJson(json: SerialGeoJsonObject[]): void {
    this._geoJson = json;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {number} index
 * @returns {TItem}
 */
  getByIndex(index: number): TItem {
    // Item not cloned as it should be immutable
    return this._items[index];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} item
 * @param {boolean} [updateBBox=false]
 * @returns {number}
 */
  add(item: TItem, updateBBox: boolean = false): number {
    const oldLength = this._items.length;
    const newLength = this._items.push(item);
    return this.addResult(oldLength, newLength, updateBBox);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem[]} items
 * @param {boolean} [updateBBox=false]
 * @returns {number}
 */
  addItems(items: TItem[], updateBBox: boolean = false): number {
    const oldLength = this._items.length;
    const newLength = this._items.push(...items);
    return this.addResult(oldLength, newLength, updateBBox);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @param {number} oldLength
 * @param {number} newLength
 * @param {boolean} updateBBox
 * @returns {number}
 */
  protected addResult(oldLength: number, newLength: number, updateBBox: boolean): number {
    if (newLength > oldLength) {
      this._length = newLength;
      // TODO: Optimization - adjust current bbox based on bbox of item
      this.updateBBox(updateBBox);
    } else {
      // TODO: Notification?
      console.log('No items were added to the collection.')
    }
    return this.length;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} item
 * @returns {number}
 */
  indexOf(item: TItem): number {
    for (let i = 0; i < this._items.length; i++) {
      if (item.equals(this._items[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {TItem} item
 * @param {boolean} [updateBBox=false]
 * @returns {(TItem | null | undefined)}
 */
  remove(item: TItem, updateBBox: boolean = false): TItem | null | undefined {
    const index = this.indexOf(item);

    return index !== -1 ? this.removeByIndex(index, updateBBox) : undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {number} index
 * @param {boolean} [updateBBox=false]
 * @returns {(TItem | null | undefined)}
 */
  removeByIndex(index: number, updateBBox: boolean = false): TItem | null | undefined {
    if (index < 0) {
      return undefined;
    }

    const item = this._items.splice(index, 1)[0];
    if (item) {
      this._length--;
      this.updateBBox(updateBBox);
    }
    return item;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {GeoCollectionProperties<TItem>} item
 * @returns {boolean}
 */
  equals(item: GeoCollectionProperties<TItem>): boolean {
    if (this.length !== item.length) {
      return false;
    }

    const items = item.items;
    for (let i = 0; i < this._items.length; i++) {
      if (!this._items[i].equals(items[i])) {
        return false;
      }
    }

    return true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @returns {IGeoJsonBase<GeoCollectionProperties<TItem>>}
 */
  abstract clone(): IGeoJsonBase<GeoCollectionProperties<TItem>>;

  /**
 * Creates an instance of GeoCollection.
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @constructor
 * @param {?BoundingBox} [bbox]
 */
  constructor(bbox?: BoundingBox) {
    if (bbox) {
      this._bbox = bbox;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {TSerial[]}
 */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): TSerial[] {
    return this._items.map((item) => item.toJson(includeBBox) as TSerial);
  }
}