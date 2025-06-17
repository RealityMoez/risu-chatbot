const axios = require('axios');
const cookie = require('cookie');

// API configurations
const API_CONFIGS = {
    openai: {
        baseURL: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o',
        temperature: 1,
        max_completion_tokens: 50,
        top_p: 0.1,
        logprobs: true,
        top_logprobs: 20,
        frequency_penalty: 1.7,
        presence_penalty: 1.5,
        validateKey: (key) => key.startsWith('sk-') && key.length >= 40
    },
    github: {
        baseURL: 'https://models.inference.ai.azure.com/chat/completions',
        model: 'gpt-4.1',
        validateKey: (key) => key.startsWith('ghp_') || key.startsWith('github_pat_'),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
};

// Export the handler function directly
module.exports = async (req, res) => {
    // Log request details for debugging
    console.log('Request received:', {
        method: req.method,
        url: req.url,
        headers: req.headers
    });

    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get the API key and type from cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const apiKey = cookies.API_KEY;
    const apiType = cookies.API_TYPE || 'openai';

    // Get API configuration
    const apiConfig = API_CONFIGS[apiType];
    if (!apiConfig) {
        return res.status(400).json({ message: 'Invalid API type specified.' });
    }

    // Validate API key format
    if (!apiKey || !apiConfig.validateKey(apiKey)) {
        return res.status(401).json({ 
            message: `Invalid ${apiType === 'openai' ? 'API key' : 'token'} format. Please enter a valid ${apiType === 'openai' ? 'OpenAI API key' : 'GitHub token'}.`
        });
    }

    const { conversation } = req.body;
    
    if (!conversation || !Array.isArray(conversation)) {
        return res.status(400).json({ message: 'Invalid conversation format.' });
    }

    try {
        // Format headers and request body based on API type
        let headers, requestData;
        
        if (apiType === 'github') {
            // GitHub API specific setup
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            
            // Properly format messages for GitHub API
            // GitHub API requires specific role values (developer, user, assistant)
            const formattedMessages = conversation.map(msg => {
                // Keep system messages as developer role for GitHub API
                return { role: 'developer', content: msg.content };
            });
            
            requestData = {
                messages: formattedMessages,
                model: apiConfig.model,
                temperature: 0.5,
                max_completion_tokens: 50,
                top_p: 0.1,
                logprobs: true,
                top_logprobs: 20,
                frequency_penalty: 1.7,
                presence_penalty: 1.5
            };
        } else {
            // OpenAI API setup
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            
            requestData = {
                model: apiConfig.model,
                messages: conversation
            };
        }

        // Log request configuration for debugging
        console.log('Making API request:', {
            url: apiConfig.baseURL,
            model: apiConfig.model,
            temperature: apiConfig.temperature,
            headers: { ...headers}
        });

        const response = await axios.post(
            apiConfig.baseURL,
            requestData,
            { headers }
        );

        // Log the full response
        console.log('Full API response:', response.data);
        
        // Extract message content based on API type
        let messageContent;
        
        if (apiType === 'github') {
            // For GitHub API - message might be a nested object
            console.log('GitHub API message object:', response.data.choices[0].message);
            
            if (response.data.choices[0].message.content) {
                messageContent = response.data.choices[0].message.content;
            } else if (response.data.choices[0].content) {
                messageContent = response.data.choices[0].content;
            } else {
                // If structure is different, log the choice object and attempt to stringify it
                const choiceObj = response.data.choices[0];
                console.log('GitHub API choice object structure:', JSON.stringify(choiceObj, null, 2));
                messageContent = 'Sorry, there was an issue parsing the response.';
            }
        } else {
            // For OpenAI API
            messageContent = response.data.choices[0].message.content;
        }
        
        return res.status(200).json({ 
            message: messageContent,
            success: true // Add a flag to help debug client-side
        });
    } catch (error) {
        // error logging
        console.error(`${apiType.toUpperCase()} API Error:`, {
            error: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: { ...error.config?.headers, Authorization: '***' }
            }
        });
        
        // Handle API errors
        if (error.response?.status === 401) {
            // Clear the cookie on invalid API key
            res.setHeader('Set-Cookie', [
                'API_KEY=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'API_TYPE=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
            ]);
            return res.status(401).json({ 
                message: `Invalid ${apiType === 'openai' ? 'API key' : 'token'}. Please enter a valid ${apiType === 'openai' ? 'OpenAI API key' : 'GitHub token'}.`
            });
        }

        if (error.response?.status === 404) {
            return res.status(404).json({ 
                message: 'The API endpoint could not be found. Please check the configuration.'
            });
        }

        if (error.response?.status === 429) {
            return res.status(429).json({ 
                message: apiType === 'openai' 
                    ? 'OpenAI API rate limit exceeded.'
                    : `GitHub API rate limit exceeded. [${error}]`
            });
        }

        if (error.response?.status === 413) {
            return res.status(413).json({ message: 'Conversation too long.' });
        }
        
        return res.status(500).json({ 
            message: error.response?.data?.error?.message || 'An error occurred while processing your request.'
        });
    }
};
