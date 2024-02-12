using MPT.Geometry.Shapes;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Shapes
{
    [TestFixture]
    public static class HexagonTests
    {
        public static double Tolerance = 0.00001;
        public static int numberOfSides = 6;

        #region Initialization
        [Test]
        public static void Initialization_with_Dimensions_Creates_Shape()
        {
            Hexagon hexagon = new Hexagon(10);

            Assert.AreEqual(numberOfSides, hexagon.Points.Count);
            Assert.AreEqual(numberOfSides, hexagon.Angles.Count);
            Assert.AreEqual(numberOfSides, hexagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, hexagon.Tolerance);
            Assert.AreEqual(0, hexagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, hexagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, hexagon.NumberOfSides);
            Assert.AreEqual(10, hexagon.SideLength, Tolerance);

            Assert.AreEqual(10, hexagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, hexagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, hexagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.660254038, hexagon.Apothem, Tolerance);
            Assert.AreEqual(8.660254038, hexagon.InRadius, Tolerance);
            Assert.AreEqual(0, hexagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, hexagon.InCenter.Y, Tolerance);

            Assert.AreEqual(120, hexagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(720, hexagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_CircumRadius_Creates_Shape()
        {
            Hexagon hexagon = Hexagon.HexagonByCircumradius(10);

            Assert.AreEqual(numberOfSides, hexagon.Points.Count);
            Assert.AreEqual(numberOfSides, hexagon.Angles.Count);
            Assert.AreEqual(numberOfSides, hexagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, hexagon.Tolerance);
            Assert.AreEqual(0, hexagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, hexagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, hexagon.NumberOfSides);
            Assert.AreEqual(10, hexagon.SideLength, Tolerance);

            Assert.AreEqual(10, hexagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, hexagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, hexagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.660254038, hexagon.Apothem, Tolerance);
            Assert.AreEqual(8.660254038, hexagon.InRadius, Tolerance);
            Assert.AreEqual(0, hexagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, hexagon.InCenter.Y, Tolerance);

            Assert.AreEqual(120, hexagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(720, hexagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }

        [Test]
        public static void Factory_with_InRadius_Creates_Shape()
        {
            Hexagon hexagon = Hexagon.HexagonByInradius(8.660254038);

            Assert.AreEqual(numberOfSides, hexagon.Points.Count);
            Assert.AreEqual(numberOfSides, hexagon.Angles.Count);
            Assert.AreEqual(numberOfSides, hexagon.Sides.Count);
            Assert.AreEqual(GeometryLibrary.ZeroTolerance, hexagon.Tolerance);
            Assert.AreEqual(0, hexagon.Centroid.X, Tolerance);
            Assert.AreEqual(0, hexagon.Centroid.Y, Tolerance);

            Assert.AreEqual(numberOfSides, hexagon.NumberOfSides);
            Assert.AreEqual(10, hexagon.SideLength, Tolerance);

            Assert.AreEqual(10, hexagon.CircumRadius, Tolerance);
            Assert.AreEqual(0, hexagon.CircumCenter.X, Tolerance);
            Assert.AreEqual(0, hexagon.CircumCenter.Y, Tolerance);

            Assert.AreEqual(8.660254038, hexagon.Apothem, Tolerance);
            Assert.AreEqual(8.660254038, hexagon.InRadius, Tolerance);
            Assert.AreEqual(0, hexagon.InCenter.X, Tolerance);
            Assert.AreEqual(0, hexagon.InCenter.Y, Tolerance);

            Assert.AreEqual(120, hexagon.AngleInterior.Degrees, Tolerance);
            Assert.AreEqual(720, hexagon.AngleInteriorSum.DegreesRaw, Tolerance);
        }
        #endregion
    }
}