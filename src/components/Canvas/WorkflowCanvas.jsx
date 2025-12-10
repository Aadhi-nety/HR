import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

/* ---------- thin-line monochrome icons ---------- */
const Icon = ({ type }) => {
  const paths = {
    start: (
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 8l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
    task: (
      <>
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
    approval: (
      <>
        <path d="M10 2l8 5v8l-8 5-8-5V7l8-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M10 10l3 3M10 7v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
    automated: (
      <>
        <path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
      </>
    ),
    end: (
      <>
        <rect x="4" y="4" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 7l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
  };
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {paths[type]}
    </svg>
  );
};

/* ---------- quiet-luxury node components WITH HANDLES ---------- */
const nodeStyles = (color, selected) => ({
  background: color,
  border: `2px solid ${selected ? '#6366f1' : '#d1d5db'}`,
  borderRadius: '12px',
  padding: '12px 16px',
  minWidth: '160px',
  boxShadow: selected ? '0 6px 20px rgba(99,102,241,.25)' : '0 4px 12px rgba(0,0,0,.05)',
  position: 'relative',
  transition: 'all .2s ease',
  cursor: 'grab',
});

const nodeTypes = {
  start: ({ data, selected }) => (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: 8, height: 8 }} />
      <div style={nodeStyles('#d1fae5', selected)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon type="start" />
          <div style={{ fontWeight: 600, color: '#1f2937' }}>{data?.title || 'Start'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: 8, height: 8 }} />
    </>
  ),
  task: ({ data, selected }) => (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: 8, height: 8 }} />
      <div style={nodeStyles('#dbeafe', selected)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon type="task" />
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{data?.title || 'Task'}</div>
            {data?.assignee && <div style={{ fontSize: '.75rem', color: '#4b5563' }}>{data.assignee}</div>}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: 8, height: 8 }} />
    </>
  ),
  approval: ({ data, selected }) => (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: 8, height: 8 }} />
      <div style={nodeStyles('#fef3c7', selected)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon type="approval" />
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{data?.title || 'Approval'}</div>
            {data?.approverRole && <div style={{ fontSize: '.75rem', color: '#4b5563' }}>{data.approverRole}</div>}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: 8, height: 8 }} />
    </>
  ),
  automated: ({ data, selected }) => (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: 8, height: 8 }} />
      <div style={nodeStyles('#ede9fe', selected)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon type="automated" />
          <div style={{ fontWeight: 600, color: '#1f2937' }}>{data?.title || 'Automated'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: 8, height: 8 }} />
    </>
  ),
  end: ({ data, selected }) => (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: 8, height: 8 }} />
      <div style={nodeStyles('#fee2e2', selected)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon type="end" />
          <div style={{ fontWeight: 600, color: '#1f2937' }}>{data?.title || 'End'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: 8, height: 8 }} />
    </>
  ),
};

function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeAdd, // ← required for drop
}) {
  const { project, fitView } = useReactFlow();

  /* ---------- drop handler – never whites out ---------- */
  const onDrop = useCallback(
    (e) => {
      try {
        e.preventDefault();
        const raw = e.dataTransfer.getData('application/reactflow');
        if (!raw) return;
        const nodeType = JSON.parse(raw);
        if (!nodeType?.type || !nodeType?.label) {
          console.warn('Drop ignored – invalid payload', nodeType);
          return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const position = project({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        if (typeof onNodeAdd !== 'function') {
          console.error('onNodeAdd is not a function – check props');
          return;
        }
        onNodeAdd(nodeType, position);
      } catch (err) {
        console.error('Drop crash prevented:', err);
      }
    },
    [project, onNodeAdd]
  );

  const onDragOver = useCallback((e) => e.preventDefault(), []);

  const onInit = useCallback(() => {
    setTimeout(() => fitView({ duration: 300 }), 100);
  }, [fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(ev, n) => onNodeClick?.(n)}
      nodeTypes={nodeTypes}
      fitView
      onInit={onInit}
      onDrop={onDrop} // ← makes drag work
      onDragOver={onDragOver} // ← required
      attributionPosition="bottom-right"
      defaultEdgeOptions={{ type: 'smoothstep', animated: true, style: { stroke: '#94a3b8', strokeWidth: 1.5 } }}
    >
      <Background variant="dots" gap={12} size={1} color="#e5e7eb" />
      <Controls />
      <MiniMap nodeStrokeColor={() => '#6b7280'} nodeColor="#fff" />
    </ReactFlow>
  );
}

export default WorkflowCanvas;