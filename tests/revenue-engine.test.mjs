import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMoney, calculateMargin, canTransition, transition, settlement } from '../src/revenue/engine.mjs';

test('money calculation is deterministic', () => {
  assert.deepEqual(calculateMoney({ quantity: 2, unitPrice: 600, discount: 100, tax: 50, fees: 20 }), {
    quantity: 2, unitPrice: 600, discount: 100, tax: 50, fees: 20,
    subtotal: 1200, gross: 1150, net: 1130
  });
});

test('margin calculation is deterministic', () => {
  assert.deepEqual(calculateMargin({ revenue: 1000, directCost: 250 }), { marginAmount: 750, marginRate: 0.75 });
});

test('state machine rejects skipped commercial states', () => {
  assert.equal(canTransition('offered', 'paid'), false);
  assert.equal(canTransition('accepted', 'paid'), true);
});

test('transition requires evidence', () => {
  const next = transition({ orderId: 'ORD-1', state: 'accepted' }, 'paid', 'evidence://payment/ORD-1');
  assert.equal(next.state, 'paid');
  assert.equal(next.state_before, 'accepted');
  assert.throws(() => transition({ state: 'accepted' }, 'paid'), /Evidence reference/);
});

test('settlement is reproducible without a model', () => {
  const result = settlement({
    orderId: 'ORD-1', offerId: 'OFFER-1', currency: 'GBP',
    grossAmount: 1000, fees: 30, refunds: 20, commission: 50,
    evidenceReference: 'evidence://order/ORD-1'
  });
  assert.equal(result.netAmount, 900);
  assert.equal(result.deterministic, true);
});
