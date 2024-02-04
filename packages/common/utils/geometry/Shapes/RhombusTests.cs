using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class RhombusTests
    {
        public static double Tolerance = 0.00001;

        public static double width = 10;
        public static double height = 5;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Rhombus rhombus = new Rhombus(width, height);

            Assert.AreEqual(4, rhombus.Points.Count);
            Assert.AreEqual(4, rhombus.Angles.Count);
            Assert.AreEqual(4, rhombus.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, rhombus.Tolerance);
            Assert.AreEqual(5, rhombus.Centroid.X, Tolerance);
            Assert.AreEqual(2.5, rhombus.Centroid.Y, Tolerance);

            Assert.AreEqual(width / 2, rhombus.g);
            Assert.AreEqual(height, rhombus.q);
            Assert.AreEqual(width, rhombus.w);
            Assert.AreEqual(height / 2, rhombus.h);
            Assert.AreEqual(5.590169944, rhombus.a, Tolerance);
            Assert.AreEqual(5.590169944, rhombus.b, Tolerance);
            Assert.AreEqual(5, rhombus.InCenter.X, Tolerance);
            Assert.AreEqual(2.5, rhombus.InCenter.Y, Tolerance);
            Assert.AreEqual(2.236067977, rhombus.InRadius, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            Rhombus rhombus = new Rhombus(width, height);

            Assert.AreEqual(25, rhombus.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            Rhombus rhombus = new Rhombus(width, height);
            IList<CartesianCoordinate> coordinates = rhombus.LocalCoordinates();

            Assert.AreEqual(width / 2, coordinates[0].X);
            Assert.AreEqual(0, coordinates[0].Y);

            Assert.AreEqual(width, coordinates[1].X);
            Assert.AreEqual(height / 2, coordinates[1].Y);

            Assert.AreEqual(width / 2, coordinates[2].X);
            Assert.AreEqual(height, coordinates[2].Y);

            Assert.AreEqual(0, coordinates[3].X);
            Assert.AreEqual(height / 2, coordinates[3].Y);
        }
        #endregion
    }
}