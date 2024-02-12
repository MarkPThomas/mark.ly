import { IDirection } from '../Direction';
import { RoutePoint } from './RoutePoint';
import { RouteSegment, IRouteSegmentProperties, IRouteSegment } from './RouteSegment';

describe('##TrackSegment', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize a new Segment instance with no properties', () => {
        const segment = new RouteSegment();

        expect(segment.length).toBeUndefined();
        expect(segment.angle).toBeUndefined();

        expect(segment.direction).toBeUndefined();
        expect(segment.height).toBeUndefined();
      });

      it('should initialize a new Segment instance with the specified properties', () => {
        const length = 15;
        const angle = 45;
        const direction: IDirection = {
          lat: 'N',
          lng: 'E'
        };
        const height = 100;

        const segment = new RouteSegment(length, angle, direction, height);

        expect(segment.length).toEqual(length);
        expect(segment.angle).toEqual(angle);

        expect(segment.direction).toEqual(direction);
        expect(segment.height).toEqual(height);
      });
    });

    describe('#fromRoutePoints', () => {
      it('should initialze a new Segment with properties derived from the Point', () => {
        const ptI = new RoutePoint(-8.957287, -77.777452, 100);
        // heading 48.3
        // segment1 length = 24.9 m
        // segment1 angle = 1.339 rad = 76.7 deg
        // segment1 direction = N, E

        const ptJ = new RoutePoint(-8.957069, -77.777400, 200);

        const segment = RouteSegment.fromRoutePoints(ptI, ptJ);

        expect(segment.length).toBeCloseTo(24.9, 1);
        expect(segment.angle).toBeCloseTo(1.339, 3);

        expect(segment.direction).toEqual({
          lat: 'N',
          lng: 'E'
        });
        expect(segment.height).toBeCloseTo(100, 0);
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
        const segment = new RouteSegment(length, angle, direction, height);

        const segmentClone = segment.clone();

        expect(segment.equals(segmentClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Segments with differing properties', () => {
        const length = 15;
        const angle = 45;

        const direction1: IDirection = {
          lat: 'N',
          lng: 'E'
        };
        const height1 = 100;
        const segment1 = new RouteSegment(length, angle, direction1, height1);

        const direction2: IDirection = {
          lat: 'S',
          lng: 'W'
        };
        const height2 = 200;
        const segment2 = new RouteSegment(length, angle, direction2, height2);

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
        const segment1 = new RouteSegment(length, angle, direction, height);
        const segment2 = new RouteSegment(length, angle, direction, height);

        const result = segment1.equals(segment2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Adding Data', () => {
    describe('#addSegmentProperties', () => {
      it('should add length, angle & direction properties derived from the adjacent Points', () => {
        const coord1 = new RoutePoint(-8.957287, -77.777452);
        const coord2 = new RoutePoint(-8.957069, -77.777400);

        const segment = new RouteSegment();

        segment.addSegmentProperties(coord1, coord2);

        expect(segment.length).toBeCloseTo(24.9, 1);
        expect(segment.angle).toBeCloseTo(1.339, 3);

        expect(segment.direction).toEqual({
          lat: 'N',
          lng: 'E'
        });
        expect(segment.height).toBeUndefined();
      });

      it('should add height properties from the adjacent Points if they contain measured altitudes', () => {
        const coord1 = new RoutePoint(-8.957287, -77.777452, 100);
        const coord2 = new RoutePoint(-8.957069, -77.777400, 200);
        const segment = new RouteSegment();

        segment.addSegmentProperties(coord1, coord2);

        expect(segment.height).toBeCloseTo(100, 0);
      });
    });

    describe('#addElevationData', () => {
      it('should add height properties from the adjacent Points if they contain mapped elevations', () => {
        const coord1 = new RoutePoint(-8.957287, -77.777452);
        const coord2 = new RoutePoint(-8.957069, -77.777400);
        const segment = new RouteSegment();

        segment.addSegmentProperties(coord1, coord2);
        expect(segment.height).toBeUndefined();

        coord1.elevation = 200;
        coord2.elevation = 500;
        segment.addElevationData(coord1, coord2);

        expect(segment.height).toBeCloseTo(300, 0);
      });

      it('should replace height properties from measured altitudes if the Points also contain mapped elevations', () => {
        const coord1 = new RoutePoint(-8.957287, -77.777452, 100);
        const coord2 = new RoutePoint(-8.957069, -77.777400, 200);
        const segment = new RouteSegment();

        segment.addSegmentProperties(coord1, coord2);

        expect(segment.height).toBeCloseTo(100, 0);

        coord1.elevation = 200;
        coord2.elevation = 500;
        segment.addElevationData(coord1, coord2);

        expect(segment.height).toBeCloseTo(300, 0);
      });
    });
  });


  describe('Static Calc Methods', () => {
    describe('#calcPathRotationRads', () => {
      it('should return null if either angle is not set', () => {
        const segment: IRouteSegmentProperties = {
          length: null,
          angle: 0.785
        };

        const segAngleUnset: IRouteSegment = new RouteSegment();

        const interval = RouteSegment.calcPathRotationRad(segment, segAngleUnset);

        expect(interval).toBeNull();
      });

      it('should return the angle of rotation from the first segment to the second segment', () => {
        const segIQuad1: IRouteSegmentProperties = {
          length: null,
          angle: 0.25 * Math.PI
        };
        const segJQuad1: IRouteSegmentProperties = {
          length: null,
          angle: 0.25 * Math.PI + 0.1 * Math.PI
        };


        const segIQuad2: IRouteSegmentProperties = {
          length: null,
          angle: 0.75 * Math.PI
        };
        const segJQuad2: IRouteSegmentProperties = {
          length: null,
          angle: 0.75 * Math.PI + 0.1 * Math.PI
        };

        const segIQuad3: IRouteSegmentProperties = {
          length: null,
          angle: -0.75 * Math.PI
        };
        const segJQuad3: IRouteSegmentProperties = {
          length: null,
          angle: -0.75 * Math.PI + 0.1 * Math.PI
        };

        const segIQuad4: IRouteSegmentProperties = {
          length: null,
          angle: -0.25 * Math.PI
        };
        const segJQuad4: IRouteSegmentProperties = {
          length: null,
          angle: -0.25 * Math.PI + 0.1 * Math.PI
        };

        // Check each small rotation within the same quadrant
        const rotationQuad1Quad1 = RouteSegment.calcPathRotationRad(segIQuad1, segJQuad1);
        expect(rotationQuad1Quad1 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad2 = RouteSegment.calcPathRotationRad(segIQuad2, segJQuad2);
        expect(rotationQuad2Quad2 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad3Quad3 = RouteSegment.calcPathRotationRad(segIQuad3, segJQuad3);
        expect(rotationQuad3Quad3 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad4Quad4 = RouteSegment.calcPathRotationRad(segIQuad4, segJQuad4);
        expect(rotationQuad4Quad4 - 0.314).toBeLessThanOrEqual(0.001);

        // Check each small rotation in the opposite direction within the same quadrant
        const rotationQuad1Quad1Reverse = RouteSegment.calcPathRotationRad(segJQuad1, segIQuad1);
        expect(rotationQuad1Quad1Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad2Reverse = RouteSegment.calcPathRotationRad(segJQuad2, segIQuad2);
        expect(rotationQuad2Quad2Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad3Quad3Reverse = RouteSegment.calcPathRotationRad(segJQuad3, segIQuad3);
        expect(rotationQuad3Quad3Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad4Quad4Reverse = RouteSegment.calcPathRotationRad(segJQuad4, segIQuad4);
        expect(rotationQuad4Quad4Reverse + 0.314).toBeLessThanOrEqual(0.001);


        // Check each larger rotation between quadrants
        const rotationQuad1Quad2 = RouteSegment.calcPathRotationRad(segIQuad1, segIQuad2);
        expect(rotationQuad1Quad2 - 1.571).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad3 = RouteSegment.calcPathRotationRad(segIQuad1, segIQuad3);
        expect(rotationQuad2Quad3 + 3.142).toBeLessThanOrEqual(0.001); // + 1.571

        const rotationQuad3Quad4 = RouteSegment.calcPathRotationRad(segIQuad1, segIQuad4);
        expect(rotationQuad3Quad4 + 1.571).toBeLessThanOrEqual(0.001);  // + 3.142
      });
    });
  });
});
