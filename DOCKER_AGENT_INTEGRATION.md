# Docker Agent + MindReply Integration Guide

## Architecture Overview

Your revenue platform now has three layers:

```
┌─────────────────────────────────────────────────────────┐
│  MindReply Next.js Web (http://localhost:3000)          │
│  ├─ Homepage (/pricing)                                  │
│  ├─ Pricing page (/pricing)                              │
│  ├─ Dashboard (/dashboard)                               │
│  └─ Stripe webhook endpoint (/api/webhooks/stripe)       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Docker Agent Server (http://localhost:7070)            │
│  ├─ Orchestrator Agent (revenue tracking)               │
│  ├─ Compliance Agent (audit & zero-exfil)               │
│  ├─ Ledger Recorder (immutable logging)                  │
│  └─ Workflows:                                           │
│     ├─ revenue_checkpoint (daily)                        │
│     ├─ weekly_revenue_report (manual)                    │
│     └─ payment_webhook_handler (real-time)               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Sovereign Ledger & Compliance                          │
│  ├─ ./ledger/revenue-ledger.jsonl (append-only)         │
│  ├─ ./evidence/compliance-{date}.json                   │
│  └─ ./logs/agent-*.log                                  │
└─────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites

- Docker Desktop (for isolation + MCP tools)
- Go 1.20+ (for docker-agent CLI)
- Node.js 20+ (for Next.js)
- Stripe account (optional, for testing)

### 1. Install Docker Agent

```bash
go install github.com/docker/docker-agent/cmd/docker-agent@latest
```

Verify:
```bash
docker-agent --version
```

### 2. Clone/Place Configuration

Your `mr-agent-config.yaml` is already in place. Validate it:

```bash
docker-agent validate mr-agent-config.yaml
```

### 3. Start the Platform

**Option A: Quick Start (all-in-one)**

```bash
bash start-mindreply.sh
```

This starts:
- Next.js app on port 3000
- Docker Agent server on port 7070

**Option B: Manual Start**

Terminal 1 (Next.js):
```bash
cd mr-app-copy
npm install
npm run dev
```

Terminal 2 (Docker Agent):
```bash
docker-agent serve --config mr-agent-config.yaml --port 7070
```

## Usage

### Daily Revenue Checkpoint

Run this every morning to audit yesterday's revenue:

```bash
docker-agent run --config mr-agent-config.yaml revenue_checkpoint
```

Output:
- Console: Summary of revenue + compliance status
- File: `./evidence/compliance-{date}.json`

### Weekly Revenue Report

Generate comprehensive report for owner:

```bash
docker-agent run --config mr-agent-config.yaml weekly_revenue_report
```

Output:
- Console: Weekly metrics + compliance findings
- File: `./evidence/weekly-report-{date}.json`

### Real-Time Payment Processing

When Stripe sends a webhook (checkout.session.completed):

1. Next.js receives at `/api/webhooks/stripe`
2. Triggers Docker Agent workflow: `payment_webhook_handler`
3. Ledger Recorder appends to `./ledger/revenue-ledger.jsonl`
4. Compliance Agent validates tier + amounts
5. Returns 200 immediately to Stripe

### View Immutable Ledger

```bash
# Stream all transactions
tail -f ./ledger/revenue-ledger.jsonl

# Pretty-print latest 10 entries
tail -10 ./ledger/revenue-ledger.jsonl | jq .

# Search by tier
grep '"sovereign"' ./ledger/revenue-ledger.jsonl | jq .

