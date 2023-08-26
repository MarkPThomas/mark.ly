import {
  BBox as SerialBBox,
  Geometry as SerialGeometry,
  GeometryCollection as SerialGeometryCollection
} from 'geojson';

import { GeoJsonGeometryTypes, GeoJsonTypes } from "../enums";
import { InvalidGeometryException } from '../exceptions';

import { GeoJsonProperties } from '../GeoJson';
import { BoundingBox } from "../BoundingBox";
import { GeoCollection, GeoCollectionMethods } from "../GeoCollection";

import { Geometry, GeometryType } from "./Geometry";
import { CoordinateContainerBuilder } from './CoordinateContainerBuilder';


class GeometryCollectionDelegate extends GeoCollection<GeometryType, SerialGeometry> {
  clone(): GeometryCollectionDelegate {
    const featureCollectionDelegate = new GeometryCollectionDelegate();

    featureCollectionDelegate._items = this._items;
    featureCollectionDelegate._length = this._length;
    if (this._bbox) {
      featureCollectionDelegate._bbox = this._bbox;
    }

    return featureCollectionDelegate;
  }

  getGeometriesByType(type: GeoJsonGeometryTypes): GeometryType[] {
    const geometries = [];
    this._items.forEach((item) => {
      if (item.type === type) {
        geometries.push(item);
      }
    })

    return geometries;
  }
}

export interface GeometryCollectionProperties extends GeoJsonProperties {
  /**
   * This provides the list of geometry making up this Geometry Collection.
   *
   * @return {*}  {Geometry[]}
   * @memberof IGeometryCollection
   */
  geometries: GeometryType[]
}

export interface IGeometryCollection
  extends
  GeometryCollectionProperties,
  GeoCollectionMethods<GeometryType> {

  getGeometriesByType(type: GeoJsonGeometryTypes): GeometryType[];
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

  protected _collection: GeometryCollectionDelegate = new GeometryCollectionDelegate();

  readonly type = GeoJsonTypes.GeometryCollection;

  bbox(): BoundingBox {
    return this._collection.bbox();
  }
  hasBBox(): boolean {
    return this._collection.hasBBox();
  }

  get geometries(): GeometryType[] {
    return this._collection.items as GeometryType[];
  }

  getGeometriesByType(type: GeoJsonGeometryTypes): GeometryType[] {
    return this._collection.getGeometriesByType(type);
  }

  toJson(includeBoundingBox: boolean = false): SerialGeometryCollection {
    const jsonBase = super.toJsonBase(includeBoundingBox);
    const json = {
      ...jsonBase,
      geometries: this.geometries.map((geometry) => geometry.toJson(includeBoundingBox))
    } as SerialGeometryCollection

    return json;
  }

  getItems(): GeometryType[] {
    return this._collection.items as GeometryType[];
  }

  getByIndex(index: number): GeometryType {
    return this._collection.getByIndex(index) as GeometryType;
  }

  add(geometry: GeometryType, updateBBox: boolean = false): number {
    if (geometry.type === GeoJsonTypes.GeometryCollection) {
      throw new InvalidGeometryException(
        `Cannot add "${geometry.type}" to type "${GeoJsonTypes.GeometryCollection}"
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8`);
    }
    return this._collection.add(geometry, updateBBox);
  }

  addItems(geometries: GeometryType[]): number {
    geometries.forEach((geometry, index) => {
      if (geometry.type === GeoJsonTypes.GeometryCollection) {
        throw new InvalidGeometryException(
          `Cannot add "${geometry.type}" at index ${index} to type "${GeoJsonTypes.GeometryCollection}"
          \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8`);
      }
    })

    return this._collection.addItems(geometries);
  }

  indexOf(item: GeometryType): number {
    return this._collection.indexOf(item);
  }

  remove(item: GeometryType, updateBBox: boolean = false): GeometryType {
    return this._collection.remove(item, updateBBox) as GeometryType;
  }

  removeByIndex(index: number, updateBBox: boolean = false): GeometryType {
    return this._collection.removeByIndex(index, updateBBox) as GeometryType;
  }

  equals(geometryCollection: GeometryCollection): boolean {
    return this._collection.equals(geometryCollection._collection);
  }

  clone(): GeometryCollection {
    return GeometryCollection.fromGeometries(this._collection.items as GeometryType[], this._bbox);
  }

  protected constructor() {
    super();
  }

  static fromJson(json: SerialGeometry[], bboxJSon?: SerialBBox): GeometryCollection {
    if (!json) {
      throw new InvalidGeometryException(
        `Invalid Geometries for "${GeoJsonTypes.GeometryCollection}". Must an array of GeoJSON "Geometry" objects.
        \n See: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8
        \n ${JSON.stringify(json)}`);
    }

    const bbox = bboxJSon ? BoundingBox.fromJson(bboxJSon) : undefined
    const geometryTypes = json.map((geometry) => CoordinateContainerBuilder.fromJson(geometry)) as GeometryType[];

    const multiPolygon = GeometryCollection.fromGeometries(geometryTypes, bbox);

    return multiPolygon;
  }

  static fromGeometries(geometries: GeometryType[], bbox?: BoundingBox): GeometryCollection {
    const geometryCollection = new GeometryCollection();

    geometries.forEach((geometry) => {
      geometryCollection.add(geometry.clone());
    });
    geometryCollection._bbox = bbox;

    return geometryCollection;
  }
}