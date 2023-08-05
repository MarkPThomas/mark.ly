import { Length, Time } from '../baseUnits';

export class Speed {
  static metersPerSecondToKph(metersPerSecond: number = 1) {
    const kilometersPerSecond = metersPerSecond / 1000;
    return kilometersPerSecond / Time.secondsToHours();
  }

  static kphToMetersPerSecond(kph: number = 1) {
    const metersPerHour = kph * 1000;
    return metersPerHour * Time.secondsToHours();
  }

  static kphToMph(kph: number = 1) {
    return Length.Kilometers.toMiles(kph);
  }

  static mphToKph(mph: number = 1) {
    return Length.Miles.toKilometers(mph);
  }
}