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
  Position
} from 'geojson';

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

export function getCoords(geoJson: FeatureCollection<Geometry, { [name: string]: any; }>)
  : Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][] {
  if (geoJson?.features[0]?.geometry) {
    const geometryType = geoJson?.features[0]?.geometry.type;
    console.log('geometryType: ', geometryType);
    let coordinatesPosition: Position | Position[] | Position[][] | Position[][][];
    switch (geometryType) {
      case 'Point':
        coordinatesPosition = (geoJson?.features[0]?.geometry as Point).coordinates;
        const coordinate: Coordinate = {
          latitude: coordinatesPosition[0],
          longitude: coordinatesPosition[1]
        };

        if (coordinatesPosition.length === 3) {
          coordinate.elevationMeters = coordinatesPosition[2];
        }

        if (geoJson?.features[0]?.properties) {
          coordinate.timeStamp = geoJson?.features[0]?.properties.coordinateProperties.times;
        }

        return coordinate;
      case 'MultiPoint':
      case 'LineString':
        coordinatesPosition = (geoJson?.features[0]?.geometry as MultiPoint).coordinates;
        console.log('Conversion to MultiPoint:', (geoJson?.features[0]?.geometry as MultiPoint))
        console.log('Conversion to LineString:', (geoJson?.features[0]?.geometry as LineString))
        const coordinates: Coordinate[] = [];
        for (let coord = 0; coord < coordinatesPosition.length; coord++) {
          const coordinate: Coordinate = {
            latitude: coordinatesPosition[coord][0],
            longitude: coordinatesPosition[coord][1],
            properties: {
              coord
            }
          };

          if (coordinatesPosition[coord].length === 3) {
            coordinate.elevationMeters = coordinatesPosition[coord][2];
          }

          if (geoJson?.features[0]?.properties) {
            coordinate.timeStamp = geoJson?.features[0]?.properties.coordinateProperties.times[coord];
          }

          coordinates.push(coordinate);
        }
        return coordinates;
      case 'MultiLineString':
      case 'Polygon':
        coordinatesPosition = (geoJson?.features[0]?.geometry as MultiLineString).coordinates;
        const segments: Coordinate[][] = [];
        for (let segment = 0; segment < coordinatesPosition.length; segment++) {
          const coordinates: Coordinate[] = [];
          for (let coord = 0; coord < coordinatesPosition[segment].length; coord++) {
            const coordinate: Coordinate = {
              latitude: coordinatesPosition[segment][coord][0],
              longitude: coordinatesPosition[segment][coord][1],
              properties: {
                coord,
                segment
              }
            };

            if (coordinatesPosition[segment][coord].length === 3) {
              coordinate.elevationMeters = coordinatesPosition[segment][coord][2];
            }

            if (geoJson?.features[0]?.properties) {
              coordinate.timeStamp = geoJson?.features[0]?.properties.coordinateProperties.times[segment][coord];
            }

            coordinates.push(coordinate);
          }
          segments.push(coordinates);
        }
        return segments;
      case 'MultiPolygon':
        coordinatesPosition = (geoJson?.features[0]?.geometry as MultiPolygon).coordinates;
        const polygons: Coordinate[][][] = [];
        for (let polygon = 0; polygon < coordinatesPosition.length; polygon++) {
          const segments: Coordinate[][] = [];
          for (let segment = 0; segment < coordinatesPosition[polygon].length; segment++) {
            const coordinates: Coordinate[] = [];
            for (let coord = 0; coord < coordinatesPosition[polygon][segment].length; coord++) {
              const coordinate: Coordinate = {
                latitude: coordinatesPosition[polygon][segment][coord][0],
                longitude: coordinatesPosition[polygon][segment][coord][1],
                properties: {
                  coord,
                  segment,
                  polygon
                }
              };

              if (coordinatesPosition[polygon][segment][coord].length === 3) {
                coordinate.elevationMeters = coordinatesPosition[polygon][segment][coord][2];
              }

              if (geoJson?.features[0]?.properties) {
                coordinate.timeStamp =
                  geoJson?.features[0]?.properties.coordinateProperties.times[polygon][segment][coord];
              }

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

export function getBoundingBox(coords: any) { //Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][]) {
  let minLat = Infinity;
  let minLong = Infinity;
  let maxLat = -Infinity;
  let maxLong = -Infinity;

  function setBounds(coord: Coordinate) {
    // console.log('setBounds coord:', coord)
    minLat = Math.min(minLat, coord.latitude);
    minLong = Math.min(minLong, coord.longitude);

    maxLat = Math.max(maxLat, coord.latitude);
    maxLong = Math.max(maxLong, coord.longitude);

    // console.log('minLat: ', minLat)
    // console.log('minLong: ', minLong)
    // console.log('maxLat: ', maxLat)
    // console.log('maxLong: ', maxLong)
  }



  if (coords.length) {
    if (coords[0].length) {
      if (coords[0][0].length) {
        for (let polygon = 0; polygon < coords.length; polygon++) {
          for (let segment = 0; segment < coords[polygon].length; segment++) {
            for (let coord = 0; coord < coords[polygon][segment].length; coord++) {
              setBounds(coords[polygon][segment][coord]);
            }
          }
        }
      } else {
        for (let segment = 0; segment < coords.length; segment++) {
          for (let coord = 0; coord < coords[segment].length; coord++) {
            setBounds(coords[segment][coord]);
          }
        }
      }
    } else {
      for (let coord = 0; coord < coords.length; coord++) {
        setBounds(coords[coord]);
      }
    }
  } else {
    console.log('Single Coord', coords)
    return [coords.latitude, coords.longitude];
  }

  // if (coords as Coordinate) {
  //   coords = coords as Coordinate;
  //   console.log('Single Coord', coords)
  //   return [coords.latitude, coords.longitude];
  // } else if (coords as Coordinate[]) {
  //   coords = coords as Coordinate[];
  //   for (let coord = 0; coord < coords.length; coord++) {
  //     setBounds(coords[coord]);
  //   }
  // } else if (coords as Coordinate[][]) {
  //   coords = coords as Coordinate[][];
  //   for (let segment = 0; segment < coords.length; segment++) {
  //     for (let coord = 0; coord < coords.length; coord++) {
  //       setBounds(coords[segment][coord]);
  //     }
  //   }
  // } else if (coords as Coordinate[][][]) {
  //   coords = coords as Coordinate[][][];
  //   for (let polygon = 0; polygon < coords.length; polygon++) {
  //     for (let segment = 0; segment < coords[polygon].length; segment++) {
  //       for (let coord = 0; coord < coords[polygon][segment].length; coord++) {
  //         setBounds(coords[polygon][segment][coord]);
  //       }
  //     }
  //   }
  // }

  return [[minLong, minLat], [maxLong, maxLat]];
}

function mergeTackSegments(geoJson: FeatureCollection<Geometry, { [name: string]: any; }>) {

}

function clipTrackSegmentsBySize(geoJson: FeatureCollection<Geometry, { [name: string]: any; }>) {

}

function splitTrackSegmentBySpeed(
  geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
  maxSpeed: number) {

}

function smoothTrackSegmentBySpeed(
  geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
  maxSpeed: number) {

}

function smoothTrackSegmentByVelocity(
  geoJson: FeatureCollection<Geometry, { [name: string]: any; }>,
  degreeChange: number,
  timeChange: number) {

}

// from FeatureCollection<Geometry, {[name: string]: any;}>
type MyFeatureCollection = {
  type: string // FeatureCollection
  // bbox?: BBox[] // of n x n dimensions for lower-left-bottom & upper-right-top corners
  features: [
    {
      type: string, // Feature
      // bbox?: BBox[] // of n x n dimensions for lower-left-bottom & upper-right-top corners
      geometry: {
        type: string, // 'MultiLineString',
        // array of track segments, each as an array of coord properties
        //    each of which is an array of 3 indices:
        //      0 = longitude
        //      1 = latitude
        //      2 = elevation (m)
        coordinates: string[][][]
      },
      properties: {
        _gpxType: string, //trk
        name: string,
        time: string, //timestamp
        coordinateProperties: {
          // array of track segments, each as an array of timestamps for each coord
          times: string[][]
        }
      },
    }
  ],
}