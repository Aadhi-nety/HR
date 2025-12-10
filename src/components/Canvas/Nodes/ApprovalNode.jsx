import React from 'react';
import { Handle, Position } from 'reactflow';

function ApprovalNode({ data, selected }) {
  return (
    <div className={`custom-node approval-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-icon">✅</div>
        <div className="node-text">
          <h4>{data.title || 'Approval'}</h4>
          <div className="node-details">
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{data.approverRole || 'Manager'}</span>
            </div>
            {data.autoApproveThreshold && (
              <div className="detail-item">
                <span className="detail-label">⏱️</span>
                <span>{data.autoApproveThreshold}h auto-approve</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default ApprovalNode;