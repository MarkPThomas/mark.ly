// Source: https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34

export const findShortestPath = (graph: IGraph, startNode: string, endNode: string) => {
  // Initialize tracking objects
  const distances: INodeDistance = {
    ...graph[startNode],
    endNode: Infinity
  };

  const parents: IParent = { endNode: null };
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  // Fill out tracking objects with shortest distances and associated parents
  const visited: string[] = [];
  let node = shortestDistanceNode(distances, visited);
  while (node) {
    const childDistances = graph[node];
    for (let child in childDistances) {
      if (child === startNode) {
        continue;
      }

      const newdistance = distances[node] + childDistances[child];
      if (!distances[child] || newdistance < distances[child]) {
        distances[child] = newdistance;
        parents[child] = node;
      }
    }

    visited.push(node);
    node = shortestDistanceNode(distances, visited);
  }

  // Trace from end to start to get shortest path
  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  const distance = distances[endNode] ? distances[endNode] : Infinity;

  return {
    distance: distance,
    path: distance === Infinity ? null : shortestPath,
  };
}

const shortestDistanceNode = (distances: INodeDistance, visited: string[]) => {
  let shortest = null;

  for (let node in distances) {
    let currentIsShortest = shortest === null || distances[node] < distances[shortest];

    if (currentIsShortest && !visited.includes(node)) {
      shortest = node;
    }
  }

  return shortest;
};

interface IParent {
  [key: string]: string | null;
}

interface INodeDistance {
  [key: string]: number;
}

export interface IGraph {
  [key: string]: INodeDistance;
}