# NOVA PRIME — A11-K Visual System

Status: VERIFIED / INITIAL BASELINE
Owner: Angel K / A11-K / Mind-Reply

## Product character

Decisive, observant, controlled. Premium operational intelligence rather than a generic AI dashboard.

## Visual principles

- Dark-first command surface with restrained contrast.
- Information grouped by decision and state, not backend subsystem.
- Dense data with generous hierarchy and deliberate whitespace.
- One dominant action per surface.
- Evidence is visually stronger than commentary.
- Warnings are precise; avoid alarm fatigue.
- Premium, technical, calm, trustworthy.

## Core tokens

### Color roles

- `bg.canvas`: near-black graphite
- `bg.surface`: elevated graphite
- `bg.elevated`: high-contrast panel
- `text.primary`: soft white
- `text.secondary`: muted cool gray
- `state.verified`: restrained green
- `state.ready`: blue
- `state.warning`: amber
- `state.blocked`: red
- `state.unverified`: gray

Use semantic roles rather than hard-coded colors in components.

### Typography

- Primary: modern grotesk / system sans fallback.
- Numeric/status values: tabular numerals.
- Labels: compact uppercase only where it improves scanning.
- Body copy: short, direct, operational.

### Layout

- Desktop: command-center grid with persistent status rail.
- Tablet: two-column adaptive layout.
- Mobile: stacked cards with priority-first ordering.
- Minimum interactive target: 44px.

### Components

- StateBadge
- EvidenceCard
- CapabilityCard
- WorkerCard
- OpportunityCard
- DeploymentCard
- IncidentCard
- ActionQueue
- OwnerGate
- FallbackRoute
- ActivityTimeline

## Motion

Use motion only to communicate state changes, loading, confirmation, or navigation. Never animate continuously just for decoration.

## Accessibility

- Keyboard navigable.
- Visible focus states.
- Semantic headings.
- Contrast target WCAG AA.
- Never communicate state by color alone.

## Canonical source

This file is the visual source of truth for NOVA PRIME surfaces in A11-K. Any future agent modifying NOVA UI must read this file first.
