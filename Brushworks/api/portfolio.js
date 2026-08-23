const items = [
  { id: 'a11-k', name: 'A11-K.space', category: 'Private SuperIntelligence operating layer', outcome: 'A sovereign control surface for high-value work, research, and execution.', url: 'https://a11-k.space' },
  { id: 'mindreply', name: 'MindReply', category: 'Reply, offer, and next-action system', outcome: 'Turns missed replies and unclear offers into calm, persuasive next actions.', url: 'https://mind-reply.com' },
  { id: 'aurel', name: 'Aurel', category: 'Premium infrastructure and operations', outcome: 'High-trust digital operations presented with a premium, focused experience.', url: 'https://aurel.io' },
  { id: 'brushworks', name: 'Brushworks', category: 'Design-to-site studio', outcome: 'Move from prompt and direction to a structured, exportable site package.', url: 'https://brushworks.a11-k.space' },
  { id: 'letreseller', name: 'LetReseller', category: 'Provider-neutral reseller operations', outcome: 'Domains, hosting, billing, projects, support, and fulfilment in one operating layer.', url: 'https://latreseller.lat' }
];

export default function handler(request, response) {
  response.status(200).json({ status: 'catalogue-ready', items, liveDeployment: true });
}
