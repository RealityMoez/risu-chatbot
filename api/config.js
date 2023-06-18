// api/config.js
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = (req, res) =>
{
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    res.json({ OPENAI_API_KEY });
};