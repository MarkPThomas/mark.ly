import { ISegmentProperties } from '../../Geometry/Segment';
import { RoutePathProps, IRoutePathProps, IRoutePathPropsProperties } from './RoutePathProps';

describe('##RoutePathProps', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize an empty object', () => {
        const pathProps = new RoutePathProps();

        expect(pathProps.rotation).toBeUndefined();
      });

      it('should initialize an object with the specified properties', () => {
        const rotation = 5;

        const pathProps = new RoutePathProps(rotation);

        expect(pathProps.rotation).toEqual(rotation);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Path props', () => {
        const rotation = 5;
        const pathProps = new RoutePathProps(rotation);

        const pathPropsClone = pathProps.clone();

        expect(pathProps.equals(pathPropsClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Path props with differing properties', () => {
        const rotation1 = 5;
        const pathProps1 = new RoutePathProps(rotation1);

        const rotation2 = 10;
        const pathProps2 = new RoutePathProps(rotation2);

        const result = pathProps1.equals(pathProps2);

        expect(result).toBeFalsy();
      });

      it('should return True for Path props with identical properties', () => {
        const rotation = 5;
        const pathProps1 = new RoutePathProps(rotation);
        const pathProps2 = new RoutePathProps(rotation);

        const result = pathProps1.equals(pathProps2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Add Data Methods', () => {
    describe('#addPropertiesFromPath', () => {
      it('should determine the path rotation about a Point from the adjacent Segments', () => {
        const prevSegment: ISegmentProperties = {
          length: 0,
          angle: Math.PI / 4
        };

        const nextSegment: ISegmentProperties = {
          length: 0,
          angle: - Math.PI / 4
        };

        const routePathProps = new RoutePathProps();
        expect(routePathProps.rotation).toBeUndefined();

        routePathProps.addPropertiesFromPath(prevSegment, nextSegment);

        expect(routePathProps.rotation).toBeCloseTo(-Math.PI / 2, 3);
      });
    });
  });
});