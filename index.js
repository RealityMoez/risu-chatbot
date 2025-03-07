// Root index file - redirects to the static site
const { join } = require('path');
const fs = require('fs');

// This file helps Vercel recognize this as a Node.js project
// It's not actually used in production as the routes in vercel.json handle the routing
module.exports = (req, res) => {
  // Redirect to the static site
  res.writeHead(302, { Location: '/index.html' });
  res.end();
}; 