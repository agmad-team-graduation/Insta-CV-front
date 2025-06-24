const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());

app.get('/generate-pdf', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send('Missing url parameter');

        console.log('Generating PDF for URL:', url);

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ],
            executablePath: undefined // Let Puppeteer find Chrome automatically
        });

        const page = await browser.newPage();

        // Increase timeout and wait for page to be fully loaded
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000 // 60 seconds timeout
        });

        // Replace waitForTimeout with setTimeout wrapped in a Promise
        await new Promise(resolve => setTimeout(resolve, 2000));

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF: ' + error.message);
    }
});

app.listen(3001, () => console.log('PDF server running on port 3001')); 