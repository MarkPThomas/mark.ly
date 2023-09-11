import {
  LineString,
  MultiLineString,
  Polygon,
  Position
} from 'geojson';

import {
  getCoords,
  mergeTackSegments,
  GeoJSONFeatureCollection,
  coordinatesIndexAt,
  getTrackSegmentBeforeCoord,
  getTrackSegmentAfterCoord,
  getTrackSegmentBetweenCoords,
  getTrackSegmentsSplitByCoords,
  clipTrackSegmentBeforeCoord,
  clipTrackSegmentAfterCoord,
  clipTrackSegmentBetweenCoords,
  splitTrackSegmentByCoords,
  clipTrackSegmentByCruft,
  getTrackSegmentsByCruft,
  splitTrackSegmentByCruft,
  SegmentLimits,
  splitTrackSegmentBySegments,
  splitTrackSegment
} from './GeoJSON_Refactor';
import { LatLng } from 'leaflet';
import { TrackPoint } from './TrackPoint';

const testData = {
  GeoJson: {
    Point: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [100.0, 0.0]
          }
        }
      ],
    },
    MultiPoint: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPoint',
            coordinates: [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0]
            ]
          }
        }
      ],
    },
    LineString: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [100.0, 0.0],
              [101.0, 1.0],
              [102.0, 2.0],
              [103.0, 3.0]
            ]
          }
        }
      ],
    },
    MultiLineString: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [100.0, 0.0],
                [101.0, 1.0]
              ],
              [
                [102.0, 2.0],
                [103.0, 3.0]
              ]
            ]
          }
        }
      ],
    },
    Polygon: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0]
              ]
            ]
          }
        }
      ],
    },
    MultiPolygon: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [102.0, 2.0],
                  [103.0, 2.0],
                  [103.0, 3.0],
                  [102.0, 3.0],
                  [102.0, 2.0]
                ]
              ],
              [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0]
                ],
                [
                  [100.2, 0.2],
                  [100.2, 0.8],
                  [100.8, 0.8],
                  [100.8, 0.2],
                  [100.2, 0.2]
                ]
              ]
            ]
          }
        }
      ],
    },
  },
  GeoJsonFromTracks: {
    Point: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [100.0, 0.0]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: ['1']
            }
          },
        }
      ],
    },
    MultiPoint: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPoint',
            coordinates: [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0]
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: ['1', '2', '3', '4', '5']
            }
          },
        }
      ],
    },
    LineString: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300],
              [103.0, 3.0, 400]
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: ['1', '2', '3', '4']
            }
          },
        }
      ],
    },
    MultiLineString: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200]
              ],
              [
                [102.0, 2.0, 300],
                [103.0, 3.0, 400]
              ]
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: [
                ['1', '2'],
                ['3', '4']
              ]
            }
          },
        }
      ],
    },
  }
}

