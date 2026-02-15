const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.CLIENT_PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Bookmark Manager frontend running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to use the application`);
});