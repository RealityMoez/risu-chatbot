// Express server for local development
const express = require('express');
const path = require('path');
const chatHandler = require('./api/chat');
const healthHandler = require('./api/health');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API routes
app.all('/api/chat', (req, res) => {
  // Wrap the serverless function handler
  return chatHandler(req, res);
});

app.all('/api/health', (req, res) => {
  // Wrap the serverless function handler
  return healthHandler(req, res);
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
module.exports = app; 