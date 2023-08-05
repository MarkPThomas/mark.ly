import { Time, Length } from './baseUnits';
import { Speed } from './compositeUnits';

declare namespace Conversion {
  type Time = typeof Conversion.Time.prototype;
  type Length = typeof Conversion.Length.prototype;
  type Speed = typeof Conversion.Speed.prototype;
}

export class Conversion {
  static Time = Time;
  static Length = Length;
  static Speed = Speed;
}