// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 07-01-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="IInCircle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// A circle that is tangent to all segments of a plane figure, or does not intersect, and contains the entire figure in its exterior.
    /// All triangles have incircles and so do all regular polygons. Most other polygons do not.
    /// </summary>
    public interface IIncircle
    {
        /// <summary>
        /// Gets the inradius, which is the radius of a circle whose edge is tangent to all sides of the shape where an intersection occurs.
        /// </summary>
        /// <value>The inradius.</value>
        double InRadius { get; }

        /// <summary>
        /// Gets the incenter, which describes the center of a circle whose edge is tangent to all sides of the shape where an intersection occurs.
        /// </summary>
        /// <value>The in center.</value>
        CartesianCoordinate InCenter { get; }
    }
}