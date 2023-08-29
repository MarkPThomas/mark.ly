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

export interface GeoCollectionProperties<TItem extends GeoJson> extends GeoJsonBaseProperties {
  length: number;
  items: TItem[];
}

export interface GeoCollectionMethods<TItem extends GeoJson> {
  getByIndex(index: number): TItem;
  indexOf(item: TItem): number;
  add(item: TItem, updateBBox: boolean): number;
  addItems(items: TItem[], updateBBox: boolean): number
  remove(item: TItem, updateBBox: boolean): TItem | null;
  removeByIndex(index: number, updateBBox: boolean): TItem | null;
}

export interface IGeoCollection<TItem extends GeoJson, TSerial extends SerialGeoJsonObject>
  extends
  GeoCollectionProperties<TItem>,
  GeoCollectionMethods<TItem>,
  IGeoJsonBase<GeoCollectionProperties<TItem>>,
  IJson<TSerial[]> {
}

export abstract class GeoCollection<TItem extends GeoJson, TSerial extends SerialGeoJsonObject>
  implements IGeoCollection<TItem, TSerial>
{
  protected _length: number = 0;
  get length() {
    return this._length;
  }

  protected _bbox: BoundingBox;
  bbox(): BoundingBox {
    if (!this._bbox) {
      this._bbox = this.createBBox();
    }
    return this._bbox;
  }

  hasBBox(): boolean {
    return !!(this._bbox);
  }

  protected updateBBox(updateCache: boolean = false) {
    if (updateCache) {
      this._bbox = this.createBBox();
    } else {
      this._bbox = null;
    }
  }

  protected createBBox(): BoundingBox {
    const bboxes = [];
    this._items.forEach((item) => {
      if (item.hasBBox()) {
        bboxes.push(item.bbox().toCornerPoints());
      } else {
        bboxes.push(GeometryBuilder.getCoordinates(item));
      }
    });

    return BoundingBox.fromPoints(bboxes.flat(Infinity));
  }

  protected _items: TItem[] = [];
  get items(): TItem[] {
    // Items not cloned as they should be immutable
    return [...this._items];
  }

  getByIndex(index: number): TItem {
    // Item not cloned as it should be immutable
    return this._items[index];
  }

  add(item: TItem, updateBBox: boolean = false): number {
    const oldLength = this._items.length;
    const newLength = this._items.push(item);
    return this.addResult(oldLength, newLength, updateBBox, [item]);
  }

  addItems(items: TItem[], updateBBox: boolean = false): number {
    const oldLength = this._items.length;
    const newLength = this._items.push(...items);
    return this.addResult(oldLength, newLength, updateBBox, items);
  }

  protected addResult(oldLength: number, newLength: number, updateBBox: boolean, items: TItem[]): number {
    if (oldLength !== newLength) {
      this._length = newLength;
      // TODO: Optimization - adjust current bbox based on bbox of item
      this.updateBBox(updateBBox);
    } else {
      // TODO: Notification?
      console.log('No items were added to the collection.')
    }
    return this.length;
  }

  indexOf(item: TItem): number {
    for (let i = 0; i < this._items.length; i++) {
      if (item.equals(this._items[i])) {
        return i;
      }
    }
    return -1;
  }

  remove(item: TItem, updateBBox: boolean = false): TItem | null {
    const index = this.indexOf(item);

    return index !== -1 ? this.removeByIndex(index, updateBBox) : undefined;
  }

  removeByIndex(index: number, updateBBox: boolean = false): TItem | null {
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

  abstract clone(): IGeoJsonBase<GeoCollectionProperties<TItem>>;

  constructor(bbox?: BoundingBox) {
    if (bbox) {
      this._bbox = bbox;
    }
  }

  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): TSerial[] {
    return this._items.map((item) => item.toJson(includeBBox) as TSerial);
  }
}