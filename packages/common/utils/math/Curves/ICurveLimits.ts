/// <summary>
/// Interface for a curve that is comprised of a path with some form of bounding limits.

import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { LinearCurve } from "./LinearCurve";
import { CurveRange } from "./tools/CurveRange";

/// </summary>
export interface ICurveLimits {
  /// <summary>
  /// The range of max/min limits that apply to the curve.
  /// </summary>
  /// <value>The range.</value>
  Range: CurveRange;


  /// <summary>
  /// Length of the curve.
  /// </summary>
  /// <returns>System.Double.</returns>
  Length(): number;

  /// <summary>
  /// Length of the curve between two points.
  /// </summary>
  /// <param name="relativePositionStart">Relative position along the path at which the length measurement is started.</param>
  /// <param name="relativePositionEnd">Relative position along the path at which the length measurement is ended.</param>
  /// <returns>System.Double.</returns>
  LengthBetween(relativePositionStart: number, relativePositionEnd: number): number;

  /// <summary>
  /// The length of the chord connecting the start and end limits.
  /// </summary>
  /// <returns>System.Double.</returns>
  ChordLength(): number;

  /// <summary>
  /// The length of the chord connecting the start and end limits.
  /// </summary>
  /// <param name="relativePositionStart">Relative position along the path at which the length measurement is started.</param>
  /// <param name="relativePositionEnd">Relative position along the path at which the length measurement is ended.</param>
  /// <returns>System.Double.</returns>
  ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number;

  /// <summary>
  /// The chord connecting the start and end limits.
  /// </summary>
  /// <returns>LinearCurve.</returns>
  Chord(): LinearCurve;

  /// <summary>
  /// The chord connecting the start and end limits.
  /// </summary>
  /// <param name="relativePositionStart">Relative position along the path at which the linear curve is started.</param>
  /// <param name="relativePositionEnd">Relative position along the path at which the linear curve is ended.</param>
  /// <returns>LinearCurve.</returns>
  ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve;

  // /// <summary>
  // /// Vector that is tangential to the curve at the specified position.
  // /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  // /// </summary>
  // /// <param name="relativePosition">Relative position along the path at which the tangent vector is desired.</param>
  // /// <returns>Vector.</returns>
  // TangentVector(relativePosition: number): Vector;

  // /// <summary>
  // /// Vector that is tangential to the curve at the specified position.
  // /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  // /// </summary>
  // /// <param name="relativePosition">Relative position along the path at which the tangent vector is desired.</param>
  // /// <returns>Vector.</returns>
  // NormalVector(relativePosition: number): Vector;

  /// <summary>
  /// Coordinate of the curve at the specified position.
  /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  /// </summary>
  /// <param name="relativePosition">Relative position along the path at which the coordinate is desired.</param>
  /// <returns>CartesianCoordinate.</returns>
  CoordinateCartesian(relativePosition: number): CartesianCoordinate;

  // /// <summary>
  // /// Coordinate of the curve at the specified position.
  // /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  // /// </summary>
  // /// <param name="relativePosition">Relative position along the path at which the coordinate is desired.</param>
  // /// <returns>CartesianCoordinate.</returns>
  // CoordinatePolar(relativePosition: number): PolarCoordinate;
}