import { Segment } from '../Geometry/Segment';
import { Coordinate } from './Coordinate';
import { Track } from './Track';

describe('##Track', () => {
  describe('#calcSegmentDistanceMeters', () => {
    it('should return 0 for two points at the same location', () => {
      const coord = new Coordinate(45, 110);

      const distance = Track.calcSegmentDistanceMeters(coord, coord);

      expect(distance).toEqual(0);
    });

    it('should return the distance in meters between two points', () => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      const coord2 = new Coordinate(-8.957069, -77.777400);

      const distance = Track.calcSegmentDistanceMeters(coord1, coord2);

      expect(distance - 24.904).toBeLessThanOrEqual(0.001);
    });
  });

  describe('#calcSegmentAngleRads', () => {
    it('should return null for two points at the same location', () => {
      const coord = new Coordinate(45, 110);

      const angle = Track.calcSegmentAngleRads(coord, coord);

      expect(angle).toBeNull();
    });

    it('should return 0 for a horizontal line heading East', () => {
      const coord1Neg = new Coordinate(5, -20);
      const coord2Neg = new Coordinate(5, -10);
      const coord1Pos = new Coordinate(5, 10);
      const coord2Pos = new Coordinate(5, 20);

      const angleNegNeg = Track.calcSegmentAngleRads(coord1Neg, coord2Neg);
      expect(angleNegNeg - 0).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRads(coord2Neg, coord1Pos);
      expect(angleNegPos - 0).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRads(coord1Pos, coord2Pos);
      expect(anglePosPos - 0).toBeLessThanOrEqual(0.001);
    });

    it('should return Pi for a horizontal line heading West', () => {
      const coord1Neg = new Coordinate(5, -20);
      const coord2Neg = new Coordinate(5, -10);
      const coord1Pos = new Coordinate(5, 10);
      const coord2Pos = new Coordinate(5, 20);

      const angleNegNeg = Track.calcSegmentAngleRads(coord2Neg, coord1Neg);
      expect(angleNegNeg - Math.PI).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRads(coord1Pos, coord2Neg);
      expect(angleNegPos - Math.PI).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRads(coord2Pos, coord1Pos);
      expect(anglePosPos - Math.PI).toBeLessThanOrEqual(0.001);
    });

    it('should return Pi / 2 for a vertical line heading North', () => {
      const coord1Neg = new Coordinate(-20, 5);
      const coord2Neg = new Coordinate(-10, 5);
      const coord1Pos = new Coordinate(10, 5);
      const coord2Pos = new Coordinate(20, 5);

      const angleNegNeg = Track.calcSegmentAngleRads(coord1Neg, coord2Neg);
      expect(angleNegNeg - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRads(coord2Neg, coord1Pos);
      expect(angleNegPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRads(coord1Pos, coord2Pos);
      expect(anglePosPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);
    });

    it('should return (3/2) * Pi for a vertical line heading South', () => {
      const coord1Neg = new Coordinate(-20, 5);
      const coord2Neg = new Coordinate(-10, 5);
      const coord1Pos = new Coordinate(10, 5);
      const coord2Pos = new Coordinate(20, 5);

      const angleNegNeg = Track.calcSegmentAngleRads(coord2Neg, coord1Neg);
      expect(angleNegNeg - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRads(coord1Pos, coord2Neg);
      expect(angleNegPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRads(coord2Pos, coord1Pos);
      expect(anglePosPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);
    });

    it('should return approximately n * (Pi / 4) slope of line joining two points in radians in each of the n Quadrants', () => {
      const coordTopRight = new Coordinate(10, 10);
      const coordTopLeft = new Coordinate(10, 5);
      const coordBottomRight = new Coordinate(5, 10);
      const coordBottomLeft = new Coordinate(5, 5);

      const angleQuad1 = Track.calcSegmentAngleRads(coordBottomLeft, coordTopRight);
      expect(angleQuad1 - 0.787).toBeLessThanOrEqual(0.001);

      const angleQuad2 = Track.calcSegmentAngleRads(coordBottomRight, coordTopLeft);
      expect(angleQuad2 - 2.354).toBeLessThanOrEqual(0.001);

      const angleQuad3 = Track.calcSegmentAngleRads(coordTopRight, coordBottomLeft);
      expect(angleQuad3 + 2.349).toBeLessThanOrEqual(0.001);

      const angleQuad4 = Track.calcSegmentAngleRads(coordTopLeft, coordBottomRight);
      expect(angleQuad4 + 0.793).toBeLessThanOrEqual(0.001);
    });

    it('should return slope of line joining two points in radians', () => {
      const coordTopRight = new Coordinate(10, 20);
      const coordTopLeft = new Coordinate(10, 5);
      const coordBottomRight = new Coordinate(5, 20);
      const coordBottomLeft = new Coordinate(5, 5);

      const angleQuad1 = Track.calcSegmentAngleRads(coordBottomLeft, coordTopRight);
      expect(angleQuad1 - 0.323).toBeLessThanOrEqual(0.001);

      const angleQuad2 = Track.calcSegmentAngleRads(coordBottomRight, coordTopLeft);
      expect(angleQuad2 - 2.819).toBeLessThanOrEqual(0.001);

      const angleQuad3 = Track.calcSegmentAngleRads(coordTopRight, coordBottomLeft);
      expect(angleQuad3 + 2.815).toBeLessThanOrEqual(0.001);

      const angleQuad4 = Track.calcSegmentAngleRads(coordTopLeft, coordBottomRight);
      expect(angleQuad4 + 0.326).toBeLessThanOrEqual(0.001);
    });
  });

  describe('#calcIntervalSec', () => {
    it('should return 0 for two empty timestamps', () => {
      const interval = Track.calcIntervalSec('', '');

      expect(interval).toEqual(0);
    });

    it('should return undefined for one empty timestamp', () => {
      const interval1 = Track.calcIntervalSec('2023-07-04T17:22:15Z', '');

      expect(interval1).toBeUndefined();

      const interval2 = Track.calcIntervalSec('', '2023-07-04T17:22:15Z');

      expect(interval2).toBeUndefined();
    });

    it('should return undefined for any ill-formed timestamp', () => {
      const interval1 = Track.calcIntervalSec('2023-07-04T17:22:15Z', 'Foo');

      expect(interval1).toBeUndefined();

      const interval2 = Track.calcIntervalSec('Foo', '2023-07-04T17:22:15Z');

      expect(interval2).toBeUndefined();
    });

    it('should return a positive number of time moving forward in milliseconds', () => {
      const interval = Track.calcIntervalSec('2023-07-04T17:22:15Z', '2023-07-04T17:22:35Z');

      expect(interval).toEqual(20);
    });

    it('should return a negative number of time moving backward in milliseconds', () => {
      const interval = Track.calcIntervalSec('2023-07-04T17:22:35Z', '2023-07-04T17:22:15Z');

      expect(interval).toEqual(-20);
    });
  });

  describe('#calcSegmentSpeedMPS', () => {
    it('should return 0 for points without timestamps', () => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      const coord2 = new Coordinate(-8.957069, -77.777400);

      const speed = Track.calcSegmentSpeedMPS(coord1, coord2);

      expect(speed).toBeLessThanOrEqual(0.001);
    });

    it('should return 0 for two points at the same location', () => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-8.957287, -77.777452);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const speed = Track.calcSegmentSpeedMPS(coord1, coord2);

      expect(speed).toBeLessThanOrEqual(0.001);
    });

    it('should return undefined for points with ill-formed timestamps', () => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-8.957069, -77.777400);
      coord2.timeStamp = 'Foo';

      const speed = Track.calcSegmentSpeedMPS(coord1, coord2);

      expect(speed).toBeUndefined();
    });

    it('should return a positive speed in meters per second between two points with timestamps regardless of order', () => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-8.957069, -77.777400);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const speed = Track.calcSegmentSpeedMPS(coord1, coord2);
      const speedReversed = Track.calcSegmentSpeedMPS(coord2, coord1);

      expect(speed - 1.245).toBeLessThanOrEqual(0.001);
      expect(speedReversed - 1.245).toBeLessThanOrEqual(0.001);
    });
  });

  describe('#calcSegmentDirection', () => {
    it('should return {null, null} for two points at the same location', () => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-8.957287, -77.777452);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: null, lng: null });
    });

    it('should return {N, E} for a segment pointing Northeast', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(10, 20);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: 'N', lng: 'E' });
    });

    it('should return {N, W} for a segment pointing Northwest', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(10, 5);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: 'N', lng: 'W' });
    });

    it('should return {S, E} for a segment pointing Southeast', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-5, 20);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: 'S', lng: 'E' });
    });

    it('should return {S, W} for a segment pointing Southwest', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-10, -20);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: 'S', lng: 'W' });
    });

    it('should return {null, E} for a segment pointing East', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(5, 20);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: null, lng: 'E' });
    });

    it('should return {N, null} for a segment pointing North', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(10, 10);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: 'N', lng: null });
    });

    it('should return {null, W} for a segment pointing West', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(5, -20);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: null, lng: 'W' });
    });

    it('should return {S, null} for a segment pointing South', () => {
      const coord1 = new Coordinate(5, 10);
      coord1.timeStamp = '2023-07-04T17:22:15Z';

      const coord2 = new Coordinate(-10, 10);
      coord2.timeStamp = '2023-07-04T17:22:35Z';

      const direction = Track.calcSegmentDirection(coord1, coord2);

      expect(direction).toEqual({ lat: 'S', lng: null });
    });
  });

  describe('#calcCoordAvgSpeedMPS', () => {
    it('should return undefined if both segments are missing speed properties', () => {
      const prevSegment = new Segment();
      const nextSegment = new Segment();

      const avgSpeed = Track.calcCoordAvgSpeedMPS(prevSegment, nextSegment);

      expect(avgSpeed).toBeUndefined();
    });

    it('should return undefined if both segments have 0 speed', () => {
      const prevSegment = new Segment();
      prevSegment.speed = 0;

      const nextSegment = new Segment();
      nextSegment.speed = 0;

      const avgSpeed = Track.calcCoordAvgSpeedMPS(prevSegment, nextSegment);

      expect(avgSpeed).toBeUndefined();
    });

    it('should return moving segment speed if one segment has 0 speed', () => {
      const segment = new Segment();
      segment.speed = 5;

      const segmentStationary = new Segment();
      segmentStationary.speed = 0;

      const avgSpeed1 = Track.calcCoordAvgSpeedMPS(segmentStationary, segment);
      expect(avgSpeed1).toEqual(5);

      const avgSpeed2 = Track.calcCoordAvgSpeedMPS(segment, segmentStationary);
      expect(avgSpeed2).toEqual(5);
    });

    it('should return the first segment speed for the first coordinate in a track', () => {
      const nextSegment = new Segment();
      nextSegment.speed = 5;

      const avgSpeed = Track.calcCoordAvgSpeedMPS(null, nextSegment);

      expect(avgSpeed).toEqual(5);
    });

    it('should return the last segment speed for the last coordinate in a track', () => {
      const prevSegment = new Segment();
      prevSegment.speed = 5;

      const avgSpeed = Track.calcCoordAvgSpeedMPS(prevSegment, null);

      expect(avgSpeed).toEqual(5);
    });

    it('should return the average speed of two segments that meet at the same coordinate', () => {
      const prevSegment = new Segment();
      prevSegment.speed = 5;

      const nextSegment = new Segment();
      nextSegment.speed = 10;

      const avgSpeed = Track.calcCoordAvgSpeedMPS(prevSegment, nextSegment);

      expect(avgSpeed).toEqual(7.5);
    });
  });



  describe('#addProperties', () => {
    let coordinates: Coordinate[];

    beforeEach(() => {
      const coord1 = new Coordinate(-8.957287, -77.777452);
      coord1.timeStamp = '2023-07-04T17:22:15Z';
      // speed 2.3 mph
      // heading 48.3
      // avgSpeed = 1.245 m/s = 2.785
      // segment1 speed = 1.245 m/s = 2.78 mph
      // segment1 angle =
      // segment1 direction = N, E

      const coord2 = new Coordinate(-8.957069, -77.777400);
      coord2.timeStamp = '2023-07-04T17:22:35Z';
      // speed 2.8 mph
      // heading 13.3
      // avgSpeed = 1.301 m/s = 2.91 mph
      // segment2 speed = 1.358 m/s = 3.04 mph
      // segment2 angle = 1.0363 rad = 59.4 deg
      // segment2 direction = N, E

      const coord3 = new Coordinate(-8.956936, -77.777381);
      coord3.timeStamp = '2023-07-04T17:22:46Z';
      // speed 3.0 mph
      // heading 8.2
      // avgSpeed = 1.297 m/s = 2.90 mph
      // segment3 speed = 1.237 m/s = 2.77 mph
      // segment3 angle =
      // segment3 direction = N, E

      const coord4 = new Coordinate(-8.956758, -77.777211);
      coord4.timeStamp = '2023-07-04T17:23:08Z';
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
      const track = new Track(coordinates);

      track.addProperties();

      const segments = track.segments();

      expect(segments[1].length - 14.935).toBeLessThanOrEqual(0.001);
      expect(segments[1].speed - 1.358).toBeLessThanOrEqual(0.001);
      expect(segments[1].angle - 1.431).toBeLessThanOrEqual(0.001);
      expect(segments[1].direction).toEqual({ lat: 'N', lng: 'E' });
    });

    it('should add derived properties to coordinates', () => {
      const track = new Track(coordinates);

      track.addProperties();

      const coords = track.coords();

      // Check middle node
      expect(coords[1].speedAvg - 1.301).toBeLessThanOrEqual(0.001);

      // Check start node
      expect(coords[0].speedAvg - 1.245).toBeLessThanOrEqual(0.001);

      // Check end node
      expect(coords[coords.length - 1].speedAvg - 1.237).toBeLessThanOrEqual(0.001);
    });
  });
});