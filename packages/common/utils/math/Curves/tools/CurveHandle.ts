import { ICloneable } from "../../../../interfaces";
import { Angle } from "../../Coordinates/Angle";
import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../../Coordinates/CartesianOffset";

/**
 * Class CurveHandle.
 * @implements {ICloneable}
 */
export class CurveHandle implements ICloneable<CurveHandle> {
  /**
   * Gets the control point.
   * @type {CartesianCoordinate}
   */
  public readonly ControlPoint: CartesianCoordinate;

  /**
   * Gets or sets the rotation.
   * @type {Angle}
   */
  public Rotation: Angle;

  /**
   * Gets or sets the radius.
   * @type {number}
   */
  public Radius: number;

  /**
   * Initializes a new instance of the {@link CurveHandle} class.
   * @param {CartesianCoordinate} controlPoint The control point, at the center of the handle.
   * @param {number} radius The radius of the handle.
   * @param {Angle} [rotation] The rotation of the handle.
   */
  constructor(controlPoint: CartesianCoordinate, radius: number, rotation?: Angle) {
    this.ControlPoint = controlPoint;
    this.Radius = radius;
    this.Rotation = rotation || Angle.Origin();
  }

  /**
   * Returns a string that represents this instance.
   * @returns {string} A string that represents this instance.
   */
  public toString(): string {
    return (
      CurveHandle.name +
      " - Center: {X: " +
      this.ControlPoint.X +
      ", Y: " +
      this.ControlPoint.Y +
      "} - Radius: " +
      this.Radius +
      ", Rotation: " +
      this.Rotation.Degrees +
      " deg"
    );
  }

  /**
   * The coordinate of the handle tip.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  public getHandleTip(): CartesianCoordinate {
    return this.ControlPoint.addTo(
      new CartesianCoordinate(
        this.Radius * Math.cos(this.Rotation.Radians),
        this.Radius * Math.sin(this.Rotation.Radians),
        this.ControlPoint.Tolerance
      )
    );
  }

  /**
   * Sets the handle tip to the provided coordinate.
   * @param {CartesianCoordinate} handleTip The handle tip.
   */
  public setHandleTip(handleTip: CartesianCoordinate): void {
    const offset: CartesianOffset = handleTip.offsetFrom(this.ControlPoint);
    this.Radius = offset.length();
    this.Rotation = offset.slopeAngle();
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {CurveHandle} A new object that is a copy of this instance.
   */
  public clone(): CurveHandle {
    const curve: CurveHandle = new CurveHandle(this.ControlPoint, this.Radius, this.Rotation);
    return curve;
  }
}