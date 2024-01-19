import { ITrackPropertyProperties, TrackProperty } from './TrackProperty';

describe('##TrackProperty', () => {
  describe('Creation', () => {
    describe('#fromJson', () => {
      it('should make an object from the associated GeoJSON object', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['moo', 'nar']
          }
        };

        const properties = TrackProperty.fromJson(propertiesJson);

        expect(properties._gpxType).toEqual(propertiesJson._gpxType);
        expect(properties.name).toEqual(propertiesJson.name);
        expect(properties.time).toEqual(propertiesJson.time);
        expect(properties.coordinateProperties).toEqual(propertiesJson.coordinateProperties);
      });
    });

    describe('#fromTimestamps', () => {
      it('should add timestamps to a new copy of the TrackProperty', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: []
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const timeStamps = ['1', '2', '3'];

        const newProperties = properties.fromTimestamps(timeStamps);

        expect(properties._gpxType).toEqual(propertiesJson._gpxType);
        expect(properties.name).toEqual(propertiesJson.name);
        expect(properties.time).toEqual(propertiesJson.time);

        expect(newProperties.coordinateProperties.times).toEqual(timeStamps);
      });

      it('replace any existing timestamps with the provided timestamps as a new copy of the TrackProperty', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['moo', 'nar']
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const timeStamps = ['1', '2', '3'];

        const newProperties = properties.fromTimestamps(timeStamps);

        expect(properties._gpxType).toEqual(propertiesJson._gpxType);
        expect(properties.name).toEqual(propertiesJson.name);
        expect(properties.time).toEqual(propertiesJson.time);

        expect(newProperties.coordinateProperties.times).toEqual(timeStamps);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should return a copy of the values object, with a single timestamp', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: '1'
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesClone = properties.clone();

        expect(propertiesClone).toEqual(properties);
      });

      it('should return a copy of the values object, with timestamps nested 1 level deep', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesClone = properties.clone();

        expect(propertiesClone).toEqual(properties);
      });

      it('should return a copy of the values object, with timestamps nested 2 levels deep', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: [['1', '2'], ['3']]
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesClone = properties.clone();

        expect(propertiesClone).toEqual(properties);
      });
    });

    describe('#equals', () => {
      it('should return True for objects that are equal by certain properties, including timestamp nesting', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: '1'
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesSameJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: '1'
          }
        };
        const propertiesSame = TrackProperty.fromJson(propertiesSameJson);

        const result = properties.equals(propertiesSame);
        expect(result).toBeTruthy();


        const propertiesNest1Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const propertiesNest1 = TrackProperty.fromJson(propertiesNest1Json);

        const propertiesSameNest1Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const propertiesSameNest1 = TrackProperty.fromJson(propertiesSameNest1Json);

        const resultNest1 = propertiesNest1.equals(propertiesSameNest1);
        expect(resultNest1).toBeTruthy();


        const propertiesNest2Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: [['1', '2'], ['3']]
          }
        };
        const propertiesNest2 = TrackProperty.fromJson(propertiesNest2Json);

        const propertiesSameNest2Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: [['1', '2'], ['3']]
          }
        };
        const propertiesSameNest2 = TrackProperty.fromJson(propertiesSameNest2Json);

        const resultNest2 = propertiesNest2.equals(propertiesSameNest2);
        expect(resultNest2).toBeTruthy();
      });

      it('should return False for objects that are not equal by header properties', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesDiffValJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Moo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const propertiesDiffVal = TrackProperty.fromJson(propertiesDiffValJson);

        const resultDiffVal = properties.equals(propertiesDiffVal);
        expect(resultDiffVal).toBeFalsy();
      });

      it('should return False for objects that are not equal by timestamps values', () => {
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesDiffValJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '3', '4']
          }
        };
        const propertiesDiffVal = TrackProperty.fromJson(propertiesDiffValJson);

        const resultDiffVal = properties.equals(propertiesDiffVal);
        expect(resultDiffVal).toBeFalsy();
      });

      it('should return False for objects that are not equal by timestamps nesting', () => {
        const propertiesNoNestingJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: '1'
          }
        };
        const propertiesNoNesting = TrackProperty.fromJson(propertiesNoNestingJson);


        const propertiesNesting1Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1']
          }
        };
        const propertiesNesting1 = TrackProperty.fromJson(propertiesNesting1Json);

        const resultNesting1 = propertiesNoNesting.equals(propertiesNesting1);

        expect(resultNesting1).toBeFalsy();


        const propertiesNesting2Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: [['1']]
          }
        };
        const propertiesNesting2 = TrackProperty.fromJson(propertiesNesting2Json);

        const resultNesting2 = propertiesNoNesting.equals(propertiesNesting2);

        expect(resultNesting1).toBeFalsy();


        const resultNesting1_2 = propertiesNesting1.equals(propertiesNesting2);

        expect(resultNesting1_2).toBeFalsy();



        // More complex comparisons
        const propertiesJson: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: ['1', '2', '3']
          }
        };
        const properties = TrackProperty.fromJson(propertiesJson);

        const propertiesDiffNesting1Json: ITrackPropertyProperties = {
          _gpxType: 'trk',
          name: 'Foo',
          time: 'Bar',
          coordinateProperties: {
            times: [['1', '2'], ['3']]
          }
        };
        const propertiesDiffNesting1 = TrackProperty.fromJson(propertiesDiffNesting1Json);

        const resultDiffNesting1 = properties.equals(propertiesDiffNesting1);

        expect(resultDiffNesting1).toBeFalsy();
      });
    });
  });
});