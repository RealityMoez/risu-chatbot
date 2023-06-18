// Import required modules
const express = require('express');
const dotenv = require('dotenv');
//const openai = require('openai');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Set the static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Expose the OpenAI API key to the client-side code
app.get('/api/config', (req, res) =>
{
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    res.json({ OPENAI_API_KEY });
});

// Set up a route for the homepage
app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () =>
{
    console.log(`Server is running on http://localhost:${port}`);
});
