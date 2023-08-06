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
    })
  })
})