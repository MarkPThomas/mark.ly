import { Angle } from "../math/Coordinates/Angle";
import { CartesianCoordinate } from "../math/Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../math/Coordinates/CartesianOffset";
import { LinearCurve } from "../math/Curves/LinearCurve";

export interface ITransform<T> {
  /// <summary>
  /// Translates the segment.
  /// </summary>
  /// <param name="translation">The amount to translate by.</param>
  /// <returns>IPathSegment.</returns>
  Translate(translation: CartesianOffset): T;

  /// <summary>
  /// Scales the segment from the provided reference point.
  /// </summary>
  /// <param name="scale">The amount to scale relative to the reference point.</param>
  /// <param name="referencePoint">The reference point.</param>
  /// <returns>IPathSegment.</returns>
  ScaleFromPoint(scale: number, referencePoint: CartesianCoordinate): T;

  /// <summary>
  /// Rotates the segment about the reference point.
  /// </summary>
  /// <param name="rotation">The amount of rotation. [rad]</param>
  /// <param name="referencePoint">The center of rotation reference point.</param>
  /// <returns>IPathSegment.</returns>
  RotateAboutPoint(rotation: Angle, referencePoint: CartesianCoordinate): T;

  /// <summary>
  /// Skews the specified segment to the skewing of a containing box.
  /// </summary>
  /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
  /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
  /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>IPathSegment.</returns>
  Skew(
    stationaryReferencePoint: CartesianCoordinate,
    skewingReferencePoint: CartesianCoordinate,
    magnitude: CartesianOffset): T;

  /// <summary>
  /// Mirrors the specified segment about the specified reference line.
  /// </summary>
  /// <param name="referenceLine">The reference line.</param>
  /// <returns>IPathSegment.</returns>
  MirrorAboutLine(referenceLine: LinearCurve): T;

  /// <summary>
  /// Mirrors the specified segment about the x-axis.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  MirrorAboutAxisX(): T;

  /// <summary>
  /// Mirrors the specified segment about the y-axis.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  MirrorAboutAxisY(): T;
}