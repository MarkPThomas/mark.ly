import { Coordinate } from "../GIS/Coordinate"
import { PolyLine } from "./PolyLine";

describe('##PolyLine', () => {
  describe('#constructor', () => {
    it(`should initialize an object of coordinates linked with segments,
      each represented in separate yet connected linked lists`, () => {
      const coordinates = [
        new Coordinate(45, -110),
        new Coordinate(60, -109),
        new Coordinate(47, -108),
      ];

      const polyLine = new PolyLine(coordinates);

      expect(polyLine.size()).toEqual({
        coords: 3,
        segments: 2
      });

      // const segments = polyLine.segments();
      // TODO: Flesh out later. Default is cartesian coords but can be overriden by lat/lng for GIS, or other mappings
      // expect(segments[1].length).toEqual();
    });
  });

  // describe('#addProperties', () => {
  //   it('should add derived properties to segments', () => {

  //   });
  // });

  // describe('#calcSegmentDistance', () => {
  //   it('should return 0 for two points at the same location', () => {

  //   });

  //   it('should return the distance between two points', () => {

  //   });
  // });

  // describe('#calcSegmentAngleRads', () => {
  //   it('should return null for two points at the same location', () => {
  //     const coord = new Coordinate(45, 110);

  //     const angle = PolyLine.calcSegmentAngleRads(coord, coord);

  //     expect(angle).toBeNull();
  //   });

  //   it('should return 0 for a horizontal line heading East', () => {
  //     const coord1Neg = new Coordinate(5, -20);
  //     const coord2Neg = new Coordinate(5, -10);
  //     const coord1Pos = new Coordinate(5, 10);
  //     const coord2Pos = new Coordinate(5, 20);

  //     const angleNegNeg = PolyLine.calcSegmentAngleRads(coord1Neg, coord2Neg);
  //     expect(angleNegNeg - 0).toBeLessThanOrEqual(0.001);

  //     const angleNegPos = PolyLine.calcSegmentAngleRads(coord2Neg, coord1Pos);
  //     expect(angleNegPos - 0).toBeLessThanOrEqual(0.001);

  //     const anglePosPos = PolyLine.calcSegmentAngleRads(coord1Pos, coord2Pos);
  //     expect(anglePosPos - 0).toBeLessThanOrEqual(0.001);
  //   });

  //   it('should return Pi for a horizontal line heading West', () => {
  //     const coord1Neg = new Coordinate(5, -20);
  //     const coord2Neg = new Coordinate(5, -10);
  //     const coord1Pos = new Coordinate(5, 10);
  //     const coord2Pos = new Coordinate(5, 20);

  //     const angleNegNeg = PolyLine.calcSegmentAngleRads(coord2Neg, coord1Neg);
  //     expect(angleNegNeg - Math.PI).toBeLessThanOrEqual(0.001);

  //     const angleNegPos = PolyLine.calcSegmentAngleRads(coord1Pos, coord2Neg);
  //     expect(angleNegPos - Math.PI).toBeLessThanOrEqual(0.001);

  //     const anglePosPos = PolyLine.calcSegmentAngleRads(coord2Pos, coord1Pos);
  //     expect(anglePosPos - Math.PI).toBeLessThanOrEqual(0.001);
  //   });

  //   it('should return Pi / 2 for a vertical line heading North', () => {
  //     const coord1Neg = new Coordinate(-20, 5);
  //     const coord2Neg = new Coordinate(-10, 5);
  //     const coord1Pos = new Coordinate(10, 5);
  //     const coord2Pos = new Coordinate(20, 5);

  //     const angleNegNeg = PolyLine.calcSegmentAngleRads(coord1Neg, coord2Neg);
  //     expect(angleNegNeg - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const angleNegPos = PolyLine.calcSegmentAngleRads(coord2Neg, coord1Pos);
  //     expect(angleNegPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const anglePosPos = PolyLine.calcSegmentAngleRads(coord1Pos, coord2Pos);
  //     expect(anglePosPos - 0.5 * Math.PI).toBeLessThanOrEqual(0.001);
  //   });

  //   it('should return (3/2) * Pi for a vertical line heading South', () => {
  //     const coord1Neg = new Coordinate(-20, 5);
  //     const coord2Neg = new Coordinate(-10, 5);
  //     const coord1Pos = new Coordinate(10, 5);
  //     const coord2Pos = new Coordinate(20, 5);

  //     const angleNegNeg = PolyLine.calcSegmentAngleRads(coord2Neg, coord1Neg);
  //     expect(angleNegNeg - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const angleNegPos = PolyLine.calcSegmentAngleRads(coord1Pos, coord2Neg);
  //     expect(angleNegPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const anglePosPos = PolyLine.calcSegmentAngleRads(coord2Pos, coord1Pos);
  //     expect(anglePosPos - 1.5 * Math.PI).toBeLessThanOrEqual(0.001);
  //   });

  //   it('should return n * (Pi / 4) slope of line joining two points in radians in each of the n Quadrants', () => {
  //     const coordTopRight = new Coordinate(10, 10);
  //     const coordTopLeft = new Coordinate(10, 5);
  //     const coordBottomRight = new Coordinate(5, 10);
  //     const coordBottomLeft = new Coordinate(5, 5);

  //     const anglQuad1 = PolyLine.calcSegmentAngleRads(coordBottomLeft, coordTopRight);
  //     expect(anglQuad1 - 0.25 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const angleQuad2 = PolyLine.calcSegmentAngleRads(coordBottomRight, coordTopLeft);
  //     expect(angleQuad2 - 0.75 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const angleQuad3 = PolyLine.calcSegmentAngleRads(coordTopRight, coordBottomLeft);
  //     expect(angleQuad3 - 1.25 * Math.PI).toBeLessThanOrEqual(0.001);

  //     const angleQuad4 = PolyLine.calcSegmentAngleRads(coordTopLeft, coordBottomRight);
  //     expect(angleQuad4 - 1.75 * Math.PI).toBeLessThanOrEqual(0.001);
  //   });

  //   it('should return slope of line joining two points in radians', () => {
  //     const coordTopRight = new Coordinate(10, 20);
  //     const coordTopLeft = new Coordinate(10, 5);
  //     const coordBottomRight = new Coordinate(5, 20);
  //     const coordBottomLeft = new Coordinate(5, 5);

  //     const anglQuad1 = PolyLine.calcSegmentAngleRads(coordBottomLeft, coordTopRight);
  //     expect(anglQuad1 - 0.322).toBeLessThanOrEqual(0.001);

  //     const angleQuad2 = PolyLine.calcSegmentAngleRads(coordBottomRight, coordTopLeft);
  //     expect(angleQuad2 + 0.322).toBeLessThanOrEqual(0.001);

  //     const angleQuad3 = PolyLine.calcSegmentAngleRads(coordTopRight, coordBottomLeft);
  //     expect(angleQuad3 - 0.322).toBeLessThanOrEqual(0.001);

  //     const angleQuad4 = PolyLine.calcSegmentAngleRads(coordTopLeft, coordBottomRight);
  //     expect(angleQuad4 + 0.322).toBeLessThanOrEqual(0.001);
  //   });
  // });
});