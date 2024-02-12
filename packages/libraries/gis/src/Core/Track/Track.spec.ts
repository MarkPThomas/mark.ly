import { VertexNode } from '@MPT/geometry';
import { FeatureCollection } from '@MPT/geojson';
import { LineString, Point } from '@MPT/geojson/Geometries';

import { TrackPoint } from './TrackPoint';
import { TrackSegment, TrackSegmentData } from './TrackSegment';
import { EvaluatorArgs, Track } from './Track';
import { GeoJsonManager } from '../GeoJsonManager';
import { ITrackPropertyProperties } from './TrackProperty';
import { ITimeRange } from '../Time/TimeRange';
import { PolylineTrack } from './PolylineTrack';

describe('##Track', () => {
  let lineStringTrack;
  beforeEach(() => {
    lineStringTrack = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coords: [
              [100.0, 0.0, 100],
              [99.0, -1.0, 200],
              [103.5, 2.5, 350],
              [103.0, 3.0, 420],
              [104.75, 3.75, 510],
              [105.0, 5.0, 600],
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: [
                '2023-07-04T20:00:00Z',
                '2023-07-04T20:00:20Z',
                '2023-07-04T20:00:30Z',
                '2023-07-04T20:00:40Z',
                '2023-07-04T20:00:50Z',
                '2023-07-04T20:01:10Z'
              ]
            }
          },
        }
      ],
    }
  });

  // TODO: Test
  describe('Static Methods', () => {
    describe('#nodesToTrackPoints', () => {

    });

    describe('#nodeHeadToTrackPoints', () => {

    });
  });

  describe('Creation', () => {
    describe('#fromGeoJson', () => {
      let featureCollection: FeatureCollection;
      let trackPoints: TrackPoint[];

      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const coord3 = new TrackPoint(-8.956936, -77.777381);
        coord3.timestamp = '2023-07-04T17:22:46Z';

        const coord4 = new TrackPoint(-8.956758, -77.777211);
        coord4.timestamp = '2023-07-04T17:23:08Z';

        trackPoints = [
          coord1,
          coord2,
          coord3,
          coord4
        ];

        featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
      });

      it('should create a new Polyline object from the provided TrackPoints', () => {
        const track = Track.fromGeoJson(featureCollection);

        expect(track.firstPoint.val.lat).toEqual(trackPoints[0].lat);
        expect(track.firstPoint.val.lng).toEqual(trackPoints[0].lng);
        expect(track.firstPoint.val.timestamp).toEqual(trackPoints[0].timestamp);
        expect(track.firstPoint.nextSeg).toEqual(track.firstSegment);
        expect(track.firstSegment.prevVert.val.lat).toEqual(trackPoints[0].lat);
        expect(track.firstSegment.prevVert.val.lng).toEqual(trackPoints[0].lng);
        expect(track.firstSegment.prevVert.val.timestamp).toEqual(trackPoints[0].timestamp);
        expect(track.firstSegment.nextVert.val.lat).toEqual(trackPoints[1].lat);
        expect(track.firstSegment.nextVert.val.lng).toEqual(trackPoints[1].lng);
        expect(track.firstSegment.nextVert.val.timestamp).toEqual(trackPoints[1].timestamp);
      });
    });

    describe('#fromPoints', () => {
      let trackPoints: TrackPoint[];

      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const coord3 = new TrackPoint(-8.956936, -77.777381);
        coord3.timestamp = '2023-07-04T17:22:46Z';

        const coord4 = new TrackPoint(-8.956758, -77.777211);
        coord4.timestamp = '2023-07-04T17:23:08Z';

        trackPoints = [
          coord1,
          coord2,
          coord3,
          coord4
        ];
      });

      it('should create a new Polyline object from the provided TrackPoints', () => {
        const track = Track.fromPoints(trackPoints);

        expect(track.firstPoint.val).toEqual(trackPoints[0]);
        expect(track.firstPoint.nextSeg).toEqual(track.firstSegment);
        expect(track.firstSegment.prevVert.val).toEqual(trackPoints[0]);
        expect(track.firstSegment.nextVert.val).toEqual(trackPoints[1]);
      });
    });

    // TODO: Test
    describe('#fromPolylines', () => {

    });
  });

  describe('Duplication', () => {
    let trackPoints: TrackPoint[];
    let track: Track;
    let segmentData: TrackSegmentData

    beforeEach(() => {
      const coord1 = new TrackPoint(-8.957287, -77.777452);
      coord1.timestamp = '2023-07-04T17:22:15Z';

      const coord2 = new TrackPoint(-8.957069, -77.777400);
      coord2.timestamp = '2023-07-04T17:22:35Z';

      const coord3 = new TrackPoint(-8.956936, -77.777381);
      coord3.timestamp = '2023-07-04T17:22:46Z';

      const coord4 = new TrackPoint(-8.956758, -77.777211);
      coord4.timestamp = '2023-07-04T17:23:08Z';

      trackPoints = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      track = Track.fromPoints(trackPoints);

      segmentData = {
        segPoints: [
          Point.fromLngLat(120, 45, 100),
          Point.fromLngLat(121, 46, 200),
          Point.fromLngLat(122, 47, 300),
          Point.fromLngLat(123, 48, 400),
          Point.fromLngLat(124, 49, 500),
        ],
        segTimestamps: [
          '1',
          '2',
          '3',
          '4',
          '5'
        ]
      };
    });

    it('should Foo', () => { })


    // TODO: Not used
    describe('#updateBySegment', () => {
      //     it('should add data to an empty track', () => {
      //       const track = Track.fromTrackPoints([]);

      //       track.updateBySegment(segmentData);

      //       const trackPoints = track.trackPoints();
      //       expect(trackPoints.length).toEqual(5);

      //       expect(trackPoints[0].lat).toEqual(45);
      //       expect(trackPoints[0].lng).toEqual(120);
      //       expect(trackPoints[0].alt).toEqual(100);
      //       expect(trackPoints[0].timestamp).toEqual('1');

      //       expect(trackPoints[4].lat).toEqual(49);
      //       expect(trackPoints[4].lng).toEqual(124);
      //       expect(trackPoints[4].alt).toEqual(500);
      //       expect(trackPoints[4].timestamp).toEqual('5');
      //     });

      //     it('should do nothing if segment data has no points', () => {
      //       const segmentData: TrackSegmentData = {
      //         segPoints: [],
      //         segTimestamps: []
      //       };

      //       const trackPointsOriginal = track.trackPoints();

      //       track.updateBySegment(segmentData);

      //       const trackPoints = track.trackPoints();

      //       expect(trackPoints.length).toEqual(trackPointsOriginal.length);

      //       expect(trackPoints[0].equals(trackPointsOriginal[0])).toBeTruthy();
      //       expect(trackPoints[4].equals(trackPointsOriginal[4])).toBeTruthy();
      //     });

      //     it('should update the Track with the provided segment data', () => {
      //       const trackPointsOriginal = track.trackPoints();

      //       track.updateBySegment(segmentData);

      //       const trackPoints = track.trackPoints();

      //       expect(trackPointsOriginal.length).toEqual(4);
      //       expect(trackPoints.length).toEqual(5);

      //       expect(trackPoints[0].equals(trackPointsOriginal[0])).toBeTruthy();
      //       expect(trackPoints[4].equals(trackPointsOriginal[4])).toBeTruthy();
      //     });
    });

    // TODO: Not used once Split feature finished
    describe('#copyBySegment', () => {
      //     it('should return a new Track with the supplied data when called on an empty track', () => {
      //       const track = Track.fromTrackPoints([]);
      //       const segmentData: TrackSegmentData = {
      //         segPoints: [],
      //         segTimestamps: []
      //       };

      //       const copiedTrack = track.copyBySegment(segmentData);

      //       const trackPoints = copiedTrack.trackPoints();

      //       expect(trackPoints.length).toEqual(5);

      //       expect(trackPoints[0].lat).toEqual(45);
      //       expect(trackPoints[0].lng).toEqual(120);
      //       expect(trackPoints[0].alt).toEqual(100);
      //       expect(trackPoints[0].timestamp).toEqual('1');

      //       expect(trackPoints[4].lat).toEqual(49);
      //       expect(trackPoints[4].lng).toEqual(124);
      //       expect(trackPoints[4].alt).toEqual(500);
      //       expect(trackPoints[4].timestamp).toEqual('5');
      //     });

      //     it('return an empty Track if segment data has no points', () => {
      //       const segmentData: TrackSegmentData = {
      //         segPoints: [],
      //         segTimestamps: []
      //       };

      //       const copiedTrack = track.copyBySegment(segmentData);

      //       const trackPoints = copiedTrack.trackPoints();

      //       expect(trackPoints.length).toEqual(0);
      //     });

      //     it('should return a copy of the Track updated with the provided segment data', () => {
      //       const trackPointsOriginal = track.trackPoints();

      //       const updatedTrack = track.copyBySegment(segmentData);

      //       const updatedTrackPoints = updatedTrack.trackPoints();

      //       expect(trackPointsOriginal.length).toEqual(4);
      //       expect(updatedTrackPoints.length).toEqual(5);

      //       expect(updatedTrackPoints[0].equals(trackPointsOriginal[0])).toBeFalsy();
      //       expect(updatedTrackPoints[4].equals(trackPointsOriginal[4])).toBeFalsy();

      //       expect(updatedTrackPoints[0].lat).toEqual(45);
      //       expect(updatedTrackPoints[0].lng).toEqual(120);
      //       expect(updatedTrackPoints[0].alt).toEqual(100);
      //       expect(updatedTrackPoints[0].timestamp).toEqual('1');

      //       expect(updatedTrackPoints[4].lat).toEqual(49);
      //       expect(updatedTrackPoints[4].lng).toEqual(124);
      //       expect(updatedTrackPoints[4].alt).toEqual(500);
      //       expect(updatedTrackPoints[4].timestamp).toEqual('5');
      //     });
    });
  });


  describe('Common Interfaces', () => {
    let trackPoints: TrackPoint[];
    let featureCollection: FeatureCollection;
    let track: Track;

    beforeEach(() => {
      const coord1 = new TrackPoint(-8.957287, -77.777452, null, '2023-07-04T17:22:15Z');
      const coord2 = new TrackPoint(-8.957069, -77.777400, null, '2023-07-04T17:22:35Z');
      const coord3 = new TrackPoint(-8.956936, -77.777381, null, '2023-07-04T17:22:46Z');
      const coord4 = new TrackPoint(-8.956758, -77.777211, null, '2023-07-04T17:23:08Z');
      const coord5 = new TrackPoint(-8.956768, -77.777311, null, '2023-07-04T17:24:08Z');
      const coord6 = new TrackPoint(-8.956778, -77.777411, null, '2023-07-04T17:24:28Z');

      trackPoints = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5,
        coord6
      ];

      featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
      track = Track.fromGeoJson(featureCollection);
    });

    describe('#clone', () => {
      it('should clone the Track', () => {
        const trackClone = track.clone();

        expect(trackClone).not.toBe(track);

        expect(trackClone.trackPoints().length).toEqual(6);
        expect(trackClone.trackSegments().length).toEqual(5);

        expect(trackClone.firstPoint.val.equals(trackPoints[0])).toBeTruthy();
        expect(trackClone.firstSegment.prevVert.val.equals(trackPoints[0])).toBeTruthy();
        expect(trackClone.firstSegment.nextVert.val.equals(trackPoints[1])).toBeTruthy();
        expect(trackClone.lastSegment.prevVert.val.equals(trackPoints[4])).toBeTruthy();
        expect(trackClone.lastSegment.nextVert.val.equals(trackPoints[5])).toBeTruthy();
        expect(trackClone.lastPoint.val.equals(trackPoints[5])).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Track with differing TrackPoints', () => {
        const polyline1 = Track.fromPoints(trackPoints);

        const trackPointsDifferent = [
          new TrackPoint(-8.957287, -77.777452, null, '2023-07-04T17:22:15Z'),
          new TrackPoint(-8.957069, -77.777400, null, '2023-07-04T17:22:35Z'),
          new TrackPoint(-8.956936, -77.777381, null, '2023-07-04T17:22:46Z'),
          new TrackPoint(-8.956758, -77.777211, null, '2023-07-04T17:23:28Z'),  // Only differs by timestamp
          new TrackPoint(-8.956768, -77.777311, null, '2023-07-04T17:24:08Z'),
          new TrackPoint(-8.956778, -77.777411, null, '2023-07-04T17:24:28Z')
        ];
        const polyline2 = Track.fromPoints(trackPointsDifferent);

        const result = polyline1.equals(polyline2);

        expect(result).toBeFalsy();
      });

      it('should return True for Track Polylines with identical TrackPoints', () => {
        const polyline1 = Track.fromPoints(trackPoints);
        const polyline2 = Track.fromPoints(trackPoints);

        const result = polyline1.equals(polyline2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Misc Methods', () => {
    describe('#updateGeoJsonTrack', () => {
      let trackPoints: TrackPoint[];
      let featureCollection: FeatureCollection;
      let track: Track;

      let vertex1: VertexNode<TrackPoint, TrackSegment>;

      beforeEach(() => {
        trackPoints = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];

        featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
        track = Track.fromGeoJson(featureCollection);

        vertex1 = track.vertexNodesByPoint(trackPoints[2])[0];
      });

      it('should NOT update the Track if the modifying method fails to change the track', () => {
        const originalBoundingBox = track.boundingBox().toCornerPositions();
        const originalTrack = track.toJson();

        const nonExistingPoint = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
        const trimmedPoint = track.trimBefore(nonExistingPoint);

        expect(trimmedPoint).toBeNull();

        const currentBoundingBox = track.boundingBox().toCornerPositions();
        expect(currentBoundingBox).toEqual(originalBoundingBox);

        const notUpdatedTrack = track.toJson();
        expect(notUpdatedTrack).toEqual(originalTrack);
      });

      it('should update the Track if the modifying method fails to change the track', () => {
        const originalBoundingBox = track.boundingBox().toCornerPositions();
        const originalTrack = track.toJson();

        const originalVertexHead = track.firstPoint;

        const trimmedPoint = track.trimBefore(vertex1);

        expect(trimmedPoint).toEqual(originalVertexHead);

        const currentBoundingBox = track.boundingBox().toCornerPositions();
        expect(currentBoundingBox).not.toEqual(originalBoundingBox);

        const updatedTrack = track.toJson();
        expect(updatedTrack).not.toEqual(originalTrack);
      });

      it(`should not update the Track when manually called with a 'false' flag
        if originally suppressed for iterations`, () => {
        const originalBoundingBox = track.boundingBox().toCornerPositions();
        const originalTrack = track.toJson();

        const originalVertexHead = track.firstPoint;

        const iterating = true;
        const trimmedPoint = track.trimBefore(vertex1, iterating);

        expect(trimmedPoint).toEqual(originalVertexHead);

        // Should not be updated
        const currentBoundingBox = track.boundingBox().toCornerPositions();
        expect(currentBoundingBox).toEqual(originalBoundingBox);

        const currentTrack = track.toJson();
        expect(currentTrack).toEqual(originalTrack);

        const trackChanged = false;
        track.updateGeoJsonTrack(trackChanged);

        // Should still not be updated
        const notUpdatedBoundingBox = track.boundingBox().toCornerPositions();
        expect(notUpdatedBoundingBox).toEqual(originalBoundingBox);

        const notUpdatedTrack = track.toJson();
        expect(notUpdatedTrack).toEqual(originalTrack);
      });

      it(`should update the Track when manually called with a 'true' flag
        if originally suppressed for iterations`, () => {
        const originalBoundingBox = track.boundingBox().toCornerPositions();
        const originalTrack = track.toJson();

        const originalVertexHead = track.firstPoint;

        const iterating = true;
        const trimmedPoint = track.trimBefore(vertex1, iterating);

        expect(trimmedPoint).toEqual(originalVertexHead);

        // Should not be updated
        const currentBoundingBox = track.boundingBox().toCornerPositions();
        expect(currentBoundingBox).toEqual(originalBoundingBox);

        const currentTrack = track.toJson();
        expect(currentTrack).toEqual(originalTrack);

        const trackChanged = true;
        track.updateGeoJsonTrack(trackChanged);

        // Should be updated
        const updatedBoundingBox = track.boundingBox().toCornerPositions();
        expect(updatedBoundingBox).not.toEqual(originalBoundingBox);

        const updatedTrack = track.toJson();
        expect(updatedTrack).not.toEqual(originalTrack);
      });
    });

    describe('#clear', () => {

    });
  });

  describe('Properties Methods', () => {
    describe('#addProperties', () => {
      let coordinates: TrackPoint[];

      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';
        // speed 2.3 mph
        // heading 48.3
        // avgSpeed = 1.245 m/s = 2.785
        // segment1 length = 24.9 m
        // segment1 duration = 20 sec
        // segment1 speed = 1.245 m/s = 2.78 mph
        // segment1 angle = 1.339 rad = 76.7 deg
        // segment1 direction = N, E

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';
        // speed 2.8 mph
        // heading 13.3
        // avgSpeed = 1.301 m/s = 2.91 mph
        // rotation =
        // angularSpeed = 0.09121 rad/s = 5.23 deg/sec
        // segment2 length = 14.9 m
        // segment2 duration = 11 sec
        // segment2 speed = 1.358 m/s = 3.04 mph
        // segment2 angle = 1.431 rad = 82.0 deg
        // segment2 direction = N, E

        const coord3 = new TrackPoint(-8.956936, -77.777381);
        coord3.timestamp = '2023-07-04T17:22:46Z';
        // speed 3.0 mph
        // heading 8.2
        // avgSpeed = 1.297 m/s = 2.90 mph
        // segment3 length = 27.2 m
        // segment3 duration = 22 sec
        // segment3 speed = 1.237 m/s = 2.77 mph
        // segment3 angle = 0.815 rad = 46.7 deg
        // segment3 direction = N, E

        const coord4 = new TrackPoint(-8.956758, -77.777211);
        coord4.timestamp = '2023-07-04T17:23:08Z';
        // speed 2.8 mph
        // heading 43.3
        // avgSpeed = 1.237 m/3 = 2.77 mph

        coordinates = [
          coord1,
          coord2,
          coord3,
          coord4
        ];
      });

      it('should add derived properties to segments', () => {
        const track = Track.fromPoints(coordinates);

        track.addProperties();

        const segments = track.trackSegments();

        expect(segments[1].length - 14.935).toBeLessThanOrEqual(0.001);
        expect(segments[1].duration - 11).toBeLessThanOrEqual(0.001);
        expect(segments[1].speed - 1.358).toBeLessThanOrEqual(0.001);
        expect(segments[1].angle - 1.431).toBeLessThanOrEqual(0.001);
        expect(segments[1].direction).toEqual({ lat: 'N', lng: 'E' });
      });

      it('should add derived properties to coordinates', () => {
        const track = Track.fromPoints(coordinates);

        track.addProperties();

        const coords = track.trackPoints();

        // Check middle node
        expect(coords[1]._path.speed - 1.301).toBeLessThanOrEqual(0.001);
        expect(coords[1]._path.rotation - 0.092).toBeLessThanOrEqual(0.001);
        expect(coords[1]._path.rotationRate - 0.09121).toBeLessThanOrEqual(0.00001);

        // Check start node
        expect(coords[0]._path.speed - 1.245).toBeLessThanOrEqual(0.001);
        expect(coords[0]._path.rotation).toBeNull();
        expect(coords[0]._path.rotationRate).toBeNull();

        // Check end node
        expect(coords[coords.length - 1]._path.speed - 1.237).toBeLessThanOrEqual(0.001);
        expect(coords[coords.length - 1]._path.rotation).toBeNull();
        expect(coords[coords.length - 1]._path.rotationRate).toBeNull();
      });
    });

    describe('#addElevations', () => {
      it('should do nothing for elevations of non-matching lat/long', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
        ];

        const track = Track.fromPoints(coords);
        track.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 1, lng: 2 }), 1000);
        elevations.set(JSON.stringify({ lat: 3, lng: 4 }), 2000);
        elevations.set(JSON.stringify({ lat: 5, lng: 6 }), 1500);
        elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);
        elevations.set(JSON.stringify({ lat: 9, lng: 10 }), 5000);

        track.addElevations(elevations);

        const trackCoords = track.trackPoints();

        expect(trackCoords.length).toEqual(5);

        expect(trackCoords[0]).not.toHaveProperty('elevation');
        expect(trackCoords[1]).not.toHaveProperty('elevation');
        expect(trackCoords[2]).not.toHaveProperty('elevation');
        expect(trackCoords[3]).not.toHaveProperty('elevation');
        expect(trackCoords[4]).not.toHaveProperty('elevation');
      });

      it('should add elevation properties and derived data for matching lat/long', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'), // Intentional mismatch
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];

        const track = Track.fromPoints(coords);
        track.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 39.74007868370209, lng: -105.0076261841355 }), 1000);
        elevations.set(JSON.stringify({ lat: 39.74005097339472, lng: -104.9998123858178 }), 2000);
        elevations.set(JSON.stringify({ lat: 39.73055300708892, lng: -104.9990802128465 }), 1500);
        elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);                                         // Intentional mismatch
        elevations.set(JSON.stringify({ lat: 39.73991441833991, lng: -104.9917491337653 }), 5000);
        elevations.set(JSON.stringify({ lat: 39.739914418342, lng: -104.99174913377 }), 4000);

        track.addElevations(elevations);

        const trackCoords = track.trackPoints();
        const trackSegs = track.trackSegments();

        expect(trackCoords.length).toEqual(6);
        expect(trackSegs.length).toEqual(5);

        expect(trackCoords[0].elevation).toEqual(1000);
        expect(trackCoords[0].path.ascentRate).toBeCloseTo(50, 1);
        expect(trackCoords[0].path.descentRate).toBeCloseTo(0, 1);

        expect(trackSegs[0].height).toBeCloseTo(1000, 1);
        expect(trackSegs[0].heightRate).toBeCloseTo(50, 1);

        expect(trackCoords[1].elevation).toEqual(2000);
        expect(trackCoords[1].path.ascentRate).toBeCloseTo(50, 1);
        expect(trackCoords[1].path.descentRate).toBeCloseTo(50, 1);

        expect(trackSegs[1].height).toBeCloseTo(-500, 1);
        expect(trackSegs[1].heightRate).toBeCloseTo(-50, 1);

        expect(trackCoords[2].elevation).toEqual(1500);
        expect(trackCoords[2].path.ascentRate).toBeCloseTo(0, 1);
        expect(trackCoords[2].path.descentRate).toBeCloseTo(25, 1);

        expect(trackSegs[2].height).toEqual(0);
        expect(trackSegs[2].heightRate).toEqual(0);

        expect(trackCoords[3]).not.toHaveProperty('elevation');
        expect(trackCoords[3].path.ascentRate).toBeUndefined();
        expect(trackCoords[3].path.descentRate).toBeUndefined();

        expect(trackSegs[3].height).toEqual(0);
        expect(trackSegs[3].heightRate).toEqual(0);

        expect(trackCoords[4].elevation).toEqual(5000);
        expect(trackCoords[4].path.ascentRate).toBeCloseTo(0, 1);
        expect(trackCoords[4].path.descentRate).toBeCloseTo(25, 1);

        expect(trackSegs[4].height).toBeCloseTo(-1000, 1);
        expect(trackSegs[4].heightRate).toBeCloseTo(-50, 1);

        expect(trackCoords[5].elevation).toEqual(4000);
        expect(trackCoords[5].path.ascentRate).toBeCloseTo(0, 1);
        expect(trackCoords[5].path.descentRate).toBeCloseTo(50, 1);
      });
    });

    describe('#addElevationProperties', () => {
      it('should do nothing if nodes do not have elevations', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
        ];

        const track = Track.fromPoints(coords);
        track.addProperties();
        track.addElevationProperties();

        const trackCoords = track.trackPoints();

        expect(trackCoords.length).toEqual(5);

        expect(trackCoords[0]).not.toHaveProperty('elevation');
        expect(trackCoords[1]).not.toHaveProperty('elevation');
        expect(trackCoords[2]).not.toHaveProperty('elevation');
        expect(trackCoords[3]).not.toHaveProperty('elevation');
        expect(trackCoords[4]).not.toHaveProperty('elevation');
      });

      it('should add derived data from elevations already set for TrackPoints', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'), // Intentional mismatch
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];
        coords[0].elevation = 1000;
        coords[1].elevation = 2000;
        coords[2].elevation = 1500;
        coords[4].elevation = 5000;
        coords[5].elevation = 4000;

        const track = Track.fromPoints(coords);
        track.addProperties();

        track.addElevationProperties();

        const trackCoords = track.trackPoints();
        const trackSegs = track.trackSegments();

        expect(trackCoords.length).toEqual(6);
        expect(trackSegs.length).toEqual(5);

        expect(trackCoords[0].elevation).toEqual(1000);
        expect(trackCoords[0].path.ascentRate).toBeCloseTo(50, 1);
        expect(trackCoords[0].path.descentRate).toBeCloseTo(0, 1);

        expect(trackSegs[0].height).toBeCloseTo(1000, 1);
        expect(trackSegs[0].heightRate).toBeCloseTo(50, 1);

        expect(trackCoords[1].elevation).toEqual(2000);
        expect(trackCoords[1].path.ascentRate).toBeCloseTo(50, 1);
        expect(trackCoords[1].path.descentRate).toBeCloseTo(50, 1);

        expect(trackSegs[1].height).toBeCloseTo(-500, 1);
        expect(trackSegs[1].heightRate).toBeCloseTo(-50, 1);

        expect(trackCoords[2].elevation).toEqual(1500);
        expect(trackCoords[2].path.ascentRate).toBeCloseTo(0, 1);
        expect(trackCoords[2].path.descentRate).toBeCloseTo(25, 1);

        expect(trackSegs[2].height).toEqual(0);
        expect(trackSegs[2].heightRate).toEqual(0);

        expect(trackCoords[3]).not.toHaveProperty('elevation');
        expect(trackCoords[3].path.ascentRate).toBeUndefined();
        expect(trackCoords[3].path.descentRate).toBeUndefined();

        expect(trackSegs[3].height).toEqual(0);
        expect(trackSegs[3].heightRate).toEqual(0);

        expect(trackCoords[4].elevation).toEqual(5000);
        expect(trackCoords[4].path.ascentRate).toBeCloseTo(0, 1);
        expect(trackCoords[4].path.descentRate).toBeCloseTo(25, 1);

        expect(trackSegs[4].height).toBeCloseTo(-1000, 1);
        expect(trackSegs[4].heightRate).toBeCloseTo(-50, 1);

        expect(trackCoords[5].elevation).toEqual(4000);
        expect(trackCoords[5].path.ascentRate).toBeCloseTo(0, 1);
        expect(trackCoords[5].path.descentRate).toBeCloseTo(50, 1);
      });
    });

    describe('#addElevationsFromApi', () => {

    });

    describe('#getStats', () => {
      let trackPoints: TrackPoint[];
      let featureCollection: FeatureCollection;
      let track: Track;

      beforeEach(() => {
        const positions = lineStringTrack.features[0].geometry.coords;
        const times = (lineStringTrack.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];

        trackPoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
        featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
        track = Track.fromGeoJson(featureCollection);
      });

      it('should return stats for a Track', () => {
        const result = track.getStats();

        // Spot check of sample stats. Not comprehensive. See TrackStats tests & baser class tests for validation of all properties
        expect(result.size.vertices).toEqual(lineStringTrack.features[0].geometry.coords.length);
        expect(result.length).toBeCloseTo(1222771.65, 2);
        expect(result.height.gain).toBeCloseTo(500, 2);
        expect(result.time.duration).toBeCloseTo(70, 2);
        expect(result.speed.avg).toBeCloseTo(17468.17, 2);
      });
    });

    describe('#getDuration', () => {
      let trackPoints: TrackPoint[];
      let featureCollection: FeatureCollection;
      let track: Track;

      beforeEach(() => {
        const positions = lineStringTrack.features[0].geometry.coords;
        const times = (lineStringTrack.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];

        trackPoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
        featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
        track = Track.fromGeoJson(featureCollection);
      });

      it('should return total duration of a Track', () => {
        const duration = track.getDuration();

        expect(duration).toBeCloseTo(70, 2);
      });
    });
  });

  describe('Accessing Items', () => {
    let trackPoints: TrackPoint[];
    let featureCollection: FeatureCollection;
    let track: Track;

    beforeEach(() => {
      const coord1 = new TrackPoint(-8.957287, -77.777452, null, '2023-07-04T17:22:15Z');
      // speed = 1.245 m/2 = 2.3 mph
      // heading 48.3
      // avgSpeed = 1.245 m/s = 2.785 mph
      // rotation = null
      // angularSpeed = null
      // segment1 length = 24.9 m
      // segment1 duration = 20 sec
      // segment1 speed = 1.245 m/s = 2.78 mph
      // segment1 angle = 1.339 rad = 76.7 deg
      // segment1 direction = N, E
      const coord2 = new TrackPoint(-8.957069, -77.777400, null, '2023-07-04T17:22:35Z');
      // speed 2.8 mph
      // heading 13.3
      // avgSpeed = 1.301 m/s = 2.91 mph
      // rotation = 0.09126 rad
      // angularSpeed = 0.002943 rad/s...   0.09121 rad/s = 5.23 deg/sec
      // segment2 length = 14.9 m
      // segment2 duration = 11 sec
      // segment2 speed = 1.358 m/s = 3.04 mph
      // segment2 angle = 1.431 rad = 82.0 deg
      // segment2 direction = N, E
      const coord3 = new TrackPoint(-8.956936, -77.777381, null, '2023-07-04T17:22:46Z');
      // speed 3.0 mph
      // heading 8.2
      // avgSpeed = 1.297 m/s = 2.90 mph
      // rotation = -0.6161
      // angularSpeed = -0.01867 rad/s... 0.09121 rad/s = 5.23 deg/sec
      // segment3 length = 27.2 m
      // segment3 duration = 22 sec
      // segment3 speed = 1.237 m/s = 2.77 mph
      // segment3 angle = 0.815 rad = 46.7 deg
      // segment3 direction = N, E
      const coord4 = new TrackPoint(-8.956758, -77.777211, null, '2023-07-04T17:23:08Z');
      // speed 2.8 mph
      // heading 43.3
      // avgSpeed = 1.237 m/3 = 2.77 mph
      // rotation = null
      // angularSpeed = null

      trackPoints = [
        coord1,
        coord2,
        coord3,
        coord4
      ];
      featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
      track = Track.fromGeoJson(featureCollection);
    });

    describe('#vertexNodesBy', () => {
      beforeEach(() => {
        track.addProperties();
      });

      it('should return an empty array for no matches', () => {
        const nodes = track.vertexNodesBy(
          5,
          (target: number, coord: VertexNode<TrackPoint, TrackSegment>) => coord.val._path.speed >= target
        );

        expect(nodes.length).toEqual(0);
      });

      it('should return all nodes that match the numerical target', () => {
        const nodes = track.vertexNodesBy(
          1.29,
          (target: number, coord: VertexNode<TrackPoint, TrackSegment>) => coord.val._path.speed >= target
        );

        expect(nodes.length).toEqual(2);
        expect(nodes[0].val.timestamp).toEqual(trackPoints[1].timestamp);
        expect(nodes[1].val.timestamp).toEqual(trackPoints[2].timestamp);
      });

      it('should return all nodes that match all of the Evaluator Args targets', () => {
        const nodes = track.vertexNodesBy(
          {
            speedLimit: 1.29,
            rotationRateLimit: 0.002
          },
          (target: EvaluatorArgs,
            coord: VertexNode<TrackPoint, TrackSegment>) =>
            coord.val._path.speed >= parseInt(target.speedLimit.toString())
            && coord.val._path.rotationRate > parseInt(target.rotationRateLimit.toString())
        );

        expect(nodes.length).toEqual(1);
        expect(nodes[0].val.timestamp).toEqual(trackPoints[1].timestamp);
      });
    });

    describe('#vertexNodesByPoint', () => {
      it('should return an empty array if null is given for the vertex', () => {
        const nodes = track.vertexNodesByPoint(null);

        expect(nodes.length).toEqual(0);
      });

      it('should return an empty array if the given vertex is not found', () => {
        const nonExistingVertex = new TrackPoint(-1, 2);
        const nodes = track.vertexNodesByPoint(nonExistingVertex);

        expect(nodes.length).toEqual(0);
      });

      it('should return the vertex nodes corresponding to vertices matching on values', () => {
        const existingVertex = trackPoints[2];
        const nodes = track.vertexNodesByPoint(existingVertex);

        expect(nodes.length).toEqual(1);
        expect(nodes[0].val.timestamp).toEqual(trackPoints[2].timestamp);
      });
    });

    describe('#vertexNodeByTime', () => {
      it('should return undefined if null is given for the time', () => {
        const nodes = track.vertexNodeByTime(null);

        expect(nodes).toBeUndefined();
      });

      it('should return undefined if an empty string is given for the time', () => {
        const nodes = track.vertexNodeByTime('');

        expect(nodes).toBeUndefined();
      });

      it('should return undefined if the given time is not found', () => {
        const nodes = track.vertexNodeByTime('Foo');

        expect(nodes).toBeUndefined();
      });

      it('should return the vertex node corresponding to the provided time', () => {
        const nodes = track.vertexNodeByTime(trackPoints[2].timestamp);

        expect(nodes.val.timestamp).toEqual(trackPoints[2].timestamp);
      });
    });

    // TODO: Test
    describe('#trackPoints', () => {
      // TODO: optional overload with ITimeRange
      // null, val = before time
      // val, null = after time
      // val, val = between times

    });

    // TODO: Test
    describe('#trackSegments', () => {
      // TODO: optional overload with ITimeRange
      // null, val = before time
      // val, null = after time
      // val, val = between times
    });

    // TODO: Test
    describe('#timestamps', () => {
      // TODO: optional overload with ITimeRange
      // null, val = before time
      // val, null = after time
      // val, val = between times
    });
  });

  describe('Manipulating Track', () => {
    let trackPoints: TrackPoint[];
    let featureCollection: FeatureCollection;
    let track: Track;

    beforeEach(() => {
      const positions = lineStringTrack.features[0].geometry.coords;
      const times = (lineStringTrack.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];

      trackPoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
      featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
      track = Track.fromGeoJson(featureCollection);
    });

    describe('Trim', () => {
      let time1: string;
      let time2: string;

      let point1: TrackPoint;
      let point2: TrackPoint;

      let vertex1: VertexNode<TrackPoint, TrackSegment>;
      let vertex2: VertexNode<TrackPoint, TrackSegment>;

      beforeEach(() => {
        trackPoints = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];
        // Note:
        //  This currently fails vertex1 matching for Polylines generated from FeatureCollections,
        //     because .elevation is converted to .alt
        //  This is due to updating .alt w/ .elevation when converting TrackPoints to geoJSON,
        //    tas here is only the .alt property on Points/Positions there.
        //  As such, elevations should be assigned after the Track has been created.
        // TODO: Determine how to best reconcile this issue.
        //
        // trackPoints[0].elevation = 1000;
        // trackPoints[1].elevation = 2000;
        // trackPoints[2].elevation = 1500;
        // trackPoints[3].elevation = 1600;
        // trackPoints[4].elevation = 5000;
        // trackPoints[5].elevation = 4000;

        featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
        track = Track.fromGeoJson(featureCollection);
        track.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 39.74007868370209, lng: -105.0076261841355 }), 1000);
        elevations.set(JSON.stringify({ lat: 39.74005097339472, lng: -104.9998123858178 }), 2000);
        elevations.set(JSON.stringify({ lat: 39.73055300708892, lng: -104.9990802128465 }), 1500);
        elevations.set(JSON.stringify({ lat: 39.73993779411854, lng: -104.9985377946692 }), 1600);                                         // Intentional mismatch
        elevations.set(JSON.stringify({ lat: 39.73991441833991, lng: -104.9917491337653 }), 5000);
        elevations.set(JSON.stringify({ lat: 39.739914418342, lng: -104.99174913377 }), 4000);
        track.addElevations(elevations);

        track.addElevationProperties();


        point1 = trackPoints[2];
        point2 = trackPoints[3];

        time1 = point1.timestamp;
        time2 = point2.timestamp;

        vertex1 = track.vertexNodesByPoint(point1)[0];
        vertex2 = track.vertexNodesByPoint(point2)[0];
      });

      describe('#trimBefore', () => {
        it('should do nothing and return null on an empty Route', () => {
          track = Track.fromPoints([]);

          const trimmedPoint = track.trimBefore(vertex1);
          expect(trimmedPoint).toBeNull();

          expect(track.trackPoints().length).toEqual(0);
        });

        it('should do nothing and return null when the specified Point does not exist in the Route', () => {
          const nonExistingPoint = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const trimmedPoint = track.trimBefore(nonExistingPoint);

          expect(trimmedPoint).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments before the specified Point & return the head vertex node of the trimmed portion', () => {
          const originalVertexHead = track.firstPoint;

          const trimmedPoint = track.trimBefore(vertex1);

          expect(trimmedPoint).toEqual(originalVertexHead);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the 2nd-order properties of the start Point after trimming`, () => {
          expect(vertex1.val.path.rotation).toBeCloseTo(3.038, 3);

          track.trimBefore(vertex1);

          expect(vertex1.val.path.rotation).toBeNull();
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const originalVertexHead = track.firstPoint;

          const iterating = true;
          const trimmedPoint = track.trimBefore(vertex1, iterating);

          expect(trimmedPoint).toEqual(originalVertexHead);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should trim before the TrackPoint provided', () => {
          const trimmedPoint = track.trimBefore(point1);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim before the TrackPoints corresponding to the timestamp provided', () => {
          const trimmedPoint = track.trimBefore(time1);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#trimAfter', () => {
        it('should do nothing and return null on an empty Route', () => {
          track = Track.fromPoints([]);

          const trimmedPoint = track.trimAfter(vertex2);

          expect(trimmedPoint).toBeNull();
          expect(track.trackPoints().length).toEqual(0);
        });

        it('should do nothing and return null when the specified Point does not exist in the Route', () => {
          const nonExistingPoint = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const trimmedPoint = track.trimAfter(nonExistingPoint);

          expect(trimmedPoint).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should trim off vertices & segments after the specified Point & return the head vertex node of the trimmed portion`, () => {
          const vertexTrimmed = vertex2.next;

          const trimmedPoint = track.trimAfter(vertex2);

          expect(trimmedPoint).toEqual(vertexTrimmed);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the 2nd-order properties of the end Point after trimming`, () => {
          expect(vertex2.val.path.rotation).toBeCloseTo(-1.531, 3);

          track.trimAfter(vertex2);

          expect(vertex2.val.path.rotation).toBeNull();
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const vertexTrimmed = vertex2.next;

          const iterating = true;
          const trimmedPoint = track.trimAfter(vertex2, iterating);

          expect(trimmedPoint).toEqual(vertexTrimmed);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should trim after the TrackPoint provided', () => {
          const trimmedPoint = track.trimAfter(point2);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim after the TrackPoint corresponding to the timestamp provided', () => {
          const trimmedPoint = track.trimAfter(time2);

          const expectedLength = trackPoints.length - trimmedPoint.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#trimTo', () => {
        it('should do nothing and return a null tuple on an empty Route', () => {
          track = Track.fromPoints([]);

          const trimmedPoints = track.trimTo(vertex1, vertex2);

          expect(trimmedPoints).toEqual([null, null]);
          expect(track.trackPoints().length).toEqual(0);
        });

        it('should do nothing and return a null tuple when the specified Point does not exist in the Route', () => {
          const nonExistingPoint1 = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const nonExistingPoint2 = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(3, 4));
          const trimmedPoints = track.trimTo(nonExistingPoint1, nonExistingPoint2);

          expect(trimmedPoints).toEqual([null, null]);

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should trim off vertices & segments before & after the specified start & end Points
              & return the head vertex node of each of the trimmed portions`, () => {
          const trimmed1 = track.firstPoint;
          const trimmed2 = vertex2.next;

          const trimmedPoints = track.trimTo(vertex1, vertex2);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext() - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not specified', () => {
          const trimmed1 = track.firstPoint;

          const trimmedPoints = track.trimTo(vertex1, null);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not found', () => {
          const trimmed1 = track.firstPoint;

          const nonExistingPoint = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const trimmedPoints = track.trimTo(vertex1, nonExistingPoint);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not specified', () => {
          const trimmed2 = vertex2.next;

          const trimmedPoints = track.trimTo(null, vertex2);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not found', () => {
          const trimmed2 = vertex2.next;

          const nonExistingPoint = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

          const trimmedPoints = track.trimTo(nonExistingPoint, vertex2);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const trimmed1 = track.firstPoint;
          const trimmed2 = vertex2.next;

          const iterating = true;
          const trimmedPoints = track.trimTo(vertex1, vertex2, iterating);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext() - trimmedPoints[1].lengthNext();

          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should trim to the TrackPoints provided', () => {
          const trimmedPoints = track.trimTo(point1, point2);

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext() - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim to the TrackPoints corresponding to the timestamps provided', () => {
          const trimmedPoints = track.trimTo(time1, time2);

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext() - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#trimToRange', () => {
        it('should do nothing and return a null tuple when the specified Point does not exist in the Route', () => {
          const timeRange: ITimeRange = {
            startTime: 'Foo',
            endTime: 'Bar'
          }

          const trimmedPoints = track.trimToRange(timeRange);

          expect(trimmedPoints).toEqual([null, null]);

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should trim off vertices & segments before & after the specified start & end Points
              & return the head vertex node of each of the trimmed portions`, () => {
          const trimmed1 = track.firstPoint;
          const trimmed2 = vertex2.next;

          const timeRange: ITimeRange = {
            startTime: point1.timestamp,
            endTime: point2.timestamp
          }
          const trimmedPoints = track.trimToRange(timeRange);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext() - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not found', () => {
          const trimmed1 = track.firstPoint;

          const timeRange: ITimeRange = {
            startTime: point1.timestamp,
            endTime: 'Bar'
          }
          const trimmedPoints = track.trimToRange(timeRange);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not found', () => {
          const trimmed2 = vertex2.next;

          const timeRange: ITimeRange = {
            startTime: 'Foo',
            endTime: point2.timestamp
          }
          const trimmedPoints = track.trimToRange(timeRange);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not specified', () => {
          const trimmed1 = track.firstPoint;

          const timeRange: ITimeRange = {
            startTime: point1.timestamp,
            endTime: null
          }
          const trimmedPoints = track.trimToRange(timeRange);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          const expectedLength = trackPoints.length - trimmedPoints[0].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not specified', () => {
          const trimmed2 = vertex2.next;

          const timeRange: ITimeRange = {
            startTime: null,
            endTime: point2.timestamp
          }
          const trimmedPoints = track.trimToRange(timeRange);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          const expectedLength = trackPoints.length - trimmedPoints[1].lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });
    });

    describe('Remove', () => {
      describe('#removeAt', () => {
        it('should do nothing & return null for an empty track', () => {
          track = Track.fromPoints([]);

          const vertex = new VertexNode<TrackPoint, TrackSegment>(trackPoints[1]);

          const removedVertex = track.removeAt(vertex);

          expect(removedVertex).toBeNull();

          expect(track.trackPoints().length).toEqual(0);
        });

        it('should do nothing & return null for a vertex that does not exist in the track', () => {
          const vertex = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

          const removedVertex = track.removeAt(vertex);

          expect(removedVertex).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should do nothing & return null for a null vertex', () => {
          const removedVertex = track.removeAt(null);

          expect(removedVertex).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove a vertex at the head & return the removed node', () => {
          const removedVertex = track.firstPoint;

          const result = track.removeAt(removedVertex);

          expect(result).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove a vertex at the lastPoint & return the removed node', () => {
          const removedVertex = track.lastPoint;

          const result = track.removeAt(removedVertex);

          expect(result).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the only remaining vertex & return the removed node', () => {
          trackPoints = [
            new TrackPoint(1, -110, 0, 'Foo')
          ];
          featureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(trackPoints);
          track = Track.fromGeoJson(featureCollection);

          const vertex = track.firstPoint;

          const removedVertex = track.removeAt(vertex);

          expect(removedVertex).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);   // Expected 0, received 6
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the specified vertex & one adjacent segment & return the removed node', () => {
          const vertex = track.firstPoint.next.next as VertexNode<TrackPoint, TrackSegment>;

          const removedVertex = track.removeAt(vertex);

          expect(removedVertex).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const vertex = track.firstPoint.next.next as VertexNode<TrackPoint, TrackSegment>;

          const iterating = true;
          const removedVertex = track.removeAt(vertex, iterating);

          expect(removedVertex).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should remove the TrackPoint provided', () => {
          const existingPoint = trackPoints[1];

          const removedVertex = track.removeAt(existingPoint);

          expect(removedVertex).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the TrackPoint corresponding to the timestamp provided', () => {
          const existingTime = trackPoints[1].timestamp;

          const removedVertex = track.removeAt(existingTime);

          expect(removedVertex).toBeTruthy();

          const expectedLength = trackPoints.length - 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#removeAtAny', () => {
        it('should do nothing for vertices provided for an empty track & return an empty array', () => {
          track = Track.fromPoints([]);

          const vertex1 = new VertexNode<TrackPoint, TrackSegment>(trackPoints[1]);
          const vertex2 = new VertexNode<TrackPoint, TrackSegment>(trackPoints[3]);

          const removedVertices = track.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(0);

          expect(track.trackPoints().length).toEqual(0);
        });

        it('should do nothing for vertices provided that are not in the track & return an empty array', () => {
          const vertex1 = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const vertex2 = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(3, 4));

          const removedVertices = track.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(0);

          const expectedLength = trackPoints.length - removedVertices.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the vertices provided & return an array of the nodes removed', () => {
          const vertex1 = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertex2 = track.firstPoint.next.next.next as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(2);

          const expectedLength = trackPoints.length - removedVertices.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the vertices provided, ignoring ones that are not found in the track & return an array of the nodes removed', () => {
          const vertex1 = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertex2 = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

          const removedVertices = track.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(1);

          const expectedLength = trackPoints.length - removedVertices.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const vertex1 = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertex2 = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

          const iterating = true;
          const removedVertices = track.removeAtAny([vertex1, vertex2], iterating);

          expect(removedVertices.length).toEqual(1);

          const expectedLength = trackPoints.length - removedVertices.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should remove the TrackPoints provided', () => {
          const point1 = trackPoints[0];
          const point2 = trackPoints[3];

          const pointsRemoved = track.removeAtAny([point1, point2]);

          const expectedLength = trackPoints.length - pointsRemoved.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the TrackPoints corresponding to the timestamps provided', () => {
          const time1 = trackPoints[0].timestamp;
          const time2 = trackPoints[3].timestamp;

          const pointsRemoved = track.removeAtAny([time1, time2]);

          const expectedLength = trackPoints.length - pointsRemoved.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#removeBetween', () => {
        it('should do nothing & return null for an empty track', () => {
          track = Track.fromPoints([]);

          const vetexStart = new VertexNode<TrackPoint, TrackSegment>(trackPoints[1]);
          const vertexEnd = new VertexNode<TrackPoint, TrackSegment>(trackPoints[2]);

          const removedVertices = track.removeBetween(vetexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          expect(track.trackPoints().length).toEqual(0);
        });

        it(`should do nothing & return null for vertex range requested where neither start nor end are in the track`, () => {
          const vertexStart = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const vertexEnd = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(3, 4));

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should do nothing & return null for vertex range requested where the start & end are the same', () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = vertexStart;

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should do nothing & return null for vertex range requested where the start & end are adjacent', () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = vertexStart.next as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove up to the end vertex if the start vertex is not found', () => {
          const vertexStart = new VertexNode<TrackPoint, TrackSegment>(trackPoints[1]);
          const vertexEnd = track.lastPoint.prev.prev as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove up to the end vertex if the start vertex null', () => {
          const vertexEnd = track.lastPoint.prev.prev as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(null, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove from the start vertex to the end of the track if the end vertex is not found', () => {
          const vertexStart = track.firstPoint.next.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = new VertexNode<TrackPoint, TrackSegment>(trackPoints[2]);

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove from the start vertex to the end of the track if the end vertex is null', () => {
          const vertexStart = track.firstPoint.next.next as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(vertexStart, null);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should remove all vertices & corresponding segments between the start and end vertices provided,
          & return the head of the removed range`, () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint.prev as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should remove all vertices between the start vertex & end of the track
          if the end vertex specified corresponds with the end of the track`, () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove all vertices between the start & end of the track & all but one segment if specified', () => {
          const vertexStart = track.firstPoint as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint.prev as VertexNode<TrackPoint, TrackSegment>;

          const iterating = true;
          const removedVertices = track.removeBetween(vertexStart, vertexEnd, iterating);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should remove all vertices between the TrackPoints provided', () => {
          const startPoint = trackPoints[1];
          const endPoint = trackPoints[4];

          const removedPointsHead = track.removeBetween(startPoint, endPoint);

          const expectedLength = trackPoints.length - removedPointsHead.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove all vertices between the TrackPoints corresponding to the timestamps provided', () => {
          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const removedPointsHead = track.removeBetween(startTime, endTime);

          const expectedLength = trackPoints.length - removedPointsHead.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#removeBetweenRange', () => {
        // TODO: Add/test convenience method?
      });

      describe('#removeFromTo', () => {
        it('should do nothing & return null for an empty track', () => {
          track = Track.fromPoints([]);

          const vetexStart = new VertexNode<TrackPoint, TrackSegment>(trackPoints[1]);
          const vertexEnd = new VertexNode<TrackPoint, TrackSegment>(trackPoints[2]);

          const removedVertices = track.removeFromTo(vetexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          expect(track.trackPoints().length).toEqual(0);
        });

        it('should do nothing & return null for when neither start nor end vertices are in the track', () => {
          const vertexStart = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));
          const vertexEnd = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(3, 4));

          const removedVertices = track.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove a single vertex & return the removed vertex when the start & end vertices are the same', () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = vertexStart;

          const removedVertices = track.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();
          expect(removedVertices.next).toBeNull();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove the entire list & the head of the removed range when start & end are the start/end of the track', () => {
          const vertexStart = track.firstPoint as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint as VertexNode<TrackPoint, TrackSegment>;

          const originalVerticesCount = track.trackPoints().length;

          const removedVertices = track.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices.lengthNext()).toEqual(originalVerticesCount);

          expect(track.trackPoints().length).toEqual(0);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(0);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(0);
        });

        it('should remove up to the end vertex if the start vertex is not found', () => {
          const vertexStart = new VertexNode<TrackPoint, TrackSegment>(trackPoints[1]);
          const vertexEnd = track.lastPoint.prev.prev as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove up to the end vertex if the start vertex null', () => {
          const vertexEnd = track.lastPoint.prev.prev as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeFromTo(null, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove from the start vertex to the end of the track if the end vertex is not found', () => {
          const vertexStart = track.firstPoint.next.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = new VertexNode<TrackPoint, TrackSegment>(trackPoints[2]);

          const removedVertices = track.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove from the start vertex to the end of the track if the end vertex is null', () => {
          const vertexStart = track.firstPoint.next.next as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeFromTo(vertexStart, null);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should remove all vertices and corresponding segments between the start & end vertices provided
          & return the head of the removed range`, () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint.prev as VertexNode<TrackPoint, TrackSegment>;

          const removedVertices = track.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const vertexStart = track.firstPoint.next as VertexNode<TrackPoint, TrackSegment>;
          const vertexEnd = track.lastPoint.prev as VertexNode<TrackPoint, TrackSegment>;

          const iterating = true;
          const removedVertices = track.removeFromTo(vertexStart, vertexEnd, iterating);

          expect(removedVertices).toBeTruthy();

          const expectedLength = trackPoints.length - removedVertices.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });

        it('should remove all vertices between & including the TrackPoints provided', () => {
          const startPoint = trackPoints[1];
          const endPoint = trackPoints[4];

          const removedPointsHead = track.removeFromTo(startPoint, endPoint);

          const expectedLength = trackPoints.length - removedPointsHead.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should remove all vertices between & including TrackPoints corresponding to the timestamps provided', () => {
          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const removedPointsHead = track.removeFromTo(startTime, endTime);

          const expectedLength = trackPoints.length - removedPointsHead.lengthNext();
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });
      });

      describe('#removeFromToRange', () => {
        // TODO: Add/test convenience method?
      });
    });

    describe('Insert', () => {
      describe('#prepend', () => {
        let insertionPoints: TrackPoint[];

        beforeEach(() => {
          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T19:00:00Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T19:00:20Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T19:00:40Z');
          insertionPoints = [point1, point2, point3];
        });

        it(`should insert the Point at the head of the Route & return 1`, () => {
          const point = insertionPoints[0];

          const insertedCount = track.prepend(point);

          expect(insertedCount).toEqual(1);

          const expectedLength = trackPoints.length + 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points at the head of the Route & return 1`, () => {
          const insertedCount = track.prepend(insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should prepend the PolylineTrack provided`, () => {
          const insertedPolyline = new PolylineTrack(insertionPoints);
          const insertedCount = track.prepend(insertedPolyline);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points at the head of the Route & return the number of Points inserted if requested`, () => {
          const returnListCount = true;

          const insertedCount = track.prepend(insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the 2nd-order properties of the Point just after the prepended Points`, () => {
          track.addProperties();

          const startVertexNode = track.firstPoint;
          expect(startVertexNode.val.path.rotation).toBeNull();

          track.prepend(insertionPoints);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(0.6017, 4);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const returnListCount = true;

          const iterating = true;
          const insertedCount = track.prepend(insertionPoints, returnListCount, iterating);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });

      describe('#append', () => {
        let insertionPoints: TrackPoint[];

        beforeEach(() => {
          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:01:30Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:01:40Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:01:50Z');
          insertionPoints = [point1, point2, point3];
        });

        it(`should insert the Point at the tail of track & return 1`, () => {
          const point = insertionPoints[insertionPoints.length - 1];

          const insertedCount = track.append(point);

          expect(insertedCount).toEqual(1);

          const expectedLength = trackPoints.length + 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points at the tail of track & return 1`, () => {
          const insertedCount = track.append(insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should append the PolylineTrack provided`, () => {
          const insertedPolyline = new PolylineTrack(insertionPoints);
          const insertedCount = track.append(insertedPolyline);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points at the tail of track & return the number of Points inserted if requested`, () => {
          const returnListCount = true;

          const insertedCount = track.append(insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the 2nd-order properties of the Point just before the appended Points`, () => {
          track.addProperties();

          const endVertexNode = track.lastPoint;
          expect(endVertexNode.val.path.rotation).toBeNull()

          track.append(insertionPoints);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-3.6741, 4);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const returnListCount = true;

          const iterating = true;
          const insertedCount = track.append(insertionPoints, returnListCount, iterating);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });

      describe('#insertBefore', () => {
        let targetVertex: VertexNode<TrackPoint, TrackSegment>;
        let insertionPoints: TrackPoint[];

        beforeEach(() => {
          targetVertex = track.vertexNodesByPoint(trackPoints[2])[0];

          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:22Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:25Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:27Z');
          insertionPoints = [point1, point2, point3];
        });

        it(`should do nothing & return 0 if the target Point does not exist in the Route`, () => {
          const targetVertex = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(-1, -2, undefined));
          const insertionPoint = insertionPoints[0];

          const insertedCount = track.insertBefore(targetVertex, insertionPoint);

          expect(insertedCount).toEqual(0);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Point before the target Point & return 1`, () => {
          const insertionPoint = insertionPoints[0];

          const insertedCount = track.insertBefore(targetVertex, insertionPoint);

          expect(insertedCount).toEqual(1);

          const expectedLength = trackPoints.length + 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should insert before the target TrackPoints provided', () => {
          const targetPoint = trackPoints[2];
          const returnListCount = true;

          const insertedCount = track.insertBefore(targetPoint, insertionPoints, returnListCount);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should insert before the target TrackPoints corresponding to the timestamps provided', () => {
          const targetTime = trackPoints[2].timestamp;
          const returnListCount = true;

          const insertedCount = track.insertBefore(targetTime, insertionPoints, returnListCount);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points before the target Point & return 1`, () => {
          const insertedCount = track.insertBefore(targetVertex, insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the PolylineTrack before the target Point & return 1`, () => {
          const insertedPolyline = new PolylineTrack(insertionPoints);

          const insertedCount = track.insertBefore(targetVertex, insertedPolyline);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points before the target Point & return the number of Points inserted if requested`, () => {
          const returnListCount = true;

          const insertedCount = track.insertBefore(targetVertex, insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the segment property spanning from the prior Point to the first inserted Point`, () => {
          track.addProperties();

          const insertedPolyline = new PolylineTrack(insertionPoints);

          const startVertexNode = targetVertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          track.insertBefore(targetVertex, insertedPolyline);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(0, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          track.addProperties();

          const insertedPolyline = new PolylineTrack(insertionPoints);

          const startVertexNode = targetVertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const insertStartVertexNode = insertedPolyline.firstVertex;
          const insertEndVertexNode = insertedPolyline.lastVertex;
          const endVertexNode = targetVertex;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);

          track.insertBefore(targetVertex, insertedPolyline);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7912, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-0.4555, 4);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const returnListCount = true;

          const iterating = true;
          const insertedCount = track.insertBefore(targetVertex, insertionPoints, returnListCount, iterating);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });

      describe('#insertAfter', () => {
        let targetVertex: VertexNode<TrackPoint, TrackSegment>;
        let insertionPoints: TrackPoint[];

        beforeEach(() => {
          targetVertex = track.vertexNodesByPoint(trackPoints[2])[0];

          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:32Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:35Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:37Z');
          insertionPoints = [point1, point2, point3];
        });

        it(`should do nothing & return 0 if the target Point does not exist in the Route`, () => {
          const targetVertex = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(-1, -2, undefined));
          const insertionPoint = insertionPoints[0];

          const insertedCount = track.insertAfter(targetVertex, insertionPoint);

          expect(insertedCount).toEqual(0);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Point after the target Point & return 1`, () => {
          const insertionPoint = insertionPoints[0];

          const insertedCount = track.insertAfter(targetVertex, insertionPoint);

          expect(insertedCount).toEqual(1);

          const expectedLength = trackPoints.length + 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should insert after the target TrackPoints provided', () => {
          const targetPoint = trackPoints[2];
          const returnListCount = true;

          const insertedCount = track.insertAfter(targetPoint, insertionPoints, returnListCount);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should insert after the target TrackPoints corresponding to the timestamps provided', () => {
          const targetTime = trackPoints[2].timestamp;
          const returnListCount = true;

          const insertedCount = track.insertAfter(targetTime, insertionPoints, returnListCount);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points after the target Point & return 1`, () => {
          const insertedCount = track.insertAfter(targetVertex, insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the PolylineTrack after the target Point`, () => {
          const insertedPolyline = new PolylineTrack(insertionPoints);

          const insertedCount = track.insertAfter(targetVertex, insertedPolyline);

          expect(insertedCount).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points after the target Point & return the number of Points inserted if requested`, () => {
          const returnListCount = true;

          const insertedCount = track.insertAfter(targetVertex, insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the segment property spanning from the target Point to the first inserted Point`, () => {
          track.addProperties();

          const insertedPolyline = new PolylineTrack(insertionPoints);

          const startVertexNode = targetVertex as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(2.3557, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(70, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(78581.3, 1);

          track.insertAfter(targetVertex, insertedPolyline);

          expect(prevSegmentNode.val.angle).toBeCloseTo(-2.5304, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'S',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(-150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(271367.0, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          track.addProperties();

          const insertedPolyline = new PolylineTrack(insertionPoints);

          const startVertexNode = targetVertex as VertexNode<TrackPoint, TrackSegment>;
          const insertStartVertexNode = insertedPolyline.firstVertex;
          const insertEndVertexNode = insertedPolyline.lastVertex;
          const endVertexNode = targetVertex.next;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          track.insertAfter(targetVertex, insertedPolyline);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(-3.1915, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(2.7279, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7196, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-2.3342, 4);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const returnListCount = true;

          const iterating = true;
          const insertedCount = track.insertAfter(targetVertex, insertionPoints, returnListCount, iterating);

          expect(insertedCount).toEqual(3);

          const expectedLength = trackPoints.length + insertedCount;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });
    });

    describe('Replace', () => {
      let targetVertex: VertexNode<TrackPoint, TrackSegment>;
      let replacementPoints: TrackPoint[];

      beforeEach(() => {
        targetVertex = track.vertexNodesByPoint(trackPoints[2])[0];

        const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:25Z');
        const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:30Z');
        const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:35Z');
        replacementPoints = [point1, point2, point3];
      });

      it('should do nothing & return null if Route is empty', () => {
        track = Track.fromPoints([]);

        const replacedResult = track.replaceAt(targetVertex, replacementPoints);

        expect(replacedResult).toBeNull();
        expect(track.trackPoints().length).toEqual(0);
      });

      describe('#replaceAt', () => {
        it('should do nothing & return null if the target Point is not specified', () => {
          const targetVertex = null;

          const replacedResult = track.replaceAt(targetVertex, replacementPoints);

          expect(replacedResult).toBeNull();

          const expectedLength = trackPoints.length;
          expect(track.trackPoints().length).toEqual(expectedLength);
        });

        it('should do nothing & return null if the target Point does not exist in the Route', () => {
          const initialLength = track.trackPoints().length;

          const targetVertex = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(-1, -2, undefined));

          const replacedResult = track.replaceAt(targetVertex, replacementPoints);

          expect(replacedResult).toBeNull();
          expect(track.trackPoints().length).toEqual(initialLength);
        });

        it(`should replace the target Point with the provided Point
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are the same`, () => {
          const point = replacementPoints[0];

          const replacedResult = track.replaceAt(targetVertex, point);

          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 1 + 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should replace the target Point in the Route with the provided Points
         & return the head of the removed range & a truthy number of Points inserted`, () => {
          const replacedResult = track.replaceAt(targetVertex, replacementPoints);

          // 1 removed, 3 inserted
          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 1 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should replace the TrackPoint target provided', () => {
          const targetPoint = trackPoints[2];
          const returnListCount = true;

          const replacedResult = track.replaceAt(targetPoint, replacementPoints, returnListCount);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should replace the TrackPoint target corresponding to the timestamps provided', () => {
          const targetTime = trackPoints[2].timestamp;
          const returnListCount = true;

          const replacedResult = track.replaceAt(targetTime, replacementPoints, returnListCount);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should replace the target Point with the provided PolylineTrack`, () => {
          const insertedPolyline = new PolylineTrack(replacementPoints);

          const replacedResult = track.replaceAt(targetVertex, insertedPolyline);

          // 1 removed, 3 inserted
          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 1 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the segment property spanning from the prior Point to the first inserted Point`, () => {
          track.addProperties();

          const insertedPolyline = new PolylineTrack(replacementPoints);

          const startVertexNode = targetVertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          track.replaceAt(targetVertex, insertedPolyline);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(0, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the remaining Points just before & just after the inserted Points`, () => {
          track.addProperties();

          const insertedPolyline = new PolylineTrack(replacementPoints);

          const startVertexNode = targetVertex.prev;
          const insertStartVertexNode = insertedPolyline.firstVertex;
          const insertEndVertexNode = insertedPolyline.lastVertex;
          const endVertexNode = targetVertex.next;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          track.replaceAt(targetVertex, insertedPolyline);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7196, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-2.3342, 4);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const point = replacementPoints[0];
          const returnListCount = true;

          const iterating = true;
          const replacedResult = track.replaceAt(targetVertex, point, returnListCount, iterating);

          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 1 + 1;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });

      describe('#replaceBetween', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = track.trackPoints().length;

          const startVertex = null;
          const endVertex = null;

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints);

          expect(replacedResult).toBeNull();
          expect(track.trackPoints().length).toEqual(initialLength);
        });

        it('should do nothing & return null if the start/end Points are the same', () => {
          const initialLength = track.trackPoints().length;

          const startVertex = track.vertexNodesByPoint(trackPoints[2])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[2])[0];

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints);

          expect(replacedResult).toBeNull();
          expect(track.trackPoints().length).toEqual(initialLength);
        });

        it(`should only remove Points in the start/end range & return the head of the removed range
          if no Points are provided to insert`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[0])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[3])[0];

          const replacedResult = track.replaceBetween(startVertex, endVertex, []);

          expect(replacedResult.removed.lengthNext()).toEqual(2);
          expect(replacedResult.inserted).toEqual(0);

          const expectedLength = trackPoints.length - 2;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points at the start of the Route & return a truthy number of Points inserted
          if only an end Point is provided and the end Point is at the start of the Route, `, () => {
          const startVertex = null;
          const endVertex = track.vertexNodesByPoint(trackPoints[0])[0];

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints);

          expect(replacedResult.removed).toBeNull();
          expect(replacedResult.inserted).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points at the end of the Route and return a truthy number of Points inserted
          if only a start Point is provided and the start Point is at the end of the Route`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[trackPoints.length - 1])[0];
          const endVertex = null;

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints);

          expect(replacedResult.removed).toBeNull();
          expect(replacedResult.inserted).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points between the specified start/end Points in the Route
          & return a truthy number of replacementPoints inserted when the start/end Points are adjacent`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[2])[0];

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints);

          expect(replacedResult.removed).toBeNull();
          expect(replacedResult.inserted).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the Points between the specified start/end Points in the Route,
          remove the original set of Points between these same two Points,
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are not adjacent`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints);

          // 3 inserted, 2 removed
          expect(replacedResult.removed.lengthNext()).toEqual(2);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 2 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should insert the Points between the TrackPoint targets provided', () => {
          const startPoint = trackPoints[1];
          const endPoint = trackPoints[4];
          const returnListCount = true;

          const replacedResult = track.replaceBetween(startPoint, endPoint, replacementPoints, returnListCount);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should insert the Points between the TrackPoint targets corresponding to the timestamps provided', () => {
          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;
          const returnListCount = true;

          const replacedResult = track.replaceBetween(startTime, endTime, replacementPoints, returnListCount);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`replace the Points between the start/end Points with the provided PolylineTrack`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const insertedPolyline = new PolylineTrack(replacementPoints);

          const replacedResult = track.replaceBetween(startVertex, endVertex, insertedPolyline);

          // 3 inserted, 2 removed
          expect(replacedResult.removed.lengthNext()).toEqual(2);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 2 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const returnListCount = true;

          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints, returnListCount);

          // 3 inserted, 2 removed
          expect(replacedResult.removed.lengthNext()).toEqual(2);
          expect(replacedResult.inserted).toEqual(3);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should update the segment property spanning from the target Point to the first inserted Point`, () => {
          track.addProperties();

          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const insertedPolyline = new PolylineTrack(replacementPoints);

          const prevSegmentNode = startVertex.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          track.replaceBetween(startVertex, endVertex, insertedPolyline);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(0, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          track.addProperties();

          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const insertedPolyline = new PolylineTrack(replacementPoints);

          const insertStartVertexNode = insertedPolyline.firstVertex;
          const insertEndVertexNode = insertedPolyline.lastVertex;

          expect(startVertex.val.path.rotation).toBeCloseTo(3.0173, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertex.val.path.rotation).toBeCloseTo(0.9684, 4);

          track.replaceBetween(startVertex, endVertex, insertedPolyline);

          expect(startVertex.val.path.rotation).toBeCloseTo(3.0549, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.2935, 4);
          expect(endVertex.val.path.rotation).toBeCloseTo(-0.9397, 4);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const returnListCount = true;

          const iterating = true;
          const replacedResult = track.replaceBetween(startVertex, endVertex, replacementPoints, returnListCount, iterating);

          // 3 inserted, 2 removed
          expect(replacedResult.removed.lengthNext()).toEqual(2);
          expect(replacedResult.inserted).toEqual(3);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });

      describe('#replaceFromTo', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = track.trackPoints().length;

          const startVertex = null;
          const endVertex = null;

          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints);

          expect(replacedResult).toBeNull();
          expect(track.trackPoints().length).toEqual(initialLength);
        });

        it(`should only remove Points in the start/end range & return the head of the removed range
          if no Points are provided to insert`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[0])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[3])[0];

          const replacedResult = track.replaceFromTo(startVertex, endVertex, []);

          expect(replacedResult.removed.lengthNext()).toEqual(4);
          expect(replacedResult.inserted).toEqual(0);

          const expectedLength = trackPoints.length - 4;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should replace the first Point in the Route & return a truthy number of Points inserted
          if only an end Point is provided and the end Point is at the start of the Route`, () => {
          const startVertex = null;
          const endVertex = track.vertexNodesByPoint(trackPoints[0])[0];

          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints);

          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length - 1 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should replace the last Point in the route & return a truthy number of Points inserted
          if only a start Point is provided & the starty Node is at the end of the Route`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[trackPoints.length - 1])[0];
          const endVertex = null;

          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints);

          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy(); // 3 inserted

          const expectedLength = trackPoints.length - 1 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the provided Points at the specified start/end Point in the Route,
        remove the Point & return the head of the removed range & a truthy number of Points inserted
        when the start/end Points are the same`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[2])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[2])[0];

          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints);

          // 3 inserted, 1 removed
          expect(replacedResult.removed.lengthNext()).toEqual(1);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 1 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should insert the provided Points between the specified start/end Points in the Route,
          remove the original set of Points between & including these same two Points,
          & return the head of the removed range & a truthy number of Points inserted
          when the head/tail Points are adjacent`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[2])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[3])[0];

          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints);

          // 3 inserted, 2 removed
          expect(replacedResult.removed.lengthNext()).toEqual(2);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 2 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should replace Points between & including the TrackPoint targets provided', () => {
          const startPoint = trackPoints[1];
          const endPoint = trackPoints[4];
          const returnListCount = true;

          const replacedResult = track.replaceFromTo(startPoint, endPoint, replacementPoints, returnListCount);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should replace Points between & including the TrackPoint targets corresponding to the timestamps provided', () => {
          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;
          const returnListCount = true;

          const replacedResult = track.replaceFromTo(startTime, endTime, replacementPoints, returnListCount);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`replace the Points between & including the start/end Points with the provided PolylineTrack`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const insertedPolyline = new PolylineTrack(replacementPoints);

          const replacedResult = track.replaceFromTo(startVertex, endVertex, insertedPolyline);

          // 3 inserted, 4 removed
          expect(replacedResult.removed.lengthNext()).toEqual(4);
          expect(replacedResult.inserted).toBeTruthy();

          const expectedLength = trackPoints.length - 4 + 3;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const returnListCount = true;

          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints, returnListCount);

          // 3 inserted, 4 removed
          expect(replacedResult.removed.lengthNext()).toEqual(4);
          expect(replacedResult.inserted).toEqual(3);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);
        });

        it('should only update the polyline and NOT the GeoJSON object when an iterating flag is passed', () => {
          const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
          const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

          const returnListCount = true;

          const iterating = true;
          const replacedResult = track.replaceFromTo(startVertex, endVertex, replacementPoints, returnListCount, iterating);

          // 3 inserted, 4 removed
          expect(replacedResult.removed.lengthNext()).toEqual(4);
          expect(replacedResult.inserted).toEqual(3);

          const expectedLength = trackPoints.length - replacedResult.removed.lengthNext() + replacedResult.inserted;
          expect(track.trackPoints().length).toEqual(expectedLength);
          expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(trackPoints.length);
          expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(trackPoints.length);
        });
      });
    });

    describe('Insert/Replace Track', () => {
      describe('Insert/Join', () => {
        describe('#prependTrack', () => {
          let insertionPoints: TrackPoint[];

          beforeEach(() => {
            const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T19:00:00Z');
            const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T19:00:20Z');
            const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T19:00:40Z');
            insertionPoints = [point1, point2, point3];
          });

          it(`should prepend the provided Track provided & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(insertionPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const insertedCount = track.prependTrack(insertedTrack);

            expect(insertedCount).toBeTruthy(); // 3 inserted

            const expectedLength = trackPoints.length + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(insertionPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(insertionPoints.length);
          });
        });

        describe('#appendTrack', () => {
          let insertionPoints: TrackPoint[];

          beforeEach(() => {
            const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:01:30Z');
            const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:01:40Z');
            const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:01:50Z');
            insertionPoints = [point1, point2, point3];
          });

          it(`should append the provided Track & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(insertionPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const insertedCount = track.appendTrack(insertedTrack);

            expect(insertedCount).toBeTruthy(); // 3 inserted

            const expectedLength = trackPoints.length + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(insertionPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(insertionPoints.length);
          });
        });

        describe('#insertTrackBefore', () => {
          let targetVertex: VertexNode<TrackPoint, TrackSegment>;
          let insertionPoints: TrackPoint[];

          beforeEach(() => {
            targetVertex = track.vertexNodesByPoint(trackPoints[2])[0];

            const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:22Z');
            const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:25Z');
            const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:27Z');
            insertionPoints = [point1, point2, point3];
          });

          it(`should insert the provided Track before the target Point & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(insertionPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const insertedCount = track.insertTrackBefore(targetVertex, insertedTrack);

            expect(insertedCount).toBeTruthy(); // 3 inserted

            const expectedLength = trackPoints.length + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(insertionPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(insertionPoints.length);
          });
        });

        describe('#insertTrackAfter', () => {
          let targetVertex: VertexNode<TrackPoint, TrackSegment>;
          let insertionPoints: TrackPoint[];

          beforeEach(() => {
            targetVertex = track.vertexNodesByPoint(trackPoints[2])[0];

            const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:32Z');
            const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:35Z');
            const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:37Z');
            insertionPoints = [point1, point2, point3];
          });

          it(`should insert the provided Track after the target Point & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(insertionPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const insertedCount = track.insertTrackAfter(targetVertex, insertedTrack);

            expect(insertedCount).toBeTruthy(); // 3 inserted

            const expectedLength = trackPoints.length + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(insertionPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(insertionPoints.length);
          });
        });
      });

      describe('Replace', () => {
        let targetVertex: VertexNode<TrackPoint, TrackSegment>;
        let replacementPoints: TrackPoint[];

        beforeEach(() => {
          targetVertex = track.vertexNodesByPoint(trackPoints[2])[0];

          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:25Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:30Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:35Z');
          replacementPoints = [point1, point2, point3];
        });

        describe('#replaceWithTrackAt', () => {
          it(`should replace the target Point with the provided Track
              & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(replacementPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const replacedResult = track.replaceWithTrackAt(targetVertex, insertedTrack);

            // 1 removed, 3 inserted
            expect(replacedResult.removed.lengthNext()).toEqual(1);
            expect(replacedResult.inserted).toBeTruthy();

            const expectedLength = trackPoints.length - 1 + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(replacementPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(replacementPoints.length);
          });
        });

        describe('#replaceWithTrackBetween', () => {
          it(`replace the Points between the start/end Points with the provided Track
              & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(replacementPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
            const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

            const replacedResult = track.replaceWithTrackBetween(startVertex, endVertex, insertedTrack);

            // 3 inserted, 2 removed
            expect(replacedResult.removed.lengthNext()).toEqual(2);
            expect(replacedResult.inserted).toBeTruthy();

            const expectedLength = trackPoints.length - 2 + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(replacementPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(replacementPoints.length);
          });
        });

        describe('#replaceWithTrackFromTo', () => {
          it(`replace the Points between & including the start/end Points with the provided Track
              & then clear it, leaving any GeoJSON object unaffected`, () => {
            const insertedFeatureCollection = GeoJsonManager.FeatureCollectionFromTrackPoints(replacementPoints);
            const insertedTrack = Track.fromGeoJson(insertedFeatureCollection);

            const startVertex = track.vertexNodesByPoint(trackPoints[1])[0];
            const endVertex = track.vertexNodesByPoint(trackPoints[4])[0];

            const replacedResult = track.replaceWithTrackFromTo(startVertex, endVertex, insertedTrack);

            // 3 inserted, 4 removed
            expect(replacedResult.removed.lengthNext()).toEqual(4);
            expect(replacedResult.inserted).toBeTruthy();

            const expectedLength = trackPoints.length - 4 + 3;

            // Host Track
            expect(track.trackPoints().length).toEqual(expectedLength);
            expect((featureCollection.features[0].geometry as LineString).points.length).toEqual(expectedLength);
            expect(featureCollection.features[0].properties.coordinateProperties.times.length).toEqual(expectedLength);

            // Merged Track
            expect(insertedTrack.trackPoints().length).toEqual(0);

            expect((insertedFeatureCollection.features[0].geometry as LineString).points.length).toEqual(replacementPoints.length);
            expect(insertedFeatureCollection.features[0].properties.coordinateProperties.times.length).toEqual(replacementPoints.length);
          });
        });
      });
    });

    describe('Split', () => {
      let initialSize: number;
      beforeEach(() => {
        initialSize = track.trackPoints().length;
      });

      it('should do nothing and return an empty array if the Route is empty', () => {
        track = Track.fromPoints([]);

        const targetPoint = trackPoints[3];

        const splitTracks = track.splitBy(targetPoint);

        expect(splitTracks.length).toEqual(1);
        expect(splitTracks[0].trackPoints().length).toEqual(0);
      });

      describe('#splitBy', () => {
        it(`should do nothing & return the original Route if the specified Point doesn't exist in the Route`, () => {
          const targetPoint = new TrackPoint(-1, -2, undefined);

          const splitTracks = track.splitBy(targetPoint);

          expect(splitTracks.length).toEqual(1);
          expect(splitTracks[0].trackPoints().length).toEqual(initialSize);
        });

        it(`should do nothing & return the original Route if the specified Point is the start of the Route`, () => {
          const targetPoint = trackPoints[0];

          const splitTracks = track.splitBy(targetPoint);

          expect(splitTracks.length).toEqual(1);
          expect(splitTracks[0].trackPoints().length).toEqual(initialSize);
        });

        it(`should do nothing & return the original Route if the specified Point is the end of the Route`, () => {
          const targetPoint = trackPoints[trackPoints.length - 1];

          const splitTracks = track.splitBy(targetPoint);

          expect(splitTracks.length).toEqual(1);
          expect(splitTracks[0].trackPoints().length).toEqual(initialSize);
        });

        it('should split the Track and return each split Route', () => {
          const targetPoint = trackPoints[3];

          const splitTracks = track.splitBy(targetPoint);

          expect(splitTracks.length).toEqual(2);

          expect(splitTracks[0].trackPoints().length).toEqual(initialSize - 2);
          expect(splitTracks[1].trackPoints().length).toEqual(initialSize - 3);
        });

        it(`should update the 2nd-order properties of the last Point of the first split Route, and the first Point of the second split Route`, () => {
          track.addProperties();
          const targetPoint = trackPoints[3];

          const vertex = track.vertexNodesByPoint(trackPoints[3])[0];
          expect(vertex.val.path.rotation).toBeCloseTo(-1.9503, 4);

          const splitTracks = track.splitBy(targetPoint);

          expect(splitTracks[0].lastPoint.val.path.rotation).toBeNull();
          expect(splitTracks[1].firstPoint.val.path.rotation).toBeNull();
        });
      });

      describe('#splitByMany', () => {
        it(`should do nothing & return one entry of the original Route if the specified Points don't exist in the Route`, () => {
          const targetPoint1 = new TrackPoint(-1, -2, undefined);
          const targetPoint2 = new TrackPoint(-2, -3, undefined);
          const targetPoint3 = new TrackPoint(-3, -4, undefined);
          const targetPoints = [targetPoint1, targetPoint2, targetPoint3];

          const splitTracks = track.splitByMany(targetPoints);

          expect(splitTracks.length).toEqual(1);
          expect(splitTracks[0].trackPoints().length).toEqual(initialSize);
        });

        it('should split the Route and return all sub-Routes demarcated by the provided Points', () => {
          const targetPoint1 = trackPoints[2];
          const targetPoint2 = trackPoints[3];
          const targetPoints = [targetPoint1, targetPoint2];

          const splitTracks = track.splitByMany(targetPoints);

          expect(splitTracks.length).toEqual(3);

          expect(splitTracks[0].trackPoints().length).toEqual(3);
          expect(splitTracks[1].trackPoints().length).toEqual(2);
          expect(splitTracks[2].trackPoints().length).toEqual(3);
        });

        it('should split the Route and return all sub-Routes demarcated by the provided Points, ignoring invalid Points', () => {
          const targetPoint1 = trackPoints[2];
          const targetPoint2 = new TrackPoint(-2, -3, undefined);
          const targetPoint3 = trackPoints[4];
          const targetPoints = [targetPoint1, targetPoint2, targetPoint3];

          const splitTracks = track.splitByMany(targetPoints);

          expect(splitTracks.length).toEqual(3);

          expect(splitTracks[0].trackPoints().length).toEqual(3);
          expect(splitTracks[1].trackPoints().length).toEqual(3);
          expect(splitTracks[2].trackPoints().length).toEqual(2);
        });

        it('should not split the Route more than once by duplicate Points', () => {
          const targetPoint1 = trackPoints[3];
          const targetPoint2 = trackPoints[3];
          const targetPoints = [targetPoint1, targetPoint2];

          const splitTracks = track.splitByMany(targetPoints);

          expect(splitTracks.length).toEqual(2);

          expect(splitTracks[0].trackPoints().length).toEqual(4);
          expect(splitTracks[1].trackPoints().length).toEqual(3);
        });

        it(`should update the 2nd-order properties of the first and last Point of the middle split Route`, () => {
          track.addProperties();
          const targetPoint1 = trackPoints[2];
          const targetPoint2 = trackPoints[4];
          const targetPoints = [targetPoint1, targetPoint2];

          const vertex1 = track.vertexNodesByPoint(targetPoint1)[0];
          const vertex2 = track.vertexNodesByPoint(targetPoint2)[0];

          expect(vertex1.val.path.rotation).toBeCloseTo(1.6946, 4);
          expect(vertex2.val.path.rotation).toBeCloseTo(0.9684, 4);

          const splitTracks = track.splitByMany(targetPoints);

          expect(splitTracks.length).toEqual(3);

          expect(splitTracks[0].firstPoint.val.path.rotation).toBeNull();
          expect(splitTracks[0].lastPoint.val.path.rotation).toBeNull();

          expect(splitTracks[1].firstPoint.val.path.rotation).toBeNull();
          expect(splitTracks[1].lastPoint.val.path.rotation).toBeNull();

          expect(splitTracks[2].firstPoint.val.path.rotation).toBeNull();
          expect(splitTracks[2].lastPoint.val.path.rotation).toBeNull();
        });
      });
    });

    describe('Time Range Convenience Methods', () => {
      // TODO: Add/test convenience methods?
    });
  });

  // describe('Smooth Methods', () => {
  //   describe('#smoothBySpeed', () => {
  //     it('should do nothing to a track that has no speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 1.55 m/s = 3.47 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:31Z';
  //       // Speed (average): 1.393 m/s = 3.12 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:03Z';
  //       // Speed (average): 1.258 m/s = 2.81 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:43Z';
  //       // Speed (average): 1.283 m/s = 2.87 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(0);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove the first coordinate from a track when it has speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 3.575 m/s = 8.0 mph
  //       // Segment speed: 3.575 m/s = 8.0 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:18Z';
  //       // Speed (average): 2.069 m/s = 4.6 mph
  //       // Segment speed: 0.564 m/s = 1.3 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:28Z';
  //       // Speed (average): 1.137 m/s = 2.5 mph
  //       // Segment speed: 1.71 m/s = 3.8 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:58Z';
  //       // Speed (average): 1.710 m/s = 3.8 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(3);
  //     });

  //     it('should remove the last coordinate from a track when it has speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 1.083 m/s = 2.4 mph
  //       // Segment speed:  m/s =  mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:41Z';
  //       // Speed (average): 0.870 m/s = 1.9 mph
  //       // Segment speed:  m/s =  mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:41Z';
  //       // Speed (average): 2.89 m/s = 6.46 mph
  //       // Segment speed:  m/s =  mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:51Z';
  //       // Speed (average): 5.13 m/s = 11.5 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 3.129; // 7 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(3);
  //     });

  //     it('should remove coordinates from a track that have speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:49:58Z';
  //       // Speed (average): 1.787 m/s = 4.0 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:18Z';
  //       // Speed (average): 3.086 m/s = 6.9 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:50:27Z';
  //       // Speed (average): 2.474 m/s = 5.5 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:58Z';
  //       // Speed (average): 0.563 m/s = 1.26 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(2);
  //       expect(track.points().length).toEqual(2);
  //     });
  //   });

  //   describe('#smoothByAngularSpeed', () => {
  //     it('should remove coordinates from a track that have clockwise angular speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
  //       coord1.timeStamp = '2023-07-04T20:00:00Z';

  //       const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
  //       coord2.timeStamp = '2023-07-04T20:07:20Z';

  //       const coord3 = new TrackPoint(39.75260590879227, -104.9990802128465);
  //       coord3.timeStamp = '2023-07-04T20:07:30Z';

  //       const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
  //       coord4.timeStamp = '2023-07-04T20:07:40Z';

  //       const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
  //       coord5.timeStamp = '2023-07-04T20:15:00Z';

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4,
  //         coord5
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       const speedLimitRadpS = 0.1;
  //       const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove coordinates from a track that have counter-clockwise angular speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
  //       coord1.timeStamp = '2023-07-04T20:00:00Z';

  //       const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
  //       coord2.timeStamp = '2023-07-04T20:07:20Z';

  //       const coord3 = new TrackPoint(39.73055300708892, -104.9990802128465);
  //       coord3.timeStamp = '2023-07-04T20:07:30Z';

  //       const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
  //       coord4.timeStamp = '2023-07-04T20:07:40Z';

  //       const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
  //       coord5.timeStamp = '2023-07-04T20:15:00Z';

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4,
  //         coord5
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       const speedLimitRadpS = 0.1;
  //       const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });
  //   });

  //   describe('#smoothStationary', () => {
  //     it('should remove coordinates from a track that have a speeds below the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T23:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T26:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T26:14:00Z')
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;
  //       const removedCoords = track.smoothStationary(minSpeedMS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should ??? coordinates from a track that do not have speed data', () => {
  //       // TODO: What should this behavior be or should it even be considered?
  //       //  A track with no speed data may just need it calculated or has no time stamps, in which case 'stationary' is not a valid criteria.
  //       //  A valid case would be a track with speeds where some points cannot have speed calculated (perhaps due to an error?).
  //       //    This seems unlikely to happen or would break things down earlier.
  //       //    More likely, removing points is unintended/out of order of operations.
  //       // This concern seems valid/solutions applicable in related cases, such as elevation change rates.
  //     });
  //   });

  //   describe('#smoothNoiseCloud', () => {
  //     it('should do nothing to a path with no noise clouds', () => {
  //       // Points are stationary by timestamps, but fall outside of the radius to be 'stationary' in a location based on min timestamp intervals
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(0);
  //       expect(smoothResults.clouds).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should remove coordinates in a noise cloud at the beginning of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         // Begin noise cloud
  //         new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:00:10Z'),
  //         new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:50Z'),
  //         // End noise cloud
  //         new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:01:10Z'),
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary, results in 3.35 meters or less between points
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(6);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed resume)

  //       // Presumed resume node
  //       expect(resultCoords[0].lat).toEqual(39.87825420255762);
  //       expect(resultCoords[0].lng).toEqual(-105.13560669104396);
  //       expect(resultCoords[0].timeStamp).toEqual('2023-07-04T20:00:50Z');
  //     });

  //     it('should remove coordinates in a noise cloud at the end of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:00:10Z'),
  //         // Begin noise cloud
  //         new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:01:10Z'),
  //         // End noise cloud
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(6);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed pause)

  //       // Presumed pause node
  //       expect(resultCoords[2].lat).toEqual(39.87825420255762);
  //       expect(resultCoords[2].lng).toEqual(-105.13560669104396);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');
  //     });

  //     it('should remove nodes in a noise cloud in the middle of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87823888190675, -105.1357900558201, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87822589268432, -105.1357027717129, 0, '2023-07-04T20:00:10Z'),
  //         // Begin noise cloud
  //         new TrackPoint(39.87821721769159, -105.1356040418078, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87823050857553, -105.1355974665931, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.878236962082, -105.1356171532047, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87822657116678, -105.1356188651574, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87821596033782, -105.1355800846031, 0, '2023-07-04T20:01:00Z'),
  //         // End noise cloud
  //         new TrackPoint(39.87822512731312, -105.1355053510283, 0, '2023-07-04T20:01:10Z'),
  //         new TrackPoint(39.87821988064638, -105.1353883040605, 0, '2023-07-04T20:01:20Z'),
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(5);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(6);   // 4 original nodes + 2 avg nodes (1 presumed pause, 1 presumed resume)

  //       // Pause & resume nodes
  //       expect(resultCoords[2].lat).toEqual(39.87822544397074);
  //       expect(resultCoords[2].lng).toEqual(-105.13560352227323);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');

  //       expect(resultCoords[3].lat).toEqual(resultCoords[2].lat);
  //       expect(resultCoords[3].lng).toEqual(resultCoords[2].lng);
  //       expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:00Z');
  //     });

  //     it(`should remove nodes in multiple overlapping noise clouds in the middle of the path,
  //       leaving an average pause/resume node in place`, () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87825432484495, -105.1353814910402, 0, '2023-07-04T20:00:00Z'),
  //         // Begin noise cloud #1
  //         new TrackPoint(39.87824052403623, -105.1352618135007, 0, '2023-07-04T20:00:10Z'),
  //         new TrackPoint(39.8782522989425, -105.1352433936513, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87825750947018, -105.1352618278019, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87824948371056, -105.1352684908337, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87823201248165, -105.135242862249, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87823014730432, -105.1352631715043, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.87824285433322, -105.135233590465, 0, '2023-07-04T20:01:10Z'),
  //         // End noise cloud #1
  //         // Begin noise cloud #2
  //         new TrackPoint(39.87823856216351, -105.1351918088743, 0, '2023-07-04T20:01:20Z'),
  //         new TrackPoint(39.87824751183506, -105.1351733485622, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.87825320422211, -105.1351936504459, 0, '2023-07-04T20:01:40Z'),
  //         new TrackPoint(39.87823291651964, -105.1352084650403, 0, '2023-07-04T20:01:50Z'),
  //         new TrackPoint(39.87821729634359, -105.1351968777954, 0, '2023-07-04T20:02:00Z'),
  //         new TrackPoint(39.87825197840353, -105.1351988205849, 0, '2023-07-04T20:02:10Z'),
  //         new TrackPoint(39.87823106932006, -105.1351756495897, 0, '2023-07-04T20:02:20Z'),
  //         // End noise cloud #2
  //         new TrackPoint(39.87823847144207, -105.1351062708185, 0, '2023-07-04T20:02:30Z'),
  //         new TrackPoint(39.87823789587544, -105.1350151021305, 0, '2023-07-04T20:02:40Z'),
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS, true);

  //       expect(smoothResults.nodes).toEqual(14);
  //       expect(smoothResults.clouds).toEqual(2);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(7); // 3 original nodes + 2x2 avg nodes (1 presumed pause, 1 presumed resume, for each cloud)

  //       // Cloud 1 pause & resume nodes
  //       expect(resultCoords[1].lat).toEqual(39.87824354718266);
  //       expect(resultCoords[1].lng).toEqual(-105.13525359285799);
  //       expect(resultCoords[1].timeStamp).toEqual('2023-07-04T20:00:10Z');

  //       expect(resultCoords[2].lat).toEqual(resultCoords[1].lat);
  //       expect(resultCoords[2].lng).toEqual(resultCoords[1].lng);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:01:10Z');

  //       // Cloud 2 pause & resume nodes
  //       expect(resultCoords[3].lat).toEqual(39.87823893411536);
  //       expect(resultCoords[3].lng).toEqual(-105.13519123155609);
  //       expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:20Z');

  //       expect(resultCoords[4].lat).toEqual(resultCoords[3].lat);
  //       expect(resultCoords[4].lng).toEqual(resultCoords[3].lng);
  //       expect(resultCoords[4].timeStamp).toEqual('2023-07-04T20:02:20Z');
  //     });
  //   });

  //   describe('#smoothByElevationSpeed', () => {
  //     it('should do nothing for coordinates with no DEM elevation', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
  //       ];

  //       const track = new Track(coords);
  //       track.addProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should do nothing for coordinates with elevation changes below the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1000; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1005; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1010;  // 0 m/s // TODO: separate concerns of loss/gain? This is actually 5m up, 5m down over 30 sec ~ 5m/15sec = 0.3 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1005; // -0.16667 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1000; // -0.16667 m/s

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should remove points that have an elevation gain speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1000; // 0.3333 m/s // Remove
  //       // Seg: 10m/30sec = 0.3333m/s
  //       coords[1].elevation = 1010; // 0.25 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1015; // 0.0 m/s     // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1010; // 0.16667 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1005; // 0.16667 m/s

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it(`should remove points that have an elevation loss speed above the general specified
  //       limit if no loss limit is specified`, () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1005; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1010; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1015; // 0.0 m/s    // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1010; // -0.25 m/s
  //       // Seg: -10m/30sec = -0.3333/s
  //       coords[4].elevation = 1000; // -0.3333 m/s  // Remove

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove points that have an elevation loss speed above the specified limit for loss', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1025; // 0.0 m/s    // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1020; // -0.4167 m/s
  //       // Seg: -20m/30sec = -0.6667/s
  //       coords[4].elevation = 1000; // -0.6667 m/s  // Remove

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where one adjacent segment has an elevation gain speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.25 m/s
  //       // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
  //       coords[2].elevation = 1030;
  //       // Seg: -10m/30sec = -0.33333m/s
  //       coords[3].elevation = 1020; // -0.25 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1015; // -0.16667 m/s

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where one adjacent segment has an elevation loss speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1020; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1025; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1030;
  //       // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
  //       coords[3].elevation = 1010; // -0.4167 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[4].elevation = 1000; // 0.16667 m/s

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where each adjacent segment has an elevation speed above the corresponding specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.25 m/s
  //       // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
  //       coords[2].elevation = 1030;
  //       // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
  //       coords[3].elevation = 1010; // -0.4167 m/s
  //       // Seg: -5m/30sec = 0.16667m/s
  //       coords[4].elevation = 1000; // 0.16667 m/s

  //       const track = new Track(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });
  //   });
  // });

  // describe('IQuery', () => {
  //   let lineString: LineString;
  //   let properties: TrackProperty;
  //   let polyLineTrack: PolylineTrack;

  //   beforeEach(() => {
  //     const featureJson = lineStringTrack.features[0];
  //     lineString = LineString.fromPositions(featureJson.geometry.coords);
  //     properties = TrackProperty.fromJson(featureJson.properties);

  //     const feature = Feature.fromGeometry(lineString, { properties });
  //     const featureCollection = FeatureCollection.fromFeatures([feature]);

  //     polyLineTrack = new GeoJsonTrack(featureCollection);
  //   });


  //   describe('#getSegmentBeforeTime', () => {
  //     it('should return segment before the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const { segPoints, segTimestamps } = polyLineTrack.getSegmentBeforeTime(timestamp);

  //       expect(segPoints).toEqual([
  //         [100.0, 0.0, 100],
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300]
  //       ]);
  //       expect(segTimestamps).toEqual(['1', '2', '3']);
  //     });

  //     it('should return undefined when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.5';

  //       const segments = polyLineTrack.getSegmentBeforeTime(timestamp)

  //       expect(segments).toBeUndefined();
  //     });
  //   });

  //   describe('#getSegmentAfterTime', () => {
  //     it('should return segment after the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const { segPoints, segTimestamps } = polyLineTrack.getSegmentAfterTime(timestamp);

  //       expect(segPoints).toEqual([
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400],
  //         [104.0, 4.0, 500],
  //         [105.0, 5.0, 600]
  //       ]);
  //       expect(segTimestamps).toEqual(['3', '4', '5', '6']);
  //     });

  //     it('should return undefined when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.5';

  //       const segments = polyLineTrack.getSegmentBeforeTime(timestamp)

  //       expect(segments).toBeUndefined();
  //     });
  //   });

  //   describe('#getSegmentBetweenTimes', () => {
  //     it('should return track segment before the coordinate found in a GeoJSON object', () => {
  //       const timestampStart = '2';
  //       const timestampEnd = '4';

  //       const { segPoints, segTimestamps } = polyLineTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //       expect(segPoints).toEqual([
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400]
  //       ]);
  //       expect(segTimestamps).toEqual(['2', '3', '4']);
  //     });

  //     it('should return undefined when the start coordinate is not found in a GeoJSON object', () => {
  //       const timestampStart = '2.1';
  //       const timestampEnd = '4';

  //       const segments = polyLineTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //       expect(segments).toBeUndefined();
  //     });

  //     it('should return undefined when the end coordinate is not found in the track', () => {
  //       const timestampStart = '2';
  //       const timestampEnd = '4.1';

  //       const segments = polyLineTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //       expect(segments).toBeUndefined();
  //     });
  //   });

  //   describe('#getSegmentsSplitByTimes', () => {
  //     it('should return two segments split by a single coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3']
  //       );


  //       expect(segments[1].segPoints).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[1].segTimestamps).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return three segments split by a two coords found in a GeoJSON object', () => {
  //       const timestamp1 = '2';
  //       const timestamp2 = '4';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp1, timestamp2]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2']
  //       );

  //       expect(segments[1].segPoints).toEqual(
  //         [
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400]
  //         ]
  //       );
  //       expect(segments[1].segTimestamps).toEqual(
  //         ['2', '3', '4']
  //       );

  //       expect(segments[2].segPoints).toEqual(
  //         [
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[2].segTimestamps).toEqual(
  //         ['4', '5', '6']
  //       );
  //     });

  //     it('should return two segments split by 1 coordinate found in a GeoJSON object with 2 coords provided', () => {
  //       const timestamp = '3';
  //       const timestampInvalid = '3.1';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp, timestampInvalid]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3']
  //       );

  //       expect(segments[1].segPoints).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[1].segTimestamps).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return original track segments when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.1';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the original track when split on the start coordinate', () => {
  //       const timestamp = '1';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the original track when split on the end coordinate', () => {
  //       const timestamp = '6';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });
  //   });
  // });


  // describe('IClippable', () => {
  //   let lineString: LineString;
  //   let properties: TrackProperty;
  //   let featureCollection: FeatureCollection;
  //   let polyLineTrack: PolylineTrack;

  //   beforeEach(() => {
  //     const featureJson = lineStringTrack.features[0];
  //     lineString = LineString.fromPositions(featureJson.geometry.coords);
  //     properties = TrackProperty.fromJson(featureJson.properties);

  //     const feature = Feature.fromGeometry(lineString, { properties });
  //     featureCollection = FeatureCollection.fromFeatures([feature]);

  //     polyLineTrack = new GeoJsonTrack(featureCollection);
  //   });

  //   describe('#clipBeforeTime', () => {
  //     it('should clip track to segment before the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const clippedTrack = polyLineTrack.clipBeforeTime(timestamp)

  //       expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual([
  //         [100.0, 0.0, 100],
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300]
  //       ]);
  //       expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['1', '2', '3']);
  //     });

  //     it('should do nothing to the segment if the coordinate is not found', () => {
  //       const timestamp = '3.1';

  //       const segments = polyLineTrack.clipBeforeTime(timestamp)

  //       expect(segments).toEqual(featureCollection);
  //     });
  //   });

  //   describe('#clipAfterTime', () => {
  //     it('should clip track to segment before the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const clippedTrack = polyLineTrack.clipAfterTime(timestamp)

  //       expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual([
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400],
  //         [104.0, 4.0, 500],
  //         [105.0, 5.0, 600]
  //       ]);
  //       expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['3', '4', '5', '6']);
  //     });

  //     it('should do nothing to the segment if the coordinate is not found', () => {
  //       const timestamp = '3.1';

  //       const segments = polyLineTrack.clipAfterTime(timestamp)

  //       expect(segments).toEqual(featureCollection);
  //     });
  //   });

  //   describe('#clipBetweenTimes', () => {
  //     it('should clip track to segment between the coords found in a GeoJSON object', () => {
  //       const timestampStart = '2';
  //       const timestampEnd = '4';

  //       const clippedTrack = polyLineTrack.clipBetweenTimes(timestampStart, timestampEnd)

  //       expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual([
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400]
  //       ]);
  //       expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['2', '3', '4']);
  //     });

  //     it('should do nothing to the segment when the start coordinate is not found in a GeoJSON object', () => {
  //       const timestampStart = '2.1';
  //       const timestampEnd = '4';

  //       const segments = polyLineTrack.clipBetweenTimes(timestampStart, timestampEnd)

  //       expect(segments).toEqual(featureCollection);
  //     });

  //     it('should do nothing to the segment when the end coordinate is not found in a GeoJSON object', () => {
  //       const timestampStart = '3';
  //       const timestampEnd = '4.1';

  //       const segments = polyLineTrack.clipBetweenTimes(timestampStart, timestampEnd)

  //       expect(segments).toEqual(featureCollection);
  //     });
  //   });
  // });


  // describe('ISplittable', () => {
  //   let lineString: LineString;
  //   let properties: TrackProperty;
  //   let featureCollection: FeatureCollection;
  //   let polyLineTrack: PolylineTrack;

  //   beforeEach(() => {
  //     const featureJson = lineStringTrack.features[0];
  //     lineString = LineString.fromPositions(featureJson.geometry.coords);
  //     properties = TrackProperty.fromJson(featureJson.properties);

  //     const feature = Feature.fromGeometry(lineString, { properties });
  //     featureCollection = FeatureCollection.fromFeatures([feature]);

  //     polyLineTrack = new GeoJsonTrack(featureCollection);
  //   });


  //   describe('#splitByTimes', () => {
  //     it('should return two track segments split by a single coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return three track segments split by two coords found in a GeoJSON object', () => {
  //       const timestamp1 = '2';
  //       const timestamp2 = '4';

  //       const tracks = polyLineTrack.splitByTimes([timestamp1, timestamp2]);

  //       expect(tracks.length).toEqual(3);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ])
  //         ;
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400]
  //         ]
  //       );
  //       expect((tracks[2].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['2', '3', '4']
  //       );
  //       expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['4', '5', '6']
  //       );
  //     });

  //     it('should return two track segments split by 1 coordinate found in a GeoJSON object with 2 coords provided', () => {
  //       const timestamp = '3';
  //       const timestampInvalid = '3.1';

  //       const tracks = polyLineTrack.splitByTimes([timestamp, timestampInvalid]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return the track segment unchanged when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.1';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(1);
  //       expect(tracks[0]).toEqual(featureCollection);
  //     });

  //     it('should return only the original track when a coord matches the first track coord', () => {
  //       const timestamp = '1';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the original track when a coord matches the last track coord', () => {
  //       const timestamp = '6';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });
  //   });

  //   describe('#splitBySegment', () => {
  //     it('should return the specified segment at the start of the track', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '1',
  //         endTime: '2',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);

  //       expect((track.features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //         ]
  //       );

  //       expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //     });

  //     it('should return the specified segment at the end of the track', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '5',
  //         endTime: '6',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);

  //       expect((track.features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600],
  //         ]
  //       );

  //       expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //     });

  //     it('should return the specified segment at the middle of the track', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);

  //       expect((track.features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //         ]
  //       );

  //       expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4']
  //       );
  //     });

  //     it('should return nothing if the specified segment is not found', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3.1',
  //         endTime: '4.1',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);
  //       expect(track).toBeUndefined();
  //     });
  //   });

  //   describe('#splitBySegments', () => {
  //     it('should return two track segments split by a single segment found in a GeoJSON object', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4',
  //       }
  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //     });

  //     it('should return three track segments split by two segments found in a GeoJSON object', () => {
  //       lineStringTrack = {
  //         type: 'FeatureCollection',
  //         features: [
  //           {
  //             type: 'Feature',
  //             geometry: {
  //               type: 'LineString',
  //               coords: [
  //                 [100.0, 0.0, 100],
  //                 [101.0, 1.0, 200],
  //                 [102.0, 2.0, 300],
  //                 [103.0, 3.0, 400],
  //                 [104.0, 4.0, 500],
  //                 [105.0, 5.0, 600],
  //                 [106.0, 6.0, 700],
  //                 [107.0, 7.0, 800],
  //                 [108.0, 8.0, 900],
  //                 [109.0, 9.0, 1000],
  //               ]
  //             },
  //             properties: {
  //               _gpxType: 'trk',
  //               name: 'FooBarTest',
  //               time: 'timestamp',
  //               coordinateProperties: {
  //                 times: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  //               }
  //             },
  //           }
  //         ],
  //       }

  //       const featureJson = lineStringTrack.features[0];
  //       const lineString = LineString.fromPositions(featureJson.geometry.coords);
  //       const properties = TrackProperty.fromJson(featureJson.properties);

  //       const feature = Feature.fromGeometry(lineString, { properties });
  //       const featureCollection = FeatureCollection.fromFeatures([feature]);

  //       const geoJsonTrack = new GeoJsonTrack(featureCollection);

  //       const segment1: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4',
  //       }

  //       const segment2: ITrackSegmentLimits = {
  //         startTime: '7',
  //         endTime: '8',
  //       }
  //       const tracks = geoJsonTrack.splitBySegments([segment1, segment2]);

  //       expect(tracks.length).toEqual(3);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ])
  //         ;
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600],
  //         ]
  //       );
  //       expect((tracks[2].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [108.0, 8.0, 900],
  //           [109.0, 9.0, 1000],
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //       expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['9', '10']
  //       );
  //     });

  //     it('should return two track segments split by 1 segment found in a GeoJSON object with 2 segment provided', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4'
  //       }
  //       const segmentInvalid: ITrackSegmentLimits = {
  //         startTime: '5.1',
  //         endTime: '6.1'
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment, segmentInvalid]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //     });

  //     it('should return the track segment unchanged when the segment is not found in a GeoJSON object', () => {
  //       const segmentInvalid: ITrackSegmentLimits = {
  //         startTime: '5.1',
  //         endTime: '6.1'
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segmentInvalid]);

  //       expect(tracks.length).toEqual(1);
  //       expect(tracks[0]).toEqual(featureCollection);
  //     });

  //     it('should return only the remaining track when a segment matches the first track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '1',
  //         endTime: '2',
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the remaining track when a segment matches the second track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '2',
  //         endTime: '3',
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['4', '5', '6']
  //       );
  //     });

  //     it('should return only the initial track when a segment matches the last track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '5',
  //         endTime: '6'
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3', '4']
  //       );
  //     });

  //     it('should return only the initial track when a segment matches the second-to-last track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '4',
  //         endTime: '5',
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3']
  //       );
  //     });
  //   });
  // });



  // describe('Smooth Methods', () => {
  //   describe('#smoothBySpeed', () => {
  //     it('should do nothing to a track that has no speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 1.55 m/s = 3.47 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:31Z';
  //       // Speed (average): 1.393 m/s = 3.12 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:03Z';
  //       // Speed (average): 1.258 m/s = 2.81 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:43Z';
  //       // Speed (average): 1.283 m/s = 2.87 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(0);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove the first coordinate from a track when it has speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 3.575 m/s = 8.0 mph
  //       // TrackSegment speed: 3.575 m/s = 8.0 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:18Z';
  //       // Speed (average): 2.069 m/s = 4.6 mph
  //       // TrackSegment speed: 0.564 m/s = 1.3 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:28Z';
  //       // Speed (average): 1.137 m/s = 2.5 mph
  //       // TrackSegment speed: 1.71 m/s = 3.8 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:58Z';
  //       // Speed (average): 1.710 m/s = 3.8 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(3);
  //     });

  //     it('should remove the last coordinate from a track when it has speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 1.083 m/s = 2.4 mph
  //       // TrackSegment speed:  m/s =  mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:41Z';
  //       // Speed (average): 0.870 m/s = 1.9 mph
  //       // TrackSegment speed:  m/s =  mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:41Z';
  //       // Speed (average): 2.89 m/s = 6.46 mph
  //       // TrackSegment speed:  m/s =  mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:51Z';
  //       // Speed (average): 5.13 m/s = 11.5 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 3.129; // 7 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(3);
  //     });

  //     it('should remove coords from a track that have speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:49:58Z';
  //       // Speed (average): 1.787 m/s = 4.0 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:18Z';
  //       // Speed (average): 3.086 m/s = 6.9 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:50:27Z';
  //       // Speed (average): 2.474 m/s = 5.5 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:58Z';
  //       // Speed (average): 0.563 m/s = 1.26 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(2);
  //       expect(track.points().length).toEqual(2);
  //     });
  //   });

  //   describe('#smoothByAngularSpeed', () => {
  //     it('should remove coords from a track that have clockwise angular speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
  //       coord1.timeStamp = '2023-07-04T20:00:00Z';

  //       const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
  //       coord2.timeStamp = '2023-07-04T20:07:20Z';

  //       const coord3 = new TrackPoint(39.75260590879227, -104.9990802128465);
  //       coord3.timeStamp = '2023-07-04T20:07:30Z';

  //       const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
  //       coord4.timeStamp = '2023-07-04T20:07:40Z';

  //       const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
  //       coord5.timeStamp = '2023-07-04T20:15:00Z';

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4,
  //         coord5
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitRadpS = 0.1;
  //       const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove coords from a track that have counter-clockwise angular speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
  //       coord1.timeStamp = '2023-07-04T20:00:00Z';

  //       const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
  //       coord2.timeStamp = '2023-07-04T20:07:20Z';

  //       const coord3 = new TrackPoint(39.73055300708892, -104.9990802128465);
  //       coord3.timeStamp = '2023-07-04T20:07:30Z';

  //       const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
  //       coord4.timeStamp = '2023-07-04T20:07:40Z';

  //       const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
  //       coord5.timeStamp = '2023-07-04T20:15:00Z';

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4,
  //         coord5
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitRadpS = 0.1;
  //       const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });
  //   });

  //   describe('#smoothStationary', () => {
  //     it('should remove coords from a track that have a speeds below the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T23:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T26:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T26:14:00Z')
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;
  //       const removedCoords = track.smoothStationary(minSpeedMS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should ??? coords from a track that do not have speed data', () => {
  //       // TODO: What should this behavior be or should it even be considered?
  //       //  A track with no speed data may just need it calculated or has no time stamps, in which case 'stationary' is not a valid criteria.
  //       //  A valid case would be a track with speeds where some points cannot have speed calculated (perhaps due to an error?).
  //       //    This seems unlikely to happen or would break things down earlier.
  //       //    More likely, removing points is unintended/out of order of operations.
  //       // This concern seems valid/solutions applicable in related cases, such as elevation change rates.
  //     });
  //   });

  //   describe('#smoothNoiseCloud', () => {
  //     it('should do nothing to a path with no noise clouds', () => {
  //       // Points are stationary by timestamps, but fall outside of the radius to be 'stationary' in a location based on min timestamp intervals
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(0);
  //       expect(smoothResults.clouds).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should remove coords in a noise cloud at the beginning of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         // Begin noise cloud
  //         new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:00:10Z'),
  //         new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:50Z'),
  //         // End noise cloud
  //         new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:01:10Z'),
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary, results in 3.35 meters or less between points
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(6);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed resume)

  //       // Presumed resume node
  //       expect(resultCoords[0].lat).toEqual(39.87825420255762);
  //       expect(resultCoords[0].lng).toEqual(-105.13560669104396);
  //       expect(resultCoords[0].timeStamp).toEqual('2023-07-04T20:00:50Z');
  //     });

  //     it('should remove coords in a noise cloud at the end of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:00:10Z'),
  //         // Begin noise cloud
  //         new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:01:10Z'),
  //         // End noise cloud
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(6);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed pause)

  //       // Presumed pause node
  //       expect(resultCoords[2].lat).toEqual(39.87825420255762);
  //       expect(resultCoords[2].lng).toEqual(-105.13560669104396);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');
  //     });

  //     it('should remove nodes in a noise cloud in the middle of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87823888190675, -105.1357900558201, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87822589268432, -105.1357027717129, 0, '2023-07-04T20:00:10Z'),
  //         // Begin noise cloud
  //         new TrackPoint(39.87821721769159, -105.1356040418078, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87823050857553, -105.1355974665931, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.878236962082, -105.1356171532047, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87822657116678, -105.1356188651574, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87821596033782, -105.1355800846031, 0, '2023-07-04T20:01:00Z'),
  //         // End noise cloud
  //         new TrackPoint(39.87822512731312, -105.1355053510283, 0, '2023-07-04T20:01:10Z'),
  //         new TrackPoint(39.87821988064638, -105.1353883040605, 0, '2023-07-04T20:01:20Z'),
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(5);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(6);   // 4 original nodes + 2 avg nodes (1 presumed pause, 1 presumed resume)

  //       // Pause & resume nodes
  //       expect(resultCoords[2].lat).toEqual(39.87822544397074);
  //       expect(resultCoords[2].lng).toEqual(-105.13560352227323);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');

  //       expect(resultCoords[3].lat).toEqual(resultCoords[2].lat);
  //       expect(resultCoords[3].lng).toEqual(resultCoords[2].lng);
  //       expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:00Z');
  //     });

  //     it(`should remove nodes in multiple overlapping noise clouds in the middle of the path,
  //       leaving an average pause/resume node in place`, () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87825432484495, -105.1353814910402, 0, '2023-07-04T20:00:00Z'),
  //         // Begin noise cloud #1
  //         new TrackPoint(39.87824052403623, -105.1352618135007, 0, '2023-07-04T20:00:10Z'),
  //         new TrackPoint(39.8782522989425, -105.1352433936513, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87825750947018, -105.1352618278019, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87824948371056, -105.1352684908337, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87823201248165, -105.135242862249, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87823014730432, -105.1352631715043, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.87824285433322, -105.135233590465, 0, '2023-07-04T20:01:10Z'),
  //         // End noise cloud #1
  //         // Begin noise cloud #2
  //         new TrackPoint(39.87823856216351, -105.1351918088743, 0, '2023-07-04T20:01:20Z'),
  //         new TrackPoint(39.87824751183506, -105.1351733485622, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.87825320422211, -105.1351936504459, 0, '2023-07-04T20:01:40Z'),
  //         new TrackPoint(39.87823291651964, -105.1352084650403, 0, '2023-07-04T20:01:50Z'),
  //         new TrackPoint(39.87821729634359, -105.1351968777954, 0, '2023-07-04T20:02:00Z'),
  //         new TrackPoint(39.87825197840353, -105.1351988205849, 0, '2023-07-04T20:02:10Z'),
  //         new TrackPoint(39.87823106932006, -105.1351756495897, 0, '2023-07-04T20:02:20Z'),
  //         // End noise cloud #2
  //         new TrackPoint(39.87823847144207, -105.1351062708185, 0, '2023-07-04T20:02:30Z'),
  //         new TrackPoint(39.87823789587544, -105.1350151021305, 0, '2023-07-04T20:02:40Z'),
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS, true);

  //       expect(smoothResults.nodes).toEqual(14);
  //       expect(smoothResults.clouds).toEqual(2);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(7); // 3 original nodes + 2x2 avg nodes (1 presumed pause, 1 presumed resume, for each cloud)

  //       // Cloud 1 pause & resume nodes
  //       expect(resultCoords[1].lat).toEqual(39.87824354718266);
  //       expect(resultCoords[1].lng).toEqual(-105.13525359285799);
  //       expect(resultCoords[1].timeStamp).toEqual('2023-07-04T20:00:10Z');

  //       expect(resultCoords[2].lat).toEqual(resultCoords[1].lat);
  //       expect(resultCoords[2].lng).toEqual(resultCoords[1].lng);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:01:10Z');

  //       // Cloud 2 pause & resume nodes
  //       expect(resultCoords[3].lat).toEqual(39.87823893411536);
  //       expect(resultCoords[3].lng).toEqual(-105.13519123155609);
  //       expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:20Z');

  //       expect(resultCoords[4].lat).toEqual(resultCoords[3].lat);
  //       expect(resultCoords[4].lng).toEqual(resultCoords[3].lng);
  //       expect(resultCoords[4].timeStamp).toEqual('2023-07-04T20:02:20Z');
  //     });
  //   });

  //   describe('#smoothByElevationSpeed', () => {
  //     it('should do nothing for coords with no DEM elevation', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should do nothing for coords with elevation changes below the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1000; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1005; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1010;  // 0 m/s // TODO: separate concerns of loss/gain? This is actually 5m up, 5m down over 30 sec ~ 5m/15sec = 0.3 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1005; // -0.16667 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1000; // -0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should remove points that have an elevation gain speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1000; // 0.3333 m/s // Remove
  //       // Seg: 10m/30sec = 0.3333m/s
  //       coords[1].elevation = 1010; // 0.25 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1015; // 0.0 m/s     // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1010; // 0.16667 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1005; // 0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it(`should remove points that have an elevation loss speed above the general specified
  //       limit if no loss limit is specified`, () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1005; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1010; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1015; // 0.0 m/s    // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1010; // -0.25 m/s
  //       // Seg: -10m/30sec = -0.3333/s
  //       coords[4].elevation = 1000; // -0.3333 m/s  // Remove

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove points that have an elevation loss speed above the specified limit for loss', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1025; // 0.0 m/s    // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1020; // -0.4167 m/s
  //       // Seg: -20m/30sec = -0.6667/s
  //       coords[4].elevation = 1000; // -0.6667 m/s  // Remove

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where one adjacent segment has an elevation gain speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.25 m/s
  //       // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
  //       coords[2].elevation = 1030;
  //       // Seg: -10m/30sec = -0.33333m/s
  //       coords[3].elevation = 1020; // -0.25 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1015; // -0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where one adjacent segment has an elevation loss speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1020; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1025; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1030;
  //       // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
  //       coords[3].elevation = 1010; // -0.4167 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[4].elevation = 1000; // 0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where each adjacent segment has an elevation speed above the corresponding specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.25 m/s
  //       // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
  //       coords[2].elevation = 1030;
  //       // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
  //       coords[3].elevation = 1010; // -0.4167 m/s
  //       // Seg: -5m/30sec = 0.16667m/s
  //       coords[4].elevation = 1000; // 0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });
  //   });
  // });

});