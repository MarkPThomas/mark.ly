import { Segment, ISegment, ISegmentProperties } from './Segment';

describe('##Segment', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize a new Segment instance with no properties', () => {
        const segment = new Segment();

        expect(segment.length).toBeUndefined();
        expect(segment.angle).toBeUndefined();
      });

      it('should initialize a new Segment instance with the specified properties', () => {
        const length = 15;
        const angle = 45;
        const segment = new Segment(length, angle);

        expect(segment.length).toEqual(length);
        expect(segment.angle).toEqual(angle);
      });
    });

    // describe('#fromVertices', () => {
    //   it('should ', () => {

    //   });
    // });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Segment', () => {
        const length = 15;
        const angle = 45;
        const segment = new Segment(length, angle);

        const segmentClone = segment.clone();

        expect(segment.equals(segmentClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Segments with differing properties', () => {
        const length1 = 15;
        const angle1 = 45;
        const segment1 = new Segment(length1, angle1);

        const length2 = 20;
        const angle2 = 50;
        const segment2 = new Segment(length2, angle2);

        const result = segment1.equals(segment2);

        expect(result).toBeFalsy();
      });


      it('should return True for Segments with identical properties', () => {
        const length = 15;
        const angle = 45;
        const segment1 = new Segment(length, angle);
        const segment2 = new Segment(length, angle);

        const result = segment1.equals(segment2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Static Calc Methods', () => {
    describe('#calcPathRotationRads', () => {
      it('should return null if either angle is not set', () => {
        const segment: ISegmentProperties = {
          length: null,
          angle: 0.785
        };

        const segAngleUnset: ISegment = new Segment();

        const interval = Segment.calcPathRotationRad(segment, segAngleUnset);

        expect(interval).toBeNull();
      });

      it('should return the angle of rotation from the first segment to the second segment', () => {
        const segIQuad1: ISegmentProperties = {
          length: null,
          angle: 0.25 * Math.PI
        };
        const segJQuad1: ISegmentProperties = {
          length: null,
          angle: 0.25 * Math.PI + 0.1 * Math.PI
        };


        const segIQuad2: ISegmentProperties = {
          length: null,
          angle: 0.75 * Math.PI
        };
        const segJQuad2: ISegmentProperties = {
          length: null,
          angle: 0.75 * Math.PI + 0.1 * Math.PI
        };

        const segIQuad3: ISegmentProperties = {
          length: null,
          angle: -0.75 * Math.PI
        };
        const segJQuad3: ISegmentProperties = {
          length: null,
          angle: -0.75 * Math.PI + 0.1 * Math.PI
        };

        const segIQuad4: ISegmentProperties = {
          length: null,
          angle: -0.25 * Math.PI
        };
        const segJQuad4: ISegmentProperties = {
          length: null,
          angle: -0.25 * Math.PI + 0.1 * Math.PI
        };

        // Check each small rotation within the same quadrant
        const rotationQuad1Quad1 = Segment.calcPathRotationRad(segIQuad1, segJQuad1);
        expect(rotationQuad1Quad1 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad2 = Segment.calcPathRotationRad(segIQuad2, segJQuad2);
        expect(rotationQuad2Quad2 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad3Quad3 = Segment.calcPathRotationRad(segIQuad3, segJQuad3);
        expect(rotationQuad3Quad3 - 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad4Quad4 = Segment.calcPathRotationRad(segIQuad4, segJQuad4);
        expect(rotationQuad4Quad4 - 0.314).toBeLessThanOrEqual(0.001);

        // Check each small rotation in the opposite direction within the same quadrant
        const rotationQuad1Quad1Reverse = Segment.calcPathRotationRad(segJQuad1, segIQuad1);
        expect(rotationQuad1Quad1Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad2Reverse = Segment.calcPathRotationRad(segJQuad2, segIQuad2);
        expect(rotationQuad2Quad2Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad3Quad3Reverse = Segment.calcPathRotationRad(segJQuad3, segIQuad3);
        expect(rotationQuad3Quad3Reverse + 0.314).toBeLessThanOrEqual(0.001);

        const rotationQuad4Quad4Reverse = Segment.calcPathRotationRad(segJQuad4, segIQuad4);
        expect(rotationQuad4Quad4Reverse + 0.314).toBeLessThanOrEqual(0.001);


        // Check each larger rotation between quadrants
        const rotationQuad1Quad2 = Segment.calcPathRotationRad(segIQuad1, segIQuad2);
        expect(rotationQuad1Quad2 - 1.571).toBeLessThanOrEqual(0.001);

        const rotationQuad2Quad3 = Segment.calcPathRotationRad(segIQuad1, segIQuad3);
        expect(rotationQuad2Quad3 + 3.142).toBeLessThanOrEqual(0.001); // + 1.571

        const rotationQuad3Quad4 = Segment.calcPathRotationRad(segIQuad1, segIQuad4);
        expect(rotationQuad3Quad4 + 1.571).toBeLessThanOrEqual(0.001);  // + 3.142
      });
    });
  });
});