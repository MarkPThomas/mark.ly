using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using MPT.Geometry.Shapes;
using MPT.Geometry.Tools;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class IsoscelesRightTriangleTests
    {
        public static double Tolerance = 0.00001;

        private static List<CartesianCoordinate> triangleCoordinates = new List<CartesianCoordinate>()
        {
            new CartesianCoordinate(0, 0),
            new CartesianCoordinate(4, 0),
            new CartesianCoordinate(0, 4),
        };

        #region Initialization
        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape()
        {
            IsoscelesRightTriangle triangle = new IsoscelesRightTriangle(4);

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
            Assert.AreEqual(5.656854249, triangle.SideB.Length(), Tolerance);
            Assert.AreEqual(4, triangle.SideC.Length(), Tolerance);

            Assert.AreEqual(3, triangle.Angles.Count);
            Assert.AreEqual(45, triangle.AngleA.Degrees, Tolerance);
            Assert.AreEqual(90, triangle.AngleB.Degrees, Tolerance);
            Assert.AreEqual(45, triangle.AngleC.Degrees, Tolerance);

            Assert.AreEqual(2.82843, triangle.h, Tolerance);

            Assert.AreEqual(1.333333, triangle.Centroid.X, Tolerance);
            Assert.AreEqual(1.333333, triangle.Centroid.Y, Tolerance);

            Assert.AreEqual(0, triangle.OrthoCenter.X, Tolerance);
            Assert.AreEqual(0, triangle.OrthoCenter.Y, Tolerance);

            Assert.AreEqual(2.828427125, triangle.CircumRadius, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(2, triangle.CircumCenter.Y, Tolerance);

            Assert.AreEqual(1.171572875, triangle.InRadius, Tolerance);
            Assert.AreEqual(1.171572875, triangle.InCenter.X, Tolerance);
            Assert.AreEqual(1.171572875, triangle.InCenter.Y, Tolerance);
        }
        #endregion


        #region Methods
        [Test]
        public static void Area()
        {
            IsoscelesRightTriangle triangle = new IsoscelesRightTriangle(4);
            double area = triangle.Area();

            Assert.AreEqual(8, area, Tolerance);
        }

        [Test]
        public static void LocalCoordinates()
        {
            IsoscelesRightTriangle triangle = new IsoscelesRightTriangle(4);
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