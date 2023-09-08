import { Point, Position } from "../../GeoJSON";
import { TrackPoint } from "./TrackPoint";

describe('##TrackPoint', () => {
  let pointPosition: Position;
  let pointPositionWithAltitude: Position;
  beforeEach(() => {
    pointPosition = [1, 2];
    pointPositionWithAltitude = [1, 2, 3];
  });

  describe('Creation', () => {
    describe('#fromPosition', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPosition });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toBeUndefined();
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPositionWithAltitude });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toEqual(3);
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should make an object from the associated Position with a timestamp specified', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPosition, timestamp: 'Foo' });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toBeUndefined();
        expect(trkPt.timestamp).toEqual('Foo');
      });
    });

    describe('#fromPoint', () => {
      it('should make an object from the associated Position with no altitude or timestamp', () => {
        const point = Point.fromPosition(pointPosition);
        const trkPt = TrackPoint.fromPoint({ point });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toBeUndefined();
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should make an object from the associated Position with an altitude specified', () => {
        const point = Point.fromPosition(pointPositionWithAltitude);
        const trkPt = TrackPoint.fromPoint({ point });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toEqual(3);
        expect(trkPt.timestamp).toBeUndefined();
      });

      it('should make an object from the associated Position with a timestamp specified', () => {
        const point = Point.fromPosition(pointPosition);
        const trkPt = TrackPoint.fromPoint({ point, timestamp: 'Foo' });

        expect(trkPt.lat).toEqual(2);
        expect(trkPt.lng).toEqual(1);

        // Optional properties & Defaults
        expect(trkPt.alt).toBeUndefined();
        expect(trkPt.timestamp).toEqual('Foo');
      });
    });
  });

  describe('Exporting', () => {
    describe('#toPosition', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPosition });

        const result = trkPt.toPosition();

        expect(result).toEqual(pointPosition);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPositionWithAltitude });

        const result = trkPt.toPosition();

        expect(result).toEqual(pointPositionWithAltitude);
      });
    });

    describe('#toPoint', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPosition });
        const expectedResult = Point.fromPosition(pointPosition);

        const result = trkPt.toPoint();

        expect(result).toEqual(expectedResult);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const trkPt = TrackPoint.fromPosition({ position: pointPositionWithAltitude });
        const expectedResult = Point.fromPosition(pointPositionWithAltitude);

        const result = trkPt.toPoint();

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Static Methods', () => {
    describe('#calcSegmentDistanceMeters', () => {
      it('should return 0 for two points at the same location', () => {
        const coord = new TrackPoint(45, 110);

        const distance = TrackPoint.calcSegmentDistanceMeters(coord, coord);

        expect(distance).toEqual(0);
      });

      it('should return the distance in meters between two points', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        const coord2 = new TrackPoint(-8.957069, -77.777400);

        const distance = TrackPoint.calcSegmentDistanceMeters(coord1, coord2);

        expect(distance - 24.904).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcSegmentAngleRads', () => {
      it('should return null for two points at the same location', () => {
        const coord = new TrackPoint(45, 110);

        const angle = TrackPoint.calcSegmentAngleRad(coord, coord);

        expect(angle).toBeNull();
      });

      it('should return 0 for a horizontal line heading East', () => {
        const coord1Neg = new TrackPoint(5, -20);
        const coord2Neg = new TrackPoint(5, -10);
        const coord1Pos = new TrackPoint(5, 10);
        const coord2Pos = new TrackPoint(5, 20);

        const angleNegNeg = TrackPoint.calcSegmentAngleRad(coord1Neg, coord2Neg);
        expect(angleNegNeg - 0).toBeLessThanOrEqual(0.001);

        const angleNegPos = TrackPoint.calcSegmentAngleRad(coord2Neg, coord1Pos);
        expect(angleNegPos - 0).toBeLessThanOrEqual(0.001);

        const anglePosPos = TrackPoint.calcSegmentAngleRad(coord1Pos, coord2Pos);
        expect(anglePosPos - 0).toBeLessThanOrEqual(0.001);
      });

      it('should return Pi for a horizontal line heading West', () => {
        const coord1Neg = new TrackPoint(5, -20);
        const coord2Neg = new TrackPoint(5, -10);
        const coord1Pos = new TrackPoint(5, 10);
        const coord2Pos = new TrackPoint(5, 20);

        const angleNegNeg = TrackPoint.calcSegmentAngleRad(coord2Neg, coord1Neg);
        expect(angleNegNeg - Math.PI).toBeLessThanOrEqual(0.001);

        const angleNegPos = TrackPoint.calcSegmentAngleRad(coord1Pos, coord2Neg);
        expect(angleNegPos - Math.PI).toBeLessThanOrEqual(0.001);

        const anglePosPos = TrackPoint.calcSegmentAngleRad(coord2Pos, coord1Pos);
        expect(anglePosPos - Math.PI).toBeLessThanOrEqual(0.001);
      });

      it('should return Pi / 2 for a vertical line heading North', () => {
        const coord1Neg = new TrackPoint(-20, 5);
        const coord2Neg = new TrackPoint(-10, 5);
        const coord1Pos = new TrackPoint(10, 5);
        const coord2Pos = new TrackPoint(20, 5);

        const angleNegNeg = TrackPoint.calcSegmentAngleRad(coord1Neg, coord2Neg);
        expect(angleNegNeg - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const angleNegPos = TrackPoint.calcSegmentAngleRad(coord2Neg, coord1Pos);
        expect(angleNegPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const anglePosPos = TrackPoint.calcSegmentAngleRad(coord1Pos, coord2Pos);
        expect(anglePosPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);
      });

      it('should return (3/2) * Pi for a vertical line heading South', () => {
        const coord1Neg = new TrackPoint(-20, 5);
        const coord2Neg = new TrackPoint(-10, 5);
        const coord1Pos = new TrackPoint(10, 5);
        const coord2Pos = new TrackPoint(20, 5);

        const angleNegNeg = TrackPoint.calcSegmentAngleRad(coord2Neg, coord1Neg);
        expect(angleNegNeg - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const angleNegPos = TrackPoint.calcSegmentAngleRad(coord1Pos, coord2Neg);
        expect(angleNegPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

        const anglePosPos = TrackPoint.calcSegmentAngleRad(coord2Pos, coord1Pos);
        expect(anglePosPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);
      });

      it('should return approximately n * (Pi / 4) slope of line joining two points in radians in each of the n Quadrants', () => {
        const coordTopRight = new TrackPoint(10, 10);
        const coordTopLeft = new TrackPoint(10, 5);
        const coordBottomRight = new TrackPoint(5, 10);
        const coordBottomLeft = new TrackPoint(5, 5);

        const angleQuad1 = TrackPoint.calcSegmentAngleRad(coordBottomLeft, coordTopRight);
        expect(angleQuad1 - 0.787).toBeLessThanOrEqual(0.001);

        const angleQuad2 = TrackPoint.calcSegmentAngleRad(coordBottomRight, coordTopLeft);
        expect(angleQuad2 - 2.354).toBeLessThanOrEqual(0.001);

        const angleQuad3 = TrackPoint.calcSegmentAngleRad(coordTopRight, coordBottomLeft);
        expect(angleQuad3 + 2.349).toBeLessThanOrEqual(0.001);

        const angleQuad4 = TrackPoint.calcSegmentAngleRad(coordTopLeft, coordBottomRight);
        expect(angleQuad4 + 0.793).toBeLessThanOrEqual(0.001);
      });

      it('should return slope of line joining two points in radians', () => {
        const coordTopRight = new TrackPoint(10, 20);
        const coordTopLeft = new TrackPoint(10, 5);
        const coordBottomRight = new TrackPoint(5, 20);
        const coordBottomLeft = new TrackPoint(5, 5);

        const angleQuad1 = TrackPoint.calcSegmentAngleRad(coordBottomLeft, coordTopRight);
        expect(angleQuad1 - 0.323).toBeLessThanOrEqual(0.001);

        const angleQuad2 = TrackPoint.calcSegmentAngleRad(coordBottomRight, coordTopLeft);
        expect(angleQuad2 - 2.819).toBeLessThanOrEqual(0.001);

        const angleQuad3 = TrackPoint.calcSegmentAngleRad(coordTopRight, coordBottomLeft);
        expect(angleQuad3 + 2.815).toBeLessThanOrEqual(0.001);

        const angleQuad4 = TrackPoint.calcSegmentAngleRad(coordTopLeft, coordBottomRight);
        expect(angleQuad4 + 0.326).toBeLessThanOrEqual(0.001);
      });
    });

    describe('#calcSegmentDirection', () => {
      it('should return {null, null} for two points at the same location', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957287, -77.777452);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: null, lng: null });
      });

      it('should return {N, E} for a segment pointing Northeast', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(10, 20);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'N', lng: 'E' });
      });

      it('should return {N, W} for a segment pointing Northwest', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(10, 5);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'N', lng: 'W' });
      });

      it('should return {S, E} for a segment pointing Southeast', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-5, 20);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'S', lng: 'E' });
      });

      it('should return {S, W} for a segment pointing Southwest', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-10, -20);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'S', lng: 'W' });
      });

      it('should return {null, E} for a segment pointing East', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(5, 20);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: null, lng: 'E' });
      });

      it('should return {N, null} for a segment pointing North', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(10, 10);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'N', lng: null });
      });

      it('should return {null, W} for a segment pointing West', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(5, -20);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: null, lng: 'W' });
      });

      it('should return {S, null} for a segment pointing South', () => {
        const coord1 = new TrackPoint(5, 10);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-10, 10);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const direction = TrackPoint.calcSegmentDirection(coord1, coord2);

        expect(direction).toEqual({ lat: 'S', lng: null });
      });
    });

    describe('#calcSegmentMappedElevationChange', () => {
      it('should return undefined if either or both of the nodes provided lack mapped elevations', () => {
        const coordNoElev = new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:00Z');
        const coordMappedElev = new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:00Z');
        coordMappedElev.elevation = 1000;

        expect(TrackPoint.calcSegmentMappedElevationChange(coordNoElev, coordMappedElev)).toBeUndefined();
        expect(TrackPoint.calcSegmentMappedElevationChange(coordMappedElev, coordNoElev)).toBeUndefined();
        expect(TrackPoint.calcSegmentMappedElevationChange(coordNoElev, coordNoElev)).toBeUndefined();
      });

      it('should return the difference in elevation between two nodes that have mapped elevations', () => {
        const coord1 = new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:00Z');
        coord1.elevation = 1000;
        const coord2 = new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:00Z');
        coord2.elevation = 2000;

        expect(TrackPoint.calcSegmentMappedElevationChange(coord1, coord2)).toEqual(1000); // Uphill slope
        expect(TrackPoint.calcSegmentMappedElevationChange(coord2, coord1)).toEqual(-1000);  // Downhill slope
      });
    });

    describe('#calcSegmentSpeedMPS', () => {
      it('should return 0 for points without timestamps', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        const coord2 = new TrackPoint(-8.957069, -77.777400);

        const speed = TrackPoint.calcSegmentSpeedMPS(coord1, coord2);

        expect(speed).toBeLessThanOrEqual(0.001);
      });

      it('should return 0 for two points at the same location', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957287, -77.777452);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const speed = TrackPoint.calcSegmentSpeedMPS(coord1, coord2);

        expect(speed).toBeLessThanOrEqual(0.001);
      });

      it('should return undefined for points with ill-formed timestamps', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = 'Foo';

        const speed = TrackPoint.calcSegmentSpeedMPS(coord1, coord2);

        expect(speed).toBeUndefined();
      });

      it('should return a positive speed in meters per second between two points with timestamps regardless of order', () => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const speed = TrackPoint.calcSegmentSpeedMPS(coord1, coord2);
        const speedReversed = TrackPoint.calcSegmentSpeedMPS(coord2, coord1);

        expect(speed - 1.245).toBeLessThanOrEqual(0.001);
        expect(speedReversed - 1.245).toBeLessThanOrEqual(0.001);
      });
    });
  });
});