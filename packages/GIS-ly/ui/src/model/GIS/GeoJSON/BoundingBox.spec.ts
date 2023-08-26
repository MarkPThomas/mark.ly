import {
  BBox as SerialBBox,
  LineString as SerialLineString,
  GeoJsonProperties as SerialGeoJsonProperties,
  Feature as SerialFeature,
} from 'geojson';

import { GeoJsonTypes } from './enums';
import { Position } from './types';

import { Coordinate } from '../Coordinate';
import { BoundingBox } from './BoundingBox';

describe('##BoundingBox', () => {
  describe('#getBoundingBox', () => {
    it('should return a single set of latitude & longitude for a single coordinate', () => {
      const coordinate = new Coordinate(35.2, 100.0);

      const boundingBox = BoundingBox.getBoundingBox(coordinate);

      expect(boundingBox).toEqual([35.2, 100])
    });

    it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a LineString', () => {
      const coordinates = [
        {
          lat: 35.2,
          lng: 100.0
        }, {
          lat: 20,
          lng: -20.0
        }, {
          lat: 25,
          lng: 120.0
        }, {
          lat: 35.2,
          lng: 100.0
        }
      ];

      const boundingBox = BoundingBox.getBoundingBox(coordinates);

      expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    });

    it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a MultiLineString', () => {
      const coordinates = [
        [
          {
            lat: 35.2,
            lng: 100.0
          }, {
            lat: 20,
            lng: -20.0
          }
        ],
        [
          {
            lat: 25,
            lng: 120.0
          }, {
            lat: 35.2,
            lng: 100.0
          }
        ]
      ];

      const boundingBox = BoundingBox.getBoundingBox(coordinates);

      expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    });

    it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a MultiPolygon', () => {
      const coordinates = [
        [
          [
            {
              lat: 35.2,
              lng: 100.0
            }, {
              lat: 20,
              lng: -20.0
            }
          ]
        ],
        [
          [
            {
              lat: 25,
              lng: 120.0
            }
          ],
          [
            {
              lat: 35.2,
              lng: 100.0
            }
          ]
        ]
      ];

      const boundingBox = BoundingBox.getBoundingBox(coordinates);

      expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    });
  });

  describe('Static Factory Methods', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object with no altitude', () => {
        const bbox: SerialBBox = [1, 2, 3, 4];
        const boundingBox = BoundingBox.fromJson(bbox);

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
        const bbox: SerialBBox = [1, 2, 3, 4, 5, 6];
        const boundingBox = BoundingBox.fromJson(bbox);

        expect(boundingBox.west).toEqual(1);
        expect(boundingBox.south).toEqual(2);
        expect(boundingBox.east).toEqual(4);
        expect(boundingBox.north).toEqual(5);

        // Optional properties & Defaults
        expect(boundingBox.hasAltitude()).toBeTruthy();
        expect(boundingBox.southwestAltitude).toEqual(3);
        expect(boundingBox.northeastAltitude).toEqual(6);
      });
    });

    describe('#fromLngLats', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPosition', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromCornerPositions', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPositions', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPoint', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromCornerPoints', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#fromPoints', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });


  describe('Main Interface Tests', () => {
    describe('#clone', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#equals', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });


  describe('Instance Tests', () => {
    describe('#toJson', () => {
      it('should make a GeoJSON object with no altitude', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4];
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.toJson();

        expect(result).toEqual(bboxJson);
      });

      it('should make a GeoJSON object with an altitude specified', () => {
        const bboxJson: SerialBBox = [1, 2, 3, 4, 5, 6];
        const boundingBox = BoundingBox.fromJson(bboxJson);

        const result = boundingBox.toJson();

        expect(result).toEqual(bboxJson);
      });
    });

    describe('#toCornerPositions', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#toCornerPoints', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#hasAltitude', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#northeast', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });

    describe('#southwest', () => {
      it('should', () => {

      });

      it('should', () => {

      });
    });
  });
})
