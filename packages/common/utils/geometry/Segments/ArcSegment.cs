using System;
using System.Collections.Generic;
using NMath = System.Math;

using GL = MPT.Geometry.GeometryLibrary;
using MPT.Math.Algebra;
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using MPT.Math.Vectors;

namespace MPT.Geometry.Segments
{
    /// <summary>
    /// Segment that describes a circular arc between two points in a plane.
    /// </summary>
    public class ArcSegment : PathSegment, ICurve, IPathDivisionExtension, IPolarCoordinates
    {
        #region Properties
        /// <summary>
        /// CartesianCoordinate representing the center of the circular arc, which lies at a distance of the radius form either end point.
        /// </summary>
        public CartesianCoordinate Center { get; }

        /// <summary>
        /// Radius of the curve.
        /// </summary>
        public double Radius { get; }

        /// <summary>
        /// Total length of the curve (radius*angle).
        /// </summary>
        public double ArcLength { get; }

        /// <summary>
        /// The curvature of the line (1/radius).
        /// </summary>
        public double Curvature { get; }

        /// <summary>
        /// Angle between the rays that connect each end of the curve to the common origin [radians].
        /// </summary>
        public double Angle { get; }

        /// <summary>
        /// Angle between the rays that connect each end of the curve to the common origin [degrees].
        /// </summary>
        public double AngleDegrees { get; }

        /// <summary>
        /// First coordinate value {radius, rotation[radians]}.
        /// </summary>
        public KeyValuePair<double, double> IPolar { get; }

        /// <summary>
        /// Second coordinate value {radius, rotation[radians]}.
        /// </summary>
        public KeyValuePair<double, double> JPolar { get; }
        #endregion

        #region Constructor
        /// <summary>
        /// Initializes the arc segment to span between the provided points.
        /// </summary>
        /// <param name="i">First point of the line.</param>
        /// <param name="j">Second point of the line.</param>
        public ArcSegment(CartesianCoordinate i, CartesianCoordinate j) : base(i, j) { }
        #endregion

        #region Methods: Override (IPathSegment)
        /// <summary>
        /// Converts the arc to a tangent vector at the midpoint.
        /// </summary>
        /// <returns></returns>
        public override Vector TangentVector(double angleNormal)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Converts the arc to a normal vector at the midpoint.
        /// </summary>
        /// <returns></returns>
        public override Vector NormalVector(double angleTangential)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// X-coordinate on the arc segment that corresponds to the y-coordinate given.
        /// </summary>
        /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
        /// <returns></returns>
        public override double X(double y)
        {
            return (NMath.Sqrt(Radius.Squared() - (y - Center.Y).Squared()) + Center.X);
        }

        /// <summary>
        /// Y-coordinate on the arc segment that corresponds to the x-coordinate given.
        /// </summary>
        /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
        /// <returns></returns>
        public override double Y(double x)
        {
            return (NMath.Sqrt(Radius.Squared() - (x - Center.X).Squared()) + Center.Y);
        }

        /// <summary>
        /// Length of the path segment.
        /// </summary>
        /// <returns>System.Double.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public override double Length()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// X-coordinate of the centroid of the line.
        /// </summary>
        /// <returns>System.Double.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public override double Xo()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Y-coordinate of the centroid of the line.
        /// </summary>
        /// <returns>System.Double.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public override double Yo()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Coordinate on the path that corresponds to the position along the path.
        /// </summary>
        /// <param name="sRelative">The relative position along the path.</param>
        /// <returns>CartesianCoordinate.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public override CartesianCoordinate PointByPathPosition(double sRelative)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region Methods (ICurve)

        /// <summary>
        /// Angle that is tangent to the slope of the curve [radians].
        /// </summary>
        /// <param name="angleNormal">Angle [radians] along the curve sweep where the tangential angle is desired.</param>
        public double TangentialAngle(double angleNormal)
        {
            return TangentVector(angleNormal).Angle();
        }

