function calculateHalifaxProfile(responses) {
  const poles = {
    defusion: 0,
    values: 0,
    acceptance: 0,
    contact: 0,
    selfAsContext: 0,
    committedAction: 0
  };

  responses.forEach(({ questionId, answerIndex }) => {
    const question = require('../quiz/questions.json').find(q => q.id === questionId);
    if (question && poles[question.actPole] !== undefined) {
      poles[question.actPole] += answerIndex;
    }
  });

  return poles;
}

module.exports = { calculateHalifaxProfile };
