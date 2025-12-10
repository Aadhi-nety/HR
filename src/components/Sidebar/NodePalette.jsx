import React from 'react';
import { motion } from 'framer-motion';

/* monochrome thin-line icons – no emojis */
const icons = {
  start: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/></svg>
  ),
  task: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
  ),
  approval: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l6 3.5v7L8 14l-6-3.5v-7L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
  ),
  automated: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
  ),
  end: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/></svg>
  ),
};

const paletteNodes = [
  { type: 'start',   label: 'Start',   desc: 'Workflow entry point' },
  { type: 'task',    label: 'Task',    desc: 'Human task or assignment' },
  { type: 'approval',label: 'Approval',desc: 'Manager approval step' },
  { type: 'automated',label:'Automated',desc:'System-triggered action' },
  { type: 'end',     label: 'End',     desc: 'Workflow completion' },
];

export default function NodePalette({ onNodeAdd }) {
  /* drag start – same as before */
  const onDragStart = (e, nodeType) => {
    try {
      e.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType));
      e.dataTransfer.effectAllowed = 'move';
    } catch (err) {
      console.error('Drag start failed:', err);
    }
  };

  /* click to add – accessibility bonus */
  const onClickAdd = (nodeType) => {
    if (typeof onNodeAdd !== 'function') {
      console.error('onNodeAdd is not a function');
      return;
    }
    // add at a default position (center of viewport)
    onNodeAdd(nodeType, { x: 250, y: 150 });
  };

  return (
    <motion.div
      className="palette"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="palette-header">NODE PALETTE</div>

      <div className="palette-list">
        {paletteNodes.map((n) => (
          <motion.div
            key={n.type}
            className="palette-item"
            draggable
            onDragStart={(e) => onDragStart(e, n)}
            onClick={() => onClickAdd(n)} // ← click-to-add
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="palette-icon">{icons[n.type]}</div>
            <div className="palette-text">
              <div className="palette-label">{n.label}</div>
              <div className="palette-desc">{n.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="palette-tip">Tip: Click or drag nodes to add them to the canvas</div>
    </motion.div>
  );
}