        /// <summary>
        /// Angle that is normal to the slope of the curve [radians].
        /// </summary>
        /// <param name="angleTangential">The slope of the curve [radians] where the normal angle is desired.</param>
        /// <returns></returns>
        public double NormalAngle(double angleTangential)
        {
            return NormalVector(angleTangential).Angle();
        }


        #endregion

        #region Methods: (IPolarCoordinates)
        /// <summary>
        /// Length of the path segment [radians].
        /// </summary>
        /// <returns>System.Double.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public double LengthPolar()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Polar-coordinates of the centroid of the line {radius, rotation[radians]}.
        /// </summary>
        /// <returns>KeyValuePair&lt;System.Double, System.Double&gt;.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public KeyValuePair<double, double> CentroidPolar()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// X-coordinate on the path that corresponds to the polar-coordinate given.
        /// </summary>
        /// <param name="theta">Rotation-coordinate for which an x-coordinate is desired.</param>
        /// <returns>System.Double.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public double XPolar(double theta)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Y-coordinate on the path that corresponds to the polar-coordinate given.
        /// </summary>
        /// <param name="theta">Rotation-coordinate for which a y-coordinate is desired [radians].</param>
        /// <returns>System.Double.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public double YPolar(double theta)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Coordinate on the path that corresponds to the position along the path.
        /// </summary>
        /// <param name="theta">The relative position along the path [radians].</param>
        /// <returns>CartesianCoordinate.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public CartesianCoordinate PointByPathPositionPolar(double theta)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Vector that is normal to the line connecting the defining points at the position specified.
        /// </summary>
        /// <param name="theta">The relative position along the path [radians].</param>
        /// <returns>CartesianCoordinate.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public CartesianCoordinate NormalVectorPolar(double theta)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Vector that is tangential to the line connecting the defining points at the position specified.
        /// </summary>
        /// <param name="theta">The relative position along the path [radians].</param>
        /// <returns>CartesianCoordinate.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public CartesianCoordinate TangentVectorPolar(double theta)
        {
            throw new NotImplementedException();
        }



        #endregion

        #region Methods (IPathSegmentCollision)



        #endregion

        #region Methods (IPathDivision)
        /// <summary>
        /// Returns a point a given fraction of the distance between point 1 and point 2 along the arc.
        /// </summary>
        /// <param name="fraction">Fraction of the way from point 1 to point 2.</param>
        /// <returns></returns>
        public CartesianCoordinate PointDivision(double fraction)
        {
            throw new NotImplementedException();
        }


        #endregion

        #region Methods: Public


        #endregion

        #region Methods: Static


        #region Intersect
        /// <summary>
        /// The circles intersect.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        /// <returns></returns>
        public static bool AreCirclesIntersecting(double radius1, double radius2, double centerSeparation)
        {
            return (Overlap(radius1, radius2, centerSeparation) >= 0);
        }

        /// <summary>
        /// The circles have tangent edges.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        /// <returns></returns>
        public static bool AreCirclesTangent(double radius1, double radius2, double centerSeparation)
        {
            return (Overlap(radius1, radius2, centerSeparation) >= 0);
        }

        /// <summary>
        /// The distance of separation between the edge of two circles.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        public static double Overlap(double radius1, double radius2, double centerSeparation)
        {
            return ((NMath.Abs(radius1) + NMath.Abs(radius2)) - NMath.Abs(centerSeparation));
        }

        /// <summary>
        /// Length of the chord formed by the intersection of two circles.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        /// <returns></returns>
        public static double RadicalLineLength(double radius1, double radius2, double centerSeparation)
        {
            if (!AreCirclesIntersecting(radius1, radius2, centerSeparation))
            {
                throw new ArgumentException("Circles do not intersect.");
            }
            if (AreCirclesTangent(radius1, radius2, centerSeparation)) { return 0; }
            return (NMath.Sqrt((-centerSeparation + radius2 - radius1) *
                               (-centerSeparation - radius2 + radius1) *
                               (-centerSeparation + radius2 + radius1) *
                               (centerSeparation + radius2 + radius1)) / centerSeparation);
        }

