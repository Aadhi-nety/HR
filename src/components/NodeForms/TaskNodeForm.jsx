import React, { useState, useEffect } from 'react';

function TaskNodeForm({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    estimatedHours: '',
  });

  useEffect(() => {
    setFormData({
      title: data.title || 'New Task',
      description: data.description || '',
      assignee: data.assignee || '',
      dueDate: data.dueDate || '',
      priority: data.priority || 'medium',
      estimatedHours: data.estimatedHours || '',
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="node-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task requirements"
          rows="3"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assignee">Assignee</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            placeholder="e.g., HR Manager"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={today}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="estimatedHours">Est. Hours</label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.5"
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default TaskNodeForm;