describe('##GeoJSON', () => {
  let lineStringTrack;
  beforeEach(() => {
    lineStringTrack = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300],
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600],
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: ['1', '2', '3', '4', '5', '6']
            }
          },
        }
      ],
    }
  });

  describe('#getCoords', () => {
    it('should return coordinates from a Point', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.Point as GeoJSONFeatureCollection;

      const coordinate = getCoords(geoJson) as TrackPoint;
      expect(coordinate.lat).toEqual(0.0);
      expect(coordinate.lng).toEqual(100.0);
    });

    it('should return coordinates including timestamps from a Point with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.Point as GeoJSONFeatureCollection;

      const coordinate = getCoords(geoJson) as TrackPoint;

      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual(['1']);
    });

    it('should return coordinates from a MultiPoint', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiPoint as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as TrackPoint[];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2] as TrackPoint;
      expect(coordinate.lat).toEqual(1.0);
      expect(coordinate.lng).toEqual(101.0);
      expect(coordinate.indices).toEqual({ coordIndex: 2 });
    });

    it('should return coordinates including timestamps from a MultiPoint with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.MultiPoint as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as TrackPoint[];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2];
      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual('3');
    });

    it('should return coordinates from a LineString', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.LineString as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as TrackPoint[];
      expect(coordinates.length).toEqual(4);

      const coordinate = coordinates[2] as TrackPoint;
      expect(coordinate.lat).toEqual(2.0);
      expect(coordinate.lng).toEqual(102.0);
      expect(coordinate.indices).toEqual({ coordIndex: 2 });
    });

    it('should return coordinates including timestamps from a LineString with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.LineString as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as TrackPoint[];
      expect(coordinates.length).toEqual(4);

      const coordinate = coordinates[2];
      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual('3');
    });

    it('should return coordinates from a MultiLineString', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiLineString as GeoJSONFeatureCollection;

      const segments = getCoords(geoJson) as TrackPoint[][];
      expect(segments.length).toEqual(2);

      const coordinates = segments[1];
      expect(coordinates.length).toEqual(2);

      const coordinate = coordinates[0] as TrackPoint;
      expect(coordinate.lat).toEqual(2.0);
      expect(coordinate.lng).toEqual(102.0);
      expect(coordinate.indices).toEqual({
        coordIndex: 0,
        segmentIndex: 1
      });
    });

    it('should return coordinates including timestamps from a MultiLineString with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.MultiLineString as GeoJSONFeatureCollection;

      const segments = getCoords(geoJson) as TrackPoint[][];
      expect(segments.length).toEqual(2);

      const coordinates = segments[1];
      expect(coordinates.length).toEqual(2);

      const coordinate = coordinates[0];

      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual('3');
    });

    it('should return coordinates from a Polygon', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.Polygon as GeoJSONFeatureCollection;

      const segments = getCoords(geoJson) as TrackPoint[][];
      expect(segments.length).toEqual(1);

      const coordinates = segments[0];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2] as TrackPoint;
      expect(coordinate.lat).toEqual(1.0);
      expect(coordinate.lng).toEqual(101.0);
      expect(coordinate.indices).toEqual({
        coordIndex: 2,
        segmentIndex: 0
      });
    });

    it('should return coordinates from a MultiPolygon', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiPolygon as GeoJSONFeatureCollection;

      const polygons = getCoords(geoJson) as TrackPoint[][][];
      expect(polygons.length).toEqual(2);

      const segments = polygons[1];
      expect(segments.length).toEqual(2);

      const coordinates = segments[0];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2] as TrackPoint;
      expect(coordinate.lat).toEqual(1.0);
      expect(coordinate.lng).toEqual(101.0);
      expect(coordinate.indices).toEqual({
        coordIndex: 2,
        segmentIndex: 0,
        polygonIndex: 1
      });
    });

    it('should return coordinates including elevation from a Geometry with elevation', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.LineString as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as TrackPoint[];
      expect(coordinates.length).toEqual(4);

      const coordinate: TrackPoint = coordinates[2] as TrackPoint;;
      expect(coordinate).toHaveProperty('alt');
      expect(coordinate.alt).toEqual(300);
    });
  });


  describe('#mergeTackSegments', () => {
    it('should merge all coordinates into one array in a MultiLineString', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiLineString as GeoJSONFeatureCollection;
      const coordinatesOriginal = (geoJson.features[0].geometry as MultiLineString).coordinates;
      expect(coordinatesOriginal).toEqual(
        [[
          [100.0, 0.0],
          [101.0, 1.0]
        ],
        [
          [102.0, 2.0],
          [103.0, 3.0]
        ]]
      );

      const mergedGeoJson = mergeTackSegments(geoJson);

      expect(mergedGeoJson.features[0].geometry.type).toEqual('LineString');

      const coordinatesResult = (mergedGeoJson.features[0].geometry as LineString).coordinates;
      expect(coordinatesResult).toEqual(
        [
          [100.0, 0.0],
          [101.0, 1.0],
          [102.0, 2.0],
          [103.0, 3.0]
        ]
      );
    });

    it('should merge all coordinates into one array, and all timestamps into another array, in a MultiLineString track', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.MultiLineString as GeoJSONFeatureCollection;
      const coordinatesOriginal = (geoJson.features[0].geometry as MultiLineString).coordinates;
      expect(coordinatesOriginal).toEqual(
        [[
          [100.0, 0.0, 100],
          [101.0, 1.0, 200]
        ],
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400]
        ]]
      );

      const timestampsOriginal = geoJson.features[0].properties.coordinateProperties.times;
      expect(timestampsOriginal).toEqual(
        [
          ['1', '2'],
          ['3', '4']
        ]
      );

      const mergedGeoJson = mergeTackSegments(geoJson);

      expect(mergedGeoJson.features[0].geometry.type).toEqual('LineString');

      const coordinatesResult = (mergedGeoJson.features[0].geometry as LineString).coordinates;
      expect(coordinatesResult).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300],
          [103.0, 3.0, 400]
        ]
      );

      const timestampsResult = mergedGeoJson.features[0].properties.coordinateProperties.times;
      expect(timestampsResult).toEqual(
        ['1', '2', '3', '4']
      );
    });

    it('should do nothing for any types other than a MultiLineString', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.Polygon as GeoJSONFeatureCollection;
      const coordinatesOriginal = (geoJson.features[0].geometry as Polygon).coordinates;
      expect(coordinatesOriginal).toEqual(
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      );

      const mergedGeoJson = mergeTackSegments(geoJson);

      expect(mergedGeoJson.features[0].geometry.type).toEqual('Polygon');

      const coordinatesResult = (mergedGeoJson.features[0].geometry as Polygon).coordinates;
      expect(coordinatesResult).toEqual(
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      );
    })
  });

  describe('#coordinatesIndexAt', () => {
    it('should return the index of a matching coordinate in a list of LatLngs', () => {
      const coordinates: LatLng[] = [
        new TrackPoint(45, -111.2),
        new TrackPoint(45.1, -111.4),
        new TrackPoint(45.2, -111.6),
        new TrackPoint(45.3, -111.8),
        new TrackPoint(45.4, -111.0)
      ];

      const coordinate = new TrackPoint(45.2, -111.6, 123);

      expect(coordinatesIndexAt(coordinate, coordinates)).toEqual(2);
    });

    it('should return the index of a matching coordinate in a list of Positions', () => {
      const coordinates: Position[] = [
        [-111.2, 45],
        [-111.4, 45.1],
        [-111.6, 45.2],
        [-111.8, 45.3],
        [-111.0, 45.4]
      ];

      const coordinate = new TrackPoint(45.2, -111.6, 123);

      expect(coordinatesIndexAt(coordinate, coordinates)).toEqual(2);
    });

    it('should return undefined if no matching coordinate is found in a list of LatLngs', () => {
      const coordinates: LatLng[] = [
        new TrackPoint(45, -111.2),
        new TrackPoint(45.1, -111.4),
        new TrackPoint(45.2, -111.6),
        new TrackPoint(45.3, -111.8),
        new TrackPoint(45.4, -111.0)
      ];

      const coordinate = new TrackPoint(45.22, -111.6);

      expect(coordinatesIndexAt(coordinate, coordinates)).toBeUndefined();
    });
  });










  describe('#splitTrackSegmentBySpeed', () => {
    it('should ', () => {

    });
  });









  describe('Sport Operations', () => {

  });

  describe('#', () => {
    it('should ', () => {

    });
  });
});