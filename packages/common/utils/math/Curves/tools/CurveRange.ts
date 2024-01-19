import { ArgumentOutOfRangeException } from "../../../../errors/exceptions";
import { ICloneable } from "../../../../interfaces";
import { Angle } from "../../Coordinates/Angle";
import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../../Coordinates/CartesianOffset";
import { Numbers } from "../../Numbers";
import { Curve } from "../Curve";
import { CurveLimit } from "./CurveLimit";

/**
 * Handles limit ranges applied to curves.
 *
 * @export
 * @class CurveRange
 * @implements {ICloneable<CurveRange>}
 */
export class CurveRange implements ICloneable<CurveRange> {
  protected _limitStart: CurveLimit;
  public get Start(): CurveLimit {
    return this._limitStart;
  }

  protected _limitEnd: CurveLimit;
  public get End(): CurveLimit {
    return this._limitEnd;
  }

  protected constructor(curve?: Curve) {
    if (curve) {
      this._limitStart = CurveLimit.fromCurve(curve);
      this._limitEnd = CurveLimit.fromCurve(curve);
    }
  }

  static fromCurve(curve: Curve) {
    const curveRange = new CurveRange(curve);
    return curveRange;
  }

  static fromCoordinatesOnCurve(
    curve: Curve,
    defaultStartLimit: CartesianCoordinate,
    defaultEndLimit: CartesianCoordinate
  ) {
    const curveRange = new CurveRange(curve);
    curveRange._limitStart = CurveLimit.fromCoordinatesOnCurve(curve, defaultStartLimit);
    curveRange._limitEnd = CurveLimit.fromCoordinatesOnCurve(curve, defaultEndLimit);

    return curveRange;
  }


  public ToString(): string {
    return this.toString() + " - Start: {X: " + this._limitStart.Limit.X + ", Y: " + this._limitStart.Limit.Y + "}, End: {X: " + this._limitEnd.Limit.X + ", Y: " + this._limitEnd.Limit.Y + "}";
  }

  /// <summary>
  /// Converts to cartesian offset.
  /// </summary>
  /// <returns>CartesianOffset.</returns>
  public ToOffset(): CartesianOffset {
    return this.End.Limit.OffsetFrom(this.Start.Limit);
  }

  // /// <summary>
  // /// Converts to polar offset.
  // /// </summary>
  // /// <returns>PolarOffset.</returns>
  // public ToOffsetPolar(): PolarOffset {
  //   return this.End.Limit.OffsetFrom(this.Start.Limit);
  // }

  /// <summary>
  /// The linear distance of the range.
  /// </summary>
  /// <returns>System.Double.</returns>
  public LengthLinear(): number {
    return this.ToOffset().Length();
  }

  /// <summary>
  /// The x-axis distance of the range.
  /// </summary>
  /// <returns>System.Double.</returns>
  public LengthX(): number {
    return this.ToOffset().X;
  }

  /// <summary>
  /// The y-axis distance of the range.
  /// </summary>
  /// <returns>System.Double.</returns>
  public LengthY(): number {
    return this.ToOffset().Y;
  }

  // /// <summary>
  // /// The radial distance of the range.
  // /// </summary>
  // /// <returns>System.Double.</returns>
  // public LengthRadius(): number {
  //   return this.ToOffsetPolar().Radius();
  // }

  // /// <summary>
  // /// The rotational distance of the range.
  // /// </summary>
  // /// <returns>System.Double.</returns>
  // public LengthRotation(): Angle {
  //   return this.ToOffsetPolar().Azimuth();
  // }

  // /// <summary>
  // /// The rotational distance of the range, in radians.
  // /// </summary>
  // /// <returns>System.Double.</returns>
  // public LengthRotationRadians(): number {
  //   return this.LengthRotation().Radians;
  // }

  // /// <summary>
  // /// The rotational distance of the range, in degrees.
  // /// </summary>
  // /// <returns>System.Double.</returns>
  // public LengthRotationDegrees(): number {
  //   return this.LengthRotation().Degrees;
  // }

  /// <summary>
  /// Validates the angular position provided based on +/- values of a half circle.
  /// </summary>
  /// <param name="position">The angular position, must be between -π and +π.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <exception cref="ArgumentOutOfRangeException">Relative position must be between -π and +π, but was {sRelative}.</exception>
  public static ValidateRangeLimitRotationalHalfCirclePosition(position: number, tolerance: number = Numbers.ZeroTolerance) {
    if (!Numbers.IsWithinInclusive(position, -1 * Numbers.Pi, Numbers.Pi, tolerance)) {
      throw new ArgumentOutOfRangeException(`Position must be between -π and +π, but was ${position}.`);
    }
  }

  /// <summary>
  /// Validates the angular position provided based on + values of a full circle.
  /// </summary>
  /// <param name="position">The relative position, s. Relative position must be between 0 and +2π.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <exception cref="ArgumentOutOfRangeException">Relative position must be between 0 and +2π, but was {sRelative}.</exception>
  public static ValidateRangeLimitRotationalFullCirclePosition(position: number, tolerance: number = Numbers.ZeroTolerance) {
    if (!Numbers.IsWithinInclusive(position, 0, Numbers.TwoPi, tolerance)) {
      throw new ArgumentOutOfRangeException(`Position must be between 0 and +2π, but was ${position}.`);
    }
  }

  public clone(): CurveRange {
    const curveRange: CurveRange = new CurveRange();
    curveRange._limitStart = this._limitStart.clone();
    curveRange._limitEnd = this._limitEnd.clone();
    return curveRange;
  }
}