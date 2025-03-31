import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

app.get('/apikey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'apikey.html'));
});

let apiKeys = [];

app.get('/generate_apikey', (req, res) => {
    const newApiKey = crypto.randomBytes(16).toString('hex');
    apiKeys.push(newApiKey);
    res.json({ success: true, apiKey: newApiKey });
});

app.use((req, res, next) => {
    const apiKey = req.query.apikey;
    if (!apiKey || !apiKeys.includes(apiKey)) {
        return res.status(403).json({ success: false, message: 'Invalid API Key' });
    }
    next();
});

const scraperPath = path.join(__dirname, 'scraper');

fs.readdirSync(scraperPath).forEach(file => {
    if (file.endsWith('.js')) {
        import(`./scraper/${file}`).then(module => {
            if (module.exampleEndpoint) {
                app.get(`/api/${file.replace('.js', '')}`, module.exampleEndpoint);
                console.log(`Loaded endpoint: /api/${file.replace('.js', '')}`);
            }
        }).catch(err => console.error(`Error loading ${file}:`, err));
    }
});
