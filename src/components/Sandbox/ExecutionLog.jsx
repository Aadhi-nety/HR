import React from 'react';

function ExecutionLog({ steps }) {
  const getNodeTypeIcon = (type) => {
    switch (type) {
      case 'start': return '🚀';
      case 'task': return '📋';
      case 'approval': return '✅';
      case 'automated': return '🤖';
      case 'end': return '🏁';
      default: return '⚪';
    }
  };

  return (
    <div className="execution-log">
      {steps.length === 0 ? (
        <div className="empty-log">
          No execution steps recorded
        </div>
      ) : (
        steps.map((step) => (
          <div key={step.step} className="log-entry">
            <div className="log-step">
              {step.step}
            </div>
            <div className="log-icon">
              {getNodeTypeIcon(step.nodeType)}
            </div>
            <div className="log-details">
              <div className="log-action">
                {step.action}
              </div>
              <div className="log-info">
                <span className="log-node">
                  Node: {step.nodeId.split('_')[0]}
                </span>
                <span className="log-time">
                  {new Date(step.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className={`log-status status-${step.status}`}>
              {step.status}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ExecutionLog;