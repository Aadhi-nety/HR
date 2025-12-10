import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* thin-line monochrome icons */
const icons = {
  nodes: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  connections: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  tasks: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  automated: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10h8M8 6v8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  run: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 3l7 4-7 4V3z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
};

function SandboxPanel({ workflow }) {
  const [isTesting, setIsTesting] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState([]);

  /* ---------- validation ---------- */
  const validateWorkflow = () => {
    const errors = [];
    const nodes = workflow.nodes;
    const edges = workflow.edges;

    const start = nodes.find((n) => n.type === 'start');
    const end = nodes.find((n) => n.type === 'end');

    if (!start) errors.push('Workflow must have a Start node');
    if (!end) errors.push('Workflow must have an End node');
    if (start && edges.filter((e) => e.source === start.id).length === 0)
      errors.push('Start node must be connected');

    nodes.forEach((n) => {
      if (n.type === 'start' || n.type === 'end') return;
      const inEdges = edges.filter((e) => e.target === n.id).length;
      const outEdges = edges.filter((e) => e.source === n.id).length;
      if (inEdges === 0) errors.push(`"${n.data.title || n.id}" has no incoming connection`);
      if (outEdges === 0) errors.push(`"${n.data.title || n.id}" has no outgoing connection`);
    });

    return errors;
  };

  /* ---------- run test ---------- */
  const handleTest = async () => {
    const errors = validateWorkflow();
    setValidationErrors(errors);
    if (errors.length > 0) return;

    setIsTesting(true);
    setResults(null);
    setError(null);

    // simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    // replace with real mockAPI call
    setResults({
      success: true,
      steps: workflow.nodes.map((n, i) => ({
        step: i + 1,
        nodeId: n.id,
        nodeType: n.type,
        action: 'Simulated',
        timestamp: new Date().toISOString(),
        status: 'completed',
      })),
      summary: {
        totalSteps: workflow.nodes.length,
        completedAt: new Date().toISOString(),
        successRate: '100 %',
        duration: `${workflow.nodes.length * 0.2}s`,
      },
    });
    setIsTesting(false);
  };

  const stats = [
    { key: 'nodes', label: 'Total Nodes', value: workflow.nodes.length, icon: icons.nodes },
    { key: 'connections', label: 'Connections', value: workflow.edges.length, icon: icons.connections },
    { key: 'tasks', label: 'Tasks', value: workflow.nodes.filter((n) => n.type === 'task').length, icon: icons.tasks },
    { key: 'automated', label: 'Automated', value: workflow.nodes.filter((n) => n.type === 'automated').length, icon: icons.automated },
  ];

  return (
    <motion.div
      className="sandbox-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="sandbox-header">
        <div>
          <h3>Workflow Testing Sandbox</h3>
          <p className="sandbox-subtitle">Simulate execution</p>
        </div>
        <motion.button
          className="btn-run"
          onClick={handleTest}
          disabled={isTesting || stats[0].value === 0}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="btn-icon">{icons.run}</span>
          {isTesting ? 'Running…' : 'Run Test'}
        </motion.button>
      </div>

      <div className="sandbox-stats">
        {stats.map((s) => (
          <motion.div
            key={s.key}
            className="stat-card"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-text">
              <span className="stat-label">{s.label}</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={s.value}
                  className="stat-value"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {s.value}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {validationErrors.length > 0 && (
        <motion.div
          className="validation-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h4>Validation</h4>
          <ul>
            {validationErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {results && (
        <motion.div
          className="results-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="results-header">
            <div>
              <h4>Test Results</h4>
              <p className="timestamp">{new Date(results.summary.completedAt).toLocaleTimeString()}</p>
            </div>
            <span className="success-badge">✓ {results.summary.successRate} success</span>
          </div>
          {/* replace with your ExecutionLog component */}
          <pre className="results-log">{JSON.stringify(results.steps, null, 2)}</pre>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SandboxPanel;