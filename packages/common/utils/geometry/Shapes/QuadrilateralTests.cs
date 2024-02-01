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
    public static class QuadrilateralTests
    {
        public static double Tolerance = 0.00001;

        #region Initialization
        [Test]
        public static void Initialization_with_Coordinates_Creates_Shape()
        {
            Quadrilateral quadrilateral = new Quadrilateral(
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(1, 1),
                new CartesianCoordinate(2, 3),
                new CartesianCoordinate(-1, 3));

            Assert.AreEqual(4, quadrilateral.Points.Count);
            Assert.AreEqual(4, quadrilateral.Angles.Count);
            Assert.AreEqual(4, quadrilateral.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, quadrilateral.Tolerance);
            Assert.AreEqual(0.4, quadrilateral.Centroid.X);
            Assert.AreEqual(1.933333, quadrilateral.Centroid.Y, Tolerance);
        }
        #endregion
    }
}