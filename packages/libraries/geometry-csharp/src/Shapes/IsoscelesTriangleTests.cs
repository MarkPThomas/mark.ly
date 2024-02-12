using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class IsoscelesTriangleTests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(2, 5.656855), // Apex coordinate
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(4, 0),
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Side_Lengths_Creates_Shape()
        {
            IsoscelesTriangle triangle = new IsoscelesTriangle(6, 4);

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
            Assert.AreEqual(6, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(4, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(70.52878175, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(38.94243649, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(70.52878175, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(5.65686, triangle.h, Tolerance);

            Assert.AreEqual(2, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(1.885618333, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(2, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0.707106687, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3.181980844, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(2.474874156, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.414213625, triangle.InRadius, Tolerance);
            Assert.AreEqual(2, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.414213625, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Apex_Coordinate_Creates_Shape()
        {
            IsoscelesTriangle triangle = new IsoscelesTriangle(triangleCoordinates[0]);

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
            Assert.AreEqual(6, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(4, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(70.52878175, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(38.94243649, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(70.52878175, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(5.65686, triangle.h, Tolerance);

            Assert.AreEqual(2, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(1.885618333, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(2, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0.707106687, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3.181980844, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(2.474874156, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.414213625, triangle.InRadius, Tolerance);
            Assert.AreEqual(2, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.414213625, triangle.InCenter.Y, Tolerance);
        }

        [Test]
        public static void Initialization_with_Equal_Angles_Creates_Shape()
        {
            IsoscelesTriangle triangle = new IsoscelesTriangle(4, Angle.CreateFromDegree(70.52878175));

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
            Assert.AreEqual(6, triangle.SideA.Length(), Tolerance);
            Assert.AreEqual(4, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(6, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(70.52878175, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(38.94243649, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(70.52878175, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(5.65686, triangle.h, Tolerance);

            Assert.AreEqual(2, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(1.885618333, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(2, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0.707106687, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(3.181980844, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(2.474874156, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.414213625, triangle.InRadius, Tolerance);
            Assert.AreEqual(2, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.414213625, triangle.InCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area()
        {
            IsoscelesTriangle triangle = new IsoscelesTriangle(6, 4);
            double area = triangle.Area();

            Assert.AreEqual(11.31371, area, Tolerance);
        }

        [Test]
        public static void LocalCoordinates()
        {
            IsoscelesTriangle triangle = new IsoscelesTriangle(6, 4);
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