export type ModelCapability =
  | 'reasoning'
  | 'coding'
  | 'vision'
  | 'tool_use'
  | 'structured_output'
  | 'long_context';

export interface ModelDescriptor {
  id: string;
  provider: string;
  version: string;
  capabilities: ModelCapability[];
  contextWindow?: number;
  costClass: 'low' | 'standard' | 'premium';
  status: 'active' | 'shadow' | 'disabled';
}

export interface ModelRequest {
  task: string;
  capabilities: ModelCapability[];
  input: unknown;
  maxLatencyMs?: number;
  maxCostClass?: ModelDescriptor['costClass'];
}

export interface ModelResponse {
  model: ModelDescriptor;
  output: unknown;
  correlationId: string;
  latencyMs: number;
}
