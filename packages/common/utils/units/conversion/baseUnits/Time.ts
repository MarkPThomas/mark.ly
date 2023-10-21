export class Seconds {
  protected static SECONDS_PER_MINUTE = 60;

  static toMinutes(seconds: number = 1) {
    return seconds / Seconds.SECONDS_PER_MINUTE;
  }

  static toHours(seconds: number = 1) {
    return Minutes.toHours(Seconds.toMinutes(seconds));
  }
}

export class Minutes {
  protected static SECONDS_PER_MINUTE = 60;
  protected static MINUTES_PER_HOUR = 60;

  static toSeconds(minutes: number = 1) {
    return minutes * Minutes.SECONDS_PER_MINUTE;
  }

  static toHours(minutes: number = 1) {
    return minutes / Minutes.MINUTES_PER_HOUR;
  }
}

export class Hours {
  protected static MINUTES_PER_HOUR = 60;

  static toMinutes(hours: number = 1) {
    return hours * Hours.MINUTES_PER_HOUR;
  }

  static toSeconds(hours: number = 1) {
    return Minutes.toSeconds(hours * Hours.MINUTES_PER_HOUR);
  }
}

declare namespace Time {
  type Seconds = typeof Time.Seconds.prototype;
  type Minutes = typeof Time.Minutes.prototype;
  type Hours = typeof Time.Hours.prototype;
  // type Days = typeof Time.Days.prototype;
  // type Weeks = typeof Time.Weeks.prototype;
}

export class Time {
  static Seconds = Seconds;
  static Minutes = Minutes;
  static Hours = Hours;
  // static Days = Days;
  // static Weeks = Weeks;
}