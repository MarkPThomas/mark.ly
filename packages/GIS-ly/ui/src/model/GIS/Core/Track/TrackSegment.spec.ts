import { IDirection } from '../Direction';
import { TrackPoint } from './TrackPoint';
import { TrackSegment, ITrackSegmentProperties } from './TrackSegment';

describe('##TrackSegment', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize a new Segment instance with no properties', () => {
        const segment = new TrackSegment();

        expect(segment.length).toBeUndefined();
        expect(segment.angle).toBeUndefined();

        expect(segment.direction).toBeUndefined();
        expect(segment.height).toBeUndefined();

        expect(segment.duration).toBeUndefined();
        expect(segment.speed).toBeUndefined();
        expect(segment.heightRate).toBeUndefined();
      });

      it('should initialize a new Segment instance with the specified properties', () => {
        const length = 15;
        const angle = 45;
        const direction: IDirection = {
          lat: 'N',
          lng: 'E'
        };
        const height = 100;
        const duration = 20;

        const segment = new TrackSegment(length, angle, direction, height, duration);

        expect(segment.length).toEqual(length);
        expect(segment.angle).toEqual(angle);

        expect(segment.direction).toEqual(direction);
        expect(segment.height).toEqual(height);

        expect(segment.duration).toEqual(duration);
        expect(segment.speed).toBeCloseTo(0.75, 2);
        expect(segment.heightRate).toBeCloseTo(5, 1);
      });
    });

    describe('#fromTrackPoints', () => {
      it('should initialze a new Segment with properties derived from the Point', () => {
        const ptI = new TrackPoint(-8.957287, -77.777452, 100, '2023-07-04T17:22:15Z');
        // heading 48.3
        // segment1 length = 24.9 m
        // segment1 angle = 1.339 rad = 76.7 deg
        // segment1 direction = N, E
        // segment1 duration = 20 sec
        // segment1 speed = 1.245 m/s = 2.78 mph

        const ptJ = new TrackPoint(-8.957069, -77.777400, 200, '2023-07-04T17:22:35Z');

        const segment = TrackSegment.fromTrackPoints(ptI, ptJ);

        expect(segment.length).toBeCloseTo(24.9, 1);
        expect(segment.angle).toBeCloseTo(1.339, 3);

        expect(segment.direction).toEqual({
          lat: 'N',
          lng: 'E'
        });
        expect(segment.height).toBeCloseTo(100, 0);

        expect(segment.duration).toBeCloseTo(20, 0);
        expect(segment.speed).toBeCloseTo(1.245, 3);
        expect(segment.heightRate).toBeCloseTo(5);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Segment', () => {
        const length = 15;
        const angle = 45;
        const direction: IDirection = {
          lat: 'N',
          lng: 'E'
        };
        const height = 100;
        const duration = 20;
        const segment = new TrackSegment(length, angle, direction, height, duration);

        const segmentClone = segment.clone();

        expect(segment.equals(segmentClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Segments with differing properties', () => {
        const length = 15;
        const angle = 45;
        const direction: IDirection = {
          lat: 'N',
          lng: 'E'
        };
        const height = 100;
        const duration1 = 20;
        const segment1 = new TrackSegment(length, angle, direction, height, duration1);

        const duration2 = 10;
        const segment2 = new TrackSegment(length, angle, direction, height, duration2);

        const result = segment1.equals(segment2);

        expect(result).toBeFalsy();
      });


      it('should return True for Segments with identical properties', () => {
        const length = 15;
        const angle = 45;
        const direction: IDirection = {
          lat: 'N',
          lng: 'E'
        };
        const height = 100;
        const duration = 20;
        const segment1 = new TrackSegment(length, angle, direction, height, duration);
        const segment2 = new TrackSegment(length, angle, direction, height, duration);

        const result = segment1.equals(segment2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Adding Data', () => {
    describe('#addSegmentProperties', () => {
      it('should add duration & speed properties derived from the adjacent Points in addition to the Route Segment data', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const segment = new TrackSegment();

        segment.addSegmentProperties(coord1, coord2);

        expect(segment.length).toBeCloseTo(24.9, 1);
        expect(segment.angle).toBeCloseTo(1.339, 3);

        expect(segment.direction).toEqual({
          lat: 'N',
          lng: 'E'
        });
        expect(segment.height).toBeUndefined();

        expect(segment.duration).toBeCloseTo(20, 0);
        expect(segment.speed).toBeCloseTo(1.245, 3);
        expect(segment.heightRate).toBeUndefined();
      });

      it('should add height rate properties from the adjacent Points if they contain measured altitudes', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452, 100, '2023-07-04T17:22:15Z');
        const coord2 = new TrackPoint(-8.957069, -77.777400, 200, '2023-07-04T17:22:35Z');
        const segment = new TrackSegment();

        segment.addSegmentProperties(coord1, coord2);

        expect(segment.height).toBeCloseTo(100, 0);

        expect(segment.heightRate).toBeCloseTo(5, 0);
      });
    });

    describe('#addElevationData', () => {
      it('should add height rate properties from the adjacent Points if they contain mapped elevations', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';
        coord1.elevation = 200;
        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';
        coord2.elevation = 500;
        const segment = new TrackSegment();

        segment.addSegmentProperties(coord1, coord2);
        expect(segment.height).toBeUndefined();

        segment.addElevationData(coord1, coord2);

        expect(segment.height).toBeCloseTo(300, 0);

        expect(segment.heightRate).toBeCloseTo(15, 0);
      });

      it('should replace height rate properties from measured altitudes if the Points also contain mapped elevations', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452, 100, '2023-07-04T17:22:15Z');
        coord1.elevation = 200;
        const coord2 = new TrackPoint(-8.957069, -77.777400, 200, '2023-07-04T17:22:35Z');
        coord2.elevation = 500;
        const segment = new TrackSegment();

        segment.addSegmentProperties(coord1, coord2);

        expect(segment.height).toBeCloseTo(100, 0);

        expect(segment.heightRate).toBeCloseTo(5, 0);

        segment.addElevationData(coord1, coord2);

        expect(segment.height).toBeCloseTo(300, 0);

        expect(segment.heightRate).toBeCloseTo(15, 0);
      });
    });
  });

  describe('Static Calc Methods', () => {
    describe('#calcAvgSpeedMPS', () => {
      it('should return undefined if both segments are missing speed properties', () => {
        const prevSegment = new TrackSegment();
        const nextSegment = new TrackSegment();

        const avgSpeed = TrackSegment.calcAvgSpeedMPS(prevSegment, nextSegment);

        expect(avgSpeed).toBeUndefined();
      });

      it('should return undefined if both segments have 0 speed', () => {
        const prevSegment = new TrackSegment();
        prevSegment.speed = 0;

        const nextSegment = new TrackSegment();
        nextSegment.speed = 0;

        const avgSpeed = TrackSegment.calcAvgSpeedMPS(prevSegment, nextSegment);

        expect(avgSpeed).toBeUndefined();
      });

      it('should return moving segment speed if one segment has 0 speed', () => {
        const segment = new TrackSegment();
        segment.speed = 5;

        const segmentStationary = new TrackSegment();
        segmentStationary.speed = 0;

        const avgSpeed1 = TrackSegment.calcAvgSpeedMPS(segmentStationary, segment);
        expect(avgSpeed1).toEqual(5);

        const avgSpeed2 = TrackSegment.calcAvgSpeedMPS(segment, segmentStationary);
        expect(avgSpeed2).toEqual(5);
      });

      it('should return the first segment speed for the first coordinate in a track', () => {
        const nextSegment = new TrackSegment();
        nextSegment.speed = 5;

        const avgSpeed = TrackSegment.calcAvgSpeedMPS(null, nextSegment);

        expect(avgSpeed).toEqual(5);
      });

      it('should return the last segment speed for the last coordinate in a track', () => {
        const prevSegment = new TrackSegment();
        prevSegment.speed = 5;

        const avgSpeed = TrackSegment.calcAvgSpeedMPS(prevSegment, null);

        expect(avgSpeed).toEqual(5);
      });

      it('should return the average speed of two segments that meet at the same coordinate', () => {
        const prevSegment = new TrackSegment();
        prevSegment.speed = 5;

        const nextSegment = new TrackSegment();
        nextSegment.speed = 10;

        const avgSpeed = TrackSegment.calcAvgSpeedMPS(prevSegment, nextSegment);

        expect(avgSpeed).toEqual(7.5);
      });
    });

    describe('#calcAvgElevationSpeedMPS', () => {
      it('should return undefined if both segments are missing elevation speed properties', () => {
        const prevSegment = new TrackSegment();
        const nextSegment = new TrackSegment();

        const elevationSpeed = TrackSegment.calcAvgElevationSpeedMPS(prevSegment, nextSegment);

        expect(elevationSpeed).toBeUndefined();
      });

      it('should return moving segment elevation speed if one segment is missing elevation speed properties', () => {
        const segment = new TrackSegment();
        segment.heightRate = 5;

        const segmentMissingProps = new TrackSegment();

        const elevationSpeed1 = TrackSegment.calcAvgElevationSpeedMPS(segmentMissingProps, segment);
        expect(elevationSpeed1).toEqual(5);

        const elevationSpeed2 = TrackSegment.calcAvgElevationSpeedMPS(segment, segmentMissingProps);
        expect(elevationSpeed2).toEqual(5);
      });

      it('should return 0 if both segments have 0 elevation speed', () => {
        const prevSegment = new TrackSegment();
        prevSegment.heightRate = 0;

        const nextSegment = new TrackSegment();
        nextSegment.heightRate = 0;

        const elevationSpeed = TrackSegment.calcAvgElevationSpeedMPS(prevSegment, nextSegment);

        expect(elevationSpeed).toEqual(0);
      });

      it('should return average segment elevation speed if one segment has 0 elevation speed', () => {
        const segment = new TrackSegment();
        segment.heightRate = 5;

        const segmentStationary = new TrackSegment();
        segmentStationary.heightRate = 0;

        const elevationSpeed1 = TrackSegment.calcAvgElevationSpeedMPS(segmentStationary, segment);
        expect(elevationSpeed1).toEqual(2.5);

        const elevationSpeed2 = TrackSegment.calcAvgElevationSpeedMPS(segment, segmentStationary);
        expect(elevationSpeed2).toEqual(2.5);
      });

      it('should return the first segment elevation speed for the first coordinate in a track', () => {
        const nextSegment = new TrackSegment();
        nextSegment.heightRate = 5;

        const elevationSpeed = TrackSegment.calcAvgElevationSpeedMPS(null, nextSegment);

        expect(elevationSpeed).toEqual(5);
      });

      it('should return the last segment elevation speed for the last coordinate in a track', () => {
        const prevSegment = new TrackSegment();
        prevSegment.heightRate = 5;

        const elevationSpeed = TrackSegment.calcAvgElevationSpeedMPS(prevSegment, null);

        expect(elevationSpeed).toEqual(5);
      });

      it('should return the average elevation speed of two segments that meet at the same coordinate', () => {
        const prevSegment = new TrackSegment();
        prevSegment.heightRate = 5;

        const nextSegment = new TrackSegment();
        nextSegment.heightRate = 10;

        const elevationSpeed = TrackSegment.calcAvgElevationSpeedMPS(prevSegment, nextSegment);

        expect(elevationSpeed).toEqual(7.5);
      });
    });

    describe('#calcAngularSpeedRadPerSec', () => {
      it('should return null if either segment lacks duration properties', () => {
        const segment: ITrackSegmentProperties = {
          length: null,
          angle: null,
          duration: 5
        };

        const segNoDuration: ITrackSegmentProperties = {
          length: null,
          angle: null,
        };

        const angularSpeed1 = TrackSegment.calcAngularSpeedRadPerSec(segment, segNoDuration);
        expect(angularSpeed1).toBeNull();

        const angularSpeed2 = TrackSegment.calcAngularSpeedRadPerSec(segNoDuration, segment);
        expect(angularSpeed2).toBeNull();
      });

      it('should return null if either segment has an unset angle', () => {
        const segment: ITrackSegmentProperties = {
          length: null,
          angle: Math.PI,
          duration: 5
        };

        const segAngleUnset: ITrackSegmentProperties = {
          length: null,
          angle: null,
          duration: 10
        };

        const angularSpeed1 = TrackSegment.calcAngularSpeedRadPerSec(segment, segAngleUnset);
        expect(angularSpeed1).toBeNull();

        const angularSpeed2 = TrackSegment.calcAngularSpeedRadPerSec(segAngleUnset, segment);
        expect(angularSpeed2).toBeNull();
      });

      it('should return the path rotation in radians per second between two segments', () => {
        const segI: ITrackSegmentProperties = {
          length: null,
          angle: 0.25 * Math.PI,
          duration: 5
        };

        const segJ: ITrackSegmentProperties = {
          length: null,
          angle: 0.75 * Math.PI,
          duration: 10
        };

        const angularSpeed = TrackSegment.calcAngularSpeedRadPerSec(segI, segJ);
        expect(angularSpeed - (0.5 * Math.PI / 15)).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcSegmentSpeedMPS', () => {
      it('should return 0 for points without timestamps', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        const coord2 = new TrackPoint(-8.957069, -77.777400);

        const speed = TrackSegment.calcSegmentSpeedMPS(coord1, coord2);

        expect(speed).toBeLessThanOrEqual(0.001);
      });

      it('should return 0 for two points at the same location', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957287, -77.777452);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const speed = TrackSegment.calcSegmentSpeedMPS(coord1, coord2);

        expect(speed).toBeLessThanOrEqual(0.001);
      });

      it('should return undefined for points with ill-formed timestamps', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = 'Foo';

        const speed = TrackSegment.calcSegmentSpeedMPS(coord1, coord2);

        expect(speed).toBeUndefined();
      });

      it('should return a positive speed in meters per second between two points with timestamps regardless of order', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const speed = TrackSegment.calcSegmentSpeedMPS(coord1, coord2);
        const speedReversed = TrackSegment.calcSegmentSpeedMPS(coord2, coord1);

        expect(speed - 1.245).toBeLessThanOrEqual(0.001);
        expect(speedReversed - 1.245).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcSpeedMPS', () => {
      it('should return infinity if the duration is 0', () => {
        const length = 1000;
        const duration = 0;

        const speed = TrackSegment.calcSpeedMPS(length, duration);
        expect(speed).toEqual(Infinity);
      });

      it('should return the linear speed of the segment', () => {
        const length = 1000;
        const duration = 2000;

        const speed = TrackSegment.calcSpeedMPS(length, duration);
        expect(speed).toEqual(0.5);
      });
    });

    describe('#calcElevationSpeedMPS', () => {
      it('should return infinity if the duration is 0', () => {
        const elevationChange = 1000;
        const duration = 0;

        const elevationSpeed = TrackSegment.calcElevationSpeedMPS(elevationChange, duration);
        expect(elevationSpeed).toEqual(Infinity);
      });

      it('should return the rate of elevation change', () => {
        const elevationChange = 1000;
        const duration = 2000;

        const elevationSpeed = TrackSegment.calcElevationSpeedMPS(elevationChange, duration);
        expect(elevationSpeed).toEqual(0.5);
      });
    });
  });
});
