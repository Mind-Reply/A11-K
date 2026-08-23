const cleanText = (value, fallback = '') => String(value ?? fallback).trim().slice(0, 5000);

export default function handler(request, response) {
  if (request.method === 'GET') {
    return response.status(200).json({ status: 'production-local-boundary', leads: [], externalDelivery: false });
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({ error: 'method not allowed' });
  }

  const input = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : (request.body || {});
  const email = cleanText(input.email);
  if (!email || !email.includes('@')) return response.status(422).json({ error: 'valid email required' });

  return response.status(201).json({
    lead: {
      name: cleanText(input.name, 'Anonymous prospect'),
      email: '[accepted privately]',
      interest: cleanText(input.interest, 'focused build'),
      brief: cleanText(input.brief, 'No brief supplied.'),
      status: 'accepted-for-private-follow-up'
    },
    status: 'accepted-for-private-follow-up',
    externalDelivery: false
  });
}
