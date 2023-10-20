import { ITrackCriteria, convertTrackToGlobalUnits } from './settings';

describe('#convertToGlobalDefaults', () => {
  it('should convert track criteria to the default set of units', () => {
    const trackCriteria = {
      units: {
        length: "miles",
        time: "hours",
        angle: "degrees"
      },
      activities: [
        {
          activity: "Hiking",
          speed: {
            min: 0.25,
            max: 4
          }
        }
      ],
      cruft: {
        pointSeparationLimit: 3
      },
      noiseCloud: {
        speedMin: 0.25
      },
      misc: {
        gpsTimeInterval: 0.5
      }
    }

    const convertedTrackCriteria = convertTrackToGlobalUnits(trackCriteria as ITrackCriteria);

    expect(convertedTrackCriteria).toEqual({
      units: {
        length: 'meters',
        time: 'seconds',
        angle: 'radians'
      },
      activities: [
        {
          activity: "Hiking",
          speed: {
            min: 0.11176,
            max: 1.78816
          }
        }
      ],
      cruft: {
        pointSeparationLimit: 4.82803
      },
      noiseCloud: {
        speedMin: 0.11176
      },
      misc: {
        gpsTimeInterval: 1800
      }
    });
  });

  it('should overwrite units that are re-specified deeper in the nesting when converting', () => {
    const trackCriteria = {
      units: {
        length: "miles",
        time: "hours",
        angle: "degrees"
      },
      activities: [
        {
          activity: "Hiking",
          speed: {
            min: 0.25,
            max: 4
          },
          rotation: {
            units: {
              angle: "degrees",
              time: "seconds"
            },
            angularVelocityMax: 60
          },
          elevation: {
            units: {
              length: "feet"
            },
            maxAscentRate: 3000,
            maxDescentRate: 4500
          }
        }
      ],
      misc: {
        units: {
          time: "seconds"
        },
        gpsTimeInterval: 30
      }
    }

    const convertedTrackCriteria = convertTrackToGlobalUnits(trackCriteria as ITrackCriteria);

    expect(convertedTrackCriteria).toEqual({
      units: {
        length: 'meters',
        time: 'seconds',
        angle: 'radians'
      },
      activities: [
        {
          activity: "Hiking",
          speed: {
            min: 0.11176,
            max: 1.78816
          },
          rotation: {
            angularVelocityMax: 60
          },
          elevation: {
            maxAscentRate: 914.4,
            maxDescentRate: 1371.6
          }
        }
      ],
      misc: {
        gpsTimeInterval: 30
      }
    });
  });

  it('should convert a full config file of differing units and overwrites', () => {
    const trackCriteria = {
      units: {
        length: "miles",
        time: "hours",
        angle: "degrees"
      },
      activities: [
        {
          activity: "Hiking",
          speed: {
            min: 0.25,
            max: 4
          },
          rotation: {
            units: {
              angle: "degrees",
              time: "seconds"
            },
            angularVelocityMax: 60
          },
          elevation: {
            units: {
              length: "feet"
            },
            maxAscentRate: 3000,
            maxDescentRate: 4500
          }
        },
        {
          activity: "Cycling",
          speed: {
            min: 0.25,
            max: 60
          },
          rotation: {
            units: {
              angle: "degrees",
              time: "seconds"
            },
            angularVelocityMax: 120
          },
          elevation: {
            units: {
              length: "feet"
            },
            maxAscentRate: 2000,
            maxDescentRate: 6000
          },
          slope: {
            units: {
              angle: "percent"
            },
            max: 30
          }
        }
      ],
      cruft: {
        pointSeparationLimit: 3
      },
      noiseCloud: {
        speedMin: 0.25
      },
      misc: {
        units: {
          time: "seconds"
        },
        gpsTimeInterval: 30
      }
    }

    const convertedTrackCriteria = convertTrackToGlobalUnits(trackCriteria as ITrackCriteria);

    expect(convertedTrackCriteria).toEqual({
      units: {
        length: 'meters',
        time: 'seconds',
        angle: 'radians'
      },
      activities: [
        {
          activity: "Hiking",
          speed: {
            min: 0.11176,
            max: 1.78816
          },
          rotation: {
            angularVelocityMax: 1.0472
          },
          elevation: {
            maxAscentRate: 914.4,
            maxDescentRate: 1371.6
          }
        },
        {
          activity: "Cycling",
          speed: {
            min: 0.11176,
            max: 26.8224
          },
          rotation: {
            angularVelocityMax: 2.0944
          },
          elevation: {
            maxAscentRate: 609.6,
            maxDescentRate: 1828.8
          },
          slope: {
            max: 1.8849555921538803
          }
        }
      ],
      cruft: {
        pointSeparationLimit: 4.82803
      },
      noiseCloud: {
        speedMin: 0.11176
      },
      misc: {
        gpsTimeInterval: 30
      }
    });
  });
});