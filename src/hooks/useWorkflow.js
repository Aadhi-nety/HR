import { useState, useCallback } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export const useWorkflow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  /* ---------- node / edge changes ---------- */
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: 'smoothstep', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds)
      ),
    []
  );
  const onNodeClick = useCallback((node) => setSelectedNode(node), []);

  /* ---------- add node – accepts string OR object + position ---------- */
  const addNode = useCallback((nodeTypeOrType, position) => {
    const type = typeof nodeTypeOrType === 'string' ? nodeTypeOrType : nodeTypeOrType?.type;
    if (!type) return;
    const label = typeof nodeTypeOrType === 'string' ? getDefaultTitle(type) : nodeTypeOrType.label || getDefaultTitle(type);
    const pos = position ?? { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 };

    const newNode = {
      id: `${type}_${uuidv4()}`,
      type,
      position: pos,
      data: { title: label, description: '', ...getTypeSpecificData(type) },
    };

    setNodes((nds) => {
      const updated = [...nds, newNode];

      /* auto-wire Start → End on first complete pair */
      const start = updated.find((n) => n.type === 'start');
      const end = updated.find((n) => n.type === 'end');
      if (start && end && !edges.some((e) => e.source === start.id && e.target === end.id)) {
        setEdges((eds) => [
          ...eds,
          { id: `edge_${start.id}_${end.id}`, source: start.id, target: end.id, type: 'smoothstep', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } },
        ]);
      }
      return updated;
    });

    setSelectedNode(newNode);
  }, [edges]);

  /* ---------- CRUD ---------- */
  const updateNode = useCallback((nodeId, data) => {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)));
    setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  }, []);

  const clearCanvas = useCallback(() => {
    if (window.confirm('Clear canvas? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, []);

  /* ---------- validation – only Start/End rules ---------- */
  const validateWorkflow = useCallback(() => {
    const errors = [];
    const start = nodes.find((n) => n.type === 'start');
    const end = nodes.find((n) => n.type === 'end');

    if (!start) errors.push('❌ Workflow must have a Start node');
    if (!end) errors.push('❌ Workflow must have an End node');

    /* OPTIONAL: comment-in to see middle-node warnings
    nodes.filter((n) => !['start', 'end'].includes(n.type)).forEach((n) => {
      const inEdges = edges.filter((e) => e.target === n.id).length;
      const outEdges = edges.filter((e) => e.source === n.id).length;
      if (inEdges === 0) errors.push(`⚠️ "${n.data.title}" has no incoming connection`);
      if (outEdges === 0) errors.push(`⚠️ "${n.data.title}" has no outgoing connection`);
    });
    */

    return errors;
  }, [nodes, edges]);

  /* ---------- utils ---------- */
  const serializeWorkflow = useCallback(() => {
    return {
      id: `workflow_${uuidv4()}`,
      name: 'HR Workflow',
      createdAt: new Date().toISOString(),
      nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
      edges: edges.map(({ id, source, target, type }) => ({ id, source, target, type })),
    };
  }, [nodes, edges]);

  const getDefaultTitle = (type) => {
    switch (type) {
      case 'start': return 'Start Process';
      case 'task': return 'New Task';
      case 'approval': return 'Approval Required';
      case 'automated': return 'Automated Action';
      case 'end': return 'End Process';
      default: return 'Node';
    }
  };

  const getTypeSpecificData = (type) => {
    switch (type) {
      case 'start': return { trigger: 'manual', metadata: [] };
      case 'task': return { assignee: '', dueDate: '', priority: 'medium' };
      case 'approval': return { approverRole: 'manager', autoApproveThreshold: 24 };
      case 'automated': return { action: 'send_email', params: {} };
      case 'end': return { message: 'Workflow completed', summary: true };
      default: return {};
    }
  };

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    addNode,
    updateNode,
    deleteNode,
    clearCanvas,
    serializeWorkflow,
    validateWorkflow, // ← exported so SandboxPanel can use it
  };
};