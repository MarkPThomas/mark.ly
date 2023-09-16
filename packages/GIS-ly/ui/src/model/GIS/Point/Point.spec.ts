import { Point, Position } from "../../GeoJSON";
import { PPoint } from "./Point";

describe('##PPoint', () => {
  let pointPosition: Position;
  let pointPositionWithAltitude: Position;
  beforeEach(() => {
    pointPosition = [1, 2];
    pointPositionWithAltitude = [1, 2, 3];
  });

  describe('Creation', () => {
    describe('#constructor', () => {
      it('should initialize the object with the provided mandatory properties', () => {
        const lat = 15;
        const lng = 45;

        const point = new PPoint(lat, lng);

        expect(point.lat).toEqual(lat);
        expect(point.lng).toEqual(lng);

        // Optional properties & Defaults
        expect(point.alt).toBeUndefined();
      });

      it('should initialize the object with the provided optional properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;

        const point = new PPoint(lat, lng, alt);

        expect(point.lat).toEqual(lat);
        expect(point.lng).toEqual(lng);

        // Optional properties & Defaults
        expect(point.alt).toEqual(alt);
      });
    });

    describe('#fromPosition', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const routePt = PPoint.fromPosition(pointPosition);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const routePt = PPoint.fromPosition(pointPositionWithAltitude);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toEqual(3);
      });

      it('should make an object from the associated Position with a timestamp specified', () => {
        const routePt = PPoint.fromPosition(pointPosition);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();
      });
    });

    describe('#fromPoint', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const point = Point.fromPosition(pointPosition);
        const routePt = PPoint.fromPoint(point);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const point = Point.fromPosition(pointPositionWithAltitude);
        const routePt = PPoint.fromPoint(point);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toEqual(3);
      });

      it('should make an object from the associated Position with a timestamp specified', () => {
        const point = Point.fromPosition(pointPosition);
        const routePt = PPoint.fromPoint(point);

        expect(routePt.lat).toEqual(2);
        expect(routePt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(routePt.alt).toBeUndefined();
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Point', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const point = new PPoint(lat, lng, alt);
        point.elevation = 150;

        const pointClone = point.clone();

        expect(point.equals(pointClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Points with differing properties', () => {
        const lat1 = 15;
        const lng1 = 45;
        const alt1 = 100;
        const elevation1 = 150;
        const pt1 = new PPoint(lat1, lng1, alt1);
        pt1.elevation = elevation1;

        const lat2 = 20;
        const lng2 = 50;
        const alt2 = 200;
        const elevation2 = 175;
        const pt2 = new PPoint(lat2, lng2, alt2);
        pt2.elevation = elevation2;

        const result = pt1.equals(pt2);

        expect(result).toBeFalsy();
      });


      it('should return True for Points with identical properties', () => {
        const lat = 15;
        const lng = 45;
        const alt = 100;
        const elevation = 150;

        const pt1 = new PPoint(lat, lng, alt);
        pt1.elevation = elevation;

        const pt2 = new PPoint(lat, lng, alt);
        pt2.elevation = elevation;

        const result = pt1.equals(pt2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toPosition', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const routPt = PPoint.fromPosition(pointPosition);

        const result = routPt.toPosition();

        expect(result).toEqual(pointPosition);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const routPt = PPoint.fromPosition(pointPositionWithAltitude);

        const result = routPt.toPosition();

        expect(result).toEqual(pointPositionWithAltitude);
      });

      it('should make a GeoJSON object with an elevation specified as priority over altitude', () => {
        const point = PPoint.fromPosition(pointPositionWithAltitude);
        point.elevation = 4;

        const result = point.toPosition();

        expect(result).not.toEqual(pointPositionWithAltitude);
        expect(result).toEqual([1, 2, 4]);
      });
    });

    describe('#toPoint', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const routPt = PPoint.fromPosition(pointPosition);
        const expectedResult = Point.fromPosition(pointPosition);

        const result = routPt.toPoint();

        expect(result).toEqual(expectedResult);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const point = PPoint.fromPosition(pointPositionWithAltitude);
        const expectedResult = Point.fromPosition(pointPositionWithAltitude);

        const result = point.toPoint();

        expect(result).toEqual(expectedResult);
      });

      it('should make a GeoJSON object with an elevation specified as priority over altitude', () => {
        const point = PPoint.fromPosition(pointPositionWithAltitude);
        const notExpectedResult = Point.fromPosition(pointPositionWithAltitude);
        const expectedResult = Point.fromPosition([1, 2, 4]);

        point.elevation = 4;

        const result = point.toPoint();

        expect(result).not.toEqual(notExpectedResult);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Static Methods', () => {
    describe('#calcSegmentDistanceMeters', () => {
      it('should return 0 for two points at the same location', () => {
        const coord = new PPoint(45, 110);

        const distance = PPoint.calcSegmentDistanceMeters(coord, coord);

        expect(distance).toEqual(0);
      });

      it('should return the distance in meters between two points', () => {
        const coord1 = new PPoint(-8.957287, -77.777452);
        const coord2 = new PPoint(-8.957069, -77.777400);

        const distance = PPoint.calcSegmentDistanceMeters(coord1, coord2);

        expect(distance - 24.904).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcSegmentAngleRads', () => {
      it('should return null for two points at the same location', () => {
        const coord = new PPoint(45, 110);

        const angle = PPoint.calcSegmentAngleRad(coord, coord);

        expect(angle).toBeNull();
      });

      it('should return 0 for a horizontal line heading East', () => {
        const coord1Neg = new PPoint(5, -20);
        const coord2Neg = new PPoint(5, -10);
        const coord1Pos = new PPoint(5, 10);
        const coord2Pos = new PPoint(5, 20);

        const angleNegNeg = PPoint.calcSegmentAngleRad(coord1Neg, coord2Neg);
        expect(angleNegNeg - 0).toBeLessThanOrEqual(0.001);

        const angleNegPos = PPoint.calcSegmentAngleRad(coord2Neg, coord1Pos);
        expect(angleNegPos - 0).toBeLessThanOrEqual(0.001);

        const anglePosPos = PPoint.calcSegmentAngleRad(coord1Pos, coord2Pos);
        expect(anglePosPos - 0).toBeLessThanOrEqual(0.001);
      });

      it('should return Pi for a horizontal line heading West', () => {
        const coord1Neg = new PPoint(5, -20);
        const coord2Neg = new PPoint(5, -10);
        const coord1Pos = new PPoint(5, 10);
        const coord2Pos = new PPoint(5, 20);

        const angleNegNeg = PPoint.calcSegmentAngleRad(coord2Neg, coord1Neg);
        expect(angleNegNeg - Math.PI).toBeLessThanOrEqual(0.001);

        const angleNegPos = PPoint.calcSegmentAngleRad(coord1Pos, coord2Neg);
        expect(angleNegPos - Math.PI).toBeLessThanOrEqual(0.001);

        const anglePosPos = PPoint.calcSegmentAngleRad(coord2Pos, coord1Pos);
        expect(anglePosPos - Math.PI).toBeLessThanOrEqual(0.001);
      });

      it('should return Pi / 2 for a vertical line heading North', () => {
        const coord1Neg = new PPoint(-20, 5);
        const coord2Neg = new PPoint(-10, 5);
        const coord1Pos = new PPoint(10, 5);
        const coord2Pos = new PPoint(20, 5);

        const angleNegNeg = PPoint.calcSegmentAngleRad(coord1Neg, coord2Neg);
        expect(angleNegNeg - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const angleNegPos = PPoint.calcSegmentAngleRad(coord2Neg, coord1Pos);
        expect(angleNegPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const anglePosPos = PPoint.calcSegmentAngleRad(coord1Pos, coord2Pos);
        expect(anglePosPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);
      });

      it('should return (3/2) * Pi for a vertical line heading South', () => {
        const coord1Neg = new PPoint(-20, 5);
        const coord2Neg = new PPoint(-10, 5);
        const coord1Pos = new PPoint(10, 5);
        const coord2Pos = new PPoint(20, 5);

        const angleNegNeg = PPoint.calcSegmentAngleRad(coord2Neg, coord1Neg);
        expect(angleNegNeg - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const angleNegPos = PPoint.calcSegmentAngleRad(coord1Pos, coord2Neg);
        expect(angleNegPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const anglePosPos = PPoint.calcSegmentAngleRad(coord2Pos, coord1Pos);
        expect(anglePosPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);
      });

      it('should return approximately n * (Pi / 4) slope of line joining two points in radians in each of the n Quadrants', () => {
        const coordTopRight = new PPoint(10, 10);
        const coordTopLeft = new PPoint(10, 5);
        const coordBottomRight = new PPoint(5, 10);
        const coordBottomLeft = new PPoint(5, 5);

        const angleQuad1 = PPoint.calcSegmentAngleRad(coordBottomLeft, coordTopRight);
        expect(angleQuad1 - 0.787).toBeLessThanOrEqual(0.001);

        const angleQuad2 = PPoint.calcSegmentAngleRad(coordBottomRight, coordTopLeft);
        expect(angleQuad2 - 2.354).toBeLessThanOrEqual(0.001);

        const angleQuad3 = PPoint.calcSegmentAngleRad(coordTopRight, coordBottomLeft);
        expect(angleQuad3 + 2.349).toBeLessThanOrEqual(0.001);

        const angleQuad4 = PPoint.calcSegmentAngleRad(coordTopLeft, coordBottomRight);
        expect(angleQuad4 + 0.793).toBeLessThanOrEqual(0.001);
      });

      it('should return slope of line joining two points in radians', () => {
        const coordTopRight = new PPoint(10, 20);
        const coordTopLeft = new PPoint(10, 5);
        const coordBottomRight = new PPoint(5, 20);
        const coordBottomLeft = new PPoint(5, 5);

        const angleQuad1 = PPoint.calcSegmentAngleRad(coordBottomLeft, coordTopRight);
        expect(angleQuad1 - 0.323).toBeLessThanOrEqual(0.001);

        const angleQuad2 = PPoint.calcSegmentAngleRad(coordBottomRight, coordTopLeft);
        expect(angleQuad2 - 2.819).toBeLessThanOrEqual(0.001);

        const angleQuad3 = PPoint.calcSegmentAngleRad(coordTopRight, coordBottomLeft);
        expect(angleQuad3 + 2.815).toBeLessThanOrEqual(0.001);

        const angleQuad4 = PPoint.calcSegmentAngleRad(coordTopLeft, coordBottomRight);
        expect(angleQuad4 + 0.326).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcSegmentDirection', () => {
      it('should return {null, null} for two points at the same location', () => {
        const coord1 = new PPoint(-8.957287, -77.777452);
        const coord2 = new PPoint(-8.957287, -77.777452);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: null, lng: null });
      });

      it('should return {N, E} for a segment pointing Northeast', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(10, 20);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'N', lng: 'E' });
      });

      it('should return {N, W} for a segment pointing Northwest', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(10, 5);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'N', lng: 'W' });
      });

      it('should return {S, E} for a segment pointing Southeast', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(-5, 20);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'S', lng: 'E' });
      });

      it('should return {S, W} for a segment pointing Southwest', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(-10, -20);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'S', lng: 'W' });
      });

      it('should return {null, E} for a segment pointing East', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(5, 20);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: null, lng: 'E' });
      });

      it('should return {N, null} for a segment pointing North', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(10, 10);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'N', lng: null });
      });

      it('should return {null, W} for a segment pointing West', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(5, -20);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: null, lng: 'W' });
      });

      it('should return {S, null} for a segment pointing South', () => {
        const coord1 = new PPoint(5, 10);
        const coord2 = new PPoint(-10, 10);

        const direction = PPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'S', lng: null });
      });
    });

    describe('#calcSegmentMeasuredAltitudeChange', () => {
      it('should return undefined if either or both of the nodes provided lack measured altitudes', () => {
        const coordNoElev = new PPoint(39.74005097339472, -104.9998123858178, 0);
        const coordMeasuredElev = new PPoint(39.73055300708892, -104.9990802128465, 1000);

        expect(PPoint.calcSegmentMeasuredAltitudeChange(coordNoElev, coordMeasuredElev)).toBeUndefined();
        expect(PPoint.calcSegmentMeasuredAltitudeChange(coordMeasuredElev, coordNoElev)).toBeUndefined();
        expect(PPoint.calcSegmentMeasuredAltitudeChange(coordNoElev, coordNoElev)).toBeUndefined();
      });

      it('should return the difference in altitude between two nodes that have measured altitudes', () => {
        const coord1 = new PPoint(39.74005097339472, -104.9998123858178, 1000);
        const coord2 = new PPoint(39.73055300708892, -104.9990802128465, 2000);

        expect(PPoint.calcSegmentMeasuredAltitudeChange(coord1, coord2)).toEqual(1000); // Uphill slope
        expect(PPoint.calcSegmentMeasuredAltitudeChange(coord2, coord1)).toEqual(-1000);  // Downhill slope
      });
    });

    describe('#calcSegmentMappedElevationChange', () => {
      it('should return undefined if either or both of the nodes provided lack mapped elevations', () => {
        const coordNoElev = new PPoint(39.74005097339472, -104.9998123858178, 0);
        const coordMappedElev = new PPoint(39.73055300708892, -104.9990802128465, 0);
        coordMappedElev.elevation = 1000;

        expect(PPoint.calcSegmentMappedElevationChange(coordNoElev, coordMappedElev)).toBeUndefined();
        expect(PPoint.calcSegmentMappedElevationChange(coordMappedElev, coordNoElev)).toBeUndefined();
        expect(PPoint.calcSegmentMappedElevationChange(coordNoElev, coordNoElev)).toBeUndefined();
      });

      it('should return the difference in elevation between two nodes that have mapped elevations', () => {
        const coord1 = new PPoint(39.74005097339472, -104.9998123858178, 0);
        coord1.elevation = 1000;
        const coord2 = new PPoint(39.73055300708892, -104.9990802128465, 0);
        coord2.elevation = 2000;

        expect(PPoint.calcSegmentMappedElevationChange(coord1, coord2)).toEqual(1000); // Uphill slope
        expect(PPoint.calcSegmentMappedElevationChange(coord2, coord1)).toEqual(-1000);  // Downhill slope
      });
    });
  });
});