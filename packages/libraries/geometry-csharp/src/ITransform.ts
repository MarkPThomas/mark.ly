import {
  Angle,
  CartesianCoordinate,
  CartesianOffset
} from "@markpthomas/math/coordinates";
import { LinearCurve } from "@markpthomas/math/Curves";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @interface ITransform
 * @typedef {ITransform}
 * @template T
 */
export interface ITransform<T> {
  /// <summary>
  /// Translates the segment.
  /// </summary>
  /// <param name="translation">The amount to translate by.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianOffset} translation
 * @returns {T}
 */
  Translate(translation: CartesianOffset): T;

  /// <summary>
  /// Scales the segment from the provided reference point.
  /// </summary>
  /// <param name="scale">The amount to scale relative to the reference point.</param>
  /// <param name="referencePoint">The reference point.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} scale
 * @param {CartesianCoordinate} referencePoint
 * @returns {T}
 */
  ScaleFromPoint(scale: number, referencePoint: CartesianCoordinate): T;

  /// <summary>
  /// Rotates the segment about the reference point.
  /// </summary>
  /// <param name="rotation">The amount of rotation. [rad]</param>
  /// <param name="referencePoint">The center of rotation reference point.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {Angle} rotation
 * @param {CartesianCoordinate} referencePoint
 * @returns {T}
 */
  RotateAboutPoint(rotation: Angle, referencePoint: CartesianCoordinate): T;

  /// <summary>
  /// Skews the specified segment to the skewing of a containing box.
  /// </summary>
  /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
  /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
  /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} stationaryReferencePoint
 * @param {CartesianCoordinate} skewingReferencePoint
 * @param {CartesianOffset} magnitude
 * @returns {T}
 */
  Skew(
    stationaryReferencePoint: CartesianCoordinate,
    skewingReferencePoint: CartesianCoordinate,
    magnitude: CartesianOffset): T;

  /// <summary>
  /// Mirrors the specified segment about the specified reference line.
  /// </summary>
  /// <param name="referenceLine">The reference line.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {LinearCurve} referenceLine
 * @returns {T}
 */
  MirrorAboutLine(referenceLine: LinearCurve): T;

  /// <summary>
  /// Mirrors the specified segment about the x-axis.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @returns {T}
 */
  MirrorAboutAxisX(): T;

  /// <summary>
  /// Mirrors the specified segment about the y-axis.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @returns {T}
 */
  MirrorAboutAxisY(): T;
}