// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="IRegularPolygon.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Interface for all paths that create a closed shape where all sides and angles are congruent.
    /// </summary>
    public interface IRegularPolygon : ICircumCircle, IIncircle, IDefinedShape
    {
        /// <summary>
        /// The line segment from the center of a regular polygon to the midpoint of a side, or the length of this segment.
        /// Same as the inradius; that is, the radius of a regular polygon's inscribed circle.
        /// </summary>
        /// <value>The apothem.</value>
        double Apothem { get; }

        /// <summary>
        /// Number of sides (n) of the polygon.
        /// </summary>
        /// <value>The number of sides.</value>
        int NumberOfSides { get; }

        /// <summary>
        /// Length of any side of the polygon.
        /// </summary>
        /// <value>The length of the side.</value>
        double SideLength { get; }

        /// <summary>
        /// Angle between any two sides of the polygon on the inside of the shape.
        /// </summary>
        /// <value>The angle interior.</value>
        Angle AngleInterior { get; }

        /// <summary>
        /// Sum of all interior angles of the shape.
        /// </summary>
        /// <value>The angle interior sum.</value>
        Angle AngleInteriorSum { get; }
    }
}