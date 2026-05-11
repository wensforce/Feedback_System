/**
 * Validates the admin API key from request headers
 * @param {Request} request - Next.js request object
 * @returns {Response|null} - Returns error response if unauthorized, null if authorized
 */
export function validateAdminKey(request) {
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

/**
 * Sets CORS headers on response
 * @param {Response} response - Response object to add headers to
 * @param {string} origin - Origin header from request
 * @returns {Response} - Response with CORS headers set
 */
export function setCorsHeaders(response, origin) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://admin.wensforce.com',
  ];

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');

  return response;
}

/**
 * Handles preflight OPTIONS requests
 * @param {string} origin - Origin header from request
 * @returns {Response} - 200 OK response with CORS headers
 */
export function handlePreflight(origin) {
  const response = new Response(null, { status: 200 });
  return setCorsHeaders(response, origin);
}
