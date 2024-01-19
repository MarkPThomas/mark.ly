/// <summary>
/// Curve position can be represented in polar coordinates.
/// </summary>
export interface ICurvePositionPolar {
  /// <summary>
  /// The radius measured from the local coordinate origin as a function of the angle in local coordinates.
  /// </summary>
  /// <param name="angleRadians">The angle in radians in local coordinates.</param>
  /// <returns>System.Double.</returns>
  RadiusAboutOrigin(angleRadians: number): number;

  /// <summary>
  /// The radii measured from the local coordinate origin as a function of the angle in local coordinates.
  /// </summary>
  /// <param name="angleRadians">The angle in radians in local coordinates.</param>
  /// <returns>System.Double.</returns>
  RadiiAboutOrigin(angleRadians: number): number[];

  // TODO: Implement additional methods for ICurvePositionPolar
  ///// <summary>
  ///// The rotation about the local coordinate ray origin as a function of the provided radius measured from the local coordinate origin.
  ///// </summary>
  ///// <param name="radius">The radius, measured from the local coordinate origin.</param>
  ///// <returns>Angle.</returns>
  //Angle RotationAtRadius(double radius);

  ///// <summary>
  ///// The rotations about the local coordinate ray origin as a function of the provided radius measured from the local coordinate origin.
  ///// </summary>
  ///// <param name="radius">The radius, measured from the local coordinate origin.</param>
  ///// <returns>Angle.</returns>
  //Angle[] RotationsAtRadius(double radius);

  ///// <summary>
  ///// Provided point lies on the curve.
  ///// </summary>
  ///// <param name="coordinate">The coordinate.</param>
  ///// <returns><c>true</c> if [is intersecting coordinate] [the specified coordinate]; otherwise, <c>false</c>.</returns>
  //bool IsIntersectingPolarCoordinate(PolarCoordinate coordinate);
}