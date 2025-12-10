import React from 'react';
import { Handle, Position } from 'reactflow';

function TaskNode({ data, selected }) {
  return (
    <div className={`custom-node task-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-icon">📋</div>
        <div className="node-text">
          <h4>{data.title || 'Task'}</h4>
          <div className="node-details">
            {data.assignee && (
              <div className="detail-item">
                <span className="detail-label">👤</span>
                <span>{data.assignee}</span>
              </div>
            )}
            {data.dueDate && (
              <div className="detail-item">
                <span className="detail-label">📅</span>
                <span>{data.dueDate}</span>
              </div>
            )}
            {data.priority && (
              <div className={`priority-badge priority-${data.priority}`}>
                {data.priority}
              </div>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TaskNode;