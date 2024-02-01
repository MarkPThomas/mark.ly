using System.Collections.Generic;
using System.Linq.Expressions;
using MPT.Geometry.Segments;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using MPT.Math.Vectors;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    // TODO: Handle Centroid & similar coordinates for transformations
    [TestFixture]
    public static class TriangleTests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(1, 2),
            new CartesianCoordinate(3, 4),
            new CartesianCoordinate(-1, 1),
        };

        private static List<CartesianCoordinate> triangleCoordinates_45_45_90 = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(1, 2),
            new CartesianCoordinate(4, 2),
            new CartesianCoordinate(4, 5),
        };

        private static List<CartesianCoordinate> triangleCoordinates_60_60_60 = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(1, 2),
            new CartesianCoordinate(7, 2),
            new CartesianCoordinate(4, 7.196152),
        };

        private static List<CartesianCoordinate> triangleCoordinates_30_60_90 = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(1, 2),
            new CartesianCoordinate(4, 2),
            new CartesianCoordinate(4, 7.196152),
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(2.828427125, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(5, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(2.236067977, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(10.30484647, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(161.5650512, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(8.130102354, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(0.89443, triangle.h, Tolerance);

            Assert.AreEqual(1, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(2.333333, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(10, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(-10, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(7.90569415, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(-3.5, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(8.5, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(0.198718364, triangle.InRadius, Tolerance);
            Assert.AreEqual(0.882287359, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(2.163317565, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape_45_45_90_triangle()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates_45_45_90[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates_45_45_90[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates_45_45_90[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates_45_45_90[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates_45_45_90[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates_45_45_90[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(3, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(3, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(4.242640687, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(45, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(45, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(2.12132, triangle.h, Tolerance);

            Assert.AreEqual(3, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(3, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(2, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(2.121320344, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2.5, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(3.5, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(0.878679656, triangle.InRadius, Tolerance);
            Assert.AreEqual(3.121320344, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(2.878679656, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape_60_60_60_triangle()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates_60_60_60[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates_60_60_60[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates_60_60_60[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates_60_60_60[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates_60_60_60[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates_60_60_60[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(6, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(60, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(5.19615, triangle.h, Tolerance);

            Assert.AreEqual(4, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(3.732050808, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(3.732050808, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3.464101615, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(4, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(3.732050808, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.732050808, triangle.InRadius, Tolerance);
            Assert.AreEqual(4, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(3.732050808, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape_30_60_90_triangle()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates_30_60_90[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates_30_60_90[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates_30_60_90[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates_30_60_90[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates_30_60_90[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates_30_60_90[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(3, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(5.196152423, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(30, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(2.59808, triangle.h, Tolerance);

            Assert.AreEqual(3, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(3.732050808, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(2, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2.5, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(4.598076211, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.098076211, triangle.InRadius, Tolerance);
            Assert.AreEqual(2.901923789, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(3.098076211, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_90_Degree_Angle_Creates_Triangle_with_Orthocenter_at_Perpendicular_Corner()
        {
            CartesianCoordinate perpendicularPointA = new CartesianCoordinate(1, 2);
            Triangle triangleA90 = new Triangle(
               perpendicularPointA,
                new CartesianCoordinate(4, 2),
                new CartesianCoordinate(1, 5));

            Assert.AreEqual(perpendicularPointA.X, triangleA90.OrthoCenter.X, Tolerance);
            Assert.AreEqual(perpendicularPointA.Y, triangleA90.OrthoCenter.Y, Tolerance);

            CartesianCoordinate perpendicularPointB = new CartesianCoordinate(4, 2);
            Triangle triangleB90 = new Triangle(
                new CartesianCoordinate(1, 2),
                perpendicularPointB,
                new CartesianCoordinate(4, 5));

            Assert.AreEqual(perpendicularPointB.X, triangleB90.OrthoCenter.X, Tolerance);
            Assert.AreEqual(perpendicularPointB.Y, triangleB90.OrthoCenter.Y, Tolerance);

            CartesianCoordinate perpendicularPointC = new CartesianCoordinate(4, 5);
            Triangle triangleC90 = new Triangle(
                new CartesianCoordinate(1, 5),
                new CartesianCoordinate(4, 2),
                perpendicularPointC);

            Assert.AreEqual(perpendicularPointC.X, triangleC90.OrthoCenter.X, Tolerance);
            Assert.AreEqual(perpendicularPointC.Y, triangleC90.OrthoCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_90_Degree_Angle_Returns_Altitude_Taken_From_90_Degree_Corner()
        {

            Triangle triangleA90 = new Triangle(
                    new CartesianCoordinate(0, 3),
                    new CartesianCoordinate(3, 0),
                    new CartesianCoordinate(3, 3));
            triangleA90.Tolerance = 10E-8;

            Assert.AreEqual(90, triangleA90.AngleA.Degrees, Tolerance);
            Assert.AreEqual(2.12132, triangleA90.h, Tolerance);

            Triangle triangleB90 = new Triangle(
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(3, 0),
                new CartesianCoordinate(0, 3));
            triangleB90.Tolerance = 10E-8;

            Assert.AreEqual(90, triangleA90.AngleA.Degrees, Tolerance);
            Assert.AreEqual(2.12132, triangleB90.h, Tolerance);

            Triangle triangleC90 = new Triangle(
                    new CartesianCoordinate(0, 0),
                    new CartesianCoordinate(3, 0),
                    new CartesianCoordinate(3, 3));
            triangleC90.Tolerance = 10E-8;

            Assert.AreEqual(90, triangleA90.AngleA.Degrees, Tolerance);
            Assert.AreEqual(2.12132, triangleC90.h, Tolerance);
        }

        #endregion

        #region Methods: Properties
        [Test]
        public static void Area()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(1, triangle.Area(), Tolerance);
        }

        [Test]
        public static void Perimeter()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(10.064495, triangle.Perimeter(), Tolerance);
        }

        [Test]
        public static void SemiPerimeter()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(5.032248, triangle.SemiPerimeter(), Tolerance);
        }
        #endregion

        #region Methods: Sides
        [Test]
        public static void SideLengthA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(2.828427125, triangle.SideLengthA(), Tolerance);
        }

        [Test]
        public static void SideLengthB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(5, triangle.SideLengthB(), Tolerance);
        }

        [Test]
        public static void SideLengthC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(2.236067977, triangle.SideLengthC(), Tolerance);
        }
        #endregion

        #region Methods: Altitudes
        [Test]
        public static void AltitudeLengthA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.70711, triangle.AltitudeLengthA(), Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateA();

            Assert.AreEqual(-0.50, coordinate.X, Tolerance);
            Assert.AreEqual(0.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateA_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateA();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateA_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateA();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateA_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateA();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeLineA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.AltitudeLineA();
            Assert.AreEqual(triangle.PointA, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideA.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineA_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            LineSegment newLine = triangle.AltitudeLineA();
            Assert.AreEqual(triangle.PointA, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideA.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineA_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            LineSegment newLine = triangle.AltitudeLineA();
            Assert.AreEqual(triangle.PointA, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideA.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineA_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            LineSegment newLine = triangle.AltitudeLineA();
            Assert.AreEqual(triangle.PointA, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideA.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLengthB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.4, triangle.AltitudeLengthB(), Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateB();

            Assert.AreEqual(0.76, coordinate.X, Tolerance);
            Assert.AreEqual(2.32, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateB_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateB();

            Assert.IsTrue(triangle.SideB.IncludesCoordinate(coordinate));

            LineSegment newLine = new LineSegment(triangle.PointB, coordinate);
            Assert.IsTrue(newLine.IncludesCoordinate(triangle.OrthoCenter));

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateB_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateB_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateB();

            Assert.AreEqual(5.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.59807, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeLineB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.AltitudeLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideB.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineB_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            LineSegment newLine = triangle.AltitudeLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideB.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineB_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            LineSegment newLine = triangle.AltitudeLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideB.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineB_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            LineSegment newLine = triangle.AltitudeLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideB.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLengthC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.89443, triangle.AltitudeLengthC(), Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateC();

            Assert.AreEqual(3.4, coordinate.X, Tolerance);
            Assert.AreEqual(3.2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateC_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateC();

            Assert.AreEqual(1.75, coordinate.X, Tolerance);
            Assert.AreEqual(3.29904, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateC_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(3.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeCoordinateC_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.AltitudeCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.59807, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AltitudeLineC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.AltitudeLineC();
            Assert.AreEqual(triangle.PointC, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideC.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineC_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            LineSegment newLine = triangle.AltitudeLineC();
            Assert.AreEqual(triangle.PointC, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideC.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineC_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            LineSegment newLine = triangle.AltitudeLineC();
            Assert.AreEqual(triangle.PointC, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideC.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }

        [Test]
        public static void AltitudeLineC_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            LineSegment newLine = triangle.AltitudeLineC();
            Assert.AreEqual(triangle.PointC, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.OrthoCenter));

            Vector vectorSide = triangle.SideC.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));
        }
        #endregion

        #region Methods: Medians
        [Test]
        public static void MedianLengthA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(3.60555, triangle.MedianLengthA(), Tolerance);
        }

        [Test]
        public static void MedianCoordinateA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateA();

            Assert.AreEqual(2, coordinate.X, Tolerance);
            Assert.AreEqual(3, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateA_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateA();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateA_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateA();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateA_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateA();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }


        [Test]
        public static void MedianLineA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.MedianLineA();
            Assert.AreEqual(triangle.PointA, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.Centroid));

            LineSegment segment1 = new LineSegment(triangle.SideA.I, newLine.J);
            LineSegment segment2 = new LineSegment(triangle.SideA.J, newLine.J);
            Assert.AreEqual(segment1.Length(), segment2.Length(), Tolerance);
        }

        [Test]
        public static void MedianLengthB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.5, triangle.MedianLengthB(), Tolerance);
        }

        [Test]
        public static void MedianCoordinateB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateB();

            Assert.AreEqual(1, coordinate.X, Tolerance);
            Assert.AreEqual(2.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateB_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(4.598076, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateB_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(3.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateB_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateB();

            Assert.AreEqual(5.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.5980756, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianLineB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.MedianLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.Centroid));

            LineSegment segment1 = new LineSegment(triangle.SideB.I, newLine.J);
            LineSegment segment2 = new LineSegment(triangle.SideB.J, newLine.J);
            Assert.AreEqual(segment1.Length(), segment2.Length(), Tolerance);
        }

        [Test]
        public static void MedianLengthC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(3.90512, triangle.MedianLengthC(), Tolerance);
        }

        [Test]
        public static void MedianCoordinateC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateC();

            Assert.AreEqual(0, coordinate.X, Tolerance);
            Assert.AreEqual(1.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateC_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(3.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateC_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.598076, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianCoordinateC_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.MedianCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.5980756, coordinate.Y, Tolerance);
        }

        [Test]
        public static void MedianLineC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.MedianLineC();
            Assert.AreEqual(triangle.PointC, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.Centroid));

            LineSegment segment1 = new LineSegment(triangle.SideC.I, newLine.J);
            LineSegment segment2 = new LineSegment(triangle.SideC.J, newLine.J);
            Assert.AreEqual(segment1.Length(), segment2.Length(), Tolerance);
        }
        #endregion

        #region Methods: Angle Bisectors
        [Test]
        public static void AngleBisectorLengthA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(3.07768, triangle.AngleBisectorLengthA(), Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateA();

            Assert.AreEqual(1.618034, coordinate.X, Tolerance);
            Assert.AreEqual(2.618034, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateA_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateA();

            Assert.AreEqual(2.75736, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateA_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateA();

            Assert.AreEqual(2.607695, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateA_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateA();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorLineA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.AngleBisectorLineA();
            Assert.AreEqual(triangle.PointA, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.InCenter));

            double bisectedAngle1 = Angle.RadiansToDegrees(newLine.ToVector().Angle(triangle.SideC.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleA.Degrees, bisectedAngle1, Tolerance);

            LineSegment sideBReversed = triangle.SideB.Reverse() as LineSegment;
            double bisectedAngle2 = Angle.RadiansToDegrees(newLine.ToVector().Angle(sideBReversed.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleA.Degrees, bisectedAngle2, Tolerance);
        }

        [Test]
        public static void AngleBisectorLengthB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.40007, triangle.AngleBisectorLengthB(), Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateB();

            Assert.AreEqual(0.766073, coordinate.X, Tolerance);
            Assert.AreEqual(2.324555, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateB_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(3.73205, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateB_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(3.24264, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateB_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateB();

            Assert.AreEqual(5.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.5980756, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorLineB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.AngleBisectorLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.InCenter));

            LineSegment sideCReversed = triangle.SideC.Reverse() as LineSegment;
            double bisectedAngle1 = Angle.RadiansToDegrees(newLine.ToVector().Angle(sideCReversed.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleB.Degrees, bisectedAngle1, Tolerance);

            double bisectedAngle2 = Angle.RadiansToDegrees(newLine.ToVector().Angle(triangle.SideA.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleB.Degrees, bisectedAngle2, Tolerance);
        }

        [Test]
        public static void AngleBisectorLineB_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            LineSegment newLine = triangle.AngleBisectorLineB();
            Assert.AreEqual(triangle.PointB, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.InCenter));

            LineSegment sideCReversed = triangle.SideC.Reverse() as LineSegment;
            double bisectedAngle1 = Angle.RadiansToDegrees(newLine.ToVector().Angle(sideCReversed.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleB.Degrees, bisectedAngle1, Tolerance);

            double bisectedAngle2 = Angle.RadiansToDegrees(newLine.ToVector().Angle(triangle.SideA.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleB.Degrees, bisectedAngle2, Tolerance);
        }

        [Test]
        public static void AngleBisectorLengthC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(3.60393, triangle.AngleBisectorLengthC(), Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateC();

            Assert.AreEqual(0.2773958, coordinate.X, Tolerance);
            Assert.AreEqual(1.638698, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateC_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(3.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateC_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateC();

            Assert.AreEqual(2.098076, coordinate.X, Tolerance);
            Assert.AreEqual(3.901924, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorCoordinateC_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.AngleBisectorCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.5980756, coordinate.Y, Tolerance);
        }

        [Test]
        public static void AngleBisectorLineC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.AngleBisectorLineC();
            Assert.AreEqual(triangle.PointC, newLine.I);
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.InCenter));

            double bisectedAngle1 = Angle.RadiansToDegrees(newLine.ToVector().Angle(triangle.SideB.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleC.Degrees, bisectedAngle1, Tolerance);

            LineSegment sideAReversed = triangle.SideA.Reverse() as LineSegment;
            double bisectedAngle2 = Angle.RadiansToDegrees(newLine.ToVector().Angle(sideAReversed.ToVector()));
            Assert.AreEqual(0.5 * triangle.AngleC.Degrees, bisectedAngle2, Tolerance);
        }
        #endregion

        #region Methods: Perpendicular Side Bisectors
        [Test]
        public static void PerpendicularSideBisectorLengthA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.357142857, triangle.PerpendicularSideBisectorLengthA(), Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateA();

            Assert.AreEqual(2, coordinate.X, Tolerance);
            Assert.AreEqual(3, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateA_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateA();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateA_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateA();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateA_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateA();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(2, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorLineA()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.PerpendicularSideBisectorLineA();
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.CircumCenter));

            Vector vectorSide = triangle.SideA.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));

            LineSegment segment1 = new LineSegment(triangle.SideA.I, newLine.J);
            LineSegment segment2 = new LineSegment(triangle.SideA.J, newLine.J);
            Assert.AreEqual(segment1.Length(), segment2.Length(), Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorLengthB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.202030509, triangle.PerpendicularSideBisectorLengthB(), Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateB();

            Assert.AreEqual(1, coordinate.X, Tolerance);
            Assert.AreEqual(2.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateB_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(4.598076, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateB_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateB();

            Assert.AreEqual(4, coordinate.X, Tolerance);
            Assert.AreEqual(3.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateB_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateB();

            Assert.AreEqual(5.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.5980756, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorLineB()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.PerpendicularSideBisectorLineB();
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.CircumCenter));

            Vector vectorSide = triangle.SideB.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));

            LineSegment segment1 = new LineSegment(triangle.SideB.I, newLine.J);
            LineSegment segment2 = new LineSegment(triangle.SideB.J, newLine.J);
            Assert.AreEqual(segment1.Length(), segment2.Length(), Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorLengthC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            Assert.AreEqual(0.203278907, triangle.PerpendicularSideBisectorLengthC(), Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateC();

            Assert.AreEqual(0, coordinate.X, Tolerance);
            Assert.AreEqual(1.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateC_45_45_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_45_45_90[0], triangleCoordinates_45_45_90[1], triangleCoordinates_45_45_90[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(3.5, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateC_30_60_90()
        {
            Triangle triangle = new Triangle(triangleCoordinates_30_60_90[0], triangleCoordinates_30_60_90[1], triangleCoordinates_30_60_90[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.598076, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorCoordinateC_60_60_60()
        {
            Triangle triangle = new Triangle(triangleCoordinates_60_60_60[0], triangleCoordinates_60_60_60[1], triangleCoordinates_60_60_60[2]);

            CartesianCoordinate coordinate = triangle.PerpendicularSideBisectorCoordinateC();

            Assert.AreEqual(2.5, coordinate.X, Tolerance);
            Assert.AreEqual(4.5980756, coordinate.Y, Tolerance);
        }

        [Test]
        public static void PerpendicularSideBisectorLineC()
        {
            Triangle triangle = new Triangle(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2]);

            LineSegment newLine = triangle.PerpendicularSideBisectorLineC();
            Assert.IsTrue(newLine.Curve.IsIntersectingCoordinate(triangle.CircumCenter));

            Vector vectorSide = triangle.SideC.ToVector();
            Vector vectorProjection = newLine.ToVector();
            Assert.IsTrue(vectorSide.IsOrthogonal(vectorProjection));

            LineSegment segment1 = new LineSegment(triangle.SideC.I, newLine.J);
            LineSegment segment2 = new LineSegment(triangle.SideC.J, newLine.J);
            Assert.AreEqual(segment1.Length(), segment2.Length(), Tolerance);
        }
        #endregion
    }
}