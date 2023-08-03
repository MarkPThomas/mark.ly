import {
  Feature,
  FeatureCollection,
  Geometry,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Position,
  GeoJSON
} from 'geojson';
import { LatLng, LatLngBoundsExpression, LatLngExpression, LatLngLiteral } from 'leaflet';

export type GeoJSONFeatureCollection = FeatureCollection<Geometry, { [name: string]: any; }>;

type CoordinateIndex = {
  coordIndex: number,
  segmentIndex?: number,
  polygonIndex?: number,
};

export class Coordinate extends LatLng {
  timeStamp?: string
  indices?: CoordinateIndex
}

export type Coordinates = Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];
export type LatLngLiterals = LatLngLiteral | LatLngLiteral[] | LatLngLiteral[][] | LatLngLiteral[][][];

type CoordinateProperties = {
  position: Position,
  indices?: CoordinateIndex,
  timeStamp?: string
}

function getCoordinate({ position, indices, timeStamp }: CoordinateProperties) {
  const coordinate = new Coordinate(position[1], position[0], position[2]);

  if (timeStamp) {
    coordinate.timeStamp = timeStamp;
  }

  if (indices) {
    coordinate.indices = indices;
  }

  return coordinate;
}

export function getCoords(geoJson: GeoJSONFeatureCollection) {
  if (geoJson.features[0].geometry) {
    const geometryType = geoJson.features[0].geometry.type;
    let coordinatesPosition: Position | Position[] | Position[][] | Position[][][];
    switch (geometryType) {
      case 'Point':
        coordinatesPosition = (geoJson.features[0].geometry as Point).coordinates;
        const coordinate = getCoordinate(
          {
            position: coordinatesPosition,
            timeStamp: geoJson.features[0].properties?.coordinateProperties?.times
          }
        );

        return coordinate;
      case 'MultiPoint':
      case 'LineString':
        coordinatesPosition = (geoJson.features[0].geometry as MultiPoint).coordinates;
        const coordinates: Coordinate[] = [];
        for (let coordIndex = 0; coordIndex < coordinatesPosition.length; coordIndex++) {
          const coordinate = getCoordinate(
            {
              position: coordinatesPosition[coordIndex],
              indices: {
                coordIndex
              },
              timeStamp: geoJson.features[0].properties?.coordinateProperties?.times[coordIndex]
            }
          );

          coordinates.push(coordinate);
        }
        return coordinates;
      case 'MultiLineString':
      case 'Polygon':
        coordinatesPosition = (geoJson.features[0].geometry as MultiLineString).coordinates;
        const segments: Coordinate[][] = [];
        for (let segmentIndex = 0; segmentIndex < coordinatesPosition.length; segmentIndex++) {
          const coordinates: Coordinate[] = [];
          for (let coordIndex = 0; coordIndex < coordinatesPosition[segmentIndex].length; coordIndex++) {
            const coordinate = getCoordinate(
              {
                position: coordinatesPosition[segmentIndex][coordIndex],
                indices: {
                  coordIndex,
                  segmentIndex
                },
                timeStamp: geometryType === "MultiLineString"
                  ? geoJson.features[0].properties?.coordinateProperties?.times[segmentIndex][coordIndex]
                  : null
              }
            );

            coordinates.push(coordinate);
          }
          segments.push(coordinates);
        }
        return segments;
      case 'MultiPolygon':
        coordinatesPosition = (geoJson.features[0].geometry as MultiPolygon).coordinates;
        const polygons: Coordinate[][][] = [];
        for (let polygonIndex = 0; polygonIndex < coordinatesPosition.length; polygonIndex++) {
          const segments: Coordinate[][] = [];
          for (let segmentIndex = 0; segmentIndex < coordinatesPosition[polygonIndex].length; segmentIndex++) {
            const coordinates: Coordinate[] = [];
            for (let coordIndex = 0; coordIndex < coordinatesPosition[polygonIndex][segmentIndex].length; coordIndex++) {
              const coordinate = getCoordinate(
                {
                  position: coordinatesPosition[polygonIndex][segmentIndex][coordIndex],
                  indices: {
                    coordIndex,
                    segmentIndex,
                    polygonIndex
                  }
                }
              );

              coordinates.push(coordinate);
            }
            segments.push(coordinates);
          }
          polygons.push(segments);
        }
        return polygons;
    }
  }
}

export function getBoundingBox(coords: LatLngLiterals | Coordinates): LatLngBoundsExpression | LatLngExpression {
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

export function mergeTackSegments(geoJson: GeoJSONFeatureCollection) {
  const geometryType = geoJson.features[0].geometry.type;
  if (geometryType !== 'MultiLineString') {
    return geoJson;
  }

  const coordinates = (geoJson.features[0].geometry as MultiLineString).coordinates;
  const mergedCoords = coordinates.flat(1) as Position[];
  geoJson.features[0].geometry = {
    type: 'LineString',
    coordinates: mergedCoords
  }

  const timestamps = geoJson.features[0].properties?.coordinateProperties?.times;
  if (timestamps) {
    const mergedTimestamps = timestamps.flat(2) as string[];
    geoJson.features[0].properties.coordinateProperties.times = mergedTimestamps;
  }

  return geoJson;
}

export function clipTrackSegmentsBySize(geoJson: GeoJSONFeatureCollection) {
  // determine triggering distance
  // search over nodes and check distances
  // if distance > allowed, note node pair
  // for all node pairs > allowed distance, keep single largest node count
  //    alternate: return each set as a segment for the user to choose what to keep


}

export function clipTrackSegmentBeforeCoord(
  geoJson: GeoJSONFeatureCollection,
  coord: Coordinate
) {
  // Iterate over coordinates until matching coordinate found
  // split coords array at point
  // Return/replace w/ 2nd part of array
}

export function clipTrackSegmentAfterCoord(
  geoJson: GeoJSONFeatureCollection,
  coord: Coordinate
) {
  // Iterate over coordinates until matching coordinate found
  // split coords array at point
  // Return/replace w/ 2nd part of array
}

// export function splitTrackSegmentByCoord(
//   geoJson: GeoJSONFeatureCollection,
//   coord: Coordinate
// ) {

// }

// export function splitTrackSegmentBySpeed(
//   geoJson: GeoJSONFeatureCollection,
//   maxSpeed: number
// ) {

// }

// export function smoothTrackSegmentBetweenCoords(
//   geoJson: GeoJSONFeatureCollection,
//   coordStart: Coordinate,
//   coordEnd: Coordinate
// ) {

// }

// export function smoothTrackSegmentBySpeed(
//   geoJson: GeoJSONFeatureCollection,
//   maxSpeed: number
// ) {

// }

// export function smoothTrackSegmentByVelocity(
//   geoJson: GeoJSONFeatureCollection,
//   degreeChange: number,
//   timeChange: number
// ) {

// }

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