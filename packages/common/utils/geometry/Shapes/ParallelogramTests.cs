using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class ParallelogramTests
    {
        public static double Tolerance = 0.00001;
        public static double width = 10;
        public static double height = 5;
        public static double skew = 3;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Parallelogram parallelogram = new Parallelogram(height, width, skew);

            Assert.AreEqual(4, parallelogram.Points.Count);
            Assert.AreEqual(4, parallelogram.Angles.Count);
            Assert.AreEqual(4, parallelogram.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, parallelogram.Tolerance);
            Assert.AreEqual(6.5, parallelogram.Centroid.X, Tolerance);
            Assert.AreEqual(2.5, parallelogram.Centroid.Y, Tolerance);

            Assert.AreEqual(skew, parallelogram.g);
            Assert.AreEqual(height, parallelogram.h);
            Assert.AreEqual(width, parallelogram.b_t);
            Assert.AreEqual(width, parallelogram.b_b);
            Assert.AreEqual(5.830951895, parallelogram.a, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            Parallelogram parallelogram = new Parallelogram(height, width, skew);

            Assert.AreEqual(50, parallelogram.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            Parallelogram parallelogram = new Parallelogram(height, width, skew);
            IList<CartesianCoordinate> coordinates = parallelogram.LocalCoordinates();

            Assert.AreEqual(0, coordinates[0].X);
            Assert.AreEqual(0, coordinates[0].Y);

            Assert.AreEqual(width, coordinates[1].X);
            Assert.AreEqual(0, coordinates[1].Y);

            Assert.AreEqual(skew + width, coordinates[2].X);
            Assert.AreEqual(height, coordinates[2].Y);

            Assert.AreEqual(skew, coordinates[3].X);
            Assert.AreEqual(height, coordinates[3].Y);
        }

        [Test]
        public static void Xo_Returns_Centroid_Local_X_Coordinate()
        {
            Parallelogram parallelogram = new Parallelogram(height, width, skew);
            Assert.AreEqual(6.5, parallelogram.Xo(), Tolerance);
        }

        [Test]
        public static void Yo_Returns_Centroid_Local_X_Coordinate()
        {
            Parallelogram parallelogram = new Parallelogram(height, width, skew);
            Assert.AreEqual(2.5, parallelogram.Yo(), Tolerance);
        }
        #endregion
    }
}