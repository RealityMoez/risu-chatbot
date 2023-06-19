const fetch = require('node-fetch');

module.exports = async (req, res) =>
{
    try
    {
        const API_KEY = process.env.API_KEY;
        console.log("API Key:", API_KEY);
        if(!API_KEY)
        {
            throw new Error('API_KEY not found in environment variables');
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ apiKey: API_KEY });
    } catch(error)
    {
        console.error('Error fetching API key:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Failed to fetch API key' });
    }
};