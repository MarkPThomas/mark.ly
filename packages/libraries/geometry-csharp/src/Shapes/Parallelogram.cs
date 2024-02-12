// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Parallelogram.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a parallelogram shape, with the origin at the lower left corner, and the bottom edge aligned with the x-axis.
    /// </summary>
    public class Parallelogram : Trapezoid
    {
        #region Properties
        /// <summary>
        /// The bottom width.
        /// </summary>
        /// <value>The width bottom.</value>
        public override double b_b => b_t;

        /// <summary>
        /// Length of the sloped sides of the shape.
        /// </summary>
        /// <value>a.</value>
        public double a => (g.Squared() + h.Squared()).Sqrt();
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Trapezoid" /> class.
        /// </summary>
        /// <param name="height">The height.</param>
        /// <param name="width">The width.</param>
        /// <param name="skew">The skew offset of the top segment.</param>
        public Parallelogram(double height, double width, double skew) :
            base(height, width, width, skew)
        {
        }
        #endregion

        #region Methods
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return h * b_t;
        }

        /// <summary>
        /// The y centroid in local coordinatesfor the shape.
        /// </summary>
        /// <returns>System.Double.</returns>
        public override double Yo()
        {
            return 0.5 * h;
        }
        #endregion
    }
}