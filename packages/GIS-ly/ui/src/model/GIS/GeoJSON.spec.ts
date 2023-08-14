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
} from './GeoJSON';
import { LatLng } from 'leaflet';
import { Coordinate } from './Coordinate';

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

      const coordinate = getCoords(geoJson) as Coordinate;
      expect(coordinate.lat).toEqual(0.0);
      expect(coordinate.lng).toEqual(100.0);
    });

    it('should return coordinates including timestamps from a Point with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.Point as GeoJSONFeatureCollection;

      const coordinate = getCoords(geoJson) as Coordinate;

      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual(['1']);
    });

    it('should return coordinates from a MultiPoint', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiPoint as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as Coordinate[];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2] as Coordinate;
      expect(coordinate.lat).toEqual(1.0);
      expect(coordinate.lng).toEqual(101.0);
      expect(coordinate.indices).toEqual({ coordIndex: 2 });
    });

    it('should return coordinates including timestamps from a MultiPoint with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.MultiPoint as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as Coordinate[];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2];
      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual('3');
    });

    it('should return coordinates from a LineString', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.LineString as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as Coordinate[];
      expect(coordinates.length).toEqual(4);

      const coordinate = coordinates[2] as Coordinate;
      expect(coordinate.lat).toEqual(2.0);
      expect(coordinate.lng).toEqual(102.0);
      expect(coordinate.indices).toEqual({ coordIndex: 2 });
    });

    it('should return coordinates including timestamps from a LineString with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.LineString as GeoJSONFeatureCollection;

      const coordinates = getCoords(geoJson) as Coordinate[];
      expect(coordinates.length).toEqual(4);

      const coordinate = coordinates[2];
      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual('3');
    });

    it('should return coordinates from a MultiLineString', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiLineString as GeoJSONFeatureCollection;

      const segments = getCoords(geoJson) as Coordinate[][];
      expect(segments.length).toEqual(2);

      const coordinates = segments[1];
      expect(coordinates.length).toEqual(2);

      const coordinate = coordinates[0] as Coordinate;
      expect(coordinate.lat).toEqual(2.0);
      expect(coordinate.lng).toEqual(102.0);
      expect(coordinate.indices).toEqual({
        coordIndex: 0,
        segmentIndex: 1
      });
    });

    it('should return coordinates including timestamps from a MultiLineString with associated timestamps', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJsonFromTracks.MultiLineString as GeoJSONFeatureCollection;

      const segments = getCoords(geoJson) as Coordinate[][];
      expect(segments.length).toEqual(2);

      const coordinates = segments[1];
      expect(coordinates.length).toEqual(2);

      const coordinate = coordinates[0];

      expect(coordinate).toHaveProperty('timeStamp');
      expect(coordinate.timeStamp).toEqual('3');
    });

    it('should return coordinates from a Polygon', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.Polygon as GeoJSONFeatureCollection;

      const segments = getCoords(geoJson) as Coordinate[][];
      expect(segments.length).toEqual(1);

      const coordinates = segments[0];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2] as Coordinate;
      expect(coordinate.lat).toEqual(1.0);
      expect(coordinate.lng).toEqual(101.0);
      expect(coordinate.indices).toEqual({
        coordIndex: 2,
        segmentIndex: 0
      });
    });

    it('should return coordinates from a MultiPolygon', () => {
      const geoJson: GeoJSONFeatureCollection = testData.GeoJson.MultiPolygon as GeoJSONFeatureCollection;

      const polygons = getCoords(geoJson) as Coordinate[][][];
      expect(polygons.length).toEqual(2);

      const segments = polygons[1];
      expect(segments.length).toEqual(2);

      const coordinates = segments[0];
      expect(coordinates.length).toEqual(5);

      const coordinate = coordinates[2] as Coordinate;
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

      const coordinates = getCoords(geoJson) as Coordinate[];
      expect(coordinates.length).toEqual(4);

      const coordinate: Coordinate = coordinates[2] as Coordinate;;
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
        new Coordinate(45, -111.2),
        new Coordinate(45.1, -111.4),
        new Coordinate(45.2, -111.6),
        new Coordinate(45.3, -111.8),
        new Coordinate(45.4, -111.0)
      ];

      const coordinate = new Coordinate(45.2, -111.6, 123);

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

      const coordinate = new Coordinate(45.2, -111.6, 123);

      expect(coordinatesIndexAt(coordinate, coordinates)).toEqual(2);
    });

    it('should return undefined if no matching coordinate is found in a list of LatLngs', () => {
      const coordinates: LatLng[] = [
        new Coordinate(45, -111.2),
        new Coordinate(45.1, -111.4),
        new Coordinate(45.2, -111.6),
        new Coordinate(45.3, -111.8),
        new Coordinate(45.4, -111.0)
      ];

      const coordinate = new Coordinate(45.22, -111.6);

      expect(coordinatesIndexAt(coordinate, coordinates)).toBeUndefined();
    });
  });


  // ==== Get Functions ===
  describe('#getTrackSegmentBeforeCoord', () => {
    it('should return segment before the coordinate found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);

      const { coordinatesSegment, timeStampsSegment } = getTrackSegmentBeforeCoord(lineStringTrack, coordinate);

      expect(coordinatesSegment).toEqual([
        [100.0, 0.0, 100],
        [101.0, 1.0, 200],
        [102.0, 2.0, 300]
      ]);
      expect(timeStampsSegment).toEqual(['1', '2', '3']);
    });

    it('should return undefined when the coordinate is not found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.1, 102.1, 300);

      const segments = getTrackSegmentBeforeCoord(lineStringTrack, coordinate)

      expect(segments).toBeUndefined();
    });
  });

  describe('#getTrackSegmentAfterCoord', () => {
    it('should return segment after the coordinate found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);

      const { coordinatesSegment, timeStampsSegment } = getTrackSegmentAfterCoord(lineStringTrack, coordinate);

      expect(coordinatesSegment).toEqual([
        [102.0, 2.0, 300],
        [103.0, 3.0, 400],
        [104.0, 4.0, 500],
        [105.0, 5.0, 600]
      ]);
      expect(timeStampsSegment).toEqual(['3', '4', '5', '6']);
    });

    it('should return undefined when the coordinate is not found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.1, 102.1, 300);

      const segments = getTrackSegmentAfterCoord(lineStringTrack, coordinate)

      expect(segments).toBeUndefined();
    });
  });

  describe('#getTrackSegmentBetweenCoords', () => {
    it('should return track segment before the coordinate found in a GeoJSON object', () => {
      const coordinateStart = new Coordinate(1.0, 101.0);
      const coordinateEnd = new Coordinate(3.0, 103.0);

      const { coordinatesSegment, timeStampsSegment } = getTrackSegmentBetweenCoords(lineStringTrack, coordinateStart, coordinateEnd);

      expect(coordinatesSegment).toEqual([
        [101.0, 1.0, 200],
        [102.0, 2.0, 300],
        [103.0, 3.0, 400]
      ]);
      expect(timeStampsSegment).toEqual(['2', '3', '4']);
    });

    it('should return undefined when the start coordinate is not found in a GeoJSON object', () => {
      const coordinateStart = new Coordinate(2.1, 102.1, 300);
      const coordinateEnd = new Coordinate(2.0, 102.0, 300);

      const segments = getTrackSegmentBetweenCoords(lineStringTrack, coordinateStart, coordinateEnd);

      expect(segments).toBeUndefined();
    });

    it('should return undefined when the end coordinate is not found in the track', () => {
      const coordinateStart = new Coordinate(2.0, 102.0, 300);
      const coordinateEnd = new Coordinate(2.1, 102.1, 300);

      const segments = getTrackSegmentBetweenCoords(lineStringTrack, coordinateStart, coordinateEnd);

      expect(segments).toBeUndefined();
    });
  });

  describe('#getTrackSegmentsSplitByCoords', () => {
    it('should return two segments split by a single coordinate found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);

      const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(lineStringTrack, [coordinate]);

      expect(coordinatesSegments).toEqual([
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300]
        ],
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ],
      ]);
      expect(timeStampsSegments).toEqual(
        [
          ['1', '2', '3'],
          ['3', '4', '5', '6']
        ]
      );
    });

    it('should return three segments split by a two coordinates found in a GeoJSON object', () => {
      const coordinate1 = new Coordinate(1.0, 101.0, 200);
      const coordinate2 = new Coordinate(3.0, 103.0, 400);

      const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(lineStringTrack, [coordinate1, coordinate2]);

      expect(coordinatesSegments).toEqual([
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
        ],
        [
          [101.0, 1.0, 200],
          [102.0, 2.0, 300],
          [103.0, 3.0, 400]
        ],
        [
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      ]);
      expect(timeStampsSegments).toEqual(
        [
          ['1', '2'],
          ['2', '3', '4'],
          ['4', '5', '6']
        ]
      );
    });

    it('should return two segments split by 1 coordinate found in a GeoJSON object with 2 coordinates provided', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);
      const coordinatInvalid = new Coordinate(2.1, 102.1, 300);

      const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(lineStringTrack, [coordinate, coordinatInvalid]);

      expect(coordinatesSegments).toEqual([
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300]
        ],
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ],
      ]);
      expect(timeStampsSegments).toEqual(
        [
          ['1', '2', '3'],
          ['3', '4', '5', '6']
        ]
      );
    });

    it('should return original track segments when the coordinate is not found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.1, 102.1, 300);

      const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(lineStringTrack, [coordinate]);

      expect(coordinatesSegments).toEqual(
        [
          [
            [100.0, 0.0, 100],
            [101.0, 1.0, 200],
            [102.0, 2.0, 300],
            [103.0, 3.0, 400],
            [104.0, 4.0, 500],
            [105.0, 5.0, 600]
          ],
        ]
      );
      expect(timeStampsSegments).toEqual(
        [
          ['1', '2', '3', '4', '5', '6']
        ]
      );
    });

    it('should return only the original track when split on the start coordinate', () => {
      const coordinate = new Coordinate(0.0, 100.0);

      const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(lineStringTrack, [coordinate]);

      expect(coordinatesSegments).toEqual(
        [
          [
            [100.0, 0.0, 100],
            [101.0, 1.0, 200],
            [102.0, 2.0, 300],
            [103.0, 3.0, 400],
            [104.0, 4.0, 500],
            [105.0, 5.0, 600]
          ],
        ]
      );
      expect(timeStampsSegments).toEqual(
        [
          ['1', '2', '3', '4', '5', '6']
        ]
      );
    });

    it('should return only the original track when split on the end coordinate', () => {
      const coordinate = new Coordinate(5.0, 105.0);

      const { coordinatesSegments, timeStampsSegments } = getTrackSegmentsSplitByCoords(lineStringTrack, [coordinate]);

      expect(coordinatesSegments).toEqual(
        [
          [
            [100.0, 0.0, 100],
            [101.0, 1.0, 200],
            [102.0, 2.0, 300],
            [103.0, 3.0, 400],
            [104.0, 4.0, 500],
            [105.0, 5.0, 600]
          ],
        ]
      );
      expect(timeStampsSegments).toEqual(
        [
          ['1', '2', '3', '4', '5', '6']
        ]
      );
    });
  });


  // ==== Split Functions ===
  describe('#splitTrackSegmentByCoords', () => {
    it('should return two track segments split by a single coordinate found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);

      const tracks = splitTrackSegmentByCoords(lineStringTrack, [coordinate]);

      expect(tracks.length).toEqual(2);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300]
        ]
      );
      expect((tracks[1].features[0].geometry as LineString).coordinates).toEqual(
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2', '3']
      );
      expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
        ['3', '4', '5', '6']
      );
    });

    it('should return three track segments split by two coordinates found in a GeoJSON object', () => {
      const coordinate1 = new Coordinate(1.0, 101.0, 200);
      const coordinate2 = new Coordinate(3.0, 103.0, 400);

      const tracks = splitTrackSegmentByCoords(lineStringTrack, [coordinate1, coordinate2]);

      expect(tracks.length).toEqual(3);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200]
        ])
        ;
      expect((tracks[1].features[0].geometry as LineString).coordinates).toEqual(
        [
          [101.0, 1.0, 200],
          [102.0, 2.0, 300],
          [103.0, 3.0, 400]
        ]
      );
      expect((tracks[2].features[0].geometry as LineString).coordinates).toEqual(
        [
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2']
      );
      expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
        ['2', '3', '4']
      );
      expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
        ['4', '5', '6']
      );
    });

    it('should return two track segments split by 1 coordinate found in a GeoJSON object with 2 coordinates provided', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);
      const coordinatInvalid = new Coordinate(2.1, 102.1, 300);

      const tracks = splitTrackSegmentByCoords(lineStringTrack, [coordinate, coordinatInvalid]);

      expect(tracks.length).toEqual(2);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300]
        ]
      );
      expect((tracks[1].features[0].geometry as LineString).coordinates).toEqual(
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2', '3']
      );
      expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
        ['3', '4', '5', '6']
      );
    });

    it('should return the track segment unchanged when the coordinate is not found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.1, 102.1, 300);

      const tracks = splitTrackSegmentByCoords(lineStringTrack, [coordinate]);

      expect(tracks.length).toEqual(1);
      expect(tracks[0]).toEqual(lineStringTrack);
    });

    it('should return only the original track when a coord matches the first track coord', () => {
      const coordinate = new Coordinate(0.0, 100.0);

      const tracks = splitTrackSegmentByCoords(lineStringTrack, [coordinate]);

      expect(tracks.length).toEqual(1);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2', '3', '4', '5', '6']
      );
    });

    it('should return only the original track when a coord matches the last track coord', () => {
      const coordinate = new Coordinate(5.0, 105.0);

      const tracks = splitTrackSegmentByCoords(lineStringTrack, [coordinate]);

      expect(tracks.length).toEqual(1);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2', '3', '4', '5', '6']
      );
    });
  });

  describe('#splitTrackSegmentBySegments', () => {
    it('should return two track segments split by a single segment found in a GeoJSON object', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(2.0, 102.0),
        endCoord: new Coordinate(3.0, 103.0),
      }
      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment]);

      expect(tracks.length).toEqual(2);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200]
        ]
      );
      expect((tracks[1].features[0].geometry as LineString).coordinates).toEqual(
        [
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2']
      );
      expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
        ['5', '6']
      );
    });

    it('should return three track segments split by two segments found in a GeoJSON object', () => {
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
                [106.0, 6.0, 700],
                [107.0, 7.0, 800],
                [108.0, 8.0, 900],
                [109.0, 9.0, 1000],
              ]
            },
            properties: {
              _gpxType: 'trk',
              name: 'FooBarTest',
              time: 'timestamp',
              coordinateProperties: {
                times: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
              }
            },
          }
        ],
      }

      const segment1: SegmentLimits = {
        startCoord: new Coordinate(2.0, 102.0),
        endCoord: new Coordinate(3.0, 103.0),
      }

      const segment2: SegmentLimits = {
        startCoord: new Coordinate(6.0, 106.0),
        endCoord: new Coordinate(7.0, 107.0),
      }
      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment1, segment2]);

      expect(tracks.length).toEqual(3);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200]
        ])
        ;
      expect((tracks[1].features[0].geometry as LineString).coordinates).toEqual(
        [
          [104.0, 4.0, 500],
          [105.0, 5.0, 600],
        ]
      );
      expect((tracks[2].features[0].geometry as LineString).coordinates).toEqual(
        [
          [108.0, 8.0, 900],
          [109.0, 9.0, 1000],
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2']
      );
      expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
        ['5', '6']
      );
      expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
        ['9', '10']
      );
    });

    it('should return two track segments split by 1 segment found in a GeoJSON object with 2 segment provided', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(2.0, 102.0),
        endCoord: new Coordinate(3.0, 103.0),
      }
      const segmentInvalid: SegmentLimits = {
        startCoord: new Coordinate(4.1, 104.0),
        endCoord: new Coordinate(5.0, 105.1),
      }

      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment, segmentInvalid]);

      expect(tracks.length).toEqual(2);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
        ]
      );
      expect((tracks[1].features[0].geometry as LineString).coordinates).toEqual(
        [
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2']
      );
      expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
        ['5', '6']
      );
    });

    it('should return the track segment unchanged when the segment is not found in a GeoJSON object', () => {
      const segmentInvalid: SegmentLimits = {
        startCoord: new Coordinate(4.1, 104.0),
        endCoord: new Coordinate(5.0, 105.1),
      }

      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segmentInvalid]);

      expect(tracks.length).toEqual(1);
      expect(tracks[0]).toEqual(lineStringTrack);
    });

    it('should return only the remaining track when a segment matches the first track segment', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(0.0, 100.0),
        endCoord: new Coordinate(1.0, 101.0),
      }

      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment]);

      expect(tracks.length).toEqual(1);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['3', '4', '5', '6']
      );
    });

    it('should return only the remaining track when a segment matches the second track segment', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(1.0, 101.0),
        endCoord: new Coordinate(2.0, 102.0),
      }

      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment]);

      expect(tracks.length).toEqual(1);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [103.0, 3.0, 400],
          [104.0, 4.0, 500],
          [105.0, 5.0, 600]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['4', '5', '6']
      );
    });

    it('should return only the initial track when a segment matches the last track segment', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(4.0, 104.0),
        endCoord: new Coordinate(5.0, 105.0),
      }

      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment]);

      expect(tracks.length).toEqual(1);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300],
          [103.0, 3.0, 400]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2', '3', '4']
      );
    });

    it('should return only the initial track when a segment matches the second-to-last track segment', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(3.0, 103.0),
        endCoord: new Coordinate(4.0, 104.0),
      }

      const tracks = splitTrackSegmentBySegments(lineStringTrack, [segment]);

      expect(tracks.length).toEqual(1);
      expect((tracks[0].features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
          [102.0, 2.0, 300]
        ]
      );

      expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2', '3']
      );
    });
  });

  describe('#splitTrackSegment', () => {
    it('should return the specified segment at the start of the track', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(0.0, 100.0),
        endCoord: new Coordinate(1.0, 101.0),
      }
      const track = splitTrackSegment(lineStringTrack, segment);

      expect((track.features[0].geometry as LineString).coordinates).toEqual(
        [
          [100.0, 0.0, 100],
          [101.0, 1.0, 200],
        ]
      );

      expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
        ['1', '2']
      );
    });

    it('should return the specified segment at the end of the track', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(4.0, 104.0),
        endCoord: new Coordinate(5.0, 105.0),
      }
      const track = splitTrackSegment(lineStringTrack, segment);

      expect((track.features[0].geometry as LineString).coordinates).toEqual(
        [
          [104.0, 4.0, 500],
          [105.0, 5.0, 600],
        ]
      );

      expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
        ['5', '6']
      );
    });

    it('should return the specified segment at the middle of the track', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(2.0, 102.0),
        endCoord: new Coordinate(3.0, 103.0),
      }
      const track = splitTrackSegment(lineStringTrack, segment);

      expect((track.features[0].geometry as LineString).coordinates).toEqual(
        [
          [102.0, 2.0, 300],
          [103.0, 3.0, 400],
        ]
      );

      expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
        ['3', '4']
      );
    });

    it('should return nothing if the specified segment is not found', () => {
      const segment: SegmentLimits = {
        startCoord: new Coordinate(2.1, 102.0),
        endCoord: new Coordinate(3.1, 103.0),
      }
      const track = splitTrackSegment(lineStringTrack, segment);
      expect(track).toBeUndefined();
    });
  });

  describe('#splitTrackSegmentBySpeed', () => {
    it('should ', () => {

    });
  });


  // ==== Clip Functions ===
  describe('#clipTrackSegmentBeforeCoord', () => {
    it('should clip track to segment before the coordinate found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);

      const clippedTrack = clipTrackSegmentBeforeCoord(lineStringTrack, coordinate)

      expect((clippedTrack.features[0].geometry as LineString).coordinates).toEqual([
        [100.0, 0.0, 100],
        [101.0, 1.0, 200],
        [102.0, 2.0, 300]
      ]);
      expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['1', '2', '3']);
    });

    it('should do nothing to the segment if the coordinate is not found', () => {
      const coordinate = new Coordinate(2.1, 102.1, 300);

      const segments = clipTrackSegmentBeforeCoord(lineStringTrack, coordinate)

      expect(segments).toEqual(lineStringTrack);
    });
  });

  describe('#clipTrackSegmentAfterCoord', () => {
    it('should clip track to segment before the coordinate found in a GeoJSON object', () => {
      const coordinate = new Coordinate(2.0, 102.0, 300);

      const clippedTrack = clipTrackSegmentAfterCoord(lineStringTrack, coordinate)

      expect((clippedTrack.features[0].geometry as LineString).coordinates).toEqual([
        [102.0, 2.0, 300],
        [103.0, 3.0, 400],
        [104.0, 4.0, 500],
        [105.0, 5.0, 600]
      ]);
      expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['3', '4', '5', '6']);
    });

    it('should do nothing to the segment if the coordinate is not found', () => {
      const coordinate = new Coordinate(2.1, 102.1, 300);

      const segments = clipTrackSegmentAfterCoord(lineStringTrack, coordinate)

      expect(segments).toEqual(lineStringTrack);
    });
  });

  describe('#clipTrackSegmentBetweenCoords', () => {
    it('should clip track to segment between the coordinates found in a GeoJSON object', () => {
      const coordinateStart = new Coordinate(1.0, 101.0);
      const coordinateEnd = new Coordinate(3.0, 103.0);

      const clippedTrack = clipTrackSegmentBetweenCoords(lineStringTrack, coordinateStart, coordinateEnd)

      expect((clippedTrack.features[0].geometry as LineString).coordinates).toEqual([
        [101.0, 1.0, 200],
        [102.0, 2.0, 300],
        [103.0, 3.0, 400]
      ]);
      expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['2', '3', '4']);
    });

    it('should do nothing to the segment when the start coordinate is not found in a GeoJSON object', () => {
      const coordinateStart = new Coordinate(2.1, 102.1, 300);
      const coordinateEnd = new Coordinate(2.0, 102.0, 300);

      const segments = clipTrackSegmentBetweenCoords(lineStringTrack, coordinateStart, coordinateEnd)

      expect(segments).toEqual(lineStringTrack);
    });

    it('should do nothing to the segment when the end coordinate is not found in a GeoJSON object', () => {
      const coordinateStart = new Coordinate(2.0, 102.0, 300);
      const coordinateEnd = new Coordinate(2.1, 102.1, 300);

      const segments = clipTrackSegmentBetweenCoords(lineStringTrack, coordinateStart, coordinateEnd)

      expect(segments).toEqual(lineStringTrack);
    });
  });



  describe('Cruft Operations', () => {
    const createNewTrack = (): GeoJSONFeatureCollection => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [

            ]
          },
          properties: {}
        }
      ],
    });

    const trackWithCoordinates = (coordinates: Position[]) => {
      const track = createNewTrack();
      (track.features[0].geometry as LineString).coordinates = coordinates;
      return track;
    }

    const data = {
      cruftStart: [
        [-105.0127698013641, 39.73175292386382, 0],
        [-105.0004457547322, 39.73029041395932, 0],
        [-105.010960150138, 39.7368136595752, 0],
        [-105.0056388622745, 39.73937239233006, 0],
        [-104.9946388969436, 39.758014755451, 0], // Keep here to end
        [-104.9854983786352, 39.75819785322535, 0],
        [-104.9947462379639, 39.76200765811915, 0],
        [-104.9835169989596, 39.76426030962995, 0],
        [-104.9929538279561, 39.76773804641108, 0]
      ],
      cruftEnd: [
        [-104.9929538279561, 39.76773804641108, 0],
        [-104.9835169989596, 39.76426030962995, 0],
        [-104.9947462379639, 39.76200765811915, 0],
        [-104.9854983786352, 39.75819785322535, 0],
        [-104.9946388969436, 39.758014755451, 0], // Keep here to beginning
        [-105.010960150138, 39.7368136595752, 0],
        [-105.0004457547322, 39.73029041395932, 0],
        [-105.0127698013641, 39.73175292386382, 0],
        [-105.0056388622745, 39.73937239233006, 0]
      ],
      cruftStartEnd: [
        [-105.0127698013641, 39.73175292386382, 0],
        [-105.0004457547322, 39.73029041395932, 0],
        [-105.010960150138, 39.7368136595752, 0],
        [-105.0056388622745, 39.73937239233006, 0],
        [-104.9946388969436, 39.758014755451, 0],   // Keep here down
        [-104.9854983786352, 39.75819785322535, 0],
        [-104.9952285611948, 39.76239797577348, 0],
        [-104.9890656660424, 39.76884536977788, 0],
        [-104.9835169989596, 39.76426030962995, 0], // Keep here up
        [-104.9834658623495, 39.74039697244989, 0],
        [-104.9779998528178, 39.73801589241057, 0],
        [-104.9826590934965, 39.73617516945873, 0]
      ],
      cruftKeep2ndOf4: [
        [-105.0127698013641, 39.73175292386382, 0], // First trim segment
        [-105.0004457547322, 39.73029041395932, 0],
        [-105.010960150138, 39.7368136595752, 0],
        [-105.0056388622745, 39.73937239233006, 0],
        [-104.9946388969436, 39.758014755451, 0],   // Keep here down
        [-104.9854983786352, 39.75819785322535, 0],
        [-104.9944023239115, 39.76189285634545, 0],
        [-104.9907607643185, 39.76673722483862, 0],
        [-104.9835169989596, 39.76426030962995, 0], // Keep here up
        [-104.9829721298797, 39.74002704198475, 0],
        [-104.9884738932551, 39.74007471717409, 0],
        [-104.9839514624485, 39.73698380300784, 0],
        [-104.9810711477942, 39.73725624205192, 0],
        [-104.9804000292142, 39.73351810260323, 0],// End of competing segment
        [-105.0047565810937, 39.73616096865927, 0],
        [-105.0127698013641, 39.73175292386382, 0] // Last trim segment
      ],
      cruftNone: [
        [-104.9946388969436, 39.758014755451, 0],
        [-104.9854983786352, 39.75819785322535, 0],
        [-104.9949490224107, 39.76209110858792, 0],
        [-104.9903491883622, 39.7665365866026, 0],
        [-104.9835169989596, 39.76426030962995, 0]
      ]
    }

    describe('#getTrackSegmentsByCruft', () => {
      it('should clip the first portion of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftStart);

        const { segments, segmentKeep } = getTrackSegmentsByCruft(track, 2);

        expect(segments.length).toEqual(2);
        expect(segmentKeep.startCoord.lat).toEqual(39.758014755451);
        expect(segmentKeep.startCoord.lng).toEqual(-104.9946388969436);
        expect(segmentKeep.endCoord.lat).toEqual(39.76773804641108);
        expect(segmentKeep.endCoord.lng).toEqual(-104.9929538279561);
      });

      it('should clip the last portion of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftEnd);

        const { segments, segmentKeep } = getTrackSegmentsByCruft(track, 2);

        expect(segments.length).toEqual(2);
        expect(segmentKeep.startCoord.lat).toEqual(39.76773804641108);
        expect(segmentKeep.startCoord.lng).toEqual(-104.9929538279561);
        expect(segmentKeep.endCoord.lat).toEqual(39.758014755451);
        expect(segmentKeep.endCoord.lng).toEqual(-104.9946388969436);
      });

      it('should clip the first & last portions of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftStartEnd);

        const { segments, segmentKeep } = getTrackSegmentsByCruft(track, 2);

        expect(segments.length).toEqual(3);
        expect(segmentKeep.startCoord.lat).toEqual(39.758014755451);
        expect(segmentKeep.startCoord.lng).toEqual(-104.9946388969436);
        expect(segmentKeep.endCoord.lat).toEqual(39.76426030962995);
        expect(segmentKeep.endCoord.lng).toEqual(-104.9835169989596);
      });

      it('should keep the 2nd of 4 segments after clipping multiple segments', () => {
        const track = trackWithCoordinates(data.cruftKeep2ndOf4);

        const { segments, segmentKeep } = getTrackSegmentsByCruft(track, 2);

        expect(segments.length).toEqual(4);
        expect(segmentKeep.startCoord.lat).toEqual(39.758014755451);
        expect(segmentKeep.startCoord.lng).toEqual(-104.9946388969436);
        expect(segmentKeep.endCoord.lat).toEqual(39.76426030962995);
        expect(segmentKeep.endCoord.lng).toEqual(-104.9835169989596);
      });

      it('should do nothing to a track that does not trigger clipping', () => {
        const track = trackWithCoordinates(data.cruftNone);

        const { segments, segmentKeep } = getTrackSegmentsByCruft(track, 2);

        expect(segments.length).toEqual(1);
        expect(segmentKeep.startCoord.lat).toEqual(39.758014755451);
        expect(segmentKeep.startCoord.lng).toEqual(-104.9946388969436);
        expect(segmentKeep.endCoord.lat).toEqual(39.76426030962995);
        expect(segmentKeep.endCoord.lng).toEqual(-104.9835169989596);
      });
    });

    describe('#splitTrackSegmentByCruft', () => {
      it('should split to keep the last portion of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftStart);

        const tracks = splitTrackSegmentByCruft(track, 2);

        expect(tracks.length).toEqual(2);
        expect((tracks[0].features[0].geometry as LineString).coordinates.length).toEqual(4);
        expect((tracks[1].features[0].geometry as LineString).coordinates.length).toEqual(5);
      });

      it('should split to keep the first portion of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftEnd);

        const tracks = splitTrackSegmentByCruft(track, 2);

        expect(tracks.length).toEqual(2);
        expect((tracks[0].features[0].geometry as LineString).coordinates.length).toEqual(5);
        expect((tracks[1].features[0].geometry as LineString).coordinates.length).toEqual(4);
      });

      it('should split at the first & last portions to keep the middle of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftStartEnd);

        const tracks = splitTrackSegmentByCruft(track, 2);

        expect(tracks.length).toEqual(3);
        expect((tracks[0].features[0].geometry as LineString).coordinates.length).toEqual(4);
        expect((tracks[1].features[0].geometry as LineString).coordinates.length).toEqual(5);
        expect((tracks[2].features[0].geometry as LineString).coordinates.length).toEqual(3);
      });

      it('should split to keep the 2nd of 4 segments after clipping multiple segments', () => {
        const track = trackWithCoordinates(data.cruftKeep2ndOf4);

        const tracks = splitTrackSegmentByCruft(track, 2);

        expect(tracks.length).toEqual(4);
        expect((tracks[0].features[0].geometry as LineString).coordinates.length).toEqual(4);
        expect((tracks[1].features[0].geometry as LineString).coordinates.length).toEqual(5); // Kept in tie
        expect((tracks[2].features[0].geometry as LineString).coordinates.length).toEqual(5);
        expect((tracks[3].features[0].geometry as LineString).coordinates.length).toEqual(2);
      });

      it('should return the track segment unchanged for a track that does not trigger clipping', () => {
        const track = trackWithCoordinates(data.cruftNone);

        const tracks = splitTrackSegmentByCruft(track, 2);

        expect(tracks.length).toEqual(1);
        expect((tracks[0].features[0].geometry as LineString).coordinates.length).toEqual(5);
      });
    });

    describe('#clipTrackSegmentByCruft', () => {
      it('should clip the first portion of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftStart);

        const clippedTrack = clipTrackSegmentByCruft(track, 2);

        expect((clippedTrack.features[0].geometry as LineString).coordinates.length).toEqual(5);
      });

      it('should clip the last portion of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftEnd);

        const clippedTrack = clipTrackSegmentByCruft(track, 2);

        expect((clippedTrack.features[0].geometry as LineString).coordinates.length).toEqual(5);
      });

      it('should clip the first & last portions of a track when triggered', () => {
        const track = trackWithCoordinates(data.cruftStartEnd);

        const clippedTrack = clipTrackSegmentByCruft(track, 2);

        expect((clippedTrack.features[0].geometry as LineString).coordinates.length).toEqual(5);
      });

      it('should keep the 2nd of 4 segments after clipping multiple segments', () => {
        const track = trackWithCoordinates(data.cruftKeep2ndOf4);

        const clippedTrack = clipTrackSegmentByCruft(track, 2);

        expect((clippedTrack.features[0].geometry as LineString).coordinates.length).toEqual(5);
      });

      it('should do nothing to a track that does not trigger clipping', () => {
        const track = trackWithCoordinates(data.cruftNone);

        const clippedTrack = clipTrackSegmentByCruft(track, 2);

        expect((clippedTrack.features[0].geometry as LineString).coordinates.length).toEqual(5);
      });
    });
  });


  describe('Sport Operations', () => {

  });

  describe('#', () => {
    it('should ', () => {

    });
  });
});