import { IGraph, findShortestPath } from './dijkstra'

describe('#findShortestPath', () => {
  it('should return the shortest distance and nodes that form the shortest path between two specified nodes', () => {
    // Note: Graph string names can be GUIDs created for unique nodes as the graph object is created.
    const graph: IGraph = {
      start: { A: 5, B: 2 },
      A: { start: 1, C: 4, D: 2 }, // Note: start-A is bi-directional with different weights for each direction. This is valid.
      B: { A: 8, D: 7 },
      C: { D: 6, end: 3 },
      D: { end: 1 },
      end: {},
    };

    expect(findShortestPath(graph, "start", "end")).toEqual({
      distance: 8,
      path: ["start", "A", "D", "end"]
    });

    expect(findShortestPath(graph, "A", "B")).toEqual({
      distance: 3,
      path: ["A", "start", "B"]
    });

    expect(findShortestPath(graph, "A", "start")).toEqual({
      distance: 1,
      path: ["A", "start"]
    });
  });

  it('should return a null path and infinite distance for nodes that are disconnected', () => {
    const graph: IGraph = {
      start: { A: 5, B: 2 },
      A: { D: 2 },
      B: { A: 8, D: 7 },
      C: { D: 6, end: 3 },
      D: {},
      end: {},
    };

    expect(findShortestPath(graph, "start", "end")).toEqual({
      distance: Infinity,
      path: null
    });
  })
})
