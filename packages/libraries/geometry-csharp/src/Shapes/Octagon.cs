using MPT.Math;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// A regular polygon of 8 sides.
    /// Implements the <see cref="MPT.Geometry.Shapes.RegularPolygon" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.RegularPolygon" />
    public class Octagon : RegularPolygon
    {
        /// <summary>
        /// The number of sides.
        /// </summary>
        protected static int _setNumberOfSides = 8;

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Octagon"/> class.
        /// </summary>
        /// <param name="circumRadius">The circumradius.</param>
        public Octagon(double circumRadius) : base(_setNumberOfSides, circumRadius)
        {

        }

        /// <summary>
        /// Returns an octagon sized by the inradius.
        /// </summary>
        /// <param name="inRadius">The inradius.</param>
        /// <returns>RegularPolygon.</returns>
        public static Octagon OctagonByInradius(double inRadius)
        {
            double circumRadius = inRadius * Trig.Sec(Numbers.Pi / _setNumberOfSides);
            return new Octagon(circumRadius);
        }

        /// <summary>
        /// Returns an octagon sized by the circumradius.
        /// </summary>
        /// <returns>RegularPolygon.</returns>
        public static Octagon OctagonByCircumradius(double circumRadius)
        {
            return new Octagon(circumRadius);
        }
        #endregion
    }
}