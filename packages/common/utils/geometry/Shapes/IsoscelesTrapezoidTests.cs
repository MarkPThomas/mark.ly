using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class IsoscelesIsoscelesTrapezoidTests
    {
        public static double Tolerance = 0.00001;

        public static double topWidth = 10;
        public static double bottomWidth = 12;
        public static double height = 5;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            IsoscelesTrapezoid isoscelesTrapezoid = new IsoscelesTrapezoid(height, topWidth, bottomWidth);

            Assert.AreEqual(4, isoscelesTrapezoid.Points.Count);
            Assert.AreEqual(4, isoscelesTrapezoid.Angles.Count);
            Assert.AreEqual(4, isoscelesTrapezoid.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, isoscelesTrapezoid.Tolerance);
            Assert.AreEqual(6, isoscelesTrapezoid.Centroid.X, Tolerance);
            Assert.AreEqual(2.424242424, isoscelesTrapezoid.Centroid.Y, Tolerance);

            Assert.AreEqual(1, isoscelesTrapezoid.g);
            Assert.AreEqual(height, isoscelesTrapezoid.h);
            Assert.AreEqual(topWidth, isoscelesTrapezoid.b_t);
            Assert.AreEqual(bottomWidth, isoscelesTrapezoid.b_b);
            Assert.AreEqual(5.099019514, isoscelesTrapezoid.a, Tolerance);
            Assert.AreEqual(19.4833262, isoscelesTrapezoid.CircumRadius, Tolerance);
        }
        #endregion

        #region Methods
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            IsoscelesTrapezoid isoscelesTrapezoid = new IsoscelesTrapezoid(height, topWidth, bottomWidth);

            Assert.AreEqual(55, isoscelesTrapezoid.Area());
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            IsoscelesTrapezoid isoscelesTrapezoid = new IsoscelesTrapezoid(height, topWidth, bottomWidth);
            IList<CartesianCoordinate> coordinates = isoscelesTrapezoid.LocalCoordinates();
            double skew = 0.5 * (bottomWidth - topWidth);

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
            IsoscelesTrapezoid isoscelesTrapezoid = new IsoscelesTrapezoid(height, topWidth, bottomWidth);
            Assert.AreEqual(6, isoscelesTrapezoid.Xo(), Tolerance);
        }

        [Test]
        public static void Yo_Returns_Centroid_Local_X_Coordinate()
        {
            IsoscelesTrapezoid isoscelesTrapezoid = new IsoscelesTrapezoid(height, topWidth, bottomWidth);
            Assert.AreEqual(2.424242424, isoscelesTrapezoid.Yo(), Tolerance);
        }
        #endregion
    }
}