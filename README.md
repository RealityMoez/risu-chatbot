# Risu buddy
Your personal AI buddy.

___Still in development..___

## Features

- **Multiple AI Provider**: Choose between OpenAI and GitHub Models
- **Secure API Key Management**: Cookie-based storage with automatic validation
- **Character Consistency**: Risu maintains personality and context throughout conversations

## API Providers

### OpenAI
- **Models**: `gpt-4o` (add others on request)
- **Requirements**: Valid OpenAI API key (starts with `sk-`)
- **Features**: Faster responses, longer context and high requests per minute

### GitHub Models
- **Models**: `gpt-4.1`, `DeepSeek V3`, `Mistrall Small` (more to be added)
- **Requirements**: GitHub Personal Access Token
- **Features**: Free tier available, Azure-hosted inference

## Setup & Usage

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```

### 3. Configure API Provider
1. Open your browser and go to [http://localhost:3000](http://localhost:3000)
2. On first visit, you'll see an API key popup
3. Choose your preferred provider (OpenAI or GitHub)
4. Enter your API key/token
5. Start chatting with Risu!

### 4. API Key Management
- Keys are stored securely in browser cookies
- Switch providers anytime through the interface
- Invalid keys are automatically cleared with helpful error messages

## Production

- `npm run build` – Build the app for production
- `npm start` – Start the production server
- `npm run deploy` – Deploy using Vercel

## Requirements

- **Node.js**: 22.x
- **npm**

## Architecture

- **Frontend**: Vanilla JavaScript, HTML, CSS (no frameworks)
- **Backend**: Node.js serverless proxy for secure API key handling and CORS
- **API Endpoint**: Single `/api/chat` endpoint supporting multiple AI providers
- **Deployment**: Vercel serverless platform 