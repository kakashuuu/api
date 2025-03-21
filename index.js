
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware untuk menyajikan file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Default route untuk menampilkan halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk halaman dokumentasi
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

// Route untuk halaman API Key
app.get('/apikey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'apikey.html'));
});

import crypto from 'crypto';

// Simpan API keys sementara (bisa diganti dengan database)
let apiKeys = [];

// Endpoint untuk mendapatkan API key baru
app.get('/generate_apikey', (req, res) => {
    const newApiKey = crypto.randomBytes(16).toString('hex'); // Generate random API key
    apiKeys.push(newApiKey); // Simpan ke array sementara
    res.json({ success: true, apiKey: newApiKey });
});

// Middleware untuk mengecek API key
app.use((req, res, next) => {
    const apiKey = req.query.apikey;
    if (!apiKey || !apiKeys.includes(apiKey)) {
        return res.status(403).json({ success: false, message: 'Invalid API Key' });
    }
    next();
});

import fs from 'fs';
import path from 'path';

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
