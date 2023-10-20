import { toUpperFirstLetter } from '../../stringFormatting';
import {
  IUnits,
  Angle,
  eAngle,
  Length as LengthClass,
  eLength,
  Time,
  eTime
} from './baseUnits';
import { Speed } from './compositeUnits';

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

export class Conversion {
  static Angle = Angle;
  static Time = Time;
  static Length = LengthClass;
  static Speed = Speed;

  private _globalUnits: IUnits;

  constructor(globalUnits: IUnits = defaultUnits) {
    this._globalUnits = globalUnits;
  }

  convertAngularSpeed(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number | undefined {
    value = this.convertAngle(value, fromUnits, toUnits);
    const denominator = this.convertTime(1, fromUnits, toUnits);

    return denominator ? value / denominator : undefined;
  }

  convertSpeed(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number | undefined {
    value = this.convertLength(value, fromUnits, toUnits);
    const denominator = this.convertTime(1, fromUnits, toUnits);

    return denominator ? value / denominator : undefined;
  }



  convertLength(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number {
    return this.convertedUnit(value, fromUnits.length, toUnits.length, this.getLengthConversionMethod);
  }

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


  convertTime(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number {
    return this.convertedUnit(value, fromUnits.time, toUnits.time, this.getTimeConversionMethod);
  }

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


  convertAngle(
    value: number,
    fromUnits: IUnits,
    toUnits: IUnits = this._globalUnits
  ): number {
    return this.convertedUnit(value, fromUnits.angle, toUnits.angle, this.getAngleConversionMethod);
  }

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


  private unitsDiffer(fromUnit: string, toUnit: string): boolean {
    return fromUnit.toLowerCase() !== toUnit.toLowerCase()
  }
}