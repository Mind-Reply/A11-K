# INTERNATIONAL_STANDARDS_AND_ACKNOWLEDGMENTS.md

## A.K. Robotics — International Standards & Acknowledgments

**Status:** Reference baseline — not a certification claim  
**Effective:** 2026-09-22  
**Owner authority:** A.K. / Angel Krastev  
**Brand:** A.K. Robotics

### Purpose

A.K. Robotics develops robotics systems, runtime components, fleet orchestration and operator-control capabilities with reference to applicable international safety, machinery, cybersecurity and operational-control frameworks.

This document records standards and authoritative guidance that inform engineering and governance. A reference is **not** a statement of compliance, conformity, certification, accreditation or third-party assessment.

### Core reference set

| Authority / framework | Reference | Intended relevance |
|---|---|---|
| ISO / ISO TC 299 | ISO 10218-1:2025 | Industrial robot safety, robot design and risk reduction |
| ISO / ISO TC 299 | ISO 10218-2:2025 | Industrial robot applications, integration and robot cells |
| ISO | ISO/TS 15066 | Collaborative robot applications where applicable |
| ISO | ISO 3691-4 | Driverless industrial trucks / AMR safety where applicable |
| ISO | ISO 12100 | Machinery risk assessment and risk reduction |
| ISO | ISO 13849-1 / ISO 13849-2 | Safety-related control systems where applicable |
| IEC | IEC 62061 | Functional safety of machinery control systems where applicable |
| IEC | IEC 61508 | Functional safety lifecycle reference where applicable |
| IEC / ISA | IEC 62443 series | Industrial automation and control-system cybersecurity |
| NIST | NIST IR 8227 | Cybersecurity implementation methodology for a robotic workcell |
| NIST | Cybersecurity Framework / Manufacturing Profile | Risk-based cybersecurity governance for operational technology |
| European Union | Regulation (EU) 2023/1230 | Machinery safety and market-access requirements for in-scope EU machinery |
| ISO / IEC | ISO/IEC 27001 | Information-security management where the organizational scope warrants it |
| ISO / IEC | ISO/IEC 42001 | AI management-system reference where AI systems are within scope |

### Applicability rule

A.K. Robotics does not automatically apply every reference to every product.

For each robot, workcell, fleet, control-plane service or deployment, the internal compliance matrix must determine:

1. whether the reference applies;
2. which subsystem or lifecycle stage it covers;
3. the concrete requirement or control;
4. the evidence required;
5. the current evidence status;
6. whether specialist assessment or certification is required.

### Evidence vocabulary

- **REFERENCED** — identified as relevant guidance.
- **MAPPED** — requirements have been mapped to an internal control or design element.
- **IMPLEMENTED** — the mapped control exists in the system/process.
- **TESTED** — objective test evidence exists.
- **ASSESSED** — competent internal/external assessment has been completed.
- **CERTIFIED** — a recognized certification/conformity instrument exists and is current.

A product must not be described publicly as certified, compliant, CE-marked, assessed or conforming unless the corresponding evidence exists for the exact product/scope.

### Public acknowledgment

A.K. Robotics acknowledges the work of the international standards and public authorities whose published standards, regulations and technical guidance inform responsible robotics engineering, including ISO, IEC, ISA, NIST and the institutions of the European Union.

The project uses these materials as engineering and governance references. Standards text remains the property of its respective rights holders, and access to normative standards should be obtained from the relevant official publisher.

### Safety boundary

Robotics safety is not delegated to software alone. Where physical robots or machinery are involved, the system boundary includes the machine, mechanical hazards, energy sources, safety functions, sensors, actuators, controllers, firmware, operating environment, network, human interaction, maintenance and emergency procedures.

The operator control plane is therefore treated as one layer of a wider safety system, not as a substitute for machine-level risk assessment, safeguarding, competent integration or statutory conformity assessment.

### International deployment principle

For deployment outside the original engineering jurisdiction, A.K. Robotics will establish a jurisdiction-specific applicability review before release. The review may include machinery law, product safety, radio/communications requirements, electrical requirements, cybersecurity obligations, workplace safety, privacy/data rules, export controls and sector-specific requirements.

### Current public claim

> A.K. Robotics is being developed with reference to applicable international robotics safety, industrial cybersecurity, machinery-safety and operational-control standards and guidance.

No certification or conformity claim is made by this statement.

### Change control

Any new product class, robot platform, workcell, jurisdiction, safety function or material architecture change triggers review of the applicability matrix before a public compliance claim is updated.