        /// <summary>
        /// The x-coordinate of the intersection of two circles.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
        /// <returns></returns>
        public static double CirclesIntersectX(double radius1, double radius2, double centerSeparation, double tolerance = GL.ZeroTolerance)
        {
            if (!AreCirclesIntersecting(radius1, radius2, centerSeparation))
            {
                throw new ArgumentException("Circles do not intersect.");
            }
            if (AreCirclesTangent(radius1, radius2, centerSeparation)) { return radius1; }

            return ((centerSeparation.Squared() - radius2.Squared() + radius1.Squared()) / (2 * centerSeparation));
        }

        /// <summary>
        /// The +/- y-coordinate of the intersection of two circles.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        /// <returns></returns>
        public static double CirclesIntersectY(double radius1, double radius2, double centerSeparation)
        {
            if (!AreCirclesIntersecting(radius1, radius2, centerSeparation))
            {
                throw new ArgumentException("Circles do not intersect.");
            }
            if (AreCirclesTangent(radius1, radius2, centerSeparation)) { return radius1; }

            return (0.5 * RadicalLineLength(radius1, radius2, centerSeparation));
        }

        /// <summary>
        /// The coordinate of the intersection of two circles.
        /// Returned point is +y, but there may be a second point of equal and opposite -y.
        /// </summary>
        /// <param name="radius1">Radius of the first circle.</param>
        /// <param name="radius2">Radius of the second circle.</param>
        /// <param name="centerSeparation">Separation between the centers of the two circles.</param>
        /// <returns></returns>
        public static CartesianCoordinate CirclesIntersect(double radius1, double radius2, double centerSeparation)
        {
            return new CartesianCoordinate (
                CirclesIntersectX(radius1, radius2, centerSeparation),
                CirclesIntersectY(radius1, radius2, centerSeparation));
        }

        /// <summary>
        /// The x-coordinates of a line intersecting a circle centered at 0,0.
        /// </summary>
        /// <param name="point1">First point forming the line.</param>
        /// <param name="point2">Second point forming the line.</param>
        /// <param name="radius">Radius of the circle centered at 0,0.</param>
        public static double[] CircleLineIntersectX(CartesianCoordinate point1, CartesianCoordinate point2, double radius)
        {
            CartesianOffset delta = new CartesianOffset(point1, point2);
            double determinant = point1.CrossProduct(point2);
            double lineLength = AlgebraLibrary.SRSS(delta.X(), delta.Y());
            double incidence = incidenceLineCircle(radius, lineLength, determinant);

            return CircleLineIntersectX(radius, lineLength, incidence, determinant, delta);
        }

        /// <summary>
        /// The x-coordinates of a line intersecting a circle centered at 0,0.
        /// </summary>
        /// <param name="radius">>Radius of the circle centered at 0,0.</param>
        /// <param name="lineLength"></param>
        /// <param name="incidence"></param>
        /// <param name="determinant"></param>
        /// <param name="delta"></param>
        /// <returns></returns>
        public static double[] CircleLineIntersectX(
            double radius,
            double lineLength,
            double incidence,
            double determinant,
            CartesianOffset delta)
        {
            return (determinant * delta.Y() / lineLength.Squared()).PlusMinus(
                               NMath.Sign(delta.Y()) * delta.X() * NMath.Sqrt(incidence) / lineLength.Squared());
        }

        /// <summary>
        /// The y-coordinates of a line intersecting a circle centered at 0,0.
        /// </summary>
        /// <param name="point1">First point forming the line.</param>
        /// <param name="point2">Second point forming the line.</param>
        /// <param name="radius">Radius of the circle centered at 0,0.</param>
        public static double[] CircleLineIntersectY(CartesianCoordinate point1, CartesianCoordinate point2, double radius)
        {
            CartesianOffset delta = new CartesianOffset(point1, point2);
            double determinant = point1.CrossProduct(point2);
            double lineLength = AlgebraLibrary.SRSS(delta.X(), delta.Y());
            double incidence = incidenceLineCircle(radius, lineLength, determinant);

            return CircleLineIntersectY(radius, lineLength, incidence, determinant, delta);
        }

