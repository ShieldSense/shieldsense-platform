#!/usr/bin/env node

/**
 * Local server for testing GitHub Pages build with correct base path
 * This serves the 'out' directory with the '/shieldsense-platform' base path
 * to match the production GitHub Pages environment.
 * 
 * Usage: node serve-local.js
 * Then visit: http://localhost:3001/shieldsense-platform/
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Serve static files from out directory with the GitHub Pages base path
app.use('/shieldsense-platform', express.static(path.join(__dirname, 'out')));

// Redirect root to the base path for convenience
app.get('/', (req, res) => {
  res.redirect('/shieldsense-platform/');
});

// Handle 404s
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Not Found</h1>
    <p>Try visiting: <a href="/shieldsense-platform/">http://localhost:${PORT}/shieldsense-platform/</a></p>
  `);
});

app.listen(PORT, () => {
  console.log('🚀 ShieldSense Local Server Started!');
  console.log('');
  console.log(`📍 Visit: http://localhost:${PORT}/shieldsense-platform/`);
  console.log('');
  console.log('This server simulates the GitHub Pages environment');
  console.log('with the correct /shieldsense-platform/ base path.');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});