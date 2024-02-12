using System;
using System.Collections.Generic;
using MPT.Geometry.Segments;
using MPT.Geometry.Shapes;
using MPT.Geometry.Tools;
using MPT.Math;
using MPT.Math.Coordinates;
using MPT.Math.Curves;
using MPT.Math.NumberTypeExtensions;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class PolygonTests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> openRectangle = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(-3, 2),
                new CartesianCoordinate(-3, -1),
                new CartesianCoordinate(2, -1),
                new CartesianCoordinate(2, 2),
            };

        private static List<CartesianCoordinate> bowTieNonCrossingSegments = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(0, 3),
                new CartesianCoordinate(0, 1),
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(2, 1),
                new CartesianCoordinate(2, 3),
                new CartesianCoordinate(1, 2),
            };

        private static List<CartesianCoordinate> house = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(2, 0),
                new CartesianCoordinate(2, 0.9),
                new CartesianCoordinate(1, 1.9),
                new CartesianCoordinate(0, 0.9),
                new CartesianCoordinate(0, 0),
            };

        private static List<CartesianCoordinate> bowTieNonCrossingOrIntersectingSegments = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(1, 2.1),
                new CartesianCoordinate(0, 3.1),
                new CartesianCoordinate(0, 0.9),
                new CartesianCoordinate(1, 1.9),
                new CartesianCoordinate(2, 0.9),
                new CartesianCoordinate(2, 3.1),
                new CartesianCoordinate(1, 2.1),
            };

        #region Initialization
        [Test]
        public static void Initialization_Empty_Creates_Empty_Object()
        {
            Polygon polygon = new Polygon();

            Assert.AreEqual(0, polygon.Angles.Count);
            Assert.AreEqual(0, polygon.Points.Count);
            Assert.AreEqual(0, polygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, polygon.Tolerance);
            Assert.IsNull(polygon.Name);
            Assert.IsFalse(polygon.IsHole);
            Assert.AreEqual(0, polygon.Centroid.X);
            Assert.AreEqual(0, polygon.Centroid.Y);
            Assert.AreEqual(0, polygon.Area());
            Assert.AreEqual(0, polygon.Xo());
            Assert.AreEqual(0, polygon.Yo());
        }

        [Test]
        public static void Initialization_with_Open_Shape_Creates_Closed_Shape()
        {
            Polygon polygon = new Polygon(openRectangle);

            Assert.AreEqual(4, polygon.Points.Count);
            Assert.AreEqual(4, polygon.Angles.Count);
            Assert.AreEqual(4, polygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, polygon.Tolerance);
            Assert.AreEqual(-0.5, polygon.Centroid.X);
            Assert.AreEqual(0.5, polygon.Centroid.Y);
        }

        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);

            Assert.AreEqual(6, polygon.Points.Count);
            Assert.AreEqual(6, polygon.Angles.Count);
            Assert.AreEqual(6, polygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, polygon.Tolerance);
            Assert.AreEqual(1, polygon.Centroid.X);
            Assert.AreEqual(2, polygon.Centroid.Y);
        }
        #endregion

        #region Validation
        [Test]
        public static void CheckValidShape_Throws_ArgumentExeception_for_NonClosed_Polyline()
        {
            PolyLine polyline = new PolyLine(new CartesianCoordinate(1, 2), new CartesianCoordinate(3, 4));

            Assert.Throws<ArgumentException>(() => Shape.CheckValidShape(polyline));
        }

        [Test]
        public static void CheckValidShape_Throws_ArgumentExeception_for_Insufficient_Number_of_Coordinates()
        {
            List<CartesianCoordinate> insufficientCoordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 4),
            };

            Polygon polygon = new Polygon(insufficientCoordinates);
            Assert.Throws<ArgumentException>(() => polygon.CheckValidShape());
        }

        [Test]
        public static void CheckValidShape_Throws_ArgumentException_for_Closed_Polyline_of_Crossing_Segments()
        {
            List<CartesianCoordinate> bowTieCrossingSegments = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(-1, 1),
                new CartesianCoordinate(-1, -1),
                new CartesianCoordinate(1, 1),
                new CartesianCoordinate(1, -1),
                new CartesianCoordinate(-1, 1),
            };

            Polygon polygon = new Polygon(bowTieCrossingSegments);
            Assert.Throws<ArgumentException>(() => polygon.CheckValidShape());
        }

        [Test]
        public static void CheckValidShape_Throws_ArgumentException_for_Closed_Polyline_of_Point_on_Segment()
        {

            List<CartesianCoordinate> bowTiePointOnSegment = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(-1, 1),
                new CartesianCoordinate(-1, -1),
                new CartesianCoordinate(1, 1),
                new CartesianCoordinate(1, -1),
                new CartesianCoordinate(0, 0),
            };

            Polygon polygon = new Polygon(bowTiePointOnSegment);
            Assert.Throws<ArgumentException>(() => polygon.CheckValidShape());
        }

        [Test]
        public static void CheckValidShape_Throws_ArgumentException_for_Points_Changing_CCW_CW_Directions()
        {
            List<CartesianCoordinate> bowTieInverseAreaSigns = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(0, 3),
                new CartesianCoordinate(0, 1),
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(2, 3),
                new CartesianCoordinate(2, 1),
                new CartesianCoordinate(1, 2),
            };

            Polygon polygon = new Polygon(bowTieInverseAreaSigns);
            Assert.Throws<ArgumentException>(() => polygon.CheckValidShape());
        }

        [Test]
        public static void CheckValidShape_Returns_True_for_Valid_Shape()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingOrIntersectingSegments);
            Assert.IsTrue(polygon.CheckValidShape());
        }
        #endregion

        #region Methods
        [Test]
        public static void ToString_Returns_Overridden_ToString_Result()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual("MPT.Geometry.Shapes.Polygon", polygon.ToString());
        }

        [Test]
        public static void GetPerimeterFromPolyline()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(4 * (1 + 2.Sqrt()), polygon.GetPerimeterFromPolyline());
        }

        [Test]
        public static void PolyLine()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            PolyLine polyline = polygon.PolyLine();

            Assert.AreEqual(bowTieNonCrossingSegments[2], polyline[2].I);
        }

        [Test]
        public static void PointBoundary()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            PointBoundary pointBoundary = polygon.PointBoundary();
            Assert.AreEqual(bowTieNonCrossingSegments[2], pointBoundary[2]);
        }

        [Test]
        public static void Extents()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            PointExtents pointExtents = polygon.Extents();
            Assert.AreEqual(0, pointExtents.MinX);
            Assert.AreEqual(2, pointExtents.MaxX);
            Assert.AreEqual(1, pointExtents.MinY);
            Assert.AreEqual(3, pointExtents.MaxY);
        }
        #endregion

        #region Query
        [Test]
        public static void PointAt()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(bowTieNonCrossingSegments[1], polygon.PointAt(1));
        }

        [Test]
        public static void PointAt_Throws_IndexOutOfRangeException_for_Negative_Index()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.Throws<IndexOutOfRangeException>(() => polygon.PointAt(-1));
        }

        [Test]
        public static void PointAt_Throws_IndexOutOfRangeException_for_Index_Beyond_Points()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.Throws<IndexOutOfRangeException>(() => polygon.PointAt(7));
        }

        [Test]
        public static void SideAt()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(new LineSegment(bowTieNonCrossingSegments[1], bowTieNonCrossingSegments[2]), polygon.SideAt(1));
        }

        [Test]
        public static void SideAt_Throws_IndexOutOfRangeException_for_Negative_Index()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.Throws<IndexOutOfRangeException>(() => polygon.SideAt(-1));
        }

        [Test]
        public static void SideAt_Throws_IndexOutOfRangeException_for_Index_Beyond_Points()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.Throws<IndexOutOfRangeException>(() => polygon.SideAt(7));
        }

        [TestCase(0, false)]
        [TestCase(1, true)]
        [TestCase(2, true)]
        [TestCase(3, false)]
        [TestCase(4, true)]
        [TestCase(5, true)]
        public static void NormalsRotateCounterClockwise_for_bowTie_shape(int pointIndex, bool expectedCCW)
        {
            Polygon polygon = new Polygon(bowTieNonCrossingOrIntersectingSegments);
            Assert.AreEqual(expectedCCW, polygon.NormalsRotateCounterClockwiseAt(pointIndex));
        }

        [TestCase(0, true)]
        [TestCase(1, true)]
        [TestCase(2, true)]
        [TestCase(3, true)]
        [TestCase(4, true)]
        public static void NormalsRotateCounterClockwise_for_house_shape(int pointIndex, bool expectedCCW)
        {
            Polygon polygon = new Polygon(house);
            Assert.AreEqual(expectedCCW, polygon.NormalsRotateCounterClockwiseAt(pointIndex));
        }

        [TestCase(0, 270)]
        [TestCase(1, 45)]
        [TestCase(2, 45)]
        [TestCase(3, 270)]
        [TestCase(4, 45)]
        [TestCase(5, 45)]
        public static void AngleInteriorAt_for_bowTie_shape(int angleIndex, double expectedAngleDegrees)
        {
            Polygon polygon = new Polygon(bowTieNonCrossingOrIntersectingSegments);
            Assert.AreEqual(expectedAngleDegrees, polygon.AngleInteriorAt(angleIndex).DegreesRaw, Tolerance);
        }

        [TestCase(0, 90)]
        [TestCase(1, 90)]
        [TestCase(2, 135)]
        [TestCase(3, 90)]
        [TestCase(4, 135)]
        public static void AngleInteriorAt_for_house_shape(int angleIndex, double expectedAngleDegrees)
        {
            Polygon polygon = new Polygon(house);
            Assert.AreEqual(expectedAngleDegrees, polygon.AngleInteriorAt(angleIndex).DegreesRaw, Tolerance);
        }

        [Test]
        public static void HasReentrantCorners_Returns_True_for_bowTie_shape()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingOrIntersectingSegments);
            Assert.IsTrue(polygon.HasReentrantCorners());
        }

        [Test]
        public static void HasReentrantCorners_Returns_False_for_house_shape()
        {
            Polygon polygon = new Polygon(house);
            Assert.IsFalse(polygon.HasReentrantCorners());
        }

        [Test]
        public static void AngleInteriorAt_Throws_IndexOutOfRangeException_for_Negative_Index()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.Throws<IndexOutOfRangeException>(() => polygon.AngleInteriorAt(-1));
        }

        [Test]
        public static void AngleInteriorAt_Throws_IndexOutOfRangeException_for_Index_Beyond_Points()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.Throws<IndexOutOfRangeException>(() => polygon.AngleInteriorAt(7));
        }
        #endregion

        #region Methods: IShapeProperties
        [Test]
        public static void Area()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(2, polygon.Area());
        }

        [Test]
        public static void Perimeter()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(4 * (1 + 2.Sqrt()), polygon.Perimeter());
        }

        [Test]
        public static void Xo()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(1, polygon.Centroid.X);
        }

        [Test]
        public static void Yo()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Assert.AreEqual(2, polygon.Centroid.Y);
        }
        #endregion

        #region ITransform
        [Test]
        public static void Translate_Translates_Shape()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            CartesianOffset translation = new CartesianOffset(1, -3);

            Polygon polygonTranslated = polygon.Translate(translation) as Polygon;
            PointBoundary pointBoundary = polygonTranslated.PointBoundary();
            Assert.AreEqual(1, pointBoundary[1].X);
            Assert.AreEqual(0, pointBoundary[1].Y);
        }

        [TestCase(0, 2, 1)]
        [TestCase(1, 4, 3.5)]
        [TestCase(0.5, 3, 2.25)]
        [TestCase(1.5, 5, 4.75)]
        [TestCase(-1, 0, -1.5)]
        public static void ScaleFromPoint_Scales_Shape(double scale,
            double expectedCentroid_x, double expectedCentroid_y)
        {
            List<CartesianCoordinate> bowTieNonCrossingSegmentsScaled = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(4, 3.5),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(3, 2),
                new CartesianCoordinate(4, 3.5),
                new CartesianCoordinate(5, 2),
                new CartesianCoordinate(5, 5),
                new CartesianCoordinate(4, 3.5),
            };

            Polygon polygon = new Polygon(bowTieNonCrossingSegmentsScaled);

            // Check shape position
            CartesianCoordinate originalCentroid = polygon.Centroid;
            Assert.AreEqual(4, originalCentroid.X);
            Assert.AreEqual(3.5, originalCentroid.Y);

            CartesianCoordinate referencePoint = new CartesianCoordinate(2, 1);
            Polygon polygonScaled = polygon.ScaleFromPoint(scale, referencePoint) as Polygon;

            // Check shape scale
            PointExtents extents = polygonScaled.Extents();
            Assert.AreEqual(2 * scale.Abs(), extents.Width);
            Assert.AreEqual(3 * scale.Abs(), extents.Height);

            // Check scaled centroid position
            CartesianCoordinate scaledCentroid = polygonScaled.Centroid;
            Assert.AreEqual(expectedCentroid_x, scaledCentroid.X);
            Assert.AreEqual(expectedCentroid_y, scaledCentroid.Y);
        }

        [Test]
        public static void RotateAboutPoint_Rotates_Shape()
        {
            Polygon polygon = new Polygon(bowTieNonCrossingSegments);
            Angle rotation = new Angle(-Numbers.PiOver2);
            CartesianCoordinate referencePoint = new CartesianCoordinate(3, -1);

            Polygon polygonRotated = polygon.RotateAboutPoint(rotation, referencePoint) as Polygon;
            PointBoundary pointBoundary = polygonRotated.PointBoundary();
            Assert.AreEqual(6, pointBoundary[0].X, Tolerance);
            Assert.AreEqual(1, pointBoundary[0].Y, Tolerance);
            Assert.AreEqual(7, pointBoundary[1].X, Tolerance);
            Assert.AreEqual(2, pointBoundary[1].Y, Tolerance);
            Assert.AreEqual(5, pointBoundary[2].X, Tolerance);
            Assert.AreEqual(2, pointBoundary[2].Y, Tolerance);
            Assert.AreEqual(5, pointBoundary[4].X, Tolerance);
            Assert.AreEqual(0, pointBoundary[4].Y, Tolerance);
            Assert.AreEqual(7, pointBoundary[5].X, Tolerance);
            Assert.AreEqual(0, pointBoundary[5].Y, Tolerance);
        }


        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 3, 1, 6, 3, 8, 4, 6, 6, 5, 4)]    // Default - +x, y, Quadrant I
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, -3, 1, 0, 3, 2, 4, 0, 6, -1, 4)]    // Negative x
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 3, -1, 6, 1, 8, 2, 6, 4, 5, 2)]    // Negative y
        [TestCase(-3, 2, -5, 3, -3, 5, -2, 3, 3, 1, 0, 3, -2, 4, 0, 6, 1, 4)]    // Default in Quadrant II
        [TestCase(-3, -2, -5, -3, -3, -5, -2, -3, 3, 1, 0, -1, -2, -2, 0, -4, 1, -2)]    // Default in Quadrant III
        [TestCase(3, -2, 5, -3, 3, -5, 2, -3, 3, 1, 6, -1, 8, -2, 6, -4, 5, -2)]    // Default in Quadrant IV
        public static void Translate(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4,
            double deltaX, double deltaY,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result)
        {
            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result),
                new CartesianCoordinate(x2Result, y2Result),
                new CartesianCoordinate(x3Result, y3Result),
                new CartesianCoordinate(x4Result, y4Result),
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            Polygon newShape = shape.Translate(new CartesianOffset(deltaX, deltaY)) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
        }

        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 2, 6, 4, 10, 6, 6, 10, 4, 6)]    // Default - larger, Quadrant I
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0.5, 1.5, 1, 2.5, 1.5, 1.5, 2.5, 1, 1.5)]    // Smaller
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, -2, -6, -4, -10, -6, -6, -10, -4, -6)]    // Negative
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0)]    // 0
        [TestCase(-3, 2, -5, 3, -3, 5, -2, 3, 2, -6, 4, -10, 6, -6, 10, -4, 6)]    // Default in Quadrant II
        [TestCase(-3, -2, -5, -3, -3, -5, -2, -3, 2, -6, -4, -10, -6, -6, -10, -4, -6)]    // Default in Quadrant III
        [TestCase(3, -2, 5, -3, 3, -5, 2, -3, 2, 6, -4, 10, -6, 6, -10, 4, -6)]    // Default in Quadrant IV
        public static void ScaleFromPoint_As_Origin(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4,
            double scale,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result)
        {
            CartesianCoordinate point = new CartesianCoordinate(0, 0);

            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result),
                new CartesianCoordinate(x2Result, y2Result),
                new CartesianCoordinate(x3Result, y3Result),
                new CartesianCoordinate(x4Result, y4Result),
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            Polygon newShape = shape.ScaleFromPoint(scale, point) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
        }

        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 2, 6, 4, 10, 6, 6, 10, 4, 6)]    // Default - larger, Quadrant I
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0.5, 1.5, 1, 2.5, 1.5, 1.5, 2.5, 1, 1.5)]    // Smaller
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, -2, -6, -4, -10, -6, -6, -10, -4, -6)]    // Negative
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0)]    // 0
        [TestCase(-3, 2, -5, 3, -3, 5, -2, 3, 2, -6, 4, -10, 6, -6, 10, -4, 6)]    // Default in Quadrant II
        [TestCase(-3, -2, -5, -3, -3, -5, -2, -3, 2, -6, -4, -10, -6, -6, -10, -4, -6)]    // Default in Quadrant III
        [TestCase(3, -2, 5, -3, 3, -5, 2, -3, 2, 6, -4, 10, -6, 6, -10, 4, -6)]    // Default in Quadrant IV
        public static void ScaleFromPoint(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4,
            double scale,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result)
        {
            CartesianCoordinate point = new CartesianCoordinate(2, -3);

            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1) + point,
                new CartesianCoordinate(x2, y2) + point,
                new CartesianCoordinate(x3, y3) + point,
                new CartesianCoordinate(x4, y4) + point,
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result) + point,
                new CartesianCoordinate(x2Result, y2Result) + point,
                new CartesianCoordinate(x3Result, y3Result) + point,
                new CartesianCoordinate(x4Result, y4Result) + point,
            };
            Polygon shapeResult = new Polygon(coordinatesResult);


            Polygon newShape = shape.ScaleFromPoint(scale, point) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
        }

        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 90, -2, 3, -3, 4, -3, 5, -5, 3, -3, 2)]    // Rotate + to quadrant II
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 180, -3, -2, -4, -3, -5, -3, -3, -5, -2, -3)]    // Rotate + to quadrant III
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 270, 2, -3, 3, -4, 3, -5, 5, -3, 3, -2)]    // Rotate + to quadrant IV
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 360, 3, 2, 4, 3, 5, 3, 3, 5, 2, 3)]    // Rotate + full circle
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -90, 2, -3, 3, -4, 3, -5, 5, -3, 3, -2)]    // Rotate - to quadrant II
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -180, -3, -2, -4, -3, -5, -3, -3, -5, -2, -3)]    // Rotate - to quadrant III
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -270, -2, 3, -3, 4, -3, 5, -5, 3, -3, 2)]    // Rotate - to quadrant IV
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -360, 3, 2, 4, 3, 5, 3, 3, 5, 2, 3)]    // Rotate - full circle
        public static void RotateAboutPoint_As_Origin(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4, double x5, double y5,
            double rotationDegrees,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result, double x5Result, double y5Result)
        {
            CartesianCoordinate point = new CartesianCoordinate(0, 0);

            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
                new CartesianCoordinate(x5, y5),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result) + point,
                new CartesianCoordinate(x2Result, y2Result) + point,
                new CartesianCoordinate(x3Result, y3Result) + point,
                new CartesianCoordinate(x4Result, y4Result) + point,
                new CartesianCoordinate(x5Result, y5Result) + point,
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            Polygon newShape = shape.RotateAboutPoint(Angle.CreateFromDegree(rotationDegrees), point) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
            Assert.AreEqual(shapeResult.PointAt(4), newShape.PointAt(4));
        }

        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 90, -2, 3, -3, 4, -3, 5, -5, 3, -3, 2)]    // Rotate + to quadrant II
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 180, -3, -2, -4, -3, -5, -3, -3, -5, -2, -3)]    // Rotate + to quadrant III
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 270, 2, -3, 3, -4, 3, -5, 5, -3, 3, -2)]    // Rotate + to quadrant IV
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 360, 3, 2, 4, 3, 5, 3, 3, 5, 2, 3)]    // Rotate + full circle
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -90, 2, -3, 3, -4, 3, -5, 5, -3, 3, -2)]    // Rotate - to quadrant II
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -180, -3, -2, -4, -3, -5, -3, -3, -5, -2, -3)]    // Rotate - to quadrant III
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -270, -2, 3, -3, 4, -3, 5, -5, 3, -3, 2)]    // Rotate - to quadrant IV
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -360, 3, 2, 4, 3, 5, 3, 3, 5, 2, 3)]    // Rotate - full circle
        public static void RotateAboutPoint(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4, double x5, double y5,
            double rotationDegrees,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result, double x5Result, double y5Result)
        {
            CartesianCoordinate point = new CartesianCoordinate(2, -3);

            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1) + point,
                new CartesianCoordinate(x2, y2) + point,
                new CartesianCoordinate(x3, y3) + point,
                new CartesianCoordinate(x4, y4) + point,
                new CartesianCoordinate(x5, y5) + point,
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result) + point,
                new CartesianCoordinate(x2Result, y2Result) + point,
                new CartesianCoordinate(x3Result, y3Result) + point,
                new CartesianCoordinate(x4Result, y4Result) + point,
                new CartesianCoordinate(x5Result, y5Result) + point,
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            Polygon newShape = shape.RotateAboutPoint(Angle.CreateFromDegree(rotationDegrees), point) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
            Assert.AreEqual(shapeResult.PointAt(4), newShape.PointAt(4));
        }

        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 5, 5, 2, 0, 3.8, 2, 6.2, 3, 5, 5, 3.2, 3)]    // Shear +x
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 5, 5, -2, 0, 2.2, 2, 3.8, 3, 1, 5, 0.8, 3)]    // Shear -x
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 5, 5, 0, 2, 3, 3.2, 5, 5, 3, 6.2, 2, 3.8)]    // Shear +y
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 5, 5, 0, -2, 3, 0.8, 5, 1, 3, 3.8, 2, 2.2)]    // Shear -y
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 0, 0, 5, 5, 2, 3, 3.8, 3.8, 6.2, 6, 5, 6.8, 3.2, 4.2)]    // Shear +x, +y, Quadrant I
        [TestCase(-3, 2, -5, 3, -3, 5, -2, 3, 0, 0, -5, 5, 2, 3, -2.2, 3.8, -3.8, 6, -1, 6.8, -0.8, 4.2)]    // Shear +x, +y, Quadrant II
        [TestCase(-3, -2, -5, -3, -3, -5, -2, -3, 0, 0, -5, -5, 2, 3, -2.2, -0.2, -3.8, 0, -1, -3.2, -0.8, -1.8)]    // Shear +x, +y, Quadrant III
        [TestCase(3, -2, 5, -3, 3, -5, 2, -3, 0, 0, 5, -5, 2, 3, 3.8, -0.2, 6.2, 0, 5, -3.2, 3.2, -1.8)]    // Shear +x, +y, Quadrant IV
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 2, 2, 5, 5, 2, 0, 4.33333333333333, 2, 7, 3, 6.33333333333333, 5, 4, 3)]    // Bounding box as skew box
        [TestCase(3, 2, 5, 3, 3, 5, 2, 3, 2, 2, 5, 5, 0, 2, 3, 4, 5, 6.33333333333333, 3, 7, 2, 4.33333333333333)]    // Bounding box as skew box
        public static void Skew(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4,
            double stationaryPointX, double stationaryPointY,
            double skewingPointX, double skewingPointY,
            double magnitudeX, double magnitudeY,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result)
        {
            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result),
                new CartesianCoordinate(x2Result, y2Result),
                new CartesianCoordinate(x3Result, y3Result),
                new CartesianCoordinate(x4Result, y4Result),
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            CartesianCoordinate stationaryReferencePoint = new CartesianCoordinate(stationaryPointX, stationaryPointY);
            CartesianCoordinate skewingReferencePoint = new CartesianCoordinate(skewingPointX, skewingPointY);
            CartesianOffset magnitude = new CartesianOffset(magnitudeX, magnitudeY);

            Polygon newShape = shape.Skew(stationaryReferencePoint, skewingReferencePoint, magnitude) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
        }


        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 0, 1, 0, -1, -3, 2, -4, 3, -5, 3, -3, 5, -2, 3)]    // Mirror about y-axis to Quadrant II
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 0, -1, 0, 1, -3, 2, -4, 3, -5, 3, -3, 5, -2, 3)]    // Mirror about y-axis to Quadrant II, reversed line
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 1, 0, -1, 0, 3, -2, 4, -3, 5, -3, 3, -5, 2, -3)]    // Mirror about x-axis to Quadrant IV
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -1, 0, 1, 0, 3, -2, 4, -3, 5, -3, 3, -5, 2, -3)]    // Mirror about x-axis to Quadrant IV, reversed line
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 0, 0, 1, 1, 2, 3, 3, 4, 3, 5, 5, 3, 3, 2)]    // Mirror about 45 deg sloped line about shape center
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 0, 0, -1, -1, 2, 3, 3, 4, 3, 5, 5, 3, 3, 2)]    // Mirror about 45 deg sloped line about shape center, reversed line
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 0, 0, -1, 1, -2, -3, -3, -4, -3, -5, -5, -3, -3, -2)]    // Mirror about 45 deg sloped line to quadrant III
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 0, 0, 1, -1, -2, -3, -3, -4, -3, -5, -5, -3, -3, -2)]    // Mirror about 45 deg sloped line to quadrant III, reversed line
        public static void MirrorAboutLine(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4, double x5, double y5,
            double lineX1, double lineY1, double lineX2, double lineY2,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result, double x5Result, double y5Result)
        {
            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
                new CartesianCoordinate(x5, y5),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result),
                new CartesianCoordinate(x2Result, y2Result),
                new CartesianCoordinate(x3Result, y3Result),
                new CartesianCoordinate(x4Result, y4Result),
                new CartesianCoordinate(x5Result, y5Result),
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            LinearCurve referenceLine = new LinearCurve(new CartesianCoordinate(lineX1, lineY1), new CartesianCoordinate(lineX2, lineY2));

            Polygon newShape = shape.MirrorAboutLine(referenceLine) as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
            Assert.AreEqual(shapeResult.PointAt(4), newShape.PointAt(4));
        }

        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 3, -2, 4, -3, 5, -3, 3, -5, 2, -3)]    // Mirror about x-axis to Quadrant IV
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, 3, -2, 4, -3, 5, -3, 3, -5, 2, -3)]    // Mirror about x-axis to Quadrant IV, reversed line
        public static void MirrorAboutAxisX(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4, double x5, double y5,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result, double x5Result, double y5Result)
        {
            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
                new CartesianCoordinate(x5, y5),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result),
                new CartesianCoordinate(x2Result, y2Result),
                new CartesianCoordinate(x3Result, y3Result),
                new CartesianCoordinate(x4Result, y4Result),
                new CartesianCoordinate(x5Result, y5Result),
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            Polygon newShape = shape.MirrorAboutAxisX() as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
            Assert.AreEqual(shapeResult.PointAt(4), newShape.PointAt(4));
        }

        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -3, 2, -4, 3, -5, 3, -3, 5, -2, 3)]    // Mirror about y-axis to Quadrant II
        [TestCase(3, 2, 4, 3, 5, 3, 3, 5, 2, 3, -3, 2, -4, 3, -5, 3, -3, 5, -2, 3)]    // Mirror about y-axis to Quadrant II, reversed line
        public static void MirrorAboutAxisY(
            double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4, double x5, double y5,
            double x1Result, double y1Result, double x2Result, double y2Result, double x3Result, double y3Result, double x4Result, double y4Result, double x5Result, double y5Result)
        {
            IEnumerable<CartesianCoordinate> coordinates = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1, y1),
                new CartesianCoordinate(x2, y2),
                new CartesianCoordinate(x3, y3),
                new CartesianCoordinate(x4, y4),
                new CartesianCoordinate(x5, y5),
            };
            Polygon shape = new Polygon(coordinates);

            IEnumerable<CartesianCoordinate> coordinatesResult = new List<CartesianCoordinate>() {
                new CartesianCoordinate(x1Result, y1Result),
                new CartesianCoordinate(x2Result, y2Result),
                new CartesianCoordinate(x3Result, y3Result),
                new CartesianCoordinate(x4Result, y4Result),
                new CartesianCoordinate(x5Result, y5Result),
            };
            Polygon shapeResult = new Polygon(coordinatesResult);

            Polygon newShape = shape.MirrorAboutAxisY() as Polygon;

            Assert.AreEqual(shapeResult.PointAt(0), newShape.PointAt(0));
            Assert.AreEqual(shapeResult.PointAt(1), newShape.PointAt(1));
            Assert.AreEqual(shapeResult.PointAt(2), newShape.PointAt(2));
            Assert.AreEqual(shapeResult.PointAt(3), newShape.PointAt(3));
            Assert.AreEqual(shapeResult.PointAt(4), newShape.PointAt(4));
        }
        #endregion

        #region Methods: Chamfers & Fillets

        #endregion
    }
}