using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class RightTriangleTests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(4, 0),
            new CartesianCoordinate(4, 6), // Apex coordinate
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Width_and_Height_Creates_Shape()
        {
            RightTriangle triangle = new RightTriangle(4, 6);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates[0].X, triangle.SideA.I.X);
            Assert.AreEqual(triangleCoordinates[0].Y, triangle.SideA.I.Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates[0].X, triangle.SideC.J.X);
            Assert.AreEqual(triangleCoordinates[0].Y, triangle.SideC.J.Y, Tolerance);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(4, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(7.211102551, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(33.69006753, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(56.30993247, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(3.32820, triangle.h, Tolerance);
            Assert.AreEqual(2.218800785, triangle.d, Tolerance);
            Assert.AreEqual(4.992301766, triangle.e, Tolerance);

            Assert.AreEqual(2.666666667, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(2, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3.605551275, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(3, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.394448725, triangle.InRadius, Tolerance);
            Assert.AreEqual(2.605551275, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.394448725, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Apex_Coordinate_Creates_Shape()
        {
            RightTriangle triangle = new RightTriangle(triangleCoordinates[2]);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, triangle.Tolerance);

            Assert.AreEqual(3, triangle.Points.Count);
            Assert.AreEqual(triangleCoordinates[0].X, triangle.SideA.I.X);
            Assert.AreEqual(triangleCoordinates[0].Y, triangle.SideA.I.Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideA.J);
            Assert.AreEqual(triangleCoordinates[1], triangle.SideB.I);
            Assert.AreEqual(triangleCoordinates[2], triangle.SideB.J);
            Assert.AreEqual(triangleCoordinates[2], triangle.SideC.I);
            Assert.AreEqual(triangleCoordinates[0].X, triangle.SideC.J.X);
            Assert.AreEqual(triangleCoordinates[0].Y, triangle.SideC.J.Y, Tolerance);

            Assert.AreEqual(3, triangle.Sides.Count);
            Assert.AreEqual(4, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(7.211102551, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(33.69006753, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(56.30993247, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(3.32820, triangle.h, Tolerance);
            Assert.AreEqual(2.218800785, triangle.d, Tolerance);
            Assert.AreEqual(4.992301766, triangle.e, Tolerance);

            Assert.AreEqual(2.666666667, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(2, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(4, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3.605551275, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(3, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.394448725, triangle.InRadius, Tolerance);
            Assert.AreEqual(2.605551275, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.394448725, triangle.InCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area()
        {
            RightTriangle triangle = new RightTriangle(4, 6);
            double area = triangle.Area();

            Assert.AreEqual(12, area, Tolerance);
        }

        [Test]
        public static void LocalCoordinates()
        {
            RightTriangle triangle = new RightTriangle(4, 6);
            IList<CartesianCoordinate> coordinates = triangle.LocalCoordinates();

            Assert.AreEqual(3, coordinates.Count);
            Assert.AreEqual(triangleCoordinates[0].X, coordinates[0].X);
            Assert.AreEqual(triangleCoordinates[0].Y, coordinates[0].Y, Tolerance);
            Assert.AreEqual(triangleCoordinates[1], coordinates[1]);
            Assert.AreEqual(triangleCoordinates[2], coordinates[2]);
        }
        #endregion
    }
}