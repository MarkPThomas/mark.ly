import { Position } from "@markpthomas/geojson";
import { Point } from "@markpthomas/geojson/geometries";

import { IRoutePathPropsProperties, RoutePathProps } from "./RoutePathProps";
import { RoutePoint } from "./RoutePoint";

describe('##RoutePoint', () => {
  let pointPosition: Position;
  let pointPositionWithAltitude: Position;
  beforeEach(() => {
    pointPosition = [1, 2];
    pointPositionWithAltitude = [1, 2, 3];
  });

  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize the object with the provided mandatory properties, but have undefined path properties', () => {
        const lat = 15;
        const lng = 45;

        const routePt = new RoutePoint(lat, lng);

        expect(routePt.lat).toEqual(lat);
        expect(routePt.lng).toEqual(lng);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();

        expect(routePt._path).toBeUndefined();
      });

      it('should initialize the object with the provided optional properties, but have undefined path properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;

        const routePt = new RoutePoint(lat, lng, alt);

        expect(routePt.lat).toEqual(lat);
        expect(routePt.lng).toEqual(lng);

        // Optional properties & Defaults
        expect(routePt.alt).toEqual(alt);

        expect(routePt._path).toBeUndefined();
      });
    });

    describe('#fromPosition', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const routePt = RoutePoint.fromPosition(pointPosition);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();

        expect(routePt._path).toBeDefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const routePt = RoutePoint.fromPosition(pointPositionWithAltitude);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toEqual(3);
      });
    });

    describe('#fromPoint', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const point = Point.fromPosition(pointPosition);
        const routePt = RoutePoint.fromPoint(point);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();

        expect(routePt._path).toBeDefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const point = Point.fromPosition(pointPositionWithAltitude);
        const routePt = RoutePoint.fromPoint(point);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toEqual(3);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Point', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const point = new RoutePoint(lat, lng, alt);
        point.elevation = 150;
        point._path = new RoutePathProps(5);

        const pointClone = point.clone();

        expect(point.equals(pointClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Points with differing properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const elevation = 150;
        const pt1 = new RoutePoint(lat, lng, alt);
        pt1.elevation = elevation;
        pt1._path = new RoutePathProps(5);

        const pt2 = new RoutePoint(lat, lng, alt);
        pt2.elevation = elevation;
        pt2._path = new RoutePathProps(10);

        const result = pt1.equals(pt2);

        expect(result).toBeFalsy();
      });


      it('should return True for Points with identical properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const elevation = 150;

        const pt1 = new RoutePoint(lat, lng, alt);
        pt1.elevation = elevation;
        pt1._path = new RoutePathProps(5);

        const pt2 = new RoutePoint(lat, lng, alt);
        pt2.elevation = elevation;
        pt2._path = new RoutePathProps(5);

        const result = pt1.equals(pt2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toPosition', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const routPt = RoutePoint.fromPosition(pointPosition);

        const result = routPt.toPosition();

        expect(result).toEqual(pointPosition);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const routPt = RoutePoint.fromPosition(pointPositionWithAltitude);

        const result = routPt.toPosition();

        expect(result).toEqual(pointPositionWithAltitude);
      });
    });

    describe('#toPoint', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const routPt = RoutePoint.fromPosition(pointPosition);
        const expectedResult = Point.fromPosition(pointPosition);

        const result = routPt.toPoint();

        expect(result).toEqual(expectedResult);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const routPt = RoutePoint.fromPosition(pointPositionWithAltitude);
        const expectedResult = Point.fromPosition(pointPositionWithAltitude);

        const result = routPt.toPoint();

        expect(result).toEqual(expectedResult);
      });
    });
  });
});