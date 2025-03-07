// Simple health check endpoint
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Return a simple JSON response
  return res.status(200).json({ 
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}; 