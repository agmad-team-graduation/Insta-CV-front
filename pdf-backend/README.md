# PDF Backend Service

This service generates PDFs from HTML content using Puppeteer and connects to a browserless service for deployment.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
# Browserless WebSocket endpoint for PDF generation
BROWSER_WS_ENDPOINT=wss://chrome.browserless.io?token=your_token_here

# Server configuration
PORT=3001
NODE_ENV=production
```

## Development

Start the development server:
```bash
npm run dev
```

**Note**: For local development, you can leave `BROWSER_WS_ENDPOINT` unset, and the service will use a local Chrome instance.

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check service status and browser connection

### Generate PDF
- `GET /generate-pdf?url=<url>&token=<token>` - Generate PDF from HTML URL

## Deployment

This service is designed to work with Railway deployment and connects to a browserless service.

### Environment Variables for Railway

Set these environment variables in your Railway project:

- `BROWSER_WS_ENDPOINT`: WebSocket endpoint for the browserless service (e.g., `wss://chrome.browserless.io?token=your_token`)
- `PORT`: Port for the server to listen on (Railway will set this automatically)
- `NODE_ENV`: Set to `production`

### Browserless Service

The service connects to a browserless instance for PDF generation. The service supports:

- **Browserless.io**: Use `wss://chrome.browserless.io?token=your_token`
- **Custom browserless instance**: Use your own WebSocket endpoint
- **Local development**: Leave `BROWSER_WS_ENDPOINT` unset to use local Chrome

### Connection Strategy

The service automatically chooses the connection method:

1. **If `BROWSER_WS_ENDPOINT` is set**: Connects to the browserless service via WebSocket
2. **If `BROWSER_WS_ENDPOINT` is not set**: Launches a local Chrome instance for development

## Troubleshooting

1. **WebSocket connection errors**: Check that your `BROWSER_WS_ENDPOINT` is correct and the token is valid
2. **Browser connection issues**: Check that the browserless service is running and accessible
3. **PDF generation fails**: Verify the URL is accessible and contains valid HTML
4. **Memory issues**: The service automatically restarts the browser connection every 5 minutes
5. **Local development issues**: Make sure Chrome is installed on your system if using local mode 