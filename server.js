// Import required modules
const express = require('express');
const path = require('path');

// Initialize Express app
const app = express();

// Set the static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route for the homepage
app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () =>
{
    console.log(`Server is running on http://localhost:${port}`);
});