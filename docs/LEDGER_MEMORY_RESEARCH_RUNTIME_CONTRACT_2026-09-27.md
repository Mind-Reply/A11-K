# Ledger → Memory → Research — Canonical Runtime Contract

Date: 2026-09-27

## Status

- GitHub source implementation: VERIFIED.
- Append-only D1 integrity ledger: VERIFIED in source.
- Durable hot persona memory: VERIFIED in source after commit `2dc11592d8c7c3129277e2705bbbb27570fdfedb`.
- Vector research path: IMPLEMENTED / OPTIONAL until a live Vectorize binding is verified.
- Cloudflare runtime deployment: NOT CLAIMED from GitHub source alone.

## Architecture

### 1. Ledger — durable evidence bottom layer

`Mind-Reply/whatsapp-ai-router` implements D1 `integrity_log`.

The record contains bounded operational metadata and hashes:

- timestamp
- bot identifier
- action
- input hash
- output hash
- previous hash
- purpose score
- city/region micro-context
- research/knowledge reference
- optional transaction hash

Database triggers reject UPDATE and DELETE operations on the ledger table.

The ledger is the authoritative historical evidence layer. Source control remains the authority for source state; payment systems remain the authority for settlement state.

### 2. Memory — durable hot layer

Persona memory is stored under:

`patchtalk:persona-memory:<bot_id>`

The memory is distilled rather than a transcript. It carries purpose, purpose score, region, interaction count, knowledge summary and the last ledger hash.

The persona memory write is now non-expiring: no KV TTL is supplied. Cloudflare KV keys persist until explicitly expired or deleted.

This does not make memory immutable. The ledger remains the durable evidence history; memory is the current working projection.

### 3. Research — retrieval layer

The Worker contains an optional Vectorize retrieval path using Workers AI embeddings with `@cf/baai/bge-base-en-v1.5`.

Flow:

`request → hot memory → optional semantic research → model → append ledger → update hot memory`

Research is request/event driven. This change does not introduce a new recurring background loop.

## Verification boundaries

GitHub commits prove source state.

A successful D1 migration proves the ledger schema exists remotely.

A successful Worker request proves runtime execution.

A verified Vectorize binding and successful query prove semantic research is active.

A repository catalog, historical workflow, or documentation page does not prove current Cloudflare runtime state.

## Safety boundary

Do not store passwords, access tokens, payment credentials, certificate serials, exact addresses, private phone numbers, or security secrets in ledger, memory, or vector metadata.

Full chat retention is not part of the durable ledger design. Any transcript retention policy is a separate data-retention concern.

## Canonical implementation

- Runtime repository: `Mind-Reply/whatsapp-ai-router`
- Ledger implementation: `src/integrityMemory.ts`
- Ledger schema: `migrations/0006_integrity_memory.sql`
- Runtime contract: `docs/LEDGER_MEMORY_RESEARCH.md`

## Release rule

Never label the Vectorize layer LIVE until the actual Cloudflare resource binding and runtime request are verified.
