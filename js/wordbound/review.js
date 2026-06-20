export function todayStamp(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function selectReviewWords(engine, words, limit = 5) {
  const now = Date.now();
  const ranked = words.map(word => {
    const stat = engine.getWordStat(word.id);
    const due = stat.seen > 0 && Number(stat.nextReview || 0) <= now;
    const unseen = stat.seen === 0;
    const weakness = Math.max(0, 5 - Number(stat.strength || 0));
    const errors = Number(stat.wrong || 0);
    const age = Math.max(0, now - Number(stat.lastSeen || 0)) / 86400000;
    return {
      word,
      score:
        (due ? 120 : 0) +
        (unseen ? 75 : 0) +
        weakness * 14 +
        errors * 9 +
        Math.min(20, age) +
        Math.random() * 4
    };
  });

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(limit, ranked.length))
    .map(item => item.word);
}

export function reviewReward({ correct, total, completedToday }) {
  const accuracy = total ? correct / total : 0;
  const firstCompletionBonus = completedToday ? 0 : 24;
  const xp = Math.round(12 + accuracy * 28 + firstCompletionBonus);
  const coins = Math.round(4 + accuracy * 7 + (completedToday ? 0 : 5));
  return {
    accuracy: Math.round(accuracy * 100),
    xp,
    coins
  };
}

export function isValidBackup(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (!value.profile || typeof value.profile !== 'object') return false;
  if (!Number.isFinite(Number(value.xp)) || !Number.isFinite(Number(value.coins))) return false;
  if (!value.completedMissions || typeof value.completedMissions !== 'object') return false;
  if (!value.wordStats || typeof value.wordStats !== 'object') return false;
  if (value.sessions && !Array.isArray(value.sessions)) return false;
  return true;
}

export function makeBackup(state) {
  return {
    ...state,
    exportedAt: new Date().toISOString(),
    exportFormat: 'wordbound-save-v1'
  };
}
