import { Position } from "@markpthomas/geojson";
import { Point } from "@markpthomas/geojson/Geometries";

import { TrackPathProps } from "./TrackPathProps";
import { TrackPoint } from "./TrackPoint";

describe('##TrackPoint', () => {
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

        const point = new TrackPoint(lat, lng);

        expect(point.lat).toEqual(lat);
        expect(point.lng).toEqual(lng);

        // Optional properties & Defaults
        expect(point.alt).toBeUndefined();
        expect(point.timestamp).toBeUndefined();

        expect(point._path).toBeUndefined();
      });

      it('should initialize the object with the provided optional properties, but have undefined path properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const timestamp = '10';

        const point = new TrackPoint(lat, lng, alt, timestamp);

        expect(point.lat).toEqual(lat);
        expect(point.lng).toEqual(lng);

        // Optional properties & Defaults
        expect(point.alt).toEqual(alt);
        expect(point.timestamp).toEqual(timestamp);

        expect(point._path).toBeUndefined();
      });
    });

    describe('#fromPosition', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const point = TrackPoint.fromPositionInTime({ position: pointPosition });

        expect(point.lat).toEqual(2);
        expect(point.lng).toEqual(1);

        // Optional properties & Defaults
        expect(point.alt).toBeUndefined();
        expect(point.timestamp).toBeUndefined();

        expect(point._path).toBeDefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const point = TrackPoint.fromPositionInTime({ position: pointPositionWithAltitude });

        expect(point.lat).toEqual(2);
        expect(point.lng).toEqual(1);

        // Optional properties & Defaults
        expect(point.alt).toEqual(3);
        expect(point.timestamp).toBeUndefined();
        expect(point._path).toBeDefined();
      });

      it('should make an object from the associated Position with a timestamp specified', () => {
        const point = TrackPoint.fromPositionInTime({ position: pointPosition, timestamp: 'Foo' });

        expect(point.lat).toEqual(2);
        expect(point.lng).toEqual(1);

        // Optional properties & Defaults
        expect(point.alt).toBeUndefined();
        expect(point.timestamp).toEqual('Foo');
        expect(point._path).toBeDefined();
      });
    });

    describe('#fromPoint', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const point = Point.fromPosition(pointPosition);
        const trkPt = TrackPoint.fromPointInTime({ point });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toBeUndefined();
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const point = Point.fromPosition(pointPositionWithAltitude);
        const trkPt = TrackPoint.fromPointInTime({ point });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toEqual(3);
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should make an object from the associated Position with a timestamp specified', () => {
        const point = Point.fromPosition(pointPosition);
        const trkPt = TrackPoint.fromPointInTime({ point, timestamp: 'Foo' });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toBeUndefined();
        expect(trkPt.timestamp).toEqual('Foo');
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Point', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const point = new TrackPoint(lat, lng, alt);
        point.elevation = 150;
        point._path = new TrackPathProps(5, 4, 3, 2, 1);

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
        const pt1 = new TrackPoint(lat, lng, alt);
        pt1.elevation = elevation;
        pt1._path = new TrackPathProps(5, 4, 3, 2, 1);

        const pt2 = new TrackPoint(lat, lng, alt);
        pt2.elevation = elevation;
        pt2._path = new TrackPathProps(10, 9, 8, 7, 6);

        const result = pt1.equals(pt2);

        expect(result).toBeFalsy();
      });


      it('should return True for Points with identical properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const elevation = 150;

        const pt1 = new TrackPoint(lat, lng, alt);
        pt1.elevation = elevation;
        pt1._path = new TrackPathProps(5, 4, 3, 2, 1);

        const pt2 = new TrackPoint(lat, lng, alt);
        pt2.elevation = elevation;
        pt2._path = new TrackPathProps(5, 4, 3, 2, 1);

        const result = pt1.equals(pt2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toPosition', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const trkPt = TrackPoint.fromPositionInTime({ position: pointPosition });

        const result = trkPt.toPosition();

        expect(result).toEqual(pointPosition);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const trkPt = TrackPoint.fromPositionInTime({ position: pointPositionWithAltitude });

        const result = trkPt.toPosition();

        expect(result).toEqual(pointPositionWithAltitude);
      });
    });

    describe('#toPoint', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const trkPt = TrackPoint.fromPositionInTime({ position: pointPosition });
        const expectedResult = Point.fromPosition(pointPosition);

        const result = trkPt.toPoint();

        expect(result).toEqual(expectedResult);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const trkPt = TrackPoint.fromPositionInTime({ position: pointPositionWithAltitude });
        const expectedResult = Point.fromPosition(pointPositionWithAltitude);

        const result = trkPt.toPoint();

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Properties', () => {
    it('should set new timestamps', () => {
      const lat = 15;
      const lng = 45;

      const point = new TrackPoint(lat, lng);

      expect(point.timestamp).toBeUndefined();

      point.timestamp = '10';
      expect(point.timestamp).toEqual('10');

      point.timestamp = '15';
      expect(point.timestamp).toEqual('15');
    });
  })
});