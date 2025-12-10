import React, { useState, useEffect } from 'react';

function ApprovalNodeForm({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    approverRole: 'manager',
    autoApproveThreshold: 24,
    requireComment: true,
    approvalType: 'single',
  });

  useEffect(() => {
    setFormData({
      title: data.title || 'Approval Required',
      description: data.description || '',
      approverRole: data.approverRole || 'manager',
      autoApproveThreshold: data.autoApproveThreshold || 24,
      requireComment: data.requireComment !== false,
      approvalType: data.approvalType || 'single',
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

  const approverRoles = [
    { value: 'manager', label: 'Manager' },
    { value: 'hrbp', label: 'HR Business Partner' },
    { value: 'director', label: 'Director' },
    { value: 'vp', label: 'Vice President' },
    { value: 'specific', label: 'Specific Person' },
  ];

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
          placeholder="Enter approval title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what needs approval"
          rows="2"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="approverRole">Approver Role</label>
        <select
          id="approverRole"
          name="approverRole"
          value={formData.approverRole}
          onChange={handleChange}
        >
          {approverRoles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="autoApproveThreshold">
          Auto-approve after (hours)
        </label>
        <input
          type="number"
          id="autoApproveThreshold"
          name="autoApproveThreshold"
          value={formData.autoApproveThreshold}
          onChange={handleChange}
          min="0"
          max="168"
          step="1"
        />
        <small className="hint">
          Set to 0 to disable auto-approval
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="approvalType">Approval Type</label>
        <select
          id="approvalType"
          name="approvalType"
          value={formData.approvalType}
          onChange={handleChange}
        >
          <option value="single">Single Approver</option>
          <option value="multiple">Multiple Approvers</option>
          <option value="any">Any One Approver</option>
        </select>
      </div>
      
      <div className="form-check">
        <input
          type="checkbox"
          id="requireComment"
          name="requireComment"
          checked={formData.requireComment}
          onChange={handleChange}
        />
        <label htmlFor="requireComment">
          Require comment for approval/rejection
        </label>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default ApprovalNodeForm;