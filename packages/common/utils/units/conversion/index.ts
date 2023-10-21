import { IUnitOverrides, IUnits } from './baseUnits/Units';

export * from './Conversion';
export * from './baseUnits/Units';

export function getLocalUnits(localOverrides: IUnitOverrides, globalUnits: IUnits) {
  let localUnits: IUnits = globalUnits;

  if (localOverrides) {
    localUnits = { ...globalUnits };

    if (localOverrides.angle) {
      localUnits.angle = localOverrides.angle;
    }

    if (localOverrides.length) {
      localUnits.length = localOverrides.length;
    }

    if (localOverrides.time) {
      localUnits.time = localOverrides.time;
    }
  }

  return localUnits;
}