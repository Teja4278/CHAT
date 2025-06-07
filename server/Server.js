// server/index.js
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();
// console.log("Loaded OpenAI Key:", process.env.OPENAI_API_KEY?.slice(0, 10) + '...');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages;
    console.log("Received messages:", messages);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    console.log("✅ OpenAI Response:", response);
    res.json({ reply: response.choices[0].message });

  } catch (err) {
    console.error("❌ OpenAI Error (Full):", err); // log full error
    res.status(500).json({
      error: err.response?.data?.error?.message || err.message || "Unknown server error",
    });
  }
});



