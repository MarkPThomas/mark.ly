using MPT.Math.Coordinates;
using System;
using System.Collections.Generic;
using System.Text;

namespace MPT.Geometry.Tools
{
    public class Vertex
    {
        public CartesianCoordinate Coordinate;
        public CartesianCoordinate? ControlPointI;
        public CartesianCoordinate? ControlPtJ;
        public bool ControlPointsAreTangent;
    }
}