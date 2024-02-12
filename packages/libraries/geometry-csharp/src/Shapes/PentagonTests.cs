using MPT.Geometry.Shapes;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class PentagonTests
    {
        public static double Tolerance = 0.00001;
        public static int numberOfSides = 5;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Pentagon pentagon = new Pentagon(10);

            Assert.AreEqual(numberOfSides, pentagon.Points.Count);
            Assert.AreEqual(numberOfSides, pentagon.Angles.Count);
            Assert.AreEqual(numberOfSides, pentagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, pentagon.Tolerance);
            Assert.AreEqual(0, pentagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, pentagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, pentagon.NumberOfSides);
            Assert.AreEqual(11.75570505, pentagon.SideLength, Tolerance);

            Assert.AreEqual(10, pentagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, pentagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, pentagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.090169944, pentagon.Apothem, Tolerance);
            Assert.AreEqual(8.090169944, pentagon.InRadius, Tolerance);
            Assert.AreEqual(0, pentagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, pentagon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, pentagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, pentagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_CircumRadius_Creates_Shape()
        {
            Pentagon pentagon = Pentagon.PentagonByCircumradius(10);

            Assert.AreEqual(numberOfSides, pentagon.Points.Count);
            Assert.AreEqual(numberOfSides, pentagon.Angles.Count);
            Assert.AreEqual(numberOfSides, pentagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, pentagon.Tolerance);
            Assert.AreEqual(0, pentagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, pentagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, pentagon.NumberOfSides);
            Assert.AreEqual(11.75570505, pentagon.SideLength, Tolerance);

            Assert.AreEqual(10, pentagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, pentagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, pentagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.090169944, pentagon.Apothem, Tolerance);
            Assert.AreEqual(8.090169944, pentagon.InRadius, Tolerance);
            Assert.AreEqual(0, pentagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, pentagon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, pentagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, pentagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_InRadius_Creates_Shape()
        {
            Pentagon pentagon = Pentagon.PentagonByInradius(8.090169944);

            Assert.AreEqual(numberOfSides, pentagon.Points.Count);
            Assert.AreEqual(numberOfSides, pentagon.Angles.Count);
            Assert.AreEqual(numberOfSides, pentagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, pentagon.Tolerance);
            Assert.AreEqual(0, pentagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, pentagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, pentagon.NumberOfSides);
            Assert.AreEqual(11.75570505, pentagon.SideLength, Tolerance);

            Assert.AreEqual(10, pentagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, pentagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, pentagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.090169944, pentagon.Apothem, Tolerance);
            Assert.AreEqual(8.090169944, pentagon.InRadius, Tolerance);
            Assert.AreEqual(0, pentagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, pentagon.InCenter.Y, Tolerance);

            Assert.AreEqual(108, pentagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(540, pentagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }
        #endregion
    }
}