export class Feet {
  protected static PER_METER = 3.28084;
  protected static PER_MILE = 5280;

  static toMeters(feet: number = 1) {
    return feet / Feet.PER_METER;
  }

  static toMiles(feet: number = 1) {
    return feet / Feet.PER_MILE;
  }

  static toKilometers(feet: number = 1) {
    return Feet.toMeters(feet) / 1000;
  }
}

export class Miles {
  static toFeet(miles: number = 1) {
    return miles / Feet.toMiles();
  }

  static toMeters(miles: number = 1) {
    return Feet.toMeters(Miles.toFeet(miles));
  }

  static toKilometers(miles: number = 1) {
    const meters = Feet.toMeters(Miles.toFeet(miles));
    return meters / 1000;
  }
}

export class Meters {
  static toKilometers(meters: number = 1) {
    return meters / 1000;
  }

  static toFeet(meters: number = 1) {
    return meters / Feet.toMeters();
  }

  static toMiles(meters: number = 1) {
    return Feet.toMiles(Meters.toFeet(meters));
  }
}

export class Kilometers {
  static toMeters(kilometers: number = 1) {
    return kilometers / 1000;
  }

  static toFeet(kilometers: number = 1) {
    return Meters.toFeet(Kilometers.toMeters(kilometers));
  }

  static toMiles(kilometers: number = 1) {
    const meters = kilometers * 1000;
    return Feet.toMiles(Meters.toFeet(meters));
  }
}


declare namespace Length {
  type Feet = typeof Length.Feet.prototype;
  type Miles = typeof Length.Miles.prototype;
  type Meters = typeof Length.Meters.prototype;
  type Kilometers = typeof Length.Kilometers.prototype;
}

export class Length {
  static Feet = Feet;
  static Miles = Miles;
  static Meters = Meters;
  static Kilometers = Kilometers;
}