const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());


// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      browserConnected: globalBrowser ? globalBrowser.isConnected() : false,
      uptime: process.uptime()
    });
  });
// Global browser instance for reuse
let globalBrowser = null;
let browserLaunchTime = null;
const BROWSER_RESTART_INTERVAL = 5 * 60 * 1000; // 5 minutes
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function getBrowser() {
  const now = Date.now();
  
  // Restart browser if it's been running too long or if it's null
  if (!globalBrowser || !browserLaunchTime || (now - browserLaunchTime) > BROWSER_RESTART_INTERVAL) {
    if (globalBrowser) {
      try {
        await globalBrowser.close();
      } catch (error) {
        console.error('Error closing old browser:', error);
      }
    }
    
    console.log('Launching new browser instance...');
    
    // Try different launch configurations for Windows compatibility
    const launchConfigs = [
      {
        name: 'With executable path',
        options: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ],
          executablePath: chromePath,
          timeout: 30000,
          protocolTimeout: 30000,
          defaultViewport: { width: 1200, height: 800 }
        }
      },
    ];

    let lastError = null;
    
    for (const config of launchConfigs) {
      try {
        console.log(`Trying browser configuration: ${config.name}`);
        globalBrowser = await puppeteer.launch(config.options);
        console.log(`✓ Browser launched successfully with ${config.name}`);
        break;
      } catch (error) {
        console.error(`✗ Failed with ${config.name}:`, error.message);
        lastError = error;
        
        // Wait a bit before trying next configuration
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!globalBrowser) {
      throw new Error(`All browser configurations failed. Last error: ${lastError?.message}`);
    }
    
    browserLaunchTime = now;
    
    // Handle browser disconnection
    globalBrowser.on('disconnected', () => {
      console.log('Browser disconnected, will restart on next request');
      globalBrowser = null;
      browserLaunchTime = null;
    });
  }
  
  return globalBrowser;
}

app.get('/generate-pdf', async (req, res) => {
  let page = null;
  let retryCount = 0;
  const maxRetries = 2;
  
    try {
        let { url, token } = req.query;
        if (!url) return res.status(400).send('Missing url parameter');
        if (!token) return res.status(400).send('Missing token parameter');
        if (typeof token !== 'string' || token.trim() === '') {
            return res.status(400).send('Invalid token parameter');
        }

        console.log(`Generating PDF for URL: ${url} (attempt ${retryCount + 1})`);
        console.log(`Using token: ${token.substring(0, 20)}...`);

        const browser = await getBrowser();
        
        // Check if browser is still connected
        if (!browser.isConnected()) {
        console.log('Browser not connected, restarting...');
        globalBrowser = null;
        browserLaunchTime = null;
        return res.status(500).send('Browser not connected');
        }

        page = await browser.newPage();
        
        // Set a more conservative user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Set the isLoggedIn cookie using the token from frontend
        await page.setCookie({
        name: 'isLoggedIn',
        value: token,
        domain: 'localhost',
        path: '/'
        });
        
        console.log('Set isLoggedIn cookie with user token');
        
        // Disable images and other resources for faster loading
        await page.setRequestInterception(true);
        page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
        });

        // Navigate with more conservative settings
        await page.goto(url, {
        waitUntil: 'domcontentloaded', // Changed to domcontentloaded for faster loading
        timeout: 30000 // Reduced timeout
        });

        // Inject CSS to ensure proper page layout
        await page.addStyleTag({
        content: `
            @page {
            size: A4;
            margin: 10mm;
            }
            body {
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.2;
            }
            
            /* Override any single-page constraints */
            .resume-container, 
            .resume-preview,
            .single-page-resume {
            max-height: none !important;
            overflow: visible !important;
            height: auto !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
            }
            
            /* Ensure proper page breaks */
            .page-break {
            page-break-before: always;
            }
            
            /* Allow page breaks between sections but not within them */
            .resume-section,
            .section {
            page-break-inside: avoid;
            break-inside: avoid;
            }
            
            /* Override any print-specific constraints */
            @media print {
            .resume-container,
            .resume-preview,
            .single-page-resume {
                max-height: none !important;
                overflow: visible !important;
                height: auto !important;
                page-break-inside: auto !important;
                break-inside: auto !important;
            }
            }
            
            /* Additional overrides for all possible containers */
            div[class*="resume"],
            div[class*="Resume"],
            .bg-white,
            .shadow-lg,
            .rounded-lg,
            .overflow-hidden {
            max-height: none !important;
            overflow: visible !important;
            height: auto !important;
            }
            
            /* Preserve border radius for skill badges while removing it for other elements */
            .rounded-lg,
            .rounded-md,
            .rounded-sm,
            .rounded-xl,
            .rounded-2xl,
            .rounded-3xl {
            border-radius: 0 !important;
            }
            
            /* Keep border radius for skill badges */
            .rounded-full {
            border-radius: 9999px !important;
            }
            
            /* Keep border radius for skill badges with rounded class */
            .rounded {
            border-radius: 0.375rem !important;
            }
        `
        });

        // Inject JavaScript to remove problematic styles directly
        await page.evaluate(() => {
        // Remove any inline styles that might constrain height
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const style = el.style;
            if (style.maxHeight && (style.maxHeight.includes('100vh') || style.maxHeight.includes('297mm'))) {
            style.removeProperty('max-height');
            }
            if (style.overflow && style.overflow === 'hidden') {
            style.removeProperty('overflow');
            }
            if (style.height && style.height.includes('100vh')) {
            style.removeProperty('height');
            }
        });
        
        // Remove any CSS classes that might be causing issues
        const containers = document.querySelectorAll('.resume-container, .resume-preview, .single-page-resume');
        containers.forEach(container => {
            container.style.maxHeight = 'none';
            container.style.overflow = 'visible';
            container.style.height = 'auto';
            container.style.pageBreakInside = 'auto';
        });
        });

        // Wait for content to fully render
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use a higher scale to better utilize page width
        const scale = 0.9;
        console.log('Using scale:', scale);

        const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '5mm',
            right: '5mm',
            bottom: '5mm',
            left: '5mm'
        },
        preferCSSPageSize: false,
        scale: scale
        });

        // Close the page but keep the browser
        await page.close();
        page = null;

        res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
        });
        res.send(pdfBuffer);
        
        console.log('PDF generated successfully');
        return; // Success, exit the retry loop
        
    } catch (error) {
        console.error(`Error generating PDF (attempt ${retryCount + 1}):`, error);
        
        // Close page if it exists
        if (page) {
        try {
            await page.close();
        } catch (closeError) {
            console.error('Error closing page:', closeError);
        }
        page = null;
        }
        
        // If browser connection error, restart browser
        if (error.message.includes('ECONNRESET') || error.message.includes('Target closed') || error.message.includes('Session closed')) {
        console.log('Browser connection error detected, restarting browser...');
        if (globalBrowser) {
            try {
            await globalBrowser.close();
            } catch (closeError) {
            console.error('Error closing browser:', closeError);
            }
        }
        globalBrowser = null;
        browserLaunchTime = null;
        }
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down PDF server...');
  if (globalBrowser) {
    try {
      await globalBrowser.close();
    } catch (error) {
      console.error('Error closing browser on shutdown:', error);
    }
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down PDF server...');
  if (globalBrowser) {
    try {
      await globalBrowser.close();
    } catch (error) {
      console.error('Error closing browser on shutdown:', error);
    }
  }
  process.exit(0);
});

app.listen(3001, () => console.log('PDF server running on port 3001')); 