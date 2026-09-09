export type RiskLevel = 'R0' | 'R1' | 'R2' | 'R3';
export type JobStatus = 'queued' | 'running' | 'retrying' | 'succeeded' | 'failed' | 'dead_lettered' | 'cancelled';
export type PolicyDecision = 'allow' | 'approve' | 'deny';

export interface ExecutionContext {
  correlationId: string;
  requestedBy: string;
  deviceId: string;
  policyVersion: string;
  idempotencyKey: string;
  deadlineAt: string;
}

export interface Job<TInput = unknown> {
  id: string;
  type: string;
  risk: RiskLevel;
  status: JobStatus;
  attempt: number;
  maxAttempts: number;
  input: TInput;
  context: ExecutionContext;
}

export interface PolicyResult {
  decision: PolicyDecision;
  reason: string;
  requiresApproval: boolean;
  expiresAt?: string;
}

export interface ToolContract<TInput = unknown, TOutput = unknown> {
  id: string;
  version: string;
  risk: RiskLevel;
  timeoutMs: number;
  maxConcurrency: number;
  reversible: boolean;
  execute(input: TInput, context: ExecutionContext): Promise<TOutput>;
}
