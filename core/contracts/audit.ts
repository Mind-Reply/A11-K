export type AuditOutcome = 'accepted' | 'rejected' | 'started' | 'succeeded' | 'failed' | 'rolled_back';

export interface AuditEvent {
  id: string;
  occurredAt: string;
  actor: string;
  deviceId?: string;
  action: string;
  resource: string;
  outcome: AuditOutcome;
  correlationId: string;
  policyVersion: string;
  executionId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}
