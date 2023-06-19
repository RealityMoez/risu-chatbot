const fetch = require('node-fetch');

module.exports = async (req, res) =>
{
    const API_KEY = process.env.OPENAI_API_KEY;
    try
    {
        res.status(200).json({ apiKey: API_KEY });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch environment data' });
    }
};