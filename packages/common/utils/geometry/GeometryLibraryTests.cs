using MPT.Geometry.Segments;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests
{
    [TestFixture]
    public static class GeometryLibraryTests
    {
        public static double Tolerance = 0.00001;

        #region Vector-Derived
        [TestCase(1, 0, 2, 0, true)]  // X Pointing Same Way
        [TestCase(0, 1, 0, 2, true)]  // Y Pointing Same Way
        [TestCase(1, 2, 2, 4, true)]  // Sloped Pointing Same Way
        [TestCase(1.1, 2.2, 2.1, 4.2, true)]  // Sloped Pointing Same Way
        [TestCase(2, 1, 1, 2, false)]  //  Concave
        [TestCase(1, 0, 0, 1, false)]  // Quad1 Orthogonal
        [TestCase(0, 1, -1, 0, false)]  // Quad2 Orthogonal
        [TestCase(-1, 0, 0, -1, false)]  // Quad3 Orthogonal
        [TestCase(0, -1, 1, 0, false)]  // Quad4 Orthogonal
        [TestCase(1, 0, 0, -1, false)]  // Mirrored Axis Orthogonal
        [TestCase(1, 2, -2, 1, false)]  // Rotated 45 deg Orthogonal
        [TestCase(-2, 1, 1, -2, false)]  //  Convex
        [TestCase(1, 0, -2, 0, false)]  // X Pointing Opposite Way
        [TestCase(0, 1, 0, -2, false)]  // Y Pointing Opposite Way
        [TestCase(1, 2, -2, -4, false)]  // Sloped Pointing Opposite Way
        [TestCase(1.1, 2.2, -2.1, -4.2, false)]  // Sloped Pointing Opposite Way
        public static void IsCollinearSameDirection(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsCollinearSameDirection(segment1, segment2, Tolerance));
        }

        [TestCase(1, 0, 2, 0, false)]  // X Pointing Same Way
        [TestCase(0, 1, 0, 2, false)]  // Y Pointing Same Way
        [TestCase(1, 2, 2, 4, false)]  // Sloped Pointing Same Way
        [TestCase(1.1, 2.2, 2.1, 4.2, false)]  // Sloped Pointing Same Way
        [TestCase(2, 1, 1, 2, true)]  //  Concave
        [TestCase(1, 0, 0, 1, false)]  // Quad1 Orthogonal
        [TestCase(0, 1, -1, 0, false)]  // Quad2 Orthogonal
        [TestCase(-1, 0, 0, -1, false)]  // Quad3 Orthogonal
        [TestCase(0, -1, 1, 0, false)]  // Quad4 Orthogonal
        [TestCase(1, 0, 0, -1, false)]  // Mirrored Axis Orthogonal
        [TestCase(1, 2, -2, 1, false)]  // Rotated 45 deg Orthogonal
        [TestCase(-2, 1, 1, -2, false)]  //  Convex
        [TestCase(1, 0, -2, 0, false)]  // X Pointing Opposite Way
        [TestCase(0, 1, 0, -2, false)]  // Y Pointing Opposite Way
        [TestCase(1, 2, -2, -4, false)]  // Sloped Pointing Opposite Way
        [TestCase(1.1, 2.2, -2.1, -4.2, false)]  // Sloped Pointing Opposite Way
        public static void IsConcave(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsConcave(segment1, segment2, Tolerance));
        }

        [TestCase(1, 0, 2, 0, false)]  // X Pointing Same Way
        [TestCase(0, 1, 0, 2, false)]  // Y Pointing Same Way
        [TestCase(1, 2, 2, 4, false)]  // Sloped Pointing Same Way
        [TestCase(1.1, 2.2, 2.1, 4.2, false)]  // Sloped Pointing Same Way
        [TestCase(2, 1, 1, 2, false)]  //  Concave
        [TestCase(1, 0, 0, 1, true)]  // Quad1 Orthogonal
        [TestCase(0, 1, -1, 0, true)]  // Quad2 Orthogonal
        [TestCase(-1, 0, 0, -1, true)]  // Quad3 Orthogonal
        [TestCase(0, -1, 1, 0, true)]  // Quad4 Orthogonal
        [TestCase(1, 0, 0, -1, true)]  // Mirrored Axis Orthogonal
        [TestCase(1, 2, -2, 1, true)]  // Rotated 45 deg Orthogonal
        [TestCase(-2, 1, 1, -2, false)]  //  Convex
        [TestCase(1, 0, -2, 0, false)]  // X Pointing Opposite Way
        [TestCase(0, 1, 0, -2, false)]  // Y Pointing Opposite Way
        [TestCase(1, 2, -2, -4, false)]  // Sloped Pointing Opposite Way
        [TestCase(1.1, 2.2, -2.1, -4.2, false)]  // Sloped Pointing Opposite Way
        public static void IsOrthogonal(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsOrthogonal(segment1, segment2));
        }

        [TestCase(1, 0, 2, 0, false)]  // X Pointing Same Way
        [TestCase(0, 1, 0, 2, false)]  // Y Pointing Same Way
        [TestCase(1, 2, 2, 4, false)]  // Sloped Pointing Same Way
        [TestCase(1.1, 2.2, 2.1, 4.2, false)]  // Sloped Pointing Same Way
        [TestCase(2, 1, 1, 2, false)]  //  Concave
        [TestCase(1, 0, 0, 1, false)]  // Quad1 Orthogonal
        [TestCase(0, 1, -1, 0, false)]  // Quad2 Orthogonal
        [TestCase(-1, 0, 0, -1, false)]  // Quad3 Orthogonal
        [TestCase(0, -1, 1, 0, false)]  // Quad4 Orthogonal
        [TestCase(1, 0, 0, -1, false)]  // Mirrored Axis Orthogonal
        [TestCase(1, 2, -2, 1, false)]  // Rotated 45 deg Orthogonal
        [TestCase(-2, 1, 1, -2, true)]  //  Convex
        [TestCase(1, 0, -2, 0, false)]  // X Pointing Opposite Way
        [TestCase(0, 1, 0, -2, false)]  // Y Pointing Opposite Way
        [TestCase(1, 2, -2, -4, false)]  // Sloped Pointing Opposite Way
        [TestCase(1.1, 2.2, -2.1, -4.2, false)]  // Sloped Pointing Opposite Way
        public static void IsConvex(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsConvex(segment1, segment2, Tolerance));
        }

        [TestCase(1, 0, 2, 0, false)]  // X Pointing Same Way
        [TestCase(0, 1, 0, 2, false)]  // Y Pointing Same Way
        [TestCase(1, 2, 2, 4, false)]  // Sloped Pointing Same Way
        [TestCase(1.1, 2.2, 2.1, 4.2, false)]  // Sloped Pointing Same Way
        [TestCase(2, 1, 1, 2, false)]  //  Concave
        [TestCase(1, 0, 0, 1, false)]  // Quad1 Orthogonal
        [TestCase(0, 1, -1, 0, false)]  // Quad2 Orthogonal
        [TestCase(-1, 0, 0, -1, false)]  // Quad3 Orthogonal
        [TestCase(0, -1, 1, 0, false)]  // Quad4 Orthogonal
        [TestCase(1, 0, 0, -1, false)]  // Mirrored Axis Orthogonal
        [TestCase(1, 2, -2, 1, false)]  // Rotated 45 deg Orthogonal
        [TestCase(-2, 1, 1, -2, false)]  //  Convex
        [TestCase(1, 0, -2, 0, true)]  // X Pointing Opposite Way
        [TestCase(0, 1, 0, -2, true)]  // Y Pointing Opposite Way
        [TestCase(1, 2, -2, -4, true)]  // Sloped Pointing Opposite Way
        [TestCase(1.1, 2.2, -2.1, -4.2, true)]  // Sloped Pointing Opposite Way
        public static void IsCollinearOppositeDirection(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsCollinearOppositeDirection(segment1, segment2, Tolerance));
        }

        [TestCase(0, 0, 0, 0, false)]
        [TestCase(1, 0, 0, 1, true)]
        [TestCase(-1, 0, 0, -1, true)]
        [TestCase(-1, 0, 0, 1, false)]
        [TestCase(1, 0, 0, -1, false)]
        [TestCase(0, 1, 1, 0, false)]
        [TestCase(0, -1, -1, 0, false)]
        [TestCase(0, -1, 1, 0, true)]
        [TestCase(0, 1, -1, 0, true)]
        [TestCase(1, 2, 3, 4, false)]
        [TestCase(1, 2, -3, 4, true)]
        [TestCase(1, 2, -3, -4, true)]
        [TestCase(1, 2, 3, -4, false)]
        public static void IsConcaveInside(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsConcaveInside(segment1, segment2));
        }

        [TestCase(0, 0, 0, 0, false)]
        [TestCase(1, 0, 0, 1, false)]
        [TestCase(-1, 0, 0, -1, false)]
        [TestCase(-1, 0, 0, 1, true)]
        [TestCase(1, 0, 0, -1, true)]
        [TestCase(0, 1, 1, 0, true)]
        [TestCase(0, -1, -1, 0, true)]
        [TestCase(0, -1, 1, 0, false)]
        [TestCase(0, 1, -1, 0, false)]
        [TestCase(1, 2, 3, 4, true)]
        [TestCase(1, 2, -3, 4, false)]
        [TestCase(1, 2, -3, -4, false)]
        [TestCase(1, 2, 3, -4, true)]
        public static void IsConvexInside(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, bool expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.IsConvexInside(segment1, segment2));
        }

        [TestCase(1, 0, 2, 0, 1)]  // X Pointing Same Way
        [TestCase(0, 1, 0, 2, 1)]  // Y Pointing Same Way
        [TestCase(1, 2, 2, 4, 1)]  // Sloped Pointing Same Way
        [TestCase(1.1, 2.2, 2.1, 4.2, 1)]  // Sloped Pointing Same Way
        [TestCase(2, 1, 1, 2, 0.8)]  //  Concave
        [TestCase(1, 0, 0, 1, 0)]  // Quad1 Orthogonal
        [TestCase(0, 1, -1, 0, 0)]  // Quad2 Orthogonal
        [TestCase(-1, 0, 0, -1, 0)]  // Quad3 Orthogonal
        [TestCase(0, -1, 1, 0, 0)]  // Quad4 Orthogonal
        [TestCase(1, 0, 0, -1, 0)]  // Mirrored Axis Orthogonal
        [TestCase(1, 2, -2, 1, 0)]  // Rotated 45 deg Orthogonal
        [TestCase(-2, 1, 1, -2, -0.8)]  //  Convex
        [TestCase(1, 0, -2, 0, -1)]  // X Pointing Opposite Way
        [TestCase(0, 1, 0, -2, -1)]  // Y Pointing Opposite Way
        [TestCase(1, 2, -2, -4, -1)]  // Sloped Pointing Opposite Way
        [TestCase(1.1, 2.2, -2.1, -4.2, -1)]  // Sloped Pointing Opposite Way
        public static void ConcavityCollinearity(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, double expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.ConcavityCollinearity(segment1, segment2), Tolerance);
        }

        [TestCase(0, 0, 0, 0, 0)]
        [TestCase(1, 0, 1, 0, 1)]
        [TestCase(1, 1, 1, 1, 2)]
        [TestCase(1, 2, 3, 4, 11)]
        [TestCase(-1, -2, -3, -4, 11)]
        [TestCase(1, -2, 3, 4, -5)]
        [TestCase(1.1, -2.2, 3.3, 4.4, -6.05)]
        public static void DotProduct(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, double expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.DotProduct(segment1, segment2), Tolerance);
        }

        [TestCase(0, 0, 0, 0, 0)]
        [TestCase(1, 0, 1, 0, 0)]
        [TestCase(1, 1, 1, 1, 0)]
        [TestCase(1, 2, 3, 4, -2)]
        [TestCase(-1, -2, -3, -4, -2)]
        [TestCase(1, -2, 3, 4, 10)]
        [TestCase(1.1, -2.2, 3.3, 4.4, 12.1)]
        public static void CrossProduct(double magnitudeX1, double magnitudeY1, double magnitudeX2, double magnitudeY2, double expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.CrossProduct(segment1, segment2), Tolerance);
        }

        [TestCase(1, 0, 2, 0, 0)]
        [TestCase(0, 1, 0, 2, 0)]
        [TestCase(1, 2, 2, 4, 0)]
        [TestCase(1.1, 2.2, 2.1, 4.2, 0)]
        [TestCase(2, 1, 1, 2, 0.643501)]
        [TestCase(1, 0, 0, 1, 1.570796)]
        [TestCase(0, 1, -1, 0, 1.570796)]
        [TestCase(-1, 0, 0, -1, 1.570796)]
        [TestCase(0, -1, 1, 0, 1.570796)]
        [TestCase(1, 0, 0, -1, 1.570796)]
        [TestCase(1, 2, -2, 1, 1.570796)]
        [TestCase(-2, 1, 1, -2, 2.498092)]
        [TestCase(1, 0, -2, 0, 3.141593)]
        [TestCase(0, 1, 0, -2, 3.141593)]
        [TestCase(1, 2, -2, -4, 3.141593)]
        [TestCase(1.1, 2.2, -2.1, -4.2, 3.141593)]
        [TestCase(1, 0, -1, -1, 2.356194)]
        [TestCase(1, 0, 1, -1, 0.785398)]
        public static void Angle_Between_Vectors(
            double magnitudeX1, double magnitudeY1,
            double magnitudeX2, double magnitudeY2, double expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.Angle(segment1, segment2), Tolerance);
        }

        [TestCase(0, 0, 0, 0, 0)]
        [TestCase(1, 0, 0, 1, 0.5)]
        [TestCase(-1, 0, 0, -1, 0.5)]
        [TestCase(-1, 0, 0, 1, -0.5)]
        [TestCase(1, 0, 0, -1, -0.5)]
        [TestCase(0, 1, 1, 0, -0.5)]
        [TestCase(0, -1, -1, 0, -0.5)]
        [TestCase(0, -1, 1, 0, 0.5)]
        [TestCase(0, 1, -1, 0, 0.5)]
        [TestCase(1, 2, 3, 4, -1)]
        [TestCase(1, 2, -3, 4, 5)]
        [TestCase(1, 2, -3, -4, 1)]
        [TestCase(1, 2, 3, -4, -5)]
        public static void Area(double magnitudeX1, double magnitudeY1, double magnitudeX2, double magnitudeY2, double expectedResult)
        {
            LineSegment segment1 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX1, magnitudeY1));
            LineSegment segment2 = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(magnitudeX2, magnitudeY2));

            Assert.AreEqual(expectedResult, GeometryLibrary.Area(segment1, segment2));
        }
        #endregion
    }
}