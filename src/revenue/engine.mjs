/**
 * Deterministic revenue primitives.
 * No model, network call, or external service is required to calculate money or state.
 */

export const REVENUE_STATES = Object.freeze([
  'identified', 'qualified', 'offered', 'accepted', 'paid',
  'fulfilled', 'evidence_ready', 'settled', 'retained', 'closed'
]);

const NEXT = Object.freeze({
  identified: ['qualified'],
  qualified: ['offered'],
  offered: ['accepted'],
  accepted: ['paid'],
  paid: ['fulfilled'],
  fulfilled: ['evidence_ready'],
  evidence_ready: ['settled'],
  settled: ['retained', 'closed'],
  retained: ['closed'],
  closed: []
});

function finiteNumber(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`Invalid numeric field: ${field}`);
  return n;
}

export function calculateMoney({ quantity = 1, unitPrice, discount = 0, tax = 0, fees = 0 }) {
  const q = finiteNumber(quantity, 'quantity');
  const price = finiteNumber(unitPrice, 'unitPrice');
  const d = finiteNumber(discount, 'discount');
  const t = finiteNumber(tax, 'tax');
  const f = finiteNumber(fees, 'fees');
  if (q < 0 || price < 0 || d < 0 || t < 0 || f < 0) throw new Error('Money inputs cannot be negative');
  const subtotal = q * price;
  const netBeforeTax = Math.max(0, subtotal - d);
  const gross = netBeforeTax + t;
  const net = gross - f;
  return Object.freeze({ quantity: q, unitPrice: price, discount: d, tax: t, fees: f, subtotal, gross, net });
}

export function calculateMargin({ revenue, directCost = 0 }) {
  const r = finiteNumber(revenue, 'revenue');
  const c = finiteNumber(directCost, 'directCost');
  if (r < 0 || c < 0) throw new Error('Margin inputs cannot be negative');
  const marginAmount = r - c;
  const marginRate = r === 0 ? 0 : marginAmount / r;
  return Object.freeze({ marginAmount, marginRate });
}

export function canTransition(from, to) {
  if (!REVENUE_STATES.includes(from) || !REVENUE_STATES.includes(to)) return false;
  return NEXT[from].includes(to);
}

export function transition(record, to, evidenceReference) {
  if (!record || typeof record !== 'object') throw new Error('Record is required');
  if (!canTransition(record.state, to)) throw new Error(`Invalid revenue transition: ${record.state} -> ${to}`);
  if (!evidenceReference || typeof evidenceReference !== 'string') throw new Error('Evidence reference is required');
  return Object.freeze({
    ...record,
    state_before: record.state,
    state: to,
    evidence_reference: evidenceReference,
    updated_at: new Date().toISOString()
  });
}

export function settlement({ orderId, offerId, currency, grossAmount, fees = 0, refunds = 0, commission = 0, evidenceReference }) {
  if (!orderId || !offerId || !currency || !evidenceReference) throw new Error('Settlement identity and evidence are required');
  const gross = finiteNumber(grossAmount, 'grossAmount');
  const fee = finiteNumber(fees, 'fees');
  const refund = finiteNumber(refunds, 'refunds');
  const comm = finiteNumber(commission, 'commission');
  if ([gross, fee, refund, comm].some(v => v < 0)) throw new Error('Settlement values cannot be negative');
  const net = gross - fee - refund - comm;
  if (net < 0) throw new Error('Settlement cannot produce a negative net amount');
  return Object.freeze({ orderId, offerId, currency, grossAmount: gross, fees: fee, refunds: refund, commission: comm, netAmount: net, evidenceReference, deterministic: true });
}
