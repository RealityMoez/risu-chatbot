const axios = require('axios');
const cookie = require('cookie');

module.exports = async (req, res) =>
{
    let OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Get the API key from the request cookies
    let cookies = cookie.parse(req.headers.cookie || '');
    let OPENAI_API_KEY_COOKIE = cookies.OPENAI_API_KEY;

    if(!OPENAI_API_KEY && OPENAI_API_KEY_COOKIE)
    {
        OPENAI_API_KEY = OPENAI_API_KEY_COOKIE;
    }

    if(OPENAI_API_KEY)
    {
        const { userPrompt, conversation } = req.body;
        try
        {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: 'gpt-3.5-turbo',
                    messages: conversation,
                    temperature: 0.7,
                    max_tokens: 600,
                    top_p: 1,
                    frequency_penalty: 0.8,
                    presence_penalty: 0.6,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            );

            res.status(200).json({ message: response.data.choices[0].message.content });
        } catch(error)
        {
            res.status(200).json({ message: "API Error." });
        }
    }

    if(!OPENAI_API_KEY && !OPENAI_API_KEY_COOKIE)
    {
        res.status(200).json({ message: "API key is missing." });
    }
};
