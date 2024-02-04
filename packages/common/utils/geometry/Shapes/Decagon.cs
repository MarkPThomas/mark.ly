using MPT.Math;
using MPT.Math.NumberTypeExtensions;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// A regular polygon of 10 sides.
    /// Implements the <see cref="MPT.Geometry.Shapes.RegularPolygon" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.RegularPolygon" />
    public class Decagon : RegularPolygon
    {
        /// <summary>
        /// The number of sides.
        /// </summary>
        protected static int _setNumberOfSides = 10;

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Decagon"/> class.
        /// </summary>
        /// <param name="circumRadius">The circumradius.</param>
        public Decagon(double circumRadius) : base(_setNumberOfSides, circumRadius)
        {

        }

        /// <summary>
        /// Returns a decagon sized by the inradius.
        /// </summary>
        /// <param name="inRadius">The inradius.</param>
        /// <returns>RegularPolygon.</returns>
        public static Decagon DecagonByInradius(double inRadius)
        {
            double circumRadius = inRadius * Trig.Sec(Numbers.Pi / _setNumberOfSides);
            return new Decagon(circumRadius);
        }

        /// <summary>
        /// Returns a decagon sized by the circumradius.
        /// </summary>
        /// <returns>RegularPolygon.</returns>
        public static Decagon DecagonByCircumradius(double circumRadius)
        {
            return new Decagon(circumRadius);
        }
        #endregion
    }
}