import { calculateMargin, calculateMoney, canTransition, REVENUE_STATES, settlement, transition } from './engine.mjs';

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
  const margin = calculateMargin({ revenue: money.netAmount, directCost });
  return {
    orderId, offerId, offerVersion, currency: String(currency).toUpperCase(), quantity,
    unitPrice, discount, tax, fees, directCost,
    subtotal: money.subtotal, grossAmount: money.grossAmount, netAmount: money.netAmount,
    marginAmount: margin.marginAmount, marginRate: margin.marginRate,
    state: REVENUE_STATES.IDENTIFIED, state_before: null,
    evidence_reference: null, payment: { state: 'unpaid', provider: null, providerReference: null },
    fulfillment: { state: 'not_ready', evidenceReference: null }, occurred_at: occurredAt
  };
}

export function recordOfferAcceptance(order, evidenceReference) {
  return transition(order, REVENUE_STATES.ACCEPTED, required(evidenceReference, 'evidenceReference'));
}

export function recordPaymentAuthorised(order, { provider, providerReference, evidenceReference }) {
  required(provider, 'provider');
  required(providerReference, 'providerReference');
  required(evidenceReference, 'evidenceReference');
  if (order.state !== REVENUE_STATES.ACCEPTED) throw new Error(`Payment requires accepted order; current state: ${order.state}`);
  const next = transition(order, REVENUE_STATES.PAID, evidenceReference);
  next.payment = { state: 'paid', provider, providerReference };
  return next;
}

export function confirmFulfillment(order, evidenceReference) {
  required(evidenceReference, 'evidenceReference');
  if (order.state !== REVENUE_STATES.PAID) throw new Error(`Fulfillment requires paid order; current state: ${order.state}`);
  const next = transition(order, REVENUE_STATES.FULFILLED, evidenceReference);
  next.fulfillment = { state: 'fulfilled', evidenceReference };
  return next;
}

export function markEvidenceReady(order, evidenceReference) {
  required(evidenceReference, 'evidenceReference');
  if (order.state !== REVENUE_STATES.FULFILLED) throw new Error(`Evidence requires fulfilled order; current state: ${order.state}`);
  return transition(order, REVENUE_STATES.EVIDENCE_READY, evidenceReference);
}

export function settleOrder(order, { fees = 0, refunds = 0, commission = 0, evidenceReference }) {
  required(evidenceReference, 'evidenceReference');
  if (order.state !== REVENUE_STATES.EVIDENCE_READY) throw new Error(`Settlement requires evidence-ready order; current state: ${order.state}`);
  const result = settlement({ orderId: order.orderId, offerId: order.offerId, currency: order.currency, grossAmount: order.grossAmount, fees: nonNegative(fees, 'fees'), refunds: nonNegative(refunds, 'refunds'), commission: nonNegative(commission, 'commission'), evidenceReference });
  const next = transition(order, REVENUE_STATES.SETTLED, evidenceReference);
  next.settlement = result;
  return next;
}

export function reconcileOrder(order, { authoritativePaymentState, evidenceReference }) {
  required(evidenceReference, 'evidenceReference');
  required(authoritativePaymentState, 'authoritativePaymentState');
  if (authoritativePaymentState !== 'paid' && authoritativePaymentState !== 'unpaid' && authoritativePaymentState !== 'refunded') {
    throw new Error(`Unsupported authoritative payment state: ${authoritativePaymentState}`);
  }
  if (authoritativePaymentState === 'paid' && order.payment.state !== 'paid') throw new Error('Payment mismatch: authoritative provider says paid');
  return { orderId: order.orderId, reconciled: authoritativePaymentState === order.payment.state, authoritativePaymentState, evidenceReference };
}

export function revenueRuntimeHealth() {
  return { deterministic: true, modelRequired: false, networkRequired: false, externalWrites: false, states: Object.values(REVENUE_STATES), transitionGuard: canTransition };
}
