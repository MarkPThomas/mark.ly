import { LatLngBoundsExpression, LatLngExpression, LatLngLiteral } from "leaflet";
import { Coordinates } from "./Coordinate";
import { LatLngLiterals } from "./GeoJSON";

export interface IBoundingBox {
  latTop: number,
  latBottom: number,
  lngLeft: number,
  lngRight: number,
}

export class BoundingBox implements IBoundingBox {
  latTop: number;
  latBottom: number;
  lngLeft: number;
  lngRight: number;

  constructor(coords: LatLngLiterals | Coordinates) {
    const boundingBox = BoundingBox.getBoundingBox(coords);
    this.latTop = boundingBox[1][0];
    this.latBottom = boundingBox[0][0];
    this.lngLeft = boundingBox[0][1];
    this.lngRight = boundingBox[1][0];
  }

  static getBoundingBox(coords: LatLngLiterals | Coordinates): LatLngBoundsExpression | LatLngExpression {
    let minLat = Infinity;
    let minLong = Infinity;
    let maxLat = -Infinity;
    let maxLong = -Infinity;

    function setBounds(coord: LatLngLiteral) {
      minLat = Math.min(minLat, coord.lat);
      minLong = Math.min(minLong, coord.lng);

      maxLat = Math.max(maxLat, coord.lat);
      maxLong = Math.max(maxLong, coord.lng);
    }

    if ((coords as any[]).length) {
      if ((coords as any[][])[0].length) {
        if ((coords as any[][][])[0][0].length) {
          coords = coords as LatLngLiteral[][][];
          for (let polygon = 0; polygon < coords.length; polygon++) {
            for (let segment = 0; segment < coords[polygon].length; segment++) {
              for (let coord = 0; coord < coords[polygon][segment].length; coord++) {
                setBounds(coords[polygon][segment][coord]);
              }
            }
          }
        } else {
          coords = coords as LatLngLiteral[][];
          for (let segment = 0; segment < coords.length; segment++) {
            for (let coord = 0; coord < coords[segment].length; coord++) {
              setBounds(coords[segment][coord]);
            }
          }
        }
      } else {
        coords = coords as LatLngLiteral[];
        for (let coord = 0; coord < coords.length; coord++) {
          setBounds(coords[coord]);
        }
      }
    } else {
      coords = coords as LatLngLiteral;
      return [coords.lat, coords.lng];
    }

    return [[minLat, minLong], [maxLat, maxLong]];
  }
}