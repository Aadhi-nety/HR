// Type definitions for HR Workflow Designer

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNodeData {
  title: string;
  description?: string;
  [key: string]: any; // Additional properties for specific node types
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

export interface Workflow {
  id: string;
  name: string;
  createdAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata?: {
    version: string;
    nodeCount: number;
    edgeCount: number;
  };
}

export interface AutomationAction {
  id: string;
  label: string;
  description?: string;
  params: string[];
}

export interface StartNodeData extends WorkflowNodeData {
  trigger: 'manual' | 'scheduled' | 'event' | 'api';
  metadata?: Array<{ key: string; value: string }>;
}

export interface TaskNodeData extends WorkflowNodeData {
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
}

export interface ApprovalNodeData extends WorkflowNodeData {
  approverRole: string;
  autoApproveThreshold: number;
  requireComment: boolean;
  approvalType: 'single' | 'multiple' | 'any';
}

export interface AutomatedNodeData extends WorkflowNodeData {
  action: string;
  params: Record<string, any>;
}

export interface EndNodeData extends WorkflowNodeData {
  message: string;
  summary: boolean;
  notifyUsers: boolean;
  exportData: boolean;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

// Simulation types
export interface SimulationStep {
  step: number;
  nodeId: string;
  nodeType: NodeType;
  action: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'warning';
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  summary: {
    totalSteps: number;
    completedAt: string;
    successRate: string;
    duration: string;
  };
}

// Mock API types
export interface MockAPIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type AutomationListResponse = MockAPIResponse<AutomationAction[]>;
export type SimulationResponse = MockAPIResponse<SimulationResult>;