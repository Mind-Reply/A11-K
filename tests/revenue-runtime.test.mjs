import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrder, markEvidenceReady, recordOfferAcceptance, recordQualification, recordOffer, recordPaymentAuthorised, confirmFulfillment, settleOrder, reconcileOrder, revenueRuntimeHealth } from '../src/revenue/runtime.mjs';

test('revenue runtime completes order through settlement without a model', () => {
  let order = createOrder({ orderId: 'ORD-TEST-001', offerId: 'OFFER-600', offerVersion: '1.0.0', currency: 'GBP', quantity: 2, unitPrice: 600, discount: 100, tax: 50, fees: 20, directCost: 250 });
  assert.equal(order.grossAmount, 1150);
  assert.equal(order.netAmount, 1130);
  order = recordQualification(order, 'evidence://qualification/ORD-TEST-001');
  order = recordOffer(order, 'evidence://offer/ORD-TEST-001');
  order = recordOfferAcceptance(order, 'evidence://acceptance/ORD-TEST-001');
  order = recordPaymentAuthorised(order, { provider: 'test-provider', providerReference: 'pay_test_001', evidenceReference: 'evidence://payment/pay_test_001' });
  order = confirmFulfillment(order, 'evidence://fulfillment/ORD-TEST-001');
  order = markEvidenceReady(order, 'evidence://delivery/ORD-TEST-001');
  order = settleOrder(order, { fees: 30, refunds: 20, commission: 50, evidenceReference: 'evidence://settlement/ORD-TEST-001' });
  assert.equal(order.state, 'settled');
  assert.equal(order.settlement.netAmount, 1050);
  assert.equal(order.settlement.deterministic, true);
});

test('reconciliation fails closed on a payment mismatch', () => {
  const order = createOrder({ orderId: 'ORD-TEST-002', offerId: 'OFFER-600', offerVersion: '1.0.0', currency: 'GBP', unitPrice: 600 });
  assert.throws(() => reconcileOrder(order, { authoritativePaymentState: 'paid', evidenceReference: 'evidence://reconcile/ORD-TEST-002' }), /Payment mismatch/);
});

test('runtime health declares model independence', () => {
  const health = revenueRuntimeHealth();
  assert.equal(health.deterministic, true);
  assert.equal(health.modelRequired, false);
  assert.equal(health.networkRequired, false);
  assert.deepEqual(health.states, ['identified', 'qualified', 'offered', 'accepted', 'paid', 'fulfilled', 'evidence_ready', 'settled', 'retained', 'closed']);
});
