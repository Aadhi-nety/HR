const mockAutomations = [
  { 
    id: 'send_email', 
    label: 'Send Email', 
    params: ['to', 'subject', 'body', 'template'],
    description: 'Send automated email notification'
  },
  { 
    id: 'generate_doc', 
    label: 'Generate Document', 
    params: ['template', 'recipient', 'data_source'],
    description: 'Generate and store document'
  },
  { 
    id: 'update_hr_system', 
    label: 'Update HR System', 
    params: ['employee_id', 'field', 'value', 'effective_date'],
    description: 'Update employee records in HR system'
  },
  { 
    id: 'send_notification', 
    label: 'Send Notification', 
    params: ['channel', 'message', 'recipients'],
    description: 'Send notification via various channels'
  },
  { 
    id: 'create_task', 
    label: 'Create Task', 
    params: ['assignee', 'title', 'description', 'due_date'],
    description: 'Create follow-up task'
  },
  { 
    id: 'update_status', 
    label: 'Update Status', 
    params: ['status', 'message', 'notify_users'],
    description: 'Update workflow status'
  },
];

const simulateWorkflow = async (workflow) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const steps = [];
  let currentNode = workflow.nodes.find(n => n.type === 'start');
  
  if (!currentNode) {
    throw new Error('No start node found');
  }
  
  // Add start step
  steps.push({
    step: 1,
    nodeId: currentNode.id,
    nodeType: currentNode.type,
    action: `Starting workflow: ${currentNode.data.title || 'HR Workflow'}`,
    timestamp: new Date().toISOString(),
    status: 'completed'
  });
  
  // Find linear path (simplified simulation)
  let stepCount = 2;
  let visitedNodes = new Set([currentNode.id]);
  
  while (currentNode && currentNode.type !== 'end') {
    // Find next node (take first outgoing connection)
    const outgoingEdge = workflow.edges.find(e => e.source === currentNode.id);
    
    if (!outgoingEdge) {
      break;
    }
    
    const nextNode = workflow.nodes.find(n => n.id === outgoingEdge.target);
    
    if (!nextNode) {
      steps.push({
        step: stepCount,
        nodeId: 'error',
        nodeType: 'error',
        action: `Error: Target node not found for edge from ${currentNode.id}`,
        timestamp: new Date().toISOString(),
        status: 'failed'
      });
      break;
    }
    
    if (visitedNodes.has(nextNode.id)) {
      steps.push({
        step: stepCount,
        nodeId: nextNode.id,
        nodeType: nextNode.type,
        action: `⚠️ Circular reference detected at ${nextNode.data.title || nextNode.type}`,
        timestamp: new Date().toISOString(),
        status: 'warning'
      });
      break;
    }
    
    visitedNodes.add(nextNode.id);
    currentNode = nextNode;
    
    // Simulate node execution
    let action = '';
    switch (currentNode.type) {
      case 'task':
        const assignee = currentNode.data.assignee || 'Unassigned';
        action = `Task assigned to ${assignee}: ${currentNode.data.title}`;
        break;
      case 'approval':
        const approver = currentNode.data.approverRole || 'Manager';
        action = `Waiting for ${approver} approval: ${currentNode.data.title}`;
        // Simulate auto-approval if threshold is set
        if (currentNode.data.autoApproveThreshold > 0) {
          action += ` (auto-approve in ${currentNode.data.autoApproveThreshold}h)`;
        }
        break;
      case 'automated':
        const automation = mockAutomations.find(a => a.id === currentNode.data.action);
        action = `Executing automated action: ${automation?.label || 'Unknown action'}`;
        if (currentNode.data.params) {
          const paramStr = Object.entries(currentNode.data.params)
            .filter(([_, v]) => v)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ');
          if (paramStr) action += ` with params: ${paramStr}`;
        }
        break;
      case 'end':
        action = `Workflow completed: ${currentNode.data.message || 'Success'}`;
        break;
      default:
        action = `Processing ${currentNode.type} node: ${currentNode.data.title || currentNode.id}`;
    }
    
    steps.push({
      step: stepCount,
      nodeId: currentNode.id,
      nodeType: currentNode.type,
      action,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
    
    stepCount++;
    
    // Small delay between steps
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return {
    success: true,
    steps,
    summary: {
      totalSteps: steps.length,
      completedAt: new Date().toISOString(),
      successRate: '100%',
      duration: `${(steps.length * 0.2 + 1).toFixed(1)}s`,
    }
  };
};

export const mockAPI = {
  getAutomations: () => Promise.resolve(mockAutomations),
  simulateWorkflow,
};