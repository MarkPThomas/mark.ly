using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class RectangleTests
    {
        public static double Tolerance = 0.00001;
        public static double width = 10;
        public static double height = 5;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Rectangle rectangle = new Rectangle(height, width);

            Assert.AreEqual(4, rectangle.Points.Count);
            Assert.AreEqual(4, rectangle.Angles.Count);
            Assert.AreEqual(4, rectangle.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, rectangle.Tolerance);
            Assert.AreEqual(5, rectangle.Centroid.X, Tolerance);
            Assert.AreEqual(2.5, rectangle.Centroid.Y, Tolerance);

            Assert.AreEqual(0, rectangle.g);
            Assert.AreEqual(height, rectangle.h);
            Assert.AreEqual(width, rectangle.b_t);
            Assert.AreEqual(width, rectangle.b_b);
            Assert.AreEqual(5.590169944, rectangle.CircumRadius, Tolerance);
            Assert.AreEqual(width / 2, rectangle.CircumCenter.X, Tolerance);
            Assert.AreEqual(height / 2, rectangle.CircumCenter.Y, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            Rectangle rectangle = new Rectangle(height, width);
            Assert.AreEqual(50, rectangle.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            Rectangle rectangle = new Rectangle(height, width);
            IList<CartesianCoordinate> coordinates = rectangle.LocalCoordinates();

            Assert.AreEqual(0, coordinates[0].X);
            Assert.AreEqual(0, coordinates[0].Y);

            Assert.AreEqual(width, coordinates[1].X);
            Assert.AreEqual(0, coordinates[1].Y);

            Assert.AreEqual(width, coordinates[2].X);
            Assert.AreEqual(height, coordinates[2].Y);

            Assert.AreEqual(0, coordinates[3].X);
            Assert.AreEqual(height, coordinates[3].Y);
        }

        [Test]
        public static void Xo_Returns_Centroid_Local_X_Coordinate()
        {
            Rectangle rectangle = new Rectangle(height, width);
            Assert.AreEqual(5, rectangle.Xo(), Tolerance);
        }

        [Test]
        public static void Yo_Returns_Centroid_Local_X_Coordinate()
        {
            Rectangle rectangle = new Rectangle(height, width);
            Assert.AreEqual(2.5, rectangle.Yo(), Tolerance);
        }
        #endregion
    }
}