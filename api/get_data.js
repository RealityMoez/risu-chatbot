const fetch = require('node-fetch');

module.exports = async (req, res) =>
{
    try
    {
        const API_KEY = process.env.API_KEY;
        res.status(200).json({ apiKey: API_KEY });
    } catch(error)
    {
        console.error('Error fetching API key:', error);
        res.status(500).json({ error: 'Failed to fetch API key' });
    }
};