import React from "react";
import { Handle, Position } from "reactflow";

function StartNode({ data, selected }) {
  return (
    <div style={{
      background: "#d1fae5",
      border: `3px solid ${selected ? "#667eea" : "#10b981"}`,
      borderRadius: "12px",
      padding: "15px",
      minWidth: "180px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}>
      <Handle type="source" position={Position.Bottom} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ fontSize: "1.5rem" }}></div>
        <div>
          <h4 style={{ margin: "0 0 5px 0", color: "#1f2937" }}>
            {data?.title || "Start Process"}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default StartNode;
