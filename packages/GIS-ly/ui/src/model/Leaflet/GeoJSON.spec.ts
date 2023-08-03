import {
  FeatureCollection,
  Geometry,
  LineString,
  MultiLineString,
  Polygon,
  GeoJSON
} from 'geojson';
import { mergeTackSegments } from './GeoJSON';

describe('#getCoords', () => {
  it('should return coordinates from a Point', () => {

  });

  it('should return coordinates from a MultiPoint', () => {

  });

  it('should return coordinates from a LineString', () => {

  });

  it('should return coordinates from a MultiLineString', () => {

  });

  it('should return coordinates from a Polygon', () => {

  });

  it('should return coordinates from a MultiPolygon', () => {

  });
});

describe('#getBoundingBox', () => {
  it('should ', () => {

  });
});

describe('#mergeTackSegments', () => {
  it('should merge all coordinates into one array in a MultiLineString', () => {
    const geoJson: FeatureCollection<Geometry, { [name: string]: any; }> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [100.0, 0.0],
                [101.0, 1.0]
              ],
              [
                [102.0, 2.0],
                [103.0, 3.0]
              ]
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: [
                ['1', '2'],
                ['3', '4']
              ]
            }
          },
        }
      ],
    }
    const coordinatesOriginal = (geoJson.features[0].geometry as MultiLineString).coordinates;
    expect(coordinatesOriginal).toEqual(
      [[
        [100.0, 0.0],
        [101.0, 1.0]
      ],
      [
        [102.0, 2.0],
        [103.0, 3.0]
      ]]
    );

    const timestampsOriginal = geoJson.features[0].properties.coordinateProperties.times;
    expect(timestampsOriginal).toEqual(
      [
        ['1', '2'],
        ['3', '4']
      ]
    );

    const mergedGeoJson = mergeTackSegments(geoJson);

    expect(mergedGeoJson.features[0].geometry.type).toEqual('LineString');

    const coordinatesResult = (mergedGeoJson.features[0].geometry as LineString).coordinates;
    expect(coordinatesResult).toEqual(
      [
        [100.0, 0.0],
        [101.0, 1.0],
        [102.0, 2.0],
        [103.0, 3.0]
      ]
    );

    const timestampsResult = mergedGeoJson.features[0].properties.coordinateProperties.times;
    expect(timestampsResult).toEqual(
      ['1', '2', '3', '4']
    );
  });

  it('should do nothing for any types other than a MultiLineString', () => {
    const geoJson: FeatureCollection<Geometry, { [name: string]: any; }> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100.0, 0.0],
                [101.0, 1.0]
              ],
              [
                [102.0, 2.0],
                [103.0, 3.0]
              ]
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: [
                ['1', '2'],
                ['3', '4']
              ]
            }
          },
        }
      ],
    }
    const coordinatesOriginal = (geoJson.features[0].geometry as Polygon).coordinates;
    expect(coordinatesOriginal).toEqual(
      [[
        [100.0, 0.0],
        [101.0, 1.0]
      ],
      [
        [102.0, 2.0],
        [103.0, 3.0]
      ]]
    );

    const timestampsOriginal = geoJson.features[0].properties.coordinateProperties.times;
    expect(timestampsOriginal).toEqual(
      [
        ['1', '2'],
        ['3', '4']
      ]
    );

    const mergedGeoJson = mergeTackSegments(geoJson);

    expect(mergedGeoJson.features[0].geometry.type).toEqual('Polygon');

    const coordinatesResult = (mergedGeoJson.features[0].geometry as Polygon).coordinates;
    expect(coordinatesResult).toEqual(
      [[
        [100.0, 0.0],
        [101.0, 1.0]
      ],
      [
        [102.0, 2.0],
        [103.0, 3.0]
      ]]
    );

    const timestampsResult = mergedGeoJson.features[0].properties.coordinateProperties.times;
    expect(timestampsResult).toEqual(
      [
        ['1', '2'],
        ['3', '4']
      ]
    );
  })
});

describe('#clipTrackSegmentsBySize', () => {
  it('should ', () => {

  });
});

describe('#clipTrackSegmentBeforeCoord', () => {
  it('should ', () => {

  });
});

describe('#clipTrackSegmentAfterCoord', () => {
  it('should ', () => {

  });
});

describe('#splitTrackSegmentByCoord', () => {
  it('should ', () => {

  });
});

describe('#splitTrackSegmentBySpeed', () => {
  it('should ', () => {

  });
});

describe('#clipTrackSegmentAfterCoord', () => {
  it('should ', () => {

  });
});