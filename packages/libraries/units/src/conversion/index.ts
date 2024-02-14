import { IUnitOverrides, IUnits } from './baseUnits/Units';

export * from './Conversion';
export * from './baseUnits';
export * from './compositeUnits';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:07 PM
 *
 * @export
 * @param {IUnitOverrides} localOverrides
 * @param {IUnits} globalUnits
 * @returns {IUnits}
 */
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