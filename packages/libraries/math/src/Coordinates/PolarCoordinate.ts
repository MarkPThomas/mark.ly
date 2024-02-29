import { IEquatable } from '@markpthomas/common-libraries/interfaces';

import { Cartesian2DPolarConverter } from '../coordinate-converters/Cartesian2DPolarConverter';
import { Numbers } from '../Numbers';
import { Angle } from './Angle';
import { CartesianCoordinate } from './CartesianCoordinate';
import { ICoordinate } from './ICoordinate';
import { PolarOffset } from './PolarOffset';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @export
 * @interface IPolarJson
 * @typedef {IPolarJson}
 */
export interface IPolarJson {
  /**
   * The radius, r, which is the shortest distance from the origin.
   * @type {number}
   */
  radius: number;

  /**
   * The azimuth angle, φ, measured CCW from a horizontal line pointing +X in Cartesian coordinates from the origin.
   * @type {number}
   */
  azimuth: {
    degrees?: number;
    radians?: number;
  };
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @export
 * @interface IPolarData
 * @typedef {IPolarData}
 */
export interface IPolarData {
  /**
   * The radius, r, which is the shortest distance from the origin.
   * @type {number}
   */
  radius: number;

  /**
    * The azimuth angle, φ, measured CCW from a horizontal line pointing +X in Cartesian coordinates from the origin.
    * @type {Angle}
    */
  azimuth: Angle;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @export
 * @interface IPolarCoordinate
 * @typedef {IPolarCoordinate}
 * @extends {ICoordinate}
 * @extends {IPolarData}
 */
export interface IPolarCoordinate extends ICoordinate, IPolarData {
}

/**
 * A two-dimensional coordinate system in which each point on a plane is determined by a distance from a reference point and an angle from a reference direction.
 * Polar coordinates are points labeled (r,θ) and plotted on a polar grid.
 * @see {@link https://en.wikipedia.org/wiki/Polar_coordinate_system}
 * @implements {IEquatable<PolarCoordinate>}
 * @implements {ICoordinate}
 */
export class PolarCoordinate implements IPolarCoordinate, IEquatable<PolarCoordinate> {
  // TODO: Handle ability to make polar coordinates unique:
  // Where a unique representation is needed for any point besides the pole,
  //    it is usual to limit r to positive numbers (r > 0)
  //    and φ to the interval [0, 360°] or [−180°, 180°] (in radians, [0, 2π] or [−π, π]).

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @type {number}
 */
  Tolerance: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @readonly
 * @type {number}
 */
  readonly radius: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @readonly
 * @type {Angle}
 */
  readonly azimuth: Angle;

  // ==== Creation
  /**
   * Initializes a new instance of the PolarCoordinate struct.
   * @param {number} radius The distance from a reference point.
   * @param {Angle | number} azimuth The angle from a reference direction. If it is a number, it is assumed to be in radians.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   */
  protected constructor(
    radius: number = 0,
    azimuth: Angle | number = 0,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.radius = radius;
    this.azimuth = typeof azimuth === 'number' ? Angle.fromRadians(azimuth) : azimuth ?? Angle.atOrigin();
    this.Tolerance = tolerance;
  }

