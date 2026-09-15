import type { PolicyResult, RiskLevel } from '../contracts/runtime';

export interface PolicyInput {
  risk: RiskLevel;
  requestedBy: string;
  ownerApproval?: boolean;
  automationGrant?: boolean;
  now?: Date;
}

const approvalTtlMs = 15 * 60 * 1000;

export function evaluatePolicy(input: PolicyInput): PolicyResult {
  const now = input.now ?? new Date();
  if (!input.requestedBy.trim()) {
    return { decision: 'deny', reason: 'requester_required', requiresApproval: false };
  }
  if (input.risk === 'R0' || input.risk === 'R1') {
    return { decision: 'allow', reason: 'bounded_low_risk', requiresApproval: false };
  }
  if (input.risk === 'R2') {
    if (input.ownerApproval || input.automationGrant) {
      return {
        decision: 'allow',
        reason: input.ownerApproval ? 'owner_approved' : 'versioned_automation_grant',
        requiresApproval: false,
        expiresAt: new Date(now.getTime() + approvalTtlMs).toISOString(),
      };
    }
    return { decision: 'approve', reason: 'external_side_effect_requires_approval', requiresApproval: true };
  }
  if (input.ownerApproval) {
    return {
      decision: 'allow',
      reason: 'owner_approved_high_risk',
      requiresApproval: false,
      expiresAt: new Date(now.getTime() + approvalTtlMs).toISOString(),
    };
  }
  return { decision: 'deny', reason: 'production_or_destructive_action_requires_owner_approval', requiresApproval: true };
}
