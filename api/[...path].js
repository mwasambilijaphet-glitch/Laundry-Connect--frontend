const BACKEND_URL = 'https://laundry-connect-backend.onrender.com';

export default async function handler(req, res) {
  // Build the backend URL from the request path
  const path = req.url; // e.g., /api/auth/login
  const targetUrl = `${BACKEND_URL}${path}`;

  // Forward headers (except host)
  const headers = { ...req.headers };
  delete headers.host;
  headers['content-type'] = headers['content-type'] || 'application/json';

  // Retry logic for Render cold starts
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const fetchOptions = {
        method: req.method,
        headers,
      };

      // Forward body for non-GET requests
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);

      // Forward response headers
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        if (!['transfer-encoding', 'connection', 'keep-alive'].includes(key.toLowerCase())) {
          responseHeaders[key] = value;
        }
      });

      const text = await response.text();
      res.status(response.status);
      Object.entries(responseHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      res.send(text);
      return;
    } catch (err) {
      lastError = err;
      // Wait before retry (Render cold start can take 30s)
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 5000));
      }
    }
  }

  // All retries failed
  res.status(503).json({
    success: false,
    message: 'Backend server is starting up. Please try again in 30 seconds.',
    error: lastError?.message,
  });
}
