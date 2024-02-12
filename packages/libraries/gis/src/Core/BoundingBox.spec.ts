import { BBox as SerialBBox } from 'geojson';

import { GeoJsonConstants } from '@MPT/geojson';

import { BoundingBox } from "./BoundingBox";
import { TrackPoint } from "./Track/TrackPoint";

describe('##TrackBoundingBox', () => {
  let pointBBoxJson: SerialBBox;
  let pointBBoxWithAltitudeJson: SerialBBox;
  let bboxJson: SerialBBox;
  let bboxWithAltitudeJson: SerialBBox;

  let trackPoints: TrackPoint[]
  let trackPointsWithAltitude: TrackPoint[];

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

    trackPoints = [
      new TrackPoint(2, 1), new TrackPoint(4, 3), // Bounding coords
      new TrackPoint(2.5, 1.5), new TrackPoint(3.5, 2.5)// Other coords
    ];
    trackPointsWithAltitude = [
      new TrackPoint(2, 1, 5), new TrackPoint(4, 3, 6), // Bounding coords
      new TrackPoint(2.5, 1.5, 5.2), new TrackPoint(3.5, 2.5, 5.8) // Other coords
    ];
  })

  describe('Creation', () => {
    describe('#fromBoundingBox', () => {
      it('should make a TrackBoundingBox object from the provided BoundingBox', () => {
        const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson);

        const boundingBox = BoundingBox.fromBoundingBox(boundingBoxExpected);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });
    });

    describe('#fromTrackPoint', () => {
      it('should make an object from the specified bounding Point with no altitude', () => {
        const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson) as BoundingBox;

        const boundingBox = BoundingBox.fromTrackPoint(trackPoints[0]);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified bounding Point with an altitude specified', () => {
        const boundingBoxExpected = BoundingBox.fromJson(pointBBoxWithAltitudeJson) as BoundingBox;

        const boundingBox = BoundingBox.fromTrackPoint(trackPointsWithAltitude[0]);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified bounding Point a buffer specified', () => {
        const boundingBox = BoundingBox.fromTrackPoint(trackPoints[0], 1);

        expect(boundingBox.west).toEqual(0);
        expect(boundingBox.south).toEqual(1);
        expect(boundingBox.east).toEqual(2);
        expect(boundingBox.north).toEqual(3);
      });
    });

    describe('#fromTrackPoints', () => {
      it('should make an object from the specified Points with no altitude', () => {
        const boundingBoxExpected = BoundingBox.fromJson(bboxJson) as BoundingBox;

        const boundingBox = BoundingBox.fromTrackPoints(trackPoints);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the specified Points with an altitude specified', () => {
        const boundingBoxExpected = BoundingBox.fromJson(bboxWithAltitudeJson) as BoundingBox;

        const boundingBox = BoundingBox.fromTrackPoints(trackPointsWithAltitude);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });

      it('should make an object from the array with a single specified bounding Point as a single Point', () => {
        const boundingBoxExpected = BoundingBox.fromJson(pointBBoxJson) as BoundingBox;

        const boundingBox = BoundingBox.fromTrackPoints([trackPoints[0]]);

        expect(boundingBox).toEqual(boundingBoxExpected);
      });
    });
  });

  describe('Exporting', () => {
    describe('#toCornerLatLng', () => {
      it('should return an array of a SW Point & a NE Point', () => {
        const expectedResult = [
          [2, 1],
          [4, 3]
        ];
        const boundingBox = BoundingBox.fromJson(bboxJson) as BoundingBox;

        const result = boundingBox.toCornerLatLng();

        expect(result).toEqual(expectedResult);
      });

      it('should return an array of a SW Point & a NE Point with an altitude specified', () => {
        const expectedResult = [
          [2, 1],
          [4, 3]
        ];
        const boundingBox = BoundingBox.fromJson(bboxWithAltitudeJson);

        const result = boundingBox.toCornerLatLng();

        // Note: Leaflet does not include elevations with Bounding Boxes, so LatLngBounds drops those to be compatible.
        // If these are still needed, use the GeoJSON Bounding Box rather than the GIS one.
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Static', () => {
    // TODO: Might be irrelevant, even as a convenience method. See after refactoring is more complete.
    // describe('#getBoundingBox', () => {
    //   // TODO: Change test description
    //   it('should return a single set of latitude & longitude for a single coordinate', () => {
    //     const coordinate = new TrackPoint(35.2, 100.0);

    //     const boundingBox = TrackBoundingBox.getBoundingBox(coordinate);

    //     expect(boundingBox).toEqual([[35.2, 100.0], [35.2, 100.0]]);
    //     // expect(boundingBox).toEqual([[34.7, 99.5], [35.7, 100.5]])
    //   });

    //   it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a LineString', () => {
    //     const coordinates = [
    //       {
    //         lat: 35.2,
    //         lng: 100.0
    //       }, {
    //         lat: 20,
    //         lng: -20.0
    //       }, {
    //         lat: 25,
    //         lng: 120.0
    //       }, {
    //         lat: 35.2,
    //         lng: 100.0
    //       }
    //     ];

    //     const boundingBox = TrackBoundingBox.getBoundingBox(coordinates);

    //     expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    //   });

    //   it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a MultiLineString', () => {
    //     const coordinates = [
    //       [
    //         {
    //           lat: 35.2,
    //           lng: 100.0
    //         }, {
    //           lat: 20,
    //           lng: -20.0
    //         }
    //       ],
    //       [
    //         {
    //           lat: 25,
    //           lng: 120.0
    //         }, {
    //           lat: 35.2,
    //           lng: 100.0
    //         }
    //       ]
    //     ];

    //     const boundingBox = TrackBoundingBox.getBoundingBox(coordinates as TrackPoints);

    //     expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    //   });

    //   it('should return a bounding box of 2 coordinates from a set of multiple coordinates in a MultiPolygon', () => {
    //     const coordinates = [
    //       [
    //         [
    //           {
    //             lat: 35.2,
    //             lng: 100.0
    //           }, {
    //             lat: 20,
    //             lng: -20.0
    //           }
    //         ]
    //       ],
    //       [
    //         [
    //           {
    //             lat: 25,
    //             lng: 120.0
    //           }
    //         ],
    //         [
    //           {
    //             lat: 35.2,
    //             lng: 100.0
    //           }
    //         ]
    //       ]
    //     ];

    //     const boundingBox = TrackBoundingBox.getBoundingBox(coordinates as TrackPoints);

    //     expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
    //   });
    // });
  });
});