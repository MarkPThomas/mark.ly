using System;
using NUnit.Framework;

using MPT.Geometry.Segments;
using MPT.Math.Coordinates;
using MPT.Math.Vectors;
using Num = MPT.Math.Numbers;
using System.Collections.Generic;
using MPT.Math.Curves;

namespace MPT.Geometry.UnitTests.Segments
{
    [TestFixture]
    public static class LineSegmentTests
    {
        public static double Tolerance = 0.00001;

        #region Initialization
        [Test]
        public static void Initialization_with_Coordinates_Results_in_Object_with_Immutable_Coordinates_Properties_List()
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(3, 4), new CartesianCoordinate(5, 6));

            Assert.AreEqual(3, lineSegment.I.X);
            Assert.AreEqual(4, lineSegment.I.Y);
            Assert.AreEqual(5, lineSegment.J.X);
            Assert.AreEqual(6, lineSegment.J.Y);
            Assert.AreEqual(3, lineSegment.Curve.ControlPointI.X);
            Assert.AreEqual(4, lineSegment.Curve.ControlPointI.Y);
            Assert.AreEqual(5, lineSegment.Curve.ControlPointJ.X);
            Assert.AreEqual(6, lineSegment.Curve.ControlPointJ.Y);
        }

        [Test]
        public static void Changing_Tolerance_Cascades_to_Properties()
        {
            double defaultTolerance = 10E-6;
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(3, 4), new CartesianCoordinate(5, 6));

            Assert.AreEqual(defaultTolerance, lineSegment.Tolerance);
            Assert.AreEqual(defaultTolerance, lineSegment.I.Tolerance);
            Assert.AreEqual(defaultTolerance, lineSegment.J.Tolerance);

            double newTolerance = 10E-3;
            lineSegment.Tolerance = newTolerance;

            Assert.AreEqual(newTolerance, lineSegment.Tolerance);
            Assert.AreEqual(newTolerance, lineSegment.I.Tolerance);
            Assert.AreEqual(newTolerance, lineSegment.J.Tolerance);
        }
        #endregion

        #region Methods: IPathSegment
        [TestCase(1, 1, 2, 1, 1)] // Horizontal
        [TestCase(1, 1, 1, 2, 1)] // Vertical
        [TestCase(1, 2, 3, 4, 2.828427)] // + slope
        [TestCase(-1, -2, -3, -4, 2.828427)] // - slope
        [TestCase(1, 2, -3, -4, 7.2111103)] // - slope
        public static void Length(double x1, double y1, double x2, double y2, double expectedResult)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            Assert.AreEqual(expectedResult, segment.Length(), Tolerance);
        }

        [TestCase(1, 1, 2, 1, 1.5)] // Horizontal
        [TestCase(1, 1, 1, 2, 1)] // Vertical
        [TestCase(1, 2, 3, 4, 2)] // + slope
        [TestCase(-1, -2, -3, -4, -2)] // - slope
        [TestCase(1, 2, -3, -4, -1)] // - slope
        public static void Xo(double x1, double y1, double x2, double y2, double expectedResult)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            Assert.AreEqual(expectedResult, segment.Xo(), Tolerance);
        }

        [TestCase(1, 1, 2, 1, 1)] // Horizontal
        [TestCase(1, 1, 1, 2, 1.5)] // Vertical
        [TestCase(1, 2, 3, 4, 3)] // + slope
        [TestCase(-1, -2, -3, -4, -3)] // - slope
        [TestCase(1, 2, -3, -4, -1)] // - slope
        public static void Yo(double x1, double y1, double x2, double y2, double expectedResult)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            Assert.AreEqual(expectedResult, segment.Yo(), Tolerance);
        }

        [TestCase(1, 1, 2, 1, 1, double.PositiveInfinity)] // Horizontal, on line
        [TestCase(1, 1, 2, 1, 2, double.PositiveInfinity)] // Horizontal, off line
        [TestCase(1, 1, 1, 2, 1.25, 1)] // Vertical
        [TestCase(1, 2, 3, 4, 2.5, 1.5)] // + slope
        [TestCase(-1, -2, -3, -4, -2.5, -1.5)] // - slope
        [TestCase(1, 2, -3, -4, 0.2, -0.2)] // - slope
        public static void X(double x1, double y1, double x2, double y2, double y, double expectedResult)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            Assert.AreEqual(expectedResult, segment.X(y), Tolerance);
        }

        [TestCase(1, 1, 2, 1, 1.25, 1)] // Horizontal
        [TestCase(1, 1, 1, 2, 1, double.PositiveInfinity)] // Vertical, on line
        [TestCase(1, 1, 1, 2, 2, double.PositiveInfinity)] // Vertical, off line
        [TestCase(1, 2, 3, 4, 1.5, 2.5)] // + slope
        [TestCase(-1, -2, -3, -4, -1.5, -2.5)] // - slope
        [TestCase(1, 2, -3, -4, -0.2, 0.2)] // - slope
        public static void Y(double x1, double y1, double x2, double y2, double x, double expectedResult)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            Assert.AreEqual(expectedResult, segment.Y(x), Tolerance);
        }

        [TestCase(1, 1, 2, 1, 0.25, 1.25, 1)] // Horizontal
        [TestCase(1, 1, 1, 2, 0.25, 1, 1.25)] // Vertical
        [TestCase(1, 2, 3, 4, 0.25, 1.5, 2.5)] // + slope
        [TestCase(-1, -2, -3, -4, 0.25, -1.5, -2.5)] // - slope
        [TestCase(1, 2, -3, -4, 0.3, -0.2, 0.2)] // - slope
        public static void PointByPathPosition(double x1, double y1, double x2, double y2, double sRelative, double expectedResultX, double expectedResultY)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));
            CartesianCoordinate coordinate = segment.PointByPathPosition(sRelative);

            Assert.AreEqual(expectedResultX, coordinate.X, Tolerance);
            Assert.AreEqual(expectedResultY, coordinate.Y, Tolerance);
        }

        [TestCase(-1)]
        [TestCase(2)]
        public static void PointByPathPosition_Throws_ArgumentOutOfRangeException_if_sRelative_is_Out_of_Range(double sRelative)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));

            Assert.Throws<ArgumentOutOfRangeException>(() => { segment.PointByPathPosition(sRelative); });
        }

        [TestCase(1, 1, 2, 1, 0.25, 0, 1)] // Horizontal
        [TestCase(1, 1, 1, 2, 0.25, -1, 0)] // Vertical
        [TestCase(1, 2, 3, 4, 0.25, -0.707107, 0.707107)] // + slope
        [TestCase(3, 4, 1, 2, 0.25, 0.707107, -0.707107)] // - slope by reversing + slope coordinates
        [TestCase(-1, -2, -3, -4, 0.25, 0.707107, -0.707107)] // - slope
        [TestCase(1, 2, -3, -4, 0.3, 0.832050, -0.554700)] // - slope
        [TestCase(1, 2, -3, -4, -1, 0.832050, -0.554700)] // sRelative less than 0
        [TestCase(1, 2, -3, -4, 2, 0.832050, -0.554700)] // sRelative greater than 1
        public static void NormalVector(double x1, double y1, double x2, double y2, double sRelative, double expectedXMagnitude, double expectedYMagnitude)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));
            Vector vector = segment.NormalVector(sRelative);

            Assert.AreEqual(expectedXMagnitude, vector.Xcomponent, Tolerance);
            Assert.AreEqual(expectedYMagnitude, vector.Ycomponent, Tolerance);
        }

        [TestCase(1, 1, 2, 1, 0.25, 1, 0)] // Horizontal
        [TestCase(1, 1, 1, 2, 0.25, 0, 1)] // Vertical
        [TestCase(1, 2, 3, 4, 0.25, 0.707107, 0.707107)] // + slope
        [TestCase(3, 4, 1, 2, 0.25, -0.707107, -0.707107)] // - slope by reversing + slope coordinates
        [TestCase(-1, -2, -3, -4, 0.25, -0.707107, -0.707107)] // - slope
        [TestCase(1, 2, -3, -4, 0.3, -0.554700, -0.832050)] // - slope
        [TestCase(1, 2, -3, -4, -1, -0.554700, -0.832050)] // sRelative less than 0
        [TestCase(1, 2, -3, -4, 2, -0.554700, -0.832050)] // sRelative greater than 1
        public static void TangentVector(double x1, double y1, double x2, double y2, double sRelative, double expectedXMagnitude, double expectedYMagnitude)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));
            Vector vector = segment.TangentVector(sRelative);

            Assert.AreEqual(expectedXMagnitude, vector.Xcomponent, Tolerance);
            Assert.AreEqual(expectedYMagnitude, vector.Ycomponent, Tolerance);
        }

        [Test]
        public static void UpdateI()
        {

        }

        [Test]
        public static void UpdateJ()
        {

        }

        [Test]
        public static void Reverse()
        {

        }
        #endregion

        #region Methods: IPathSegmentCollision
        [TestCase(1, 2, 3, 4, -6, 6, false)]  // Not on line
        [TestCase(1, 1, 3, 1, 2, 1, true)]  // Horizontal, within points
        [TestCase(1, 2, 1, 4, 1, 3, true)]  // Vertical, within points
        [TestCase(1, 2, 3, 4, 2, 3, true)]  // Sloped, within points
        [TestCase(1.2, 3.4, 6.7, 9.1, 3.95, 6.25, true)]  // Sloped, within points
        [TestCase(1, 1, 3, 1, 1, 1, true)]  // Horizontal, on i
        [TestCase(1, 2, 1, 4, 1, 2, true)]  // Vertical, on i
        [TestCase(1, 2, 3, 4, 1, 2, true)]  // Sloped, on i
        [TestCase(1.2, 3.4, 6.7, 9.1, 1.2, 3.4, true)]  // on i
        [TestCase(1, 1, 3, 1, 3, 1, true)]  // Horizontal, on j
        [TestCase(1, 2, 1, 4, 1, 4, true)]  // Vertical, on j
        [TestCase(1, 2, 3, 4, 3, 4, true)]  // Sloped, on j
        [TestCase(1.2, 3.4, 6.7, 9.1, 6.7, 9.1, true)]  // Sloped, on j
        [TestCase(1, 1, 3, 1, -1, 1, false)]  // Horizontal, before i
        [TestCase(1, 2, 1, 4, 1, 1, false)]  // Vertical, before i
        [TestCase(1, 2, 3, 4, -2, -1, false)]  // Sloped, before i
        [TestCase(1.2, 3.4, 6.7, 9.1, 0, 2.15636, false)]  // Sloped, before i
        [TestCase(1, 1, 3, 1, 4, 1, false)]  // Horizontal, after j
        [TestCase(1, 2, 1, 4, 1, 5, false)]  // Vertical, after j
        [TestCase(1, 2, 3, 4, 4, 5, false)]  // Sloped, after j
        [TestCase(1.2, 3.4, 6.7, 9.1, 9.45, 11.95, false)]  // Sloped, after j
        public static void IncludesCoordinate(
            double x1, double y1, double x2, double y2,
            double pointX, double pointY, bool expectedResult)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));
            CartesianCoordinate coordinate = new CartesianCoordinate(pointX, pointY);

            Assert.AreEqual(expectedResult, segment.IncludesCoordinate(coordinate));
        }

        [TestCase(-5, 6, -3, -2, 1, 5, -7, 3, true)] // sloped perpendicular, within points
        [TestCase(-5, 2, -5, 8, -5, 6, 5, 6, true)] // aligned perpendicular + vertical, within points
        [TestCase(-5, 8, -5, 2, -5, 6, 5, 6, true)] // aligned perpendicular - vertical, within points
        [TestCase(-5, 6, -3, -2, -5, 6, -1, 7, true)] // sloped perpendicular, on i-i points
        [TestCase(-5, 6, -3, -2, -1, 7, -5, 6, true)] // sloped perpendicular, on i-j points
        [TestCase(-5, 6, -3, -2, -3, -2, 1, -1, true)] // sloped perpendicular, on j-i points
        [TestCase(-5, 6, -3, -2, 5, 6, 1, 5, false)] // sloped perpendicular, before segment1 i
        [TestCase(-5, 8, -5, 11, -5, 6, 5, 6, false)] // aligned perpendicular + vertical, before segment1 i
        [TestCase(-5, 11, -5, 8, -5, 6, 5, 6, false)] // aligned perpendicular - vertical, before segment1 i
        [TestCase(-5, 6, -3, -2, -7, 3, -11, 2, false)] // sloped perpendicular, after segment1 j
        [TestCase(-5, -2, -5, 2, -5, 6, 5, 6, false)] // aligned perpendicular + vertical, after segment1 j
        [TestCase(-5, 2, -5, -2, -5, 6, 5, 6, false)] // aligned perpendicular - vertical, after segment1 j
        [TestCase(1, 2, 3, 4, 2, 3, 4, 5, false)] // + slope parallel
        [TestCase(-5, 6, -3, -1, 5, 6, 7, -1, false)] // - slope parallel
        [TestCase(-1, 2, 1, 2, -2, 3, 2, 3, false)] // horizontal parallel
        [TestCase(-5, -2, -5, 2, 5, 6, 5, 8, false)] // + vertical parallel
        [TestCase(-5, 2, -5, -2, 5, 8, 5, 6, false)] // - vertical parallel
        [TestCase(-5, 2, -5, -2, 5, 6, 5, 8, false)] // +/- vertical parallel
        public static void IsIntersecting(
            double xi1, double yi1, double xj1, double yj1,
            double xi2, double yi2, double xj2, double yj2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(
                new CartesianCoordinate(xi1, yi1),
                new CartesianCoordinate(xj1, yj1));

            LineSegment segment2 = new LineSegment(
                new CartesianCoordinate(xi2, yi2),
                new CartesianCoordinate(xj2, yj2));

            Assert.AreEqual(expectedResult, segment1.IsIntersecting(segment2));
        }

        [TestCase(-5, 6, -3, -2, 1, 5, -7, 3, -4.411765, 3.647059)] // sloped perpendicular, within points
        [TestCase(-5, 2, -5, 8, -5, 6, 5, 6, -5, 6)] // aligned perpendicular + vertical, within points
        [TestCase(-5, 8, -5, 2, -5, 6, 5, 6, -5, 6)] // aligned perpendicular - vertical, within points
        [TestCase(-5, 6, -3, -2, -5, 6, -1, 7, -5, 6)] // sloped perpendicular, on i-i points
        [TestCase(-5, 6, -3, -2, -1, 7, -5, 6, -5, 6)] // sloped perpendicular, on i-j points
        [TestCase(-5, 6, -3, -2, -3, -2, 1, -1, -3, -2)] // sloped perpendicular, on j-i points
        [TestCase(-5, 2, -5, 8, -5, 2, 1, 2, -5, 2)] // aligned perpendicular + vertical, on i-i points
        public static void IntersectionCoordinate(
            double xi1, double yi1, double xj1, double yj1,
            double xi2, double yi2, double xj2, double yj2, double expectedX, double expectedY)
        {
            LineSegment segment1 = new LineSegment(
                new CartesianCoordinate(xi1, yi1),
                new CartesianCoordinate(xj1, yj1));

            LineSegment segment2 = new LineSegment(
                new CartesianCoordinate(xi2, yi2),
                new CartesianCoordinate(xj2, yj2));

            CartesianCoordinate coordinateResult = segment1.IntersectionCoordinate(segment2);

            Assert.AreEqual(expectedX, coordinateResult.X, Tolerance);
            Assert.AreEqual(expectedY, coordinateResult.Y, Tolerance);
        }


        [TestCase(-5, 6, -3, -2, 1, 5, 5, 6)] //, -4.411765, 3.647059)] // sloped perpendicular, outside points
        [TestCase(-5, 6, -3, -2, 5.2, 6.1, 7.7, -1.3)] // slope, within points
        [TestCase(1, 2, 3, 4, 2, 3, 4, 5)] // + slope parallel
        [TestCase(-5, 6, -3, -1, 5, 6, 7, -1)] // - slope parallel
        [TestCase(-1, 2, 1, 2, -2, 3, 2, 3)] // horizontal parallel
        [TestCase(-5, -2, -5, 2, 5, 6, 5, 8)] // + vertical parallel
        [TestCase(-5, 2, -5, -2, 5, 8, 5, 6)] // - vertical parallel
        [TestCase(-5, 2, -5, -2, 5, 6, 5, 8)] // +/- vertical parallel
        public static void IntersectionCoordinate_Throws_ArgumentOutOfRangeException_if_Segments_Do_Not_Intersect(
            double xi1, double yi1, double xj1, double yj1,
            double xi2, double yi2, double xj2, double yj2)
        {
            LineSegment segment1 = new LineSegment(
                new CartesianCoordinate(xi1, yi1),
                new CartesianCoordinate(xj1, yj1));

            LineSegment segment2 = new LineSegment(
                new CartesianCoordinate(xi2, yi2),
                new CartesianCoordinate(xj2, yj2));

            Assert.Throws<ArgumentOutOfRangeException>(() => { segment1.IntersectionCoordinate(segment2); });
        }
        #endregion

        #region Methods: IPathTransform
        [TestCase(3, 2, 5, 3, 0, 0, 3, 2, 5, 3)]    // 0
        [TestCase(3, 2, 5, 3, 3, 1, 6, 3, 8, 4)]    // Default - +x, y, Quadrant I
        [TestCase(3, 2, 5, 3, -3, 1, 0, 3, 2, 4)]    // Negative x
        [TestCase(3, 2, 5, 3, 3, -1, 6, 1, 8, 2)]    // Negative y
        [TestCase(-3, 2, -5, 3, 3, 1, 0, 3, -2, 4)]    // Default in Quadrant II
        [TestCase(-3, -2, -5, -3, 3, 1, 0, -1, -2, -2)]    // Default in Quadrant III
        [TestCase(3, -2, 5, -3, 3, 1, 6, -1, 8, -2)]    // Default in Quadrant IV
        public static void Translate(
            double i_x, double i_y,
            double j_x, double j_y,
            double deltaX, double deltaY,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianOffset translation = new CartesianOffset(deltaX, deltaY);

            IPathSegment translatedSegment = segment.Translate(translation);
            Assert.AreEqual(expectedI_x, translatedSegment.I.X);
            Assert.AreEqual(expectedI_y, translatedSegment.I.Y);
            Assert.AreEqual(expectedJ_x, translatedSegment.J.X);
            Assert.AreEqual(expectedJ_y, translatedSegment.J.Y);
        }

        [TestCase(0, 4, 2, 4, 2, 4, 2)]
        [TestCase(0.75, 4, 2, 1.75, 1.25, 4.75, 7.25)]
        [TestCase(1, 4, 2, 1, 1, 5, 9)]
        [TestCase(1.5, 4, 2, -0.5, 0.5, 5.5, 12.5)]
        [TestCase(-0.25, 4, 2, 4.75, 2.25, 3.75, 0.25)]
        [TestCase(-1, 4, 2, 7, 3, 3, -5)]
        public static void ScaleFromPoint(double scale,
            double point_x, double point_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(1, 1);
            CartesianCoordinate pointJ = new CartesianCoordinate(5, 9);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianCoordinate referencePoint = new CartesianCoordinate(point_x, point_y);
            IPathSegment scaledSegment = segment.ScaleFromPoint(scale, referencePoint);

            Assert.AreEqual(expectedI_x, scaledSegment.I.X);
            Assert.AreEqual(expectedI_y, scaledSegment.I.Y);
            Assert.AreEqual(expectedJ_x, scaledSegment.J.X);
            Assert.AreEqual(expectedJ_y, scaledSegment.J.Y);
        }

        [TestCase(3, 2, 5, 3, 0, 0, 0, 0, 0)]    // 0
        [TestCase(3, 2, 5, 3, 2, 6, 4, 10, 6)]    // Default - larger, Quadrant I
        [TestCase(3, 2, 5, 3, 0.5, 1.5, 1, 2.5, 1.5)]    // Smaller
        [TestCase(3, 2, 5, 3, -2, -6, -4, -10, -6)]    // Negative
        [TestCase(-3, 2, -5, 3, 2, -6, 4, -10, 6)]    // Default in Quadrant II
        [TestCase(-3, -2, -5, -3, 2, -6, -4, -10, -6)]    // Default in Quadrant III
        [TestCase(3, -2, 5, -3, 2, 6, -4, 10, -6)]    // Default in Quadrant IV
        public static void ScaleFromPoint_About_Origin(
           double i_x, double i_y,
           double j_x, double j_y,
           double scale,
           double expectedI_x, double expectedI_y,
           double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianCoordinate referencePoint = new CartesianCoordinate(0, 0);
            IPathSegment scaledSegment = segment.ScaleFromPoint(scale, referencePoint);

            Assert.AreEqual(expectedI_x, scaledSegment.I.X);
            Assert.AreEqual(expectedI_y, scaledSegment.I.Y);
            Assert.AreEqual(expectedJ_x, scaledSegment.J.X);
            Assert.AreEqual(expectedJ_y, scaledSegment.J.Y);
        }

        [TestCase(0, 2, 1, 8, 4)]
        [TestCase(Num.PiOver4, -3.970563, -10.585786, -1.849242, -4.221825)]
        [TestCase(Num.PiOver2, 0, -23, -3, -17)]
        [TestCase(3 * Num.PiOver4, 11.585786, -28.970563, 5.221825, -26.849242)]
        [TestCase(Num.Pi, 24, -25, 18, -28)]
        [TestCase(5 * Num.PiOver4, 29.970563, -13.414214, 27.849242, -19.778175)]
        [TestCase(3 * Num.PiOver2, 26, -1, 29, -7)]
        [TestCase(7 * Num.PiOver4, 14.414214, 4.970563, 20.778175, 2.849242)]
        [TestCase(-Num.PiOver4, 14.414214, 4.970563, 20.778175, 2.849242)]
        public static void RotateAboutPoint(
            double radianRotation,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(2, 1);
            CartesianCoordinate pointJ = new CartesianCoordinate(8, 4);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianCoordinate referencePoint = new CartesianCoordinate(13, -12);
            IPathSegment scaledSegment = segment.RotateAboutPoint(radianRotation, referencePoint);

            Assert.AreEqual(expectedI_x, scaledSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, scaledSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, scaledSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, scaledSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 4, 3, 90, -2, 3, -3, 4)]    // Rotate + to quadrant II
        [TestCase(3, 2, 4, 3, 180, -3, -2, -4, -3)]    // Rotate + to quadrant III
        [TestCase(3, 2, 4, 3, 270, 2, -3, 3, -4)]    // Rotate + to quadrant IV
        [TestCase(3, 2, 4, 3, 360, 3, 2, 4, 3)]    // Rotate + full circle
        [TestCase(3, 2, 4, 3, -90, 2, -3, 3, -4)]    // Rotate - to quadrant II
        [TestCase(3, 2, 4, 3, -180, -3, -2, -4, -3)]    // Rotate - to quadrant III
        [TestCase(3, 2, 4, 3, -270, -2, 3, -3, 4)]    // Rotate - to quadrant IV
        [TestCase(3, 2, 4, 3, -360, 3, 2, 4, 3)]    // Rotate - full circle
        public static void RotateAboutPoint_About_Origin(
            double i_x, double i_y,
            double j_x, double j_y,
            double degreeRotation,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            Angle rotation = Angle.CreateFromDegree(degreeRotation);
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianCoordinate referencePoint = new CartesianCoordinate(0, 0);
            IPathSegment scaledSegment = segment.RotateAboutPoint(rotation.Radians, referencePoint);

            Assert.AreEqual(expectedI_x, scaledSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, scaledSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, scaledSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, scaledSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 5, 3, 0, 0, 5, 5, 2, 0, 3.8, 2, 6.2, 3)]    // Shear +x
        [TestCase(3, 2, 5, 3, 0, 0, 5, 5, -2, 0, 2.2, 2, 3.8, 3)]    // Shear -x
        [TestCase(3, 2, 5, 3, 0, 0, 5, 5, 0, 2, 3, 3.2, 5, 5)]    // Shear +y
        [TestCase(3, 2, 5, 3, 0, 0, 5, 5, 0, -2, 3, 0.8, 5, 1)]    // Shear -y
        [TestCase(3, 2, 5, 3, 0, 0, 5, 5, 2, 3, 3.8, 3.8, 6.2, 6)]    // Shear +x, +y, Quadrant I
        [TestCase(-3, 2, -5, 3, 0, 0, -5, 5, 2, 3, -2.2, 3.8, -3.8, 6)]    // Shear +x, +y, Quadrant II
        [TestCase(-3, -2, -5, -3, 0, 0, -5, -5, 2, 3, -2.2, -0.2, -3.8, 0)]    // Shear +x, +y, Quadrant III
        [TestCase(3, -2, 5, -3, 0, 0, 5, -5, 2, 3, 3.8, -0.2, 6.2, 0)]    // Shear +x, +y, Quadrant IV
        [TestCase(3, 2, 5, 3, 2, 2, 5, 5, 2, 0, 4.33333333333333, 2, 7, 3)]    // Bounding box as skew box
        [TestCase(3, 2, 5, 3, 2, 2, 5, 5, 0, 2, 3, 4, 5, 6.33333333333333)]    // Bounding box as skew box
        public static void Skew(
            double i_x, double i_y,
            double j_x, double j_y,
            double stationaryPointX, double stationaryPointY,
            double skewingPointX, double skewingPointY,
            double magnitudeX, double magnitudeY,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianCoordinate stationaryReferencePoint = new CartesianCoordinate(stationaryPointX, stationaryPointY);
            CartesianCoordinate skewingReferencePoint = new CartesianCoordinate(skewingPointX, skewingPointY);
            CartesianOffset magnitude = new CartesianOffset(magnitudeX, magnitudeY);

            IPathSegment skewedSegment = segment.Skew(stationaryReferencePoint, skewingReferencePoint, magnitude);

            Assert.AreEqual(expectedI_x, skewedSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, skewedSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, skewedSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, skewedSegment.J.Y, Tolerance);
        }


        [TestCase(3, 2, 4, 3, 0, 1, 0, -1, -3, 2, -4, 3)]    // Mirror about y-axis to Quadrant II
        [TestCase(3, 2, 4, 3, 0, -1, 0, 1, -3, 2, -4, 3)]    // Mirror about y-axis to Quadrant II, reversed line
        [TestCase(3, 2, 4, 3, 1, 0, -1, 0, 3, -2, 4, -3)]    // Mirror about x-axis to Quadrant IV
        [TestCase(3, 2, 4, 3, -1, 0, 1, 0, 3, -2, 4, -3)]    // Mirror about x-axis to Quadrant IV, reversed line
        [TestCase(3, 2, 4, 3, 0, 0, 1, 1, 2, 3, 3, 4)]    // Mirror about 45 deg sloped line about shape center
        [TestCase(3, 2, 4, 3, 0, 0, -1, -1, 2, 3, 3, 4)]    // Mirror about 45 deg sloped line about shape center, reversed line
        [TestCase(3, 2, 4, 3, 0, 0, -1, 1, -2, -3, -3, -4)]    // Mirror about 45 deg sloped line to quadrant III
        [TestCase(3, 2, 4, 3, 0, 0, 1, -1, -2, -3, -3, -4)]    // Mirror about 45 deg sloped line to quadrant III, reversed line
        public static void MirrorAboutLine(
            double i_x, double i_y,
            double j_x, double j_y,
            double lineX1, double lineY1, double lineX2, double lineY2,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            LinearCurve referenceLine = new LinearCurve(new CartesianCoordinate(lineX1, lineY1), new CartesianCoordinate(lineX2, lineY2));

            IPathSegment mirroredSegment = segment.MirrorAboutLine(referenceLine);

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 4, 3, 3, -2, 4, -3)]    // Mirror about x-axis to Quadrant IV
        [TestCase(3, 2, 4, 3, 3, -2, 4, -3)]    // Mirror about x-axis to Quadrant IV, reversed line
        public static void MirrorAboutAxisX(
            double i_x, double i_y,
            double j_x, double j_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment mirroredSegment = segment.MirrorAboutAxisX();

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 4, 3, -3, 2, -4, 3)]    // Mirror about y-axis to Quadrant II
        [TestCase(3, 2, 4, 3, -3, 2, -4, 3)]    // Mirror about y-axis to Quadrant II, reversed line
        public static void MirrorAboutAxisY(
            double i_x, double i_y,
            double j_x, double j_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment mirroredSegment = segment.MirrorAboutAxisY();

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }
        #endregion

        #region Methods: Transform About Ends I, J
        [TestCase(0, 1, 1)]
        [TestCase(0.75, 4, 7)]
        [TestCase(1, 5, 9)]
        [TestCase(1.25, 6, 11)]
        [TestCase(-0.5, -1, -3)]
        public static void ScaleFromI(double scaleFromI, double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(1, 1);
            CartesianCoordinate pointJ = new CartesianCoordinate(5, 9);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment scaledSegment = segment.ScaleFromI(scaleFromI);

            Assert.AreEqual(pointI.X, scaledSegment.I.X);
            Assert.AreEqual(pointI.Y, scaledSegment.I.Y);
            Assert.AreEqual(expectedJ_x, scaledSegment.J.X);
            Assert.AreEqual(expectedJ_y, scaledSegment.J.Y);
        }

        [TestCase(0, 5, 9)]
        [TestCase(0.75, 2, 3)]
        [TestCase(1, 1, 1)]
        [TestCase(1.5, -1, -3)]
        [TestCase(-0.25, 6, 11)]
        public static void ScaleFromJ(double scaleFromJ, double expectedI_x, double expectedI_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(1, 1);
            CartesianCoordinate pointJ = new CartesianCoordinate(5, 9);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment scaledSegment = segment.ScaleFromJ(scaleFromJ);

            Assert.AreEqual(pointJ.X, scaledSegment.J.X);
            Assert.AreEqual(pointJ.Y, scaledSegment.J.Y);
            Assert.AreEqual(expectedI_x, scaledSegment.I.X);
            Assert.AreEqual(expectedI_y, scaledSegment.I.Y);
        }


        [TestCase(0, 8, 4)]
        [TestCase(Num.PiOver4, 4.121320, 7.363961)]
        [TestCase(Num.PiOver2, -1, 7)]
        [TestCase(3 * Num.PiOver4, -4.363961, 3.121320)]
        [TestCase(Num.Pi, -4, -2)]
        [TestCase(5 * Num.PiOver4, -0.121320, -5.363961)]
        [TestCase(3 * Num.PiOver2, 5, -5)]
        [TestCase(7 * Num.PiOver4, 8.363961, -1.121320)]
        [TestCase(-Num.PiOver4, 8.363961, -1.121320)]
        public static void RotateAboutI(double radianRotation, double expectedJ_x, double expectedJ_y)
        {
            Angle rotation = new Angle(radianRotation);
            CartesianCoordinate pointI = new CartesianCoordinate(2, 1);
            CartesianCoordinate pointJ = new CartesianCoordinate(8, 4);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment scaledSegment = segment.RotateAboutI(rotation);

            Assert.AreEqual(pointI.X, scaledSegment.I.X, Tolerance);
            Assert.AreEqual(pointI.Y, scaledSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, scaledSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, scaledSegment.J.Y, Tolerance);
        }

        [TestCase(0, 2, 1)]
        [TestCase(Num.PiOver4, 5.878680, -2.363961)]
        [TestCase(Num.PiOver2, 11, -2)]
        [TestCase(3 * Num.PiOver4, 14.363961, 1.878680)]
        [TestCase(Num.Pi, 14, 7)]
        [TestCase(5 * Num.PiOver4, 10.121320, 10.363961)]
        [TestCase(3 * Num.PiOver2, 5, 10)]
        [TestCase(7 * Num.PiOver4, 1.636039, 6.121320)]
        [TestCase(-Num.PiOver4, 1.636039, 6.121320)]
        public static void RotateAboutJ(double radianRotation, double expectedI_x, double expectedI_y)
        {
            Angle rotation = new Angle(radianRotation);
            CartesianCoordinate pointI = new CartesianCoordinate(2, 1);
            CartesianCoordinate pointJ = new CartesianCoordinate(8, 4);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment scaledSegment = segment.RotateAboutJ(rotation);

            Assert.AreEqual(pointJ.X, scaledSegment.J.X, Tolerance);
            Assert.AreEqual(pointJ.Y, scaledSegment.J.Y, Tolerance);
            Assert.AreEqual(expectedI_x, scaledSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, scaledSegment.I.Y, Tolerance);
        }


        [TestCase(3, 2, 5, 3, 2, 0, 7, 2, 11, 3)]    // I Shear +x
        [TestCase(3, 2, 5, 3, -2, 0, -1, 2, -1, 3)]    // I Shear -x
        [TestCase(3, 2, 5, 3, 0, 2, 3, 5, 5, 8)]    // I Shear +y
        [TestCase(3, 2, 5, 3, 0, -2, 3, -1, 5, -2)]    // I Shear -y
        public static void SkewAboutI(
            double i_x, double i_y,
            double j_x, double j_y,
            double magnitudeX, double magnitudeY,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianOffset magnitude = new CartesianOffset(magnitudeX, magnitudeY);

            IPathSegment skewedSegment = segment.SkewAboutI(magnitude);

            Assert.AreEqual(expectedI_x, skewedSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, skewedSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, skewedSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, skewedSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 5, 3, 2, 0, -1, 2, -1, 3)]    // I Shear +x
        [TestCase(3, 2, 5, 3, -2, 0, 7, 2, 11, 3)]    // I Shear -x
        [TestCase(3, 2, 5, 3, 0, 2, 3, -1, 5, -2)]    // I Shear +y
        [TestCase(3, 2, 5, 3, 0, -2, 3, 5, 5, 8)]    // I Shear -y
        public static void SkewAboutJ(
            double i_x, double i_y,
            double j_x, double j_y,
            double magnitudeX, double magnitudeY,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            CartesianOffset magnitude = new CartesianOffset(magnitudeX, magnitudeY);

            IPathSegment skewedSegment = segment.SkewAboutJ(magnitude);

            Assert.AreEqual(expectedI_x, skewedSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, skewedSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, skewedSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, skewedSegment.J.Y, Tolerance);
        }



        [TestCase(3, 2, 4, 3, 3, 2, 4, 1)]    // I Mirror about x-axis to Quadrant IV
        public static void MirrorAboutAxisIX(
            double i_x, double i_y,
            double j_x, double j_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment mirroredSegment = segment.MirrorAboutAxisIX();

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 4, 3, 3, 2, 2, 3)]    // I Mirror about y-axis to Quadrant II
        public static void MirrorAboutAxisIY(
            double i_x, double i_y,
            double j_x, double j_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment mirroredSegment = segment.MirrorAboutAxisIY();

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 4, 3, 3, 4, 4, 3)]    // J Mirror about x-axis to Quadrant IV
        public static void MirrorAboutAxisJX(
            double i_x, double i_y,
            double j_x, double j_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment mirroredSegment = segment.MirrorAboutAxisJX();

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }

        [TestCase(3, 2, 4, 3, 5, 2, 4, 3)]    // J Mirror about y-axis to Quadrant II
        public static void MirrorAboutAxisJY(
            double i_x, double i_y,
            double j_x, double j_y,
            double expectedI_x, double expectedI_y,
            double expectedJ_x, double expectedJ_y)
        {
            CartesianCoordinate pointI = new CartesianCoordinate(i_x, i_y);
            CartesianCoordinate pointJ = new CartesianCoordinate(j_x, j_y);
            LineSegment segment = new LineSegment(pointI, pointJ);

            IPathSegment mirroredSegment = segment.MirrorAboutAxisJY();

            Assert.AreEqual(expectedI_x, mirroredSegment.I.X, Tolerance);
            Assert.AreEqual(expectedI_y, mirroredSegment.I.Y, Tolerance);
            Assert.AreEqual(expectedJ_x, mirroredSegment.J.X, Tolerance);
            Assert.AreEqual(expectedJ_y, mirroredSegment.J.Y, Tolerance);
        }
        #endregion

        #region Methods: IPathDivisionExtension
        [Test]
        public static void SplitBySegmentPoint_Splits_Segment_by_Specified_Coordinate()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            CartesianCoordinate coordinateAtSplit = new CartesianCoordinate(4, 1);

            Tuple<IPathSegment, IPathSegment> segmentSplit = segment.SplitBySegmentPoint(coordinateAtSplit);
            Assert.AreEqual(coordinateI, segmentSplit.Item1.I);
            Assert.AreEqual(coordinateAtSplit, segmentSplit.Item1.J);
            Assert.AreEqual(coordinateAtSplit, segmentSplit.Item2.I);
            Assert.AreEqual(coordinateJ, segmentSplit.Item2.J);
        }

        [Test]
        public static void SplitBySegmentPoint_Throws_ArgumentOutOfRangeException_for_Ratio_Greater_Than_1()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            CartesianCoordinate position = new CartesianCoordinate(-4, 9);

            Assert.Throws<ArgumentOutOfRangeException>(() => segment.SplitBySegmentPoint(position));
        }

        [Test]
        public static void SplitBySegmentPoint_Throws_ArgumentOutOfRangeException_for_Negative_Ratio()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            CartesianCoordinate position = new CartesianCoordinate(11, -6);

            Assert.Throws<ArgumentOutOfRangeException>(() => segment.SplitBySegmentPoint(position));
        }

        [Test]
        public static void SplitBySegmentPoint_Throws_ArgumentOutOfRangeException_for_Point_Not_On_Curve()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            CartesianCoordinate position = new CartesianCoordinate(0, 0);

            Assert.Throws<ArgumentOutOfRangeException>(() => segment.SplitBySegmentPoint(position));
        }

        [Test]
        public static void ExtendSegmentToPoint_Point_Not_On_Curve_Throws_Exception()
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(1, 2));
            CartesianCoordinate pointExtension = new CartesianCoordinate(-1, -3);

            Assert.Throws<ArgumentOutOfRangeException>(() => lineSegment.ExtendSegmentToPoint(pointExtension));
        }

        [TestCase(0, 0, 1, 2, -1, -2)] // + Sloped
        [TestCase(0, 0, -1, -2, 1, 2)] // - Sloped
        [TestCase(1, 1, 1, 2, 1, -2)] // Vertical
        [TestCase(1, 2, 4, 2, -1, 2)] // Horizontal
        public static void ExtendSegmentToPoint_Before_Point_I(double iX, double iY, double jX, double jY, double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX, iY), new CartesianCoordinate(jX, jY));
            CartesianCoordinate pointExtension = new CartesianCoordinate(x, y);

            LineSegment extendedLineSegment = lineSegment.ExtendSegmentToPoint(pointExtension) as LineSegment;

            Assert.AreEqual(pointExtension, extendedLineSegment.I);
        }

        [TestCase(0, 0, 1, 2, 2, 4)] // + Sloped
        [TestCase(0, 0, -1, -2, -2, -4)] // - Sloped
        [TestCase(1, 1, 1, 2, 1, 4)] // Vertical
        [TestCase(1, 2, 4, 2, 6, 2)] // Horizontal
        public static void ExtendSegmentToPoint_After_Point_J(double iX, double iY, double jX, double jY, double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX, iY), new CartesianCoordinate(jX, jY));
            CartesianCoordinate pointExtension = new CartesianCoordinate(x, y);

            LineSegment extendedLineSegment = lineSegment.ExtendSegmentToPoint(pointExtension) as LineSegment;

            Assert.AreEqual(pointExtension, extendedLineSegment.J);
        }

        [TestCase(0, 0, 1, 2, 1, 0, 2, 2)] // + Sloped
        [TestCase(0, 0, -1, -2, -1, 0, -2, -2)] // - Sloped
        [TestCase(1, 1, 1, 2, 2, 1, 2, 2)] // Vertical
        [TestCase(1, 2, 4, 2, 1, 3, 4, 3)] // Horizontal
        public static void CoordinateOfSegmentProjectedToCurve_Point_Not_On_Curve_Throws_Exception(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            Assert.Throws<ArgumentOutOfRangeException>(() => lineSegment.CoordinateOfSegmentProjectedToCurve(linearCurve));
        }

        [TestCase(-7, 3, -11, 2, -5, 2, -4, 3, -3, 4)] // + Sloped - + Sloped
        [TestCase(-7, 3, -11, 2, -5, 6, -3, -2, -4.41176470588235, 3.64705882352941)] // + Sloped - - Sloped
        [TestCase(-5, 6, -3, -2, -11, 2, -7, 3, -4.41176470588235, 3.64705882352941)] // - Sloped - + Sloped
        [TestCase(-5, 6, -3, -2, -2, 8, -8, 11, -6, 10)] // - Sloped - - Sloped
        [TestCase(-7, 2, -11, 3, -4, 1, 5, 1, -3, 1)] // Vertical - Horizontal
        [TestCase(-5, 2, -5, -2, -4, 6, 5, 6, -5, 6)] // Vertical - + Sloped
        [TestCase(-4, 6, 5, 6, -5, -2, -5, 2, -5, 6)] // Horizontal - Vertical
        [TestCase(-4, 6, 5, 6, -7, -2, -6, 2, -5, 6)] // Horizontal - + Sloped
        public static void CoordinateOfSegmentProjectedToCurve_Before_Point_I(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2,
            double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            CartesianCoordinate pointExtensionExpected = new CartesianCoordinate(x, y);
            pointExtensionExpected.Tolerance = 0.000001;
            CartesianCoordinate pointExtension = lineSegment.CoordinateOfSegmentProjectedToCurve(linearCurve);
            pointExtension.Tolerance = 0.000001;

            Assert.AreEqual(pointExtensionExpected, pointExtension);
        }

        [TestCase(-11, 2, -7, 3, -5, 2, -4, 3, -3, 4)] // + Sloped - + Sloped
        [TestCase(-11, 2, -7, 3, -5, 6, -3, -2, -4.41176470588235, 3.64705882352941)] // + Sloped - - Sloped
        [TestCase(-3, -2, -5, 6, -11, 2, -7, 3, -4.41176470588235, 3.64705882352941)] // - Sloped - + Sloped
        [TestCase(-3, -2, -5, 6, -2, 8, -8, 11, -6, 10)] // - Sloped - - Sloped
        [TestCase(-11, 3, -7, 2, -4, 1, 5, 1, -3, 1)] // Vertical - Horizontal
        [TestCase(-5, -2, -5, 2, -4, 6, 5, 6, -5, 6)] // Vertical - + Sloped
        [TestCase(5, 6, -4, 6, -5, -2, -5, 2, -5, 6)] // Horizontal - Vertical
        [TestCase(5, 6, -4, 6, -7, -2, -6, 2, -5, 6)] // Horizontal - + Sloped
        public static void CoordinateOfSegmentProjectedToCurve_After_Point_J(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2,
            double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            CartesianCoordinate pointExtensionExpected = new CartesianCoordinate(x, y);
            pointExtensionExpected.Tolerance = 0.000001;
            CartesianCoordinate pointExtension = lineSegment.CoordinateOfSegmentProjectedToCurve(linearCurve);
            pointExtension.Tolerance = 0.000001;

            Assert.AreEqual(pointExtensionExpected, pointExtension);
        }

        [TestCase(0, 0, 1, 2, 1, 0, 2, 2)] // + Sloped
        [TestCase(0, 0, -1, -2, -1, 0, -2, -2)] // - Sloped
        [TestCase(1, 1, 1, 2, 2, 1, 2, 2)] // Vertical
        [TestCase(1, 2, 4, 2, 1, 3, 4, 3)] // Horizontal
        public static void ExtendSegmentToCurve_Curves_Parallel_Throws_Exception(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            Assert.Throws<ArgumentOutOfRangeException>(() => lineSegment.ExtendSegmentToCurve(linearCurve));
        }

        [TestCase(-7, 3, -11, 2, -5, 2, -4, 3, -3, 4)] // + Sloped - + Sloped
        [TestCase(-7, 3, -11, 2, -4, 2, -3, -2, -4.41176470588235, 3.64705882352941)] // + Sloped - - Sloped
        [TestCase(-4, 2, -3, -2, -11, 2, -7, 3, -4.41176470588235, 3.64705882352941)] // - Sloped - + Sloped
        [TestCase(-5, 6, -3, -2, -2, 8, -8, 11, -6, 10)] // - Sloped - - Sloped
        [TestCase(-7, 2, -11, 3, -4, 1, 5, 1, -3, 1)] // Vertical - Horizontal
        [TestCase(-5, 2, -5, -2, -4, 6, 5, 6, -5, 6)] // Vertical - + Sloped
        [TestCase(-4, 6, 5, 6, -5, -2, -5, 2, -5, 6)] // Horizontal - Vertical
        [TestCase(-4, 6, 5, 6, -7, -2, -6, 2, -5, 6)] // Horizontal - + Sloped
        public static void ExtendSegmentToCurve_Before_Point_I(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2,
            double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            CartesianCoordinate pointExtensionExpected = new CartesianCoordinate(x, y);
            pointExtensionExpected.Tolerance = 0.000001;
            LineSegment lineExtended = lineSegment.ExtendSegmentToCurve(linearCurve) as LineSegment;
            lineExtended.Tolerance = 0.000001;

            Assert.AreEqual(pointExtensionExpected, lineExtended.I);
        }

        [TestCase(-11, 2, -7, 3, -5, 2, -4, 3, -3, 4)] // + Sloped - + Sloped
        [TestCase(-11, 2, -7, 3, -4, 2, -3, -2, -4.41176470588235, 3.64705882352941)] // + Sloped - - Sloped
        [TestCase(-3, -2, -4, 2, -11, 2, -7, 3, -4.41176470588235, 3.64705882352941)] // - Sloped - + Sloped
        [TestCase(-3, -2, -5, 6, -2, 8, -8, 11, -6, 10)] // - Sloped - - Sloped
        [TestCase(-11, 3, -7, 2, -4, 1, 5, 1, -3, 1)] // Vertical - Horizontal
        [TestCase(-5, -2, -5, 2, -4, 6, 5, 6, -5, 6)] // Vertical - + Sloped
        [TestCase(5, 6, -4, 6, -5, -2, -5, 2, -5, 6)] // Horizontal - Vertical
        [TestCase(5, 6, -4, 6, -7, -2, -6, 2, -5, 6)] // Horizontal - + Sloped
        public static void ExtendSegmentToCurve_After_Point_J(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2,
            double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            CartesianCoordinate pointExtensionExpected = new CartesianCoordinate(x, y);
            pointExtensionExpected.Tolerance = 0.000001;
            LineSegment lineExtended = lineSegment.ExtendSegmentToCurve(linearCurve) as LineSegment;
            lineExtended.Tolerance = 0.000001;

            Assert.AreEqual(pointExtensionExpected, lineExtended.J);
        }

        [TestCase(-3, -2, -5, 6, -11, 2, -7, 3, -4.41176470588235, 3.64705882352941)] // - Sloped - + Sloped
        [TestCase(-5, 6, -3, -2, -11, 2, -7, 3, -4.41176470588235, 3.64705882352941)] // - Sloped - + Sloped, flipped i-j segment coordinates
        public static void ExtendSegmentToCurve_Truncates_J_to_Curve_Intersection(
            double iX1, double iY1, double jX1, double jY1,
            double iX2, double iY2, double jX2, double jY2,
            double x, double y)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(iX1, iY1), new CartesianCoordinate(jX1, jY1));
            LinearCurve linearCurve = new LinearCurve(new CartesianCoordinate(iX2, iY2), new CartesianCoordinate(jX2, jY2));

            CartesianCoordinate pointExtensionExpected = new CartesianCoordinate(x, y);
            pointExtensionExpected.Tolerance = 0.000001;
            LineSegment lineExtended = lineSegment.ExtendSegmentToCurve(linearCurve) as LineSegment;
            lineExtended.Tolerance = 0.000001;

            Assert.AreEqual(pointExtensionExpected, lineExtended.J);
        }

        [TestCase(-7, 7, -6, 4)]
        [TestCase(-5, 1, -6, 4)]
        [TestCase(-4, 8, -3, 5)]
        [TestCase(-2, 2, -3, 5)]
        [TestCase(-1, 9, 0, 6)]
        [TestCase(1, 3, 0, 6)]
        [TestCase(5, 11, 6, 8)]
        [TestCase(7, 5, 6, 8)]
        [TestCase(8, 12, 9, 9)]
        [TestCase(10, 6, 9, 9)]
        public static void CoordinateOfPerpendicularProjection_Sloped_Line(double x, double y, double xExpected, double yExpected)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(-3, 5), new CartesianCoordinate(6, 8));
            CartesianCoordinate coordinate = new CartesianCoordinate(x, y);
            CartesianCoordinate expectedPerpendicularIntersection = new CartesianCoordinate(xExpected, yExpected);

            CartesianCoordinate actualPerpendicularIntersection = lineSegment.CoordinateOfPerpendicularProjection(coordinate);

            expectedPerpendicularIntersection.Tolerance = Tolerance;
            actualPerpendicularIntersection.Tolerance = Tolerance;

            Assert.AreEqual(expectedPerpendicularIntersection, actualPerpendicularIntersection);
        }

        [TestCase(2, 10, 5, 10)]
        [TestCase(8, 10, 5, 10)]
        [TestCase(2, 8, 5, 8)]
        [TestCase(8, 8, 5, 8)]
        [TestCase(2, 6, 5, 6)]
        [TestCase(8, 6, 5, 6)]
        [TestCase(2, 4, 5, 4)]
        [TestCase(8, 4, 5, 4)]
        [TestCase(2, 2, 5, 2)]
        [TestCase(8, 2, 5, 2)]
        public static void CoordinateOfPerpendicularProjection_Vertical_Line(double x, double y, double xExpected, double yExpected)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(5, 4), new CartesianCoordinate(5, 8));
            CartesianCoordinate coordinate = new CartesianCoordinate(x, y);
            CartesianCoordinate expectedPerpendicularIntersection = new CartesianCoordinate(xExpected, yExpected);

            CartesianCoordinate actualPerpendicularIntersection = lineSegment.CoordinateOfPerpendicularProjection(coordinate);

            expectedPerpendicularIntersection.Tolerance = Tolerance;
            actualPerpendicularIntersection.Tolerance = Tolerance;

            Assert.AreEqual(expectedPerpendicularIntersection, actualPerpendicularIntersection);
        }

        [TestCase(3, 2, 3, 4)]
        [TestCase(3, 6, 3, 4)]
        [TestCase(6, 2, 6, 4)]
        [TestCase(6, 6, 6, 4)]
        [TestCase(9, 2, 9, 4)]
        [TestCase(9, 6, 9, 4)]
        [TestCase(12, 2, 12, 4)]
        [TestCase(12, 6, 12, 4)]
        [TestCase(15, 2, 15, 4)]
        [TestCase(15, 6, 15, 4)]
        public static void CoordinateOfPerpendicularProjection_Horizontal_Line(double x, double y, double xExpected, double yExpected)
        {
            LineSegment lineSegment = new LineSegment(new CartesianCoordinate(6, 4), new CartesianCoordinate(12, 4));
            CartesianCoordinate coordinate = new CartesianCoordinate(x, y);
            CartesianCoordinate expectedPerpendicularIntersection = new CartesianCoordinate(xExpected, yExpected);

            CartesianCoordinate actualPerpendicularIntersection = lineSegment.CoordinateOfPerpendicularProjection(coordinate);

            expectedPerpendicularIntersection.Tolerance = Tolerance;
            actualPerpendicularIntersection.Tolerance = Tolerance;

            Assert.AreEqual(expectedPerpendicularIntersection, actualPerpendicularIntersection);
        }

        [TestCase(-3, 4, 5, 6, 0, -3, 4)]
        [TestCase(-3, 4, 5, 6, 0.5, 1, 5)]
        [TestCase(-3, 4, 5, 6, 1, 5, 6)]
        public static void PointOffsetOnSegment(
            double x1, double y1, double x2, double y2,
            double fraction, double expectedX, double expectedY)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            CartesianCoordinate coordinateResult = segment.PointOffsetOnSegment(fraction);

            Assert.AreEqual(expectedX, coordinateResult.X, Tolerance);
            Assert.AreEqual(expectedY, coordinateResult.Y, Tolerance);
        }

        [Test]
        public static void PointOffsetOnSegment_Throws_ArgumentOutOfRangeException_for_Ratio_Less_Than_0()
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));

            Assert.Throws<ArgumentOutOfRangeException>(() => { segment.PointOffsetOnSegment(-0.1); });
        }

        [Test]
        public static void PointOffsetOnSegment_Throws_ArgumentOutOfRangeException_for_Ratio_Greater_Than_1()
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));

            Assert.Throws<ArgumentOutOfRangeException>(() => { segment.PointOffsetOnSegment(1.1); });
        }

        [Test]
        public static void PointOffsetOnSegment_Throws_ArgumentOutOfRangeException_for_Negative_Ratio()
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));

            Assert.Throws<ArgumentOutOfRangeException>(() => { segment.PointOffsetOnSegment(-0.5); });
        }

        [TestCase(-3, 4, 5, 6, -1.5, -15, 1)]
        [TestCase(-3, 4, 5, 6, -0.5, -7, 3)]
        [TestCase(-3, 4, 5, 6, 0, 5, 6)]
        [TestCase(-3, 4, 5, 6, 0.5, 9, 7)]
        [TestCase(-3, 4, 5, 6, 1, 13, 8)]
        [TestCase(-3, 4, 5, 6, 1.5, 17, 9)]
        public static void PointScaledFromSegment(
            double x1, double y1, double x2, double y2,
            double ratio, double expectedX, double expectedY)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            CartesianCoordinate coordinateResult = segment.PointScaledFromSegment(ratio);

            Assert.AreEqual(expectedX, coordinateResult.X, Tolerance);
            Assert.AreEqual(expectedY, coordinateResult.Y, Tolerance);
        }

        [Test]
        public static void MergeWithPriorSegment_Merges_Current_Segment_with_Prior()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[1], coordinates[2]);

            LineSegment segmentMerged = segment2.MergeWithPriorSegment(segment1) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[2], segmentMerged.J);
        }

        [Test]
        public static void MergeWithPriorSegment_when_Segments_Not_Joined_Merges_Current_Segment_with_Prior()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8.5, 5.5),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[2], coordinates[3]);

            LineSegment segmentMerged = segment2.MergeWithPriorSegment(segment1) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[3], segmentMerged.J);
        }

        [Test]
        public static void MergeWithPriorSegment_when_J_Nodes_Overlap_Returns_Merged_Segment_with_Flipped_J_Node()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[2], coordinates[1]);

            LineSegment segmentMerged = segment2.MergeWithPriorSegment(segment1) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[2], segmentMerged.J);
        }

        [Test]
        public static void MergeWithPriorSegment_when_I_Nodes_Overlap_Returns_Merged_Segment_with_Flipped_I_Node()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[1], coordinates[0]);
            LineSegment segment2 = new LineSegment(coordinates[1], coordinates[2]);

            LineSegment segmentMerged = segment2.MergeWithPriorSegment(segment1) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[2], segmentMerged.J);
        }

        [Test]
        public static void MergeWithFollowingSegment_Merges_Current_Segment_with_Following()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[1], coordinates[2]);

            LineSegment segmentMerged = segment1.MergeWithFollowingSegment(segment2) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[2], segmentMerged.J);
        }

        [Test]
        public static void MergeWithFollowingSegment_when_Segments_Not_Joined_Merges_Current_Segment_with_Following()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8.5, 5.5),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[2], coordinates[3]);

            LineSegment segmentMerged = segment1.MergeWithFollowingSegment(segment2) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[3], segmentMerged.J);
        }

        [Test]
        public static void MergeWithFollowingSegment_when_J_Nodes_Overlap_Returns_Merged_Segment_with_Flipped_J_Node()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[2], coordinates[1]);

            LineSegment segmentMerged = segment1.MergeWithFollowingSegment(segment2) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[2], segmentMerged.J);
        }

        [Test]
        public static void MergeWithFollowingSegment_when_I_Nodes_Overlap_Returns_Merged_Segment_with_Flipped_I_Node()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[1], coordinates[0]);
            LineSegment segment2 = new LineSegment(coordinates[1], coordinates[2]);

            LineSegment segmentMerged = segment1.MergeWithFollowingSegment(segment2) as LineSegment;
            Assert.AreEqual(coordinates[0], segmentMerged.I);
            Assert.AreEqual(coordinates[2], segmentMerged.J);
        }

        [Test]
        public static void SplitBySegmentPosition_Splits_Segment_by_Specified_Position()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            double position = 0.4;
            CartesianCoordinate coordinateAtSplit = new CartesianCoordinate(4, 1);

            Tuple<IPathSegment, IPathSegment> segmentSplit = segment.SplitBySegmentPosition(position);
            Assert.AreEqual(coordinateI, segmentSplit.Item1.I);
            Assert.AreEqual(coordinateAtSplit, segmentSplit.Item1.J);
            Assert.AreEqual(coordinateAtSplit, segmentSplit.Item2.I);
            Assert.AreEqual(coordinateJ, segmentSplit.Item2.J);
        }

        [Test]
        public static void SplitBySegmentPosition_Throws_ArgumentOutOfRangeException_for_Ratio_Greater_Than_1()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            double position = 1.2;

            Assert.Throws<ArgumentOutOfRangeException>(() => segment.SplitBySegmentPosition(position));
        }

        [Test]
        public static void SplitBySegmentPosition_Throws_ArgumentOutOfRangeException_for_Negative_Ratio()
        {
            CartesianCoordinate coordinateI = new CartesianCoordinate(6, -1);
            CartesianCoordinate coordinateJ = new CartesianCoordinate(1, 4);
            LineSegment segment = new LineSegment(coordinateI, coordinateJ);

            double position = -0.4;

            Assert.Throws<ArgumentOutOfRangeException>(() => segment.SplitBySegmentPosition(position));
        }

        [Test]
        public static void JoinWithPriorSegment_Returns_Segment_Joining_Current_Segment_with_Prior()
        {
            CartesianCoordinate segment1I = new CartesianCoordinate(6, 1);
            CartesianCoordinate segment1J = new CartesianCoordinate(7, 4);
            LineSegment segment1 = new LineSegment(segment1I, segment1J);

            CartesianCoordinate segment2I = new CartesianCoordinate(5, 7);
            CartesianCoordinate segment2J = new CartesianCoordinate(1, 6);
            LineSegment segment2 = new LineSegment(segment2I, segment2J);

            LineSegment segmentJoin = segment2.JoinWithPriorSegment(segment1) as LineSegment;
            Assert.AreEqual(segment1J, segmentJoin.I);
            Assert.AreEqual(segment2I, segmentJoin.J);
        }

        [Test]
        public static void JoinWithPriorSegment_Returns_Null_when_Joining_Segments_Already_Joined()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[1], coordinates[2]);

            LineSegment segmentJoin = segment2.JoinWithPriorSegment(segment1) as LineSegment;
            Assert.IsNull(segmentJoin);
        }

        [Test]
        public static void JoinWithFollowingSegment_Returns_Segment_Joining_Current_Segment_with_Following()
        {
            CartesianCoordinate segment1I = new CartesianCoordinate(6, 1);
            CartesianCoordinate segment1J = new CartesianCoordinate(7, 4);
            LineSegment segment1 = new LineSegment(segment1I, segment1J);

            CartesianCoordinate segment2I = new CartesianCoordinate(5, 7);
            CartesianCoordinate segment2J = new CartesianCoordinate(1, 6);
            LineSegment segment2 = new LineSegment(segment2I, segment2J);

            LineSegment segmentJoin = segment1.JoinWithFollowingSegment(segment2) as LineSegment;
            Assert.AreEqual(segment1J, segmentJoin.I);
            Assert.AreEqual(segment2I, segmentJoin.J);
        }

        [Test]
        public static void JoinWithFollowingSegment_Returns_Null_when_Joining_Segments_Already_Joined()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(9, 2),
                new CartesianCoordinate(8, 9),
                new CartesianCoordinate(2, 10)
            };

            LineSegment segment1 = new LineSegment(coordinates[0], coordinates[1]);
            LineSegment segment2 = new LineSegment(coordinates[1], coordinates[2]);

            LineSegment segmentJoin = segment1.JoinWithFollowingSegment(segment2) as LineSegment;
            Assert.IsNull(segmentJoin);
        }
        #endregion

        #region Methods: Public
        [TestCase(0, 0, 0, 0)]
        [TestCase(0, 0, 3, 4)]
        [TestCase(2, 3, 0, 0)]
        [TestCase(-2, -3, 0, 0)]
        [TestCase(2, 3, 2, 3)]
        [TestCase(-2, -3, 2, 3)]
        [TestCase(2, 3, -2, 3)]
        [TestCase(-2, -3, 2, -3)]
        [TestCase(-2.1, -3.4, 2.8, -3.2)]
        public static void ToVector_Returns_Segment_as_Vector(double x1, double y1, double x2, double y2)
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2));

            Vector vector = segment.ToVector();

            double magnitudeX = x2 - x1;
            double magnitudeY = y2 - y1;

            Assert.AreEqual(x1, vector.Location.X);
            Assert.AreEqual(y1, vector.Location.Y);
            Assert.AreEqual(magnitudeX, vector.Xcomponent);
            Assert.AreEqual(magnitudeY, vector.Ycomponent);
        }
        #endregion

        #region Methods: IEquatable
        [Test]
        public static void foo()
        {
            LineSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));

            // Equals
            LineSegment segmentMatching = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));
            Assert.IsTrue(segment.Equals(segmentMatching));
            Assert.AreEqual(segment.GetHashCode(), segmentMatching.GetHashCode());

            // Not Equals
            LineSegment segmentNotMatching = new LineSegment(
                new CartesianCoordinate(5, 6),
                new CartesianCoordinate(7, 8));
            Assert.IsFalse(segment.Equals(segmentNotMatching));
            Assert.AreNotEqual(segment.GetHashCode(), segmentNotMatching.GetHashCode());

            // Object Equals/Not Equals
            LineSegment segmentObjectOfIPathSegment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4));
            Assert.IsTrue(segment.Equals((object)segmentObjectOfIPathSegment));

            object item = new object();
            Assert.IsFalse(segment.Equals(item));
        }
        #endregion
    }
}