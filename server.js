const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Generate Random Email
app.get('/api/gen-email', async (req, res) => {
  try {
    const response = await fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
    const data = await response.json();
    if (data && data.length > 0) {
      res.json({ success: true, email: data[0] });
    } else {
      res.status(500).json({ success: false, error: 'Could not generate email' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Check Inbox Messages
app.get('/api/check-inbox', async (req, res) => {
  const { login, domain } = req.query;
  if (!login || !domain) {
    return res.status(400).json({ success: false, error: 'Missing login or domain' });
  }
  try {
    const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
    const messages = await response.json();
    res.json({ success: true, messages: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Read Single Email Message Details
app.get('/api/read-message', async (req, res) => {
  const { login, domain, id } = req.query;
  if (!login || !domain || !id) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }
  try {
    const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
    const messageDetails = await response.json();
    res.json({ success: true, message: messageDetails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Temp Mail server running on port ${PORT}`));