        /// <summary>
        /// The y-coordinates of a line intersecting a circle centered at 0,0.
        /// </summary>
        /// <param name="radius"></param>
        /// <param name="lineLength"></param>
        /// <param name="incidence"></param>
        /// <param name="determinant"></param>
        /// <param name="delta"></param>
        /// <returns></returns>
        public static double[] CircleLineIntersectY(
            double radius,
            double lineLength,
            double incidence,
            double determinant,
            CartesianOffset delta)
        {
            return (-determinant * delta.X() / lineLength.Squared()).PlusMinus(
                              NMath.Abs(delta.Y()) * NMath.Sqrt(incidence) / lineLength.Squared());
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="point1"></param>
        /// <param name="point2"></param>
        /// <param name="radius"></param>
        /// <returns></returns>
        public static CartesianCoordinate [] CircleLineIntersect(CartesianCoordinate point1, CartesianCoordinate point2, double radius)
        {
            CartesianOffset delta = new CartesianOffset(point1, point2);
            double determinant = point1.CrossProduct(point2);
            double lineLength = AlgebraLibrary.SRSS(delta.X(), delta.Y());
            double incidence = incidenceLineCircle(radius, lineLength, determinant);

            double[] xCoords = CircleLineIntersectX(radius, lineLength, incidence, determinant, delta);
            double[] yCoords = CircleLineIntersectY(radius, lineLength, incidence, determinant, delta);

            return new[]
            {
                new CartesianCoordinate (xCoords[0], yCoords[0]),
                new CartesianCoordinate (xCoords[1], yCoords[1])
            };
        }

        /// <summary>
        /// Ares the circle line intersecting.
        /// </summary>
        /// <param name="point1">The point1.</param>
        /// <param name="point2">The point2.</param>
        /// <param name="radius">The radius.</param>
        /// <param name="tolerance">The tolerance.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public static bool AreCircleLineIntersecting(CartesianCoordinate point1, CartesianCoordinate point2, double radius, double tolerance = GL.ZeroTolerance)
        {
            return (AreCircleLineIntersecting(incidenceLineCircle(point1, point2, radius), tolerance));
        }

        /// <summary>
        /// Ares the circle line intersecting.
        /// </summary>
        /// <param name="incidence">The incidence.</param>
        /// <param name="tolerance">The tolerance.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public static bool AreCircleLineIntersecting(double incidence, double tolerance = GL.ZeroTolerance)
        {
            return (incidence.IsGreaterThan(0, tolerance));
        }

        /// <summary>
        /// Ares the circle line tangent.
        /// </summary>
        /// <param name="point1">The point1.</param>
        /// <param name="point2">The point2.</param>
        /// <param name="radius">The radius.</param>
        /// <param name="tolerance">The tolerance.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public static bool AreCircleLineTangent(CartesianCoordinate point1, CartesianCoordinate point2, double radius, double tolerance = GL.ZeroTolerance)
        {
            return (AreCircleLineTangent(incidenceLineCircle(point1, point2, radius), tolerance));
        }

        /// <summary>
        /// Ares the circle line tangent.
        /// </summary>
        /// <param name="incidence">The incidence.</param>
        /// <param name="tolerance">The tolerance.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public static bool AreCircleLineTangent(double incidence, double tolerance = GL.ZeroTolerance)
        {
            return (incidence.IsEqualTo(0, tolerance));
        }

        private static double incidenceLineCircle(CartesianCoordinate point1, CartesianCoordinate point2, double radius)
        {
            double determinant = point1.CrossProduct(point2);
            double lineLength = AlgebraLibrary.SRSS((point2.X - point1.X), (point2.Y - point1.Y));
            return incidenceLineCircle(radius, lineLength, determinant);
        }

        private static double incidenceLineCircle(double radius, double lineLength, double determinant)
        {
            return (radius * lineLength.Squared() - determinant.Squared());
        }

        public CartesianCoordinate PointExtension(double ratio)
        {
            throw new NotImplementedException();
        }



        #endregion

        #endregion
    }
}