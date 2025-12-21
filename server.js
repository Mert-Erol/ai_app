console.log('Starting server script...');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve the project root (so index-aliCansu.html and other static assets are available)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index-aliCansu.html'));
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server failed:', err);
});
