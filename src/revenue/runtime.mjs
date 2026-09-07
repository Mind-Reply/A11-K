import { calculateMargin, calculateMoney, canTransition, REVENUE_STATES, settlement, transition } from './engine.mjs';

const STATE = Object.freeze({
  IDENTIFIED: 'identified',
  QUALIFIED: 'qualified',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  PAID: 'paid',
  FULFILLED: 'fulfilled',
  EVIDENCE_READY: 'evidence_ready',
  SETTLED: 'settled'
});

function required(value, name) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${name} is required`);
  return text;
}

function nonNegative(value, name) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${name} must be a non-negative finite number`);
  return number;
}

export function createOrder({ orderId, offerId, offerVersion, currency, quantity = 1, unitPrice, discount = 0, tax = 0, fees = 0, directCost = 0, occurredAt = new Date().toISOString() }) {
  required(orderId, 'orderId');
  required(offerId, 'offerId');
  required(offerVersion, 'offerVersion');
  required(currency, 'currency');
  const money = calculateMoney({ quantity, unitPrice, discount, tax, fees });
  const margin = calculateMargin({ revenue: money.net, directCost });
  return {
    orderId, offerId, offerVersion, currency: String(currency).toUpperCase(), quantity,
    unitPrice, discount, tax, fees, directCost,
    subtotal: money.subtotal, grossAmount: money.gross, netAmount: money.net,
    marginAmount: margin.marginAmount, marginRate: margin.marginRate,
    state: STATE.IDENTIFIED, state_before: null,
    evidence_reference: null, payment: { state: 'unpaid', provider: null, providerReference: null },
    fulfillment: { state: 'not_ready', evidenceReference: null }, occurred_at: occurredAt
  };
}

export function recordQualification(order, evidenceReference) {
  return transition(order, STATE.QUALIFIED, required(evidenceReference, 'evidenceReference'));
}

export function recordOffer(order, evidenceReference) {
  return transition(order, STATE.OFFERED, required(evidenceReference, 'evidenceReference'));
}

export function recordOfferAcceptance(order, evidenceReference) {
  return transition(order, STATE.ACCEPTED, required(evidenceReference, 'evidenceReference'));
}

export function recordPaymentAuthorised(order, { provider, providerReference, evidenceReference }) {
  required(provider, 'provider');
  required(providerReference, 'providerReference');
  required(evidenceReference, 'evidenceReference');
  if (order.state !== STATE.ACCEPTED) throw new Error(`Payment requires accepted order; current state: ${order.state}`);
  const next = transition(order, STATE.PAID, evidenceReference);
  return { ...next, payment: { state: 'paid', provider, providerReference } };
}

export function confirmFulfillment(order, evidenceReference) {
  required(evidenceReference, 'evidenceReference');
  if (order.state !== STATE.PAID) throw new Error(`Fulfillment requires paid order; current state: ${order.state}`);
  const next = transition(order, STATE.FULFILLED, evidenceReference);
  return { ...next, fulfillment: { state: 'fulfilled', evidenceReference } };
}

export function markEvidenceReady(order, evidenceReference) {
  required(evidenceReference, 'evidenceReference');
  if (order.state !== STATE.FULFILLED) throw new Error(`Evidence requires fulfilled order; current state: ${order.state}`);
  return transition(order, STATE.EVIDENCE_READY, evidenceReference);
}

export function settleOrder(order, { fees = 0, refunds = 0, commission = 0, evidenceReference }) {
  required(evidenceReference, 'evidenceReference');
  if (order.state !== STATE.EVIDENCE_READY) throw new Error(`Settlement requires evidence-ready order; current state: ${order.state}`);
  const result = settlement({ orderId: order.orderId, offerId: order.offerId, currency: order.currency, grossAmount: order.grossAmount, fees: nonNegative(fees, 'fees'), refunds: nonNegative(refunds, 'refunds'), commission: nonNegative(commission, 'commission'), evidenceReference });
  const next = transition(order, STATE.SETTLED, evidenceReference);
  return { ...next, settlement: result };
}

export function reconcileOrder(order, { authoritativePaymentState, evidenceReference }) {
  required(evidenceReference, 'evidenceReference');
  required(authoritativePaymentState, 'authoritativePaymentState');
  if (!['paid', 'unpaid', 'refunded'].includes(authoritativePaymentState)) {
    throw new Error(`Unsupported authoritative payment state: ${authoritativePaymentState}`);
  }
  if (authoritativePaymentState === 'paid' && order.payment.state !== 'paid') throw new Error('Payment mismatch: authoritative provider says paid');
  return { orderId: order.orderId, reconciled: authoritativePaymentState === order.payment.state, authoritativePaymentState, evidenceReference };
}

export function revenueRuntimeHealth() {
  return { deterministic: true, modelRequired: false, networkRequired: false, externalWrites: false, states: [...REVENUE_STATES], transitionGuard: canTransition };
}
