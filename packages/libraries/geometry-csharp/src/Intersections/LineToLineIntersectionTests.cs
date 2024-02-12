using System;
using System.Collections.Generic;
using MPT.Geometry.Intersections;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Intersection
{
    [TestFixture]
    public static class LineToLineIntersectionTests
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
        #region NumberOfIntersections

        #region NumberOfIntersectionsOnHorizontalProjection
        [Test]
        public static void NumberOfIntersectionsOnHorizontalProjection_Of_Polyline_Throws_Argument_Exception_for_Path()
        {
            CartesianCoordinate coordinate = new CartesianCoordinate(1, 1);
            Assert.Throws<ArgumentException>(() => LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(coordinate, polyline.ToArray()));
        }

        [TestCase(-3, 2, 0)] // Left
        [TestCase(3, 2, 0)] // Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Square(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, square.ToArray()));
        }

        [TestCase(-4, 0, 2)] // Left - Base
        [TestCase(4, 0, 0)] // Right - Base
        [TestCase(-4, 2, 0)] // Left - Tip
        [TestCase(4, 2, 0)] // Right - Tip
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Mountain(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, mountain.ToArray()));
        }

        [TestCase(-4, 0, 2)] // Left - Base
        [TestCase(4, 0, 0)] // Right - Base
        [TestCase(-4, 2, 0)] // Left - T0p
        [TestCase(4, 2, 0)] // Right - T0p
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Top(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, top.ToArray()));
        }

        [TestCase(-4, 4, 0)] // Left - Top tip
        [TestCase(4, 4, 0)] // Right - Top tip
        [TestCase(-4, 2, 2)] // Left - Center tip
        [TestCase(4, 2, 0)] // Right - Center tip
        [TestCase(-4, 0, 2)] // Left - Bottom tip
        [TestCase(4, 0, 0)] // Right - Bottom tip
        [TestCase(1, 2, 1)] // Inside
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Flag(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, flag.ToArray()));
        }

        [TestCase(-4, 0, 4)] // Left - Bottom tip
        [TestCase(0, 0, 2)] // In Between - Bottom tip
        [TestCase(4, 0, 0)] // Right - Bottom tip
        [TestCase(-4, 2, 2)] // Left - Intersects tip
        [TestCase(4, 2, 0)] // Right - Intersects tip
        [TestCase(-1, 2, 1)] // Inside Left
        [TestCase(1, 2, 1)] // Inside Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Table(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, table.ToArray()));
        }

        [TestCase(-4, 3, 0)] // Left - Top tip
        [TestCase(0, 3, 0)] // In Between - Top tip
        [TestCase(4, 3, 0)] // Right - Top tip
        [TestCase(-4, 1, 4)] // Left - Intersects tip
        [TestCase(4, 1, 0)] // Right - Intersects tip
        [TestCase(-1, 1, 3)] // Inside Left
        [TestCase(1, 1, 1)] // Inside Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Bowl(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, bowl.ToArray()));
        }


        [TestCase(-4, 2, 2)] // Left - Intersects tip
        [TestCase(4, 2, 0)] // Right - Intersects tip
        [TestCase(0.5, 2, 1)] // Inside
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Mouth(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, mouth.ToArray()));
        }

        [TestCase(-6, 2, 2)] // Left
        [TestCase(6, 2, 0)] // Right
        [TestCase(0, 2, 1)] // Inside of Stem
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Tee(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, tee.ToArray()));
        }

        [TestCase(0, 1, 1)] // Inside
        [TestCase(-6, 1, 2)] // Left - Intersects tip
        [TestCase(6, 1, 0)] // Right - Intersects tip
        [TestCase(-6, 0, 2)] // Bottom Left - Intersects tip
        [TestCase(6, 0, 0)] // Bottom Right - Intersects tip
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Arrow(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, arrow.ToArray()));
        }

        [TestCase(-6, 2, 4)] // Left
        [TestCase(-2, 2, 3)] // Inside Left Stem
        [TestCase(2, 2, 1)] // Inside Right Stem
        [TestCase(6, 2, 0)] // Right
        public static void NumberOfIntersectionsOnHorizontal_CollinearCases_Comb(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, comb.ToArray()));
        }

        [TestCase(-5, -5, 0)] // On starting/ending coordinate
        [TestCase(4, 5, 0)] // On intermediate coordinate
        [TestCase(1, -5, 0)] // On horizontal segment
        [TestCase(-5, 4, 0)] // On vertical segment
        [TestCase(4.5, 2.5, 0)] // On sloped segment
        [TestCase(6, 1, 0)] // Outside path - right
        [TestCase(-6, 1, 2)] // Outside path - left
        [TestCase(1, 6, 0)] // Outside path - above
        [TestCase(-1, -6, 0)] // Outside path - below
        [TestCase(-6, 5, 0)] // Outside path - left & aligned with horizontal top
        [TestCase(-6, -5, 2)] // Outside path - left & aligned with horizontal bottom
        [TestCase(1, 1, 1)] // Inside path
        public static void NumberOfIntersectionsOnHorizontal_Trapezoid(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, trapezoid.ToArray()));
        }

        [TestCase(-5, 5, 0)] // On starting/ending coordinate
        [TestCase(5, -5, 0)] // On intermediate coordinate
        [TestCase(1, 5, 0)] // On horizontal segment
        [TestCase(5, 1, 0)] // On vertical segment
        [TestCase(2, -4.1, 0)] // On sloped segment
        [TestCase(6, 1, 0)] // Outside path - right
        [TestCase(1, 6, 0)] // Outside path - above
        [TestCase(-1, -6, 0)] // Outside path - below
        [TestCase(0, -4, 2)] // Outside path - below intersecting slope
        [TestCase(-6, 2, 2)] // Outside path - left & aligned with horizontal
        [TestCase(1, 1, 1)] // Inside path
        [TestCase(1, 3, 1)] // Inside path & aligned with horizontal
        [TestCase(-3, 1, 2)] // Outside path but inside concave hole
        public static void NumberOfIntersectionsOnHorizontal_Polygon(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, polygon.ToArray()));
        }

        [TestCase(0, 5, 0)] // On starting/ending coordinate
        [TestCase(1, 2, 0)] // On intermediate coordinate
        [TestCase(2, 2, 0)] // On horizontal segment
        [TestCase(0.5, 3.5, 0)] // On sloped segment
        [TestCase(0, 0, 1)] // Inside path, outside leg, aligned with vertex
        [TestCase(-1, -2, 1)] // Inside path, inside leg, aligned with vertex
        [TestCase(-2, -2.5, 3)] // Inside path, inside leg, not aligned with vertex
        [TestCase(6, 6, 0)] // Outside path
        [TestCase(0, -4, 2)] // Outside path but inside re-entrant corner, aligned with tips
        [TestCase(0, -2.1, 2)] // Outside path but inside re-entrant corner, not aligned with tips
        public static void NumberOfIntersectionsOnHorizontal_Star(double x, double y, int expectedResult)
        {
            CartesianCoordinate point = new CartesianCoordinate(x, y);
            Assert.AreEqual(expectedResult, LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(point, star.ToArray()));
        }
        #endregion

        #region NumberOfIntersectionsOnVerticalProjection
        //[Test]
        //public static void NumberOfIntersectionsOnVerticalProjection_Of_Polyline_Throws_Argument_Exception_for_Path()
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(1, 1);
        //    Assert.Throws<ArgumentException>(() => PointProjection.NumberOfIntersectionsOnVerticalProjection(coordinate, polyline.ToArray()));
        //}
        #endregion
        #endregion

        #region Methods: Static (Using Points)
        #region Within Bounds (Points)
        [TestCase(9.9, 10, ExpectedResult = false)]
        [TestCase(10, 10, ExpectedResult = true)]
        [TestCase(10.1, 10, ExpectedResult = false)]
        [TestCase(-0.1, 0, ExpectedResult = false)]
        [TestCase(0, 0, ExpectedResult = true)]
        [TestCase(0.1, 0, ExpectedResult = false)]
        [TestCase(-9.9, -10, ExpectedResult = false)]
        [TestCase(-10, -10, ExpectedResult = true)]
        [TestCase(-10.1, -10, ExpectedResult = false)]
        public static bool PointIsWithinLineHeight_HorizontalLine(double yPtN, double yLeftEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, yLeftEnd);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, yLeftEnd);

            return LineToLineIntersection.PointIsWithinLineHeightInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(9.9, 10, 10.2, ExpectedResult = false)]
        [TestCase(10, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.1, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.2, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.3, 10, 10.2, ExpectedResult = false)]
        [TestCase(-9.9, -10, -10.2, ExpectedResult = false)]
        [TestCase(-10, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.1, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.2, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.3, -10, -10.2, ExpectedResult = false)]
        public static bool PointIsWithinLineHeight_VerticalLine(double yPtN, double yLeftEnd, double yRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, yLeftEnd);
            CartesianCoordinate ptJ = new CartesianCoordinate(1, yRightEnd);

            return LineToLineIntersection.PointIsWithinLineHeightInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(9.9, 10, 10.2, ExpectedResult = false)]
        [TestCase(10, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.1, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.2, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.3, 10, 10.2, ExpectedResult = false)]
        [TestCase(-9.9, -10, -10.2, ExpectedResult = false)]
        [TestCase(-10, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.1, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.2, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.3, -10, -10.2, ExpectedResult = false)]
        public static bool PointIsWithinLineHeight_SlopedLine(double yPtN, double yLeftEnd, double yRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, yLeftEnd);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, yRightEnd);

            return LineToLineIntersection.PointIsWithinLineHeightInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(1, ExpectedResult = false)]
        [TestCase(2, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsWithinLineHeightInclusive_On_Ends(double yPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsWithinLineHeightInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(1, ExpectedResult = false)]
        [TestCase(2, ExpectedResult = false)]
        [TestCase(5, ExpectedResult = false)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsWithinLineHeightExclusive_On_Ends(double yPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsWithinLineHeightExclusive(yPtN, ptI, ptJ);
        }


        [TestCase(9.9, 10, ExpectedResult = false)]
        [TestCase(10, 10, ExpectedResult = true)]
        [TestCase(10.1, 10, ExpectedResult = false)]
        [TestCase(-0.1, 0, ExpectedResult = false)]
        [TestCase(0, 0, ExpectedResult = true)]
        [TestCase(0.1, 0, ExpectedResult = false)]
        [TestCase(-9.9, -10, ExpectedResult = false)]
        [TestCase(-10, -10, ExpectedResult = true)]
        [TestCase(-10.1, -10, ExpectedResult = false)]
        public static bool PointIsWithinLineWidth_Vertical(double xPtN, double xLeftEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(xLeftEnd, 1);
            CartesianCoordinate ptJ = new CartesianCoordinate(xLeftEnd, 15);

            return LineToLineIntersection.PointIsWithinLineWidthInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(9.9, 10, 10.2, ExpectedResult = false)]
        [TestCase(10, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.1, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.2, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.3, 10, 10.2, ExpectedResult = false)]
        [TestCase(-9.9, -10, -10.2, ExpectedResult = false)]
        [TestCase(-10, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.1, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.2, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.3, -10, -10.2, ExpectedResult = false)]
        public static bool PointIsWithinLineWidth_Horizontal(double xPtN, double xLeftEnd, double xRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(xLeftEnd, 1);
            CartesianCoordinate ptJ = new CartesianCoordinate(xRightEnd, 1);

            return LineToLineIntersection.PointIsWithinLineWidthInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(9.9, 10, 10.2, ExpectedResult = false)]
        [TestCase(10, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.1, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.2, 10, 10.2, ExpectedResult = true)]
        [TestCase(10.3, 10, 10.2, ExpectedResult = false)]
        [TestCase(-9.9, -10, -10.2, ExpectedResult = false)]
        [TestCase(-10, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.1, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.2, -10, -10.2, ExpectedResult = true)]
        [TestCase(-10.3, -10, -10.2, ExpectedResult = false)]
        public static bool PointIsWithinLineWidth_Sloped(double xPtN, double xLeftEnd, double xRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(xLeftEnd, 1);
            CartesianCoordinate ptJ = new CartesianCoordinate(xRightEnd, 15);

            return LineToLineIntersection.PointIsWithinLineWidthInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(0, ExpectedResult = false)]
        [TestCase(1, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = true)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsWithinLineWidth_On_Ends_with_Ends_Included(double xPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsWithinLineWidthInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(0, ExpectedResult = false)]
        [TestCase(1, ExpectedResult = false)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = false)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsWithinLineWidth_On_Ends_with_Ends_Excluded(double xPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsWithinLineWidthExclusive(xPtN, ptI, ptJ);
        }
        #endregion

        #region Left of/Below Potential Intersection (Points)
        [TestCase(-2, -1, 15, ExpectedResult = true)]
        [TestCase(-2, 0, 15, ExpectedResult = true)]
        [TestCase(-2, 1, 15, ExpectedResult = true)]
        [TestCase(0, 1, 15, ExpectedResult = true)]
        [TestCase(0.9, 1, 15, ExpectedResult = true)]
        [TestCase(1, 1, 15, ExpectedResult = true)]
        [TestCase(1.1, 1, 15, ExpectedResult = true)]
        [TestCase(14.9, 1, 15, ExpectedResult = true)]
        [TestCase(15, 1, 15, ExpectedResult = true)]
        [TestCase(15.1, 1, 15, ExpectedResult = false)]
        [TestCase(-2, 15, -1, ExpectedResult = true)]
        [TestCase(-2, 15, 0, ExpectedResult = true)]
        [TestCase(-2, 15, 1, ExpectedResult = true)]
        [TestCase(0, 15, 1, ExpectedResult = true)]
        [TestCase(0.9, 15, 1, ExpectedResult = true)]
        [TestCase(1, 15, 1, ExpectedResult = true)]
        [TestCase(1.1, 15, 1, ExpectedResult = true)]
        [TestCase(14.9, 15, 1, ExpectedResult = true)]
        [TestCase(15, 15, 1, ExpectedResult = true)]
        [TestCase(15.1, 15, 1, ExpectedResult = false)]
        public static bool PointIsLeftOfLineEnd_HorizontalLine(double xPtN, double xLeftEnd, double xRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(xLeftEnd, 10);
            CartesianCoordinate ptJ = new CartesianCoordinate(xRightEnd, 10);

            return LineToLineIntersection.PointIsLeftOfLineEndInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(-2, -1, ExpectedResult = true)]
        [TestCase(-0.9, -1, ExpectedResult = false)]
        [TestCase(-2, 0, ExpectedResult = true)]
        [TestCase(-2, 1, ExpectedResult = true)]
        [TestCase(0, 1, ExpectedResult = true)]
        [TestCase(0.9, 1, ExpectedResult = true)]
        [TestCase(1, 1, ExpectedResult = true)]
        [TestCase(1.1, 1, ExpectedResult = false)]
        public static bool PointIsLeftOfLineEnd_VerticalLine(double xPtN, double xRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(xRightEnd, 10);
            CartesianCoordinate ptJ = new CartesianCoordinate(xRightEnd, 20);

            return LineToLineIntersection.PointIsLeftOfLineEndInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(-2, -1, 15, ExpectedResult = true)]
        [TestCase(-2, 0, 15, ExpectedResult = true)]
        [TestCase(-2, 1, 15, ExpectedResult = true)]
        [TestCase(0, 1, 15, ExpectedResult = true)]
        [TestCase(0.9, 1, 15, ExpectedResult = true)]
        [TestCase(1, 1, 15, ExpectedResult = true)]
        [TestCase(1.1, 1, 15, ExpectedResult = true)]
        [TestCase(14.9, 1, 15, ExpectedResult = true)]
        [TestCase(15, 1, 15, ExpectedResult = true)]
        [TestCase(15.1, 1, 15, ExpectedResult = false)]
        [TestCase(-2, 15, -1, ExpectedResult = true)]
        [TestCase(-2, 15, 0, ExpectedResult = true)]
        [TestCase(-2, 15, 1, ExpectedResult = true)]
        [TestCase(0, 15, 1, ExpectedResult = true)]
        [TestCase(0.9, 15, 1, ExpectedResult = true)]
        [TestCase(1, 15, 1, ExpectedResult = true)]
        [TestCase(1.1, 15, 1, ExpectedResult = true)]
        [TestCase(14.9, 15, 1, ExpectedResult = true)]
        [TestCase(15, 15, 1, ExpectedResult = true)]
        [TestCase(15.1, 15, 1, ExpectedResult = false)]
        public static bool PointIsLeftOfLineEnd_SlopedLine(double xPtN, double xLeftEnd, double xRightEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(xLeftEnd, 10);
            CartesianCoordinate ptJ = new CartesianCoordinate(xRightEnd, 20);

            return LineToLineIntersection.PointIsLeftOfLineEndInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(0, ExpectedResult = true)]
        [TestCase(1, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = true)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsLeftOfLineEndInclusive_On_Ends(double xPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsLeftOfLineEndInclusive(xPtN, ptI, ptJ);
        }

        [TestCase(0, ExpectedResult = true)]
        [TestCase(1, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = false)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsLeftOfLineEndExclusive_On_Ends(double xPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsLeftOfLineEndExclusive(xPtN, ptI, ptJ);
        }


        [TestCase(-2, -1, 15, ExpectedResult = true)]
        [TestCase(-2, 0, 15, ExpectedResult = true)]
        [TestCase(-2, 1, 15, ExpectedResult = true)]
        [TestCase(0, 1, 15, ExpectedResult = true)]
        [TestCase(0.9, 1, 15, ExpectedResult = true)]
        [TestCase(1, 1, 15, ExpectedResult = true)]
        [TestCase(1.1, 1, 15, ExpectedResult = true)]
        [TestCase(14.9, 1, 15, ExpectedResult = true)]
        [TestCase(15, 1, 15, ExpectedResult = true)]
        [TestCase(15.1, 1, 15, ExpectedResult = false)]
        [TestCase(-2, 15, -1, ExpectedResult = true)]
        [TestCase(-2, 15, 0, ExpectedResult = true)]
        [TestCase(-2, 15, 1, ExpectedResult = true)]
        [TestCase(0, 15, 1, ExpectedResult = true)]
        [TestCase(0.9, 15, 1, ExpectedResult = true)]
        [TestCase(1, 15, 1, ExpectedResult = true)]
        [TestCase(1.1, 15, 1, ExpectedResult = true)]
        [TestCase(14.9, 15, 1, ExpectedResult = true)]
        [TestCase(15, 15, 1, ExpectedResult = true)]
        [TestCase(15.1, 15, 1, ExpectedResult = false)]
        public static bool PointIsBelowLineBottom_VerticalLine(double yPtN, double yBottomEnd, double yTopEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(10, yBottomEnd);
            CartesianCoordinate ptJ = new CartesianCoordinate(10, yTopEnd);

            return LineToLineIntersection.PointIsBelowLineBottomInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(-2, -1, ExpectedResult = true)]
        [TestCase(-0.9, -1, ExpectedResult = false)]
        [TestCase(-2, 0, ExpectedResult = true)]
        [TestCase(-2, 1, ExpectedResult = true)]
        [TestCase(0, 1, ExpectedResult = true)]
        [TestCase(0.9, 1, ExpectedResult = true)]
        [TestCase(1, 1, ExpectedResult = true)]
        [TestCase(1.1, 1, ExpectedResult = false)]
        public static bool PointIsBelowLineBottom_HorizontalLine(double yPtN, double yBottomEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(10, yBottomEnd);
            CartesianCoordinate ptJ = new CartesianCoordinate(20, yBottomEnd);

            return LineToLineIntersection.PointIsBelowLineBottomInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(-2, -1, 15, ExpectedResult = true)]
        [TestCase(-2, 0, 15, ExpectedResult = true)]
        [TestCase(-2, 1, 15, ExpectedResult = true)]
        [TestCase(0, 1, 15, ExpectedResult = true)]
        [TestCase(0.9, 1, 15, ExpectedResult = true)]
        [TestCase(1, 1, 15, ExpectedResult = true)]
        [TestCase(1.1, 1, 15, ExpectedResult = true)]
        [TestCase(14.9, 1, 15, ExpectedResult = true)]
        [TestCase(15, 1, 15, ExpectedResult = true)]
        [TestCase(15.1, 1, 15, ExpectedResult = false)]
        [TestCase(-2, 15, -1, ExpectedResult = true)]
        [TestCase(-2, 15, 0, ExpectedResult = true)]
        [TestCase(-2, 15, 1, ExpectedResult = true)]
        [TestCase(0, 15, 1, ExpectedResult = true)]
        [TestCase(0.9, 15, 1, ExpectedResult = true)]
        [TestCase(1, 15, 1, ExpectedResult = true)]
        [TestCase(1.1, 15, 1, ExpectedResult = true)]
        [TestCase(14.9, 15, 1, ExpectedResult = true)]
        [TestCase(15, 15, 1, ExpectedResult = true)]
        [TestCase(15.1, 15, 1, ExpectedResult = false)]
        public static bool PointIsBelowLineBottom_SlopedLine(double yPtN, double yBottomEnd, double yTopEnd)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(10, yBottomEnd);
            CartesianCoordinate ptJ = new CartesianCoordinate(20, yTopEnd);

            return LineToLineIntersection.PointIsBelowLineBottomInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(1, ExpectedResult = true)]
        [TestCase(2, ExpectedResult = true)]
        [TestCase(3, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsBelowLineBottomInclusive_On_Ends(double yPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsBelowLineBottomInclusive(yPtN, ptI, ptJ);
        }

        [TestCase(1, ExpectedResult = true)]
        [TestCase(2, ExpectedResult = true)]
        [TestCase(3, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = false)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsBelowLineBottomExclusive_On_Ends(double yPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(1, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(15, 5);

            return LineToLineIntersection.PointIsBelowLineBottomExclusive(yPtN, ptI, ptJ);
        }
        #endregion

        #region Left of/Below Segment Intersection (Points)
        // Using f(x) = 1 + 0.5 * x
        [TestCase(1.5, ExpectedResult = 1)] // Left of segment
        [TestCase(2, ExpectedResult = 2)] // On segment end
        [TestCase(2.5, ExpectedResult = 3)] // Between segment end
        [TestCase(3, ExpectedResult = 4)] // On segment end
        [TestCase(3.5, ExpectedResult = 5)] // Right of segment
        public static double IntersectionPointX_Sloped(double yPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(2, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(4, 3);

            return LineToLineIntersection.IntersectionPointX(yPtN, ptI, ptJ);
        }

        [Test]
        public static void IntersectionPointX_Horizontal_Throws_Argument_Exception()
        {
            CartesianCoordinate ptI = new CartesianCoordinate(2, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(4, 2);

            Assert.Throws<ArgumentException>(() => LineToLineIntersection.IntersectionPointX(2, ptI, ptJ));
        }

        [TestCase(1.9, ExpectedResult = 2)] // Left of segment
        [TestCase(2, ExpectedResult = 2)] // On segment
        [TestCase(2.1, ExpectedResult = 2)] // Right of segment
        public static double IntersectionPointX_Vertical(double yPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(2, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(2, 3);

            return LineToLineIntersection.IntersectionPointX(yPtN, ptI, ptJ);
        }

        [TestCase(-2, -1, ExpectedResult = true)]
        [TestCase(-2, 1, ExpectedResult = true)]
        [TestCase(-2, 0, ExpectedResult = true)]
        [TestCase(0, 2, ExpectedResult = true)]
        [TestCase(1, 2, ExpectedResult = true)]
        [TestCase(2, 2, ExpectedResult = false)]    // Pt is on segment intersection
        [TestCase(3, 2, ExpectedResult = false)]
        [TestCase(-1, -2, ExpectedResult = false)]
        [TestCase(1, -2, ExpectedResult = false)]
        [TestCase(0, -2, ExpectedResult = false)]
        [TestCase(2, 0, ExpectedResult = false)]
        [TestCase(2, 1, ExpectedResult = false)]
        public static bool PointIsLeftOfSegmentIntersection_Within_Segment(double xPtN, double xIntersection)
        {
            CartesianCoordinate vertexI = new CartesianCoordinate(-100, 1);
            CartesianCoordinate vertexJ = new CartesianCoordinate(100, 2);
            return LineToLineIntersection.PointIsLeftOfSegmentIntersection(xPtN, xIntersection, vertexI, vertexJ);
        }

        [TestCase(-2, -1.1, ExpectedResult = false)]
        [TestCase(-2, 1.1, ExpectedResult = false)]
        [TestCase(0, 1.1, ExpectedResult = false)]
        [TestCase(1, 1.1, ExpectedResult = false)]
        public static bool PointIsLeftOfSegmentIntersection_Outside_Segment(double xPtN, double xIntersection)
        {
            CartesianCoordinate vertexI = new CartesianCoordinate(-1, 1);
            CartesianCoordinate vertexJ = new CartesianCoordinate(1, 2);
            return LineToLineIntersection.PointIsLeftOfSegmentIntersection(xPtN, xIntersection, vertexI, vertexJ);
        }

        // Using f(y) = 1 + 0.5 * y
        [TestCase(1.5, ExpectedResult = 1)] // Bottom of segment
        [TestCase(2, ExpectedResult = 2)] // On segment end
        [TestCase(2.5, ExpectedResult = 3)] // Between segment end
        [TestCase(3, ExpectedResult = 4)] // On segment end
        [TestCase(3.5, ExpectedResult = 5)] // Top of segment
        public static double IntersectionPointY_Sloped(double xPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(2, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(3, 4);

            return LineToLineIntersection.IntersectionPointY(xPtN, ptI, ptJ);
        }

        [Test]
        public static void IntersectionPointY_Vertical_Throws_Argument_Exception()
        {
            CartesianCoordinate ptI = new CartesianCoordinate(2, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(2, 4);

            Assert.Throws<ArgumentException>(() => LineToLineIntersection.IntersectionPointY(2, ptI, ptJ));
        }

        [TestCase(1.9, ExpectedResult = 2)] // Bottom of segment
        [TestCase(2, ExpectedResult = 2)] // On segment
        [TestCase(2.1, ExpectedResult = 2)] // Top of segment
        public static double IntersectionPointY_Horizontal(double xPtN)
        {
            CartesianCoordinate ptI = new CartesianCoordinate(2, 2);
            CartesianCoordinate ptJ = new CartesianCoordinate(3, 2);

            return LineToLineIntersection.IntersectionPointY(xPtN, ptI, ptJ);
        }


        [TestCase(-2, -1, ExpectedResult = true)]
        [TestCase(-2, 1, ExpectedResult = true)]
        [TestCase(-2, 0, ExpectedResult = true)]
        [TestCase(0, 2, ExpectedResult = true)]
        [TestCase(1, 2, ExpectedResult = true)]
        [TestCase(2, 2, ExpectedResult = false)]    // Pt is on segment intersection
        [TestCase(3, 2, ExpectedResult = false)]
        [TestCase(-1, -2, ExpectedResult = false)]
        [TestCase(1, -2, ExpectedResult = false)]
        [TestCase(0, -2, ExpectedResult = false)]
        [TestCase(2, 0, ExpectedResult = false)]
        [TestCase(2, 1, ExpectedResult = false)]
        public static bool PointIsBelowSegmentIntersection_Within_Segment(double yPtN, double yIntersection)
        {
            CartesianCoordinate vertexI = new CartesianCoordinate(1, -100);
            CartesianCoordinate vertexJ = new CartesianCoordinate(2, 100);
            return LineToLineIntersection.PointIsBelowSegmentIntersection(yPtN, yIntersection, vertexI, vertexJ);
        }

        [TestCase(-2, -1.1, ExpectedResult = false)]
        [TestCase(-2, 1.1, ExpectedResult = false)]
        [TestCase(0, 1.1, ExpectedResult = false)]
        [TestCase(1, 1.1, ExpectedResult = false)]
        public static bool PointIsBelowSegmentIntersection_Outside_Segment(double yPtN, double yIntersection)
        {
            CartesianCoordinate vertexI = new CartesianCoordinate(1, -1);
            CartesianCoordinate vertexJ = new CartesianCoordinate(2, 1);
            return LineToLineIntersection.PointIsBelowSegmentIntersection(yPtN, yIntersection, vertexI, vertexJ);
        }
        #endregion
        #endregion
    }
}