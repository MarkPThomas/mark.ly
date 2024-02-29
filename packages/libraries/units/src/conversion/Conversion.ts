import { toUpperFirstLetter } from '@markpthomas/common-libraries/utils';

import {
  IUnits,
  Angle,
  eAngle,
  Length,
  eLength,
  Time,
  eTime
} from './baseUnits';
import { Speed } from './compositeUnits';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @type {IUnits}
 */
const defaultUnits: IUnits = {
  length: eLength.meters,
  time: eTime.seconds,
  angle: eAngle.radians
}

declare namespace Conversion {
  type Angle = typeof Conversion.Angle.prototype;
  type Time = typeof Conversion.Time.prototype;
  type Length = typeof Conversion.Length.prototype;
  type Speed = typeof Conversion.Speed.prototype;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @export
 * @class Conversion
 * @typedef {Conversion}
 */
export class Conversion {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof Angle}
 */
  static Angle = Angle;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof Time}
 */
  static Time = Time;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {typeof Length}
 */
  static Length = Length;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @static
 * @type {*}
 */
  static Speed = Speed;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @private
 * @type {IUnits}
 */
  private _globalUnits: IUnits;

  /**
 * Creates an instance of Conversion.
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @constructor
 * @param {IUnits} [globalUnits=defaultUnits]
 */
  constructor(globalUnits: IUnits = defaultUnits) {
    this._globalUnits = globalUnits;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @param {number} value
 * @param {IUnits} fromUnits
 * @param {IUnits} [toUnits=this._globalUnits]
 * @returns {(number | undefined)}
 */
  convertAngularSpeed(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number | undefined {
    value = this.convertAngle(value, fromUnits, toUnits);
    const denominator = this.convertTime(1, fromUnits, toUnits);

    return denominator ? value / denominator : undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @param {number} value
 * @param {IUnits} fromUnits
 * @param {IUnits} [toUnits=this._globalUnits]
 * @returns {(number | undefined)}
 */
  convertSpeed(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number | undefined {
    value = this.convertLength(value, fromUnits, toUnits);
    const denominator = this.convertTime(1, fromUnits, toUnits);

    return denominator ? value / denominator : undefined;
  }



  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @param {number} value
 * @param {IUnits} fromUnits
 * @param {IUnits} [toUnits=this._globalUnits]
 * @returns {number}
 */
  convertLength(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number {
    return this.convertedUnit(value, fromUnits.length, toUnits.length, this.getLengthConversionMethod);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @private
 * @param {string} fromUnit
 * @param {string} [toUnit=this._globalUnits.length]
 * @returns {((val: number) => number) | null}
 */
  private getLengthConversionMethod(
    fromUnit: string,
    toUnit: string = this._globalUnits.length
  ): ((val: number) => number) | null {
    const fromUnitClass = toUpperFirstLetter(fromUnit);    // Feet
    const toUnitMethod = `to${toUpperFirstLetter(toUnit)}`;   // toMeters


    return ((Conversion.Length as any)[fromUnitClass] && (Conversion.Length as any)[fromUnitClass][toUnitMethod])
      ? (Conversion.Length as any)[fromUnitClass][toUnitMethod]
      : null;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @param {number} value
 * @param {IUnits} fromUnits
 * @param {IUnits} [toUnits=this._globalUnits]
 * @returns {number}
 */
  convertTime(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number {
    return this.convertedUnit(value, fromUnits.time, toUnits.time, this.getTimeConversionMethod);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @private
 * @param {string} fromUnit
 * @param {string} [toUnit=this._globalUnits.time]
 * @returns {((val: number) => number) | null}
 */
  private getTimeConversionMethod(
    fromUnit: string,
    toUnit: string = this._globalUnits.time
  ): ((val: number) => number) | null {
    const fromUnitClass = toUpperFirstLetter(fromUnit);
    const toUnitMethod = `to${toUpperFirstLetter(toUnit)}`;

    return ((Conversion.Time as any)[fromUnitClass] && (Conversion.Time as any)[fromUnitClass][toUnitMethod])
      ? (Conversion.Time as any)[fromUnitClass][toUnitMethod]
      : null;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @param {number} value
 * @param {IUnits} fromUnits
 * @param {IUnits} [toUnits=this._globalUnits]
 * @returns {number}
 */
  convertAngle(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number {
    return this.convertedUnit(value, fromUnits.angle, toUnits.angle, this.getAngleConversionMethod);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @private
 * @param {string} fromUnit
 * @param {string} [toUnit=this._globalUnits.angle]
 * @returns {((val: number) => number) | null}
 */
  private getAngleConversionMethod(
    fromUnit: string,
    toUnit: string = this._globalUnits.angle
  ): ((val: number) => number) | null {
    const fromUnitClass = toUpperFirstLetter(fromUnit);
    const toUnitMethod = `to${toUpperFirstLetter(toUnit)}`;

    return ((Conversion.Angle as any)[fromUnitClass] && (Conversion.Angle as any)[fromUnitClass][toUnitMethod])
      ? (Conversion.Angle as any)[fromUnitClass][toUnitMethod]
      : null;
  }



  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @private
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @param {(from: string, to: string) => ((val: number) => number) | null} getConversionMethod
 * @returns {number}
 */
  private convertedUnit(
    value: number,
    fromUnit: string,
    toUnit: string,
    getConversionMethod: (from: string, to: string) => ((val: number) => number) | null
  ): number {
    if (this.unitsDiffer(fromUnit, toUnit) && getConversionMethod) {
      const convertMethod = getConversionMethod(fromUnit, toUnit);
      if (convertMethod) {
        return convertMethod(value);
      } else {
        console.log(`Conversion method not found for '${fromUnit}' to '${toUnit}'. Unit will not be converted.`);
      }
    }

    return value;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:08 PM
 *
 * @private
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {boolean}
 */
  private unitsDiffer(fromUnit: string, toUnit: string): boolean {
    return fromUnit.toLowerCase() !== toUnit.toLowerCase()
  }
}