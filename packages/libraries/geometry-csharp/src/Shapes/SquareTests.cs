using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;
namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class SquareTests
    {
        public static double Tolerance = 0.00001;
        public static double width = 10;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Square square = new Square(width);

            Assert.AreEqual(4, square.Points.Count);
            Assert.AreEqual(4, square.Angles.Count);
            Assert.AreEqual(4, square.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, square.Tolerance);
            Assert.AreEqual(5, square.Centroid.X, Tolerance);
            Assert.AreEqual(5, square.Centroid.Y, Tolerance);

            Assert.AreEqual(0, square.g);
            Assert.AreEqual(width, square.h);
            Assert.AreEqual(width, square.b_t);
            Assert.AreEqual(width, square.b_b);

            Assert.AreEqual(7.071067812, square.CircumRadius, Tolerance);
            Assert.AreEqual(width / 2, square.CircumCenter.X, Tolerance);
            Assert.AreEqual(width / 2, square.CircumCenter.Y, Tolerance);

            Assert.AreEqual(5, square.InRadius, Tolerance);
            Assert.AreEqual(width / 2, square.InCenter.X, Tolerance);
            Assert.AreEqual(width / 2, square.InCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            Square square = new Square(width);
            Assert.AreEqual(100, square.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            Square square = new Square(width);
            IList<CartesianCoordinate> coordinates = square.LocalCoordinates();

            Assert.AreEqual(0, coordinates[0].X);
            Assert.AreEqual(0, coordinates[0].Y);

            Assert.AreEqual(width, coordinates[1].X);
            Assert.AreEqual(0, coordinates[1].Y);

            Assert.AreEqual(width, coordinates[2].X);
            Assert.AreEqual(width, coordinates[2].Y);

            Assert.AreEqual(0, coordinates[3].X);
            Assert.AreEqual(width, coordinates[3].Y);
        }

        [Test]
        public static void Xo_Returns_Centroid_Local_X_Coordinate()
        {
            Square square = new Square(width);
            Assert.AreEqual(5, square.Xo(), Tolerance);
        }

        [Test]
        public static void Yo_Returns_Centroid_Local_X_Coordinate()
        {
            Square square = new Square(width);
            Assert.AreEqual(5, square.Yo(), Tolerance);
        }
        #endregion
    }
}