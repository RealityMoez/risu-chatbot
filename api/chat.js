import cookie from 'cookie';
import OpenAI from "openai";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";


const GITHUB_MODELS = [
    {
        id: 'default',
        displayName: 'Default (GPT-4.1)',
        modelId: 'gpt-4.1',
        endpoint: 'https://models.inference.ai.azure.com',
        sdk: 'azure-ai-inference'
    },
    {
        id: 'gpt-4.1-mini',
        displayName: 'GPT-4.1 Mini',
        modelId: 'gpt-4.1-mini',
        endpoint: 'https://models.inference.ai.azure.com',
        sdk: 'azure-ai-inference'
    },
    {
        id: 'deepseekV3',
        displayName: 'DeepSeek V3 March',
        modelId: 'DeepSeek-V3-0324',
        endpoint: 'https://models.github.ai/inference',
        sdk: 'azure-ai-inference'
    },
    {
        id: 'mistral-small',
        displayName: 'Mistral Small',
        modelId: 'mistral-small-2503',
        endpoint: 'https://models.github.ai/inference',
        sdk: 'azure-ai-inference'
    }
];


const API_CONFIGS = {
    openai: {
        baseURL: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o',
        validateKey: (key) => key && key.startsWith('sk-')
    },
    github: {
        baseURL: 'https://models.inference.ai.azure.com/chat/completions',
        models: GITHUB_MODELS,
        validateKey: (key) => key && (key.startsWith('ghp_') || key.startsWith('github_pat_'))
    }
};


function getModelConfig(modelId) {
    const defaultModel = GITHUB_MODELS[0];

    if (!modelId || modelId === 'default') {
        return defaultModel;
    }

    const selectedModel = GITHUB_MODELS.find(model => model.id === modelId);
    return selectedModel || defaultModel;
}


function validateModelSelection(apiType, selectedModel) {

    if (apiType === 'openai') {
        return {
            isValid: selectedModel === 'default',
            message: selectedModel !== 'default' ? 'Only default model is supported for OpenAI API' : 'Valid model',
            recommendedModel: 'default'
        };
    }


    if (apiType === 'github') {
        const modelExists = GITHUB_MODELS.some(model => model.id === selectedModel);

        return {
            isValid: modelExists,
            message: modelExists ? 'Valid model' : `Model ${selectedModel} not found in available models`,
            recommendedModel: modelExists ? selectedModel : 'default'
        };
    }


    return {
        isValid: false,
        message: `Unknown API type: ${apiType}`,
        recommendedModel: 'default'
    };
}


