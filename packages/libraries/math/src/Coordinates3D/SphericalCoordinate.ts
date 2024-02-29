import { IEquatable } from "@markpthomas/common-libraries/interfaces";

import { Angle } from "../coordinates/Angle";
import { Numbers } from "../Numbers";
import { CartesianCoordinate3D } from "./CartesianCoordinate3D";
import { CylindricalCoordinate } from "./CylindricalCoordinate";
import { ICoordinate3D } from "./ICoordinate3D";
import { SphericalOffset } from "./SphericalOffset";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface ISphericalJson
 * @typedef {ISphericalJson}
 */
export interface ISphericalJson {
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

  /**
   * The inclination angle, θ, which lies in the vertical plane sweeping out from the Z-axis.
   * @type {number}
   */
  inclination: {
    degrees?: number;
    radians?: number;
  };
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface ISphericalData
 * @typedef {ISphericalData}
 */
export interface ISphericalData {
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

  /**
    * The inclination angle, θ, which lies in the vertical plane sweeping out from the Z-axis.
    * @type {number}
    */
  inclination: Angle;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface ISphericalCoordinate
 * @typedef {ISphericalCoordinate}
 * @extends {ICoordinate3D}
 * @extends {ISphericalData}
 */
export interface ISphericalCoordinate extends ICoordinate3D, ISphericalData {
}

/**
 * A coordinate system for three-dimensional space where the position of a point is specified by three numbers:
 * the radial length of that point from a fixed origin, r, its polar angle measured from a fixed zenith direction, θ,
 * and the azimuthal angle, φ, of its orthogonal projection on a reference plane that passes through the origin and is orthogonal
 * to the zenith, measured from a fixed reference direction on that plane. It can be seen as the three-dimensional version
 * of the polar coordinate system.
 * @see {@link https://en.wikipedia.org/wiki/Spherical_coordinate_system}
 * @implements {IEquatable<SphericalCoordinate>}
 * @implements {ISphericalCoordinate}
 */
export class SphericalCoordinate implements ISphericalCoordinate, IEquatable<SphericalCoordinate> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @type {number}
 */
  Tolerance: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {number}
 */
  readonly radius: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {Angle}
 */
  readonly inclination: Angle;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {Angle}
 */
  readonly azimuth: Angle;

  // ==== Creation
  /**
   * Initializes a new instance of the SphericalCoordinate struct.
   * @param {number} radius The distance from a reference point.
   * @param {number | Angle} inclination The polar angle, θ, which lies in the vertical plane sweeping out from the Z-axis [radians or Angle].
   * @param {number | Angle} azimuth The azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis [radians or Angle].
   * @param {number} tolerance The tolerance to be used in relating coordinates.
   */
  protected constructor(
    radius: number,
    inclination: number | Angle,
    azimuth: number | Angle,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.radius = radius;
    this.inclination = inclination instanceof Angle ? inclination : new Angle(inclination);
    this.azimuth = azimuth instanceof Angle ? azimuth : new Angle(azimuth);
    this.Tolerance = tolerance;
  }

  /**
   * Initializes a new instance of the SphericalCoordinate at the origin.
   * @returns {SphericalCoordinate} SphericalCoordinate.
   */
  static atOrigin(): SphericalCoordinate {
    return new SphericalCoordinate(0, 0, 0);
  }

