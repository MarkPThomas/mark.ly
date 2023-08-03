import {
  FeatureCollection,
  Geometry,
  LineString,
  MultiLineString,
  Polygon
} from 'geojson';

import {
  getCoords,
  getBoundingBox,
  mergeTackSegments,
  Coordinate,
  GeoJSONFeatureCollection
} from './GeoJSON';

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

  describe('#getBoundingBox', () => {
    it('should return a single set of latitude & longitude for a single coordinate', () => {
      const coordinate = new Coordinate(35.2, 100.0);

      const boundingBox = getBoundingBox(coordinate);

      expect(boundingBox).toEqual([35.2, 100])
    });

    it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a LineString', () => {
      const coordinates = [
        {
          lat: 35.2,
          lng: 100.0
        }, {
          lat: 20,
          lng: -20.0
        }, {
          lat: 25,
          lng: 120.0
        }, {
          lat: 35.2,
          lng: 100.0
        }
      ];

      const boundingBox = getBoundingBox(coordinates);

      expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    });

    it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a MultiLineString', () => {
      const coordinates = [
        [
          {
            lat: 35.2,
            lng: 100.0
          }, {
            lat: 20,
            lng: -20.0
          }
        ],
        [
          {
            lat: 25,
            lng: 120.0
          }, {
            lat: 35.2,
            lng: 100.0
          }
        ]
      ];

      const boundingBox = getBoundingBox(coordinates);

      expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    });

    it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a MultiPolygon', () => {
      const coordinates = [
        [
          [
            {
              lat: 35.2,
              lng: 100.0
            }, {
              lat: 20,
              lng: -20.0
            }
          ]
        ],
        [
          [
            {
              lat: 25,
              lng: 120.0
            }
          ],
          [
            {
              lat: 35.2,
              lng: 100.0
            }
          ]
        ]
      ];

      const boundingBox = getBoundingBox(coordinates);

      expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
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

  describe('#clipTrackSegmentsBySize', () => {
    it('should ', () => {

    });
  });

  describe('#clipTrackSegmentBeforeCoord', () => {
    it('should ', () => {

    });
  });

  describe('#clipTrackSegmentAfterCoord', () => {
    it('should ', () => {

    });
  });

  describe('#splitTrackSegmentByCoord', () => {
    it('should ', () => {

    });
  });

  describe('#splitTrackSegmentBySpeed', () => {
    it('should ', () => {

    });
  });

  describe('#clipTrackSegmentAfterCoord', () => {
    it('should ', () => {

    });
  });
});