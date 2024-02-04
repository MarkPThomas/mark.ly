import { IEquatable } from "../../../interfaces";
import { Angle } from "../Coordinates/Angle";
import { Numbers } from "../Numbers";
import { CartesianCoordinate3D } from "./CartesianCoordinate3D";
import { CylindricalOffset } from "./CylindricalOffset";
import { ICoordinate3D } from "./ICoordinate3D";
import { SphericalCoordinate } from "./SphericalCoordinate";

export interface ICylindricalJson {
  /**
   * The radius, r, which is the shortest distance from the origin.
   * @type {number}
   */
  radius: number;

  /**
   * The height, z, which is the signed distance from the chosen plane to the point P.
   * @type {number}
   */
  height: number;

  /**
   * The azimuth angle, φ, measured CCW from a horizontal line pointing +X in Cartesian coordinates from the origin.
   * @type {number}
   */
  azimuth: {
    degrees?: number;
    radians?: number;
  };
}

export interface ICylindricalData {
  /**
  * The radius, r, which is the shortest distance from the origin.
  * @type {number}
  */
  radius: number;

  /**
  * The height, z, which is the signed distance from the chosen plane to the point P.
  * @type {number}
  */
  height: number;

  /**
    * The azimuth angle, φ, measured CCW from a horizontal line pointing +X in Cartesian coordinates from the origin.
    * @type {Angle}
    */
  azimuth: Angle;
}

export interface ICylindricalCoordinate extends ICoordinate3D, ICylindricalData {
}

/**
 * A three-dimensional coordinate system that specifies point positions by the distance from a chosen reference axis, the direction from the axis relative to a chosen reference direction, and the distance from a chosen reference plane perpendicular to the axis.
 * The latter distance is given as a positive or negative number depending on which side of the reference plane faces the point.
 * @see {@link https://en.wikipedia.org/wiki/Cylindrical_coordinate_system}
 * @implements {IEquatable<CylindricalCoordinate>}
 * @implements {ICylindricalCoordinate}
 */
export class CylindricalCoordinate implements ICylindricalCoordinate, IEquatable<CylindricalCoordinate> {
  Tolerance: number;

  readonly radius: number;
  readonly height: number;
  readonly azimuth: Angle;

  // ==== Creation
  /**
   * Initializes a new instance of the CylindricalCoordinate struct.
   * @param {number} radius The distance from a reference point.
   * @param {number} height The height, z, which is the signed distance from the chosen plane to the point P.
   * @param {number|Angle} azimuth The azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis [radians].
   * @param {number} tolerance The tolerance to be used in relating coordinates.
   */
  protected constructor(
    radius: number,
    azimuth: number | Angle,
    height: number,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.radius = radius;
    this.height = height;
    this.azimuth = azimuth instanceof Angle ? azimuth : new Angle(azimuth);
    this.Tolerance = tolerance;
  }


