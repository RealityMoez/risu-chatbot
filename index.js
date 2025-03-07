// Simple redirect to the main application
module.exports = (req, res) => {
  res.writeHead(302, { Location: '/' });
  res.end();
};