  /**
   * Initializes a new instance of the PolarCoordinate at the origin.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static atOrigin(): PolarCoordinate {
    return new PolarCoordinate(0, 0);
  }

  /**
   * Initializes a new instance with JSON.
   * @param {IPolarJson} json JSON representation of the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromJson(
    json: IPolarJson,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarCoordinate {
    return json.azimuth.degrees
      ? PolarCoordinate.fromDegrees(json.radius, json.azimuth.degrees, tolerance)
      : PolarCoordinate.fromRadians(json.radius, json.azimuth.radians ?? 0, tolerance);
  }

  /**
   * Initializes a new instance with a data object.
   * @param {IPolarData} data Minimum data for the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromData(
    data: IPolarData,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarCoordinate {
    return PolarCoordinate.fromAngle(data.radius, data.azimuth, tolerance);
  }

  /**
   * Initializes a new instance with an Angle.
   * @param {number} radius The distance from a reference point.
   * @param {Angle} azimuth The angle from a reference direction [Angle].
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromAngle(
    radius: number,
    azimuth: Angle,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarCoordinate {
    return new PolarCoordinate(Math.abs(radius), azimuth, tolerance);
  }

  /**
   * Initializes a new an angle in radians.
   * @param {number} radius The distance from a reference point.
   * @param {number} azimuth The angle from a reference direction [radians].
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromRadians(
    radius: number,
    azimuth: number,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarCoordinate {
    if (radius < 0) {
      azimuth -= Math.PI / 2;
    }
    return new PolarCoordinate(Math.abs(radius), azimuth, tolerance);
  }

  /**
   * Initializes a new an angle in degrees.
   * @param {number} radius The distance from a reference point.
   * @param {number} azimuth The angle from a reference direction [degrees].
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromDegrees(
    radius: number,
    azimuth: number,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarCoordinate {
    if (radius < 0) {
      azimuth -= 180;
    }
    azimuth = Angle.DegreesToRadians(azimuth);
    return new PolarCoordinate(Math.abs(radius), azimuth, tolerance);
  }

  // TODO: Finish
  /// <summary>
  /// Returns a new coordinate offset from the provided coordinate.
  /// </summary>
  /// <param name="distance">The distance to offset.</param>
  /// <param name="center">The center.</param>
  /// <param name="rotation">The rotation.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @static
 * @param {PolarCoordinate} center
 * @param {number} distance
 * @param {Angle} rotation
 * @returns {PolarCoordinate}
 */
  static fromCoordinateOffset(
    center: PolarCoordinate,
    distance: number,
    rotation: Angle
  ): PolarCoordinate {
    throw new Error();
    // let x = center.X + distance * Trig.Cos(rotation.Radians);
    // if (Numbers.IsZeroSign(x, center.Tolerance)) {
    //   x = 0;
    // }

    // let y = center.Y + distance * Trig.Sin(rotation.Radians);
    // if (Numbers.IsZeroSign(y, center.Tolerance)) {
    //   y = 0;
    // }

    // return PolarCoordinate.fromXY(x, y, center.Tolerance);
  }

  /// <summary>
  /// Returns a new coordinate offset by the provided parameters.
  /// </summary>
  /// <param name="distance">The distance to offset.</param>
  /// <param name="rotation">The rotation.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @param {number} distance
 * @param {Angle} rotation
 * @returns {PolarCoordinate}
 */
  offsetCoordinate(distance: number, rotation: Angle): PolarCoordinate {
    return PolarCoordinate.fromCoordinateOffset(this, distance, rotation);
  }

