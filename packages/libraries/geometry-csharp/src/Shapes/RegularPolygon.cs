using MPT.Math;
using MPT.Math.Coordinates;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;
using NMath = System.Math;
using System.Collections.Generic;
using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a polygon shape where all sides and angles are congruent.
    /// Implements the <see cref="MPT.Geometry.Shapes.Polygon" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Polygon" />
    public class RegularPolygon : Polygon, IRegularPolygon
    {
        #region Properties
        /// <summary>
        /// The minimum number of sides (5): 4 sides is a square,  3 sides is an equilateral triangle, 2 sides or fewer is not a shape.
        /// </summary>
        protected static int _minNumberOfSides = 5;

        /// <summary>
        /// The number of sides
        /// </summary>
        protected int _numberOfSides;

        /// <summary>
        /// The length of the sides
        /// </summary>
        protected double _lengthOfSides;

        /// <summary>
        /// Gets the number of sides.
        /// </summary>
        /// <value>The number of sides.</value>
        public int NumberOfSides => _numberOfSides;

        /// <summary>
        /// Length of any side of the polygon.
        /// </summary>
        public double SideLength => _lengthOfSides;

        /// <summary>
        /// The line segment from the center of a regular polygon to the midpoint of a side, or the length of this segment.
        /// Same as the inradius; that is, the radius of a regular polygon's inscribed circle.
        /// </summary>
        /// <value>The apothem.</value>
        public double Apothem => InRadius;

        /// <summary>
        /// Gets the inradius.
        /// </summary>
        /// <value>The inradius.</value>
        public double InRadius => 0.5 * _lengthOfSides * Trig.Cot(Numbers.Pi / _numberOfSides);

        /// <summary>
        /// Gets the incenter, which describes the center of a circle whose edge is tangent to all sides of the shape.
        /// </summary>
        /// <value>The in center.</value>
        public CartesianCoordinate InCenter => Centroid;

        /// <summary>
        /// Gets the circumradius.
        /// </summary>
        /// <value>The circumradius.</value>
        public double CircumRadius => 0.5 * _lengthOfSides * Trig.Csc(Numbers.Pi / _numberOfSides);

        /// <summary>
        /// Gets the circumcenter, which describes the center of a circle whose edges are defined by the defining points of the shape.
        /// </summary>
        /// <value>The in center.</value>
        public CartesianCoordinate CircumCenter => Centroid;

        /// <summary>
        /// Gets the interior angle.
        /// </summary>
        /// <value>The interior angle.</value>
        public Angle AngleInterior => new Angle(((_numberOfSides - 2d) / _numberOfSides) * Numbers.Pi);

        /// <summary>
        /// Gets the sum of the interior angles.
        /// </summary>
        /// <value>The sum of the interior angles.</value>
        public Angle AngleInteriorSum => new Angle((_numberOfSides - 2d) * Numbers.Pi);

        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="RegularPolygon"/> class.
        /// </summary>
        /// <param name="numberOfSides">The number of sides, &gt;= 5</param>
        /// <param name="circumRadius">The circumradius.</param>
        public RegularPolygon(int numberOfSides, double circumRadius)
        {
            _numberOfSides = NMath.Max(_minNumberOfSides, numberOfSides.Abs());
            _lengthOfSides = 2 * circumRadius.Abs() * Trig.Sin(Numbers.Pi / _numberOfSides);
            SetCoordinates(LocalCoordinates());
        }

        /// <summary>
        /// Returns a regular polygon sized by the inradius.
        /// </summary>
        /// <param name="numberOfSides">The number of sides.</param>
        /// <param name="inRadius">The inradius.</param>
        /// <returns>RegularPolygon.</returns>
        public static RegularPolygon RegularPolygonByInradius(int numberOfSides, double inRadius)
        {
            numberOfSides = NMath.Max(_minNumberOfSides, numberOfSides.Abs());
            double circumRadius = inRadius.Abs() * Trig.Sec(Numbers.Pi / numberOfSides);
            return new RegularPolygon(numberOfSides, circumRadius);
        }

        /// <summary>
        /// Returns a regular polygon sized by the circumradius.
        /// </summary>
        /// <param name="numberOfSides">The number of sides.</param>
        /// <param name="circumRadius">The circumradius.</param>
        /// <returns>RegularPolygon.</returns>
        public static RegularPolygon RegularPolygonByCircumradius(int numberOfSides, double circumRadius)
        {
            return new RegularPolygon(numberOfSides, circumRadius);
        }

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public IList<CartesianCoordinate> LocalCoordinates()
        {
            double theta;
            double circumRadius = CircumRadius;
            List<CartesianCoordinate> coordinates = new List<CartesianCoordinate>();
            for (int i = 0; i < _numberOfSides; i++)
            {
                theta = i * Numbers.TwoPi / _numberOfSides;
                coordinates.Add(
                    new CartesianCoordinate(
                        circumRadius * Trig.Cos(theta),
                        circumRadius * Trig.Sin(theta)
                        )
                    );
            }
            return coordinates;
        }
        #endregion

        #region Methods: IShapeProperties
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return 0.5 * _numberOfSides * _lengthOfSides * InRadius;
        }

        /// <summary>
        /// Length of all sides of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Perimeter()
        {
            return _lengthOfSides * _numberOfSides;
        }

        /// <summary>
        /// X-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Xo()
        {
            return 0;
        }

        /// <summary>
        /// Y-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Yo()
        {
            return 0;
        }

        #endregion
    }
}