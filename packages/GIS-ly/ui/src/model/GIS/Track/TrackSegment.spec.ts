import { TrackSegment, ITrackSegment } from './TrackSegment';

describe('##TrackSegment', () => {
  describe('Static Methods', () => {
    describe('#calcPathRotationRads', () => {
      it('should return null if either angle is not set', () => {
        const segment: ITrackSegment = {
          length: null,
          angle: 0.785
        };

        const segAngleUnset: ITrackSegment = new TrackSegment();

        const interval = TrackSegment.calcPathRotationRad(segment, segAngleUnset);

        expect(interval).toBeNull();
      });

      it('should return the angle of rotation from the first segment to the second segment', () => {
        const segIQuad1: ITrackSegment = {
          length: null,
          angle: 0.25 * Math.PI
        };
        const segJQuad1: ITrackSegment = {
          length: null,
          angle: 0.25 * Math.PI + 0.1 * Math.PI
        };


        const segIQuad2: ITrackSegment = {
          length: null,
          angle: 0.75 * Math.PI
        };
        const segJQuad2: ITrackSegment = {
          length: null,
          angle: 0.75 * Math.PI + 0.1 * Math.PI
        };

        const segIQuad3: ITrackSegment = {
          length: null,
          angle: -0.75 * Math.PI
        };
        const segJQuad3: ITrackSegment = {
          length: null,
          angle: -0.75 * Math.PI + 0.1 * Math.PI
        };

        const segIQuad4: ITrackSegment = {
          length: null,
          angle: -0.25 * Math.PI
        };
        const segJQuad4: ITrackSegment = {
          length: null,
          angle: -0.25 * Math.PI + 0.1 * Math.PI
        };

        // Check each small rotation within the same quadrant
        const rotationQuad1Quad1 = TrackSegment.calcPathRotationRad(segIQuad1, segJQuad1);
        expect(rotationQuad1Quad1 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad2 = TrackSegment.calcPathRotationRad(segIQuad2, segJQuad2);
        expect(rotationQuad2Quad2 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad3Quad3 = TrackSegment.calcPathRotationRad(segIQuad3, segJQuad3);
        expect(rotationQuad3Quad3 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad4Quad4 = TrackSegment.calcPathRotationRad(segIQuad4, segJQuad4);
        expect(rotationQuad4Quad4 - 0.314).toBeLessThanOrEqual(0.001);

        // Check each small rotation in the opposite direction within the same quadrant
        const rotationQuad1Quad1Reverse = TrackSegment.calcPathRotationRad(segJQuad1, segIQuad1);
        expect(rotationQuad1Quad1Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad2Reverse = TrackSegment.calcPathRotationRad(segJQuad2, segIQuad2);
        expect(rotationQuad2Quad2Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad3Quad3Reverse = TrackSegment.calcPathRotationRad(segJQuad3, segIQuad3);
        expect(rotationQuad3Quad3Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad4Quad4Reverse = TrackSegment.calcPathRotationRad(segJQuad4, segIQuad4);
        expect(rotationQuad4Quad4Reverse + 0.314).toBeLessThanOrEqual(0.001);


        // Check each larger rotation between quadrants
        const rotationQuad1Quad2 = TrackSegment.calcPathRotationRad(segIQuad1, segIQuad2);
        expect(rotationQuad1Quad2 - 1.571).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad3 = TrackSegment.calcPathRotationRad(segIQuad1, segIQuad3);
        expect(rotationQuad2Quad3 + 3.142).toBeLessThanOrEqual(0.001); // + 1.571

        const rotationQuad3Quad4 = TrackSegment.calcPathRotationRad(segIQuad1, segIQuad4);
        expect(rotationQuad3Quad4 + 1.571).toBeLessThanOrEqual(0.001);  // + 3.142
      });
    });

    describe('#calcCoordAvgSpeedMPS', () => {
      it('should return undefined if both segments are missing speed properties', () => {
        const prevSegment = new TrackSegment();
        const nextSegment = new TrackSegment();

        const avgSpeed = TrackSegment.calcCoordAvgSpeedMPS(prevSegment, nextSegment);

        expect(avgSpeed).toBeUndefined();
      });

      it('should return undefined if both segments have 0 speed', () => {
        const prevSegment = new TrackSegment();
        prevSegment.speed = 0;

        const nextSegment = new TrackSegment();
        nextSegment.speed = 0;

        const avgSpeed = TrackSegment.calcCoordAvgSpeedMPS(prevSegment, nextSegment);

        expect(avgSpeed).toBeUndefined();
      });

      it('should return moving segment speed if one segment has 0 speed', () => {
        const segment = new TrackSegment();
        segment.speed = 5;

        const segmentStationary = new TrackSegment();
        segmentStationary.speed = 0;

        const avgSpeed1 = TrackSegment.calcCoordAvgSpeedMPS(segmentStationary, segment);
        expect(avgSpeed1).toEqual(5);

        const avgSpeed2 = TrackSegment.calcCoordAvgSpeedMPS(segment, segmentStationary);
        expect(avgSpeed2).toEqual(5);
      });

      it('should return the first segment speed for the first coordinate in a track', () => {
        const nextSegment = new TrackSegment();
        nextSegment.speed = 5;

        const avgSpeed = TrackSegment.calcCoordAvgSpeedMPS(null, nextSegment);

        expect(avgSpeed).toEqual(5);
      });

      it('should return the last segment speed for the last coordinate in a track', () => {
        const prevSegment = new TrackSegment();
        prevSegment.speed = 5;

        const avgSpeed = TrackSegment.calcCoordAvgSpeedMPS(prevSegment, null);

        expect(avgSpeed).toEqual(5);
      });

      it('should return the average speed of two segments that meet at the same coordinate', () => {
        const prevSegment = new TrackSegment();
        prevSegment.speed = 5;

        const nextSegment = new TrackSegment();
        nextSegment.speed = 10;

        const avgSpeed = TrackSegment.calcCoordAvgSpeedMPS(prevSegment, nextSegment);

        expect(avgSpeed).toEqual(7.5);
      });
    });


    describe('#calcPathAngularSpeedRadPerSec', () => {
      it('should return null if either segment lacks duration properties', () => {
        const segment: ITrackSegment = {
          length: null,
          angle: null,
          duration: 5
        };

        const segNoDuration: ITrackSegment = {
          length: null,
          angle: null,
        };

        const angularSpeed1 = TrackSegment.calcPathAngularSpeedRadPerSec(segment, segNoDuration);
        expect(angularSpeed1).toBeNull();

        const angularSpeed2 = TrackSegment.calcPathAngularSpeedRadPerSec(segNoDuration, segment);
        expect(angularSpeed2).toBeNull();
      });

      it('should return null if either segment has an unset angle', () => {
        const segment: ITrackSegment = {
          length: null,
          angle: Math.PI,
          duration: 5
        };

        const segAngleUnset: ITrackSegment = {
          length: null,
          angle: null,
          duration: 10
        };

        const angularSpeed1 = TrackSegment.calcPathAngularSpeedRadPerSec(segment, segAngleUnset);
        expect(angularSpeed1).toBeNull();

        const angularSpeed2 = TrackSegment.calcPathAngularSpeedRadPerSec(segAngleUnset, segment);
        expect(angularSpeed2).toBeNull();
      });

      it('should return the path rotation in radians per second between two segments', () => {
        const segI: ITrackSegment = {
          length: null,
          angle: 0.25 * Math.PI,
          duration: 5
        };

        const segJ: ITrackSegment = {
          length: null,
          angle: 0.75 * Math.PI,
          duration: 10
        };

        const angularSpeed = TrackSegment.calcPathAngularSpeedRadPerSec(segI, segJ);
        expect(angularSpeed - (0.5 * Math.PI / 15)).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcCoordAvgElevationSpeedMPS', () => {
      it('should return undefined if both segments are missing elevation speed properties', () => {
        const prevSegment = new TrackSegment();
        const nextSegment = new TrackSegment();

        const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(prevSegment, nextSegment);

        expect(elevationSpeed).toBeUndefined();
      });

      it('should return moving segment elevation speed if one segment is missing elevation speed properties', () => {
        const segment = new TrackSegment();
        segment.heightRate = 5;

        const segmentMissingProps = new TrackSegment();

        const elevationSpeed1 = TrackSegment.calcCoordAvgElevationSpeedMPS(segmentMissingProps, segment);
        expect(elevationSpeed1).toEqual(5);

        const elevationSpeed2 = TrackSegment.calcCoordAvgElevationSpeedMPS(segment, segmentMissingProps);
        expect(elevationSpeed2).toEqual(5);
      });

      it('should return 0 if both segments have 0 elevation speed', () => {
        const prevSegment = new TrackSegment();
        prevSegment.heightRate = 0;

        const nextSegment = new TrackSegment();
        nextSegment.heightRate = 0;

        const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(prevSegment, nextSegment);

        expect(elevationSpeed).toEqual(0);
      });

      it('should return average segment elevation speed if one segment has 0 elevation speed', () => {
        const segment = new TrackSegment();
        segment.heightRate = 5;

        const segmentStationary = new TrackSegment();
        segmentStationary.heightRate = 0;

        const elevationSpeed1 = TrackSegment.calcCoordAvgElevationSpeedMPS(segmentStationary, segment);
        expect(elevationSpeed1).toEqual(2.5);

        const elevationSpeed2 = TrackSegment.calcCoordAvgElevationSpeedMPS(segment, segmentStationary);
        expect(elevationSpeed2).toEqual(2.5);
      });

      it('should return the first segment elevation speed for the first coordinate in a track', () => {
        const nextSegment = new TrackSegment();
        nextSegment.heightRate = 5;

        const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(null, nextSegment);

        expect(elevationSpeed).toEqual(5);
      });

      it('should return the last segment elevation speed for the last coordinate in a track', () => {
        const prevSegment = new TrackSegment();
        prevSegment.heightRate = 5;

        const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(prevSegment, null);

        expect(elevationSpeed).toEqual(5);
      });

      it('should return the average elevation speed of two segments that meet at the same coordinate', () => {
        const prevSegment = new TrackSegment();
        prevSegment.heightRate = 5;

        const nextSegment = new TrackSegment();
        nextSegment.heightRate = 10;

        const elevationSpeed = TrackSegment.calcCoordAvgElevationSpeedMPS(prevSegment, nextSegment);

        expect(elevationSpeed).toEqual(7.5);
      });
    });
  });
});
