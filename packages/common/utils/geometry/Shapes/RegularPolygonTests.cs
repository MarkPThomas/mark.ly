using System.Collections.Generic;
using MPT.Geometry.Shapes;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class RegularPolygonTests
    {
        public static double Tolerance = 0.00001;

        #region Initialization
        [TestCase(1, 10)]
        [TestCase(2, 10)]
        [TestCase(3, 10)]
        [TestCase(4, 10)]
        public static void Initialization_with_Dimensions_with_Insufficient_Sides_Creates_5_Sided_Shape(int numberOfSides, double circumRadius)
        {
            RegularPolygon regularPolygon = new RegularPolygon(numberOfSides, circumRadius);

            Assert.AreEqual(5, regularPolygon.Points.Count);
            Assert.AreEqual(5, regularPolygon.Angles.Count);
            Assert.AreEqual(5, regularPolygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, regularPolygon.Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.Y, Tolerance);

            Assert.AreEqual(5, regularPolygon.NumberOfSides);
            Assert.AreEqual(11.75570505, regularPolygon.SideLength, Tolerance);

            Assert.AreEqual(circumRadius, regularPolygon.CircumRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.090169944, regularPolygon.Apothem, Tolerance);
            Assert.AreEqual(8.090169944, regularPolygon.InRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, regularPolygon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, regularPolygon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [TestCase(5, 10)]
        public static void Initialization_with_Dimensions_Creates_Shape(int numberOfSides, double circumRadius)
        {
            RegularPolygon regularPolygon = new RegularPolygon(numberOfSides, circumRadius);

            Assert.AreEqual(numberOfSides, regularPolygon.Points.Count);
            Assert.AreEqual(numberOfSides, regularPolygon.Angles.Count);
            Assert.AreEqual(numberOfSides, regularPolygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, regularPolygon.Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, regularPolygon.NumberOfSides);
            Assert.AreEqual(11.75570505, regularPolygon.SideLength, Tolerance);

            Assert.AreEqual(circumRadius, regularPolygon.CircumRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.090169944, regularPolygon.Apothem, Tolerance);
            Assert.AreEqual(8.090169944, regularPolygon.InRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, regularPolygon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, regularPolygon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [TestCase(5, 10)]
        public static void Factory_with_CircumRadius_Creates_Shape(int numberOfSides, double circumRadius)
        {
            RegularPolygon regularPolygon = RegularPolygon.RegularPolygonByCircumradius(numberOfSides, circumRadius);

            Assert.AreEqual(numberOfSides, regularPolygon.Points.Count);
            Assert.AreEqual(numberOfSides, regularPolygon.Angles.Count);
            Assert.AreEqual(numberOfSides, regularPolygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, regularPolygon.Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, regularPolygon.NumberOfSides);
            Assert.AreEqual(11.75570505, regularPolygon.SideLength, Tolerance);

            Assert.AreEqual(circumRadius, regularPolygon.CircumRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.090169944, regularPolygon.Apothem, Tolerance);
            Assert.AreEqual(8.090169944, regularPolygon.InRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, regularPolygon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, regularPolygon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [TestCase(5, 8.090169944)]
        public static void Factory_with_InRadius_Creates_Shape(int numberOfSides, double inRadius)
        {
            RegularPolygon regularPolygon = RegularPolygon.RegularPolygonByInradius(numberOfSides, inRadius);

            Assert.AreEqual(numberOfSides, regularPolygon.Points.Count);
            Assert.AreEqual(numberOfSides, regularPolygon.Angles.Count);
            Assert.AreEqual(numberOfSides, regularPolygon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, regularPolygon.Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, regularPolygon.NumberOfSides);
            Assert.AreEqual(11.75570505, regularPolygon.SideLength, Tolerance);

            Assert.AreEqual(10, regularPolygon.CircumRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(inRadius, regularPolygon.Apothem, Tolerance);
            Assert.AreEqual(inRadius, regularPolygon.InRadius, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.X, Tolerance);
            Assert.AreEqual(0, regularPolygon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, regularPolygon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, regularPolygon.AngleInteriorSum.DegreesRaw, Tolerance);
        }
        #endregion

        #region Methods: IShapeProperties
        [Test]
        public static void Area_Returns_Area_of_the_Shape()
        {
            RegularPolygon regularPolygon = new RegularPolygon(5, 10);

            Assert.AreEqual(237.7641291, regularPolygon.Area(), Tolerance);
        }

        [Test]
        public static void Perimeter_Returns_Perimeter_of_the_Shape()
        {
            RegularPolygon regularPolygon = new RegularPolygon(5, 10);

            Assert.AreEqual(58.77852523, regularPolygon.Perimeter(), Tolerance);
        }

        [Test]
        public static void LocalCoordinates_Returns_Coordinates_of_Vertices_in_Original_Local_Coordinates()
        {
            RegularPolygon regularPolygon = new RegularPolygon(5, 10);
            IList<CartesianCoordinate> coordinates = regularPolygon.LocalCoordinates();

            Assert.AreEqual(10, coordinates[0].X, Tolerance);
            Assert.AreEqual(0, coordinates[0].Y, Tolerance);

            Assert.AreEqual(3.090169944, coordinates[1].X, Tolerance);
            Assert.AreEqual(9.510565163, coordinates[1].Y, Tolerance);

            Assert.AreEqual(-8.090169944, coordinates[2].X, Tolerance);
            Assert.AreEqual(5.877852523, coordinates[2].Y, Tolerance);

            Assert.AreEqual(-8.090169944, coordinates[3].X, Tolerance);
            Assert.AreEqual(-5.877852523, coordinates[3].Y, Tolerance);

            Assert.AreEqual(3.090169944, coordinates[4].X, Tolerance);
            Assert.AreEqual(-9.510565163, coordinates[4].Y, Tolerance);
        }

        [Test]
        public static void Xo_Returns_Centroid_Local_X_Coordinate()
        {
            RegularPolygon regularPolygon = new RegularPolygon(5, 10);
            Assert.AreEqual(0, regularPolygon.Xo(), Tolerance);
        }

        [Test]
        public static void Yo_Returns_Centroid_Local_X_Coordinate()
        {
            RegularPolygon regularPolygon = new RegularPolygon(5, 10);
            Assert.AreEqual(0, regularPolygon.Yo(), Tolerance);
        }
        #endregion
    }
}