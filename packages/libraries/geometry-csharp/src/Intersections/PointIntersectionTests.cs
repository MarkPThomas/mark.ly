using System;
using System.Collections.Generic;
using MPT.Geometry.Intersections;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Intersection
{
    [TestFixture]
    public static class PointIntersectionTests
    {

        #region Paths & Shapes
        private static List<CartesianCoordinate> square = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(0, 0),
                                            new CartesianCoordinate(1, 0),
                                            new CartesianCoordinate(1, 1),
                                            new CartesianCoordinate(0, 1),
                                            new CartesianCoordinate(0, 0),
                                        };
        private static List<CartesianCoordinate> tee = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(-3, 0),
                                            new CartesianCoordinate(3, 0),
                                            new CartesianCoordinate(3, 2),
                                            new CartesianCoordinate(1, 2),
                                            new CartesianCoordinate(1, 4),
                                            new CartesianCoordinate(-1, 4),
                                            new CartesianCoordinate(-1, 2),
                                            new CartesianCoordinate(-3, 2),
                                            new CartesianCoordinate(-3, 0),
                                        };
        private static List<CartesianCoordinate> comb = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(5, 0),
                                            new CartesianCoordinate(5, 2),
                                            new CartesianCoordinate(3, 2),
                                            new CartesianCoordinate(3, 4),
                                            new CartesianCoordinate(1, 4),
                                            new CartesianCoordinate(1, 2),
                                            new CartesianCoordinate(-1, 2),
                                            new CartesianCoordinate(-1, 4),
                                            new CartesianCoordinate(-3, 4),
                                            new CartesianCoordinate(-3, 2),
                                            new CartesianCoordinate(-5, 2),
                                            new CartesianCoordinate(-5, 0),
                                            new CartesianCoordinate(5, 0),
                                        };
        private static List<CartesianCoordinate> mountain = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(2, 0),
                                            new CartesianCoordinate(0, 2),
                                            new CartesianCoordinate(-2, 0),
                                            new CartesianCoordinate(2, 0),
                                        };
        private static List<CartesianCoordinate> top = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(0, 0),
                                            new CartesianCoordinate(2, 2),
                                            new CartesianCoordinate(-2, 2),
                                            new CartesianCoordinate(0, 0),
                                        };
        private static List<CartesianCoordinate> flag = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(0, 0),
                                            new CartesianCoordinate(3, 2),
                                            new CartesianCoordinate(0, 4),
                                            new CartesianCoordinate(0, 0),
                                        };
        private static List<CartesianCoordinate> table = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(-2, 0),
                                            new CartesianCoordinate(0, 2),
                                            new CartesianCoordinate(2, 0),
                                            new CartesianCoordinate(2, 3),
                                            new CartesianCoordinate(-2, 3),
                                            new CartesianCoordinate(-2, 0),
                                        };
        private static List<CartesianCoordinate> bowl = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(-2, 0),
                                            new CartesianCoordinate(2, 0),
                                            new CartesianCoordinate(2, 3),
                                            new CartesianCoordinate(0, 1),
                                            new CartesianCoordinate(-2, 3),
                                            new CartesianCoordinate(-2, 0),
                                        };
        private static List<CartesianCoordinate> mouth = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(0, 0),
                                            new CartesianCoordinate(3, 0),
                                            new CartesianCoordinate(1, 2),
                                            new CartesianCoordinate(3, 4),
                                            new CartesianCoordinate(0, 4),
                                            new CartesianCoordinate(0, 0),
                                        };
        private static List<CartesianCoordinate> arrow = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(1, 2),
                                            new CartesianCoordinate(-1, 2),
                                            new CartesianCoordinate(-1, 1),
                                            new CartesianCoordinate(-5, 1),
                                            new CartesianCoordinate(0, 0),
                                            new CartesianCoordinate(5, 1),
                                            new CartesianCoordinate(1, 1),
                                            new CartesianCoordinate(1, 2),
                                        };

        private static List<CartesianCoordinate> polyline = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(-5, -5),
                                            new CartesianCoordinate(6, -5),
                                            new CartesianCoordinate(4, 5),
                                            new CartesianCoordinate(-5, 5),
                                            new CartesianCoordinate(-5, 2),
                                        };

        private static List<CartesianCoordinate> trapezoid = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(-5, 5),
                                            new CartesianCoordinate(-5, -5),
                                            new CartesianCoordinate(6, -5),
                                            new CartesianCoordinate(4, 5),
                                            new CartesianCoordinate(-5, 5),
                                        };

        private static List<CartesianCoordinate> polygon = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(-5, 5),
                                            new CartesianCoordinate(-5, 2),
                                            new CartesianCoordinate(-2, 2),
                                            new CartesianCoordinate(-2, -2),
                                            new CartesianCoordinate(-5, -2),
                                            new CartesianCoordinate(5, -5),
                                            new CartesianCoordinate(5, -1),
                                            new CartesianCoordinate(3, -1),
                                            new CartesianCoordinate(3, 3),
                                            new CartesianCoordinate(5, 3),
                                            new CartesianCoordinate(5, 5),
                                            new CartesianCoordinate(-5, 5),
                                        };

        private static List<CartesianCoordinate> star = new List<CartesianCoordinate>()
                                        {
                                            new CartesianCoordinate(0, 5),
                                            new CartesianCoordinate(-1, 2),
                                            new CartesianCoordinate(-4.5, 2),
                                            new CartesianCoordinate(-2, 0),
                                            new CartesianCoordinate(-3, -4),
                                            new CartesianCoordinate(0, -2),
                                            new CartesianCoordinate(3, -4),
                                            new CartesianCoordinate(2, 0),
                                            new CartesianCoordinate(4.5, 2),
                                            new CartesianCoordinate(1, 2),
                                            new CartesianCoordinate(0, 5),
                                        };
        #endregion

        #region IsOnPoint
        [TestCase(0.9, 2, 1, 2, ExpectedResult = false)] // Left
        [TestCase(1.1, 2, 1, 2, ExpectedResult = false)] // Right
        [TestCase(1, 2.1, 1, 2, ExpectedResult = false)] // Above
        [TestCase(1, 1.9, 1, 2, ExpectedResult = false)] // Below
        [TestCase(1, 2, 1, 2, ExpectedResult = true)] // On
        [TestCase(-0.9, -2, -1, -2, ExpectedResult = false)] // Left
        [TestCase(-1.1, -2, -1, -2, ExpectedResult = false)] // Right
        [TestCase(-1, -2.1, -1, -2, ExpectedResult = false)] // Above
        [TestCase(-1, -1.9, -1, -2, ExpectedResult = false)] // Below
        [TestCase(-1, -2, -1, -2, ExpectedResult = true)] // On
        [TestCase(-0.9, 2, -1, 2, ExpectedResult = false)] // Left
        [TestCase(-1.1, 2, -1, 2, ExpectedResult = false)] // Right
        [TestCase(-1, 2.1, -1, 2, ExpectedResult = false)] // Above
        [TestCase(-1, 1.9, -1, 2, ExpectedResult = false)] // Below
        [TestCase(-1, 2, -1, 2, ExpectedResult = true)] // On
        [TestCase(0.9, -2, 1, -2, ExpectedResult = false)] // Left
        [TestCase(1.1, -2, 1, -2, ExpectedResult = false)] // Right
        [TestCase(1, -2.1, 1, -2, ExpectedResult = false)] // Above
        [TestCase(1, -1.9, 1, -2, ExpectedResult = false)] // Below
        [TestCase(1, -2, 1, -2, ExpectedResult = true)] // On
        public static bool IsOnPoint(double x, double y, double x1, double y1)
        {
            CartesianCoordinate point = new CartesianCoordinate(x1, y1);
            return PointIntersection.IsOnPoint(point, new CartesianCoordinate(x, y));
        }
        #endregion

        #region IsOnBoundary
        [TestCase(-5, -5, true)] // On starting coordinate
        [TestCase(-5, 2, true)] // On ending coordinate
        [TestCase(4, 5, true)] // On intermediate coordinate
        [TestCase(1, -5, true)] // On horizontal segment
        [TestCase(-5, 4, true)] // On vertical segment
        [TestCase(4.5, 2.5, true)] // On sloped segment
        [TestCase(-5, 1, false)] // Aligned with path on opening
        [TestCase(6, 1, false)] // Outside path
        [TestCase(1, 1, false)] // Inside path
        public static void IsOnBoundary_Polyline(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsOnBoundary(point, polyline.ToArray()));
        }

        [TestCase(-5, -5, true)] // On starting/ending coordinate
        [TestCase(4, 5, true)] // On intermediate coordinate
        [TestCase(1, -5, true)] // On horizontal segment
        [TestCase(-5, 4, true)] // On vertical segment
        [TestCase(4.5, 2.5, true)] // On sloped segment
        [TestCase(6, 1, false)] // Outside path
        [TestCase(1, 1, false)] // Inside path
        public static void IsOnBoundary_Trapezoid(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsOnBoundary(point, trapezoid.ToArray()));
        }

        [TestCase(-5, 5, true)] // On starting/ending coordinate
        [TestCase(5, -5, true)] // On intermediate coordinate
        [TestCase(1, 5, true)] // On horizontal segment
        [TestCase(3, 1, true)] // On vertical segment inside concave hole
        [TestCase(2, -4.1, true)] // On sloped segment
        [TestCase(6, 1, false)] // Outside path
        [TestCase(1, 1, false)] // Inside path
        [TestCase(-3, 1, false)] // Outside path but inside concave hole
        public static void IsOnBoundary_Polygon(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsOnBoundary(point, polygon.ToArray()));
        }

        [TestCase(0, 5, true)] // On starting/ending coordinate
        [TestCase(1, 2, true)] // On intermediate coordinate
        [TestCase(2, 2, true)] // On horizontal segment
        [TestCase(0.5, 3.5, true)] // On sloped segment
        [TestCase(0, 0, false)] // Inside path, outside leg, aligned with vertex
        [TestCase(-1, -2, false)] // Inside path, inside leg, aligned with vertex
        [TestCase(-2, -2, false)] // Inside path, inside leg, not aligned with vertex
        [TestCase(6, 6, false)] // Outside path
        [TestCase(0, -4, false)] // Outside path but inside re-entrant corner, aligned with tips
        [TestCase(0, -2.1, false)] // Outside path but inside re-entrant corner, not aligned with tips
        public static void IsOnBoundary_Star(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsOnBoundary(point, star.ToArray()));
        }
        #endregion

        #region IsWithinShape
        [Test]
        public static void IsWithinShape_Of_Polyline_Throws_Argument_Exception()
        {
            CartesianCoordinate coordinate = new CartesianCoordinate(1, 1);
            Assert.Throws< ArgumentException>(() => PointIntersection.IsWithinShape(coordinate, polyline.ToArray()));
        }

        [Test]
        public static void NumberOfIntersectionsOnHorizontalProjection_Of_Polyline_Throws_Argument_Exception_for_Path()
        {
            CartesianCoordinate coordinate = new CartesianCoordinate(1, 1);
            Assert.Throws<ArgumentException>(() => PointIntersection.IsWithinShape(coordinate, polyline.ToArray()));
        }

        [TestCase(-3, 2, false)] // Left
        [TestCase(3, 2, false)] // Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Square(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, square.ToArray()));
        }

        [TestCase(-4, 0, false)] // Left - Base
        [TestCase(4, 0, false)] // Right - Base
        [TestCase(-4, 2, false)] // Left - Tip
        [TestCase(4, 2, false)] // Right - Tip
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Mountain(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, mountain.ToArray()));
        }

        [TestCase(-4, 0, false)] // Left - Base
        [TestCase(4, 0, false)] // Right - Base
        [TestCase(-4, 2, false)] // Left - T0p
        [TestCase(4, 2, false)] // Right - T0p
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Top(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, top.ToArray()));
        }

        [TestCase(-4, 4, false)] // Left - Top tip
        [TestCase(4, 4, false)] // Right - Top tip
        [TestCase(-4, 2, false)] // Left - Center tip
        [TestCase(4, 2, false)] // Right - Center tip
        [TestCase(-4, 0, false)] // Left - Bottom tip
        [TestCase(4, 0, false)] // Right - Bottom tip
        [TestCase(1, 2, true)] // Inside
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Flag(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, flag.ToArray()));
        }

        [TestCase(-4, 0, false)] // Left - Bottom tip
        [TestCase(0, 0, false)] // In Between - Bottom tip
        [TestCase(4, 0, false)] // Right - Bottom tip
        [TestCase(-4, 2, false)] // Left - Intersects tip
        [TestCase(4, 2, false)] // Right - Intersects tip
        [TestCase(-1, 2, true)] // Inside Left
        [TestCase(1, 2, true)] // Inside Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Table(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, table.ToArray()));
        }

        [TestCase(-4, 3, false)] // Left - Top tip
        [TestCase(0, 3, false)] // In Between - Top tip
        [TestCase(4, 3, false)] // Right - Top tip
        [TestCase(-4, 1, false)] // Left - Intersects tip
        [TestCase(4, 1, false)] // Right - Intersects tip
        [TestCase(-1, 1, true)] // Inside Left
        [TestCase(1, 1, true)] // Inside Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Bowl(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, bowl.ToArray()));
        }


        [TestCase(-4, 2, false)] // Left - Intersects tip
        [TestCase(4, 2, false)] // Right - Intersects tip
        [TestCase(0.5, 2, true)] // Inside
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Mouth(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, mouth.ToArray()));
        }

        [TestCase(-6, 2, false)] // Left
        [TestCase(6, 2, false)] // Right
        [TestCase(0, 2, true)] // Inside of Stem
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Tee(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, tee.ToArray()));
        }

        [TestCase(0, 1, true)] // Inside
        [TestCase(-6, 1, false)] // Left - Intersects tip
        [TestCase(6, 1, false)] // Right - Intersects tip
        [TestCase(-6, 0, false)] // Bottom Left - Intersects tip
        [TestCase(6, 0, false)] // Bottom Right - Intersects tip
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Arrow(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, arrow.ToArray()));
        }

        [TestCase(-6, 2, false)] // Left
        [TestCase(-2, 2, true)] // Inside Left Stem
        [TestCase(2, 2, true)] // Inside Right Stem
        [TestCase(6, 2, false)] // Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Comb(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, comb.ToArray()));
        }

        [TestCase(-5, -5, false)] // On starting/ending coordinate
        [TestCase(4, 5, false)] // On intermediate coordinate
        [TestCase(1, -5, false)] // On horizontal segment
        [TestCase(-5, 4, false)] // On vertical segment
        [TestCase(4.5, 2.5, false)] // On sloped segment
        [TestCase(6, 1, false)] // Outside path - right
        [TestCase(-6, 1, false)] // Outside path - left
        [TestCase(1, 6, false)] // Outside path - above
        [TestCase(-1, -6, false)] // Outside path - below
        [TestCase(-6, 5, false)] // Outside path - left & aligned with horizontal top
        [TestCase(-6, -5, false)] // Outside path - left & aligned with horizontal bottom
        [TestCase(1, 1, true)] // Inside path
        public static void NumberOfIntersectionsOnHorizontal_Trapezoid(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, trapezoid.ToArray()));
        }

        [TestCase(-5, 5, false)] // On starting/ending coordinate
        [TestCase(5, -5, false)] // On intermediate coordinate
        [TestCase(1, 5, false)] // On horizontal segment
        [TestCase(5, 1, false)] // On vertical segment
        [TestCase(2, -4.1, false)] // On sloped segment
        [TestCase(6, 1, false)] // Outside path - right
        [TestCase(1, 6, false)] // Outside path - above
        [TestCase(-1, -6, false)] // Outside path - below
        [TestCase(0, -4, false)] // Outside path - below intersecting slope
        [TestCase(-6, 2, false)] // Outside path - left & aligned with horizontal
        [TestCase(1, 1, true)] // Inside path
        [TestCase(1, 3, true)] // Inside path & aligned with horizontal
        [TestCase(-3, 1, false)] // Outside path but inside concave hole
        public static void NumberOfIntersectionsOnHorizontal_Polygon(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, polygon.ToArray()));
        }

        [TestCase(0, 5, false)] // On starting/ending coordinate
        [TestCase(1, 2, false)] // On intermediate coordinate
        [TestCase(2, 2, false)] // On horizontal segment
        [TestCase(0.5, 3.5, false)] // On sloped segment
        [TestCase(0, 0, true)] // Inside path, outside leg, aligned with vertex
        [TestCase(-1, -2, true)] // Inside path, inside leg, aligned with vertex
        [TestCase(-2, -2.5, true)] // Inside path, inside leg, not aligned with vertex
        [TestCase(6, 6, false)] // Outside path
        [TestCase(0, -4, false)] // Outside path but inside re-entrant corner, aligned with tips
        [TestCase(0, -2.1, false)] // Outside path but inside re-entrant corner, not aligned with tips
        public static void NumberOfIntersectionsOnHorizontal_Star(double x, double y, bool expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, PointIntersection.IsWithinShape(point, star.ToArray()));
        }
        #endregion
    }
}