  /**
   * Initializes a new instance with JSON.
   * @param {ISphericalJson} json JSON representation of the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {SphericalCoordinate} SphericalCoordinate.
   */
  static fromJson(
    json: ISphericalJson,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalCoordinate {

    const azimuthRadians = json.azimuth.radians ?? (json.azimuth.degrees !== undefined ? Angle.DegreesToRadians(json.azimuth.degrees) : 0);
    const inclinationRadians = json.inclination.radians ?? (json.inclination.degrees !== undefined ? Angle.DegreesToRadians(json.inclination.degrees) : 0);

    return SphericalCoordinate.fromRadians(json.radius, azimuthRadians, inclinationRadians, tolerance);
  }

  /**
   * Initializes a new instance with a data object.
   * @param {IPolarData} data Minimum data for the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {SphericalCoordinate} SphericalCoordinate.
   */
  static fromData(
    data: ISphericalData,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalCoordinate {
    return SphericalCoordinate.fromAngle(data.radius, data.azimuth, data.inclination, tolerance);
  }

  /**
   * Initializes a new instance with an Angle.
   * @param {number} radius The distance from a reference point.
   * @param {Angle} inclination The polar angle, θ, which lies in the vertical plane sweeping out from the Z-axis [Angle].
   * @param {Angle} azimuth The azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis [Angle].
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {SphericalCoordinate} SphericalCoordinate.
   */
  static fromAngle(
    radius: number,
    azimuth: Angle,
    inclination: Angle,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalCoordinate {
    return new SphericalCoordinate(Math.abs(radius), azimuth, inclination, tolerance);
  }

  /**
   * Initializes a new an angle in radians.
   * @param {number} radius The distance from a reference point.
   * @param {number} inclination The polar angle, θ, which lies in the vertical plane sweeping out from the Z-axis [radians].
   * @param {number} azimuth The azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis [radians].
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromRadians(
    radius: number,
    azimuth: number,
    inclination: number,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalCoordinate {
    if (radius < 0) {
      azimuth -= Math.PI / 2;
      inclination -= Math.PI / 2;
    }

    return new SphericalCoordinate(Math.abs(radius), azimuth, inclination, tolerance);
  }

  /**
   * Initializes a new an angle in degrees.
   * @param {number} radius The distance from a reference point.
   * @param {number} inclination The polar angle, θ, which lies in the vertical plane sweeping out from the Z-axis [degrees].
   * @param {number} azimuth The azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis [degrees].
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  static fromDegrees(
    radius: number,
    azimuth: number,
    inclination: number,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalCoordinate {
    if (radius < 0) {
      azimuth -= 180;
      inclination -= 180;
    }
    azimuth = Angle.DegreesToRadians(azimuth);
    inclination = Angle.DegreesToRadians(inclination);

    return new SphericalCoordinate(Math.abs(radius), azimuth, inclination, tolerance);
  }

  // TODO: Finish
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @static
 * @param {SphericalCoordinate} center
 * @param {number} distance
 * @param {number} azimuth
 * @param {Angle} inclination
 * @returns {SphericalCoordinate}
 */
  static fromCoordinateOffset(
    center: SphericalCoordinate,
    distance: number,
    azimuth: number,
    inclination: Angle,
  ): SphericalCoordinate {
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {number} distance
 * @param {number} azimuth
 * @param {Angle} inclination
 * @returns {SphericalCoordinate}
 */
  offsetCoordinate(
    distance: number,
    azimuth: number,
    inclination: Angle,
  ): SphericalCoordinate {
    return SphericalCoordinate.fromCoordinateOffset(this, distance, azimuth, inclination);
  }

  // ==== I/0
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {string}
 */
  toString(): string {
    return `${SphericalCoordinate.name} - `
      + `radius:${this.radius}, azimuth:${this.azimuth.Radians}, inclination:${this.inclination.Radians}`;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {ISphericalData}
 */
  toData(): ISphericalData {
    return {
      radius: this.radius,
      azimuth: this.azimuth,
      inclination: this.inclination
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {boolean} asDegrees
 * @returns {ISphericalJson}
 */
  toJson(asDegrees: boolean): ISphericalJson {
    const azimuth = asDegrees ? {
      degrees: this.azimuth.Degrees
    } : {
      radians: this.azimuth.Radians
    }
    const inclination = asDegrees ? {
      degrees: this.inclination.Degrees
    } : {
      radians: this.inclination.Radians
    }

    return {
      radius: this.radius,
      azimuth: {
        ...azimuth
      },
      inclination: {
        ...inclination
      }
    }
  }

  // ==== Conversion
  // TODO: Finish Spherical.toCartesian & other conversion methods
  /**
   * Converts the spherical coordinate to a cartesian3D coordinate.
   * @returns {CartesianCoordinate3D} CartesianCoordinate3D.
   */
  toCartesian(): CartesianCoordinate3D {
    throw new Error();
    // return Cartesian3DPolarConverter.toCartesian(this);
  }
  /**
   * Converts the spherical coordinate to a cylindrical coordinate.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  toCylindrical(): CylindricalCoordinate {
    throw new Error();
    // return Cartesian3DPolarConverter.toCartesian(this);
  }

  // toPolarHorizontal
  // toPolarVertical

  // === Comparison
  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {SphericalCoordinate} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: SphericalCoordinate): boolean {
    const tolerance: number = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.AreEqual(this.inclination.Radians, other.inclination.Radians, tolerance) &&
      Numbers.AreEqual(this.azimuth.Radians, other.azimuth.Radians, tolerance) &&
      Numbers.AreEqual(this.radius, other.radius, tolerance)
    );
  }

  // ==== Methods

  // ==== Methods

  /// <summary>
  /// Returns the cartesian offset of the current coordinate from the provided coordinate.
  /// i.e. the current coordinate subtracting the provided coordinate.
  /// </summary>
  /// <param name="coordinateI">The coordinate i.</param>
  /// <returns>AngularOffset.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {SphericalCoordinate} coordinateI
 * @returns {SphericalOffset}
 */
  offsetFrom(coordinateI: SphericalCoordinate): SphericalOffset {
    return SphericalOffset.fromCoordinates(coordinateI, this);
  }

  // ==== Change Azimuth
  /**
   * Adds the angle, in radians, to the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  addAngleAzimuthRadians(angle: number): SphericalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians + angle);
  }

  /**
   * Adds the angle, in degrees, to the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  addAngleAzimuthDegrees(angle: number): SphericalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians + Angle.DegreesToRadians(angle));
  }


  /**
   * Subtracts the angle, in radians, from the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  subtractAngleAzimuthRadians(angle: number): SphericalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians - angle);
  }

  /**
   * Subtracts the angle, in degrees, from the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  subtractAngleAzimuthDegrees(angle: number): SphericalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians - Angle.DegreesToRadians(angle));
  }

  /**
   * Multiplies the azimuth angle, φ, of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  multiplyAngleAzimuthBy(multiplier: number): SphericalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians * multiplier);
  }

  /**
   * Divides the azimuth angle, φ, of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  divideAngleAzimuthBy(denominator: number): SphericalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians / denominator);
  }

  /**
     * Changes the azimuth angle, φ, of the current coordinate to the provided angle, in radians.
     * @param {number} angle The new angle [radians].
     * @returns {SphericalCoordinate} A new instance of `SphericalCoordinate` with the updated azimuth angle.
     */
  private changePhiAngleAzimuthRadians(angle: number): SphericalCoordinate {
    return new SphericalCoordinate(
      this.radius,
      this.inclination,
      angle,
      this.Tolerance
    );
  }

  // ==== Change Inclination
  /**
   * Adds the angle, in radians, to the inclination angle, θ, of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  addAngleInclinationRadians(angle: number): SphericalCoordinate {
    return this.changeAngleInclinationRadians(this.inclination.Radians + angle);
  }

  /**
   * Adds the angle, in degrees, to the inclination angle, θ, of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  addAngleInclinationDegrees(angle: number): SphericalCoordinate {
    return this.changeAngleInclinationRadians(this.inclination.Radians + Angle.DegreesToRadians(angle));
  }


  /**
   * Subtracts the angle, in radians, from the inclination angle, θ, of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  subtractAngleInclinationRadians(angle: number): SphericalCoordinate {
    return this.changeAngleInclinationRadians(this.inclination.Radians - angle);
  }

  /**
   * Subtracts the angle, in degrees, from the inclination angle, θ, of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  subtractAngleInclinationDegrees(angle: number): SphericalCoordinate {
    return this.changeAngleInclinationRadians(this.inclination.Radians - Angle.DegreesToRadians(angle));
  }

  /**
   * Multiplies the inclination angle, θ, of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  public multiplyAngleInclinationBy(multiplier: number): SphericalCoordinate {
    return this.changeAngleInclinationRadians(this.inclination.Radians * multiplier);
  }

  /**
   * Divides the inclination angle, θ, of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  public divideAngleInclinationBy(denominator: number): SphericalCoordinate {
    return this.changeAngleInclinationRadians(this.inclination.Radians / denominator);
  }

  /**
     * Changes the inclination angle, θ, of the current coordinate to the provided angle, in radians.
     * @param {number} angle The new angle [radians].
     * @returns {SphericalCoordinate} A new instance of `SphericalCoordinate` with the updated angle.
     */
  private changeAngleInclinationRadians(angle: number): SphericalCoordinate {
    return new SphericalCoordinate(
      this.radius,
      angle,
      this.azimuth,
      this.Tolerance
    );
  }

  // ==== Change Radius
  /**
   * Adds the amount to the radius of the current coordinate.
   * @param {number} value The amount to add to the radial length.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  addToRadius(value: number): SphericalCoordinate {
    return this.changeRadius(this.radius + value);
  }

  /**
   * Subtracts the amount from the radius of the current coordinate.
   * @param {number} value The amount to subtract from the radius.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  subtractFromRadius(value: number): SphericalCoordinate {
    return this.changeRadius(this.radius - value);
  }

  /**
   * Multiplies the radius of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  multiplyRadiusBy(multiplier: number): SphericalCoordinate {
    return this.changeRadius(this.radius * multiplier);
  }

  /**
   * Divides the radius of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {SphericalCoordinate} A new SphericalCoordinate.
   */
  divideRadiusBy(denominator: number): SphericalCoordinate {
    return this.changeRadius(this.radius / denominator);
  }

  /**
     * Changes the radial distance of the current coordinate to the provided radius.
     * @param {number} radius The new radius.
     * @returns {SphericalCoordinate} A new instance of `SphericalCoordinate` with the updated radial distance.
     */
  private changeRadius(radius: number): SphericalCoordinate {
    return new SphericalCoordinate(
      radius,
      this.inclination,
      this.azimuth,
      this.Tolerance
    );
  }

  // ==== Scale
  /**
   * Implements the * operator for a coordinate and a double which represents a multiplier.
   * @param {SphericalCoordinate} coordinate The coordinate.
   * @param {number} multiplier Multiplier value.
   * @returns {SphericalCoordinate} The result of the operator.
   */
  multiplyBy(multiplier: number): SphericalCoordinate {
    return new SphericalCoordinate(
      this.radius * multiplier,
      this.inclination.multiplyBy(multiplier),
      this.azimuth.multiplyBy(multiplier),
      this.Tolerance
    );
  }

  /**
   * Implements the / operator for a coordinate and a double which represents the denominator.
   * @param {number} denominator The denominator value.
   * @param {SphericalCoordinate} coordinate The coordinate.
   * @returns {SphericalCoordinate} The result of the operator.
   */
  divideBy(denominator: number): SphericalCoordinate {
    return new SphericalCoordinate(
      this.radius / denominator,
      this.inclination.divideBy(denominator),
      this.azimuth.divideBy(denominator),
      this.Tolerance
    );
  }
}
