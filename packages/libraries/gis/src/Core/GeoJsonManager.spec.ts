import {
  FeatureCollection as SerialFeatureCollection,
  LineString as SerialLineString,
  MultiLineString as SerialMultiLineString,
  Polygon as SerialPolygon
} from 'geojson';

import {
  FeatureCollection,
  Feature,
  Position
} from '@MPT/geojson';

import {
  Point,
  LineString,
  MultiLineString,
  MultiPoint,
} from '@MPT/geojson/Geometries';

import {
  ITrackPropertyProperties,
  TrackPoint,
  TrackProperty
} from './Track';

import { GeoJsonManager } from './GeoJsonManager';

describe('##GeoJsonManager', () => {
  // const testData = {
  //   GeoJson: {
  //     Point: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'Point',
  //             coordinates: [100.0, 0.0]
  //           }
  //         }
  //       ],
  //     },
  //     MultiPoint: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'MultiPoint',
  //             coordinates: [
  //               [100.0, 0.0],
  //               [101.0, 0.0],
  //               [101.0, 1.0],
  //               [100.0, 1.0],
  //               [100.0, 0.0]
  //             ]
  //           }
  //         }
  //       ],
  //     },
  //     LineString: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'LineString',
  //             coordinates: [
  //               [100.0, 0.0],
  //               [101.0, 1.0],
  //               [102.0, 2.0],
  //               [103.0, 3.0]
  //             ]
  //           }
  //         }
  //       ],
  //     },
  //     MultiLineString: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'MultiLineString',
  //             coordinates: [
  //               [
  //                 [100.0, 0.0],
  //                 [101.0, 1.0]
  //               ],
  //               [
  //                 [102.0, 2.0],
  //                 [103.0, 3.0]
  //               ]
  //             ]
  //           }
  //         }
  //       ],
  //     },
  //     Polygon: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'Polygon',
  //             coordinates: [
  //               [
  //                 [100.0, 0.0],
  //                 [101.0, 0.0],
  //                 [101.0, 1.0],
  //                 [100.0, 1.0],
  //                 [100.0, 0.0]
  //               ]
  //             ]
  //           }
  //         }
  //       ],
  //     },
  //     MultiPolygon: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'MultiPolygon',
  //             coordinates: [
  //               [
  //                 [
  //                   [102.0, 2.0],
  //                   [103.0, 2.0],
  //                   [103.0, 3.0],
  //                   [102.0, 3.0],
  //                   [102.0, 2.0]
  //                 ]
  //               ],
  //               [
  //                 [
  //                   [100.0, 0.0],
  //                   [101.0, 0.0],
  //                   [101.0, 1.0],
  //                   [100.0, 1.0],
  //                   [100.0, 0.0]
  //                 ],
  //                 [
  //                   [100.2, 0.2],
  //                   [100.2, 0.8],
  //                   [100.8, 0.8],
  //                   [100.8, 0.2],
  //                   [100.2, 0.2]
  //                 ]
  //               ]
  //             ]
  //           }
  //         }
  //       ],
  //     },
  //   },
  //   GeoJsonFromTracks: {
  //     Point: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'Point',
  //             coordinates: [100.0, 0.0]
  //           },
  //           properties: {
  //             _gpxType: 'trk',
  //             name: 'FooBarTest',
  //             time: 'timestamp',
  //             coordinateProperties: {
  //               times: ['1']
  //             }
  //           },
  //         }
  //       ],
  //     },
  //     MultiPoint: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'MultiPoint',
  //             coordinates: [
  //               [100.0, 0.0],
  //               [101.0, 0.0],
  //               [101.0, 1.0],
  //               [100.0, 1.0],
  //               [100.0, 0.0]
  //             ]
  //           },
  //           properties: {
  //             _gpxType: 'trk',
  //             name: 'FooBarTest',
  //             time: 'timestamp',
  //             coordinateProperties: {
  //               times: ['1', '2', '3', '4', '5']
  //             }
  //           },
  //         }
  //       ],
  //     },
  //     LineString: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'LineString',
  //             coordinates: [
  //               [100.0, 0.0, 100],
  //               [101.0, 1.0, 200],
  //               [102.0, 2.0, 300],
  //               [103.0, 3.0, 400]
  //             ]
  //           },
  //           properties: {
  //             _gpxType: 'trk',
  //             name: 'FooBarTest',
  //             time: 'timestamp',
  //             coordinateProperties: {
  //               times: ['1', '2', '3', '4']
  //             }
  //           },
  //         }
  //       ],
  //     },
  //     MultiLineString: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'MultiLineString',
  //             coordinates: [
  //               [
  //                 [100.0, 0.0, 100],
  //                 [101.0, 1.0, 200]
  //               ],
  //               [
  //                 [102.0, 2.0, 300],
  //                 [103.0, 3.0, 400]
  //               ]
  //             ]
  //           },
  //           properties: {
  //             _gpxType: 'trk',
  //             name: 'FooBarTest',
  //             time: 'timestamp',
  //             coordinateProperties: {
  //               times: [
  //                 ['1', '2'],
  //                 ['3', '4']
  //               ]
  //             }
  //           },
  //         }
  //       ],
  //     },
  //   }
  // }

  describe('Creation', () => {
    let propertiesJson: ITrackPropertyProperties;
    beforeEach(() => {
      propertiesJson = {
        _gpxType: 'trk',
        name: 'Foo',
        time: 'Bar',
        coordinateProperties: {
          times: ''
        }
      };
    });

    describe('Manager contains Single Track geometry', () => {
      it('should create a single track GeoJsonManager object from the provided GeoJSON LineString object', () => {
        const lineString = LineString.fromPositions([
          [100.0, 0.0],
          [101.0, 1.0],
          [102.0, 2.0],
          [103.0, 3.0]
        ]);
        const feature = Feature.fromGeometry(lineString);
        const featureCollection = FeatureCollection.fromFeatures([feature]);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        expect(geoJsonManager.isSingleTrack).toBeTruthy();
      });

      it('should create a single track GeoJsonManager object from the provided GPS recordings translated to a LineString GeoJSON object', () => {
        propertiesJson.coordinateProperties.times = ['1', '2', '3', '4'];
        const properties = TrackProperty.fromJson(propertiesJson);
        const lineString = LineString.fromPositions([
          [100.0, 0.0],
          [101.0, 1.0],
          [102.0, 2.0],
          [103.0, 3.0]
        ]);
        const feature = Feature.fromGeometry(lineString, { properties });
        const featureCollection = FeatureCollection.fromFeatures([feature]);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        expect(geoJsonManager.isSingleTrack).toBeTruthy();
      });
    });

    describe('Manager does not contain Single Track geometry', () => {
      it('should create a non-single track GeoJsonManager object from the provided GPS recordings translated to a MultiLineString GeoJSON object', () => {
        propertiesJson.coordinateProperties.times = [
          ['1', '2'],
          ['3', '4']
        ];
        const properties = TrackProperty.fromJson(propertiesJson);
        const multiLineString = MultiLineString.fromPositions([
          [
            [100.0, 0.0, 100],
            [101.0, 1.0, 200]
          ],
          [
            [102.0, 2.0, 300],
            [103.0, 3.0, 400]
          ]
        ]);
        const feature = Feature.fromGeometry(multiLineString, { properties });
        const featureCollection = FeatureCollection.fromFeatures([feature]);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        expect(geoJsonManager.isSingleTrack).toBeFalsy();
      });

      it('should create a non-single track GeoJsonManager object from the provided GPS recordings translated to a Point GeoJSON object', () => {
        propertiesJson.coordinateProperties.times = '1';
        const properties = TrackProperty.fromJson(propertiesJson);
        const point = Point.fromPosition([100.0, 0.0]);
        const feature = Feature.fromGeometry(point, { properties });
        const featureCollection = FeatureCollection.fromFeatures([feature]);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        expect(geoJsonManager.isSingleTrack).toBeFalsy();
      });

      it('should create a non-single track GeoJsonManager object from the provided GPS recordings translated to multiple LineString GeoJSON objects', () => {
        const properties1Json = { ...propertiesJson };
        properties1Json.coordinateProperties.times = ['1', '2'];
        const properties1 = TrackProperty.fromJson(properties1Json);
        const position1: Position[] = [
          [1, 2, 3],
          [4, 5]
        ];
        const lineString1 = LineString.fromPositions(position1);
        const lineStringFeature1 = Feature.fromGeometry(lineString1, { properties: properties1 });

        const properties2Json = { ...propertiesJson };
        properties2Json.coordinateProperties.times = ['3', '4', '5'];
        const properties2 = TrackProperty.fromJson(properties2Json);
        const position2: Position[] = [
          [7, 8, 9],
          [10, 11, 12],
          [13, 14, 15]
        ];
        const lineString2 = LineString.fromPositions(position2);
        const lineStringFeature2 = Feature.fromGeometry(lineString2, { properties: properties2 });

        const features = [lineStringFeature1, lineStringFeature2];
        const featureCollection = FeatureCollection.fromFeatures(features);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        expect(geoJsonManager.isSingleTrack).toBeFalsy();
      });
    });
  });

  describe('get Methods', () => {
    let propertiesJson: ITrackPropertyProperties;
    beforeEach(() => {
      propertiesJson = {
        _gpxType: 'trk',
        name: 'Foo',
        time: 'Bar',
        coordinateProperties: {
          times: ''
        }
      };
    });

    describe('#getTrackPointsFromPoints', () => {
      it('should return a list of TrackPoints from the contained Point Features in the FeatureCollection', () => {
        const position1: Position = [1, 2];
        const geometry1 = Point.fromPosition(position1);
        const feature1 = Feature.fromGeometry(geometry1);

        // Dummy Feature to be ignored
        const position2: Position[][] = [
          [
            [1, 2, 3],
            [4, 5, 6]
          ],
          [
            [16, 17, 18]
          ]
        ];
        const geometry2 = MultiLineString.fromPositions(position2);
        const feature2 = Feature.fromGeometry(geometry2);

        // Feature with timestamp properties
        propertiesJson.coordinateProperties.times = 'moo';
        const properties = TrackProperty.fromJson(propertiesJson);
        const position3: Position = [4, 5, 6];
        const geometry3 = Point.fromPosition(position3);
        const feature3 = Feature.fromGeometry(geometry3, { properties });

        const features = [feature1, feature2, feature3];
        const featureCollection = FeatureCollection.fromFeatures(features);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        const results = geoJsonManager.getTrackPointsFromPoints();

        //Point Features
        expect(results.length).toEqual(2);

        // Min Properties
        const results1 = results[0];
        expect(results1.lng).toEqual(position1[0]);
        expect(results1.lat).toEqual(position1[1]);
        expect(results1.alt).toBeUndefined();
        expect(results1.timestamp).toBeUndefined();

        // All Properties
        const results2 = results[1];
        expect(results2.lng).toEqual(position3[0]);
        expect(results2.lat).toEqual(position3[1]);
        expect(results2.alt).toEqual(position3[2]);
        expect(results2.timestamp).toEqual(propertiesJson.coordinateProperties.times);
      });
    });

    describe('#getTrackPointsFromMultiPoints', () => {
      it('should return a list of TrackPoints from the contained MultiPoint Features in the FeatureCollection', () => {
        const position1: Position[] = [
          [1, 2, 3],
          [4, 5]
        ];
        const geometry1 = MultiPoint.fromPositions(position1);
        const feature1 = Feature.fromGeometry(geometry1);

        // Dummy Feature to be ignored
        const position2: Position = [1, 2, 3];
        const geometry2 = Point.fromPosition(position2);
        const feature2 = Feature.fromGeometry(geometry2);

        // Feature with timestamp properties
        const propertiesJsonMulti = {
          ...propertiesJson,
          coordinateProperties: {
            times: [
              'Foo',
              'Bar',
              'Boo'
            ]
          }
        }
        const properties = TrackProperty.fromJson(propertiesJsonMulti);
        const position3: Position[] = [
          [7, 8, 9],
          [10, 11, 12],
          [13, 14, 15]
        ];
        const geometry3 = MultiPoint.fromPositions(position3);
        const feature3 = Feature.fromGeometry(geometry3, { properties });

        const features = [feature1, feature2, feature3];
        const featureCollection = FeatureCollection.fromFeatures(features);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        const results = geoJsonManager.getTrackPointsFromMultiPoints();

        // MultiPoint Features
        expect(results.length).toEqual(2);

        // Positions in each MultiPoint
        const results1 = results[0];
        expect(results1.length).toEqual(2);

        const results2 = results[1];
        expect(results2.length).toEqual(3);

        // TrackPoint spot check
        // Min Properties
        const results12 = results1[1];
        expect(results12.lng).toEqual(position1[1][0]);
        expect(results12.lat).toEqual(position1[1][1]);
        expect(results12.alt).toBeUndefined();
        expect(results12.timestamp).toBeUndefined();

        // All Properties
        const results22 = results2[1];
        expect(results22.lng).toEqual(position3[1][0]);
        expect(results22.lat).toEqual(position3[1][1]);
        expect(results22.alt).toEqual(position3[1][2]);
        expect(results22.timestamp).toEqual(propertiesJsonMulti.coordinateProperties.times[1]);
      });
    });

    describe('#getTrackPointsFromLineStrings', () => {
      it('should return a list of TrackPoints from the contained LineString Features in the FeatureCollection', () => {
        const position1: Position[] = [
          [1, 2, 3],
          [4, 5]
        ];
        const geometry1 = LineString.fromPositions(position1);
        const feature1 = Feature.fromGeometry(geometry1);

        // Dummy Feature to be ignored
        const position2: Position = [1, 2, 3];
        const geometry2 = Point.fromPosition(position2);
        const feature2 = Feature.fromGeometry(geometry2);

        // Feature with timestamp properties
        const propertiesJsonMulti = {
          ...propertiesJson,
          coordinateProperties: {
            times: [
              'Foo',
              'Bar',
              'Boo'
            ]
          }
        }
        const properties = TrackProperty.fromJson(propertiesJsonMulti);
        const position3: Position[] = [
          [7, 8, 9],
          [10, 11, 12],
          [13, 14, 15]
        ];
        const geometry3 = LineString.fromPositions(position3);
        const feature3 = Feature.fromGeometry(geometry3, { properties });

        const features = [feature1, feature2, feature3];
        const featureCollection = FeatureCollection.fromFeatures(features);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        const results = geoJsonManager.getTrackPointsFromLineStrings();

        // LineString Features
        expect(results.length).toEqual(2);

        // Positions in each LineString
        const results1 = results[0];
        expect(results1.length).toEqual(2);

        const results2 = results[1];
        expect(results2.length).toEqual(3);

        // TrackPoint spot check
        // Min Properties
        const results12 = results1[1];
        expect(results12.lng).toEqual(position1[1][0]);
        expect(results12.lat).toEqual(position1[1][1]);
        expect(results12.alt).toBeUndefined();
        expect(results12.timestamp).toBeUndefined();

        // All Properties
        const results22 = results2[1];
        expect(results22.lng).toEqual(position3[1][0]);
        expect(results22.lat).toEqual(position3[1][1]);
        expect(results22.alt).toEqual(position3[1][2]);
        expect(results22.timestamp).toEqual(propertiesJsonMulti.coordinateProperties.times[1]);
      });
    });

    describe('#getTrackPointsFromMultiLineStrings', () => {
      it('should return a list of TrackPoints from the contained MultiLineString Features in the FeatureCollection', () => {
        const position1: Position[][] = [
          [
            [1, 2, 3],
            [4, 5]
          ],
          [
            [16, 17, 18]
          ]
        ];
        const geometry1 = MultiLineString.fromPositions(position1);
        const feature1 = Feature.fromGeometry(geometry1);

        // Dummy Feature to be ignored
        const position2: Position = [1, 2, 3];
        const geometry2 = Point.fromPosition(position2);
        const feature2 = Feature.fromGeometry(geometry2);

        // Feature with timestamp properties
        const propertiesJsonMulti = {
          ...propertiesJson,
          coordinateProperties: {
            times: [
              ['Foo',
                'Bar',
                'Boo'],
              ['Moo',
                'Nar']
            ]
          }
        }
        const properties = TrackProperty.fromJson(propertiesJsonMulti);
        const position3: Position[][] = [
          [
            [7, 8, 9],
            [10, 11, 12],
            [13, 14, 15]
          ],
          [
            [19, 20, 21],
            [22, 23, 24],
          ],
          [
            [25, 26, 27]
          ]
        ];
        const geometry3 = MultiLineString.fromPositions(position3);
        const feature3 = Feature.fromGeometry(geometry3, { properties });

        const features = [feature1, feature2, feature3];
        const featureCollection = FeatureCollection.fromFeatures(features);

        const geoJsonManager = new GeoJsonManager(featureCollection);

        const results = geoJsonManager.getTrackPointsFromMultiLineStrings();

        // MultiLineString Features
        expect(results.length).toEqual(2);

        // LineStrings in each MultiLineString
        const results1 = results[0];
        expect(results1.length).toEqual(2);

        const results2 = results[1];
        expect(results2.length).toEqual(3);

        // Positions in each LineString
        // MultiLineString 1, LineString 1
        const results11 = results1[0];
        expect(results11.length).toEqual(2);

        const results12 = results1[1];
        expect(results12.length).toEqual(1);

        // MultiLineString 2, LineString 1
        const results21 = results2[0];
        expect(results21.length).toEqual(3);

        const results22 = results2[1];
        expect(results22.length).toEqual(2);

        const results23 = results2[2];
        expect(results23.length).toEqual(1);

        // TrackPoint spot check
        const results112 = results11[1];
        expect(results112.lng).toEqual(position1[0][1][0]);
        expect(results112.lat).toEqual(position1[0][1][1]);
        expect(results112.alt).toBeUndefined();
        expect(results112.timestamp).toBeUndefined();

        // All Properties
        const result213 = results21[2];
        expect(result213.lng).toEqual(position3[0][2][0]);
        expect(result213.lat).toEqual(position3[0][2][1]);
        expect(result213.alt).toEqual(position3[0][2][2]);
        expect(result213.timestamp).toEqual(propertiesJsonMulti.coordinateProperties.times[0][2]);
      });
    });
  });

  describe('Merging Methods', () => {
    let testData;
    beforeEach(() => {
      testData = {
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
    });

    describe('#mergeRouteLineStrings', () => {
      it('should merge all coordinates into one array from a MultiLineString', () => {
        const geoJson: SerialFeatureCollection = testData.GeoJson.MultiLineString as SerialFeatureCollection;

        const featureCollection = FeatureCollection.fromJson(geoJson);
        const manager = new GeoJsonManager(featureCollection);

        const coordinatesOriginal = (geoJson.features[0].geometry as SerialMultiLineString).coordinates;
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


        manager.mergeRouteLineStrings();


        expect(geoJson.features[0].geometry.type).toEqual('LineString');

        const coordinatesResult = (geoJson.features[0].geometry as SerialLineString).coordinates;
        expect(coordinatesResult).toEqual(
          [
            [100.0, 0.0],
            [101.0, 1.0],
            [102.0, 2.0],
            [103.0, 3.0]
          ]
        );
      });

      it('should merge all coordinates into one array from a MultiLineString, dropping any present timestamps', () => {
        const geoJson: SerialFeatureCollection = testData.GeoJsonFromTracks.MultiLineString as SerialFeatureCollection;

        const featureCollection = FeatureCollection.fromJson(geoJson);
        const manager = new GeoJsonManager(featureCollection);

        const coordinatesOriginal = (geoJson.features[0].geometry as SerialMultiLineString).coordinates;
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


        manager.mergeRouteLineStrings();


        expect(geoJson.features[0].geometry.type).toEqual('LineString');

        const coordinatesResult = (geoJson.features[0].geometry as SerialLineString).coordinates;
        expect(coordinatesResult).toEqual(
          [
            [100.0, 0.0, 100],
            [101.0, 1.0, 200],
            [102.0, 2.0, 300],
            [103.0, 3.0, 400]
          ]
        );

        expect(geoJson.features[0].properties.coordinateProperties?.times).toBeUndefined();
      });

      it('should do nothing for any types other than a MultiLineString', () => {
        const geoJson: SerialFeatureCollection = testData.GeoJson.Polygon as SerialFeatureCollection;

        const featureCollection = FeatureCollection.fromJson(geoJson);
        const manager = new GeoJsonManager(featureCollection);

        const coordinatesOriginal = (geoJson.features[0].geometry as SerialPolygon).coordinates;
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


        manager.mergeRouteLineStrings();


        expect(geoJson.features[0].geometry.type).toEqual('Polygon');

        const coordinatesResult = (geoJson.features[0].geometry as SerialPolygon).coordinates;
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
      });
    });

    describe('#mergeTrackLineStrings', () => {
      it('should merge all coordinates into one array from a MultiLineString without timestamps', () => {
        const geoJson: SerialFeatureCollection = testData.GeoJson.MultiLineString as SerialFeatureCollection;

        const featureCollection = FeatureCollection.fromJson(geoJson);
        const manager = new GeoJsonManager(featureCollection);

        const coordinatesOriginal = (geoJson.features[0].geometry as SerialMultiLineString).coordinates;
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


        manager.mergeTrackLineStrings();


        expect(geoJson.features[0].geometry.type).toEqual('LineString');

        const coordinatesResult = (geoJson.features[0].geometry as SerialLineString).coordinates;
        expect(coordinatesResult).toEqual(
          [
            [100.0, 0.0],
            [101.0, 1.0],
            [102.0, 2.0],
            [103.0, 3.0]
          ]
        );
      });

      it('should merge all coordinates into one array, and all timestamps into another array, from a MultiLineString track', () => {
        const geoJson: SerialFeatureCollection = testData.GeoJsonFromTracks.MultiLineString as SerialFeatureCollection;

        const featureCollection = FeatureCollection.fromJson(geoJson);
        const manager = new GeoJsonManager(featureCollection);

        const coordinatesOriginal = (geoJson.features[0].geometry as SerialMultiLineString).coordinates;
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


        manager.mergeTrackLineStrings();


        expect(geoJson.features[0].geometry.type).toEqual('LineString');

        const coordinatesResult = (geoJson.features[0].geometry as SerialLineString).coordinates;
        expect(coordinatesResult).toEqual(
          [
            [100.0, 0.0, 100],
            [101.0, 1.0, 200],
            [102.0, 2.0, 300],
            [103.0, 3.0, 400]
          ]
        );

        const timestampsResult = geoJson.features[0].properties.coordinateProperties.times;
        expect(timestampsResult).toEqual(
          ['1', '2', '3', '4']
        );
      });

      it('should do nothing for any types other than a MultiLineString', () => {
        const geoJson: SerialFeatureCollection = testData.GeoJson.Polygon as SerialFeatureCollection;

        const featureCollection = FeatureCollection.fromJson(geoJson);
        const manager = new GeoJsonManager(featureCollection);

        const coordinatesOriginal = (geoJson.features[0].geometry as SerialPolygon).coordinates;
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


        manager.mergeTrackLineStrings();


        expect(geoJson.features[0].geometry.type).toEqual('Polygon');

        const coordinatesResult = (geoJson.features[0].geometry as SerialPolygon).coordinates;
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
      });
    });
  });

  // TODO: Finish testing static methods
  describe('Static', () => {
    describe('#PointToTrackPoint', () => {
      it('should return a TrackPoint correlated with the Point geometry provided', () => {
        const position: Position = [1, 2, 3]
        const point = Point.fromPosition(position);

        const trkPt: TrackPoint = GeoJsonManager.PointToTrackPoint(point, undefined);

        expect(trkPt.toPosition()).toEqual(position);
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should return a TrackPoint correlated with the Point geometry & timestamp provided', () => {
        const position: Position = [1, 2, 3]
        const point = Point.fromPosition(position);
        const time = 'Foo';

        const trkPt: TrackPoint = GeoJsonManager.PointToTrackPoint(point, time);

        expect(trkPt.toPosition()).toEqual(position);
        expect(trkPt.timestamp).toEqual(time);
      });
    });

    describe('#PointsToTrackPoints', () => {
      it('should return a list of TrackPoints correlated with the MultiPoint geometry provided', () => {
        const positions: Position[] = [
          [1, 2, 7],
          [3, 4, 8],
          [5, 6, 9],
        ];
        const multiPoint: MultiPoint = MultiPoint.fromPositions(positions);

        const trkPts: TrackPoint[] = GeoJsonManager.PointsToTrackPoints(multiPoint.points, undefined);

        expect(trkPts.length).toEqual(positions.length);
        expect(trkPts[0].toPosition()).toEqual(positions[0]);
        expect(trkPts[0].timestamp).toBeUndefined();

        expect(trkPts[1].toPosition()).toEqual(positions[1]);
        expect(trkPts[1].timestamp).toBeUndefined();

        expect(trkPts[2].toPosition()).toEqual(positions[2]);
        expect(trkPts[2].timestamp).toBeUndefined();
      });

      it('should return a list of TrackPoints correlated with the MultiPoint geometry & timestamps provided', () => {
        const positions: Position[] = [
          [1, 2, 7],
          [3, 4, 8],
          [5, 6, 9],
        ];
        const multiPoint: MultiPoint = MultiPoint.fromPositions(positions);
        const times = [
          'foo1', 'foo3', 'foo5'
        ];

        const trkPts: TrackPoint[] = GeoJsonManager.PointsToTrackPoints(multiPoint.points, times);

        expect(trkPts.length).toEqual(positions.length);
        expect(trkPts[0].toPosition()).toEqual(positions[0]);
        expect(trkPts[0].timestamp).toEqual(times[0]);

        expect(trkPts[1].toPosition()).toEqual(positions[1]);
        expect(trkPts[1].timestamp).toEqual(times[1]);

        expect(trkPts[2].toPosition()).toEqual(positions[2]);
        expect(trkPts[2].timestamp).toEqual(times[2]);
      });
    });

    describe('#LineStringToTrackPoints', () => {
      it('should return a list of TrackPoints correlated with the LineString geometry provided', () => {
        const positions: Position[] = [
          [1, 2, 7],
          [3, 4, 8],
          [5, 6, 9],
        ];
        const lineString: LineString = LineString.fromPositions(positions);

        const trkPts: TrackPoint[] = GeoJsonManager.LineStringToTrackPoints(lineString, undefined);

        expect(trkPts.length).toEqual(positions.length);
        expect(trkPts[0].toPosition()).toEqual(positions[0]);
        expect(trkPts[0].timestamp).toBeUndefined();

        expect(trkPts[1].toPosition()).toEqual(positions[1]);
        expect(trkPts[1].timestamp).toBeUndefined();

        expect(trkPts[2].toPosition()).toEqual(positions[2]);
        expect(trkPts[2].timestamp).toBeUndefined();
      });

      it('should return a list of TrackPoints correlated with the LineString geometry & timestamps provided', () => {
        const positions: Position[] = [
          [1, 2, 7],
          [3, 4, 8],
          [5, 6, 9],
        ];
        const lineString: LineString = LineString.fromPositions(positions);
        const times = [
          'foo1', 'foo3', 'foo5'
        ];

        const trkPts: TrackPoint[] = GeoJsonManager.LineStringToTrackPoints(lineString, times);

        expect(trkPts.length).toEqual(positions.length);
        expect(trkPts[0].toPosition()).toEqual(positions[0]);
        expect(trkPts[0].timestamp).toEqual(times[0]);

        expect(trkPts[1].toPosition()).toEqual(positions[1]);
        expect(trkPts[1].timestamp).toEqual(times[1]);

        expect(trkPts[2].toPosition()).toEqual(positions[2]);
        expect(trkPts[2].timestamp).toEqual(times[2]);
      });
    });

    describe('#LineStringsToTrackPoints', () => {
      it('should return a nested list of TrackPoints correlated with the list of LineString geometries provided', () => {
        const positions: Position[][] = [
          [
            [1, 2, 7],
            [3, 4, 8],
            [5, 6, 9]
          ], [
            [10, 11, 16],
            [12, 13, 17],
            [14, 15, 18]
          ],
        ];
        const lineString1: LineString = LineString.fromPositions(positions[0]);
        const lineString2: LineString = LineString.fromPositions(positions[1]);
        const lineStrings = [lineString1, lineString2];

        const trkPts: TrackPoint[][] = GeoJsonManager.LineStringsToTrackPoints(lineStrings, undefined);

        expect(trkPts.length).toEqual(positions.length);
        expect(trkPts[0].length).toEqual(positions[0].length);
        expect(trkPts[1].length).toEqual(positions[1].length);

        // LineString 1
        expect(trkPts[0][0].toPosition()).toEqual(positions[0][0]);
        expect(trkPts[0][0].timestamp).toBeUndefined();

        expect(trkPts[0][1].toPosition()).toEqual(positions[0][1]);
        expect(trkPts[0][1].timestamp).toBeUndefined();

        expect(trkPts[0][2].toPosition()).toEqual(positions[0][2]);
        expect(trkPts[0][2].timestamp).toBeUndefined();

        // LineString 2
        expect(trkPts[1][0].toPosition()).toEqual(positions[1][0]);
        expect(trkPts[1][0].timestamp).toBeUndefined();

        expect(trkPts[1][1].toPosition()).toEqual(positions[1][1]);
        expect(trkPts[1][1].timestamp).toBeUndefined();

        expect(trkPts[1][2].toPosition()).toEqual(positions[1][2]);
        expect(trkPts[1][2].timestamp).toBeUndefined();
      });

      it('should return a nested list of TrackPoints correlated with the list of LineString geometries & timestamps provided', () => {
        const positions: Position[][] = [
          [
            [1, 2, 7],
            [3, 4, 8],
            [5, 6, 9]
          ], [
            [10, 11, 16],
            [12, 13, 17],
            [14, 15, 18]
          ],
        ];
        const lineString1: LineString = LineString.fromPositions(positions[0]);
        const lineString2: LineString = LineString.fromPositions(positions[1]);
        const lineStrings = [lineString1, lineString2];

        const times = [
          ['foo1', 'foo3', 'foo5'],
          ['foo10', 'foo12', 'foo14'],
        ];

        const trkPts: TrackPoint[][] = GeoJsonManager.LineStringsToTrackPoints(lineStrings, times);

        expect(trkPts.length).toEqual(positions.length);
        expect(trkPts[0].length).toEqual(positions[0].length);
        expect(trkPts[1].length).toEqual(positions[1].length);

        // LineString 1
        expect(trkPts[0][0].toPosition()).toEqual(positions[0][0]);
        expect(trkPts[0][0].timestamp).toEqual(times[0][0]);

        expect(trkPts[0][1].toPosition()).toEqual(positions[0][1]);
        expect(trkPts[0][1].timestamp).toEqual(times[0][1]);

        expect(trkPts[0][2].toPosition()).toEqual(positions[0][2]);
        expect(trkPts[0][2].timestamp).toEqual(times[0][2]);

        // LineString 2
        expect(trkPts[1][0].toPosition()).toEqual(positions[1][0]);
        expect(trkPts[1][0].timestamp).toEqual(times[1][0]);

        expect(trkPts[1][1].toPosition()).toEqual(positions[1][1]);
        expect(trkPts[1][1].timestamp).toEqual(times[1][1]);

        expect(trkPts[1][2].toPosition()).toEqual(positions[1][2]);
        expect(trkPts[1][2].timestamp).toEqual(times[1][2]);
      });
    });
  });
});