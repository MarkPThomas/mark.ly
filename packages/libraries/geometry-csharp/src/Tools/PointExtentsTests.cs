using System;
using System.Collections.Generic;
using MPT.Geometry.Tools;
using MPT.Math;
using MPT.Math.Coordinates;
using NUnit.Framework;


namespace MPT.Geometry.UnitTests.Tools
{
    [TestFixture]
    public class PointExtentsTests
    {
        public static double Tolerance = 0.00001;

        #region Initialization
        [Test]
        public static void Initialization_without_Coordinates_Results_in_Empty_Object()
        {
            PointExtents extents = new PointExtents();

            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);
        }

        [Test]
        public static void Initialization_with_2_Coordinates_Results_Object()
        {
            PointExtents extents = new PointExtents(
                    new CartesianCoordinate(1, 2),
                    new CartesianCoordinate(3, 5)
                );

            Assert.AreEqual(1, extents.MinX);
            Assert.AreEqual(3, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(5, extents.MaxY);
            Assert.AreEqual(2, extents.Width);
            Assert.AreEqual(3, extents.Height);
        }

        [Test]
        public static void Initialization_with_Empty_Coordinates_List()
        {
            PointExtents extents = new PointExtents(new List<CartesianCoordinate>());

            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);
        }

        [Test]
        public static void Initialization_with_1_Empty_Coordinate()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                    new CartesianCoordinate()
                });

            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);
        }

        [Test]
        public static void Initialization_with_1_Coordinate_List()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                    new CartesianCoordinate(1, 2)
                }) ;

            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);
        }

        [Test]
        public static void Initialization_with_2_Collinear_Coordinates_Horizontal_List()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                    new CartesianCoordinate(1, 2),
                    new CartesianCoordinate(2, 2)
                });

            Assert.AreEqual(1, extents.MinX);
            Assert.AreEqual(2, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(2, extents.MaxY);
            Assert.AreEqual(1, extents.Width);
            Assert.AreEqual(0, extents.Height);
        }

        [Test]
        public static void Initialization_with_2_Collinear_Coordinates_Vertical_List()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                    new CartesianCoordinate(1, 2),
                    new CartesianCoordinate(1, 5)
                });

            Assert.AreEqual(1, extents.MinX);
            Assert.AreEqual(1, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(5, extents.MaxY);
            Assert.AreEqual(0, extents.Width);
            Assert.AreEqual(3, extents.Height);
        }

        [Test]
        public static void Initialization_with_2_Coordinates_List()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                    new CartesianCoordinate(1, 2),
                    new CartesianCoordinate(3, 5)
                });

            Assert.AreEqual(1, extents.MinX);
            Assert.AreEqual(3, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(5, extents.MaxY);
            Assert.AreEqual(2, extents.Width);
            Assert.AreEqual(3, extents.Height);
        }

        [Test]
        public static void Initialization_with_Multiple_Coordinates_List()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                }
                );

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);
        }
        #endregion

        #region Methods: Public
        [Test]
        public static void Add_Updates_Extents_Boundaries_if_Point_Lies_Outside_Current_Extents()
        {
            PointExtents extents = new PointExtents();

            // Empty
            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);

            // First Point
            extents.Add(new CartesianCoordinate(1, 2));
            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);

            // Second Point
            extents.Add(new CartesianCoordinate(3, 5));
            Assert.AreEqual(1, extents.MinX);
            Assert.AreEqual(3, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(5, extents.MaxY);
            Assert.AreEqual(2, extents.Width);
            Assert.AreEqual(3, extents.Height);

            // Third Point
            extents.Add(new CartesianCoordinate(2, 6));
            Assert.AreEqual(1, extents.MinX);
            Assert.AreEqual(3, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(6, extents.MaxY);
            Assert.AreEqual(2, extents.Width);
            Assert.AreEqual(4, extents.Height);

            // Point Beyond Min X
            extents.Add(new CartesianCoordinate(0, 4));
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(3, extents.MaxX);
            Assert.AreEqual(2, extents.MinY);
            Assert.AreEqual(6, extents.MaxY);
            Assert.AreEqual(3, extents.Width);
            Assert.AreEqual(4, extents.Height);

            // Point Beyond Min Y
            extents.Add(new CartesianCoordinate(1.5, -2));
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(3, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(6, extents.MaxY);
            Assert.AreEqual(3, extents.Width);
            Assert.AreEqual(8, extents.Height);

            // Point Beyond Max X
            extents.Add(new CartesianCoordinate(5, 4));
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(6, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(8, extents.Height);

            // Point Beyond Max Y
            extents.Add(new CartesianCoordinate(1, 7));
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            // Point Inside
            extents.Add(new CartesianCoordinate(3.5, -1));
            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);
        }

        [Test]
        public static void AddRange_Updates_Extents_Boundaries_for_Any_Point_that_Lies_Outside_Current_Extents()
        {
            PointExtents extents = new PointExtents();
            extents.AddRange(new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

        }

        [Test]
        public static void AddExtents_Updates_Extents_Boundaries_if_Provided_Extents_Extends_Outside_Current_Extents()
        {
            PointExtents extents1 = new PointExtents(
                 new List<CartesianCoordinate>()
                 {
                    new CartesianCoordinate(1, 2),
                    new CartesianCoordinate(3, 5),
                    new CartesianCoordinate(2, 6),
                    new CartesianCoordinate(0, 4),
                    new CartesianCoordinate(1.5, -2)
                 });
            Assert.AreEqual(0, extents1.MinX);
            Assert.AreEqual(3, extents1.MaxX);
            Assert.AreEqual(-2, extents1.MinY);
            Assert.AreEqual(6, extents1.MaxY);
            Assert.AreEqual(3, extents1.Width);
            Assert.AreEqual(8, extents1.Height);

            PointExtents extents2 = new PointExtents(
                 new List<CartesianCoordinate>()
                 {
                    new CartesianCoordinate(1.5, -2),
                    new CartesianCoordinate(5, 4),
                    new CartesianCoordinate(1, 7),
                    new CartesianCoordinate(3.5, -1)
                 });
            Assert.AreEqual(1, extents2.MinX);
            Assert.AreEqual(5, extents2.MaxX);
            Assert.AreEqual(-2, extents2.MinY);
            Assert.AreEqual(7, extents2.MaxY);
            Assert.AreEqual(4, extents2.Width);
            Assert.AreEqual(9, extents2.Height);

            extents1.AddExtents(extents2);
            Assert.AreEqual(0, extents1.MinX);
            Assert.AreEqual(5, extents1.MaxX);
            Assert.AreEqual(-2, extents1.MinY);
            Assert.AreEqual(7, extents1.MaxY);
            Assert.AreEqual(5, extents1.Width);
            Assert.AreEqual(9, extents1.Height);

            PointExtents extents3 = new PointExtents(
                 new List<CartesianCoordinate>()
                 {
                    new CartesianCoordinate(-1, -2),
                    new CartesianCoordinate(1, 1),
                    new CartesianCoordinate(1, -7)
                 });
            Assert.AreEqual(-1, extents3.MinX);
            Assert.AreEqual(1, extents3.MaxX);
            Assert.AreEqual(-7, extents3.MinY);
            Assert.AreEqual(1, extents3.MaxY);
            Assert.AreEqual(2, extents3.Width);
            Assert.AreEqual(8, extents3.Height);

            extents1.AddExtents(extents3);
            Assert.AreEqual(-1, extents1.MinX);
            Assert.AreEqual(5, extents1.MaxX);
            Assert.AreEqual(-7, extents1.MinY);
            Assert.AreEqual(7, extents1.MaxY);
            Assert.AreEqual(6, extents1.Width);
            Assert.AreEqual(14, extents1.Height);
        }

        [Test]
        public static void Clear_Clears_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            extents.Clear();
            Assert.AreEqual(double.NegativeInfinity, extents.MinX);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
            Assert.AreEqual(double.NegativeInfinity, extents.MinY);
            Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
            Assert.AreEqual(double.PositiveInfinity, extents.Width);
            Assert.AreEqual(double.PositiveInfinity, extents.Height);
        }

        // TODO: Test adding with new limits?
        //[Test]
        //public static void Clear_with_ResetLimits_Clears_Extents_and_Resets_Limits()
        //{
        //    PointExtents extents = new PointExtents(
        //        new List<CartesianCoordinate>()
        //        {
        //        new CartesianCoordinate(1, 2),
        //        new CartesianCoordinate(3, 5),
        //        new CartesianCoordinate(2, 6),
        //        new CartesianCoordinate(0, 4),
        //        new CartesianCoordinate(1.5, -2),
        //        new CartesianCoordinate(5, 4),
        //        new CartesianCoordinate(1, 7),
        //        new CartesianCoordinate(3.5, -1)
        //        });

        //    Assert.AreEqual(0, extents.MinX);
        //    Assert.AreEqual(5, extents.MaxX);
        //    Assert.AreEqual(-2, extents.MinY);
        //    Assert.AreEqual(7, extents.MaxY);
        //    Assert.AreEqual(5, extents.Width);
        //    Assert.AreEqual(9, extents.Height);

        //    extents.Clear();
        //    Assert.AreEqual(double.NegativeInfinity, extents.MinX);
        //    Assert.AreEqual(double.PositiveInfinity, extents.MaxX);
        //    Assert.AreEqual(double.NegativeInfinity, extents.MinY);
        //    Assert.AreEqual(double.PositiveInfinity, extents.MaxY);
        //    Assert.AreEqual(double.PositiveInfinity, extents.Width);
        //    Assert.AreEqual(double.PositiveInfinity, extents.Height);


        //}

        [Test]
        public static void Reset_Resets_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            List<CartesianCoordinate> newList = new List<CartesianCoordinate>()
                 {
                    new CartesianCoordinate(-1, -2),
                    new CartesianCoordinate(1, 1),
                    new CartesianCoordinate(1, -7)
                 };

            extents.Reset(newList);
            Assert.AreEqual(-1, extents.MinX);
            Assert.AreEqual(1, extents.MaxX);
            Assert.AreEqual(-7, extents.MinY);
            Assert.AreEqual(1, extents.MaxY);
            Assert.AreEqual(2, extents.Width);
            Assert.AreEqual(8, extents.Height);
        }

        [Test]
        public static void IsWithinExtents_Returns_True_if_Point_is_within_Extents_False_otherwise()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            CartesianCoordinate coordinateWithinExtents = new CartesianCoordinate(1, 1);
            Assert.IsTrue(extents.IsWithinExtents(coordinateWithinExtents));

            CartesianCoordinate coordinateOutsideExtentsX = new CartesianCoordinate(6, 1);
            Assert.IsFalse(extents.IsWithinExtents(coordinateOutsideExtentsX));

            CartesianCoordinate coordinateOutsideExtentsY = new CartesianCoordinate(1, 8);
            Assert.IsFalse(extents.IsWithinExtents(coordinateOutsideExtentsY));

            CartesianCoordinate coordinateOutsideExtentsXY = new CartesianCoordinate(6, 8);
            Assert.IsFalse(extents.IsWithinExtents(coordinateOutsideExtentsXY));
        }

        [Test]
        public static void Boundary_Returns_Boundary_Cordinates_of_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            IList<CartesianCoordinate> boundary = extents.Boundary();

            Assert.AreEqual(0, boundary[0].X);
            Assert.AreEqual(7, boundary[0].Y);

            Assert.AreEqual(5, boundary[1].X);
            Assert.AreEqual(7, boundary[1].Y);

            Assert.AreEqual(5, boundary[2].X);
            Assert.AreEqual(-2, boundary[2].Y);

            Assert.AreEqual(0, boundary[3].X);
            Assert.AreEqual(-2, boundary[3].Y);
        }

        [Test]
        public static void GeometricCenter_Returns_GeometricCenter_of_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7.5),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7.5, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9.5, extents.Height);

            CartesianCoordinate geometricCenter = extents.GeometricCenter();

            Assert.AreEqual(2.5, geometricCenter.X);
            Assert.AreEqual(2.75, geometricCenter.Y);
        }

        [Test]
        public static void Translate_Returns_Translated_Copy_of_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            PointExtents translatedExtents = extents.Translate(3, 4) as PointExtents;

            Assert.AreEqual(3, translatedExtents.MinX);
            Assert.AreEqual(8, translatedExtents.MaxX);
            Assert.AreEqual(2, translatedExtents.MinY);
            Assert.AreEqual(11, translatedExtents.MaxY);
            Assert.AreEqual(5, translatedExtents.Width);
            Assert.AreEqual(9, translatedExtents.Height);
        }

        [Test]
        public static void Rotate_Returns_Rotated_Copy_of_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            PointExtents rotatedExtents = extents.Rotate(Numbers.PiOver4) as PointExtents;

            Assert.AreEqual(-2.449747, rotatedExtents.MinX, Tolerance);
            Assert.AreEqual(7.449747, rotatedExtents.MaxX, Tolerance);
            Assert.AreEqual(-2.449747, rotatedExtents.MinY, Tolerance);
            Assert.AreEqual(7.449747, rotatedExtents.MaxY, Tolerance);

            rotatedExtents = rotatedExtents.Rotate(1.8 * Numbers.Pi) as PointExtents;

            Assert.AreEqual(-4.413818, rotatedExtents.MinX, Tolerance);
            Assert.AreEqual(9.413818, rotatedExtents.MaxX, Tolerance);
            Assert.AreEqual(-4.413818, rotatedExtents.MinY, Tolerance);
            Assert.AreEqual(9.413818, rotatedExtents.MaxY, Tolerance);
        }
        #endregion

        [Test]
        public static void Clone_Returns_Copy_of_Extents()
        {
            PointExtents extents = new PointExtents(
                new List<CartesianCoordinate>()
                {
                new CartesianCoordinate(1, 2),
                new CartesianCoordinate(3, 5),
                new CartesianCoordinate(2, 6),
                new CartesianCoordinate(0, 4),
                new CartesianCoordinate(1.5, -2),
                new CartesianCoordinate(5, 4),
                new CartesianCoordinate(1, 7),
                new CartesianCoordinate(3.5, -1)
                });

            Assert.AreEqual(0, extents.MinX);
            Assert.AreEqual(5, extents.MaxX);
            Assert.AreEqual(-2, extents.MinY);
            Assert.AreEqual(7, extents.MaxY);
            Assert.AreEqual(5, extents.Width);
            Assert.AreEqual(9, extents.Height);

            PointExtents extentsClone = extents.Clone();

            Assert.AreEqual(0, extentsClone.MinX);
            Assert.AreEqual(5, extentsClone.MaxX);
            Assert.AreEqual(-2, extentsClone.MinY);
            Assert.AreEqual(7, extentsClone.MaxY);
            Assert.AreEqual(5, extentsClone.Width);
            Assert.AreEqual(9, extentsClone.Height);
        }
    }
}