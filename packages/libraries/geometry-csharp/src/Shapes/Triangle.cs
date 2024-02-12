// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-30-2020
// ***********************************************************************
// <copyright file="Triangle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using Algebra = MPT.Math.Algebra.AlgebraLibrary;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;
using Num = MPT.Math.Numbers;
using System.Collections.Generic;
using MPT.Geometry.Segments;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a triangular shape, with the origin at the lower left corner.
    /// This is any closed shape of 3 straight sides formed by 3 distinct coordinates.
    /// </summary>
    public class Triangle : Polygon, ICircumCircle, IIncircle
    {
        #region Properties
        /// <summary>
        /// Gets the coordinate for point a.
        /// </summary>
        /// <value>The point a.</value>
        public CartesianCoordinate PointA => _polyline.Coordinate(2);

        /// <summary>
        /// Gets the coordinate for point b.
        /// </summary>
        /// <value>The point b.</value>
        public CartesianCoordinate PointB => _polyline.Coordinate(0);

        /// <summary>
        /// Gets the coordinate for point c.
        /// </summary>
        /// <value>The point c.</value>
        public CartesianCoordinate PointC => _polyline.Coordinate(1);

        /// <summary>
        /// Gets the side a.
        /// </summary>
        /// <value>The side a.</value>
        public LineSegment SideA => _polyline[0] as LineSegment;

        /// <summary>
        /// Gets the side b.
        /// </summary>
        /// <value>The side b.</value>
        public LineSegment SideB => _polyline[1] as LineSegment; //_polyline[2] as LineSegment;

        /// <summary>
        /// Gets the side c.
        /// </summary>
        /// <value>The side c.</value>
        public LineSegment SideC => _polyline[2] as LineSegment; //_polyline[1] as LineSegment;

        /// <summary>
        /// The angle which is opposite of side a.
        /// </summary>
        /// <value>The alpha.</value>
        public virtual Angle AngleA => new Angle(getAngleA());

        /// <summary>
        /// The angle which is opposite of side b.
        /// </summary>
        /// <value>The beta.</value>
        public virtual Angle AngleB => new Angle(getAngleB());

        /// <summary>
        /// The angle which is opposite of side c.
        /// </summary>
        /// <value>The beta.</value>
        public virtual Angle AngleC => new Angle(getAngleC());

        /// <summary>
        /// Gets the height, which is the measurement of the line formed from any point to a perpendicular intersection with a side.
        /// This is one of the altitudes defined for the shape.
        /// </summary>
        /// <value>The h.</value>
        public virtual double h => getAltitude();

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 3 sides of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public virtual double InRadius { get; protected set; }

        /// <summary>
        /// Gets the incenter, which describes the center of a circle whose edge is tangent to all 3 sides of the triangle.
        /// This is also the intersection of projected lines from angle bisectors.
        /// </summary>
        /// <value>The in center.</value>
        public virtual CartesianCoordinate InCenter { get; protected set; }

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 3 defining points of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public virtual double CircumRadius { get; protected set; }

        /// <summary>
        /// Gets the circumcenter, which describes the center of a circle whose edges are defined by the 3 defining points of the triangle.
        /// This is also the intersection location of projected lines from perpendicular side bisectors.
        /// </summary>
        /// <value>The in center.</value>
        public virtual CartesianCoordinate CircumCenter { get; protected set; }

        /// <summary>
        /// The intersection of the three altitude lines, which are formed by a line drawn from an angle to a perpendicular intersection with the opposite side.
        /// </summary>
        /// <value>The ortho center.</value>
        public virtual CartesianCoordinate OrthoCenter { get; protected set; }

        /// <summary>
        /// The intersection of the three median lines, which are formed by a line drawn from the midpoint of a side through the opposite angle.
        /// </summary>
        /// <value>The centroid.</value>
        public override CartesianCoordinate Centroid => new CartesianCoordinate(
                (PointA.X + PointB.X + PointC.X) / 3,
                (PointA.Y + PointB.Y + PointC.Y) / 3
                );
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Triangle" /> class.
        /// </summary>
        protected Triangle()
        {
            //setCenterCoordinates();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Quadrilateral" /> class.
        /// </summary>
        /// <param name="pointA">The point opposite side a.</param>
        /// <param name="pointB">The point opposite side b.</param>
        /// <param name="pointC">The point opposite side c.</param>
        public Triangle(
            CartesianCoordinate pointA,
            CartesianCoordinate pointB,
            CartesianCoordinate pointC) : base(new List<CartesianCoordinate>() { pointA, pointB, pointC })/*base(new List<CartesianCoordinate>() { pointC, pointB, pointA })*/
        {
            setCenterCoordinates();

            setInRadius();
            setCircumradius();
        }

        /// <summary>
        /// Sets the center coordinates.
        /// </summary>
        protected void setCenterCoordinates()
        {
            setOrthocenter();
            setInCenter();
            setCircumcenter();
        }

        /// <summary>
        /// Sets the in-center.
        /// </summary>
        protected void setInCenter()
        {
            double x_ic = (SideLengthA() * PointA.X + SideLengthB() * PointB.X + SideLengthC() * PointC.X) / Perimeter();
            double y_ic = (SideLengthA() * PointA.Y + SideLengthB() * PointB.Y + SideLengthC() * PointC.Y) / Perimeter();
            InCenter = new CartesianCoordinate(x_ic, y_ic);
        }

        /// <summary>
        /// Sets the in-radius.
        /// </summary>
        protected void setInRadius()
        {
            InRadius = 0.5 * (((SideLengthB() + SideLengthC() - SideLengthA()) *
                               (SideLengthC() + SideLengthA() - SideLengthB()) *
                               (SideLengthA() + SideLengthB() - SideLengthC())) / Perimeter()).Sqrt();
        }

        /// <summary>
        /// Sets the circumcenter.
        /// </summary>
        protected void setCircumcenter()
        {
            IList<CartesianCoordinate> points = _polyline.Coordinates;
            CartesianCoordinate pointA = points[0];
            CartesianCoordinate pointB = points[1];
            CartesianCoordinate pointC = points[2];

            double d = 2 * (pointA.X * (pointB.Y - pointC.Y) +
                            pointB.X * (pointC.Y - pointA.Y) +
                            pointC.X * (pointA.Y - pointB.Y));

            double x_cc = ((pointA.X.Squared() + pointA.Y.Squared()) * (pointB.Y - pointC.Y) +
                           (pointB.X.Squared() + pointB.Y.Squared()) * (pointC.Y - pointA.Y) +
                           (pointC.X.Squared() + pointC.Y.Squared()) * (pointA.Y - pointB.Y)) / d;

            double y_cc = ((pointA.X.Squared() + pointA.Y.Squared()) * (pointC.X - pointB.X) +
                           (pointB.X.Squared() + pointB.Y.Squared()) * (pointA.X - pointC.X) +
                           (pointC.X.Squared() + pointC.Y.Squared()) * (pointB.X - pointA.X)) / d;

            CircumCenter = new CartesianCoordinate(x_cc, y_cc);
        }

        /// <summary>
        /// Sets the circumradius.
        /// </summary>
        protected void setCircumradius()
        {
            CircumRadius = SideLengthA() * SideLengthB() * SideLengthC() /
                (Perimeter() * (SideLengthB() + SideLengthC() - SideLengthA()) *
                               (SideLengthC() + SideLengthA() - SideLengthB()) *
                               (SideLengthA() + SideLengthB() - SideLengthC())).Sqrt();
        }

        /// <summary>
        /// Sets the orthocenter.
        /// </summary>
        protected void setOrthocenter()
        {
            // If any angle is 90 degrees, the orthocenter lies at the vertex at that angle
            double angleA = getAngleA();
            if (angleA.IsEqualTo(Num.PiOver2, 10E-10))
            {
                OrthoCenter = PointA;
                return;
            }

            double angleB = getAngleB();
            if (angleB.IsEqualTo(Num.PiOver2, 10E-10))
            {
                OrthoCenter = PointB;
                return;
            }

            double angleC = getAngleC();
            if (angleC.IsEqualTo(Num.PiOver2, 10E-10))
            {
                OrthoCenter = PointC;
                return;
            }

            double denominator = Trig.Tan(angleA) + Trig.Tan(angleB) + Trig.Tan(angleC);
            OrthoCenter = new CartesianCoordinate(
                (PointA.X * Trig.Tan(angleA) + PointB.X * Trig.Tan(angleB) + PointC.X * Trig.Tan(angleC)) / denominator,
                (PointA.Y * Trig.Tan(angleA) + PointB.Y * Trig.Tan(angleB) + PointC.Y * Trig.Tan(angleC)) / denominator
                );
        }
        #endregion

        #region Methods: Properties
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return (SemiPerimeter() *
                    (SemiPerimeter() - SideLengthA()) *
                    (SemiPerimeter() - SideLengthB()) *
                    (SemiPerimeter() - SideLengthC())).Sqrt();
        }

        /// <summary>
        /// Length of all sides of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Perimeter()
        {
            return SideLengthA() + SideLengthB() + SideLengthC();
        }

        /// <summary>
        /// Gets the semi-perimeter.
        /// </summary>
        /// <value>The semi perimeter.</value>
        public virtual double SemiPerimeter() => Perimeter() / 2;
        #endregion

        #region Methods: Sides
        /// <summary>
        /// Length of the vertical side, if applicable, a .
        /// </summary>
        /// <value>a.</value>
        public virtual double SideLengthA()
        {
            return Algebra.SRSS(
                PointC.X - PointB.X,
                PointC.Y - PointB.Y);
        }

        /// <summary>
        /// Length of the base/horizontal side, if applicable, b.
        /// </summary>
        /// <value>The b.</value>
        public virtual double SideLengthB()
        {
            return Algebra.SRSS(
                PointC.X - PointA.X,
                PointC.Y - PointA.Y);
        }

        /// <summary>
        /// Length of the hypotenuse side, if applicable, c.
        /// </summary>
        /// <value>The c.</value>
        public virtual double SideLengthC()
        {
            return Algebra.SRSS(
                PointA.X - PointB.X,
                PointA.Y - PointB.Y);
        }
        #endregion

        #region Methods: Altitudes
        /// <summary>
        /// Gets the altitude.
        /// </summary>
        /// <returns>System.Double.</returns>
        internal double getAltitude()
        {
            // get altitude for 90 deg angle if exists
            if (AngleA.Degrees.IsEqualTo(90, Tolerance))
            {
                return AltitudeLengthA();
            }
            if (AngleB.Degrees.IsEqualTo(90, Tolerance))
            {
                return AltitudeLengthB();
            }
            if (AngleC.Degrees.IsEqualTo(90, Tolerance))
            {
                return AltitudeLengthC();
            }

            return AltitudeLengthC();
        }

        /// <summary>
        /// The length of altitude line A, which spans from point A to a perpendicular intersection with side A.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double AltitudeLengthA()
        {
            return 2 * Area() / SideLengthA();
        }

        /// <summary>
        /// The coordinate where altitude line A intersects side A.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate AltitudeCoordinateA()
        {
            return projectionIntersection(PointA, SideA, OrthoCenter);
        }

        /// <summary>
        /// The line which spans from point A to a perpendicular intersection with side A.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment AltitudeLineA()
        {
            return new LineSegment(PointA, AltitudeCoordinateA());
        }

        /// <summary>
        /// The length of altitude line B, which spans from point B to a perpendicular intersection with side B.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double AltitudeLengthB()
        {
            return 2 * Area() / SideLengthB();
        }

        /// <summary>
        /// The coordinate where altitude line B intersects side B.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate AltitudeCoordinateB()
        {
            return projectionIntersection(PointB, SideB, OrthoCenter);
        }

        /// <summary>
        /// The line which spans from point B to a perpendicular intersection with side B.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment AltitudeLineB()
        {
            return new LineSegment(PointB, AltitudeCoordinateB());
        }

        /// <summary>
        /// The length of altitude line C, which spans from point C to a perpendicular intersection with side C.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double AltitudeLengthC()
        {
            return 2 * Area() / SideLengthC();
        }

        /// <summary>
        /// The coordinate where altitude line C intersects side C.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate AltitudeCoordinateC()
        {
            return projectionIntersection(PointC, SideC, OrthoCenter);
        }

        /// <summary>
        /// The line which spans from point C to a perpendicular intersection with side C.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment AltitudeLineC()
        {
            return new LineSegment(PointC, AltitudeCoordinateC());
        }
        #endregion

        #region Methods: Medians
        /// <summary>
        /// The length of median line A, which spans from point A to an intersection at the midpoint of side A.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double MedianLengthA()
        {
            return 0.5 * (2 * SideLengthB().Squared() + 2 * SideLengthC().Squared() - SideLengthA().Squared()).Sqrt();
        }

        /// <summary>
        /// The coordinate where median line A intersects side A.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate MedianCoordinateA()
        {
            return projectionIntersection(PointA, SideA, Centroid);
        }

        /// <summary>
        /// The line which spans from point A to an intersection at the midpoint of side A.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment MedianLineA()
        {
            return new LineSegment(PointA, MedianCoordinateA());
        }

        /// <summary>
        /// The length of median line B, which spans from point B to an intersection at the midpoint of side B.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double MedianLengthB()
        {
            return 0.5 * (2 * SideLengthA().Squared() + 2 * SideLengthC().Squared() - SideLengthB().Squared()).Sqrt();
        }

        /// <summary>
        /// The coordinate where median line B intersects side B.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate MedianCoordinateB()
        {
            return projectionIntersection(PointB, SideB, Centroid);
        }

        /// <summary>
        /// The line which spans from point B to an intersection at the midpoint of side B.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment MedianLineB()
        {
            return new LineSegment(PointB, MedianCoordinateB());
        }

        /// <summary>
        /// The length of median line C, which spans from point C to an intersection at the midpoint of side C.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double MedianLengthC()
        {
            return 0.5 * (2 * SideLengthB().Squared() + 2 * SideLengthA().Squared() - SideLengthC().Squared()).Sqrt();
        }

        /// <summary>
        /// The coordinate where median line C intersects side C.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate MedianCoordinateC()
        {
            return projectionIntersection(PointC, SideC, Centroid);
        }

        /// <summary>
        /// The line which spans from point C to an intersection at the midpoint of side C.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment MedianLineC()
        {
            return new LineSegment(PointC, MedianCoordinateC());
        }
        #endregion

        #region Methods: Angle Bisectors
        /// <summary>
        /// The length of angle bisector line A, which spans from point A to an intersection with side A such that angle A is bisected.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double AngleBisectorLengthA()
        {
            return (SideLengthB() * SideLengthC() * (1 - (SideLengthA() / (SideLengthB() + SideLengthC())).Squared())).Sqrt();
        }

        /// <summary>
        /// The coordinate where angle bisector line A intersects side A.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate AngleBisectorCoordinateA()
        {
            return projectionIntersection(PointA, SideA, InCenter);
        }

        /// <summary>
        /// The line which spans from point A to an intersection with side A such that angle A is bisected.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment AngleBisectorLineA()
        {
            return new LineSegment(PointA, AngleBisectorCoordinateA());
        }

        /// <summary>
        /// The length of angle bisector line B, which spans from point B to an intersection with side B such that angle B is bisected.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double AngleBisectorLengthB()
        {
            return (SideLengthA() * SideLengthC() * (1 - (SideLengthB() / (SideLengthA() + SideLengthC())).Squared())).Sqrt();
        }

        /// <summary>
        /// The coordinate where angle bisector line B intersects side B.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate AngleBisectorCoordinateB()
        {
            return projectionIntersection(PointB, SideB, InCenter);
        }

        /// <summary>
        /// The line which spans from point B to an intersection with side B such that angle B is bisected.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment AngleBisectorLineB()
        {
            return new LineSegment(PointB, AngleBisectorCoordinateB());
        }

        /// <summary>
        /// The length of angle bisector line C, which spans from point C to an intersection with side C such that angle C is bisected.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double AngleBisectorLengthC()
        {
            return (SideLengthB() * SideLengthA() * (1 - (SideLengthC() / (SideLengthB() + SideLengthA())).Squared())).Sqrt();
        }

        /// <summary>
        /// The coordinate where angle bisector line C intersects side C.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate AngleBisectorCoordinateC()
        {
            return projectionIntersection(PointC, SideC, InCenter);
        }

        /// <summary>
        /// The line which spans from point C to an intersection with side C such that angle C is bisected.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment AngleBisectorLineC()
        {
            return new LineSegment(PointC, AngleBisectorCoordinateC());
        }
        #endregion

        #region Methods: Perpendicular Side Bisectors
        /// <summary>
        /// a
        /// </summary>
        private double _A;
        /// <summary>
        /// The b
        /// </summary>
        private double _B;
        /// <summary>
        /// The c
        /// </summary>
        private double _C;

        /// <summary>
        /// Sets the perpendicular side bisectors sides arranged in descending order.
        /// </summary>
        private void setPerpendicularSideBisectors()
        {
            List<double> sides = new List<double>() { SideLengthA(), SideLengthB(), SideLengthC() };
            sides.Sort();
            _A = sides[2];
            _B = sides[1];
            _C = sides[0];
        }

        /// <summary>
        /// The length of perpendicular side bisector line A, which spans from the circumcenter to a perpendicular intersection with side A such that side A is bisected.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double PerpendicularSideBisectorLengthA()
        {
            setPerpendicularSideBisectors();
            return 2 * _A * Area() / (_A.Squared() + _B.Squared() - _C.Squared());
        }

        /// <summary>
        /// The coordinate where perpendicular side bisector line A intersects side A.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate PerpendicularSideBisectorCoordinateA()
        {
            return MedianCoordinateA();
        }

        /// <summary>
        /// The line which spans from the circumcenter to a perpendicular intersection with side A such that side A is bisected.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment PerpendicularSideBisectorLineA()
        {
            return new LineSegment(PerpendicularSideBisectorCoordinateA(), CircumCenter);
        }

        /// <summary>
        /// The length of perpendicular side bisector line B, which spans from the circumcenter to a perpendicular intersection with side B such that side B is bisected.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double PerpendicularSideBisectorLengthB()
        {
            setPerpendicularSideBisectors();
            return 2 * _B * Area() / (_A.Squared() + _B.Squared() - _C.Squared());
        }

        /// <summary>
        /// The coordinate where perpendicular side bisector line BA intersects side B.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate PerpendicularSideBisectorCoordinateB()
        {
            return MedianCoordinateB();
        }

        /// <summary>
        /// The line which spans from the circumcenter to a perpendicular intersection with side B such that side B is bisected.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment PerpendicularSideBisectorLineB()
        {
            return new LineSegment(PerpendicularSideBisectorCoordinateB(), CircumCenter);
        }

        /// <summary>
        /// The length of perpendicular side bisector line C, which spans from the circumcenter to a perpendicular intersection with side C such that side C is bisected.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double PerpendicularSideBisectorLengthC()
        {
            setPerpendicularSideBisectors();
            return 2 * _C * Area() / (_A.Squared() - _B.Squared() + _C.Squared());
        }

        /// <summary>
        /// The coordinate where perpendicular side bisector line C intersects side C.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate PerpendicularSideBisectorCoordinateC()
        {
            return MedianCoordinateC();
        }

        /// <summary>
        /// The line which spans from the circumcenter to a perpendicular intersection with side C such that side C is bisected.
        /// </summary>
        /// <returns>LineSegment.</returns>
        public LineSegment PerpendicularSideBisectorLineC()
        {
            return new LineSegment(PerpendicularSideBisectorCoordinateC(), CircumCenter);
        }
        #endregion

        #region Methods: Private/Protected
        /// <summary>
        /// Returns a coordinate that is the intersection of a line projected from a corner through a midpoint into the opposite side.
        /// </summary>
        /// <param name="point">The corner point.</param>
        /// <param name="opposingSide">The opposing side.</param>
        /// <param name="center">The center point used for creating the projection line.</param>
        /// <returns>CartesianCoordinate.</returns>
        private CartesianCoordinate projectionIntersection(
            CartesianCoordinate point,
            LineSegment opposingSide,
            CartesianCoordinate center)
        {
            if (point == center)
            {
                return opposingSide.CoordinateOfPerpendicularProjection(center);
            }
            LineSegment segmentProjectionPartial = new LineSegment(point, center);
            return segmentProjectionPartial.CoordinateOfSegmentProjectedToCurve(opposingSide.Curve);
        }

        /// <summary>
        /// Gets the angle alpha.
        /// </summary>
        /// <returns>System.Double.</returns>
        protected double getAngleA()
        {
            return Trig.ArcCos((SideLengthB().Squared() + SideLengthC().Squared() - SideLengthA().Squared()) / (2 * SideLengthB() * SideLengthC()));
        }

        /// <summary>
        /// Gets the angle beta.
        /// </summary>
        /// <returns>System.Double.</returns>
        protected double getAngleB()
        {
            return Trig.ArcCos((SideLengthA().Squared() + SideLengthC().Squared() - SideLengthB().Squared()) / (2 * SideLengthA() * SideLengthC()));
        }

        /// <summary>
        /// Gets the angle gamma.
        /// </summary>
        /// <returns>System.Double.</returns>
        protected double getAngleC()
        {
            return Trig.ArcCos((SideLengthA().Squared() + SideLengthB().Squared() - SideLengthC().Squared()) / (2 * SideLengthA() * SideLengthB()));
        }
        #endregion
    }
}