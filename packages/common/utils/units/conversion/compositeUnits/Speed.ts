import { Length, Time } from '../baseUnits';

// TODO: Make more generic options, such as passing in each base unit & having this determine the actual speed type
export class Speed {
  static metersPerSecondToKph(metersPerSecond: number = 1) {
    const kilometersPerSecond = metersPerSecond / 1000;
    return kilometersPerSecond / Time.Seconds.toHours();
  }

  static kphToMetersPerSecond(kph: number = 1) {
    const metersPerHour = kph * 1000;
    return metersPerHour * Time.Seconds.toHours();
  }

  static kphToMph(kph: number = 1) {
    return Length.Kilometers.toMiles(kph);
  }

  static mphToKph(mph: number = 1) {
    return Length.Miles.toKilometers(mph);
  }
}