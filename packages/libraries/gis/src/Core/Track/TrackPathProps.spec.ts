import { TrackPathProps, } from './TrackPathProps';
import { ITrackSegmentProperties } from './TrackSegment';

describe('##TrackPathProps', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize an empty object', () => {
        const pathProps = new TrackPathProps();

        expect(pathProps.rotation).toBeNull();
        expect(pathProps.speed).toEqual(0);
        expect(pathProps.rotationRate).toBeNull();
        expect(pathProps.ascentRate).toEqual(0);
        expect(pathProps.descentRate).toEqual(0);
      });

      it('should initialize an object with the specified properties', () => {
        const rotation = 5;

        const speed = 10;
        const rotationRate = 15;
        const ascentRate = 20;
        const descentRate = 25;

        const pathProps = new TrackPathProps(rotation, speed, rotationRate, ascentRate, descentRate);

        expect(pathProps.rotation).toEqual(rotation);
        expect(pathProps.speed).toEqual(speed);
        expect(pathProps.rotationRate).toEqual(rotationRate);
        expect(pathProps.ascentRate).toEqual(ascentRate);
        expect(pathProps.descentRate).toEqual(descentRate);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Path props', () => {
        const rotation = 5;

        const speed = 10;
        const rotationRate = 15;
        const ascentRate = 20;
        const descentRate = 25;

        const pathProps = new TrackPathProps(rotation, speed, rotationRate, ascentRate, descentRate);


        const pathPropsClone = pathProps.clone();

        expect(pathProps.equals(pathPropsClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Path props with differing properties', () => {
        const rotation = 5;

        const speed1 = 10;
        const rotationRate1 = 15;
        const ascentRate1 = 20;
        const descentRate1 = 25;

        const pathProps1 = new TrackPathProps(rotation, speed1, rotationRate1, ascentRate1, descentRate1);

        const speed2 = 11;
        const rotationRate2 = 16;
        const ascentRate2 = 21;
        const descentRate2 = 26;

        const pathProps2 = new TrackPathProps(rotation, speed2, rotationRate2, ascentRate2, descentRate2);

        const result = pathProps1.equals(pathProps2);

        expect(result).toBeFalsy();
      });

      it('should return True for Path props with identical properties', () => {
        const rotation = 5;

        const speed = 10;
        const rotationRate = 15;
        const ascentRate = 20;
        const descentRate = 25;

        const pathProps1 = new TrackPathProps(rotation, speed, rotationRate, ascentRate, descentRate);
        const pathProps2 = new TrackPathProps(rotation, speed, rotationRate, ascentRate, descentRate);

        const result = pathProps1.equals(pathProps2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Add Data Methods', () => {
    describe('#addPropertiesFromPath', () => {
      it('should determine the path rotation and average speed about a Point, and rotation rate, from the adjacent Segments', () => {
        const prevSegment: ITrackSegmentProperties = {
          length: 0,
          angle: Math.PI / 4,
          duration: 20,
          speed: 10
        };

        const nextSegment: ITrackSegmentProperties = {
          length: 0,
          angle: - Math.PI / 4,
          duration: 10,
          speed: 20
        };

        const routePathProps = new TrackPathProps();
        expect(routePathProps.rotation).toBeNull();
        expect(routePathProps.speed).toEqual(0);
        expect(routePathProps.rotationRate).toBeNull();

        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toEqual(0);

        routePathProps.addPropertiesFromPath(prevSegment, nextSegment);

        expect(routePathProps.rotation).toBeCloseTo(-Math.PI / 2, 3);

        expect(routePathProps.speed).toBeCloseTo(15, 0);
        expect(routePathProps.rotationRate).toBeCloseTo(routePathProps.rotation / 30, 3);

        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toEqual(0);
      });
    });

    describe('#addElevationSpeedsFromPath', () => {
      it('should determine the ascent/descent rates about a path maximum Point from the adjacent Segments', () => {
        const prevSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: 10
        };

        const nextSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: -20
        };

        const routePathProps = new TrackPathProps();
        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toEqual(0);

        routePathProps.addElevationSpeedsFromPath(prevSegment, nextSegment);
        expect(routePathProps.ascentRate).toBeCloseTo(10, 0);
        expect(routePathProps.descentRate).toBeCloseTo(20, 0);
      });

      it('should determine the ascent/descent rates about a path minimum Point from the adjacent Segments', () => {
        const prevSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: -10
        };

        const nextSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: 20
        };

        const routePathProps = new TrackPathProps();
        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toEqual(0);

        routePathProps.addElevationSpeedsFromPath(prevSegment, nextSegment);
        expect(routePathProps.ascentRate).toBeCloseTo(20, 0);
        expect(routePathProps.descentRate).toBeCloseTo(10, 0);
      });

      it('should determine the average ascent rate at a Point from the adjacent Segments', () => {
        const prevSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: 10
        };

        const nextSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: 20
        };

        const routePathProps = new TrackPathProps();
        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toEqual(0);

        routePathProps.addElevationSpeedsFromPath(prevSegment, nextSegment);
        expect(routePathProps.ascentRate).toBeCloseTo(15, 0);
        expect(routePathProps.descentRate).toEqual(0);
      });

      it('should determine the average descent rate at a Point from the adjacent Segments', () => {
        const prevSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: -10
        };

        const nextSegment: ITrackSegmentProperties = {
          length: 0,
          angle: 0,
          heightRate: -20
        };

        const routePathProps = new TrackPathProps();
        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toEqual(0);

        routePathProps.addElevationSpeedsFromPath(prevSegment, nextSegment);
        expect(routePathProps.ascentRate).toEqual(0);
        expect(routePathProps.descentRate).toBeCloseTo(15, 0);
      });
    });
  });
});