export default async (req, res) => {

    console.log('Request received:', {
        method: req.method,
        url: req.url,
        headers: req.headers
    });


    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }


    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }


    const cookies = cookie.parse(req.headers.cookie || '');
    const apiKey = cookies.API_KEY;
    const apiType = cookies.API_TYPE || 'openai';


    const apiConfig = API_CONFIGS[apiType];
    if (!apiConfig) {
        return res.status(400).json({ message: 'Invalid API type specified.' });
    }


    if (!apiKey || !apiConfig.validateKey(apiKey)) {
        return res.status(401).json({
            message: `Invalid ${apiType === 'openai' ? 'API key' : 'token'} format. Please enter a valid ${apiType === 'openai' ? 'OpenAI API key' : 'GitHub token'}.`
        });
    }

    const { conversation, selectedModel } = req.body;

    if (!conversation || !Array.isArray(conversation)) {
        return res.status(400).json({ message: 'Invalid conversation format.' });
    }


    const modelValidation = validateModelSelection(apiType, selectedModel || 'default');


    if (!modelValidation.isValid) {
        console.warn(`Invalid model selection: ${selectedModel}, reason: ${modelValidation.message}`);
        console.warn(`Falling back to recommended model: ${modelValidation.recommendedModel}`);
    }

    try {
        let response;


        if (apiType === 'openai') {

            const client = new OpenAI({ apiKey });

            response = await client.chat.completions.create({
                messages: conversation,
                model: API_CONFIGS.openai.model,
                temperature: 0.7,
                max_tokens: 6000,
                top_p: 1
            });


            const messageContent = response.choices[0].message.content;

            return res.status(200).json({
                message: messageContent,
                success: true,
                usedModel: API_CONFIGS.openai.model
            });
        }
        else if (apiType === 'github') {

            const modelToUse = modelValidation.isValid ? selectedModel : modelValidation.recommendedModel;
            const modelConfig = getModelConfig(modelToUse);

            console.log(`Using model: ${modelConfig.modelId} (selected: ${selectedModel}, validated: ${modelToUse})`);



            const formattedMessages = conversation.map(msg => {

                let role = msg.role;
                if (role === 'developer') {
                    role = 'system';
                }
                return { role: role, content: msg.content };
            });


            const client = ModelClient(
                modelConfig.endpoint,
                new AzureKeyCredential(apiKey)
            );


            response = await client.path("/chat/completions").post({
                body: {
                    messages: formattedMessages,
                    model: modelConfig.modelId,
                    temperature: 0.7,
                    top_p: 1.0,
                    max_tokens: 6000
                }
            });


            let messageContent;

            if (response.status !== "200") {
                throw response.body.error;
            }

            if (response.body.choices[0].message?.content) {
                messageContent = response.body.choices[0].message.content;
            } else if (response.body.choices[0].content) {
                messageContent = response.body.choices[0].content;
            } else {

                const choiceObj = response.body.choices[0];
                console.log('GitHub API choice object structure:', JSON.stringify(choiceObj, null, 2));
                messageContent = 'Sorry, there was an issue parsing the response.';
            }


            res.setHeader('X-Used-Model', modelConfig.modelId);

            return res.status(200).json({
                message: messageContent,
                success: true,
                usedModel: modelConfig.modelId
            });
        }
    } catch (error) {

        console.error(`${apiType.toUpperCase()} API Error:`, {
            error: error.message,
            response: error.response?.data || error.body,
            status: error.response?.status || error.status,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config ? { ...error.config.headers, Authorization: '***' } : {}
            }
        });


        if (error.response?.status === 401 || error.status === 401) {

            res.setHeader('Set-Cookie', [
                'API_KEY=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'API_TYPE=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
            ]);
            return res.status(401).json({
                message: `Invalid ${apiType === 'openai' ? 'API key' : 'token'}. Please enter a valid ${apiType === 'openai' ? 'OpenAI API key' : 'GitHub token'}.`
            });
        }

        if (error.response?.status === 404 || error.status === 404) {
            return res.status(404).json({
                message: 'The API endpoint could not be found. Please check the configuration.'
            });
        }

        if (error.response?.status === 429 || error.status === 429) {
            return res.status(429).json({
                message: apiType === 'openai'
                    ? 'OpenAI API rate limit exceeded.'
                    : `GitHub API rate limit exceeded. [${error}]`
            });
        }

        if (error.response?.status === 413 || error.status === 413) {
            return res.status(413).json({ message: 'Conversation too long.' });
        }


        if ((error.response?.status === 400 || error.status === 400) && apiType === 'github') {
            const errorMessage = error.response?.data?.error?.message || error.body?.error?.message || '';


            if (errorMessage.includes('model') || selectedModel !== 'default') {
                console.warn('Model-specific error detected:', errorMessage);


                if (selectedModel && selectedModel !== 'default') {

                    const modelConfig = getModelConfig(selectedModel);
                    const modelDisplayName = modelConfig.displayName;

                    return res.status(400).json({
                        message: `There was an issue with the ${modelDisplayName} model. Please try again with the default model.`,
                        fallbackToDefault: true,
                        originalModel: selectedModel
                    });
                }
            }
        }

        return res.status(500).json({
            message: error.response?.data?.error?.message || error.body?.error?.message || 'An error occurred while processing your request.'
        });
    }
};