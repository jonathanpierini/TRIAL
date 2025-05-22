const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const { calculateHalifaxProfile } = require('./utils/halifax');
const questions = require('./quiz/questions.json');
const { generatePrompt } = require('./utils/promptBuilder');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

let lastProfile = null;
let memory = {
  valori: "",
  crisi_recenti: "",
  azioni_impegnate: "",
  note_diario: ""
};

app.get('/', (req, res) => {
  res.render('quiz', { questions });
});

app.post('/api/quiz/submit', (req, res) => {
  const responses = req.body.responses;
  lastProfile = calculateHalifaxProfile(responses);
  res.json({ profile: lastProfile });
});

app.get('/chat', (req, res) => {
  res.render('chat', { response: null });
});

app.post('/ask', async (req, res) => {
  const question = req.body.question?.trim();
  try {
    const prompt = generatePrompt(question, lastProfile, memory);
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const reply = response.data.choices[0].message.content;
    res.render('chat', { response: reply });
  } catch (err) {
    console.error("Errore OpenAI:", err.message);
    res.render('chat', { response: "Errore durante la generazione della risposta." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));
