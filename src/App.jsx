import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowCanvas from './components/Canvas/WorkflowCanvas';
import NodePalette from './components/Sidebar/NodePalette';
import NodeFormPanel from './components/NodeForms/NodeFormPanel';
import SandboxPanel from './components/Sandbox/SandboxPanel';
import WorkflowControls from './components/Sidebar/WorkflowControls';
import { useWorkflow } from './hooks/useWorkflow';
import { motion } from 'framer-motion';
import './App.css';

/* SVG filter for pencil texture – once */
const PencilFilter = () => (
  <svg width="0" height="0">
    <defs>
      <filter id="pencilTexture">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="noise"/>
        <feColorMatrix in="noise" type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 .03 0"/>
        <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
      </filter>
    </defs>
  </svg>
);

function AppContent() {
  const {
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
  } = useWorkflow();

  return (
    <div className="app">
      <PencilFilter />

      <motion.header
        className="app-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="header-title">
          <h1>HR Lab</h1>
          <p>Design & test workflows visually</p>
        </div>
        <WorkflowControls onClear={clearCanvas} workflow={serializeWorkflow()} />
      </motion.header>

      <motion.div
        className="app-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <aside className="sidebar left-sidebar">
          <NodePalette onNodeAdd={addNode} />
        </aside>

        <main className="canvas-area">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeAdd={addNode} // ← makes drag-drop work
          />
        </main>

        <aside className="sidebar right-sidebar">
          {selectedNode ? (
            <NodeFormPanel
              node={selectedNode}
              onUpdate={updateNode}
              onDelete={deleteNode}
            />
          ) : (
            <div className="empty-panel">
              <div className="empty-icon">📋</div>
              <h3>No Node Selected</h3>
              <p>Click any node to configure</p>
            </div>
          )}
        </aside>
      </motion.div>

      <SandboxPanel workflow={serializeWorkflow()} />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}