import { Length, Time } from '../baseUnits';

// TODO: Make more generic options, such as passing in each base unit & having this determine the actual speed type
export class Speed {
  static metersPerSecondToFeetPerSecond(metersPerSecond: number = 1) {
    return Length.Meters.toFeet(metersPerSecond);
  }

  static metersPerSecondToFeetPerHour(metersPerSecond: number = 1) {
    const feetPerSecond = Speed.metersPerSecondToFeetPerSecond(metersPerSecond);
    return feetPerSecond / Time.Seconds.toHours();
  }

  static metersPerSecondToKph(metersPerSecond: number = 1) {
    const kilometersPerSecond = metersPerSecond / 1000;
    return kilometersPerSecond / Time.Seconds.toHours();
  }

  static metersPerSecondToMph(metersPerSecond: number = 1) {
    const milesPerSecond = Length.Meters.toMiles(metersPerSecond);
    return milesPerSecond / Time.Seconds.toHours();
  }


  static feetPerSecondToMetersPerSecond(feetPerSecond: number = 1) {
    return Length.Feet.toMeters(feetPerSecond);
  }


  static feetPerHourToMetersPerSecond(feetPerHour: number = 1) {
    const metersPerHour = Length.Feet.toMeters(feetPerHour);
    return metersPerHour * Time.Seconds.toHours();
  }


  static kphToMetersPerSecond(kph: number = 1) {
    const metersPerHour = kph * 1000;
    return metersPerHour * Time.Seconds.toHours();
  }

  static mphToMetersPerSecond(mph: number = 1) {
    const metersPerHour = Length.Miles.toKilometers(mph) * 1000;
    return metersPerHour * Time.Seconds.toHours();
  }

  static kphToMph(kph: number = 1) {
    return Length.Kilometers.toMiles(kph);
  }

  static mphToKph(mph: number = 1) {
    return Length.Miles.toKilometers(mph);
  }
}