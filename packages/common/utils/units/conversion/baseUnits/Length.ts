export class Feet {
  protected static PER_METER = 3.28084;
  protected static PER_MILE = 5280;

  static toMeters(feet: number = 1) {
    return feet / this.PER_METER;
  }

  static toMiles(feet: number = 1) {
    return feet / this.PER_MILE;
  }
}

export class Miles {
  static toFeet(miles: number = 1) {
    return miles / Feet.toMiles();
  }

  static toKilometers(miles: number = 1) {
    const meters = Feet.toMeters(this.toFeet(miles));
    return meters / 1000;
  }
}

export class Meters {
  static toFeet(meters: number = 1) {
    return meters / Feet.toMeters();
  }
}

export class Kilometers {
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