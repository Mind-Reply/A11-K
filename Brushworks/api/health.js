export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: 'brushworks',
    mode: 'production-static',
    status: 'ready',
    liveDeployment: true,
    timestamp: new Date().toISOString()
  });
}
