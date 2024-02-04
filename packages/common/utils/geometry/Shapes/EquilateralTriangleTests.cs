using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class EquilateralTriangleTests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(8, 0),
            new CartesianCoordinate(4, 6.928203), // Apex coordinate
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Side_Length_Creates_Shape()
        {
            EquilateralTriangle triangle = new EquilateralTriangle(8);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates[2].X, triangle.SideB.J.X, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].Y, triangle.SideB.J.Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].X, triangle.SideC.I.X, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].Y, triangle.SideC.I.Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(8, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(8, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(8, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(60, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(6.92820, triangle.h, Tolerance);
            Assert.AreEqual(4, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(4.618802154, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(4, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(2.309401077, triangle.InRadius, Tolerance);
            Assert.AreEqual(4, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Apex_Coordinate_Creates_Shape()
        {
            EquilateralTriangle triangle = new EquilateralTriangle(triangleCoordinates[2]);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates[2].X, triangle.SideB.J.X, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].Y, triangle.SideB.J.Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].X, triangle.SideC.I.X, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].Y, triangle.SideC.I.Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(8, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(8, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(8, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(60, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(6.92820, triangle.h, Tolerance);
            Assert.AreEqual(4, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(4.618802154, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(4, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(2.309401077, triangle.InRadius, Tolerance);
            Assert.AreEqual(4, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.InCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area()
        {
            EquilateralTriangle triangle = new EquilateralTriangle(8);
            double area = triangle.Area();

            Assert.AreEqual(27.71281292, area, Tolerance);
        }

        [Test]
        public static void Perimeter()
        {
            EquilateralTriangle triangle = new EquilateralTriangle(8);
            double area = triangle.Perimeter();

            Assert.AreEqual(24, area, Tolerance);
        }

        [Test]
        public static void LocalCoordinates()
        {
            EquilateralTriangle triangle = new EquilateralTriangle(8);
            IList<CartesianCoordinate> coordinates = triangle.LocalCoordinates();

            Assert.AreEqual(3, coordinates.Count);
            Assert.AreEqual(triangleCoordinates[0], coordinates[0]);
            Assert.AreEqual(triangleCoordinates[1], coordinates[1]);
            Assert.AreEqual(triangleCoordinates[2].X, coordinates[2].X, Tolerance);
            Assert.AreEqual(triangleCoordinates[2].Y, coordinates[2].Y, Tolerance);
        }
        #endregion
    }
}