export default function handler(request, response) {
  response.status(200).json({
    status: 'target-configured',
    hostname: 'brushworks.a11-k.space',
    route: '/reseller',
    canonical: 'https://brushworks.a11-k.space/reseller',
    dns: 'vercel-managed',
    liveDeployment: true
  });
}
