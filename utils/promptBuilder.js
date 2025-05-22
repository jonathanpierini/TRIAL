const fs = require('fs');
const path = require('path');

const promptData = require('../prompts/prompt_api.json');

// Estrae il polo dominante dal profilo Halifax
function getDominantPole(profile) {
  return Object.entries(profile).sort((a, b) => b[1] - a[1])[0][0];
}

// Costruisce il prompt finale
function generatePrompt(userInput, halifaxProfile = null, memory = null) {
  let base = promptData.base_prompt_ACT;
  let toneInfo = '';
  let extra = '';

  if (halifaxProfile) {
    const pole = getDominantPole(halifaxProfile);
    const poleData = promptData.poli[pole];
    if (poleData) {
      toneInfo = `[Tono: ${poleData.tone}]`;
      extra = poleData.prompt_addition;
    }
  }

  // Inserimento memoria utente
  let memoryBlock = '';
  if (memory) {
    if (memory.valori) memoryBlock += `Hai dichiarato che per te conta: ${memory.valori}.\n`;
    if (memory.crisi_recenti) memoryBlock += `Crisi recente: ${memory.crisi_recenti}.\n`;
    if (memory.azioni_impegnate) memoryBlock += `Hai agito su: ${memory.azioni_impegnate}.\n`;
    if (memory.note_diario) memoryBlock += `Dal diario emerge: ${memory.note_diario}.\n`;
  }

  return `${base}\n${toneInfo}\n${extra}\n${memoryBlock}\n\nUtente: ${userInput}\nAssistente:`;
}

module.exports = { generatePrompt };
