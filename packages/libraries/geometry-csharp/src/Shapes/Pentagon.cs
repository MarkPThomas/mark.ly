using MPT.Math;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// A regular polygon of 5 sides.
    /// Implements the <see cref="MPT.Geometry.Shapes.RegularPolygon" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.RegularPolygon" />
    public class Pentagon : RegularPolygon
    {
        /// <summary>
        /// The number of sides.
        /// </summary>
        protected static int _setNumberOfSides = 5;

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Pentagon"/> class.
        /// </summary>
        /// <param name="circumRadius">The circumradius.</param>
        public Pentagon (double circumRadius) : base(_setNumberOfSides, circumRadius)
        {

        }

        /// <summary>
        /// Returns a pentagon sized by the inradius.
        /// </summary>
        /// <param name="inRadius">The inradius.</param>
        /// <returns>RegularPolygon.</returns>
        public static Pentagon PentagonByInradius(double inRadius)
        {
            double circumRadius = inRadius * Trig.Sec(Numbers.Pi / _setNumberOfSides);
            return new Pentagon(circumRadius);
        }

        /// <summary>
        /// Returns a pentagon sized by the circumradius.
        /// </summary>
        /// <returns>RegularPolygon.</returns>
        public static Pentagon PentagonByCircumradius(double circumRadius)
        {
            return new Pentagon(circumRadius);
        }
        #endregion
    }
}