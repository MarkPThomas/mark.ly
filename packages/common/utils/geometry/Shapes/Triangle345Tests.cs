using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class Triangle345Tests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(4, 0),
            new CartesianCoordinate(4, 3), // Apex coordinate
        };

        private static List<CartesianCoordinate> triangleCoordinates_Scale_3_5 = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(10.5, 0),
            new CartesianCoordinate(10.5, 14), // Apex coordinate
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Scale_Creates_Shape()
        {
            Triangle345 triangle = new Triangle345(3.5);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[0], triangle.SideA.I);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[0], triangle.SideC.J);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(10.5, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(14, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(17.5, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(36.86989765, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(53.13010235, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(8.4, triangle.h, Tolerance);
            Assert.AreEqual(6.3, triangle.d, Tolerance);
            Assert.AreEqual(11.2, triangle.e, Tolerance);

            Assert.AreEqual(7, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(4.666666667, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(10.5, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(8.75, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(5.25, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(7, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(3.5, triangle.InRadius, Tolerance);
            Assert.AreEqual(7, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(3.5, triangle.InCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area()
        {
            Triangle345 triangle = new Triangle345(3.5);
            double area = triangle.Area();

            Assert.AreEqual(73.5, area, Tolerance);
        }

        [Test]
        public static void Perimeter()
        {
            Triangle345 triangle = new Triangle345(3.5);
            double area = triangle.Perimeter();

            Assert.AreEqual(42, area, Tolerance);
        }

        [Test]
        public static void LocalCoordinates()
        {
            Triangle345 triangle = new Triangle345(3.5);
            IList<CartesianCoordinate> coordinates = triangle.LocalCoordinates();

            Assert.AreEqual(3, coordinates.Count);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[0], coordinates[0]);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[1], coordinates[1]);
            Assert.AreEqual(triangleCoordinates_Scale_3_5[2], coordinates[2]);
        }
        #endregion
    }
}