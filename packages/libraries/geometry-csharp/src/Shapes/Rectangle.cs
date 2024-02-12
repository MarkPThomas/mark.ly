// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Rectangle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a rectangular shape, with the origin at the lower left corner.
    /// </summary>
    public class Rectangle : Trapezoid, ICircumCircle
    {
        #region Properties
        /// <summary>
        /// The bottom width.
        /// </summary>
        /// <value>The width bottom.</value>
        public override double b_b => b_t;

        /// <summary>
        /// The skew of the shape, i.e. the offset of the left side of the top segment from the local y-axis.
        /// </summary>
        /// <value>The skew.</value>
        public override double g => 0;

        /// <summary>
        /// The centroid of the shape.
        /// </summary>
        /// <value>The centroid.</value>
        public override CartesianCoordinate Centroid => new CartesianCoordinate(0.5 * b_t, 0.5 * h);

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 4 defining points of the shape.
        /// </summary>
        /// <value>The in radius.</value>
        public virtual double CircumRadius => 0.5 * (b_t.Squared() + h.Squared()).Sqrt();

        /// <summary>
        /// Gets the circumcenter, which describes the center of a circle whose edges are defined by the 4 defining points of the shape.
        /// </summary>
        /// <value>The in center.</value>
        public CartesianCoordinate CircumCenter => Centroid;
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Rectangle" /> class.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        public Rectangle(double height, double width) : base(height, width, width, 0)
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
        /// The x centroid in local coordinatesfor the shape.
        /// </summary>
        /// <returns>System.Double.</returns>
        public override double Xo()
        {
            return 0.5 * b_t;
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