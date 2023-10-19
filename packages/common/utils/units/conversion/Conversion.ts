import { Time, Length, Angle } from './baseUnits';
import { Speed } from './compositeUnits';

declare namespace Conversion {
  type Angle = typeof Conversion.Angle.prototype;
  type Time = typeof Conversion.Time.prototype;
  type Length = typeof Conversion.Length.prototype;
  type Speed = typeof Conversion.Speed.prototype;
}

export class Conversion {
  static Angle = Angle;
  static Time = Time;
  static Length = Length;
  static Speed = Speed;
}