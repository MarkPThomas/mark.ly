using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    // TODO: Handle Centroid & similar coordinates for transformations
    // TODO: Decide how to handle negative skew
    [TestFixture]
    public static class TrapezoidTests
    {
        public static double Tolerance = 0.00001;

        public static double topWidth = 10;
        public static double bottomWidth = 12;
        public static double height = 5;
        public static double skew = 3;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Trapezoid trapezoid = new Trapezoid(height, topWidth, bottomWidth, skew);

            Assert.AreEqual(4, trapezoid.Points.Count);
            Assert.AreEqual(4, trapezoid.Angles.Count);
            Assert.AreEqual(4, trapezoid.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, trapezoid.Tolerance);
            Assert.AreEqual(6.96969697, trapezoid.Centroid.X, Tolerance);
            Assert.AreEqual(2.424242424, trapezoid.Centroid.Y, Tolerance);

            Assert.AreEqual(skew, trapezoid.g);
            Assert.AreEqual(height, trapezoid.h);
            Assert.AreEqual(topWidth, trapezoid.b_t);
            Assert.AreEqual(bottomWidth, trapezoid.b_b);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            Trapezoid trapezoid = new Trapezoid(height, topWidth, bottomWidth, skew);

            Assert.AreEqual(55, trapezoid.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            Trapezoid trapezoid = new Trapezoid(height, topWidth, bottomWidth, skew);
            IList<CartesianCoordinate> coordinates = trapezoid.LocalCoordinates();

            Assert.AreEqual(0, coordinates[0].X);
            Assert.AreEqual(0, coordinates[0].Y);

            Assert.AreEqual(bottomWidth, coordinates[1].X);
            Assert.AreEqual(0, coordinates[1].Y);

            Assert.AreEqual(skew + topWidth, coordinates[2].X);
            Assert.AreEqual(height, coordinates[2].Y);

            Assert.AreEqual(skew, coordinates[3].X);
            Assert.AreEqual(height, coordinates[3].Y);
        }

        [Test]
        public static void Xo_Returns_Centroid_Local_X_Coordinate()
        {
            Trapezoid trapezoid = new Trapezoid(height, topWidth, bottomWidth, skew);
            Assert.AreEqual(6.96969697, trapezoid.Xo(), Tolerance);
        }

        [Test]
        public static void Yo_Returns_Centroid_Local_X_Coordinate()
        {
            Trapezoid trapezoid = new Trapezoid(height, topWidth, bottomWidth, skew);
            Assert.AreEqual(2.424242424, trapezoid.Yo(), Tolerance);
        }
        #endregion
    }
}