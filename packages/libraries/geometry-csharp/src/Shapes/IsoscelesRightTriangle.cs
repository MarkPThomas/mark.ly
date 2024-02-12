using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using System.Collections.Generic;
using Numbers = MPT.Math.Numbers;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents an isoscesles triangle (2 sides of equal length) with one angle as 90&#176; &amp; the other two angles as 45&#176;.
    /// Implements the <see cref="MPT.Geometry.Shapes.IsoscelesTriangle" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.IsoscelesTriangle" />
    public class IsoscelesRightTriangle : IsoscelesTriangle
    {
        #region Properties
        /// <summary>
        /// The two angles of equal magnitude, α, which are opposite of the two sides of equal length. 45&#176; in this case.
        /// </summary>
        /// <value>The alpha.</value>
        public override Angle AngleA => new Angle(Numbers.PiOver4);

        /// <summary>
        /// The angle of differing magnitude, β, which is opposite of the side of unequal length, b. 90&#176; in this case.
        /// </summary>
        /// <value>The beta.</value>
        public override Angle AngleB => new Angle(Numbers.PiOver2);


        /// <summary>
        /// Gets the height, which is measured perpendicular to side b.
        /// </summary>
        /// <value>The h.</value>
        public override double h => _sidesEqual / 2.Sqrt();

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 3 sides of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double InRadius => 0.5 * _sidesEqual * (2 - 2.Sqrt());

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 3 defining points of the triangle.
        /// </summary>
        /// <value>The in radius.</value>
        public override double CircumRadius => h;
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="IsoscelesRightTriangle"/> class.
        /// </summary>
        /// <param name="lengthsEqualA">Length of sides of equal length, a.</param>
        public IsoscelesRightTriangle(double lengthsEqualA) : base(lengthsEqualA, lengthsEqualA * 2.Sqrt())
        { }
        #endregion

        #region Methods
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return 0.5 * _sidesEqual.Squared();
        }

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public override IList<CartesianCoordinate> LocalCoordinates()
        {
            return new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(_sidesEqual, 0),
                new CartesianCoordinate(0, _sidesEqual),
            };
        }
        #endregion
    }
}