  // ==== I/0
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @returns {string}
 */
  toString(): string {
    return `${PolarCoordinate.name} - radius:${this.radius}, azimuth:${this.azimuth.Radians}`;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @returns {IPolarData}
 */
  toData(): IPolarData {
    return {
      radius: this.radius,
      azimuth: this.azimuth
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @param {boolean} asDegrees
 * @returns {IPolarJson}
 */
  toJson(asDegrees: boolean): IPolarJson {
    const azimuth = asDegrees ? {
      degrees: this.azimuth.Degrees
    } : {
      radians: this.azimuth.Radians
    }

    return {
      radius: this.radius,
      azimuth: {
        ...azimuth
      }
    }
  }

  // ==== Conversion
  /**
   * Converts the polar coordinate to a cartesian coordinate.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  toCartesian(): CartesianCoordinate {
    return Cartesian2DPolarConverter.toCartesian(this);
  }

  // === Comparison
  /**
   * Indicates whether the current object is equal to another object.
   * @param {PolarCoordinate | IPolarData | ICoordinate} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: PolarCoordinate | IPolarData | ICoordinate): boolean {

    if (other instanceof PolarCoordinate) {
      const tolerance = Math.min(this.Tolerance, other.Tolerance);
      return (
        Numbers.AreEqual(this.azimuth.Radians, other.azimuth.Radians, tolerance) &&
        Numbers.AreEqual(this.radius, other.radius, tolerance)
      );
    } else if (other instanceof CartesianCoordinate) {
      return this.equals(Cartesian2DPolarConverter.toPolar(other));
    }

    return false;
  }

  // ==== Methods

  /// <summary>
  /// Returns the polar offset of the current coordinate from the provided coordinate.
  /// i.e. the current coordinate subtracting the provided coordinate.
  /// </summary>
  /// <param name="coordinateI">The coordinate i.</param>
  /// <returns>AngularOffset.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:31 PM
 *
 * @param {PolarCoordinate} coordinateI
 * @returns {PolarOffset}
 */
  offsetFrom(coordinateI: PolarCoordinate): PolarOffset {
    return PolarOffset.fromCoordinates(coordinateI, this);
  }

  // ==== Change Azimuth
  /**
   * Adds the angle, in radians, to the angle of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  addAngleAzimuthRadians(angle: number): PolarCoordinate {
    return this.changeAngleAzimuthRadians(this.azimuth.Radians + angle);
  }

  /**
   * Adds the angle, in degrees, to the angle of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  addAngleAzimuthDegrees(angle: number): PolarCoordinate {
    return this.changeAngleAzimuthRadians(this.azimuth.Radians + Angle.DegreesToRadians(angle));
  }


  /**
   * Subtracts the angle, in radians, from the angle of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  subtractAngleAzimuthRadians(angle: number): PolarCoordinate {
    return this.changeAngleAzimuthRadians(this.azimuth.Radians - angle);
  }

  /**
   * Subtracts the angle, in degrees, from the angle of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  subtractAngleAzimuthDegrees(angle: number): PolarCoordinate {
    return this.changeAngleAzimuthRadians(this.azimuth.Radians - Angle.DegreesToRadians(angle));
  }

  /**
   * Multiplies the angle of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  multiplyAngleAzimuthBy(multiplier: number): PolarCoordinate {
    return this.changeAngleAzimuthRadians(this.azimuth.Radians * multiplier);
  }

  /**
   * Divides the angle of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  divideAngleAzimuthBy(denominator: number): PolarCoordinate {
    if (Numbers.IsZeroSign(denominator, this.Tolerance)) {
      throw new Error("Polar Coordinate angle cannot be divided by 0.");
    }
    return this.changeAngleAzimuthRadians(this.azimuth.Radians / denominator);
  }

  /**
     * Changes the angle of the current coordinate to the provided angle, in radians.
     * @param {number} angle The new angle [radians].
     * @returns {PolarCoordinate} A new instance of `PolarCoordinate` with the updated angle.
     */
  private changeAngleAzimuthRadians(angle: number): PolarCoordinate {
    return new PolarCoordinate(this.radius, angle, this.Tolerance);
  }

  // ==== Change Radius
  /**
   * Adds the amount to the radius of the current coordinate.
   * @param {number} value The amount to add to the radius.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  addToRadius(value: number): PolarCoordinate {
    return this.changeRadius(this.radius + value);
  }

  /**
   * Subtracts the amount from the radius of the current coordinate.
   * @param {number} value The amount to subtract from the radius.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  subtractFromRadius(value: number): PolarCoordinate {
    return this.changeRadius(this.radius - value);
  }

  /**
   * Multiplies the radius of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  multiplyRadiusBy(multiplier: number): PolarCoordinate {
    return this.changeRadius(this.radius * multiplier);
  }

  /**
   * Divides the radius of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  divideRadiusBy(denominator: number): PolarCoordinate {
    if (Numbers.IsZeroSign(denominator, this.Tolerance)) {
      throw new Error("Polar Coordinate radius cannot be divided by 0.");
    }
    return this.changeRadius(this.radius / denominator);
  }

  /**
   * Changes the radius of the current coordinate to the provided radius.
   * @param {number} radius The new radius.
   * @returns {PolarCoordinate} A new instance of `PolarCoordinate` with the updated radius.
   */
  private changeRadius(radius: number): PolarCoordinate {
    return new PolarCoordinate(radius, this.azimuth, this.Tolerance);
  }

  // ==== Scale
  /**
   * Scales all properties of the coordinate by multiplication.
   * @param {number} multiplier Multiplier value.
   * @param {PolarCoordinate} coordinate Polar coordinate.
   * @returns {PolarCoordinate} The result of the operator.
   */
  static multiply(coordinate: PolarCoordinate, multiplier: number): PolarCoordinate {
    return new PolarCoordinate(
      coordinate.radius * multiplier,
      coordinate.azimuth.multiplyBy(multiplier),
      coordinate.Tolerance
    );
  }

  /**
   * Scales all properties of the coordinate by multiplication.
   * @param {number} multiplier Multiplier value.
   * @returns {PolarCoordinate} The result of the operator.
   */
  multiplyBy(multiplier: number): PolarCoordinate {
    return PolarCoordinate.multiply(this, multiplier);
  }

  /**
   * Scales all properties of the coordinate by division.
   * @param {PolarCoordinate} coordinate Polar coordinate.
   * @param {number} denominator The denominator value.
   * @returns {PolarCoordinate} The result of the operator.
   */
  static divide(coordinate: PolarCoordinate, denominator: number): PolarCoordinate {
    return new PolarCoordinate(
      coordinate.radius / denominator,
      coordinate.azimuth.divideBy(denominator),
      coordinate.Tolerance
    );
  }

  /**
   * Scales all properties of the coordinate by division.
   * @param {number} denominator The denominator value.
   * @returns {PolarCoordinate} The result of the operator.
   */
  divideBy(denominator: number): PolarCoordinate {
    return PolarCoordinate.divide(this, denominator);
  }
}
