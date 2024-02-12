// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-28-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-30-2020
// ***********************************************************************
// <copyright file="Triangle345.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************

using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Smallest possible integer lengths for a right triangle.
    /// Implements the <see cref="MPT.Geometry.Shapes.RightTriangle" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.RightTriangle" />
    public class Triangle345 : RightTriangle
    {
        #region Properties
        /// <summary>
        /// The scale that is applied to the sides of length 3, 4 &amp; 5 and all other derived properties.
        /// </summary>
        private double _scale;

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 3 sides of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double InRadius => 1 * _scale;

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 3 defining points of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double CircumRadius => 5d / 2 * _scale;
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Triangle345" /> class.
        /// </summary>
        /// <param name="scale">The scale to apply to the sides of lengths 3, 4 &amp; 5.</param>
        public Triangle345(double scale) :  base(getWidth(scale), getHeight(scale))
        {
            _scale = scale.Abs();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return _scale == 0 ? base.Area() : 6 * _scale.Squared();
        }

        /// <summary>
        /// Length of all sides of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Perimeter()
        {
            return _scale == 0 ? base.Perimeter() : 12 * _scale;
        }

        /// <summary>
        /// Length of the vertical side, a .
        /// </summary>
        /// <value>a.</value>
        public override double SideLengthA() => _scale == 0 ? base.SideLengthA() : getHeight(_scale);

        /// <summary>
        /// Length of the base/horizontal side, b.
        /// </summary>
        /// <value>The b.</value>
        public override double SideLengthB() => _scale == 0 ? base.SideLengthB() : getWidth(_scale);

        /// <summary>
        /// Length of the hypotenuse side, c.
        /// </summary>
        /// <value>The c.</value>
        public override double SideLengthC() => _scale == 0 ? base.SideLengthC() : getHypotenuse(_scale);

        /// <summary>
        /// Gets the width.
        /// </summary>
        /// <param name="scale">The scale.</param>
        /// <returns>System.Double.</returns>
        private static double getWidth(double scale)
        {
            return scale * 3;
        }

        /// <summary>
        /// Gets the height.
        /// </summary>
        /// <param name="scale">The scale.</param>
        /// <returns>System.Double.</returns>
        private static double getHeight(double scale)
        {
            return scale * 4;
        }

        /// <summary>
        /// Gets the hypotenuse.
        /// </summary>
        /// <param name="scale">The scale.</param>
        /// <returns>System.Double.</returns>
        private static double getHypotenuse(double scale)
        {
            return scale * 5;
        }
        #endregion
    }
}