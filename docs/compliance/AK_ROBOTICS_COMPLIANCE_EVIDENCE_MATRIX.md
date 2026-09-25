# A.K. Robotics — Compliance & Evidence Matrix

**Status:** Internal working control register  
**Effective:** 2026-09-22  
**Owner authority:** A.K. / Angel Krastev  
**Rule:** No public compliance/certification claim without objective evidence for the exact scope.

## Evidence status

| Status | Meaning | Public claim allowed? |
|---|---|---|
| REFERENCED | Reference identified as potentially relevant | Reference only |
| MAPPED | Requirement mapped to a control/design element | Reference only |
| IMPLEMENTED | Control exists | Do not claim compliance by itself |
| TESTED | Objective test evidence recorded | Do not claim certification by itself |
| ASSESSED | Competent assessment completed | Claim only within documented scope |
| CERTIFIED | Current recognized certificate/conformity instrument | Claim only within certificate scope |

## Matrix

| ID | Authority / reference | A.K. Robotics scope | Control / requirement to evidence | Evidence artifact | Status |
|---|---|---|---|---|---|
| ROB-SAF-001 | ISO 10218-1:2025 | Industrial robot platform | Robot-level safety requirements and risk reduction | Product risk file; supplier declarations; safety test record | REFERENCED |
| ROB-SAF-002 | ISO 10218-2:2025 | Robot cell / integrated application | Integration, commissioning, operation and maintenance safety | Cell risk assessment; integration validation; commissioning record | REFERENCED |
| ROB-SAF-003 | ISO/TS 15066 | Collaborative applications | Human-robot interaction and collaborative operation controls | Application assessment; safety function tests | REFERENCED |
| ROB-SAF-004 | ISO 3691-4 | AMR / driverless industrial truck use | Mobile robot safety, operating environment and protective measures | AMR risk assessment; site validation; safety test pack | REFERENCED |
| ROB-SAF-005 | ISO 12100 | All machinery in scope | Hazard identification, risk estimation and risk reduction | Machinery risk assessment | REFERENCED |
| ROB-SAF-006 | ISO 13849-1/-2 | Safety-related control functions | Safety-related control architecture and validation | Safety function specification; validation report | REFERENCED |
| ROB-SAF-007 | IEC 62061 | Safety-related machinery controls | Functional-safety lifecycle where applicable | SIL/functional-safety analysis; validation evidence | REFERENCED |
| ROB-SAF-008 | IEC 61508 | Safety lifecycle where applicable | Hazard/risk analysis, safety integrity and lifecycle controls | Safety lifecycle file; assessment evidence | REFERENCED |
| ROB-CYB-001 | IEC/ISA 62443 | OT/robotics network and control plane | Asset identity, segmentation, secure development, access control and monitoring | Network diagram; control mapping; test results | REFERENCED |
| ROB-CYB-002 | NIST IR 8227 | Robotic workcell cybersecurity | Risk-based cybersecurity implementation and performance validation | Workcell security assessment; test evidence | REFERENCED |
| ROB-CYB-003 | NIST CSF / Manufacturing Profile | Operational technology | Identify, protect, detect, respond and recover controls | Security control register; incident tests | REFERENCED |
| ROB-REG-001 | Regulation (EU) 2023/1230 | EU machinery/product deployments | Scope, technical documentation, conformity assessment, declarations and instructions where applicable | Technical file; conformity assessment; EU declaration | REFERENCED |
| ROB-REG-002 | Applicable national machinery/workplace rules | Deployment jurisdiction | Local safety and workplace obligations | Jurisdiction review; competent-person sign-off | REFERENCED |
| ROB-SEC-001 | ISO/IEC 27001 | Organizational information security where scoped | ISMS governance and risk treatment | ISMS scope; SoA; audit evidence | REFERENCED |
| ROB-GOV-001 | ISO/IEC 42001 | AI-enabled robotics systems where scoped | AI management, governance and risk controls | AI system register; impact/risk assessment | REFERENCED |

## Required evidence chain

For each applicable control:

Scope → Requirement → Design decision → Implementation → Test → Assessment → Release approval → Evidence record

Evidence should identify:

- product / robot / workcell identifier;
- software and firmware versions;
- hardware revision;
- deployment site and jurisdiction;
- responsible engineer / assessor;
- test date and environment;
- test method and result;
- exceptions and residual risk;
- supporting document hash or immutable reference;
- approval decision;
- next review date.

## Release gate

A robotics release is **not** compliance-ready merely because a standard is listed.

Before a release that could affect physical safety:

1. determine applicable standards and law;
2. complete or update the machinery risk assessment;
3. identify safety-related functions and required validation;
4. complete cybersecurity threat/risk review for connected components;
5. verify emergency-stop, protective-stop and fail-safe behavior within the applicable system boundary;
6. record objective test evidence;
7. obtain required competent-person / third-party assessment;
8. complete jurisdiction-specific conformity documentation where required;
9. approve release;
10. preserve the evidence package with the released version.

## Public-claim guardrail

Allowed without certification evidence:

> "Developed with reference to applicable international robotics safety, industrial cybersecurity and machinery-safety standards and guidance."

Not allowed without scope-specific evidence:

- "ISO certified"
- "IEC 62443 certified"
- "NIST compliant"
- "CE certified"
- "EU compliant"
- "Safety certified"
- "Fully compliant with ISO/IEC standards"

## Review triggers

Re-open the matrix when any of the following changes:

- robot class or mobility;
- payload, speed, tooling or operating envelope;
- human collaboration model;
- safety architecture;
- controller, firmware or safety PLC;
- network topology or remote-access model;
- cloud/control-plane architecture;
- AI-enabled safety-related function;
- deployment country/market;
- applicable legislation or harmonized standards;
- material incident, near miss or safety finding.

## Current evidence position

The standards listed here are a **reference baseline**. They are not evidence that A.K. Robotics is certified or conforming. Each row remains **REFERENCED** until objective project evidence advances it through the evidence lifecycle.
