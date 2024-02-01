// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-28-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="EquilateralTriangle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using System.Collections.Generic;
using Numbers = MPT.Math.Numbers;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Any triangle of 3 equal sides (3 equal angles).
    /// Implements the <see cref="MPT.Geometry.Shapes.Triangle" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Triangle" />
    public class EquilateralTriangle : Triangle, IDefinedShape
    {
        #region Properties
        /// <summary>
        /// Length of the equal-length sides of the triangle.
        /// </summary>
        protected double _sidesEqual;

        /// <summary>
        /// The angle, α, which is opposite of side a and is 60°.
        /// </summary>
        /// <value>The alpha.</value>
        public override Angle AngleA => Numbers.PiOver3;

        /// <summary>
        /// The angle, β, which is opposite of side b and is 60°.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleB => Numbers.PiOver3;

        /// <summary>
        /// The angle, γ, which is opposite of side c and is 60°.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleC => Numbers.PiOver3;

        /// <summary>
        /// Gets the height, which is the measurement of the line formed from any point to a perpendicular intersection with a side.
        /// </summary>
        /// <value>The h.</value>
        public override double h => getHeight(_sidesEqual);

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 3 defining points of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double CircumRadius => (2d / 3) * getHeight(_sidesEqual);

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 3 sides of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double InRadius => getHeight(_sidesEqual) / 3;
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="EquilateralTriangle" /> class.
        /// </summary>
        /// <param name="sideLength">Length of the side.</param>
        public EquilateralTriangle(double sideLength)
        {
            _sidesEqual = sideLength.Abs();
            SetCoordinates(LocalCoordinates());
            setCenterCoordinates();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="EquilateralTriangle" /> class.
        /// </summary>
        /// <param name="apexCoordinate">The apex coordinate.</param>
        public EquilateralTriangle(CartesianCoordinate apexCoordinate)
        {
            _sidesEqual = 2 * apexCoordinate.X;
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
            return 0.25 * _sidesEqual.Squared() * 3.Sqrt();
        }

        /// <summary>
        /// Length of all sides of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Perimeter()
        {
            return 3 * _sidesEqual;
        }

        /// <summary>
        /// Length of side a.
        /// </summary>
        /// <value>a.</value>
        public override double SideLengthA() => _sidesEqual;

        /// <summary>
        /// Length of side b, which lies horizontally as the base.
        /// </summary>
        /// <value>a.</value>
        public override double SideLengthB() => _sidesEqual;

        /// <summary>
        /// Length of side c.
        /// </summary>
        /// <value>a.</value>
        public override double SideLengthC() => _sidesEqual;

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public IList<CartesianCoordinate> LocalCoordinates()
        {
            return new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(_sidesEqual, 0),
                new CartesianCoordinate(_sidesEqual / 2, getHeight(_sidesEqual)),
            };
        }

        /// <summary>
        /// Gets the height.
        /// </summary>
        /// <param name="sidesEqual">The sides equal.</param>
        /// <returns>System.Double.</returns>
        private static double getHeight(double sidesEqual)
        {
            return 0.5 * sidesEqual * 3.Sqrt();
        }
        #endregion
    }
}