import { BBox as SerialBBox } from 'geojson';

import { GeoJsonConstants } from './GeoJsonConstants';
import { Position } from './types';
import { Point } from './Geometries';

import { BoundingBox } from './BoundingBox';

describe('##BoundingBox', () => {
  let pointBBoxJson: SerialBBox;
  let pointBBoxWithAltitudeJson: SerialBBox;
  let bboxJson: SerialBBox;
  let bboxWithAltitudeJson: SerialBBox;

  beforeEach(() => {
    pointBBoxJson = [
      1 - GeoJsonConstants.DEFAULT_BUFFER,
      2 - GeoJsonConstants.DEFAULT_BUFFER,
      1 + GeoJsonConstants.DEFAULT_BUFFER,
      2 + GeoJsonConstants.DEFAULT_BUFFER
    ];
    pointBBoxWithAltitudeJson = [
      1 - GeoJsonConstants.DEFAULT_BUFFER,
      2 - GeoJsonConstants.DEFAULT_BUFFER,
      5,
      1 + GeoJsonConstants.DEFAULT_BUFFER,
      2 + GeoJsonConstants.DEFAULT_BUFFER,
      5
    ]

    bboxJson = [1, 2, 3, 4];
    bboxWithAltitudeJson = [1, 2, 5, 3, 4, 6];
  })

  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const boundingBox = BoundingBox.fromJson(bboxJson);

        expect(boundingBox.west).toEqual(1);
        expect(boundingBox.south).toEqual(2);
        expect(boundingBox.east).toEqual(3);
        expect(boundingBox.north).toEqual(4);

        // Optional properties & Defaults
        expect(boundingBox.hasAltitude()).toBeFalsy();
        expect(boundingBox.southwestAltitude).toBeUndefined();
        expect(boundingBox.northeastAltitude).toBeUndefined();
      });

      it('should make an object from the associated GeoJSON object with an altitude specified', () => {
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        expect(boundingBox.west).toEqual(1);
        expect(boundingBox.south).toEqual(2);
        expect(boundingBox.east).toEqual(3);
        expect(boundingBox.north).toEqual(4);

        // Optional properties & Defaults
        expect(boundingBox.hasAltitude()).toBeTruthy();
        expect(boundingBox.southwestAltitude).toEqual(5);
        expect(boundingBox.northeastAltitude).toEqual(6);
      });
    });

    describe('#fromLngLat', () => {
      it('should make an object from the specified bounding long/lat with no altitude', () => {
        const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson);

        const boundingBox = BoundingBox.fromLngLat(1, 2);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified bounding long/lat with an altitude specified', () => {
        const boundingBoxExpected = BoundingBox.fromJson(pointBBoxWithAltitudeJson);

        const boundingBox = BoundingBox.fromLngLat(1, 2, { altitude: 5 });

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified bounding long/lat a buffer specified', () => {
        const boundingBox = BoundingBox.fromLngLat(1, 2, { bufferDegree: 1 });

        expect(boundingBox.west).toEqual(0);
        expect(boundingBox.south).toEqual(1);
        expect(boundingBox.east).toEqual(2);
        expect(boundingBox.north).toEqual(3);
      });
    });

    describe('#fromLngLats', () => {
      it('should make an object from the specified bounding longs/lats with no altitude', () => {
        const boundingBoxExpected = BoundingBox.fromJson(bboxJson);

        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified bounding longs/lats with an altitude specified', () => {
        const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson);

        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4, 5, 6);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified bounding longs/lats with an altitude by southwest altitude only', () => {
        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4, 5);

        expect(boundingBox.southwestAltitude).toEqual(5);
        expect(boundingBox.northeastAltitude).toEqual(5);
      });

      it('should make an object from the specified bounding longs/lats with an altitude by northeast altitude only', () => {
        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4, undefined, 5);

        expect(boundingBox.southwestAltitude).toEqual(5);
        expect(boundingBox.northeastAltitude).toEqual(5);
      });

      it('should make an object from the specified bounding longs/lats with an altitude of 0 specified', () => {
        const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson);

        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4, 0, 0);

        expect(boundingBox.southwestAltitude).toEqual(0);
        expect(boundingBox.northeastAltitude).toEqual(0);
      });

      it('should make an object from the specified bounding longs/lats with a southwest altitude of 0 specified', () => {
        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4, 0, 5);

        expect(boundingBox.southwestAltitude).toEqual(0);
        expect(boundingBox.northeastAltitude).toEqual(5);
      });

      it('should make an object from the specified bounding longs/lats with a northeast altitude of 0 specified', () => {
        const boundingBox = BoundingBox.fromLngLats(1, 2, 3, 4, 5, 0);

        expect(boundingBox.southwestAltitude).toEqual(5);
        expect(boundingBox.northeastAltitude).toEqual(0);
      });
    });

    describe('Position unit', () => {
      let positions: Position[]
      let positionsWithAltitude: Position[];

      beforeEach(() => {
        positions = [
          [1, 2], [3, 4], // Bounding coords
          [1.5, 2.5], [2.5, 3.5]// Other coords
        ];
        positionsWithAltitude = [
          [1, 2, 5], [3, 4, 6], // Bounding coords
          [1.5, 2.5, 5.2], [2.5, 3.5, 5.8]// Other coords
        ];
      });

      describe('#fromPosition', () => {
        it('should make an object from the specified bounding Position with no altitude', () => {
          const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson);

          const boundingBox = BoundingBox.fromPosition(positions[0]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified bounding Position with an altitude specified', () => {
          const boundingBoxExpected = BoundingBox.fromJson(pointBBoxWithAltitudeJson);

          const boundingBox = BoundingBox.fromPosition(positionsWithAltitude[0]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified bounding Position a buffer specified', () => {
          const boundingBox = BoundingBox.fromPosition(positions[0], 1);

          expect(boundingBox.west).toEqual(0);
          expect(boundingBox.south).toEqual(1);
          expect(boundingBox.east).toEqual(2);
          expect(boundingBox.north).toEqual(3);
        });
      });

      describe('#fromCornerPositions', () => {
        it('should make an object from the specified corner Positions with no altitude', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxJson);

          const boundingBox = BoundingBox.fromCornerPositions(positions[0], positions[1]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified corner Positions with an altitude specified', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson);

          const boundingBox = BoundingBox.fromCornerPositions(positionsWithAltitude[0], positionsWithAltitude[1]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });
      });

      describe('#fromPositions', () => {
        it('should make an object from the specified Positions with no altitude', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxJson);

          const boundingBox = BoundingBox.fromPositions(positions);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified Positions with an altitude specified', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson);

          const boundingBox = BoundingBox.fromPositions(positionsWithAltitude);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the array with a single specified bounding Position as a single Position', () => {
          const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson);

          const boundingBox = BoundingBox.fromPositions([positions[0]]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });
      });
    })

    describe('Point unit', () => {
      let points: Point[]
      let pointsWithAltitude: Point[];

      beforeEach(() => {
        points = [
          Point.fromLngLat(1, 2), Point.fromLngLat(3, 4), // Bounding coords
          Point.fromLngLat(1.5, 2.5), Point.fromLngLat(2.5, 3.5)// Other coords
        ];
        pointsWithAltitude = [
          Point.fromLngLat(1, 2, 5), Point.fromLngLat(3, 4, 6), // Bounding coords
          Point.fromLngLat(1.5, 2.5, 5.2), Point.fromLngLat(2.5, 3.5, 5.8)// Other coords
        ];
      });

      describe('#fromPoint', () => {
        it('should make an object from the specified bounding Point with no altitude', () => {
          const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson);

          const boundingBox = BoundingBox.fromPoint(points[0]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified bounding Point with an altitude specified', () => {
          const boundingBoxExpected = BoundingBox.fromJson(pointBBoxWithAltitudeJson);

          const boundingBox = BoundingBox.fromPoint(pointsWithAltitude[0]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified bounding Point a buffer specified', () => {
          const boundingBox = BoundingBox.fromPoint(points[0], 1);

          expect(boundingBox.west).toEqual(0);
          expect(boundingBox.south).toEqual(1);
          expect(boundingBox.east).toEqual(2);
          expect(boundingBox.north).toEqual(3);
        });
      });

      describe('#fromCornerPoints', () => {
        it('should make an object from the specified corner Points with no altitude', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxJson);

          const boundingBox = BoundingBox.fromCornerPoints(points[0], points[1]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified corner Points with an altitude specified', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson);

          const boundingBox = BoundingBox.fromCornerPoints(pointsWithAltitude[0], pointsWithAltitude[1]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });
      });

      describe('#fromPoints', () => {
        it('should make an object from the specified Points with no altitude', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxJson);

          const boundingBox = BoundingBox.fromPoints(points);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the specified Points with an altitude specified', () => {
          const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson);

          const boundingBox = BoundingBox.fromPoints(pointsWithAltitude);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });

        it('should make an object from the array with a single specified bounding Point as a single Point', () => {
          const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson);

          const boundingBox = BoundingBox.fromPoints([points[0]]);

          expect(boundingBox).toEqual(boundingBoxExpected);
        });
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object without an altitude specified', () => {
        const propertiesJson: SerialBBox = bboxJson;
        const properties = BoundingBox.fromJson(propertiesJson);

        const propertiesClone = properties.clone();

        expect(propertiesClone).toEqual(properties);
      });

      it('should return a copy of the values object with an altitude specified', () => {
        const propertiesJson: SerialBBox = bboxWithAltitudeJson;
        const properties = BoundingBox.fromJson(propertiesJson);

        const propertiesClone = properties.clone();

        expect(propertiesClone).toEqual(properties);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties when no altitude is specified', () => {
        const propertiesJson: SerialBBox = bboxJson;
        const properties = BoundingBox.fromJson(propertiesJson);

        const propertiesSameJson: SerialBBox = bboxJson;
        const propertiesSame = BoundingBox.fromJson(propertiesSameJson);

        const result = properties.equals(propertiesSame);
        expect(result).toBeTruthy();
      });

      it('should return True for objects that are equal by certain properties when altitude is specified', () => {
        const propertiesJson: SerialBBox = bboxJson;
        const properties = BoundingBox.fromJson(bboxWithAltitudeJson);

        const propertiesSameJson: SerialBBox = bboxJson;
        const propertiesSame = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = properties.equals(propertiesSame);
        expect(result).toBeTruthy();
      });

      it('should return False for objects that are not equal by certain properties', () => {
        const propertiesJson: SerialBBox = bboxJson;
        const properties = BoundingBox.fromJson(propertiesJson);

        const propertiesDiffValJson: SerialBBox = pointBBoxJson
        const propertiesDiffVal = BoundingBox.fromJson(propertiesDiffValJson);

        const resultDiffVal = properties.equals(propertiesDiffVal);
        expect(resultDiffVal).toBeFalsy();


        const propertiesDiffPropJson: SerialBBox = bboxWithAltitudeJson;
        const propertiesDiffProp = BoundingBox.fromJson(propertiesDiffPropJson);

        const resultDiffProp = properties.equals(propertiesDiffProp);
        expect(resultDiffProp).toBeFalsy();
      });
    });
  });

  describe('Exporting', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.toJson();

        expect(result).toEqual(bboxJson);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = boundingBox.toJson();

        expect(result).toEqual(bboxWithAltitudeJson);
      });
    });

    describe('#toCornerPositions', () => {
      it('should return an array of a SW Position & a NE Position', () => {
        const expectedResult = [
          [1, 2],
          [3, 4]
        ];
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.toCornerPositions();

        expect(result).toEqual(expectedResult);
      });

      it('should return an array of a SW Position & a NE Position with an altitude specified', () => {
        const expectedResult = [
          [1, 2, 5],
          [3, 4, 6]
        ];
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = boundingBox.toCornerPositions();

        expect(result).toEqual(expectedResult);
      });
    });

    describe('#toCornerPoints', () => {
      it('should return an array of a SW Point & a NE Point', () => {
        const expectedResult = [
          Point.fromLngLat(1, 2),
          Point.fromLngLat(3, 4)
        ];
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.toCornerPoints();

        expect(result).toEqual(expectedResult);
      });

      it('should return an array of a SW Point & a NE Point with an altitude specified', () => {
        const expectedResult = [
          Point.fromLngLat(1, 2, 5),
          Point.fromLngLat(3, 4, 6)
        ];
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = boundingBox.toCornerPoints();

        expect(result).toEqual(expectedResult);
      });
    });

    describe('#northeast', () => {
      it('should return a Point for the NE corner', () => {
        const expectedResult = Point.fromLngLat(3, 4);
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.northeast();

        expect(result).toEqual(expectedResult);
      });

      it('should return a Point for the NE corner with an altitude specified', () => {
        const expectedResult = Point.fromLngLat(3, 4, 6);
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = boundingBox.northeast();

        expect(result).toEqual(expectedResult);
      });
    });

    describe('#southwest', () => {
      it('should return a Point for the SW corner', () => {
        const expectedResult = Point.fromLngLat(1, 2);
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.southwest();

        expect(result).toEqual(expectedResult);
      });

      it('should return a Point for the SW corner with an altitude specified', () => {
        const expectedResult = Point.fromLngLat(1, 2, 5);
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = boundingBox.southwest();

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Methods', () => {
    describe('#hasAltitude', () => {
      it('should return False when no altitude was specified', () => {
        const boundingBox = BoundingBox.fromJson(bboxJson);

        expect(boundingBox.hasAltitude()).toBeFalsy();
      });

      it('should return True when altitudes were specified', () => {
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        expect(boundingBox.hasAltitude()).toBeTruthy();
      });
    });
  });
});
