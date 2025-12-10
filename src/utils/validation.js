export const validateWorkflow = (nodes, edges) => {
  const errors = [];
  const warnings = [];

  // Check for start node
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have at least one start node');
  } else if (startNodes.length > 1) {
    warnings.push('Multiple start nodes detected');
  }

  // Check for end node
  const endNodes = nodes.filter(n => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one end node');
  }

  // Check for disconnected nodes
  nodes.forEach(node => {
    const incomingEdges = edges.filter(e => e.target === node.id);
    const outgoingEdges = edges.filter(e => e.source === node.id);
    
    if (node.type !== 'start' && incomingEdges.length === 0) {
      warnings.push(`Node "${node.data.title || node.id}" has no incoming connections`);
    }
    
    if (node.type !== 'end' && outgoingEdges.length === 0) {
      warnings.push(`Node "${node.data.title || node.id}" has no outgoing connections`);
    }
  });

  // Check for cycles (basic detection)
  const hasCycle = detectCycles(nodes, edges);
  if (hasCycle) {
    warnings.push('Possible cycle detected in workflow');
  }

  // Validate node data
  nodes.forEach(node => {
    if (node.type === 'task' && !node.data.title) {
      warnings.push(`Task node "${node.id}" has no title`);
    }
    
    if (node.type === 'approval' && !node.data.approverRole) {
      warnings.push(`Approval node "${node.id}" has no approver role specified`);
    }
  });

  return { errors, warnings };
};

const detectCycles = (nodes, edges) => {
  const visited = new Set();
  const recursionStack = new Set();
  
  const dfs = (nodeId) => {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const outgoingEdges = edges.filter(e => e.source === nodeId);
    for (const edge of outgoingEdges) {
      if (dfs(edge.target)) return true;
    }
    
    recursionStack.delete(nodeId);
    return false;
  };
  
  for (const node of nodes) {
    if (dfs(node.id)) return true;
  }
  
  return false;
};

export const serializeWorkflow = (nodes, edges) => {
  return {
    version: '1.0',
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
    })),
    metadata: {
      createdAt: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    }
  };
};