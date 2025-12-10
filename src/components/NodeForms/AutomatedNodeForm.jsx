import React, { useState, useEffect } from 'react';
import { mockAPI } from '../../services/mockAPI';

function AutomatedNodeForm({ data, onUpdate }) {
  const [automations, setAutomations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    action: 'send_email',
    params: {},
  });

  useEffect(() => {
    // Load automations from mock API
    mockAPI.getAutomations().then(setAutomations);
  }, []);

  useEffect(() => {
    setFormData({
      title: data.title || 'Automated Action',
      description: data.description || '',
      action: data.action || 'send_email',
      params: data.params || {},
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParamChange = (paramName, value) => {
    setFormData(prev => ({
      ...prev,
      params: { ...prev.params, [paramName]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const selectedAutomation = automations.find(a => a.id === formData.action);
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
          placeholder="Enter action title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this automated step does"
          rows="2"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="action">Action Type</label>
        <select
          id="action"
          name="action"
          value={formData.action}
          onChange={handleChange}
        >
          {automations.map(auto => (
            <option key={auto.id} value={auto.id}>
              {auto.label}
            </option>
          ))}
        </select>
      </div>
      
      {selectedAutomation && (
        <div className="action-params">
          <h4>Action Parameters</h4>
          {selectedAutomation.params.map(param => (
            <div key={param} className="form-group">
              <label htmlFor={`param-${param}`}>
                {param.charAt(0).toUpperCase() + param.slice(1)}
              </label>
              {param === 'template' ? (
                <select
                  id={`param-${param}`}
                  value={formData.params[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                >
                  <option value="">Select template</option>
                  <option value="offer_letter">Offer Letter</option>
                  <option value="welcome_email">Welcome Email</option>
                  <option value="exit_document">Exit Document</option>
                </select>
              ) : param === 'channel' ? (
                <select
                  id={`param-${param}`}
                  value={formData.params[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                >
                  <option value="">Select channel</option>
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="teams">Microsoft Teams</option>
                </select>
              ) : param === 'dueDate' ? (
                <input
                  type="date"
                  id={`param-${param}`}
                  value={formData.params[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  min={today}
                />
              ) : (
                <input
                  type="text"
                  id={`param-${param}`}
                  value={formData.params[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  placeholder={`Enter ${param}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default AutomatedNodeForm;