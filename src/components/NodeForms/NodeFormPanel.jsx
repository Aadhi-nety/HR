import React from "react";
import StartNodeForm from "./StartNodeForm";
import TaskNodeForm from "./TaskNodeForm";
import ApprovalNodeForm from "./ApprovalNodeForm";
import AutomatedNodeForm from "./AutomatedNodeForm";
import EndNodeForm from "./EndNodeForm";

function NodeFormPanel({ node, onUpdate, onDelete }) {
  // FIX: Ensure node.type is a string
  if (!node || !node.type) {
    return (
      <div className="node-form-panel">
        <div className="empty-panel">
          <div className="empty-icon">📋</div>
          <h3>No Node Selected</h3>
          <p>Click on any node to configure its properties</p>
        </div>
      </div>
    );
  }

  const nodeType = String(node.type); // Convert to string
  
  const renderForm = () => {
    switch (nodeType) {
      case "start":
        return <StartNodeForm data={node.data} onUpdate={(data) => onUpdate(node.id, data)} />;
      case "task":
        return <TaskNodeForm data={node.data} onUpdate={(data) => onUpdate(node.id, data)} />;
      case "approval":
        return <ApprovalNodeForm data={node.data} onUpdate={(data) => onUpdate(node.id, data)} />;
      case "automated":
        return <AutomatedNodeForm data={node.data} onUpdate={(data) => onUpdate(node.id, data)} />;
      case "end":
        return <EndNodeForm data={node.data} onUpdate={(data) => onUpdate(node.id, data)} />;
      default:
        return <div>Unknown node type: {nodeType}</div>;
    }
  };

  return (
    <div className="node-form-panel">
      <div className="panel-header">
        <div>
          <h3>Configure Node</h3>
          <p className="node-type-label">
            {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node
          </p>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(node.id)}
          title="Delete node"
          style={{ padding: "0.5rem" }}
        >
          🗑️
        </button>
      </div>
      
      {renderForm()}
      
      <div className="node-info">
        <h4>Node Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">ID:</span>
            <span className="info-value">{node.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Position:</span>
            <span className="info-value">
              {Math.round(node.position?.x || 0)}px, {Math.round(node.position?.y || 0)}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NodeFormPanel;
