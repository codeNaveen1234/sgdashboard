const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 9192;

const buildPath = path.join(__dirname, 'dist', 'shikshagraha-dashboard', 'browser');

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});