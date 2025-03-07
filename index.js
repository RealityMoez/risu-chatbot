// Main entry point for Vercel deployment
// This file simply re-exports the Express app from server.js

// Import the Express app
const app = require('./server');

// Export for Vercel serverless deployment
module.exports = app; 