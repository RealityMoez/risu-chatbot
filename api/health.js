// Health check endpoint with improved error handling
module.exports = (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Return detailed health information
    return res.status(200).json({ 
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development',
      nodeVersion: process.version,
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        referer: req.headers.referer,
        'user-agent': req.headers['user-agent']
      }
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Health check error:', error);
    
    // Return a detailed error response
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
}; 