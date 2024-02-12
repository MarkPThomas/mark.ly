using System;
using System.Collections.Generic;
using MPT.Geometry.Intersections;
using MPT.Geometry.Segments;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Intersection
{
    [TestFixture]
    public static class PointProjectionTests
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
        //[Test]
        //public static void NumberOfIntersectionsOnHorizontalProjection_Of_Polyline_Throws_Argument_Exception_for_Path()
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(1, 1);
        //    Assert.Throws<ArgumentException>(() => PointProjection.NumberOfIntersectionsOnHorizontalProjection(coordinate, polyline.ToArray()));
        //}


        //[TestCase(-6, ExpectedResult = 2)]
        //[TestCase(-5, ExpectedResult = 1)] // On left edge
        //[TestCase(0, ExpectedResult = 1)]
        //[TestCase(4.8, ExpectedResult = 1)] // On right edge
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnHorizontalProjection_Between_Top_And_Bottom_of_Trapezoid(double x)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(x, 1);
        //    return ProjectionHorizontal.NumberOfIntersectionsOnHorizontalProjection(coordinate, trapezoid.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 2)]
        //[TestCase(-5, ExpectedResult = 1)]  // On left vertex
        //[TestCase(0, ExpectedResult = 1)]   // On top segment
        //[TestCase(4, ExpectedResult = 1)]   // On right vertex
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnHorizontalProjection_Aligned_With_Top_of_Trapezoid(double x)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(x, 5);
        //    return ProjectionHorizontal.NumberOfIntersectionsOnHorizontalProjection(coordinate, trapezoid.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 0)]
        //[TestCase(-5, ExpectedResult = 0)]
        //[TestCase(0, ExpectedResult = 0)]
        //[TestCase(3.8, ExpectedResult = 0)]
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnHorizontalProjection_Above_Trapezoid(double x)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(x, 6);
        //    return ProjectionHorizontal.NumberOfIntersectionsOnHorizontalProjection(coordinate, trapezoid.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 4)]
        //[TestCase(-5, ExpectedResult = 1)]  // On left vertical segment
        //[TestCase(-4, ExpectedResult = 3)]
        //[TestCase(-2, ExpectedResult = 1)]  // On left vertical segment of center gap
        //[TestCase(0, ExpectedResult = 2)]   // In center gap
        //[TestCase(2, ExpectedResult = 1)]   // On right vertical segment of center gap
        //[TestCase(4, ExpectedResult = 1)]
        //[TestCase(5, ExpectedResult = 1)]   // On right vertical segment
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnHorizontalProjection_Intersection_Multiple_Solid_Void(double x)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(x, 1);
        //    return ProjectionHorizontal.NumberOfIntersectionsOnHorizontalProjection(coordinate, polygon.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 4)]
        //[TestCase(-5, ExpectedResult = 1)]  // On left vertex
        //[TestCase(-4, ExpectedResult = 1)]  // On bottom left segment
        //[TestCase(0, ExpectedResult = 2)]   // In center gap
        //[TestCase(4, ExpectedResult = 1)]   // On bottom right segment
        //[TestCase(5, ExpectedResult = 1)]   // On right vertex
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnHorizontalProjection_Intersection_Multiple_Solid_Void_On_Tooth_Segment(double x)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(x, -5);
        //    return ProjectionHorizontal.NumberOfIntersectionsOnHorizontalProjection(coordinate, polygon.ToArray());
        //}
        #endregion

        #region NumberOfIntersectionsOnVerticalProjection
        //[Test]
        //public static void NumberOfIntersectionsOnVerticalProjection_Of_Polyline_Throws_Argument_Exception_for_Path()
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(1, 1);
        //    Assert.That(() => PointProjection.NumberOfIntersectionsOnVerticalProjection(coordinate, polyline.ToArray()),
        //                        Throws.Exception
        //                            .TypeOf<ArgumentException>());
        //}

        // TODO: Fix these failing tests
        //[TestCase(-6, ExpectedResult = 2)]
        //[TestCase(-5, ExpectedResult = 1)] // On bottom edge
        //[TestCase(0, ExpectedResult = 1)]
        //[TestCase(5, ExpectedResult = 1)] // On top edge
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnVerticalProjection_Between_Left_And_Right_of_Trapezoid(double y)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(1, y);
        //    return ProjectionVertical.NumberOfIntersectionsOnVerticalProjection(coordinate, trapezoid.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 2)]
        //[TestCase(-5, ExpectedResult = 1)]  // On bottom vertex
        //[TestCase(0, ExpectedResult = 1)]   // On left segment
        //[TestCase(4, ExpectedResult = 1)]   // On top vertex
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnVerticalProjection_Aligned_With_Left_of_Trapezoid(double y)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(5, y);
        //    return ProjectionVertical.NumberOfIntersectionsOnVerticalProjection(coordinate, trapezoid.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 0)]
        //[TestCase(-5, ExpectedResult = 0)]
        //[TestCase(0, ExpectedResult = 0)]
        //[TestCase(3.8, ExpectedResult = 0)]
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnVerticalProjection_Left_Of_Trapezoid(double y)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(6, y);
        //    return ProjectionVertical.NumberOfIntersectionsOnVerticalProjection(coordinate, trapezoid.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 4)]
        //[TestCase(-5, ExpectedResult = 1)]  // On bottom vertical segment
        //[TestCase(-4, ExpectedResult = 3)]
        //[TestCase(-2, ExpectedResult = 1)]  // On bottom vertical segment of center gap
        //[TestCase(0, ExpectedResult = 2)]   // In center gap
        //[TestCase(2, ExpectedResult = 1)]   // On top vertical segment of center gap
        //[TestCase(4, ExpectedResult = 1)]
        //[TestCase(5, ExpectedResult = 1)]   // On top vertical segment
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnVerticalProjection_Intersection_Multiple_Solid_Void(double y)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(1, y);
        //    return ProjectionVertical.NumberOfIntersectionsOnVerticalProjection(coordinate, polygon.ToArray());
        //}

        //[TestCase(-6, ExpectedResult = 4)]
        //[TestCase(-5, ExpectedResult = 1)]  // On bottom vertex
        //[TestCase(-4, ExpectedResult = 1)]  // On bottom left segment
        //[TestCase(0, ExpectedResult = 2)]   // In center gap
        //[TestCase(4, ExpectedResult = 1)]   // On top right segment
        //[TestCase(5, ExpectedResult = 1)]   // On top vertex
        //[TestCase(6, ExpectedResult = 0)]
        //public static int NumberOfIntersectionsOnVerticalProjection_Intersection_Multiple_Solid_Void_On_Tooth_Segment(double y)
        //{
        //    CartesianCoordinate coordinate = new CartesianCoordinate(-5, y);
        //    return ProjectionVertical.NumberOfIntersectionsOnVerticalProjection(coordinate, polygon.ToArray());
        //}
        #endregion
        #endregion

        #region Within Segment Height
        [TestCase(9.9, 10, ExpectedResult = false)]
        [TestCase(10, 10, ExpectedResult = true)]
        [TestCase(10.1, 10, ExpectedResult = false)]
        [TestCase(-0.1, 0, ExpectedResult = false)]
        [TestCase(0, 0, ExpectedResult = true)]
        [TestCase(0.1, 0, ExpectedResult = false)]
        [TestCase(-9.9, -10, ExpectedResult = false)]
        [TestCase(-10, -10, ExpectedResult = true)]
        [TestCase(-10.1, -10, ExpectedResult = false)]
        public static bool PointIsWithinSegmentExtentsHeight_HorizontalLine(double yPtN, double yLeftEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, yLeftEnd),
                new CartesianCoordinate(15, yLeftEnd));

            return PointProjection.PointIsWithinSegmentExtentsHeightInclusive(yPtN, segment);
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
        public static bool PointIsWithinSegmentExtentsHeight_VerticalLine(double yPtN, double yLeftEnd, double yRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, yLeftEnd),
                new CartesianCoordinate(1, yRightEnd));

            return PointProjection.PointIsWithinSegmentExtentsHeightInclusive(yPtN, segment);
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
        public static bool PointIsWithinSegmentExtentsHeight_SlopedLine(double yPtN, double yLeftEnd, double yRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, yLeftEnd),
                new CartesianCoordinate(15, yRightEnd));

            return PointProjection.PointIsWithinSegmentExtentsHeightInclusive(yPtN, segment);
        }

        [TestCase(1, ExpectedResult = false)]
        [TestCase(2, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsWithinSegmentExtentsHeightInclusive_On_Ends(double yPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsWithinSegmentExtentsHeightInclusive(yPtN, segment);
        }

        [TestCase(1, ExpectedResult = false)]
        [TestCase(2, ExpectedResult = false)]
        [TestCase(5, ExpectedResult = false)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsWithinSegmentExtentsHeightExclusive_On_Ends(double yPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsWithinSegmentExtentsHeightExclusive(yPtN, segment);
        }
        #endregion

        #region Within Segment Width
        [TestCase(9.9, 10, ExpectedResult = false)]
        [TestCase(10, 10, ExpectedResult = true)]
        [TestCase(10.1, 10, ExpectedResult = false)]
        [TestCase(-0.1, 0, ExpectedResult = false)]
        [TestCase(0, 0, ExpectedResult = true)]
        [TestCase(0.1, 0, ExpectedResult = false)]
        [TestCase(-9.9, -10, ExpectedResult = false)]
        [TestCase(-10, -10, ExpectedResult = true)]
        [TestCase(-10.1, -10, ExpectedResult = false)]
        public static bool PointIsWithinSegmentExtentsWidth_Vertical(double xPtN, double xLeftEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(xLeftEnd, 1),
                new CartesianCoordinate(xLeftEnd, 15));

            return PointProjection.PointIsWithinSegmentExtentsWidthInclusive(xPtN, segment);
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
        public static bool PointIsWithinSegmentExtentsWidth_Horizontal(double xPtN, double xLeftEnd, double xRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(xLeftEnd, 1),
                new CartesianCoordinate(xRightEnd, 1));

            return PointProjection.PointIsWithinSegmentExtentsWidthInclusive(xPtN, segment);
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
        public static bool PointIsWithinSegmentExtentsWidth_Sloped(double xPtN, double xLeftEnd, double xRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(xLeftEnd, 1),
                new CartesianCoordinate(xRightEnd, 15));

            return PointProjection.PointIsWithinSegmentExtentsWidthInclusive(xPtN, segment);
        }

        [TestCase(0, ExpectedResult = false)]
        [TestCase(1, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = true)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsWithinSegmentExtentsWidthInclusive_On_Ends(double xPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsWithinSegmentExtentsWidthInclusive(xPtN, segment);
        }

        [TestCase(0, ExpectedResult = false)]
        [TestCase(1, ExpectedResult = false)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = false)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsWithinSegmentExtentsWidthExclusive_On_Ends(double xPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsWithinSegmentExtentsWidthExclusive(xPtN, segment);
        }
        #endregion

        #region Left of Segment
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
        public static bool PointIsLeftOfSegmentExtentsEnd_HorizontalLine(double xPtN, double xLeftEnd, double xRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(xLeftEnd, 10),
                new CartesianCoordinate(xRightEnd, 10));

            return PointProjection.PointIsLeftOfSegmentExtentsEndInclusive(xPtN, segment);
        }

        [TestCase(-2, -1, ExpectedResult = true)]
        [TestCase(-0.9, -1, ExpectedResult = false)]
        [TestCase(-2, 0, ExpectedResult = true)]
        [TestCase(-2, 1, ExpectedResult = true)]
        [TestCase(0, 1, ExpectedResult = true)]
        [TestCase(0.9, 1, ExpectedResult = true)]
        [TestCase(1, 1, ExpectedResult = true)]
        [TestCase(1.1, 1, ExpectedResult = false)]
        public static bool PointIsLeftOfSegmentExtentsEnd_VerticalLine(double xPtN, double xRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(xRightEnd, 10),
                new CartesianCoordinate(xRightEnd, 20));

            return PointProjection.PointIsLeftOfSegmentExtentsEndInclusive(xPtN, segment);
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
        public static bool PointIsLeftOfSegmentExtentsEnd_SlopedLine(double xPtN, double xLeftEnd, double xRightEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(xLeftEnd, 10),
                new CartesianCoordinate(xRightEnd, 20));

            return PointProjection.PointIsLeftOfSegmentExtentsEndInclusive(xPtN, segment);
        }

        [TestCase(0, ExpectedResult = true)]
        [TestCase(1, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = true)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsLeftOfSegmentExtentsEndInclusive_On_Ends(double xPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsLeftOfSegmentExtentsEndInclusive(xPtN, segment);
        }

        [TestCase(0, ExpectedResult = true)]
        [TestCase(1, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(15, ExpectedResult = false)]
        [TestCase(16, ExpectedResult = false)]
        public static bool PointIsLeftOfSegmentExtentsEndExclusive_On_Ends(double xPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsLeftOfSegmentExtentsEndExclusive(xPtN, segment);
        }
        #endregion

        #region Below Segment
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
        public static bool PointIsBelowSegmentExtentsBottom_VerticalLine(double yPtN, double yBottomEnd, double yTopEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(10, yBottomEnd),
                new CartesianCoordinate(10, yTopEnd));

            return PointProjection.PointIsBelowSegmentExtentsInclusive(yPtN, segment);
        }

        [TestCase(-2, -1, ExpectedResult = true)]
        [TestCase(-0.9, -1, ExpectedResult = false)]
        [TestCase(-2, 0, ExpectedResult = true)]
        [TestCase(-2, 1, ExpectedResult = true)]
        [TestCase(0, 1, ExpectedResult = true)]
        [TestCase(0.9, 1, ExpectedResult = true)]
        [TestCase(1, 1, ExpectedResult = true)]
        [TestCase(1.1, 1, ExpectedResult = false)]
        public static bool PointIsBelowSegmentExtentsBottom_HorizontalLine(double yPtN, double yBottomEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(10, yBottomEnd),
                new CartesianCoordinate(20, yBottomEnd));

            return PointProjection.PointIsBelowSegmentExtentsInclusive(yPtN, segment);
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
        public static bool PointIsBelowSegmentExtentsBottom_SlopedLine(double yPtN, double yBottomEnd, double yTopEnd)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(10, yBottomEnd),
                new CartesianCoordinate(20, yTopEnd));

            return PointProjection.PointIsBelowSegmentExtentsInclusive(yPtN, segment);
        }

        [TestCase(1, ExpectedResult = true)]
        [TestCase(2, ExpectedResult = true)]
        [TestCase(3, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = true)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsBelowSegmentExtentsBottomInclusive_On_Ends(double yPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsBelowSegmentExtentsInclusive(yPtN, segment);
        }

        [TestCase(1, ExpectedResult = true)]
        [TestCase(2, ExpectedResult = true)]
        [TestCase(3, ExpectedResult = true)]
        [TestCase(5, ExpectedResult = false)]
        [TestCase(6, ExpectedResult = false)]
        public static bool PointIsBelowSegmentExtentsBottomExclusive_On_Ends(double yPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(15, 5));

            return PointProjection.PointIsBelowSegmentExtentsExclusive(yPtN, segment);
        }
        #endregion

        #region Left of Segment Intersection
        // Using f(x) = 1 + 0.5 * x
        [TestCase(1.5, ExpectedResult = 1)] // Left of segment
        [TestCase(2, ExpectedResult = 2)] // On segment end
        [TestCase(2.5, ExpectedResult = 3)] // Between segment end
        [TestCase(3, ExpectedResult = 4)] // On segment end
        [TestCase(3.5, ExpectedResult = 5)] // Right of segment
        public static double IntersectionPointX_Sloped(double yPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(2, 2),
                new CartesianCoordinate(4, 3));

            return PointProjection.IntersectionPointX(yPtN, segment);
        }

        [Test]
        public static void IntersectionPointX_Horizontal_Returns_Infinity()
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(2, 2),
                new CartesianCoordinate(4, 2));

            Assert.IsTrue(double.IsInfinity(PointProjection.IntersectionPointX(2, segment)));
        }

        [TestCase(1.9, ExpectedResult = 2)] // Left of segment
        [TestCase(2, ExpectedResult = 2)] // On segment
        [TestCase(2.1, ExpectedResult = 2)] // Right of segment
        public static double IntersectionPointX_Vertical(double yPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(2, 2),
                new CartesianCoordinate(2, 3));

            return PointProjection.IntersectionPointX(yPtN, segment);
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
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(-100, 1),
                new CartesianCoordinate(100, 2));

            return PointProjection.PointIsLeftOfSegmentIntersection(xPtN, xIntersection, segment);
        }

        [TestCase(-2, -1.1, ExpectedResult = false)]
        [TestCase(-2, 1.1, ExpectedResult = false)]
        [TestCase(0, 1.1, ExpectedResult = false)]
        [TestCase(1, 1.1, ExpectedResult = false)]
        public static bool PointIsLeftOfSegmentIntersection_Outside_Segment(double xPtN, double xIntersection)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(-1, 1),
                new CartesianCoordinate(1, 2));

            return PointProjection.PointIsLeftOfSegmentIntersection(xPtN, xIntersection, segment);
        }
        #endregion

        #region Below Segment Intersection
        // Using f(y) = 1 + 0.5 * y
        [TestCase(1.5, ExpectedResult = 1)] // Bottom of segment
        [TestCase(2, ExpectedResult = 2)] // On segment end
        [TestCase(2.5, ExpectedResult = 3)] // Between segment end
        [TestCase(3, ExpectedResult = 4)] // On segment end
        [TestCase(3.5, ExpectedResult = 5)] // Top of segment
        public static double IntersectionPointY_Sloped(double xPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(2, 2),
                new CartesianCoordinate(3, 4));

            return PointProjection.IntersectionPointY(xPtN, segment);
        }

        [Test]
        public static void IntersectionPointY_Vertical_Returns_Infinity()
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(2, 2),
                new CartesianCoordinate(2, 4));

            Assert.IsTrue(double.IsInfinity(PointProjection.IntersectionPointY(2, segment)));
        }

        [TestCase(1.9, ExpectedResult = 2)] // Bottom of segment
        [TestCase(2, ExpectedResult = 2)] // On segment
        [TestCase(2.1, ExpectedResult = 2)] // Top of segment
        public static double IntersectionPointY_Horizontal(double xPtN)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(2, 2),
                new CartesianCoordinate(3, 2));

            return PointProjection.IntersectionPointY(xPtN, segment);
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
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, -1),
                new CartesianCoordinate(2, 100));

            return PointProjection.PointIsBelowSegmentIntersection(yPtN, yIntersection, segment);
        }

        [TestCase(-2, -1.1, ExpectedResult = false)]
        [TestCase(-2, 1.1, ExpectedResult = false)]
        [TestCase(0, 1.1, ExpectedResult = false)]
        [TestCase(1, 1.1, ExpectedResult = false)]
        public static bool PointIsBelowSegmentIntersection_Outside_Segment(double yPtN, double yIntersection)
        {
            IPathSegment segment = new LineSegment(
                new CartesianCoordinate(1, -1),
                new CartesianCoordinate(2, 1));

            return PointProjection.PointIsBelowSegmentIntersection(yPtN, yIntersection, segment);
        }
        #endregion
    }
}