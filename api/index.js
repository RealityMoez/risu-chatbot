// API directory index file
module.exports = (req, res) => {
  res.status(200).json({
    message: 'API is online',
    endpoints: [
      '/api/chat',
      '/api/health'
    ],
    documentation: 'This is the API for the RISU chatbot application'
  });
}; 