  /**
   * Initializes a new instance of the CylindricalCoordinate at the origin.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  static atOrigin(): CylindricalCoordinate {
    return new CylindricalCoordinate(0, 0, 0);
  }

  /**
   * Initializes a new instance with JSON.
   * @param {ICylindricalJson} json JSON representation of the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  static fromJson(
    json: ICylindricalJson,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalCoordinate {
    return json.azimuth.degrees
      ? CylindricalCoordinate.fromDegrees(json.radius, json.azimuth.degrees, json.height, tolerance)
      : CylindricalCoordinate.fromRadians(json.radius, json.azimuth.radians ?? 0, json.height, tolerance);
  }

  /**
   * Initializes a new instance with a data object.
   * @param {ICylindricalData} data Minimum data for the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  static fromData(
    data: ICylindricalData,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalCoordinate {
    return CylindricalCoordinate.fromAngle(data.radius, data.azimuth, data.height, tolerance);
  }

  /**
   * Initializes a new instance with an Angle.
   * @param {number} radius The distance from a reference point.
   * @param {Angle} azimuth The angle from a reference direction [Angle].
   * @param {number} height The haight above a reference plane.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  static fromAngle(
    radius: number,
    azimuth: Angle,
    height: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalCoordinate {
    return new CylindricalCoordinate(Math.abs(radius), azimuth, height, tolerance);
  }

  /**
   * Initializes a new an angle in radians.
   * @param {number} radius The distance from a reference point.
   * @param {number} azimuth The angle from a reference direction [radians].
   * @param {number} height The haight above a reference plane.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  static fromRadians(
    radius: number,
    azimuth: number,
    height: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalCoordinate {
    if (radius < 0) {
      azimuth -= Math.PI / 2;
    }

    return new CylindricalCoordinate(Math.abs(radius), azimuth, height, tolerance);
  }

  /**
   * Initializes a new an angle in degrees.
   * @param {number} radius The distance from a reference point.
   * @param {number} azimuth The angle from a reference direction [degrees].
   * @param {number} height The haight above a reference plane.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CylindricalCoordinate} CylindricalCoordinate.
   */
  static fromDegrees(
    radius: number,
    azimuth: number,
    height: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalCoordinate {
    if (radius < 0) {
      azimuth -= 180;
    }
    azimuth = Angle.DegreesToRadians(azimuth);

    return new CylindricalCoordinate(Math.abs(radius), azimuth, height, tolerance);
  }

  // TODO: Finish
  static fromCoordinateOffset(
    center: CylindricalCoordinate,
    distance: number,
    azimuth: number,
    height: number,
  ): CylindricalCoordinate {
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

  offsetCoordinate(
    distance: number,
    azimuth: number,
    height: number,
  ): CylindricalCoordinate {
    return CylindricalCoordinate.fromCoordinateOffset(this, distance, height, azimuth);
  }

  // ==== I/0
  toString(): string {
    return `${CylindricalCoordinate.name} - `
      + `radius:${this.radius}, azimuth:${this.azimuth.Radians}, height:${this.height}`;
  }

  toData(): ICylindricalData {
    return {
      radius: this.radius,
      azimuth: this.azimuth,
      height: this.height
    }
  }

  toJson(asDegrees: boolean): ICylindricalJson {
    const azimuth = asDegrees ? {
      degrees: this.azimuth.Degrees
    } : {
      radians: this.azimuth.Radians
    }

    return {
      radius: this.radius,
      azimuth: {
        ...azimuth
      },
      height: this.height
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
   * Converts the cylindrical coordinate to a spherical coordinate.
   * @returns {SphericalCoordinate} SphericalCoordinate.
   */
  toSpherical(): SphericalCoordinate {
    throw new Error();
    // return Cartesian3DPolarConverter.toCartesian(this);
  }

  // toPolarHorizontal
  // toZPlanar

  // === Comparison
  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {CylindricalCoordinate} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: CylindricalCoordinate): boolean {
    const tolerance: number = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.AreEqual(this.height, other.height, tolerance) &&
      Numbers.AreEqual(this.azimuth.Radians, other.azimuth.Radians, tolerance) &&
      Numbers.AreEqual(this.radius, other.radius, tolerance)
    );
  }

  // ==== Methods

  /// <summary>
  /// Returns the cartesian offset of the current coordinate from the provided coordinate.
  /// i.e. the current coordinate subtracting the provided coordinate.
  /// </summary>
  /// <param name="coordinateI">The coordinate i.</param>
  /// <returns>AngularOffset.</returns>
  offsetFrom(coordinateI: CylindricalCoordinate): CylindricalOffset {
    return CylindricalOffset.fromCoordinates(coordinateI, this);
  }

  // ==== Change Azimuth
  /**
   * Adds the angle, in radians, to the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {CylindricalCoordinate}
   */
  addAngleAzimuthRadians(angle: number): CylindricalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians + angle);
  }

