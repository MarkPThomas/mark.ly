using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a circular wedge shape, with the origin at the common origin of the arc segment capping the end.
    /// The x-axis forms a line of symmetry.
    /// </summary>
    public class CircularSector : Shape
    {
        private Wedge _wedge;
        private CircularSegment _lense;
    }
}