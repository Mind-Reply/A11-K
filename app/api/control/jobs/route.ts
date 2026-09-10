import { NextRequest, NextResponse } from 'next/server';
import { enqueue, listJobs } from '../../../../core/jobs/queue';
import { evaluatePolicy } from '../../../../core/policy/engine';
import type { RiskLevel } from '../../../../core/contracts/runtime';

const risks: RiskLevel[] = ['R0', 'R1', 'R2', 'R3'];

export async function GET() {
  return NextResponse.json({ ok: true, jobs: listJobs(), generatedAt: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const risk = risks.includes(body?.risk as RiskLevel) ? body?.risk as RiskLevel : 'R0';
  const requestedBy = typeof body?.requestedBy === 'string' ? body.requestedBy : '';
  const policy = evaluatePolicy({ risk, requestedBy, ownerApproval: body?.ownerApproval === true, automationGrant: body?.automationGrant === true });
  if (policy.decision !== 'allow') return NextResponse.json({ ok: false, policy }, { status: policy.decision === 'approve' ? 202 : 403 });
  const job = enqueue({
    type: typeof body?.type === 'string' ? body.type : 'control.dispatch',
    risk, input: body?.input ?? {}, requestedBy,
    deviceId: typeof body?.deviceId === 'string' ? body.deviceId : 'unknown-device',
    policyVersion: 'v1', idempotencyKey: typeof body?.idempotencyKey === 'string' ? body.idempotencyKey : `${requestedBy}:${Date.now()}`,
  });
  return NextResponse.json({ ok: true, policy, job }, { status: 201 });
}
