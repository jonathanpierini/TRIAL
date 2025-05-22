const fs = require('fs');
const path = require('path');

// Importa prompt dinamico strutturato
const promptData = require('../prompts/prompt_api.json');

// Funzione: ritorna polo dominante da un profilo Halifax
function getDominantPole(profile) {
  return Object.entries(profile).sort((a, b) => b[1] - a[1])[0][0];
}

// Funzione: genera il prompt personalizzato
function generatePrompt(question, halifaxProfile = null, memory = null) {
  const base = [];

  // Memoria attiva
  if (memory) {
    if (memory.valori) base.push(`Hai dichiarato che per te conta molto: ${memory.valori}.`);
    if (memory.crisi_recenti) base.push(`Recentemente hai vissuto: ${memory.crisi_recenti}.`);
    if (memory.azioni_impegnate) base.push(`Hai intrapreso queste azioni: ${memory.azioni_impegnate}.`);
    if (memory.note_diario) base.push(`Dal tuo diario emerge: ${memory.note_diario}.`);
  }

  // Adattamento Halifax
  let halifaxNote = '';
  if (halifaxProfile) {
    const pole = getDominantPole(halifaxProfile);
    const tone = promptData.structure.hexaflex_poles[pole]?.tone;
    const phrase = promptData.structure.hexaflex_poles[pole]?.phrases[0];
    halifaxNote = `

[Polo attivo: ${pole} – tono ${tone}]
${phrase}`;
  }

  // Costruisci prompt finale
  const finalPrompt = `${base.join('\n')}${halifaxNote}

Utente: ${question}
Assistente:`;
  return finalPrompt;
}

module.exports = { generatePrompt };