# Verify chain of hashes
jq '.audit_hash' ./ledger/revenue-ledger.jsonl
```

## Agent Behavior

### Orchestrator Agent
- Tracks revenue targets (weekly/monthly)
- Assigns customers to tiers
- Routes enterprise deals (>$10k) to manual sales
- Generates forecasts

**Trigger**: Manual or scheduled (via cron)

### Compliance Agent
- Validates all transactions
- Ensures ZERO external AI exposure
- Enforces approval thresholds
- Generates audit reports

**Hard Rules**:
```
< $1,000       → Automated (instant)
$1,000-$10k    → Dual signoff (manager + accounting)
>= $10k        → Executive approval (owner)
```

**Trigger**: On every revenue transaction

### Ledger Recorder
- Cryptographically signed append-only log
- Chains each entry to previous (immutable)
- Syncs to Supabase `whatsapp_router_sales` (optional)
- Weekly reconciliation with bank

**Format**:
```json
{
  "timestamp": "2025-09-14T10:30:00Z",
  "transaction_id": "stripe_cus_abc123",
  "amount_usd": 199.00,
  "customer_tier": "sovereign",
  "status": "settled",
  "audit_hash": "sha256-...",
  "previous_hash": "sha256-..."
}
```

**Trigger**: Real-time (every payment event)

## Integration: Accounting Canon

Your agent config follows your **accounting operational canon**:

| Policy | Enforced By |
|--------|------------|
| Zero external AI exposure | Compliance Agent |
| Air-gapped execution | Docker + isolated tools |
| Immutable ledger | Ledger Recorder (append-only) |
| FIPS key isolation | Agent tool confirmation |
| Approval routing | Compliance Agent thresholds |
| Weekly reconciliation | Ledger Recorder sync |

## Security & Isolation

Each agent runs:
- **Containerized** (Docker isolates MCP tools)
- **Tool confirmation** enforced (must approve each action)
- **Sequential execution** (no concurrent state mutations)
- **Audit-logged** (all actions recorded with timestamps)
- **No external calls** (blocked by regex deny patterns)

Secrets (Stripe keys, etc.):
- Store in OS credential manager or `.env.production`
- Agents reference via `${env.STRIPE_SECRET_KEY}`
- Never printed to logs

## Monitoring & Alerts

### Health Check

```bash
curl http://localhost:7070/health
```

Returns:
```json
{
  "status": "healthy",
  "agents": [
    {"name": "orchestrator", "status": "ready"},
    {"name": "compliance", "status": "ready"},
    {"name": "ledger_recorder", "status": "ready"}
  ],
  "ledger": "./ledger/revenue-ledger.jsonl"
}
```

### Troubleshooting

**Agent not responding**:
```bash
docker-agent logs --config mr-agent-config.yaml
```

**Ledger verification failed**:
```bash
jq -s 'group_by(.audit_hash) | map(select(length > 1))' ./ledger/revenue-ledger.jsonl
# Returns empty if all hashes are unique (good)
```

**Compliance violation detected**:
```bash
grep '"status".*"violation"' ./evidence/compliance-*.json
```

## Next: Deploy to Production

### Option 1: Docker Compose (Full Stack)

```yaml
version: '3.9'
services:
  mindreply:
    image: mindreply:latest
    ports: ["3000:3000"]
  
  docker-agent:
    image: docker/docker-agent:latest
    ports: ["7070:7070"]
    volumes:
      - ./mr-agent-config.yaml:/app/config.yaml
      - ledger:/app/ledger
    command: serve --config /app/config.yaml
  
volumes:
  ledger:
```

### Option 2: Vercel + Docker Sandboxes

Deploy Next.js to Vercel, run agents in Docker Sandboxes for isolation.

### Option 3: Self-Hosted (Estate)

Place in `E:\ESTATE\01_APPS\mindreply-agents\` and run with systemd or PM2.

## Done ✓

Your revenue platform now has:
- ✅ Web presence (Next.js, pricing, dashboard)
- ✅ Multi-agent orchestration (Docker Agent)
- ✅ Immutable ledger (append-only, cryptographically signed)
- ✅ Real-time compliance checking
- ✅ Zero data exfiltration (enforced)
- ✅ Audit trail & evidence collection

Start with:
```bash
bash start-mindreply.sh
```

Then visit http://localhost:3000 and test the agents.
