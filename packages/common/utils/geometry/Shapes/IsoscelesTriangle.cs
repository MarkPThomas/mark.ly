// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-28-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="IsoscelesTriangle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;
using System.Collections.Generic;
using MPT.Math;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Any triangle that has two sides of equal length, a, or two angles of equal magnitude, α.
    /// Implements the <see cref="MPT.Geometry.Shapes.Triangle" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Triangle" />
    public class IsoscelesTriangle : Triangle, IDefinedShape
    {
        #region Properties
        /// <summary>
        /// The length of the unequal side.
        /// </summary>
        protected double _sideUnequal;

        /// <summary>
        /// The length of the two equal-length sides.
        /// </summary>
        protected double _sidesEqual;

        /// <summary>
        /// The two angles of equal magnitude, α, which are opposite of the two sides of equal length.
        /// </summary>
        /// <value>The alpha.</value>
        public override Angle AngleA => new Angle(getAlpha(0.5 * _sideUnequal, getHeight()));

        /// <summary>
        /// The angle of differing magnitude, β, which is opposite of the side of unequal length, b.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleB => new Angle(getBeta(0.5 * _sideUnequal, getHeight()));

        /// <summary>
        /// The angle, γ, which is opposite of side c, and is equal in magnitude to angle α.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleC => AngleA;

        /// <summary>
        /// Gets the height, which is measured perpendicular to side b.
        /// </summary>
        /// <value>The h.</value>
        public override double h => getHeight();

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 3 sides of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double InRadius => getInRadius();

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 3 defining points of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double CircumRadius => getCircumRadius();
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="IsoscelesTriangle" /> class.
        /// </summary>
        /// <param name="lengthsEqualA">Length of sides of equal length, a.</param>
        /// <param name="lengthB">The length b, of the base of the triangle. This is the unequal length.</param>
        public IsoscelesTriangle(double lengthsEqualA, double lengthB)
        {
            _sidesEqual = lengthsEqualA.Abs();
            _sideUnequal = lengthB.Abs();
            SetCoordinates(LocalCoordinates());
            setCenterCoordinates();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="IsoscelesTriangle" /> class.
        /// </summary>
        /// <param name="apexCoordinate">The apex coordinate.</param>
        public IsoscelesTriangle(CartesianCoordinate apexCoordinate)
        {
            double alphaRadians = getAlpha(apexCoordinate.X, apexCoordinate.Y);
            _sidesEqual = apexCoordinate.X / Trig.Cos(alphaRadians);
            _sideUnequal = 2 * apexCoordinate.X;
            SetCoordinates(LocalCoordinates());
            setCenterCoordinates();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="IsoscelesTriangle" /> class.
        /// </summary>
        /// <param name="lengthB">The length b, of the base of the triangle. This is the unequal length.</param>
        /// <param name="anglesEqualAlpha">The two angles of equal magnitude, α, which are opposite of the two sides of equal length.</param>
        public IsoscelesTriangle(double lengthB, Angle anglesEqualAlpha)
        {
            _sidesEqual = 0.5 * lengthB / Trig.Cos(anglesEqualAlpha.Radians);
            _sideUnequal = lengthB;
            SetCoordinates(LocalCoordinates());
            setCenterCoordinates();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return 0.25 * _sideUnequal * (4 * _sidesEqual.Squared() - _sideUnequal.Squared()).Sqrt();
        }

        /// <summary>
        /// Length of sides of equal length, a.
        /// </summary>
        /// <value>a.</value>
        public override double SideLengthA() => _sidesEqual;

        /// <summary>
        /// Length of the unequal length side, b.
        /// </summary>
        /// <value>The b.</value>
        public override double SideLengthB() => _sideUnequal;

        /// <summary>
        /// Length of side c, which is equal to side a.
        /// </summary>
        /// <value>The c.</value>
        public override double SideLengthC() => _sidesEqual;

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public virtual IList<CartesianCoordinate> LocalCoordinates()
        {
            return new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(_sideUnequal / 2, getHeight()),
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(_sideUnequal, 0),
            };
        }

        /// <summary>
        /// Gets the alpha angle.
        /// </summary>
        /// <param name="halfBase">Half of the base width.</param>
        /// <param name="height">The height.</param>
        /// <returns>System.Double.</returns>
        private static double getAlpha(double halfBase, double height)
        {
            return Trig.ArcTan(height / halfBase);
        }

        /// <summary>
        /// Gets the beta angle.
        /// </summary>
        /// <param name="halfBase">Half of the base width.</param>
        /// <param name="height">The height.</param>
        /// <returns>System.Double.</returns>
        private static double getBeta(double halfBase, double height)
        {
            return 2 * (Numbers.PiOver2 - getAlpha(halfBase, height));
        }

        /// <summary>
        /// Gets the height, which is the altitude from the apex to the unequal side.
        /// </summary>
        /// <returns>System.Double.</returns>
        protected double getHeight()
        {
            return 0.5 * (4 * _sidesEqual.Squared() - _sideUnequal.Squared()).Sqrt();
        }

        /// <summary>
        /// Gets the in radius.
        /// </summary>
        /// <returns>System.Double.</returns>
        protected double getInRadius()
        {
            return 0.25 * _sideUnequal * ((_sideUnequal.Squared() + 4 * h.Squared()).Sqrt() - _sideUnequal) / h;
        }

        /// <summary>
        /// Gets the circum radius.
        /// </summary>
        /// <returns>System.Double.</returns>
        protected double getCircumRadius()
        {
            return (1d / 8) * (_sideUnequal.Squared() / h + 4 * h);
        }
        #endregion
    }
}