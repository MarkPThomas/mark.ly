export class Time {
  protected static SECONDS_PER_MINUTE = 60;
  protected static MINUTES_PER_HOUR = 60;

  static secondsToHours(seconds: number = 1) {
    return seconds / this.SECONDS_PER_MINUTE / this.MINUTES_PER_HOUR;
  }

  static hoursToSeconds(hours: number = 1) {
    return hours * this.MINUTES_PER_HOUR * this.SECONDS_PER_MINUTE;
  }
}