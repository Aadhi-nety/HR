import React from 'react';
import { Handle, Position } from 'reactflow';

function EndNode({ data, selected }) {
  return (
    <div className={`custom-node end-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-icon">🏁</div>
        <div className="node-text">
          <h4>{data.title || 'End Process'}</h4>
          {data.message && (
            <p className="node-description">{data.message}</p>
          )}
        </div>
      </div>
      <div className="node-badge">End</div>
    </div>
  );
}

export default EndNode;