import type { Job, JobStatus, RiskLevel } from '../contracts/runtime';

export interface EnqueueInput<TInput> {
  type: string;
  risk: RiskLevel;
  input: TInput;
  requestedBy: string;
  deviceId: string;
  policyVersion: string;
  idempotencyKey: string;
  maxAttempts?: number;
  deadlineAt?: string;
}

const jobs = new Map<string, Job>();
const idempotency = new Map<string, string>();

function id() {
  return globalThis.crypto?.randomUUID?.() ?? `job_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function enqueue<TInput>(input: EnqueueInput<TInput>): Job<TInput> {
  const existingId = idempotency.get(input.idempotencyKey);
  if (existingId) return jobs.get(existingId) as Job<TInput>;
  const job: Job<TInput> = {
    id: id(), type: input.type, risk: input.risk, status: 'queued', attempt: 0,
    maxAttempts: Math.max(1, input.maxAttempts ?? 3), input: input.input,
    context: {
      correlationId: id(), requestedBy: input.requestedBy, deviceId: input.deviceId,
      policyVersion: input.policyVersion, idempotencyKey: input.idempotencyKey,
      deadlineAt: input.deadlineAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
  };
  jobs.set(job.id, job); idempotency.set(input.idempotencyKey, job.id); return job;
}

export function getJob(jobId: string) { return jobs.get(jobId); }
export function listJobs(status?: JobStatus) {
  return [...jobs.values()].filter((job) => !status || job.status === status).sort((a, b) => b.context.correlationId.localeCompare(a.context.correlationId));
}

export function transition(jobId: string, status: JobStatus): Job | undefined {
  const job = jobs.get(jobId); if (!job) return undefined;
  job.status = status; if (status === 'running' || status === 'retrying') job.attempt += 1;
  jobs.set(jobId, job); return job;
}
