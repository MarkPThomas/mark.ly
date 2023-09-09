// import {
//   getSegmentBeforeTime,
//   getSegmentAfterTime,
//   getSegmentBetweenTimes,
//   getSegmentsSplitByTimes
// } from '../GeoJSON_Refactor';

import {
  FeatureCollection as SerialFeatureCollection,
  LineString as SerialLineString
} from 'geojson';

import {
  FeatureCollection,
  Feature,
  FeatureProperty,
  Point,
  LineString,
  MultiLineString,
  GeoJsonGeometryTypes,
  GeoJsonTypes,
  MultiPoint,
  Position
} from '../../GeoJSON';

import { TrackPoint } from './TrackPoint';
import { ITrackPropertyProperties, TrackProperty } from './TrackProperty';

import { GeoJsonManager } from '../GeoJsonManager';

import { GeoJsonTrack } from './GeoJsonTrack';
import { ITrackSegmentLimits } from './TrackSegment';

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

describe('##GeoJsonTrack', () => {
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

  describe('Creation', () => {
    let lineString: LineString;
    let properties: TrackProperty;
    let featureCollection: FeatureCollection;
    // let geoJsonTrack: GeoJsonTrack;

    beforeEach(() => {
      const featureJson = lineStringTrack.features[0];
      lineString = LineString.fromPositions(featureJson.geometry.coordinates);
      properties = TrackProperty.fromJson(featureJson.properties);

      const feature = Feature.fromGeometry(lineString, { properties });
      featureCollection = FeatureCollection.fromFeatures([feature]);

      // geoJsonTrack = new GeoJsonTrack(featureCollection);
    });

    describe('#constructor', () => {
      it('should create a new GeoJsonTrack object with some select exposed properties', () => {
        const expectedTrackMetaData = { ...lineStringTrack.features[0].properties };
        delete expectedTrackMetaData.coordinateProperties;

        const geoJsonTrack = new GeoJsonTrack(featureCollection);

        expect(geoJsonTrack.trackMetaData).toEqual(expectedTrackMetaData);
      });
    });

  });


  describe('Methods', () => {
    let featureCollectionJson: SerialFeatureCollection;
    let featureCollection: FeatureCollection;
    let geoJsonTrack: GeoJsonTrack;

    beforeEach(() => {
      featureCollectionJson = JSON.parse(JSON.stringify(testData.GeoJsonFromTracks.LineString as SerialFeatureCollection));
      featureCollection = FeatureCollection.fromJson(featureCollectionJson);
      geoJsonTrack = new GeoJsonTrack(featureCollection);
    });

    describe('#trackPoints', () => {
      it('should return a list of all trackpoints in the GeoJson object', () => {
        const trackPoints = geoJsonTrack.trackPoints();
        const featurePoints = (featureCollection.features[0].geometry as LineString).points;
        const featureTimestamps = (featureCollection.features[0].properties as TrackProperty).coordinateProperties.times;

        expect(trackPoints.length).toEqual(featurePoints.length);
        expect(trackPoints[1].toPoint()).toEqual(featurePoints[1]);
        expect(trackPoints[1].timestamp).toEqual(featureTimestamps[1]);
      })
    });

    describe('#updateGeoJsonTrack', () => {
      it('should do nothing if segment data has no points', () => {
        const originalJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const segData = { segPoints: [], segTimestamps: [] };

        geoJsonTrack.updateGeoJsonTrack(segData);

        expect(featureCollectionJson).toEqual(originalJson);
      });

      it('should update the provided GeoJSON object', () => {
        const originalJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const modifiedJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const modifiedFeatureCollection = FeatureCollection.fromJson(modifiedJson);

        const segData = {
          segPoints: [
            Point.fromPosition([101.0, 1.0, 200]),
            Point.fromPosition([102.0, 2.0, 300]),
          ],
          segTimestamps: ['2, 3']
        };

        geoJsonTrack.updateGeoJsonTrack(segData, modifiedFeatureCollection);

        expect(featureCollectionJson).toEqual(originalJson);
        expect(featureCollectionJson).not.toEqual(modifiedJson);
        expect(featureCollection).not.toEqual(modifiedFeatureCollection);

        const modifiedFeature = modifiedJson.features[0];
        expect((modifiedFeature.geometry as SerialLineString).coordinates).toEqual(
          GeoJsonManager.PointsToPositions(segData.segPoints)
        );
        expect(modifiedFeature.properties.coordinateProperties.times).toEqual(segData.segTimestamps);
      });

      it('should update the GeoJsonTrack GeoJSON object if no GeoJSON object is provided', () => {
        const originalJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const segData = {
          segPoints: [
            Point.fromPosition([101.0, 1.0, 200]),
            Point.fromPosition([102.0, 2.0, 300]),
          ],
          segTimestamps: ['2, 3']
        };

        geoJsonTrack.updateGeoJsonTrack(segData);

        expect(featureCollectionJson).not.toEqual(originalJson);

        const modifiedFeature = featureCollectionJson.features[0];
        expect((modifiedFeature.geometry as SerialLineString).coordinates).toEqual(
          GeoJsonManager.PointsToPositions(segData.segPoints)
        );
        expect(modifiedFeature.properties.coordinateProperties.times).toEqual(segData.segTimestamps);
      });
    });

    describe('#generateGeoJsonTrack', () => {
      it('should do nothing if segment data has no points', () => {
        const originalJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const geoJsonTrack: GeoJsonTrack = new GeoJsonTrack(featureCollection);
        const segData = { segPoints: [], segTimestamps: [] };

        const resultCollection = geoJsonTrack.generateGeoJsonTrack(segData);

        expect(resultCollection.equals(featureCollection)).toBeTruthy();
        expect(resultCollection.toJson()).toEqual(originalJson);
      });

      it('should do nothing to the GeoJsonTrack GeoJSON object', () => {
        const originalJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const geoJsonTrack: GeoJsonTrack = new GeoJsonTrack(featureCollection);
        const segData = {
          segPoints: [
            Point.fromPosition([101.0, 1.0, 200]),
            Point.fromPosition([102.0, 2.0, 300]),
          ],
          segTimestamps: ['2, 3']
        };

        const resultCollection = geoJsonTrack.generateGeoJsonTrack(segData);

        expect(resultCollection.equals(featureCollection)).toBeFalsy();
        expect(featureCollectionJson).toEqual(originalJson);
      });

      it('should return a new GeoJSON object updated with the segment data provided', () => {
        const originalJson = JSON.parse(JSON.stringify(featureCollectionJson));
        const geoJsonTrack: GeoJsonTrack = new GeoJsonTrack(featureCollection);
        const segData = {
          segPoints: [
            Point.fromPosition([101.0, 1.0, 200]),
            Point.fromPosition([102.0, 2.0, 300]),
          ],
          segTimestamps: ['2, 3']
        };

        const resultCollection = geoJsonTrack.generateGeoJsonTrack(segData);

        const modifiedFeature = resultCollection.features[0];
        expect((modifiedFeature.geometry as LineString).points).toEqual(segData.segPoints);
        expect(modifiedFeature.properties.coordinateProperties.times).toEqual(segData.segTimestamps);
      });
    });


    describe('IQuery', () => {
      let lineString: LineString;
      let properties: TrackProperty;
      let geoJsonTrack: GeoJsonTrack;

      beforeEach(() => {
        const featureJson = lineStringTrack.features[0];
        lineString = LineString.fromPositions(featureJson.geometry.coordinates);
        properties = TrackProperty.fromJson(featureJson.properties);

        const feature = Feature.fromGeometry(lineString, { properties });
        const featureCollection = FeatureCollection.fromFeatures([feature]);

        geoJsonTrack = new GeoJsonTrack(featureCollection);
      });


      describe('#getSegmentBeforeTime', () => {
        it('should return segment before the timestamp found in a GeoJSON object', () => {
          const timestamp = '3';

          const { segPoints, segTimestamps } = geoJsonTrack.getSegmentBeforeTime(timestamp);

          expect(segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200],
                [102.0, 2.0, 300]
              ]
            )
          );
          expect(segTimestamps).toEqual(['1', '2', '3']);
        });

        it('should return empty segment arrays when the timestamp is not found in a GeoJSON object', () => {
          const timestamp = '3.5';

          const segments = geoJsonTrack.getSegmentBeforeTime(timestamp)

          expect(segments).toEqual({ segPoints: [], segTimestamps: [] });
        });
      });

      describe('#getSegmentAfterTime', () => {
        it('should return segment after the timestamp found in a GeoJSON object', () => {
          const timestamp = '3';

          const { segPoints, segTimestamps } = geoJsonTrack.getSegmentAfterTime(timestamp);

          expect(segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [102.0, 2.0, 300],
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segTimestamps).toEqual(['3', '4', '5', '6']);
        });

        it('should return empty segment arrays when the timestamp is not found in a GeoJSON object', () => {
          const timestamp = '3.5';

          const segments = geoJsonTrack.getSegmentBeforeTime(timestamp)

          expect(segments).toEqual({ segPoints: [], segTimestamps: [] });
        });
      });

      describe('#getSegmentBetweenTimes', () => {
        it('should return track segment before the timestamp found in a GeoJSON object', () => {
          const timestampStart = '2';
          const timestampEnd = '4';

          const { segPoints, segTimestamps } = geoJsonTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

          expect(segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [101.0, 1.0, 200],
                [102.0, 2.0, 300],
                [103.0, 3.0, 400]
              ]
            )
          );
          expect(segTimestamps).toEqual(['2', '3', '4']);
        });

        it('should return undefined when the start timestamp is not found in a GeoJSON object', () => {
          const timestampStart = '2.1';
          const timestampEnd = '4';

          const segments = geoJsonTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

          expect(segments).toEqual({ segPoints: [], segTimestamps: [] });
        });

        it('should return undefined when the end timestamp is not found in the track', () => {
          const timestampStart = '2';
          const timestampEnd = '4.1';

          const segments = geoJsonTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

          expect(segments).toEqual({ segPoints: [], segTimestamps: [] });
        });
      });

      describe('#getSegmentsSplitByTimes', () => {
        it('should return two segments split by a single timestamp found in a GeoJSON object', () => {
          const timestamp = '3';

          const segments = geoJsonTrack.getSegmentsSplitByTimes([timestamp]);

          expect(segments[0].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200],
                [102.0, 2.0, 300]
              ]
            )
          );
          expect(segments[0].segTimestamps).toEqual(
            ['1', '2', '3']
          );


          expect(segments[1].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [102.0, 2.0, 300],
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segments[1].segTimestamps).toEqual(
            ['3', '4', '5', '6']
          );
        });

        it('should return three segments split by a two timestamps found in a GeoJSON object', () => {
          const timestamp1 = '2';
          const timestamp2 = '4';

          const segments = geoJsonTrack.getSegmentsSplitByTimes([timestamp1, timestamp2]);

          expect(segments[0].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200]
              ]
            )
          );
          expect(segments[0].segTimestamps).toEqual(
            ['1', '2']
          );

          expect(segments[1].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [101.0, 1.0, 200],
                [102.0, 2.0, 300],
                [103.0, 3.0, 400]
              ]
            )
          );
          expect(segments[1].segTimestamps).toEqual(
            ['2', '3', '4']
          );

          expect(segments[2].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segments[2].segTimestamps).toEqual(
            ['4', '5', '6']
          );
        });

        it('should return two segments split by 1 timestamp found in a GeoJSON object with 2 timestamps provided', () => {
          const timestamp = '3';
          const timestampInvalid = '3.1';

          const segments = geoJsonTrack.getSegmentsSplitByTimes([timestamp, timestampInvalid]);

          expect(segments[0].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200],
                [102.0, 2.0, 300]
              ]
            )
          );
          expect(segments[0].segTimestamps).toEqual(
            ['1', '2', '3']
          );

          expect(segments[1].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [102.0, 2.0, 300],
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segments[1].segTimestamps).toEqual(
            ['3', '4', '5', '6']
          );
        });

        it('should return original track segments when the timestamp is not found in a GeoJSON object', () => {
          const timestamp = '3.1';

          const segments = geoJsonTrack.getSegmentsSplitByTimes([timestamp]);

          expect(segments[0].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200],
                [102.0, 2.0, 300],
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segments[0].segTimestamps).toEqual(
            ['1', '2', '3', '4', '5', '6']
          );
        });

        it('should return only the original track when split on the start timestamp', () => {
          const timestamp = '1';

          const segments = geoJsonTrack.getSegmentsSplitByTimes([timestamp]);

          expect(segments[0].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200],
                [102.0, 2.0, 300],
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segments[0].segTimestamps).toEqual(
            ['1', '2', '3', '4', '5', '6']
          );
        });

        it('should return only the original track when split on the end timestamp', () => {
          const timestamp = '6';

          const segments = geoJsonTrack.getSegmentsSplitByTimes([timestamp]);

          expect(segments[0].segPoints).toEqual(
            GeoJsonManager.PositionsToPoints(
              [
                [100.0, 0.0, 100],
                [101.0, 1.0, 200],
                [102.0, 2.0, 300],
                [103.0, 3.0, 400],
                [104.0, 4.0, 500],
                [105.0, 5.0, 600]
              ]
            )
          );
          expect(segments[0].segTimestamps).toEqual(
            ['1', '2', '3', '4', '5', '6']
          );
        });
      });
    });


    describe('IClippable', () => {
      let lineString: LineString;
      let properties: TrackProperty;
      let featureCollection: FeatureCollection;
      let geoJsonTrack: GeoJsonTrack;

      beforeEach(() => {
        const featureJson = lineStringTrack.features[0];
        lineString = LineString.fromPositions(featureJson.geometry.coordinates);
        properties = TrackProperty.fromJson(featureJson.properties);

        const feature = Feature.fromGeometry(lineString, { properties });
        featureCollection = FeatureCollection.fromFeatures([feature]);

        geoJsonTrack = new GeoJsonTrack(featureCollection);
      });

      describe('#clipBeforeTime', () => {
        it('should clip track to segment before the timestamp found in a GeoJSON object', () => {
          const timestamp = '3';

          const clippedTrack = geoJsonTrack.clipBeforeTime(timestamp)

          expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300]
            ]
          );
          expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['1', '2', '3']);
        });

        it('should do nothing to the segment if the timestamp is not found', () => {
          const timestamp = '3.1';

          const segments = geoJsonTrack.clipBeforeTime(timestamp)

          expect(segments).toEqual(featureCollection);
        });
      });

      describe('#clipAfterTime', () => {
        it('should clip track to segment before the timestamp found in a GeoJSON object', () => {
          const timestamp = '3';

          const clippedTrack = geoJsonTrack.clipAfterTime(timestamp)

          expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual(
            [
              [102.0, 2.0, 300],
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600]
            ]
          );
          expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['3', '4', '5', '6']);
        });

        it('should do nothing to the segment if the timestamp is not found', () => {
          const timestamp = '3.1';

          const segments = geoJsonTrack.clipAfterTime(timestamp)

          expect(segments).toEqual(featureCollection);
        });
      });

      describe('#clipBetweenTimes', () => {
        it('should clip track to segment between the timestamps found in a GeoJSON object', () => {
          const timestampStart = '2';
          const timestampEnd = '4';

          const clippedTrack = geoJsonTrack.clipBetweenTimes(timestampStart, timestampEnd)

          expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual(
            [
              [101.0, 1.0, 200],
              [102.0, 2.0, 300],
              [103.0, 3.0, 400]
            ]
          );
          expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['2', '3', '4']);
        });

        it('should do nothing to the segment when the start timestamp is not found in a GeoJSON object', () => {
          const timestampStart = '2.1';
          const timestampEnd = '4';

          const segments = geoJsonTrack.clipBetweenTimes(timestampStart, timestampEnd)

          expect(segments).toEqual(featureCollection);
        });

        it('should do nothing to the segment when the end timestamp is not found in a GeoJSON object', () => {
          const timestampStart = '3';
          const timestampEnd = '4.1';

          const segments = geoJsonTrack.clipBetweenTimes(timestampStart, timestampEnd)

          expect(segments).toEqual(featureCollection);
        });
      });
    });


    describe('ISplittable', () => {
      let lineString: LineString;
      let properties: TrackProperty;
      let featureCollection: FeatureCollection;
      let geoJsonTrack: GeoJsonTrack;

      beforeEach(() => {
        const featureJson = lineStringTrack.features[0];
        lineString = LineString.fromPositions(featureJson.geometry.coordinates);
        properties = TrackProperty.fromJson(featureJson.properties);

        const feature = Feature.fromGeometry(lineString, { properties });
        featureCollection = FeatureCollection.fromFeatures([feature]);

        geoJsonTrack = new GeoJsonTrack(featureCollection);
      });


      describe('#splitByTimes', () => {
        it('should return two track segments split by a single timestamp found in a GeoJSON object', () => {
          const timestamp = '3';

          const tracks = geoJsonTrack.splitByTimes([timestamp]);

          expect(tracks.length).toEqual(2);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300]
            ]
          );
          expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
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

        it('should return three track segments split by two timestamps found in a GeoJSON object', () => {
          const timestamp1 = '2';
          const timestamp2 = '4';

          const tracks = geoJsonTrack.splitByTimes([timestamp1, timestamp2]);

          expect(tracks.length).toEqual(3);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200]
            ])
            ;
          expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [101.0, 1.0, 200],
              [102.0, 2.0, 300],
              [103.0, 3.0, 400]
            ]
          );
          expect((tracks[2].features[0].geometry as LineString).toPositions()).toEqual(
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

        it('should return two track segments split by 1 timestamp found in a GeoJSON object with 2 timestamps provided', () => {
          const timestamp = '3';
          const timestampInvalid = '3.1';

          const tracks = geoJsonTrack.splitByTimes([timestamp, timestampInvalid]);

          expect(tracks.length).toEqual(2);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300]
            ]
          );
          expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
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

        it('should return no track segments when the timestamp is not found in a GeoJSON object', () => {
          const timestamp = '3.1';

          const tracks = geoJsonTrack.splitByTimes([timestamp]);

          expect(tracks.length).toEqual(0);
          // expect(tracks[0]).toEqual(featureCollection);
        });

        it('should return no track segments when a timestamp matches the first track timestamp', () => {
          const timestamp = '1';

          const tracks = geoJsonTrack.splitByTimes([timestamp]);

          expect(tracks.length).toEqual(0);
          // expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
          //   [
          //     [100.0, 0.0, 100],
          //     [101.0, 1.0, 200],
          //     [102.0, 2.0, 300],
          //     [103.0, 3.0, 400],
          //     [104.0, 4.0, 500],
          //     [105.0, 5.0, 600]
          //   ]
          // );

          // expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
          //   ['1', '2', '3', '4', '5', '6']
          // );
        });

        it('should return no track segments when a timestamp matches the last track timestamp', () => {
          const timestamp = '6';

          const tracks = geoJsonTrack.splitByTimes([timestamp]);

          expect(tracks.length).toEqual(0);
          // expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
          //   [
          //     [100.0, 0.0, 100],
          //     [101.0, 1.0, 200],
          //     [102.0, 2.0, 300],
          //     [103.0, 3.0, 400],
          //     [104.0, 4.0, 500],
          //     [105.0, 5.0, 600]
          //   ]
          // );

          // expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
          //   ['1', '2', '3', '4', '5', '6']
          // );
        });
      });

      describe('#splitToSegment', () => {
        it('should return the specified segment at the start of the track', () => {
          const segment: ITrackSegmentLimits = {
            startTime: '1',
            endTime: '2',
          }
          const track = geoJsonTrack.splitToSegment(segment);

          expect((track.features[0].geometry as LineString).toPositions()).toEqual(
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
          const segment: ITrackSegmentLimits = {
            startTime: '5',
            endTime: '6',
          }
          const track = geoJsonTrack.splitToSegment(segment);

          expect((track.features[0].geometry as LineString).toPositions()).toEqual(
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
          const segment: ITrackSegmentLimits = {
            startTime: '3',
            endTime: '4',
          }
          const track = geoJsonTrack.splitToSegment(segment);

          expect((track.features[0].geometry as LineString).toPositions()).toEqual(
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
          const segment: ITrackSegmentLimits = {
            startTime: '3.1',
            endTime: '4.1',
          }
          const track = geoJsonTrack.splitToSegment(segment);
          expect(track).toBeUndefined();
        });
      });

      describe('#splitBySegments', () => {
        it('should return two track segments split by a single segment found in a GeoJSON object', () => {
          const segment: ITrackSegmentLimits = {
            startTime: '3',
            endTime: '4',
          }
          const tracks = geoJsonTrack.splitBySegments([segment]);

          expect(tracks.length).toEqual(2);

          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300]
            ]
          );
          expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
            ['1', '2', '3']
          );

          expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600]
            ]
          );
          expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
            ['4', '5', '6']
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

          const featureJson = lineStringTrack.features[0];
          const lineString = LineString.fromPositions(featureJson.geometry.coordinates);
          const properties = TrackProperty.fromJson(featureJson.properties);

          const feature = Feature.fromGeometry(lineString, { properties });
          const featureCollection = FeatureCollection.fromFeatures([feature]);

          const geoJsonTrack = new GeoJsonTrack(featureCollection);

          const segment1: ITrackSegmentLimits = {
            startTime: '3',
            endTime: '4',
          }

          const segment2: ITrackSegmentLimits = {
            startTime: '7',
            endTime: '8',
          }

          const tracks = geoJsonTrack.splitBySegments([segment1, segment2]);

          expect(tracks.length).toEqual(3);

          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300]
            ]
          );
          expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
            ['1', '2', '3']
          );

          expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600],
              [106.0, 6.0, 700]
            ]
          );
          expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
            ['4', '5', '6', '7']
          );

          expect((tracks[2].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [107.0, 7.0, 800],
              [108.0, 8.0, 900],
              [109.0, 9.0, 1000]
            ]
          );
          expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
            ['8', '9', '10']
          );
        });

        it('should return two track segments split by 1 segment found in a GeoJSON object with 2 segment provided', () => {
          const segment: ITrackSegmentLimits = {
            startTime: '3',
            endTime: '4'
          }
          const segmentInvalid: ITrackSegmentLimits = {
            startTime: '5.1',
            endTime: '6.1'
          }

          const tracks = geoJsonTrack.splitBySegments([segment, segmentInvalid]);

          expect(tracks.length).toEqual(2);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300]
            ]
          );
          expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
            ['1', '2', '3']
          );

          expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
            [
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600]
            ]
          );
          expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
            ['4', '5', '6']
          );
        });

        it('should return the track segment unchanged when the segment is not found in a GeoJSON object', () => {
          const segmentInvalid: ITrackSegmentLimits = {
            startTime: '5.1',
            endTime: '6.1'
          }

          const tracks = geoJsonTrack.splitBySegments([segmentInvalid]);

          expect(tracks.length).toEqual(1);
          expect(tracks[0]).toEqual(featureCollection);
        });

        it('should return only the remaining track when a segment matches the first track segment', () => {
          const segment: ITrackSegmentLimits = {
            startTime: '1',
            endTime: '3',
          }

          const tracks = geoJsonTrack.splitBySegments([segment]);

          expect(tracks.length).toEqual(1);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
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
          const segment: ITrackSegmentLimits = {
            startTime: '2',
            endTime: '4',
          }

          const tracks = geoJsonTrack.splitBySegments([segment]);

          expect(tracks.length).toEqual(1);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
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
          const segment: ITrackSegmentLimits = {
            startTime: '4',
            endTime: '6'
          }

          const tracks = geoJsonTrack.splitBySegments([segment]);

          expect(tracks.length).toEqual(1);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
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
          const segment: ITrackSegmentLimits = {
            startTime: '3',
            endTime: '5',
          }

          const tracks = geoJsonTrack.splitBySegments([segment]);

          expect(tracks.length).toEqual(1);
          expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
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
    });
  });
});