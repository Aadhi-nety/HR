import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function WorkflowControls({ onClear, workflow }) {
  /* ---------- export ---------- */
  const handleExport = () => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `workflow-${new Date().toISOString().split('T')[0]}.json`;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = exportFileDefaultName;
    link.click();
  };

  /* ---------- import ---------- */
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = JSON.parse(ev.target.result);
        alert('Import successful – check console for now');
        console.log('Imported workflow:', content);
      } catch {
        alert('Invalid file');
      }
    };
    reader.readAsText(file);
  };

  /* ---------- animated counter ---------- */
  const nodeCount = workflow.nodes.length;
  const edgeCount = workflow.edges.length;

  return (
    <motion.div
      className="workflow-controls"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="controls-row">
        <motion.button
          className="btn btn-primary"
          onClick={handleExport}
          disabled={nodeCount === 0}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Export
        </motion.button>

        <label className="btn btn-secondary">
          Import
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>

        <motion.button
          className="btn btn-danger"
          onClick={onClear}
          disabled={nodeCount === 0}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Clear
        </motion.button>
      </div>

      <div className="controls-stats">
        <Stat label="Nodes" value={nodeCount} />
        <Stat label="Connections" value={edgeCount} />
      </div>
    </motion.div>
  );
}

/* tiny animated counter */
function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          className="stat-value"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default WorkflowControls;