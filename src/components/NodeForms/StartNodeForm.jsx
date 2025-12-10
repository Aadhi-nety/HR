import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function StartNodeForm({ data, onUpdate }) {
  /* ------------- state ------------- */
  const [formData, setFormData] = useState({
    title: 'Start Process',
    description: '',
    trigger: 'manual',
    metadata: [],
  });

  /* ------------- sync ------------- */
  useEffect(() => {
    setFormData({
      title: data.title || 'Start Process',
      description: data.description || '',
      trigger: data.trigger || 'manual',
      metadata: Array.isArray(data.metadata) ? data.metadata : [],
    });
  }, [data]);

  /* ------------- handlers ------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const addMetadata = () =>
    setFormData((prev) => ({
      ...prev,
      metadata: [...prev.metadata, { key: '', value: '' }],
    }));

  const updateMetadata = (idx, field, val) =>
    setFormData((prev) => ({
      ...prev,
      metadata: prev.metadata.map((item, i) =>
        i === idx ? { ...item, [field]: val } : item
      ),
    }));

  const removeMetadata = (idx) =>
    setFormData((prev) => ({
      ...prev,
      metadata: prev.metadata.filter((_, i) => i !== idx),
    }));

  /* ------------- render ------------- */
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="node-form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="form-group">
        <label>Title *</label>
        <input
          name="title"
          type="text"
          required
          placeholder="Enter start node title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Describe what triggers this workflow"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Trigger Type</label>
        <select name="trigger" value={formData.trigger} onChange={handleChange}>
          <option value="manual">Manual Trigger</option>
          <option value="scheduled">Scheduled</option>
          <option value="event">Event-based</option>
          <option value="api">API Call</option>
        </select>
      </div>

      <div className="metadata-section">
        <div className="section-header">
          <label>Metadata</label>
          <button type="button" className="btn-add" onClick={addMetadata}>
            + Add
          </button>
        </div>

        {formData.metadata.map((item, idx) => (
          <motion.div
            key={idx}
            className="metadata-item"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              className="metadata-key"
              placeholder="Key"
              value={item.key}
              onChange={(e) => updateMetadata(idx, 'key', e.target.value)}
            />
            <input
              className="metadata-value"
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateMetadata(idx, 'value', e.target.value)}
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeMetadata(idx)}
            >
              ×
            </button>
          </motion.div>
        ))}

        {formData.metadata.length === 0 && (
          <p className="empty-hint">No metadata added</p>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </motion.form>
  );
}

export default StartNodeForm;