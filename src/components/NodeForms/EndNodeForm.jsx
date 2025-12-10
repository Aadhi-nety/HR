import React, { useState, useEffect } from 'react';

function EndNodeForm({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    summary: true,
    notifyUsers: false,
    exportData: false,
  });

  useEffect(() => {
    setFormData({
      title: data.title || 'End Process',
      message: data.message || 'Workflow completed successfully',
      summary: data.summary !== false,
      notifyUsers: data.notifyUsers || false,
      exportData: data.exportData || false,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

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
          placeholder="Enter end node title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Completion Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message to display when workflow completes"
          rows="3"
        />
      </div>
      
      <div className="form-check-group">
        <div className="form-check">
          <input
            type="checkbox"
            id="summary"
            name="summary"
            checked={formData.summary}
            onChange={handleChange}
          />
          <label htmlFor="summary">
            Generate summary report
          </label>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="notifyUsers"
            name="notifyUsers"
            checked={formData.notifyUsers}
            onChange={handleChange}
          />
          <label htmlFor="notifyUsers">
            Notify involved users
          </label>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="exportData"
            name="exportData"
            checked={formData.exportData}
            onChange={handleChange}
          />
          <label htmlFor="exportData">
            Export workflow data
          </label>
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

export default EndNodeForm;