using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class Triangle306090Tests
    {
        public static double Tolerance = 0.00001;

        private static double width = 4;
        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(4, 0),
            new CartesianCoordinate(4, 6.92820323), // Apex coordinate
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Height_Creates_Shape()
        {
            Triangle306090 triangle = new Triangle306090(width);

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
            Assert.AreEqual(4, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(6.92820323, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(8, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(30, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(60, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(3.46410, triangle.h, Tolerance);
            Assert.AreEqual(2, triangle.d, Tolerance);
            Assert.AreEqual(6, triangle.e, Tolerance);

            Assert.AreEqual(2.666666667, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(2.309401077, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(4, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(3.464101615, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.464101615, triangle.InRadius, Tolerance);
            Assert.AreEqual(2.535898385, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.464101615, triangle.InCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area()
        {
            Triangle306090 triangle = new Triangle306090(width);
            double area = triangle.Area();

            Assert.AreEqual(13.85641, area, Tolerance);
        }

        [Test]
        public static void Perimeter()
        {
            Triangle306090 triangle = new Triangle306090(width);
            double area = triangle.Perimeter();

            Assert.AreEqual(18.928203, area, Tolerance);
        }

        [Test]
        public static void LocalCoordinates()
        {
            Triangle306090 triangle = new Triangle306090(width);
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