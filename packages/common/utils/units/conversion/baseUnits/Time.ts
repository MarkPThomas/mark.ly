const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

export class Seconds {
  static toMinutes(seconds: number = 1) {
    return seconds / SECONDS_PER_MINUTE;
  }

  static toHours(seconds: number = 1) {
    return Minutes.toHours(Seconds.toMinutes(seconds));
  }

  static toDays(seconds: number = 1) {
    return Hours.toDays(Seconds.toHours(seconds));
  }

  static toWeeks(seconds: number = 1) {
    return Days.toWeeks(Seconds.toDays(seconds));
  }
}

export class Minutes {
  static toSeconds(minutes: number = 1) {
    return minutes * SECONDS_PER_MINUTE;
  }

  static toHours(minutes: number = 1) {
    return minutes / MINUTES_PER_HOUR;
  }

  static toDays(minutes: number = 1) {
    return Hours.toDays(Minutes.toHours(minutes));
  }

  static toWeeks(minutes: number = 1) {
    return Days.toWeeks(Minutes.toDays(minutes));
  }
}

export class Hours {
  static toSeconds(hours: number = 1) {
    return Minutes.toSeconds(Hours.toMinutes(hours));
  }

  static toMinutes(hours: number = 1) {
    return hours * MINUTES_PER_HOUR;
  }

  static toDays(hours: number = 1) {
    return hours / HOURS_PER_DAY;
  }

  static toWeeks(hours: number = 1) {
    return Days.toWeeks(Hours.toDays(hours));
  }
}

export class Days {
  static toSeconds(days: number = 1) {
    return Minutes.toSeconds(Days.toMinutes(days));
  }

  static toMinutes(days: number = 1) {
    return Hours.toMinutes(Days.toHours(days));
  }

  static toHours(days: number = 1) {
    return days * HOURS_PER_DAY;
  }

  static toWeeks(days: number = 1) {
    return days / DAYS_PER_WEEK;
  }
}

export class Weeks {
  static toSeconds(weeks: number = 1) {
    return Minutes.toSeconds(Weeks.toMinutes(weeks));
  }

  static toMinutes(weeks: number = 1) {
    return Hours.toMinutes(Weeks.toHours(weeks));
  }

  static toHours(weeks: number = 1) {
    return Days.toHours(Weeks.toDays(weeks));
  }

  static toDays(weeks: number = 1) {
    return weeks * DAYS_PER_WEEK;
  }
}

declare namespace Time {
  type Seconds = typeof Time.Seconds.prototype;
  type Minutes = typeof Time.Minutes.prototype;
  type Hours = typeof Time.Hours.prototype;
  type Days = typeof Time.Days.prototype;
  type Weeks = typeof Time.Weeks.prototype;
}

export class Time {
  static Seconds = Seconds;
  static Minutes = Minutes;
  static Hours = Hours;
  static Days = Days;
  static Weeks = Weeks;
}