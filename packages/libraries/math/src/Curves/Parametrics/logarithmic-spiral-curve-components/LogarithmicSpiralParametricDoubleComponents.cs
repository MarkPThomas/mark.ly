// ***********************************************************************
// Assembly         : MPT.Math
// Author           : Mark P Thomas
// Created          : 11-21-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 11-21-2020
// ***********************************************************************
// <copyright file="LogarithmicParametricBase.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Curves.Parametrics.Components.Types;

namespace MPT.Math.Curves.Parametrics.LogarithmicSpiralCurveComponents
{
    /// <summary>
    /// Class containing the assigned components of a parametric equation in <see cref="double"/> coordinates and the corresponding logarithmic spiral curve object.
    /// This class has the basic components of differentiating and accessing the different parametric equations.
    /// Also contains operators to implement scaling of the parametric equations.
    /// Implements the <see cref="MPT.Math.Curves.Parametrics.Components.Types.DoubleParametricComponents" />
    /// </summary>
    /// <seealso cref="MPT.Math.Curves.Parametrics.Components.Types.DoubleParametricComponents" />
    internal abstract class LogarithmicSpiralParametricDoubleComponents : DoubleParametricComponents
    {
        /// <summary>
        /// Gets the parent object whose properties are used in the associated parametric equations.
        /// </summary>
        /// <value>The parent.</value>
        protected LogarithmicSpiralCurve _parent => _parentCurve as LogarithmicSpiralCurve;

        /// <summary>
        /// Initializes a new instance of the <see cref="LogarithmicSpiralParametricDoubleComponents" /> class.
        /// </summary>
        /// <param name="parent">The parent.</param>
        public LogarithmicSpiralParametricDoubleComponents(LogarithmicSpiralCurve parent) : base(parent) { }
    }
}