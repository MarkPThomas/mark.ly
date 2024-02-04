using MPT.Geometry.Shapes;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class OctagonTests
    {
        public static double Tolerance = 0.00001;
        public static int numberOfSides = 8;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Octagon octagon = new Octagon(10);

            Assert.AreEqual(numberOfSides, octagon.Points.Count);
            Assert.AreEqual(numberOfSides, octagon.Angles.Count);
            Assert.AreEqual(numberOfSides, octagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, octagon.Tolerance);
            Assert.AreEqual(0, octagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, octagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, octagon.NumberOfSides);
            Assert.AreEqual(7.653668647, octagon.SideLength, Tolerance);

            Assert.AreEqual(10, octagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, octagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, octagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(9.238795325, octagon.Apothem, Tolerance);
            Assert.AreEqual(9.238795325, octagon.InRadius, Tolerance);
            Assert.AreEqual(0, octagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, octagon.InCenter.Y, Tolerance);

            Assert.AreEqual(135, octagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(1080, octagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_CircumRadius_Creates_Shape()
        {
            Octagon octagon = Octagon.OctagonByCircumradius(10);

            Assert.AreEqual(numberOfSides, octagon.Points.Count);
            Assert.AreEqual(numberOfSides, octagon.Angles.Count);
            Assert.AreEqual(numberOfSides, octagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, octagon.Tolerance);
            Assert.AreEqual(0, octagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, octagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, octagon.NumberOfSides);
            Assert.AreEqual(7.653668647, octagon.SideLength, Tolerance);

            Assert.AreEqual(10, octagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, octagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, octagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(9.238795325, octagon.Apothem, Tolerance);
            Assert.AreEqual(9.238795325, octagon.InRadius, Tolerance);
            Assert.AreEqual(0, octagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, octagon.InCenter.Y, Tolerance);

            Assert.AreEqual(135, octagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(1080, octagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_InRadius_Creates_Shape()
        {
            Octagon octagon = Octagon.OctagonByInradius(9.238795325);

            Assert.AreEqual(numberOfSides, octagon.Points.Count);
            Assert.AreEqual(numberOfSides, octagon.Angles.Count);
            Assert.AreEqual(numberOfSides, octagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, octagon.Tolerance);
            Assert.AreEqual(0, octagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, octagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, octagon.NumberOfSides);
            Assert.AreEqual(7.653668647, octagon.SideLength, Tolerance);

            Assert.AreEqual(10, octagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, octagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, octagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(9.238795325, octagon.Apothem, Tolerance);
            Assert.AreEqual(9.238795325, octagon.InRadius, Tolerance);
            Assert.AreEqual(0, octagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, octagon.InCenter.Y, Tolerance);

            Assert.AreEqual(135, octagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(1080, octagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }
        #endregion
    }
}