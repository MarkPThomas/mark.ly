import { ICoordinate } from '../../../../../server/api/elevationDataApi/model';
import { ISegment, Segment } from '../../Geometry/Segment';
import { Coordinate } from '../Coordinate';
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

      const angle = Track.calcSegmentAngleRad(coord, coord);

      expect(angle).toBeNull();
    });

    it('should return 0 for a horizontal line heading East', () => {
      const coord1Neg = new Coordinate(5, -20);
      const coord2Neg = new Coordinate(5, -10);
      const coord1Pos = new Coordinate(5, 10);
      const coord2Pos = new Coordinate(5, 20);

      const angleNegNeg = Track.calcSegmentAngleRad(coord1Neg, coord2Neg);
      expect(angleNegNeg - 0).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRad(coord2Neg, coord1Pos);
      expect(angleNegPos - 0).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRad(coord1Pos, coord2Pos);
      expect(anglePosPos - 0).toBeLessThanOrEqual(0.001);
    });

    it('should return Pi for a horizontal line heading West', () => {
      const coord1Neg = new Coordinate(5, -20);
      const coord2Neg = new Coordinate(5, -10);
      const coord1Pos = new Coordinate(5, 10);
      const coord2Pos = new Coordinate(5, 20);

      const angleNegNeg = Track.calcSegmentAngleRad(coord2Neg, coord1Neg);
      expect(angleNegNeg - Math.PI).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRad(coord1Pos, coord2Neg);
      expect(angleNegPos - Math.PI).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRad(coord2Pos, coord1Pos);
      expect(anglePosPos - Math.PI).toBeLessThanOrEqual(0.001);
    });

    it('should return Pi / 2 for a vertical line heading North', () => {
      const coord1Neg = new Coordinate(-20, 5);
      const coord2Neg = new Coordinate(-10, 5);
      const coord1Pos = new Coordinate(10, 5);
      const coord2Pos = new Coordinate(20, 5);

      const angleNegNeg = Track.calcSegmentAngleRad(coord1Neg, coord2Neg);
      expect(angleNegNeg - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRad(coord2Neg, coord1Pos);
      expect(angleNegPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRad(coord1Pos, coord2Pos);
      expect(anglePosPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);
    });

    it('should return (3/2) * Pi for a vertical line heading South', () => {
      const coord1Neg = new Coordinate(-20, 5);
      const coord2Neg = new Coordinate(-10, 5);
      const coord1Pos = new Coordinate(10, 5);
      const coord2Pos = new Coordinate(20, 5);

      const angleNegNeg = Track.calcSegmentAngleRad(coord2Neg, coord1Neg);
      expect(angleNegNeg - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const angleNegPos = Track.calcSegmentAngleRad(coord1Pos, coord2Neg);
      expect(angleNegPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

      const anglePosPos = Track.calcSegmentAngleRad(coord2Pos, coord1Pos);
      expect(anglePosPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);
    });

    it('should return approximately n * (Pi / 4) slope of line joining two points in radians in each of the n Quadrants', () => {
      const coordTopRight = new Coordinate(10, 10);
      const coordTopLeft = new Coordinate(10, 5);
      const coordBottomRight = new Coordinate(5, 10);
      const coordBottomLeft = new Coordinate(5, 5);

      const angleQuad1 = Track.calcSegmentAngleRad(coordBottomLeft, coordTopRight);
      expect(angleQuad1 - 0.787).toBeLessThanOrEqual(0.001);

      const angleQuad2 = Track.calcSegmentAngleRad(coordBottomRight, coordTopLeft);
      expect(angleQuad2 - 2.354).toBeLessThanOrEqual(0.001);

      const angleQuad3 = Track.calcSegmentAngleRad(coordTopRight, coordBottomLeft);
      expect(angleQuad3 + 2.349).toBeLessThanOrEqual(0.001);

      const angleQuad4 = Track.calcSegmentAngleRad(coordTopLeft, coordBottomRight);
      expect(angleQuad4 + 0.793).toBeLessThanOrEqual(0.001);
    });

    it('should return slope of line joining two points in radians', () => {
      const coordTopRight = new Coordinate(10, 20);
      const coordTopLeft = new Coordinate(10, 5);
      const coordBottomRight = new Coordinate(5, 20);
      const coordBottomLeft = new Coordinate(5, 5);

      const angleQuad1 = Track.calcSegmentAngleRad(coordBottomLeft, coordTopRight);
      expect(angleQuad1 - 0.323).toBeLessThanOrEqual(0.001);

      const angleQuad2 = Track.calcSegmentAngleRad(coordBottomRight, coordTopLeft);
      expect(angleQuad2 - 2.819).toBeLessThanOrEqual(0.001);

      const angleQuad3 = Track.calcSegmentAngleRad(coordTopRight, coordBottomLeft);
      expect(angleQuad3 + 2.815).toBeLessThanOrEqual(0.001);

      const angleQuad4 = Track.calcSegmentAngleRad(coordTopLeft, coordBottomRight);
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

  describe('#calcSegmentMappedElevationChange', () => {
    it('should return undefined if either or both of the nodes provided lack mapped elevations', () => {
      const coordNoElev = new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:00Z');
      const coordMappedElev = new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:00Z');
      coordMappedElev.elevation = 1000;

      expect(Track.calcSegmentMappedElevationChange(coordNoElev, coordMappedElev)).toBeUndefined();
      expect(Track.calcSegmentMappedElevationChange(coordMappedElev, coordNoElev)).toBeUndefined();
      expect(Track.calcSegmentMappedElevationChange(coordNoElev, coordNoElev)).toBeUndefined();
    });

    it('should return the difference in elevation between two nodes that have mapped elevations', () => {
      const coord1 = new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:00Z');
      coord1.elevation = 1000;
      const coord2 = new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:00Z');
      coord2.elevation = 2000;

      expect(Track.calcSegmentMappedElevationChange(coord1, coord2)).toEqual(1000); // Uphill slope
      expect(Track.calcSegmentMappedElevationChange(coord2, coord1)).toEqual(-1000);  // Downhill slope
    });
  });

  describe('#calcSegmentMappedElevationSpeedMPS', () => {
    it('should return infinity if the duration is 0', () => {
      const elevationChange = 1000;
      const duration = 0;

      const elevationSpeed = Track.calcSegmentMappedElevationSpeedMPS(elevationChange, duration);
      expect(elevationSpeed).toEqual(Infinity);
    });

    it('should return the rate of elevation change', () => {
      const elevationChange = 1000;
      const duration = 2000;

      const elevationSpeed = Track.calcSegmentMappedElevationSpeedMPS(elevationChange, duration);
      expect(elevationSpeed).toEqual(0.5);
    });
  });

  describe('#calcCoordAvgElevationSpeedMPS', () => {
    it('should return undefined if both segments are missing elevation speed properties', () => {
      const prevSegment = new Segment();
      const nextSegment = new Segment();

      const elevationSpeed = Track.calcCoordAvgElevationSpeedMPS(prevSegment, nextSegment);

      expect(elevationSpeed).toBeUndefined();
    });

    it('should return moving segment elevation speed if one segment is missing elevation speed properties', () => {
      const segment = new Segment();
      segment.heightRate = 5;

      const segmentMissingProps = new Segment();

      const elevationSpeed1 = Track.calcCoordAvgElevationSpeedMPS(segmentMissingProps, segment);
      expect(elevationSpeed1).toEqual(5);

      const elevationSpeed2 = Track.calcCoordAvgElevationSpeedMPS(segment, segmentMissingProps);
      expect(elevationSpeed2).toEqual(5);
    });

    it('should return 0 if both segments have 0 elevation speed', () => {
      const prevSegment = new Segment();
      prevSegment.heightRate = 0;

      const nextSegment = new Segment();
      nextSegment.heightRate = 0;

      const elevationSpeed = Track.calcCoordAvgElevationSpeedMPS(prevSegment, nextSegment);

      expect(elevationSpeed).toEqual(0);
    });

    it('should return average segment elevation speed if one segment has 0 elevation speed', () => {
      const segment = new Segment();
      segment.heightRate = 5;

      const segmentStationary = new Segment();
      segmentStationary.heightRate = 0;

      const elevationSpeed1 = Track.calcCoordAvgElevationSpeedMPS(segmentStationary, segment);
      expect(elevationSpeed1).toEqual(2.5);

      const elevationSpeed2 = Track.calcCoordAvgElevationSpeedMPS(segment, segmentStationary);
      expect(elevationSpeed2).toEqual(2.5);
    });

    it('should return the first segment elevation speed for the first coordinate in a track', () => {
      const nextSegment = new Segment();
      nextSegment.heightRate = 5;

      const elevationSpeed = Track.calcCoordAvgElevationSpeedMPS(null, nextSegment);

      expect(elevationSpeed).toEqual(5);
    });

    it('should return the last segment elevation speed for the last coordinate in a track', () => {
      const prevSegment = new Segment();
      prevSegment.heightRate = 5;

      const elevationSpeed = Track.calcCoordAvgElevationSpeedMPS(prevSegment, null);

      expect(elevationSpeed).toEqual(5);
    });

    it('should return the average elevation speed of two segments that meet at the same coordinate', () => {
      const prevSegment = new Segment();
      prevSegment.heightRate = 5;

      const nextSegment = new Segment();
      nextSegment.heightRate = 10;

      const elevationSpeed = Track.calcCoordAvgElevationSpeedMPS(prevSegment, nextSegment);

      expect(elevationSpeed).toEqual(7.5);
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

  describe('#calcPathRotationRads', () => {
    it('should return null if either angle is not set', () => {
      const segment: ISegment = {
        length: null,
        angle: 0.785
      };

      const segAngleUnset: ISegment = new Segment();

      const interval = Track.calcPathRotationRad(segment, segAngleUnset);

      expect(interval).toBeNull();
    });

    it('should return the angle of rotation from the first segment to the second segment', () => {
      const segIQuad1: ISegment = {
        length: null,
        angle: 0.25 * Math.PI
      };
      const segJQuad1: ISegment = {
        length: null,
        angle: 0.25 * Math.PI + 0.1 * Math.PI
      };


      const segIQuad2: ISegment = {
        length: null,
        angle: 0.75 * Math.PI
      };
      const segJQuad2: ISegment = {
        length: null,
        angle: 0.75 * Math.PI + 0.1 * Math.PI
      };

      const segIQuad3: ISegment = {
        length: null,
        angle: -0.75 * Math.PI
      };
      const segJQuad3: ISegment = {
        length: null,
        angle: -0.75 * Math.PI + 0.1 * Math.PI
      };

      const segIQuad4: ISegment = {
        length: null,
        angle: -0.25 * Math.PI
      };
      const segJQuad4: ISegment = {
        length: null,
        angle: -0.25 * Math.PI + 0.1 * Math.PI
      };

      // Check each small rotation within the same quadrant
      const rotationQuad1Quad1 = Track.calcPathRotationRad(segIQuad1, segJQuad1);
      expect(rotationQuad1Quad1 - 0.314).toBeLessThanOrEqual(0.001);

      const rotationQuad2Quad2 = Track.calcPathRotationRad(segIQuad2, segJQuad2);
      expect(rotationQuad2Quad2 - 0.314).toBeLessThanOrEqual(0.001);

      const rotationQuad3Quad3 = Track.calcPathRotationRad(segIQuad3, segJQuad3);
      expect(rotationQuad3Quad3 - 0.314).toBeLessThanOrEqual(0.001);

      const rotationQuad4Quad4 = Track.calcPathRotationRad(segIQuad4, segJQuad4);
      expect(rotationQuad4Quad4 - 0.314).toBeLessThanOrEqual(0.001);

      // Check each small rotation in the opposite direction within the same quadrant
      const rotationQuad1Quad1Reverse = Track.calcPathRotationRad(segJQuad1, segIQuad1);
      expect(rotationQuad1Quad1Reverse + 0.314).toBeLessThanOrEqual(0.001);

      const rotationQuad2Quad2Reverse = Track.calcPathRotationRad(segJQuad2, segIQuad2);
      expect(rotationQuad2Quad2Reverse + 0.314).toBeLessThanOrEqual(0.001);

      const rotationQuad3Quad3Reverse = Track.calcPathRotationRad(segJQuad3, segIQuad3);
      expect(rotationQuad3Quad3Reverse + 0.314).toBeLessThanOrEqual(0.001);

      const rotationQuad4Quad4Reverse = Track.calcPathRotationRad(segJQuad4, segIQuad4);
      expect(rotationQuad4Quad4Reverse + 0.314).toBeLessThanOrEqual(0.001);


      // Check each larger rotation between quadrants
      const rotationQuad1Quad2 = Track.calcPathRotationRad(segIQuad1, segIQuad2);
      expect(rotationQuad1Quad2 - 1.571).toBeLessThanOrEqual(0.001);

      const rotationQuad2Quad3 = Track.calcPathRotationRad(segIQuad1, segIQuad3);
      expect(rotationQuad2Quad3 + 3.142).toBeLessThanOrEqual(0.001); // + 1.571

      const rotationQuad3Quad4 = Track.calcPathRotationRad(segIQuad1, segIQuad4);
      expect(rotationQuad3Quad4 + 1.571).toBeLessThanOrEqual(0.001);  // + 3.142
    });
  });

  describe('#calcPathAngularSpeedRadPerSec', () => {
    it('should return null if either segment lacks duration properties', () => {
      const segment: ISegment = {
        length: null,
        angle: null,
        duration: 5
      };

      const segNoDuration: ISegment = {
        length: null,
        angle: null,
      };

      const angularSpeed1 = Track.calcPathAngularSpeedRadPerSec(segment, segNoDuration);
      expect(angularSpeed1).toBeNull();

      const angularSpeed2 = Track.calcPathAngularSpeedRadPerSec(segNoDuration, segment);
      expect(angularSpeed2).toBeNull();
    });

    it('should return null if either segment has an unset angle', () => {
      const segment: ISegment = {
        length: null,
        angle: Math.PI,
        duration: 5
      };

      const segAngleUnset: ISegment = {
        length: null,
        angle: null,
        duration: 10
      };

      const angularSpeed1 = Track.calcPathAngularSpeedRadPerSec(segment, segAngleUnset);
      expect(angularSpeed1).toBeNull();

      const angularSpeed2 = Track.calcPathAngularSpeedRadPerSec(segAngleUnset, segment);
      expect(angularSpeed2).toBeNull();
    });

    it('should return the path rotation in radians per second between two segments', () => {
      const segI: ISegment = {
        length: null,
        angle: 0.25 * Math.PI,
        duration: 5
      };

      const segJ: ISegment = {
        length: null,
        angle: 0.75 * Math.PI,
        duration: 10
      };

      const angularSpeed = Track.calcPathAngularSpeedRadPerSec(segI, segJ);
      expect(angularSpeed - (0.5 * Math.PI / 15)).toBeLessThanOrEqual(0.001);
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
      // segment1 length = 24.9 m
      // segment1 duration = 20 sec
      // segment1 speed = 1.245 m/s = 2.78 mph
      // segment1 angle = 1.339 rad = 76.7 deg
      // segment1 direction = N, E

      const coord2 = new Coordinate(-8.957069, -77.777400);
      coord2.timeStamp = '2023-07-04T17:22:35Z';
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

      const coord3 = new Coordinate(-8.956936, -77.777381);
      coord3.timeStamp = '2023-07-04T17:22:46Z';
      // speed 3.0 mph
      // heading 8.2
      // avgSpeed = 1.297 m/s = 2.90 mph
      // segment3 length = 27.2 m
      // segment3 duration = 22 sec
      // segment3 speed = 1.237 m/s = 2.77 mph
      // segment3 angle = 0.815 rad = 46.7 deg
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
      expect(segments[1].duration - 11).toBeLessThanOrEqual(0.001);
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
      expect(coords[1].path.rotation - 0.092).toBeLessThanOrEqual(0.001);
      expect(coords[1].path.rotationRate - 0.09121).toBeLessThanOrEqual(0.00001);

      // Check start node
      expect(coords[0].speedAvg - 1.245).toBeLessThanOrEqual(0.001);
      expect(coords[0].path?.rotation).toBeNull();
      expect(coords[0].path?.rotationRate).toBeNull();

      // Check end node
      expect(coords[coords.length - 1].speedAvg - 1.237).toBeLessThanOrEqual(0.001);
      expect(coords[coords.length - 1].path?.rotation).toBeNull();
      expect(coords[coords.length - 1].path?.rotationRate).toBeNull();
    });
  });

  describe('#addElevations', () => {
    it('should do nothing for elevations of non-matching lat/long', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
      ];

      const track = new Track(coords);
      track.addProperties();

      const elevations: Map<string, number> = new Map();
      elevations.set(JSON.stringify({ lat: 1, lng: 2 }), 1000);
      elevations.set(JSON.stringify({ lat: 3, lng: 4 }), 2000);
      elevations.set(JSON.stringify({ lat: 5, lng: 6 }), 1500);
      elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);
      elevations.set(JSON.stringify({ lat: 9, lng: 10 }), 5000);

      track.addElevations(elevations);

      const trackCoords = track.coords();

      expect(trackCoords.length).toEqual(5);

      expect(trackCoords[0]).not.toHaveProperty('elevation');
      expect(trackCoords[1]).not.toHaveProperty('elevation');
      expect(trackCoords[2]).not.toHaveProperty('elevation');
      expect(trackCoords[3]).not.toHaveProperty('elevation');
      expect(trackCoords[4]).not.toHaveProperty('elevation');
    });

    it('should add elevation properties and derived data for matching lat/long', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'), // Intentional mismatch
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
        new Coordinate(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
      ];

      const track = new Track(coords);
      track.addProperties();

      const elevations: Map<string, number> = new Map();
      elevations.set(JSON.stringify({ lat: 39.74007868370209, lng: -105.0076261841355 }), 1000);
      elevations.set(JSON.stringify({ lat: 39.74005097339472, lng: -104.9998123858178 }), 2000);
      elevations.set(JSON.stringify({ lat: 39.73055300708892, lng: -104.9990802128465 }), 1500);
      elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);                                         // Intentional mismatch
      elevations.set(JSON.stringify({ lat: 39.73991441833991, lng: -104.9917491337653 }), 5000);
      elevations.set(JSON.stringify({ lat: 39.739914418342, lng: -104.99174913377 }), 4000);

      track.addElevations(elevations);

      const trackCoords = track.coords();
      const trackSegs = track.segments();

      expect(trackCoords.length).toEqual(6);
      expect(trackSegs.length).toEqual(5);

      expect(trackCoords[0]).toHaveProperty('elevation');
      expect(trackCoords[0].elevation).toEqual(1000);
      expect(trackCoords[0]).toHaveProperty('path');
      expect(trackCoords[0].path.ascentRate - 50).toBeLessThanOrEqual(0.1);
      expect(trackCoords[0].path.descentRate).toBeLessThanOrEqual(0.1);

      expect(trackSegs[0]).toHaveProperty('height');
      expect(trackSegs[0].height - 1000).toBeLessThanOrEqual(0.1);
      expect(trackSegs[0]).toHaveProperty('heightRate');
      expect(trackSegs[0].heightRate - 50).toBeLessThanOrEqual(0.1);

      expect(trackCoords[1]).toHaveProperty('elevation');
      expect(trackCoords[1].elevation).toEqual(2000);
      expect(trackCoords[1]).toHaveProperty('path');
      expect(trackCoords[1].path.ascentRate - 50).toBeLessThanOrEqual(0.1);
      expect(trackCoords[1].path.descentRate - 50).toBeLessThanOrEqual(0.1);

      expect(trackSegs[1]).toHaveProperty('height');
      expect(trackSegs[1].height + 500).toBeLessThanOrEqual(0.1);
      expect(trackSegs[1]).toHaveProperty('heightRate');
      expect(trackSegs[1].heightRate + 50).toBeLessThanOrEqual(0.1);

      expect(trackCoords[2]).toHaveProperty('elevation');
      expect(trackCoords[2].elevation).toEqual(1500);
      expect(trackCoords[2]).toHaveProperty('path');
      expect(trackCoords[2].path.ascentRate).toBeLessThanOrEqual(0.1);
      expect(trackCoords[2].path.descentRate - 50).toBeLessThanOrEqual(0.1);

      expect(trackSegs[2]).not.toHaveProperty('height');
      expect(trackSegs[2]).not.toHaveProperty('heightRate');

      expect(trackCoords[3]).not.toHaveProperty('elevation');
      expect(trackCoords[3].path.ascentRate).toBeLessThanOrEqual(0.1);
      expect(trackCoords[3].path.descentRate).toBeLessThanOrEqual(0.1);

      expect(trackSegs[3]).not.toHaveProperty('height');
      expect(trackSegs[3]).not.toHaveProperty('heightRate');

      expect(trackCoords[4]).toHaveProperty('elevation');
      expect(trackCoords[4].elevation).toEqual(5000);
      expect(trackCoords[4]).toHaveProperty('path');
      expect(trackCoords[4].path.ascentRate).toBeLessThanOrEqual(0.1);
      expect(trackCoords[4].path.descentRate - 50).toBeLessThanOrEqual(0.1);

      expect(trackSegs[4]).toHaveProperty('height');
      expect(trackSegs[4].height + 1000).toBeLessThanOrEqual(0.1);
      expect(trackSegs[4]).toHaveProperty('heightRate');
      expect(trackSegs[4].heightRate + 50).toBeLessThanOrEqual(0.1);

      expect(trackCoords[5]).toHaveProperty('elevation');
      expect(trackCoords[5].elevation).toEqual(4000);
      expect(trackCoords[5]).toHaveProperty('path');
      expect(trackCoords[5].path.ascentRate).toBeLessThanOrEqual(0.1);
      expect(trackCoords[5].path.descentRate - 50).toBeLessThanOrEqual(0.1);
    });
  });

  describe('#smoothBySpeed', () => {
    it('should do nothing to a track that has no speeds above the specified limit', () => {
      const coord1 = new Coordinate(-8.9448362309, -77.7124663163);
      coord1.timeStamp = '2023-07-04T20:50:08Z';
      // Speed (average): 1.55 m/s = 3.47 mph

      const coord2 = new Coordinate(-8.9447123464, -77.7121659927);
      coord2.timeStamp = '2023-07-04T20:50:31Z';
      // Speed (average): 1.393 m/s = 3.12 mph

      const coord3 = new Coordinate(-8.9446145296, -77.7118207421);
      coord3.timeStamp = '2023-07-04T20:51:03Z';
      // Speed (average): 1.258 m/s = 2.81 mph

      const coord4 = new Coordinate(-8.945042761, -77.7116469014);
      coord4.timeStamp = '2023-07-04T20:51:43Z';
      // Speed (average): 1.283 m/s = 2.87 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = new Track(coords);
      track.addProperties();

      const speedLimitMpS = 2.2352; // 5 mph
      const removedCoords = track.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(0);
      expect(track.coords().length).toEqual(4);
    });

    it('should remove the first coordinate from a track when it has speeds above the specified limit', () => {
      const coord1 = new Coordinate(-8.9448362309, -77.7124663163);
      coord1.timeStamp = '2023-07-04T20:50:08Z';
      // Speed (average): 3.575 m/s = 8.0 mph
      // Segment speed: 3.575 m/s = 8.0 mph

      const coord2 = new Coordinate(-8.9447123464, -77.7121659927);
      coord2.timeStamp = '2023-07-04T20:50:18Z';
      // Speed (average): 2.069 m/s = 4.6 mph
      // Segment speed: 0.564 m/s = 1.3 mph

      const coord3 = new Coordinate(-8.9446145296, -77.7118207421);
      coord3.timeStamp = '2023-07-04T20:51:28Z';
      // Speed (average): 1.137 m/s = 2.5 mph
      // Segment speed: 1.71 m/s = 3.8 mph

      const coord4 = new Coordinate(-8.945042761, -77.7116469014);
      coord4.timeStamp = '2023-07-04T20:51:58Z';
      // Speed (average): 1.710 m/s = 3.8 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = new Track(coords);
      track.addProperties();

      const speedLimitMpS = 2.2352; // 5 mph
      const removedCoords = track.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(1);
      expect(track.coords().length).toEqual(3);
    });

    it('should remove the last coordinate from a track when it has speeds above the specified limit', () => {
      const coord1 = new Coordinate(-8.9448362309, -77.7124663163);
      coord1.timeStamp = '2023-07-04T20:50:08Z';
      // Speed (average): 1.083 m/s = 2.4 mph
      // Segment speed:  m/s =  mph

      const coord2 = new Coordinate(-8.9447123464, -77.7121659927);
      coord2.timeStamp = '2023-07-04T20:50:41Z';
      // Speed (average): 0.870 m/s = 1.9 mph
      // Segment speed:  m/s =  mph

      const coord3 = new Coordinate(-8.9446145296, -77.7118207421);
      coord3.timeStamp = '2023-07-04T20:51:41Z';
      // Speed (average): 2.89 m/s = 6.46 mph
      // Segment speed:  m/s =  mph

      const coord4 = new Coordinate(-8.945042761, -77.7116469014);
      coord4.timeStamp = '2023-07-04T20:51:51Z';
      // Speed (average): 5.13 m/s = 11.5 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = new Track(coords);
      track.addProperties();

      const speedLimitMpS = 3.129; // 7 mph
      const removedCoords = track.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(1);
      expect(track.coords().length).toEqual(3);
    });

    it('should remove coordinates from a track that have speeds above the specified limit', () => {
      const coord1 = new Coordinate(-8.9448362309, -77.7124663163);
      coord1.timeStamp = '2023-07-04T20:49:58Z';
      // Speed (average): 1.787 m/s = 4.0 mph

      const coord2 = new Coordinate(-8.9447123464, -77.7121659927);
      coord2.timeStamp = '2023-07-04T20:50:18Z';
      // Speed (average): 3.086 m/s = 6.9 mph

      const coord3 = new Coordinate(-8.9446145296, -77.7118207421);
      coord3.timeStamp = '2023-07-04T20:50:27Z';
      // Speed (average): 2.474 m/s = 5.5 mph

      const coord4 = new Coordinate(-8.945042761, -77.7116469014);
      coord4.timeStamp = '2023-07-04T20:51:58Z';
      // Speed (average): 0.563 m/s = 1.26 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = new Track(coords);
      track.addProperties();

      const speedLimitMpS = 2.2352; // 5 mph
      const removedCoords = track.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(2);
      expect(track.coords().length).toEqual(2);
    });
  });

  describe('#smoothByAngularSpeed', () => {
    it('should remove coordinates from a track that have clockwise angular speeds above the specified limit', () => {
      const coord1 = new Coordinate(39.74007868370209, -105.0076261841355);
      coord1.timeStamp = '2023-07-04T20:00:00Z';

      const coord2 = new Coordinate(39.74005097339472, -104.9998123858178);
      coord2.timeStamp = '2023-07-04T20:07:20Z';

      const coord3 = new Coordinate(39.75260590879227, -104.9990802128465);
      coord3.timeStamp = '2023-07-04T20:07:30Z';

      const coord4 = new Coordinate(39.73993779411854, -104.9985377946692);
      coord4.timeStamp = '2023-07-04T20:07:40Z';

      const coord5 = new Coordinate(39.73991441833991, -104.9917491337653);
      coord5.timeStamp = '2023-07-04T20:15:00Z';

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5
      ];

      const track = new Track(coords);
      track.addProperties();

      const speedLimitRadpS = 0.1;
      const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

      expect(removedCoords).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it('should remove coordinates from a track that have counter-clockwise angular speeds above the specified limit', () => {
      const coord1 = new Coordinate(39.74007868370209, -105.0076261841355);
      coord1.timeStamp = '2023-07-04T20:00:00Z';

      const coord2 = new Coordinate(39.74005097339472, -104.9998123858178);
      coord2.timeStamp = '2023-07-04T20:07:20Z';

      const coord3 = new Coordinate(39.73055300708892, -104.9990802128465);
      coord3.timeStamp = '2023-07-04T20:07:30Z';

      const coord4 = new Coordinate(39.73993779411854, -104.9985377946692);
      coord4.timeStamp = '2023-07-04T20:07:40Z';

      const coord5 = new Coordinate(39.73991441833991, -104.9917491337653);
      coord5.timeStamp = '2023-07-04T20:15:00Z';

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5
      ];

      const track = new Track(coords);
      track.addProperties();

      const speedLimitRadpS = 0.1;
      const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

      expect(removedCoords).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });
  });

  describe('#smoothStationary', () => {
    it('should remove coordinates from a track that have a speeds below the specified limit', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T23:07:30Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T26:07:40Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T26:14:00Z')
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;
      const removedCoords = track.smoothStationary(minSpeedMS);

      expect(removedCoords).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it('should ??? coordinates from a track that do not have speed data', () => {
      // TODO: What should this behavior be or should it even be considered?
      //  A track with no speed data may just need it calculated or has no time stamps, in which case 'stationary' is not a valid criteria.
      //  A valid case would be a track with speeds where some points cannot have speed calculated (perhaps due to an error?).
      //    This seems unlikely to happen or would break things down earlier.
      //    More likely, removing points is unintended/out of order of operations.
      // This concern seems valid/solutions applicable in related cases, such as elevation change rates.
    });
  });

  describe('#smoothNoiseCloud', () => {
    it('should do nothing to a path with no noise clouds', () => {
      // Points are stationary by timestamps, but fall outside of the radius to be 'stationary' in a location based on min timestamp intervals
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      const smoothResults = track.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(0);
      expect(smoothResults.clouds).toEqual(0);
      expect(track.coords().length).toEqual(5);
    });

    it('should remove coordinates in a noise cloud at the beginning of the path, leaving an average pause/resume node in place', () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        // Begin noise cloud
        new Coordinate(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:00:10Z'),
        new Coordinate(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:20Z'),
        new Coordinate(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:40Z'),
        new Coordinate(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:50Z'),
        // End noise cloud
        new Coordinate(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:01:10Z'),
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary, results in 3.35 meters or less between points
      const minSpeedMS = 0.11176;

      const smoothResults = track.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(6);
      expect(smoothResults.clouds).toEqual(1);

      const resultCoords = track.coords();
      expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed resume)

      // Presumed resume node
      expect(resultCoords[0].lat).toEqual(39.87825420255762);
      expect(resultCoords[0].lng).toEqual(-105.13560669104396);
      expect(resultCoords[0].timeStamp).toEqual('2023-07-04T20:00:50Z');
    });

    it('should remove coordinates in a noise cloud at the end of the path, leaving an average pause/resume node in place', () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        new Coordinate(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:00:10Z'),
        // Begin noise cloud
        new Coordinate(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:20Z'),
        new Coordinate(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:40Z'),
        new Coordinate(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:50Z'),
        new Coordinate(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:01:10Z'),
        // End noise cloud
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      const smoothResults = track.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(6);
      expect(smoothResults.clouds).toEqual(1);

      const resultCoords = track.coords();
      expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed pause)

      // Presumed pause node
      expect(resultCoords[2].lat).toEqual(39.87825420255762);
      expect(resultCoords[2].lng).toEqual(-105.13560669104396);
      expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');
    });

    it('should remove nodes in a noise cloud in the middle of the path, leaving an average pause/resume node in place', () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        new Coordinate(39.87823888190675, -105.1357900558201, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.87822589268432, -105.1357027717129, 0, '2023-07-04T20:00:10Z'),
        // Begin noise cloud
        new Coordinate(39.87821721769159, -105.1356040418078, 0, '2023-07-04T20:00:20Z'),
        new Coordinate(39.87823050857553, -105.1355974665931, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.878236962082, -105.1356171532047, 0, '2023-07-04T20:00:40Z'),
        new Coordinate(39.87822657116678, -105.1356188651574, 0, '2023-07-04T20:00:50Z'),
        new Coordinate(39.87821596033782, -105.1355800846031, 0, '2023-07-04T20:01:00Z'),
        // End noise cloud
        new Coordinate(39.87822512731312, -105.1355053510283, 0, '2023-07-04T20:01:10Z'),
        new Coordinate(39.87821988064638, -105.1353883040605, 0, '2023-07-04T20:01:20Z'),
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      const smoothResults = track.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(5);
      expect(smoothResults.clouds).toEqual(1);

      const resultCoords = track.coords();
      expect(resultCoords.length).toEqual(6);   // 4 original nodes + 2 avg nodes (1 presumed pause, 1 presumed resume)

      // Pause & resume nodes
      expect(resultCoords[2].lat).toEqual(39.87822544397074);
      expect(resultCoords[2].lng).toEqual(-105.13560352227323);
      expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');

      expect(resultCoords[3].lat).toEqual(resultCoords[2].lat);
      expect(resultCoords[3].lng).toEqual(resultCoords[2].lng);
      expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:00Z');
    });

    it(`should remove nodes in multiple overlapping noise clouds in the middle of the path,
      leaving an average pause/resume node in place`, () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        new Coordinate(39.87825432484495, -105.1353814910402, 0, '2023-07-04T20:00:00Z'),
        // Begin noise cloud #1
        new Coordinate(39.87824052403623, -105.1352618135007, 0, '2023-07-04T20:00:10Z'),
        new Coordinate(39.8782522989425, -105.1352433936513, 0, '2023-07-04T20:00:20Z'),
        new Coordinate(39.87825750947018, -105.1352618278019, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.87824948371056, -105.1352684908337, 0, '2023-07-04T20:00:40Z'),
        new Coordinate(39.87823201248165, -105.135242862249, 0, '2023-07-04T20:00:50Z'),
        new Coordinate(39.87823014730432, -105.1352631715043, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.87824285433322, -105.135233590465, 0, '2023-07-04T20:01:10Z'),
        // End noise cloud #1
        // Begin noise cloud #2
        new Coordinate(39.87823856216351, -105.1351918088743, 0, '2023-07-04T20:01:20Z'),
        new Coordinate(39.87824751183506, -105.1351733485622, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.87825320422211, -105.1351936504459, 0, '2023-07-04T20:01:40Z'),
        new Coordinate(39.87823291651964, -105.1352084650403, 0, '2023-07-04T20:01:50Z'),
        new Coordinate(39.87821729634359, -105.1351968777954, 0, '2023-07-04T20:02:00Z'),
        new Coordinate(39.87825197840353, -105.1351988205849, 0, '2023-07-04T20:02:10Z'),
        new Coordinate(39.87823106932006, -105.1351756495897, 0, '2023-07-04T20:02:20Z'),
        // End noise cloud #2
        new Coordinate(39.87823847144207, -105.1351062708185, 0, '2023-07-04T20:02:30Z'),
        new Coordinate(39.87823789587544, -105.1350151021305, 0, '2023-07-04T20:02:40Z'),
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;

      const smoothResults = track.smoothNoiseClouds(minSpeedMS, true);

      expect(smoothResults.nodes).toEqual(14);
      expect(smoothResults.clouds).toEqual(2);

      const resultCoords = track.coords();
      expect(resultCoords.length).toEqual(7); // 3 original nodes + 2x2 avg nodes (1 presumed pause, 1 presumed resume, for each cloud)

      // Cloud 1 pause & resume nodes
      expect(resultCoords[1].lat).toEqual(39.87824354718266);
      expect(resultCoords[1].lng).toEqual(-105.13525359285799);
      expect(resultCoords[1].timeStamp).toEqual('2023-07-04T20:00:10Z');

      expect(resultCoords[2].lat).toEqual(resultCoords[1].lat);
      expect(resultCoords[2].lng).toEqual(resultCoords[1].lng);
      expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:01:10Z');

      // Cloud 2 pause & resume nodes
      expect(resultCoords[3].lat).toEqual(39.87823893411536);
      expect(resultCoords[3].lng).toEqual(-105.13519123155609);
      expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:20Z');

      expect(resultCoords[4].lat).toEqual(resultCoords[3].lat);
      expect(resultCoords[4].lng).toEqual(resultCoords[3].lng);
      expect(resultCoords[4].timeStamp).toEqual('2023-07-04T20:02:20Z');
    });
  });

  describe('#smoothByElevationSpeed', () => {
    it('should do nothing for coordinates with no DEM elevation', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
      ];

      const track = new Track(coords);
      track.addProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(0);
      expect(track.coords().length).toEqual(5);
    });

    it('should do nothing for coordinates with elevation changes below the specified limit', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1000; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1005; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1010;  // 0 m/s // TODO: separate concerns of loss/gain? This is actually 5m up, 5m down over 30 sec ~ 5m/15sec = 0.3 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1005; // -0.16667 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[4].elevation = 1000; // -0.16667 m/s

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(0);
      expect(track.coords().length).toEqual(5);
    });

    it('should remove points that have an elevation gain speed above the specified limit', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1000; // 0.3333 m/s // Remove
      // Seg: 10m/30sec = 0.3333m/s
      coords[1].elevation = 1010; // 0.25 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1015; // 0.0 m/s     // TODO: Fix
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1010; // 0.16667 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[4].elevation = 1005; // 0.16667 m/s

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it(`should remove points that have an elevation loss speed above the general specified
      limit if no loss limit is specified`, () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1005; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1010; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1015; // 0.0 m/s    // TODO: Fix
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1010; // -0.25 m/s
      // Seg: -10m/30sec = -0.3333/s
      coords[4].elevation = 1000; // -0.3333 m/s  // Remove

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it('should remove points that have an elevation loss speed above the specified limit for loss', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1015; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1020; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1025; // 0.0 m/s    // TODO: Fix
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1020; // -0.4167 m/s
      // Seg: -20m/30sec = -0.6667/s
      coords[4].elevation = 1000; // -0.6667 m/s  // Remove

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it('should remove maxima/minima where one adjacent segment has an elevation gain speed above the specified limit', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1015; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1020; // 0.25 m/s
      // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
      coords[2].elevation = 1030;
      // Seg: -10m/30sec = -0.33333m/s
      coords[3].elevation = 1020; // -0.25 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[4].elevation = 1015; // -0.16667 m/s

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it('should remove maxima/minima where one adjacent segment has an elevation loss speed above the specified limit', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1020; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1025; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1030;
      // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
      coords[3].elevation = 1010; // -0.4167 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[4].elevation = 1000; // 0.16667 m/s

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });

    it('should remove maxima/minima where each adjacent segment has an elevation speed above the corresponding specified limit', () => {
      const coords = [
        new Coordinate(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new Coordinate(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new Coordinate(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new Coordinate(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new Coordinate(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1015; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1020; // 0.25 m/s
      // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
      coords[2].elevation = 1030;
      // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
      coords[3].elevation = 1010; // -0.4167 m/s
      // Seg: -5m/30sec = 0.16667m/s
      coords[4].elevation = 1000; // 0.16667 m/s

      const track = new Track(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

      const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.coords().length).toEqual(4);
    });
  });
});