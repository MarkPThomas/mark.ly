import { Segment } from './Segment';

describe('##Segment', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize a new Segment instance with no properties', () => {
        const segment = new Segment();

        expect(segment.length).toBeUndefined();
      });

      it('should initialize a new Segment instance with the specified properties', () => {
        const length = 15;
        const segment = new Segment(length);

        expect(segment.length).toEqual(length);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Segment', () => {
        const length = 15;
        const segment = new Segment(length);

        const segmentClone = segment.clone();

        expect(segment.equals(segmentClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Segments with differing properties', () => {
        const length1 = 15;
        const segment1 = new Segment(length1);

        const length2 = 20;
        const segment2 = new Segment(length2);

        const result = segment1.equals(segment2);

        expect(result).toBeFalsy();
      });


      it('should return True for Segments with identical properties', () => {
        const length = 15;
        const segment1 = new Segment(length);
        const segment2 = new Segment(length);

        const result = segment1.equals(segment2);

        expect(result).toBeTruthy();
      });
    });
  });
});