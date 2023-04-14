const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');
const axios = require('axios');
require('dotenv').config();


const key = process.env.REACT_APP_OPENAI_API_KEY
const API_KEY = process.env.REACT_APP_DUCK_KEY;
const API_SECRET = process.env.REACT_APP_DUCK_SECRET;
const cors_key = process.env.REACT_APP_CORS_KEY;
// Middleware for handling CORS issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));

// Define your API routes here
 // Install using: npm install axios

app.post('/api/openai', async (req, res) => {
  // Your OpenAI API call logic here
  app.post('/api/openai', async (req, res) => {
    try {
      const input = req.body.messages;
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: input,
        temperature: 1.2,
        top_p: 1,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      });
      res.json(response.data.choices[0]);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  });
  
});

app.post('/api/uberduck', async (req, res) => {
  // Your Uberduck API call logic here
  app.post('/api/uberduck', async (req, res) => {
    try {
      const input = req.body.speech;
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'uberduck-id': 'anond98e3de5-8b78-4706-98ae-e24058aaf97cymous',
          'content-type': 'application/json',
          authorization: 'Basic ' + btoa(API_KEY + ':' + API_SECRET),
          origin: 'https://bmo-0g4t.onrender.com/',
          'x-requested-with': 'XMLHttpRequest',
        },
        data: JSON.stringify({ voicemodel_uuid: "d98e3de5-8b78-4706-98ae-e24058aaf97c", pace: 1, speech: `${input}` }),
        url: 'https://api.uberduck.ai/speak-synchronous',
      };
  
      const response = await axios(options);
      res.send(response.data);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  });
  
});


// Serve the React app's index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server is listening at http://localhost:${port}`);
});
