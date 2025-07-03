
import { Node, Edge } from '@xyflow/react';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateDAG = (nodes: Node[], edges: Edge[]): ValidationResult => {
  // Check minimum nodes
  if (nodes.length < 2) {
    return {
      isValid: false,
      message: 'Pipeline needs at least 2 nodes',
    };
  }

  // Check if all nodes are connected
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const unconnectedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));
  if (unconnectedNodes.length > 0) {
    return {
      isValid: false,
      message: `${unconnectedNodes.length} node(s) are not connected`,
    };
  }

  // Check for cycles using DFS
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    return {
      isValid: false,
      message: 'Pipeline contains cycles (not a DAG)',
    };
  }

  return {
    isValid: true,
    message: 'Valid DAG - Ready for execution',
  };
};

const detectCycle = (nodes: Node[], edges: Edge[]): boolean => {
  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  });

  // DFS cycle detection
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        return true; // Back edge found, cycle detected
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  // Check for cycles starting from each unvisited node
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }

  return false;
};
