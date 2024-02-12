using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using MPT.Geometry.Segments;
using MPT.Geometry.Tools;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Tools
{
    [TestFixture]
    public static class SegmentsBoundaryTests
    {
        #region Initialization
        [Test]
        public static void Initialization_without_Segments_Results_in_Empty_Object()
        {
            SegmentsBoundary boundary = new SegmentsBoundary();

            Assert.AreEqual(0, boundary.Count);
            Assert.IsTrue(boundary.IsReadOnly);
        }

        [Test]
        public static void Initialization_with_Segments_Array_Results_in_Object_with_Immutable_Segments_Properties_List()
        {
            int index = 1;
            double xOld = 1;
            double yOld = 2;

            CartesianCoordinate[] coordinates = new CartesianCoordinate[4];
            coordinates[0] = new CartesianCoordinate(0, 0);
            coordinates[1] = new CartesianCoordinate(xOld, yOld);
            coordinates[2] = new CartesianCoordinate(3, 4);
            coordinates[3] = new CartesianCoordinate(5, 6);

            LineSegment[] segments = new LineSegment[3];
            segments[0] = new LineSegment(coordinates[0], coordinates[1]);
            segments[1] = new LineSegment(coordinates[1], coordinates[2]);
            segments[2] = new LineSegment(coordinates[2], coordinates[3]);

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.IsTrue(boundary.IsReadOnly);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].I.X);
            Assert.AreEqual(yOld, boundary[index].I.Y);

            // Alter existing coordinates to passed in reference to prove immutable
            double xNew = 7;
            double yNew = 8;
            segments[1] = new LineSegment(new CartesianCoordinate(xNew, yNew), new CartesianCoordinate(xNew + 5, yNew + 1));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].I.X);
            Assert.AreEqual(yOld, boundary[index].I.Y);
            Assert.AreNotEqual(xNew, boundary[index].I.X);
            Assert.AreNotEqual(yNew, boundary[index].I.Y);
        }

        [Test]
        public static void Initialization_with_Segments_List_Results_in_Object_with_Immutable_Segments_Properties_List()
        {
            int index = 1;
            double xOld = 1;
            double yOld = 2;

            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(xOld,yOld),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.IsTrue(boundary.IsReadOnly);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].I.X);
            Assert.AreEqual(yOld, boundary[index].I.Y);

            // Alter existing coordinates to passed in reference to prove immutable
            double xNew = 7;
            double yNew = 8;
            segments[1] = new LineSegment(new CartesianCoordinate(xNew, yNew), new CartesianCoordinate(xNew + 5, yNew + 1));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].I.X);
            Assert.AreEqual(yOld, boundary[index].I.Y);
            Assert.AreNotEqual(xNew, boundary[index].I.X);
            Assert.AreNotEqual(yNew, boundary[index].I.Y);

            // Add new coordinate to passed in reference to prove immutable
            segments.Add(new LineSegment(new CartesianCoordinate(xNew, yNew), new CartesianCoordinate(xNew + 5, yNew + 1)));
            Assert.AreEqual(3, boundary.Count);
        }

        [Test]
        public static void Changing_Tolerance_Cascades_to_Properties()
        {
            double defaultTolerance = 10E-6;
            CartesianCoordinate[] coordinates = new CartesianCoordinate[4];
            coordinates[0] = new CartesianCoordinate(0, 0);
            coordinates[1] = new CartesianCoordinate(1, 2);
            coordinates[2] = new CartesianCoordinate(3, 4);
            coordinates[3] = new CartesianCoordinate(5, 6);

            LineSegment[] segments = new LineSegment[3];
            segments[0] = new LineSegment(coordinates[0], coordinates[1]);
            segments[1] = new LineSegment(coordinates[1], coordinates[2]);
            segments[2] = new LineSegment(coordinates[2], coordinates[3]);

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(defaultTolerance, boundary.Tolerance);
            Assert.AreEqual(defaultTolerance, boundary[0].Tolerance);
            Assert.AreEqual(defaultTolerance, boundary[1].Tolerance);
            Assert.AreEqual(defaultTolerance, boundary[2].Tolerance);

            double newTolerance = 10E-3;
            boundary.Tolerance = newTolerance;

            Assert.AreEqual(newTolerance, boundary.Tolerance);
            Assert.AreEqual(newTolerance, boundary[0].Tolerance);
            Assert.AreEqual(newTolerance, boundary[1].Tolerance);
            Assert.AreEqual(newTolerance, boundary[2].Tolerance);
        }
        #endregion

        #region Methods: Query
        [Test]
        public static void FirstPoint()
        {
            CartesianCoordinate firstCoordinate = new CartesianCoordinate(1, 1);
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                firstCoordinate,
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(firstCoordinate, boundary.FirstPoint());
        }

        [Test]
        public static void LastPoint()
        {
            CartesianCoordinate lastCoordinate = new CartesianCoordinate(5, 6);
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                lastCoordinate};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(lastCoordinate, boundary.LastPoint());
        }

        [Test]
        public static void FirstSegment()
        {
            CartesianCoordinate firstCoordinate = new CartesianCoordinate(1, 1);
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                firstCoordinate,
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(segments[0], boundary.FirstSegment());
        }

        [Test]
        public static void LastSegment()
        {
            CartesianCoordinate lastCoordinate = new CartesianCoordinate(5, 6);
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                lastCoordinate};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(segments[2], boundary.LastSegment());
        }

        [Test]
        public static void AdjacentSegmentsAt__Returns_Segments_Sharing_Common_Point_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Tuple<IPathSegment, IPathSegment> segmentPair = boundary.AdjacentSegmentsAt(3);
            Assert.AreEqual(segments[2], segmentPair.Item1);
            Assert.AreEqual(segments[3], segmentPair.Item2);
        }

        [Test]
        public static void AdjacentSegmentsAt__Throws_Exception_for_Index_Out_of_Range()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.Throws<IndexOutOfRangeException>(() => boundary.AdjacentSegmentsAt(-1));
            Assert.Throws<IndexOutOfRangeException>(() => boundary.AdjacentSegmentsAt(7));
        }

        // No segments
        [Test]
        public static void AdjacentSegments_at_Included_Point_Returns_Segments_Sharing_Common_Point()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Tuple<IPathSegment, IPathSegment> segmentPair = boundary.AdjacentSegments(coordinates[3]);
            Assert.AreEqual(segments[2], segmentPair.Item1);
            Assert.AreEqual(segments[3], segmentPair.Item2);
        }

        [Test]
        public static void AdjacentSegments_at_First_Point_Returns_Null_and_First_Segment()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Tuple<IPathSegment, IPathSegment> segmentPair = boundary.AdjacentSegments(coordinates[0]);
            Assert.IsNull(segmentPair.Item1);
            Assert.AreEqual(segments[0], segmentPair.Item2);
        }

        [Test]
        public static void AdjacentSegments_at_Last_Point_Returns_Last_Segment_and_Null()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Tuple<IPathSegment, IPathSegment> segmentPair = boundary.AdjacentSegments(coordinates[6]);
            Assert.AreEqual(segments[5], segmentPair.Item1);
            Assert.IsNull(segmentPair.Item2);
        }

        [Test]
        public static void AdjacentSegments_at_Not_Included_Point_Returns_Null_Null()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Tuple<IPathSegment, IPathSegment> segmentPair = boundary.AdjacentSegments(new CartesianCoordinate(13, 14));
            Assert.IsNull(segmentPair.Item1);
            Assert.IsNull(segmentPair.Item2);
        }

        [Test]
        public static void PointBoundary_Returns_PointBoundary_of_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.IsTrue(boundary.IsReadOnly);
            Assert.AreEqual(3, boundary.Count);

            PointBoundary pointBoundary = boundary.PointBoundary() as PointBoundary;
            Assert.IsTrue(pointBoundary.IsReadOnly);
            Assert.AreEqual(4, pointBoundary.Count);
            Assert.AreEqual(3, pointBoundary[2].X);
            Assert.AreEqual(4, pointBoundary[2].Y);
        }

        [Test]
        public static void Extents_Returns_Extents_of_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.IsTrue(boundary.IsReadOnly);
            Assert.AreEqual(3, boundary.Count);

            PointExtents extents = boundary.Extents() as PointExtents;
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(0, extents.MinY);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(6, extents.MaxY);
        }
        #endregion

        #region Methods: List
        [Test]
        public static void SegmentsBoundary_Returns_Segment_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            IPathSegment segment = boundary[1];
            Assert.AreEqual(segments[1].I.X, segment.I.X);
            Assert.AreEqual(segments[1].I.Y, segment.I.Y);
        }

        [Test]
        public static void SegmentsBoundary_Throws_ReadOnlyException_if_Changing_Segments_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.Throws<ReadOnlyException>(
                () => boundary[2] = new LineSegment(
                    new CartesianCoordinate(7, 8),
                    new CartesianCoordinate(9, 10)));
        }

        [Test]
        public static void SegmentsBoundary_Throws_IndexOutOfRangeException_when_Accessing_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.Throws<IndexOutOfRangeException>(() => { IPathSegment segment = boundary[3]; });
        }

        [Test]
        public static void Clear_Clears_Segments_from_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);
            Assert.AreEqual(3, boundary.Count);

            boundary.Clear();
            Assert.AreEqual(0, boundary.Count);
        }

        [Test]
        public static void AddFirst_Adds_Segment_to_Beginning_of_Boundary_if_Valid()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            SegmentsBoundary boundary = new SegmentsBoundary();

            // Add first segment
            LineSegment firstSegment = new LineSegment(coordinates[2], coordinates[3]);
            Assert.IsTrue(boundary.AddFirst(firstSegment));
            Assert.AreEqual(1, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);

            // Add second segment
            LineSegment secondSegment = new LineSegment(coordinates[1], coordinates[2]);
            Assert.IsTrue(boundary.AddFirst(secondSegment));
            Assert.AreEqual(2, boundary.Count);
            Assert.AreEqual(secondSegment, boundary[0]);
            Assert.AreEqual(firstSegment, boundary[1]);

            // Add third segment
            LineSegment thirdSegment = new LineSegment(coordinates[0], coordinates[1]);
            Assert.IsTrue(boundary.AddFirst(thirdSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(thirdSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(firstSegment, boundary[2]);

            // Add contiguous reversed direction segment
            LineSegment continguousReversedSegment = new LineSegment(new CartesianCoordinate(0, 0), new CartesianCoordinate(-1, -2));
            Assert.IsFalse(boundary.AddFirst(continguousReversedSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(thirdSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(firstSegment, boundary[2]);

            // Add duplicate segment
            LineSegment duplicateSegment = new LineSegment(coordinates[0], coordinates[1]);
            Assert.IsFalse(boundary.AddFirst(duplicateSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(thirdSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(firstSegment, boundary[2]);

            // Add non-contiguous segment
            LineSegment noncontinguousSegment = new LineSegment(new CartesianCoordinate(9, 10), new CartesianCoordinate(11, 12));
            Assert.IsFalse(boundary.AddFirst(noncontinguousSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(thirdSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(firstSegment, boundary[2]);
        }

        [Test]
        public static void AddLast_Adds_Segment_to_End_of_Boundary_if_Valid()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            SegmentsBoundary boundary = new SegmentsBoundary();

            // Add first segment
            LineSegment firstSegment = new LineSegment(coordinates[0], coordinates[1]);
            Assert.IsTrue(boundary.AddLast(firstSegment));
            Assert.AreEqual(1, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);

            // Add second segment
            LineSegment secondSegment = new LineSegment(coordinates[1], coordinates[2]);
            Assert.IsTrue(boundary.AddLast(secondSegment));
            Assert.AreEqual(2, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);

            // Add third segment
            LineSegment thirdSegment = new LineSegment(coordinates[2], coordinates[3]);
            Assert.IsTrue(boundary.AddLast(thirdSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(thirdSegment, boundary[2]);

            // Add contiguous reversed direction segment
            LineSegment continguousReversedSegment = new LineSegment(new CartesianCoordinate(7, 8), new CartesianCoordinate(5, 6));
            Assert.IsFalse(boundary.AddLast(continguousReversedSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(thirdSegment, boundary[2]);

            // Add duplicate segment
            LineSegment duplicateSegment = new LineSegment(coordinates[2], coordinates[3]);
            Assert.IsFalse(boundary.AddLast(duplicateSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(thirdSegment, boundary[2]);

            // Add non-contiguous segment
            LineSegment noncontinguousSegment = new LineSegment(new CartesianCoordinate(9, 10), new CartesianCoordinate(11, 12));
            Assert.IsFalse(boundary.AddLast(noncontinguousSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(firstSegment, boundary[0]);
            Assert.AreEqual(secondSegment, boundary[1]);
            Assert.AreEqual(thirdSegment, boundary[2]);
        }

        [Test]
        public static void RemoveFirst_Removes_First_Segment()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(segments[0], boundary[0]);
            Assert.AreEqual(segments[1], boundary[1]);
            Assert.AreEqual(segments[2], boundary[2]);

            Assert.IsTrue(boundary.RemoveFirst());
            Assert.AreEqual(2, boundary.Count);
            Assert.AreEqual(segments[1], boundary[0]);
            Assert.AreEqual(segments[2], boundary[1]);

            Assert.IsTrue(boundary.RemoveFirst());
            Assert.AreEqual(1, boundary.Count);
            Assert.AreEqual(segments[2], boundary[0]);

            Assert.IsTrue(boundary.RemoveFirst());
            Assert.AreEqual(0, boundary.Count);

            Assert.Throws<IndexOutOfRangeException>(() => boundary.RemoveFirst());
        }

        [Test]
        public static void RemoveFirst_Throws_Index_Out_of_Range_Exception_if_Boundary_Empty()
        {
            SegmentsBoundary boundary = new SegmentsBoundary();

            Assert.Throws<IndexOutOfRangeException>(() => boundary.RemoveFirst());
        }

        [Test]
        public static void RemoveLast_Removes_Last_Segment()
        {

            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(segments[0], boundary[0]);
            Assert.AreEqual(segments[1], boundary[1]);
            Assert.AreEqual(segments[2], boundary[2]);

            Assert.IsTrue(boundary.RemoveLast());
            Assert.AreEqual(2, boundary.Count);
            Assert.AreEqual(segments[0], boundary[0]);
            Assert.AreEqual(segments[1], boundary[1]);

            Assert.IsTrue(boundary.RemoveLast());
            Assert.AreEqual(1, boundary.Count);
            Assert.AreEqual(segments[0], boundary[0]);

            Assert.IsTrue(boundary.RemoveLast());
            Assert.AreEqual(0, boundary.Count);

            Assert.Throws<IndexOutOfRangeException>(() => boundary.RemoveLast());
        }

        [Test]
        public static void RemoveLast_Throws_Index_Out_of_Range_Exception_if_Boundary_Empty()
        {

            SegmentsBoundary boundary = new SegmentsBoundary();

            Assert.Throws<IndexOutOfRangeException>(() => boundary.RemoveLast());
        }

        [Test]
        public static void Replace_Replaces_Segment_if_Present()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)
            };

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(1, boundary[1].I.X);
            Assert.AreEqual(2, boundary[1].I.Y);

            // Replaces existing segment
            IPathSegment newSegment = new LineSegment(coordinates[2], coordinates[3]);
            Assert.IsTrue(boundary.Replace(segments[2], newSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(1, boundary[1].I.X);
            Assert.AreEqual(2, boundary[1].I.Y);

            // Does not replace non-existing segment
            IPathSegment newInvalidSegment = new LineSegment(
                new CartesianCoordinate(5, 6),
                new CartesianCoordinate(7, 8));
            Assert.IsFalse(boundary.Replace(segments[2], newInvalidSegment));
            Assert.IsFalse(boundary.Replace(newInvalidSegment, segments[2]));
            Assert.AreEqual(3, boundary.Count);
            Assert.IsFalse(boundary.Contains(newInvalidSegment));
        }

        [Test]
        public static void ReplaceAt_Replaces_Segment_at_Specified_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)
            };

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(1, boundary[1].I.X);
            Assert.AreEqual(2, boundary[1].I.Y);

            IPathSegment newSegment = new LineSegment(coordinates[2], coordinates[3]);
            Assert.IsTrue(boundary.ReplaceAt(2, newSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(newSegment.I.X, boundary[2].I.X);
            Assert.AreEqual(newSegment.I.Y, boundary[2].I.Y);

            IPathSegment newInvalidSegment = new LineSegment(coordinates[1], coordinates[2]);
            Assert.IsFalse(boundary.ReplaceAt(2, newInvalidSegment));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreNotEqual(newInvalidSegment.I.X, boundary[2].I.X);
            Assert.AreNotEqual(newInvalidSegment.I.Y, boundary[2].I.Y);
        }

        [Test]
        public static void ReplaceAt_Throws_Index_Out_of_Range_Exception_for_Segment_at_Out_of_Range_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)
            };

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.AreEqual(3, boundary.Count);

            IPathSegment newSegment = new LineSegment(coordinates[2], coordinates[3]);
            Assert.Throws<IndexOutOfRangeException>(() => boundary.ReplaceAt(4, newSegment));
        }

        [Test]
        public static void Adding_Many_Segments_Resizes_Array()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6),
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10),
                new CartesianCoordinate(11,12),
                new CartesianCoordinate(13,14),
                new CartesianCoordinate(15,16),
                new CartesianCoordinate(17,18)
            };

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3]),
                new LineSegment(coordinates[3], coordinates[4]),
                new LineSegment(coordinates[4], coordinates[5]),
                new LineSegment(coordinates[5], coordinates[6]),
                new LineSegment(coordinates[6], coordinates[7]),
                new LineSegment(coordinates[7], coordinates[8]),
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);
            LineSegment segmentTriggersArrayResize = new LineSegment(coordinates[8], coordinates[9]);

            Assert.IsTrue(boundary.AddLast(segmentTriggersArrayResize));
            Assert.AreEqual(9, boundary.Count);
        }

        [Test]
        public static void IndexOf_Returns_Index_of_Segment_if_Present()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)
            };

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            // Present segment
            Assert.AreEqual(1, boundary.IndexOf(new LineSegment(coordinates[1], coordinates[2])));

            // Non-present segment
            Assert.AreEqual(-1, boundary.IndexOf(new LineSegment(
                    new CartesianCoordinate(5, 6),
                    new CartesianCoordinate(7, 8))));
        }

        [Test]
        public static void Contains_Returns_True_or_False_Indicating_Presence_of_Segment()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(1,1),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)
            };

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            Assert.IsTrue(boundary.Contains(new LineSegment(coordinates[1], coordinates[2])));
            Assert.IsFalse(boundary.Contains(
                new LineSegment(
                    new CartesianCoordinate(5, 6),
                    new CartesianCoordinate(7, 8))));
        }

        [Test]
        public static void CopyTo_Copies_Segment_to_Array()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(1, boundary[1].I.X);
            Assert.AreEqual(2, boundary[1].I.Y);

            IPathSegment[] newSegments = new IPathSegment[5];
            newSegments[0] = new LineSegment(
                new CartesianCoordinate(7, 8),
                new CartesianCoordinate(9, 10));

            boundary.CopyTo(newSegments, 1);
            Assert.AreEqual(5, newSegments.Length);
            Assert.AreEqual(7, newSegments[0].I.X);
            Assert.AreEqual(8, newSegments[0].I.Y);
            Assert.AreEqual(0, newSegments[1].I.X);
            Assert.AreEqual(0, newSegments[1].I.Y);
            Assert.AreEqual(3, newSegments[3].I.X);
            Assert.AreEqual(4, newSegments[3].I.Y);
        }
        #endregion

        #region Methods: Enumerator
        [Test]
        public static void Enumerator_Enumerates_Over_Segments()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            int index = 0;
            foreach (IPathSegment segment in boundary)
            {
                Assert.AreEqual(segments[index], segment);
                index++;
            }
        }

        [Test]
        public static void GetEnumerator_Allows_Enumeration_Over_Segments()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            IEnumerator enumerator = boundary.GetEnumerator();
            enumerator.MoveNext();
            Assert.AreEqual(segments[0], enumerator.Current);
            enumerator.MoveNext();
            Assert.AreEqual(segments[1], enumerator.Current);
            enumerator.MoveNext();
            Assert.AreEqual(segments[2], enumerator.Current);

            enumerator.Reset();
            enumerator.MoveNext();
            Assert.AreEqual(segments[0], enumerator.Current);
        }

        [Test]
        public static void GetEnumerator_Current_Throws_Invalid_Operation_Exception_if_Not_Initialized()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            IEnumerator enumerator = boundary.GetEnumerator();
            Assert.Throws<InvalidOperationException>(() => { var item = enumerator.Current; });
        }

        [Test]
        public static void GetEnumerator_Current_Throws_Invalid_Operation_Exception_if_Moved_Beyond_Max_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            List<LineSegment> segments = new List<LineSegment>()
            {
                new LineSegment(coordinates[0], coordinates[1]),
                new LineSegment(coordinates[1], coordinates[2]),
                new LineSegment(coordinates[2], coordinates[3])
            };

            SegmentsBoundary boundary = new SegmentsBoundary(segments);

            IEnumerator enumerator = boundary.GetEnumerator();
            enumerator.MoveNext();
            enumerator.MoveNext();
            enumerator.MoveNext();
            enumerator.MoveNext();
            Assert.Throws<InvalidOperationException>(() => { var item = enumerator.Current; });
        }
        #endregion
    }
}