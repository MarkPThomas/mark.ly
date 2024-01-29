import { ITrackCriteria, convertTrackToGlobalUnits } from './settings';

describe('#convertToGlobalDefaults', () => {
  it('should convert track criteria to the default set of units', () => {
    const trackCriteria = {
      units: {
        length: "miles",
        time: "hours",
        angle: "degrees"
      },
      activities: {
        hiking: {
          name: "Hiking",
          speed: {
            min: 0.25,
            max: 4
          }
        }
      },
      cruft: {
        gapDistanceMax: 3
      },
      noiseCloud: {
        speedMin: 0.25
      },
      misc: {
        gpsTimeInterval: 0.5
      }
    }

    const convertedTrackCriteria = convertTrackToGlobalUnits(trackCriteria as ITrackCriteria);

    expect(convertedTrackCriteria.cruft.gapDistanceMax).toBeCloseTo(4828, 0);
    expect(convertedTrackCriteria.noiseCloud.speedMin).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.misc.gpsTimeInterval).toBeCloseTo(1800, 0);

    expect(convertedTrackCriteria.activities.hiking.speed.min).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.activities.hiking.speed.max).toBeCloseTo(1.78816, 5);
  });

  it('should overwrite units that are re-specified deeper in the nesting when converting', () => {
    const trackCriteria = {
      units: {
        length: "miles",
        time: "hours",
        angle: "degrees"
      },
      activities: {
        hiking: {
          name: "Hiking",
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
            ascentRateMax: 3000,
            descentRateMax: 4500
          }
        }
      },
      misc: {
        units: {
          time: "seconds"
        },
        gpsTimeInterval: 30
      }
    }

    const convertedTrackCriteria = convertTrackToGlobalUnits(trackCriteria as ITrackCriteria);

    expect(convertedTrackCriteria.misc.gpsTimeInterval).toBeCloseTo(30, 0);

    expect(convertedTrackCriteria.activities.hiking.speed.min).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.activities.hiking.speed.max).toBeCloseTo(1.78816, 5);
    expect(convertedTrackCriteria.activities.hiking.rotation.angularVelocityMax).toBeCloseTo(1.0472, 4);
    expect(convertedTrackCriteria.activities.hiking.elevation.ascentRateMax).toBeCloseTo(0.254, 3);
    expect(convertedTrackCriteria.activities.hiking.elevation.descentRateMax).toBeCloseTo(0.381, 3);
  });

  it('should convert a full config file of differing units and overwrites', () => {
    const trackCriteria = {
      units: {
        length: "miles",
        time: "hours",
        angle: "degrees"
      },
      activities: {
        hiking: {
          name: "Hiking",
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
            ascentRateMax: 3000,
            descentRateMax: 4500
          }
        },
        cycling: {
          name: "Cycling",
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
            ascentRateMax: 2000,
            descentRateMax: 6000
          },
          slope: {
            units: {
              angle: "percent"
            },
            max: 30
          }
        }
      },
      cruft: {
        gapDistanceMax: 3
      },
      split: {
        stopDurationMax: 2,
        moveDurationMin: 0.04
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

    expect(convertedTrackCriteria.cruft.gapDistanceMax).toBeCloseTo(4828, 0);
    expect(convertedTrackCriteria.noiseCloud.speedMin).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.split.stopDurationMax).toBeCloseTo(7200, 0);
    expect(convertedTrackCriteria.misc.gpsTimeInterval).toBeCloseTo(30, 0);

    expect(convertedTrackCriteria.activities.hiking.name).toEqual('Hiking');
    expect(convertedTrackCriteria.activities.hiking.speed.min).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.activities.hiking.speed.max).toBeCloseTo(1.78816, 5);
    expect(convertedTrackCriteria.activities.hiking.rotation.angularVelocityMax).toBeCloseTo(1.0472, 4);
    expect(convertedTrackCriteria.activities.hiking.elevation.ascentRateMax).toBeCloseTo(0.254, 3);
    expect(convertedTrackCriteria.activities.hiking.elevation.descentRateMax).toBeCloseTo(0.381, 3);

    expect(convertedTrackCriteria.activities.cycling.name).toEqual('Cycling');
    expect(convertedTrackCriteria.activities.cycling.speed.min).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.activities.cycling.speed.max).toBeCloseTo(26.8224, 4);
    expect(convertedTrackCriteria.activities.cycling.rotation.angularVelocityMax).toBeCloseTo(2.0944, 4);
    expect(convertedTrackCriteria.activities.cycling.elevation.ascentRateMax).toBeCloseTo(0.1693, 4);
    expect(convertedTrackCriteria.activities.cycling.elevation.descentRateMax).toBeCloseTo(0.508, 3);
    expect(convertedTrackCriteria.activities.cycling.slope.max).toBeCloseTo(0.2915, 4);
  });

  it('should fill in defaults where not specified in the config file', () => {
    const trackCriteria = {};

    const convertedTrackCriteria = convertTrackToGlobalUnits(trackCriteria as ITrackCriteria);

    expect(convertedTrackCriteria.cruft.gapDistanceMax).toBeCloseTo(4828, 0);
    expect(convertedTrackCriteria.noiseCloud.speedMin).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.split.stopDurationMax).toBeCloseTo(10800, 0);
    expect(convertedTrackCriteria.misc.gpsTimeInterval).toBeCloseTo(30, 0);

    expect(convertedTrackCriteria.activities.hiking.name).toEqual('Hiking');
    expect(convertedTrackCriteria.activities.hiking.speed.min).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.activities.hiking.speed.max).toBeCloseTo(1.78816, 5);
    expect(convertedTrackCriteria.activities.hiking.rotation.angularVelocityMax).toBeCloseTo(1.0472, 4);
    expect(convertedTrackCriteria.activities.hiking.elevation.ascentRateMax).toBeCloseTo(0.254, 3);
    expect(convertedTrackCriteria.activities.hiking.elevation.descentRateMax).toBeCloseTo(0.381, 3);

    expect(convertedTrackCriteria.activities.cycling.name).toEqual('Cycling');
    expect(convertedTrackCriteria.activities.cycling.speed.min).toBeCloseTo(0.11176, 5);
    expect(convertedTrackCriteria.activities.cycling.speed.max).toBeCloseTo(26.8224, 4);
    expect(convertedTrackCriteria.activities.cycling.rotation.angularVelocityMax).toBeCloseTo(2.0944, 4);
    expect(convertedTrackCriteria.activities.cycling.elevation.ascentRateMax).toBeCloseTo(0.1693, 4);
    expect(convertedTrackCriteria.activities.cycling.elevation.descentRateMax).toBeCloseTo(0.508, 3);
    expect(convertedTrackCriteria.activities.cycling.slope.max).toBeCloseTo(0.2915, 4);
  });
});