// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-28-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="RightTriangle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using System.Collections.Generic;
using Numbers = MPT.Math.Numbers;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Any triangle where one of the three angles is 90°.
    /// Implements the <see cref="MPT.Geometry.Shapes.Triangle" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Triangle" />
    public class RightTriangle : Triangle, IDefinedShape
    {
        #region Properties
        /// <summary>
        /// The side length a
        /// </summary>
        private double _sideLengthA;

        /// <summary>
        /// The side length b
        /// </summary>
        private double _sideLengthB;

        /// <summary>
        /// The angle, α, which is opposite of side a.
        /// </summary>
        /// <value>The alpha.</value>
        public override Angle AngleA => new Angle(getBeta(_sideLengthA, _sideLengthB));

        /// <summary>
        /// The angle, β, which is opposite of side b.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleB => new Angle(getAlpha(_sideLengthA, _sideLengthB));

        /// <summary>
        /// The angle, γ, which is opposite of side c and is 90°.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleC => Numbers.PiOver2;

        /// <summary>
        /// Length of segment e, which spans from point a to the perpendicular intersection of h along side c.
        /// </summary>
        /// <value>The e.</value>
        public double e => _sideLengthB.Squared() / SideLengthC();

        /// <summary>
        /// Length of segment d, which spans from point b to the perpendicular intersection of h along side c.
        /// </summary>
        /// <value>The e.</value>
        public double d => _sideLengthA.Squared() / SideLengthC();

        /// <summary>
        /// Gets the height, which is the measurement of the line formed from any point to a perpendicular intersection with a side.
        /// </summary>
        /// <value>The h.</value>
        public override double h => _sideLengthA * _sideLengthB / SideLengthC();

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 3 sides of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double InRadius => _sideLengthA * _sideLengthB / (_sideLengthA + _sideLengthB + SideLengthC());

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 3 defining points of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double CircumRadius => 0.5 * SideLengthC();
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="RightTriangle" /> class.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        public RightTriangle(double width, double height)
        {
            _sideLengthA = width.Abs();
            _sideLengthB = height.Abs();
            SetCoordinates(LocalCoordinates());
            setCenterCoordinates();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="RightTriangle" /> class.
        /// </summary>
        /// <param name="apexCoordinate">The apex coordinate.</param>
        public RightTriangle(CartesianCoordinate apexCoordinate)
        {
            _sideLengthA = apexCoordinate.X;
            _sideLengthB = apexCoordinate.Y;
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
            return 0.5 * _sideLengthA * _sideLengthB;
        }

        /// <summary>
        /// Length of sides of equal length, a.
        /// </summary>
        /// <value>a.</value>
        public override double SideLengthA() => _sideLengthA;
        /// <summary>
        /// Length of the unequal length side, b.
        /// </summary>
        /// <value>The b.</value>
        public override double SideLengthB() => _sideLengthB;
        /// <summary>
        /// Length of the hypotenuse side, c.
        /// </summary>
        /// <value>The c.</value>
        public override double SideLengthC() => getHypotenuse(_sideLengthA, _sideLengthB);

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public IList<CartesianCoordinate> LocalCoordinates()
        {
            return new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(_sideLengthA , 0),
                new CartesianCoordinate(_sideLengthA , _sideLengthB),
            };
        }

        /// <summary>
        /// Gets the alpha angle.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        /// <returns>System.Double.</returns>
        protected double getAlpha(double width, double height)
        {
            return Trig.ArcTan(height / width);
        }

        /// <summary>
        /// Gets the beta angle.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        /// <returns>System.Double.</returns>
        protected double getBeta(double width, double height)
        {
            return (Numbers.PiOver2 - getAlpha(width, height));
        }

        /// <summary>
        /// Gets the hypotenuse.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        /// <returns>System.Double.</returns>
        private static double getHypotenuse(double width, double height)
        {
            return Math.Algebra.AlgebraLibrary.SRSS(width, height);
        }
        #endregion
    }
}