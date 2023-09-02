
  // describe('#getBoundingBox', () => {
  //   it('should return a single set of latitude & longitude for a single coordinate', () => {
  //     const coordinate = new TrackPoint(35.2, 100.0);

  //     const boundingBox = BoundingBox.getBoundingBox(coordinate);

  //     expect(boundingBox).toEqual([35.2, 100])
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

  //     const boundingBox = BoundingBox.getBoundingBox(coordinates);

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

  //     const boundingBox = BoundingBox.getBoundingBox(coordinates);

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

  //     const boundingBox = BoundingBox.getBoundingBox(coordinates);

  //     expect(boundingBox).toEqual([[20, -20], [35.2, 120]]);
  //   });
  // });