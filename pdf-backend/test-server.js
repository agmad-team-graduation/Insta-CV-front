const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Simple test endpoints
app.get('/ping', (req, res) => {
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString(),
    server: 'test-server'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'test-server'
  });
});

app.get('/test-browser', async (req, res) => {
  try {
    const puppeteer = require('puppeteer');
    console.log('Testing browser launch...');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Browser launched successfully');
    await browser.close();
    console.log('Browser closed successfully');
    
    res.json({ 
      success: true,
      message: 'Browser test passed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Browser test failed:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(3002, () => {
  console.log('Test server running on port 3002');
  console.log('Test endpoints:');
  console.log('  GET /ping');
  console.log('  GET /health');
  console.log('  GET /test-browser');
}); 