  /**
   * Subtracts the angle, in radians, from the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [radians].
   * @returns {CylindricalCoordinate}
   */
  subtractAngleAzimuthRadians(angle: number): CylindricalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians - angle);
  }

  /**
   * Adds the angle, in degrees, to the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {CylindricalCoordinate}
   */
  addAngleAzimuthDegrees(angle: number): CylindricalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians + Angle.DegreesToRadians(angle));
  }

  /**
   * Subtracts the angle, in degrees, from the azimuth angle, φ, of the current coordinate.
   * @param {number} angle The angle [degrees].
   * @returns {CylindricalCoordinate}
   */
  subtractAngleAzimuthDegrees(angle: number): CylindricalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians - Angle.DegreesToRadians(angle));
  }

  /**
   * Multiplies the azimuth angle, φ, of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {CylindricalCoordinate}
   */
  multiplyAngleAzimuthBy(multiplier: number): CylindricalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians * multiplier);
  }

  /**
   * Divides the azimuth angle, φ, of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {CylindricalCoordinate}
   */
  divideAngleAzimuthBy(denominator: number): CylindricalCoordinate {
    return this.changePhiAngleAzimuthRadians(this.azimuth.Radians / denominator);
  }

  /**
   * Changes the azimuth angle, φ, of the current coordinate to the provided angle, in radians.
   * @param {number} angle The new angle [radians].
   * @returns {CylindricalCoordinate}
   */
  private changePhiAngleAzimuthRadians(angle: number): CylindricalCoordinate {
    return new CylindricalCoordinate(
      this.radius,
      this.height,
      angle,
      this.Tolerance
    );
  }

  // ==== Change Radius
  /**
   * Adds the amount to the radial length of the current coordinate.
   * @param {number} value The amount to add to the radial length.
   * @returns {CylindricalCoordinate}
   */
  addToRadius(value: number): CylindricalCoordinate {
    return this.changeRadius(this.radius + value);
  }

  /**
   * Subtracts the amount from the radial length of the current coordinate.
   * @param {number} value The amount to subtract from the radial length.
   * @returns {CylindricalCoordinate}
   */
  subtractFromRadius(value: number): CylindricalCoordinate {
    return this.changeRadius(this.radius - value);
  }

  /**
   * Multiplies the radial length of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {CylindricalCoordinate}
   */
  multiplyRadiusBy(multiplier: number): CylindricalCoordinate {
    return this.changeRadius(this.radius * multiplier);
  }

  /**
   * Divides the radial length of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {CylindricalCoordinate}
   */
  divideRadiusBy(denominator: number): CylindricalCoordinate {
    return this.changeRadius(this.radius / denominator);
  }

  /**
   * Changes the radial length of the current coordinate to the provided radial length.
   * @param {number} radialLength The new radial length.
   * @returns {CylindricalCoordinate}
   */
  private changeRadius(radialLength: number): CylindricalCoordinate {
    return new CylindricalCoordinate(
      radialLength,
      this.azimuth,
      this.height,
      this.Tolerance
    );
  }

  // ==== Change Height
  /**
   * Adds the value to the height, z, of the current coordinate.
   * @param {number} value The value.
   * @returns {CylindricalCoordinate}
   */
  addToHeight(value: number): CylindricalCoordinate {
    return this.changeHeight(this.height + value);
  }

  /**
   * Subtracts the value from the height, z, of the current coordinate.
   * @param {number} value The value.
   * @returns {CylindricalCoordinate}
   */
  subtractFromHeight(value: number): CylindricalCoordinate {
    return this.changeHeight(this.height - value);
  }

  /**
   * Multiplies the height, z, of the current coordinate by the amount.
   * @param {number} multiplier Multiplier value.
   * @returns {CylindricalCoordinate}
   */
  multiplyHeightBy(multiplier: number): CylindricalCoordinate {
    return this.changeHeight(this.height * multiplier);
  }

  /**
   * Divides the height, z, of the current coordinate by the amount.
   * @param {number} denominator The denominator value.
   * @returns {CylindricalCoordinate}
   */
  divideHeightBy(denominator: number): CylindricalCoordinate {
    return this.changeHeight(this.height / denominator);
  }

  /**
   * Changes the height, z, of the current coordinate to the provided height.
   * @param {number} height The height.
   * @returns {CylindricalCoordinate}
   */
  private changeHeight(height: number): CylindricalCoordinate {
    return new CylindricalCoordinate(
      this.radius,
      this.azimuth,
      height,
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
  multiplyBy(multiplier: number): CylindricalCoordinate {
    return new CylindricalCoordinate(
      this.radius * multiplier,
      this.azimuth.multiplyBy(multiplier),
      this.height * multiplier,
      this.Tolerance
    );
  }

  /**
   * Implements the / operator for a coordinate and a double which represents the denominator.
   * @param {number} denominator The denominator value.
   * @param {CylindricalCoordinate} coordinate The coordinate.
   * @returns {CylindricalCoordinate} The result of the operator.
   */
  divideBy(denominator: number): CylindricalCoordinate {
    return new CylindricalCoordinate(
      this.radius / denominator,
      this.azimuth.divideBy(denominator),
      this.height / denominator,
      this.Tolerance
    );
  }
}