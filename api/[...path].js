const BACKEND_URL = 'https://laundry-connect-backend.onrender.com';

module.exports = async function handler(req, res) {
  const path = req.url; // e.g., /api/auth/login
  const targetUrl = `${BACKEND_URL}${path}`;

  // Only forward relevant headers
  const headers = {
    'Content-Type': 'application/json',
  };
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }

  const fetchOptions = {
    method: req.method,
    headers,
  };

  // Forward body for non-GET requests
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const text = await response.text();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Forward content-type from backend
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err.message, '| URL:', targetUrl);
    res.status(503).json({
      success: false,
      message: 'Backend server is starting up. Please wait 30 seconds and try again.',
    });
  }
};
