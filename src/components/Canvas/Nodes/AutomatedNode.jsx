import React from 'react';
import { Handle, Position } from 'reactflow';

function AutomatedNode({ data, selected }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'send_email': return '✉️';
      case 'generate_doc': return '📄';
      case 'update_hr_system': return '💾';
      case 'send_notification': return '🔔';
      default: return '⚡';
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'send_email': return 'Send Email';
      case 'generate_doc': return 'Generate Doc';
      case 'update_hr_system': return 'Update System';
      case 'send_notification': return 'Send Notification';
      default: return 'Automated Action';
    }
  };

  return (
    <div className={`custom-node automated-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-icon">🤖</div>
        <div className="node-text">
          <h4>{data.title || 'Automated Step'}</h4>
          <div className="node-details">
            <div className="detail-item">
              <span className="detail-label">
                {getActionIcon(data.action || 'send_email')}
              </span>
              <span>{getActionLabel(data.action || 'send_email')}</span>
            </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default AutomatedNode;