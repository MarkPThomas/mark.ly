using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    // TODO: Handle Centroid & similar coordinates for transformations
    [TestFixture]
    public static class KiteTests
    {
        public static double Tolerance = 0.00001;

        public static double width = 10;
        public static double height = 5;
        public static double skew = 3;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Kite kite = new Kite(width, height, skew);

            Assert.AreEqual(4, kite.Points.Count);
            Assert.AreEqual(4, kite.Angles.Count);
            Assert.AreEqual(4, kite.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, kite.Tolerance);
            Assert.AreEqual(3, kite.Centroid.X);
            Assert.AreEqual(2.5, kite.Centroid.Y, Tolerance);

            Assert.AreEqual(skew, kite.g);
            Assert.AreEqual(height, kite.q);
            Assert.AreEqual(width, kite.w);
            Assert.AreEqual(height / 2, kite.h);
            Assert.AreEqual(3.905124838, kite.a, Tolerance);
            Assert.AreEqual(7.433034, kite.b, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            Kite kite = new Kite(width, height, skew);

            Assert.AreEqual(25, kite.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            Kite kite = new Kite(width, height, skew);
            IList<CartesianCoordinate> coordinates = kite.LocalCoordinates();

            Assert.AreEqual(skew, coordinates[0].X);
            Assert.AreEqual(0, coordinates[0].Y);

            Assert.AreEqual(width, coordinates[1].X);
            Assert.AreEqual(height / 2, coordinates[1].Y);

            Assert.AreEqual(skew, coordinates[2].X);
            Assert.AreEqual(height, coordinates[2].Y);

            Assert.AreEqual(0, coordinates[3].X);
            Assert.AreEqual(height / 2, coordinates[3].Y);
        }
        #endregion
    }
}