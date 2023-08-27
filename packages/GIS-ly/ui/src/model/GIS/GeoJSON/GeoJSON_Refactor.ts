import {
  FeatureCollection,
  Geometry,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  MultiPolygon,
  Position
} from 'geojson';

import {
  LatLng,
  LatLngLiteral,
  GeoJSON as GeoJSONLeaflet
} from 'leaflet';

import { Coordinate } from '../Coordinate';



export type GeoJSONFeatureCollection = FeatureCollection<Geometry, { [name: string]: any; }>;

export type LatLngLiterals = LatLngLiteral | LatLngLiteral[] | LatLngLiteral[][] | LatLngLiteral[][][];


export function getCoords(geoJson: GeoJSONFeatureCollection) {
  if (geoJson.features[0].geometry) {
    const geometryType = geoJson.features[0].geometry.type;
    let coordinatesPosition: Position | Position[] | Position[][] | Position[][][];
    switch (geometryType) {
      case 'Point':
        coordinatesPosition = (geoJson.features[0].geometry as Point).coordinates;
        const coordinate = Coordinate.getCoordinate(
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
          const coordinate = Coordinate.getCoordinate(
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
            const coordinate = Coordinate.getCoordinate(
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
              const coordinate = Coordinate.getCoordinate(
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

export function coordinatesIndexAt(coord: LatLng, coordinates: LatLng[] | Position[]) {
  if (!('lat' in coordinates[0])) {
    coordinates = GeoJSONLeaflet.coordsToLatLngs(coordinates as Position[]) as LatLng[];
  }
  for (let i = 0; i < coordinates.length; i++) {
    if ((coordinates[i] as LatLng).equals(coord)) {
      return i;
    }
  }
}

// === Get Functions
export function getTrackSegmentBeforeCoord(
  geoJson: GeoJSONFeatureCollection,
  coord: LatLng
) {
  const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  const coordinateIndex = coordinatesIndexAt(coord, coordinates);

  if (coordinateIndex) {
    const coordinatesSegment = coordinates.slice(0, coordinateIndex + 1);
    const timeStampsSegment: string[] = geoJson.features[0].properties?.coordinateProperties?.times.slice(0, coordinateIndex + 1);

    return { coordinatesSegment, timeStampsSegment };
  }
}

export function getTrackSegmentAfterCoord(
  geoJson: GeoJSONFeatureCollection,
  coord: LatLng
) {
  const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  const coordinateIndex = coordinatesIndexAt(coord, coordinates);

  if (coordinateIndex) {
    const coordinatesSegment = coordinates.slice(coordinateIndex);
    const timeStampsSegment: string[] = geoJson.features[0].properties?.coordinateProperties?.times.slice(coordinateIndex);

    return { coordinatesSegment, timeStampsSegment };
  }
}

// Inclusive with coords
export function getTrackSegmentBetweenCoords(
  geoJson: GeoJSONFeatureCollection,
  coordStart: LatLng,
  coordEnd: LatLng
) {
  const coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  const coordinateStartIndex = coordinatesIndexAt(coordStart, coordinates);
  const coordinateEndIndex = coordinatesIndexAt(coordEnd, coordinates);

  if (coordinateStartIndex && coordinateEndIndex) {
    const coordinatesSegment = coordinates.slice(coordinateStartIndex, coordinateEndIndex + 1);
    const timeStampsSegment: string[] =
      geoJson.features[0].properties?.coordinateProperties?.times.slice(coordinateStartIndex, coordinateEndIndex + 1);

    return { coordinatesSegment, timeStampsSegment };
  }
}

// Coord is duplicated between tracks, ignored if end coord. Coords assumed to be in order along track.
export function getTrackSegmentsSplitByCoords(
  geoJson: GeoJSONFeatureCollection,
  coords: LatLng[]
) {
  const coordinatesSegments = [];
  const timeStampsSegments = [];

  let coordinates = (geoJson.features[0].geometry as LineString).coordinates;
  let timeStamps: string[] = geoJson.features[0].properties?.coordinateProperties?.times;
  coords.forEach((coord) => {
    const coordinateIndex = coordinatesIndexAt(coord, coordinates);
    if (coordinateIndex && coordinateIndex < coordinates.length - 1) {
      const segment = coordinates.slice(0, coordinateIndex + 1);
      if (segment.length) {
        coordinatesSegments.push(segment);
        coordinates = coordinates.slice(coordinateIndex);


        if (timeStamps) {
          timeStampsSegments.push(timeStamps.slice(0, coordinateIndex + 1));
          timeStamps = timeStamps.slice(coordinateIndex);
        }
      }
    }
  });
  if (coordinates.length) {
    coordinatesSegments.push(coordinates);
    timeStampsSegments.push(timeStamps);
  }

  return { coordinatesSegments, timeStampsSegments };
}

export type SegmentLimits = {
  startCoord: Coordinate,
  endCoord: Coordinate | null
};

export function getTrackSegmentsByCruft(
  geoJson: GeoJSONFeatureCollection,
  triggerDistanceKM: number = 5
) {
  const triggerDistanceMeters = triggerDistanceKM * 1000;
  const coordinates = getCoords(geoJson) as Coordinate[];

  let maxSize = 0;

  const segments: SegmentLimits[] = [];
  let segmentKeep: SegmentLimits;
  let segment: SegmentLimits = {
    startCoord: coordinates[0],
    endCoord: null
  };

  const updateSegmentKeep = (segmentCheck: SegmentLimits) => {
    segments.push(segmentCheck);

    const priorSegmentSize = segmentCheck.endCoord.indices.coordIndex - segmentCheck.startCoord.indices.coordIndex + 1;
    // TODO: Add future weights to BB diagonal length as well in case noise cloud on clipped end
    if (priorSegmentSize > maxSize) {
      segmentKeep = segmentCheck;
      maxSize = priorSegmentSize;
    }
  }

  for (let i = 1; i < coordinates.length; i++) {
    if (coordinates[i].distanceTo(coordinates[i - 1]) >= triggerDistanceMeters) {
      segment.endCoord = coordinates[i - 1];
      updateSegmentKeep(segment);

      segment = {
        startCoord: coordinates[i],
        endCoord: null
      };
    }
  }
  segment.endCoord = coordinates[coordinates.length - 1];
  updateSegmentKeep(segment);

  return { segments, segmentKeep };
}


// === Split Functions
// Coords assumed to be in order along track
export function splitTrackSegmentByCoords(
  geoJson: GeoJSONFeatureCollection,
  coords: LatLng[]
): GeoJSONFeatureCollection[] {
  const trackLayers = [];

  const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(geoJson, coords);

  coordinatesSegments.forEach((coordinatesSegment, index) => {
    const timeStampsSegment = timeStampsSegments ? timeStampsSegments[index] : undefined;
    trackLayers.push(updateGeoJsonTrack(geoJson, coordinatesSegment, timeStampsSegment));
  })

  return trackLayers;
}

// Tracks assumed to be in order along track
export function splitTrackSegmentBySegments(
  geoJson: GeoJSONFeatureCollection,
  segments: SegmentLimits[]
): GeoJSONFeatureCollection[] {
  const tracks: GeoJSONFeatureCollection[] = [];

  function trimSingleNodeSegments(tracks: GeoJSONFeatureCollection[]) {
    const trimmedTracks: GeoJSONFeatureCollection[] = [];

    tracks.forEach((track) => {
      if ((track.features[0].geometry as LineString).coordinates.length > 1) {
        trimmedTracks.push(track);
      }
    });

    return trimmedTracks;
  }

  // TODO: This currently splits on a single coord match. It should only split when BOTH start & end coords are found?
  for (let segment of segments) {
    const splitTracks = splitTrackSegmentByCoords(geoJson, [segment.startCoord, segment.endCoord]);

    if (splitTracks.length === 3
      && (splitTracks[0].features[0].geometry as LineString).coordinates.length > 1
      && (splitTracks[2].features[0].geometry as LineString).coordinates.length > 1) {
      // Segment for split is in middle
      (splitTracks[0].features[0].geometry as LineString).coordinates.pop();
      splitTracks[0].features[0].properties.coordinateProperties?.times?.pop();
      tracks.push(splitTracks[0]);

      (splitTracks[2].features[0].geometry as LineString).coordinates.shift();
      splitTracks[2].features[0].properties.coordinateProperties?.times?.shift();
      // tracks.push(splitTracks[2]); // Hold off in case later segment is further split

      geoJson = splitTracks[2];
    } else if (splitTracks.length === 2) {
      // Segment for split is on end
      const checkPosition: Position = (splitTracks[1].features[0].geometry as LineString).coordinates[0];
      const checkCoord = new Coordinate(checkPosition[1], checkPosition[0]);
      if (segment.endCoord.equals(checkCoord, 0.00001)) {
        // Segment for split is first
        (splitTracks[1].features[0].geometry as LineString).coordinates.shift();
        splitTracks[1].features[0].properties.coordinateProperties?.times?.shift();
        // tracks.push(splitTracks[1]); // Hold off in case later segment is further split

        geoJson = splitTracks[1];
      } else {
        // Segment for split is second
        (splitTracks[0].features[0].geometry as LineString).coordinates.pop();
        splitTracks[0].features[0].properties.coordinateProperties?.times?.pop();
        tracks.push(splitTracks[0]);

        return trimSingleNodeSegments(tracks);
      }
    } else {
      // Unchanged
      tracks.push(splitTracks[0]);
      return trimSingleNodeSegments(tracks);
    }
  }
  tracks.push(geoJson);

  return trimSingleNodeSegments(tracks);
}

export function splitTrackSegment(
  geoJson: GeoJSONFeatureCollection,
  segment: SegmentLimits
): GeoJSONFeatureCollection {
  const splitTracks = splitTrackSegmentByCoords(geoJson, [segment.startCoord, segment.endCoord]);
  if (splitTracks.length === 1) {
    return;
  }

  if (splitTracks.length === 3
    && (splitTracks[0].features[0].geometry as LineString).coordinates.length > 1
    && (splitTracks[2].features[0].geometry as LineString).coordinates.length > 1) {
    // Segment to return is in middle
    return splitTracks[1];
  } else if (splitTracks.length === 2) {
    // Segment to return is on end
    const checkPosition: Position = (splitTracks[1].features[0].geometry as LineString).coordinates[0];
    const checkCoord = new Coordinate(checkPosition[1], checkPosition[0]);
    if (segment.endCoord.equals(checkCoord, 0.00001)) {
      // Segment to return is first
      return splitTracks[0];
    } else {
      // Segment to return is second
      return splitTracks[1];
    }
  }
}

export function splitTrackSegmentByCruft(
  geoJson: GeoJSONFeatureCollection,
  triggerDistanceKM: number = 5
) {
  const { segments } = getTrackSegmentsByCruft(geoJson, triggerDistanceKM);
  if (segments.length === 1) {
    return [geoJson];
  }

  const tracks: GeoJSONFeatureCollection[] = [];
  segments.forEach((segment) => {
    const track = splitTrackSegment(geoJson, segment);
    if (track) {
      tracks.push(track);
    }
  });

  return tracks.length ? tracks : [geoJson];
}

export function updateGeoJsonTrackByCoords(
  geoJson: GeoJSONFeatureCollection,
  coordinates: Coordinate[]
): GeoJSONFeatureCollection {

  const coordinatesSegment: Position[] = [];
  const timeStampsSegment: string[] = [];
  coordinates.forEach((coord, index) => {
    coordinatesSegment.push(Coordinate.toPosition(coord));
    timeStampsSegment.push(coord.timeStamp);
  });

  return updateGeoJsonTrack(geoJson, coordinatesSegment, timeStampsSegment);
}

function updateGeoJsonTrack(
  geoJson: GeoJSONFeatureCollection,
  coordinatesSegment: Position[],
  timeStampsSegment: string[]
): GeoJSONFeatureCollection {
  if (coordinatesSegment || timeStampsSegment) {
    const updatedGeoJson = JSON.parse(JSON.stringify(geoJson));
    if (coordinatesSegment) {
      (updatedGeoJson.features[0].geometry as LineString).coordinates = coordinatesSegment;
    }

    if (timeStampsSegment && geoJson.features[0].properties?.coordinateProperties?.times) {
      updatedGeoJson.features[0].properties.coordinateProperties.times = timeStampsSegment;
    }

    return updatedGeoJson;
  } else {
    return geoJson;
  }
}

export function clipTrackSegmentBeforeCoord(
  geoJson: GeoJSONFeatureCollection,
  coord: LatLng
) {
  const { coordinatesSegment, timeStampsSegment } = { ...getTrackSegmentBeforeCoord(geoJson, coord) };

  return updateGeoJsonTrack(geoJson, coordinatesSegment, timeStampsSegment);
}

export function clipTrackSegmentAfterCoord(
  geoJson: GeoJSONFeatureCollection,
  coord: LatLng
) {
  const { coordinatesSegment, timeStampsSegment } = { ...getTrackSegmentAfterCoord(geoJson, coord) };

  return updateGeoJsonTrack(geoJson, coordinatesSegment, timeStampsSegment);
}

export function clipTrackSegmentBetweenCoords(
  geoJson: GeoJSONFeatureCollection,
  coordStart: LatLng,
  coordEnd: LatLng
) {
  const { coordinatesSegment, timeStampsSegment } = { ...getTrackSegmentBetweenCoords(geoJson, coordStart, coordEnd) };

  return updateGeoJsonTrack(geoJson, coordinatesSegment, timeStampsSegment);
}

export function clipTrackSegmentByCruft(
  geoJson: GeoJSONFeatureCollection,
  triggerDistanceKM: number = 5
) {
  const { segments, segmentKeep } = getTrackSegmentsByCruft(geoJson, triggerDistanceKM);

  return segments.length === 1 ? geoJson : splitTrackSegment(geoJson, segmentKeep);
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