using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using MPT.Geometry.Tools;
using MPT.Math.Coordinates;
using NUnit.Framework;

namespace MPT.Geometry.UnitTests.Tools
{
    [TestFixture]
    public static class PointBoundaryTests
    {
        #region Initialization
        [Test]
        public static void Initialization_without_Coordinates_Results_in_Empty_Object()
        {
            PointBoundary boundary = new PointBoundary();

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, boundary.Tolerance);
            Assert.AreEqual(0, boundary.Count);
            Assert.IsTrue(boundary.IsReadOnly);
        }

        [Test]
        public static void Initialization_with_Coordinates_Array_Results_in_Object_with_Immutable_Coordinates_Properties_List()
        {
            int index = 1;
            double xOld = 1;
            double yOld = 2;

            CartesianCoordinate[] coordinates = new CartesianCoordinate[4];
            coordinates[0] = new CartesianCoordinate(0, 0);
            coordinates[1] = new CartesianCoordinate(xOld,yOld);
            coordinates[2] = new CartesianCoordinate(3,4);
            coordinates[3] = new CartesianCoordinate(5,6);

            double xNew = 7;
            double yNew = 8;

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, boundary.Tolerance);
            Assert.IsTrue(boundary.IsReadOnly);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].X);
            Assert.AreEqual(yOld, boundary[index].Y);

            // Alter existing coordinates to passed in reference to prove immutable
            coordinates[1] = new CartesianCoordinate(xNew, yNew);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].X);
            Assert.AreEqual(yOld, boundary[index].Y);
            Assert.AreNotEqual(xNew, boundary[index].X);
            Assert.AreNotEqual(yNew, boundary[index].Y);
        }

        [Test]
        public static void Initialization_with_Coordinates_List_Results_in_Object_with_Immutable_Coordinates_Properties_List()
        {
            int index = 1;
            double xOld = 1;
            double yOld = 2;

            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(xOld,yOld),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            double xNew = 7;
            double yNew = 8;

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.AreEqual(GeometryLibrary.ZeroTolerance, boundary.Tolerance);
            Assert.IsTrue(boundary.IsReadOnly);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].X);
            Assert.AreEqual(yOld, boundary[index].Y);

            // Alter existing coordinates to passed in reference to prove immutable
            coordinates[1] = new CartesianCoordinate(xNew, yNew);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(xOld, boundary[index].X);
            Assert.AreEqual(yOld, boundary[index].Y);
            Assert.AreNotEqual(xNew, boundary[index].X);
            Assert.AreNotEqual(yNew, boundary[index].Y);

            // Add new coordinate to passed in reference to prove immutable
            coordinates.Add(new CartesianCoordinate(xNew, yNew));
            Assert.AreEqual(4, boundary.Count);
        }
        #endregion

        #region Methods: Public
        [Test]
        public static void Extents_Returns_Extends_of_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            PointExtents extents = boundary.Extents() as PointExtents;
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(0, extents.MinY);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(6, extents.MaxY);
        }


        [Test]
        public static void FirstCoordinate()
        {
            CartesianCoordinate firstCoordinate = new CartesianCoordinate(1, 1);
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                firstCoordinate,
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.AreEqual(firstCoordinate, boundary.FirstCoordinate());
        }

        [Test]
        public static void LastCoordinate()
        {
            CartesianCoordinate lastCoordinate = new CartesianCoordinate(5, 6);
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                lastCoordinate};

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.AreEqual(lastCoordinate, boundary.LastCoordinate());
        }
        #endregion

        #region Methods: List
        [Test]
        public static void PointBoundary_Returns_Coordinate_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(-5, -5),
                new CartesianCoordinate(6, -5),
                new CartesianCoordinate(4, 5),
                new CartesianCoordinate(-5, 5),
                new CartesianCoordinate(-5, 2)
            };

            PointBoundary boundary = new PointBoundary(coordinates);
            CartesianCoordinate coordinate = boundary[1];
            Assert.AreEqual(6, coordinate.X);
            Assert.AreEqual(-5, coordinate.Y);
        }

        [Test]
        public static void PointBoundary_Throws_ReadOnlyException_if_Changing_Coordinate_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.Throws<ReadOnlyException>(() => boundary[2] = new CartesianCoordinate(7, 8));
        }

        [Test]
        public static void PointBoundary_Throws_IndexOutOfRangeException_when_Accessing_by_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.Throws<IndexOutOfRangeException>(() => { CartesianCoordinate coordinate = boundary[4]; });
        }

        [Test]
        public static void Clear_Clears_Coordinates_from_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);

            boundary.Clear();
            Assert.AreEqual(0, boundary.Count);
        }

        [Test]
        public static void Reset_Resets_Coordinates_in_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            List<CartesianCoordinate> coordinatesReset = new List<CartesianCoordinate>(){
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10)};

            boundary.Reset(coordinatesReset);
            Assert.AreEqual(2, boundary.Count);
            Assert.AreEqual(9, boundary[1].X);
            Assert.AreEqual(10, boundary[1].Y);
        }

        [Test]
        public static void Add_Adds_Coordinate_to_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);

            CartesianCoordinate newCoordinate = new CartesianCoordinate(7, 8);
            boundary.Add(newCoordinate);

            Assert.AreEqual(5, boundary.Count);
            Assert.AreEqual(newCoordinate.X, boundary[4].X);
            Assert.AreEqual(newCoordinate.Y, boundary[4].Y);
        }

        [Test]
        public static void AddRange_Adds_Coordinates_to_Boundary()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);

            List<CartesianCoordinate> coordinatesAdded = new List<CartesianCoordinate>(){
                new CartesianCoordinate(7,8),
                new CartesianCoordinate(9,10)};

            boundary.AddRange(coordinatesAdded);
            Assert.AreEqual(6, boundary.Count);
            Assert.AreEqual(7, boundary[4].X);
            Assert.AreEqual(8, boundary[4].Y);
            Assert.AreEqual(9, boundary[5].X);
            Assert.AreEqual(10, boundary[5].Y);
        }

        [Test]
        public static void Remove_Removes_Coordinate_from_Boundary_if_Present()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            // Existing coordinate
            Assert.IsTrue(boundary.Remove(new CartesianCoordinate(1, 2)));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(3, boundary[1].X);
            Assert.AreEqual(4, boundary[1].Y);

            // Non-existing coordinate
            Assert.IsFalse(boundary.Remove(new CartesianCoordinate(7, 8)));
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(3, boundary[1].X);
            Assert.AreEqual(4, boundary[1].Y);
        }

        [Test]
        public static void RemoveRange_Removes_Coordinates_from_Boundary_if_Present()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            List<CartesianCoordinate> coordinatesRemove = new List<CartesianCoordinate>(){
                new CartesianCoordinate(1,2),  // Existing coordinate
                new CartesianCoordinate(7,8)}; // Non-existing coordinate

            boundary.RemoveRange(coordinatesRemove);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(3, boundary[1].X);
            Assert.AreEqual(4, boundary[1].Y);
        }

        [Test]
        public static void RemoveAt_Removes_Coordinate_of_Specified_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            boundary.RemoveAt(1);
            Assert.AreEqual(3, boundary.Count);
            Assert.AreEqual(3, boundary[1].X);
            Assert.AreEqual(4, boundary[1].Y);
        }
        [Test]
        public static void RemoveAt_Throws_Index_Out_of_Range_Exception_for_Out_Of_Range_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            Assert.Throws<IndexOutOfRangeException>(() => boundary.RemoveAt(4));
        }

        [Test]
        public static void Insert_Inserts_Coordinate_at_Specified_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(3, boundary[2].X);
            Assert.AreEqual(4, boundary[2].Y);

            CartesianCoordinate newCoordinate = new CartesianCoordinate(7, 8);
            boundary.Insert(2, newCoordinate);
            Assert.AreEqual(5, boundary.Count);
            Assert.AreEqual(newCoordinate.X, boundary[2].X);
            Assert.AreEqual(newCoordinate.Y, boundary[2].Y);
        }

        [Test]
        public static void Insert_Throws_Index_Out_of_Range_Exception_for_Out_of_Range_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.Throws<IndexOutOfRangeException>(() => boundary.Insert(4, new CartesianCoordinate(7, 8)));
        }

        [Test]
        public static void InsertRange_Inserts_Coordinates_at_Specified_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            List<CartesianCoordinate> newCoordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(7, 8),
                new CartesianCoordinate(9, 10),
                new CartesianCoordinate(11, 12)
            };

            boundary.InsertRange(1, newCoordinates);
            Assert.AreEqual(7, boundary.Count);
            Assert.AreEqual(7, boundary[1].X);
            Assert.AreEqual(8, boundary[1].Y);
            Assert.AreEqual(9, boundary[2].X);
            Assert.AreEqual(10, boundary[2].Y);
            Assert.AreEqual(11, boundary[3].X);
            Assert.AreEqual(12, boundary[3].Y);
            Assert.AreEqual(1, boundary[4].X);
            Assert.AreEqual(2, boundary[4].Y);
        }

        [Test]
        public static void InsertRange_Throws_Index_Out_of_Range_Exception_for_Out_of_Range_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            List<CartesianCoordinate> newCoordinates = new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(7, 8),
                new CartesianCoordinate(9, 10),
                new CartesianCoordinate(11, 12)
            };

            Assert.Throws<IndexOutOfRangeException>(() => boundary.InsertRange(4, newCoordinates));
        }

        [Test]
        public static void Replace_Replaces_Coordinate_if_Present()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            // Replaces existing coordinate
            boundary.Replace(new CartesianCoordinate(1, 2), new CartesianCoordinate(7, 8));
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(7, boundary[1].X);
            Assert.AreEqual(8, boundary[1].Y);

            // Does not replace non-existing coordinate
            boundary.Replace(new CartesianCoordinate(9, 10), new CartesianCoordinate(11, 12));
            Assert.AreEqual(4, boundary.Count);
            Assert.IsFalse(boundary.Contains(new CartesianCoordinate(11, 12)));
        }

        [Test]
        public static void ReplaceAt_Replaces_Coordinate_at_Specified_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(3, boundary[2].X);
            Assert.AreEqual(4, boundary[2].Y);

            CartesianCoordinate newCoordinate = new CartesianCoordinate(7, 8);
            boundary.ReplaceAt(2, newCoordinate);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(newCoordinate.X, boundary[2].X);
            Assert.AreEqual(newCoordinate.Y, boundary[2].Y);
        }

        [Test]
        public static void ReplaceAt_Throws_Index_Out_of_Range_Exception_for_Coordinate_at_Out_of_Range_Index()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);

            CartesianCoordinate newCoordinate = new CartesianCoordinate(7, 8);
            Assert.Throws<IndexOutOfRangeException>(() => boundary.ReplaceAt(4, newCoordinate));
        }

        [Test]
        public static void IndexOf_Returns_Index_of_Coordinate_if_Present()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            // Present coordinate
            Assert.AreEqual(2, boundary.IndexOf(new CartesianCoordinate(3, 4)));

            // Non-present coordinate
            Assert.AreEqual(-1, boundary.IndexOf(new CartesianCoordinate(7, 8)));
        }

        [Test]
        public static void Contains_Returns_True_or_False_Indicating_Presence_of_Coordinate()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(1,1),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            Assert.IsTrue(boundary.Contains(new CartesianCoordinate(3, 4)));
            Assert.IsFalse(boundary.Contains(new CartesianCoordinate(7, 8)));
            Assert.IsFalse(boundary.Contains(new CartesianCoordinate(0, 0)));
        }

        [Test]
        public static void CopyTo_Copies_Coordinates_to_Array()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);
            Assert.AreEqual(4, boundary.Count);
            Assert.AreEqual(1, boundary[1].X);
            Assert.AreEqual(2, boundary[1].Y);

            CartesianCoordinate[] newCoordinates = new CartesianCoordinate[5];
            newCoordinates[0] = new CartesianCoordinate(7, 8);

            boundary.CopyTo(newCoordinates, 1);
            Assert.AreEqual(5, newCoordinates.Length);
            Assert.AreEqual(7, newCoordinates[0].X);
            Assert.AreEqual(8, newCoordinates[0].Y);
            Assert.AreEqual(0, newCoordinates[1].X);
            Assert.AreEqual(0, newCoordinates[1].Y);
            Assert.AreEqual(5, newCoordinates[4].X);
            Assert.AreEqual(6, newCoordinates[4].Y);
        }
        #endregion

        #region Methods: Enumerator
        [Test]
        public static void Enumerator_Enumerates_Over_Coordinates()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            int index = 0;
            foreach (CartesianCoordinate coordinate in boundary)
            {
                Assert.AreEqual(coordinates[index], coordinate);
                index++;
            }
        }

        [Test]
        public static void GetEnumerator_Allows_Enumeration_Over_Coordinates()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

            IEnumerator enumerator = boundary.GetEnumerator();
            enumerator.MoveNext();
            Assert.AreEqual(coordinates[0], enumerator.Current);
            enumerator.MoveNext();
            Assert.AreEqual(coordinates[1], enumerator.Current);
            enumerator.MoveNext();
            Assert.AreEqual(coordinates[2], enumerator.Current);
            enumerator.MoveNext();
            Assert.AreEqual(coordinates[3], enumerator.Current);

            enumerator.Reset();
            enumerator.MoveNext();
            Assert.AreEqual(coordinates[0], enumerator.Current);
        }

        [Test]
        public static void GetEnumerator_Current_Throws_Invalid_Operation_Exception_if_Not_Initialized()
        {
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>(){
                new CartesianCoordinate(0,0),
                new CartesianCoordinate(1,2),
                new CartesianCoordinate(3,4),
                new CartesianCoordinate(5,6)};

            PointBoundary boundary = new PointBoundary(coordinates);

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

            PointBoundary boundary = new PointBoundary(coordinates);

            IEnumerator enumerator = boundary.GetEnumerator();
            enumerator.MoveNext();
            enumerator.MoveNext();
            enumerator.MoveNext();
            enumerator.MoveNext();
            enumerator.MoveNext();
            Assert.Throws<InvalidOperationException>(() => { var item = enumerator.Current; });
        }
        #endregion
    }
}