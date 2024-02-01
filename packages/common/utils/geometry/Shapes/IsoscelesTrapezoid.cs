// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-30-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="IsoscelesTrapezoid.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents an isosceles trapezoid, with the origin at the lower left corner.
    /// Implements the <see cref="MPT.Geometry.Shapes.Quadrilateral" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Quadrilateral" />
    public class IsoscelesTrapezoid : Trapezoid //, ICircumCircle, IIncircle
    {
        #region Properties
        /// <summary>
        /// The skew of the shape, i.e. the offset of the left side of the top segment from the local y-axis.
        /// </summary>
        /// <value>The skew.</value>
        public override double g => getSkew(b_t, b_b);

        /// <summary>
        /// Length of the sloped sides of the shape.
        /// </summary>
        /// <value>a.</value>
        public double a => (g.Squared() + h.Squared()).Sqrt();

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 4 defining points of the shape.
        /// </summary>
        /// <value>The in radius.</value>
        public double CircumRadius => a * ((b_t * b_b + a.Squared()) / (2 * h)).Sqrt();
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Trapezoid" /> class.
        /// </summary>
        /// <param name="height">The height.</param>
        /// <param name="topWidth">Width of the top.</param>
        /// <param name="bottomWidth">Width of the bottom.</param>
        public IsoscelesTrapezoid(double height, double topWidth, double bottomWidth) :
            base(height, topWidth, bottomWidth, getSkew(topWidth, bottomWidth))
        {
        }
        #endregion

        #region Methods
        /// <summary>
        /// The x centroid in local coordinatesfor the shape.
        /// </summary>
        /// <returns>System.Double.</returns>
        public override double Xo()
        {
            return 0.5 * b_b;
        }

        /// <summary>
        /// Gets the skew.
        /// </summary>
        /// <param name="topWidth">Width of the top.</param>
        /// <param name="bottomWidth">Width of the bottom.</param>
        /// <returns>System.Double.</returns>
        private static double getSkew(double topWidth, double bottomWidth)
        {
            return 0.5 * (bottomWidth - topWidth);
        }
        #endregion
    }
}