using MPT.Geometry.Shapes;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class DecagonTests
    {
        public static double Tolerance = 0.00001;
        public static int numberOfSides = 10;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Decagon decagon = new Decagon(10);

            Assert.AreEqual(numberOfSides, decagon.Points.Count);
            Assert.AreEqual(numberOfSides, decagon.Angles.Count);
            Assert.AreEqual(numberOfSides, decagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, decagon.Tolerance);
            Assert.AreEqual(0, decagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, decagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, decagon.NumberOfSides);
            Assert.AreEqual(6.180339887, decagon.SideLength, Tolerance);

            Assert.AreEqual(10, decagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, decagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, decagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(9.510565163, decagon.Apothem, Tolerance);
            Assert.AreEqual(9.510565163, decagon.InRadius, Tolerance);
            Assert.AreEqual(0, decagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, decagon.InCenter.Y, Tolerance);

            Assert.AreEqual(144, decagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(1440, decagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_CircumRadius_Creates_Shape()
        {
            Decagon decagon = Decagon.DecagonByCircumradius(10);

            Assert.AreEqual(numberOfSides, decagon.Points.Count);
            Assert.AreEqual(numberOfSides, decagon.Angles.Count);
            Assert.AreEqual(numberOfSides, decagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, decagon.Tolerance);
            Assert.AreEqual(0, decagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, decagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, decagon.NumberOfSides);
            Assert.AreEqual(6.180339887, decagon.SideLength, Tolerance);

            Assert.AreEqual(10, decagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, decagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, decagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(9.510565163, decagon.Apothem, Tolerance);
            Assert.AreEqual(9.510565163, decagon.InRadius, Tolerance);
            Assert.AreEqual(0, decagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, decagon.InCenter.Y, Tolerance);

            Assert.AreEqual(144, decagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(1440, decagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_InRadius_Creates_Shape()
        {
            Decagon decagon = Decagon.DecagonByInradius(9.510565163);

            Assert.AreEqual(numberOfSides, decagon.Points.Count);
            Assert.AreEqual(numberOfSides, decagon.Angles.Count);
            Assert.AreEqual(numberOfSides, decagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, decagon.Tolerance);
            Assert.AreEqual(0, decagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, decagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, decagon.NumberOfSides);
            Assert.AreEqual(6.180339887, decagon.SideLength, Tolerance);

            Assert.AreEqual(10, decagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, decagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, decagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(9.510565163, decagon.Apothem, Tolerance);
            Assert.AreEqual(9.510565163, decagon.InRadius, Tolerance);
            Assert.AreEqual(0, decagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, decagon.InCenter.Y, Tolerance);

            Assert.AreEqual(144, decagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(1440, decagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }
        #endregion
    }
}