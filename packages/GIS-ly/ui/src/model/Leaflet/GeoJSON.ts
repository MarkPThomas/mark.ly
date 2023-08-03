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
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet';

export type GeoJSONFeatureCollection = FeatureCollection<Geometry, { [name: string]: any; }>;

export type Coordinate = {
  latitude: number,
  longitude: number,
  elevationMeters?: number
  timeStamp?: string,
  properties?: {
    coord: number,
    segment?: number,
    polygon?: number,
  }
}

export type Coordinates = Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];

type CoordinateIndex = {
  coord: number,
  segment?: number,
  polygon?: number
};

type CoordinateProperties = {
  position: Position,
  indices?: CoordinateIndex,
  timeStamp?: string
}

function getCoordinate({ position, indices, timeStamp }: CoordinateProperties) {
  const coordinate: Coordinate = {
    latitude: position[1],
    longitude: position[0]
  };

  if (position.length === 3) {
    coordinate.elevationMeters = position[2];
  }

  if (timeStamp) {
    coordinate.timeStamp = timeStamp;
  }

  if (indices) {
    coordinate.properties = indices;
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
        for (let coord = 0; coord < coordinatesPosition.length; coord++) {
          const coordinate = getCoordinate(
            {
              position: coordinatesPosition[coord],
              indices: {
                coord
              },
              timeStamp: geoJson.features[0].properties?.coordinateProperties?.times[coord]
            }
          );

          coordinates.push(coordinate);
        }
        return coordinates;
      case 'MultiLineString':
      case 'Polygon':
        coordinatesPosition = (geoJson.features[0].geometry as MultiLineString).coordinates;
        const segments: Coordinate[][] = [];
        for (let segment = 0; segment < coordinatesPosition.length; segment++) {
          const coordinates: Coordinate[] = [];
          for (let coord = 0; coord < coordinatesPosition[segment].length; coord++) {
            const coordinate = getCoordinate(
              {
                position: coordinatesPosition[segment][coord],
                indices: {
                  coord,
                  segment
                },
                timeStamp: geometryType === "MultiLineString"
                  ? geoJson.features[0].properties?.coordinateProperties?.times[segment][coord]
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
        for (let polygon = 0; polygon < coordinatesPosition.length; polygon++) {
          const segments: Coordinate[][] = [];
          for (let segment = 0; segment < coordinatesPosition[polygon].length; segment++) {
            const coordinates: Coordinate[] = [];
            for (let coord = 0; coord < coordinatesPosition[polygon][segment].length; coord++) {
              const coordinate = getCoordinate(
                {
                  position: coordinatesPosition[polygon][segment][coord],
                  indices: {
                    coord,
                    segment,
                    polygon
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

export function getBoundingBox(coords: Coordinates): LatLngBoundsExpression | LatLngExpression {
  let minLat = Infinity;
  let minLong = Infinity;
  let maxLat = -Infinity;
  let maxLong = -Infinity;

  function setBounds(coord: Coordinate) {
    minLat = Math.min(minLat, coord.latitude);
    minLong = Math.min(minLong, coord.longitude);

    maxLat = Math.max(maxLat, coord.latitude);
    maxLong = Math.max(maxLong, coord.longitude);
  }

  if ((coords as Coordinate[]).length) {
    if ((coords as Coordinate[][])[0].length) {
      if ((coords as Coordinate[][][])[0][0].length) {
        coords = coords as Coordinate[][][];
        for (let polygon = 0; polygon < coords.length; polygon++) {
          for (let segment = 0; segment < coords[polygon].length; segment++) {
            for (let coord = 0; coord < coords[polygon][segment].length; coord++) {
              setBounds(coords[polygon][segment][coord]);
            }
          }
        }
      } else {
        coords = coords as Coordinate[][];
        for (let segment = 0; segment < coords.length; segment++) {
          for (let coord = 0; coord < coords[segment].length; coord++) {
            setBounds(coords[segment][coord]);
          }
        }
      }
    } else {
      coords = coords as Coordinate[];
      for (let coord = 0; coord < coords.length; coord++) {
        setBounds(coords[coord]);
      }
    }
  } else {
    coords = coords as Coordinate;
    return [coords.latitude, coords.longitude];
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

// export function clipTrackSegmentsBySize(geoJson: FeatureCollection<Geometry, { [name: string]: any; }>) {
//   // determine triggering distance
//   // search over nodes and check distances
//   // if distance > allowed, note node pair
//   // for all node pairs > allowed distance, keep single largest node count
//   //    alternate: return each set as a segment for the user to choose what to keep
// }

// export function clipTrackSegmentBeforeCoord(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
//   coord: Coordinate
// ) {

// }

// export function clipTrackSegmentAfterCoord(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
//   coord: Coordinate
// ) {

// }

// export function splitTrackSegmentByCoord(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
//   coord: Coordinate
// ) {

// }

// export function splitTrackSegmentBySpeed(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
//   maxSpeed: number
// ) {

// }

// export function smoothTrackSegmentBetweenCoords(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
//   coordStart: Coordinate,
//   coordEnd: Coordinate
// ) {

// }

// export function smoothTrackSegmentBySpeed(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
//   maxSpeed: number
// ) {

// }

// export function smoothTrackSegmentByVelocity(
//   geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
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