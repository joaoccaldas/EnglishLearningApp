import { WORDS, MISSIONS, LEVELS, SHOP } from './data.js';

const STORAGE_KEY = 'wordbound-state-v1';
const VERSION = 1;
const memoryStorage = new Map();

const storage = {
  getItem(key) {
    try { return window.localStorage.getItem(key); }
    catch { return memoryStorage.get(key) ?? null; }
  },
  setItem(key, value) {
    try { window.localStorage.setItem(key, value); }
    catch { memoryStorage.set(key, String(value)); }
  }
};

const defaultState = () => ({
  version: VERSION,
  profile: { name: 'Explorer', crest: 'W' },
  xp: 0,
  coins: 10,
  streak: 1,
  lastVisit: '',
  completedMissions: {},
  wordStats: {},
  inventory: { hint: 2, shield: 1, focus: 0 },
  settings: { sound: true, speech: true },
  sessions: []
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

function yesterday() {
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function safeParse(raw) {
  try { return JSON.parse(raw); }
  catch { return null; }
}

function normaliseState(input) {
  const base = defaultState();
  if (!input || typeof input !== 'object') return base;
  const state = {
    ...base,
    ...input,
    profile: { ...base.profile, ...(input.profile || {}) },
    completedMissions: input.completedMissions && typeof input.completedMissions === 'object' ? input.completedMissions : {},
    wordStats: input.wordStats && typeof input.wordStats === 'object' ? input.wordStats : {},
    inventory: { ...base.inventory, ...(input.inventory || {}) },
    settings: { ...base.settings, ...(input.settings || {}) },
    sessions: Array.isArray(input.sessions) ? input.sessions.slice(0, 40) : []
  };
  state.xp = Math.max(0, Number(state.xp) || 0);
  state.coins = Math.max(0, Number(state.coins) || 0);
  state.streak = Math.max(1, Number(state.streak) || 1);
  return state;
}

export class WordboundEngine {
  constructor() {
    this.state = normaliseState(safeParse(storage.getItem(STORAGE_KEY)));
    this.session = null;
    this.updateVisitStreak();
  }

  save() {
    storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  updateVisitStreak() {
    const day = today();
    if (this.state.lastVisit === day) return;
    this.state.streak = this.state.lastVisit === yesterday() ? this.state.streak + 1 : 1;
    this.state.lastVisit = day;
    this.save();
  }

  setProfile(name, crest = 'W') {
    this.state.profile.name = String(name || 'Explorer').trim().slice(0, 20) || 'Explorer';
    this.state.profile.crest = String(crest || 'W').trim().slice(0, 2) || 'W';
    this.save();
  }

  toggleSetting(key) {
    if (!(key in this.state.settings)) return;
    this.state.settings[key] = !this.state.settings[key];
    this.save();
  }

  getLevel() {
    let level = LEVELS[0];
    LEVELS.forEach(candidate => { if (this.state.xp >= candidate.xp) level = candidate; });
    const index = LEVELS.indexOf(level);
    const next = LEVELS[index + 1] || null;
    return {
      index,
      number: index + 1,
      name: level.name,
      currentXp: this.state.xp,
      nextXp: next?.xp ?? level.xp,
      progress: next ? Math.min(1, (this.state.xp - level.xp) / (next.xp - level.xp)) : 1
    };
  }

  getCompletedCount() {
    return Object.keys(this.state.completedMissions).length;
  }

  getMission(id) {
    return MISSIONS.find(mission => mission.id === id) || MISSIONS[0];
  }

  isMissionUnlocked(mission) {
    return this.getCompletedCount() >= mission.unlock || Boolean(this.state.completedMissions[mission.id]);
  }

  getForestRestoration() {
    const missionProgress = this.getCompletedCount() / MISSIONS.length;
    const stats = Object.values(this.state.wordStats);
    const mastery = stats.length ? stats.reduce((sum, stat) => sum + Math.min(1, (stat.strength || 0) / 5), 0) / WORDS.length : 0;
    return Math.min(1, missionProgress * 0.82 + mastery * 0.18);
  }

  getDueWords() {
    const now = Date.now();
    return WORDS.filter(word => {
      const stat = this.state.wordStats[word.id];
      return stat && Number(stat.nextReview || 0) <= now;
    });
  }

  getWordStat(wordId) {
    return this.state.wordStats[wordId] || {
      seen: 0,
      correct: 0,
      wrong: 0,
      strength: 0,
      nextReview: 0,
      lastSeen: 0,
      averageTime: 0
    };
  }

  selectWords(mission) {
    const maximumDifficulty = mission.boss ? 3 : Math.min(3, 1 + Math.floor(mission.number / 2));
    const eligible = WORDS.filter(word => word.difficulty <= maximumDifficulty);
    const now = Date.now();
    const ranked = eligible.map(word => {
      const stat = this.getWordStat(word.id);
      const unseenBonus = stat.seen === 0 ? 100 : 0;
      const dueBonus = stat.seen > 0 && stat.nextReview <= now ? 70 : 0;
      const weakness = Math.max(0, 5 - stat.strength) * 11;
      const errorBonus = stat.wrong * 7;
      return { word, score: unseenBonus + dueBonus + weakness + errorBonus + Math.random() * 20 };
    }).sort((a, b) => b.score - a.score);

    const selected = ranked.slice(0, mission.length).map(item => item.word);
    while (selected.length < mission.length) {
      selected.push(eligible[selected.length % eligible.length]);
    }
    return shuffle(selected);
  }

  startMission(missionId) {
    const mission = this.getMission(missionId);
    if (!this.isMissionUnlocked(mission)) throw new Error('Mission is locked');
    const words = this.selectWords(mission);
    this.session = {
      id: `${mission.id}-${Date.now()}`,
      mission,
      words,
      index: 0,
      score: 0,
      hearts: 3,
      streak: 0,
      bestStreak: 0,
      correct: 0,
      attempts: 0,
      hints: 0,
      startedAt: Date.now(),
      challengeStartedAt: Date.now(),
      results: []
    };
    return this.getCurrentChallenge();
  }

  getCurrentChallenge() {
    if (!this.session) return null;
    const word = this.session.words[this.session.index];
    const types = this.session.mission.challengeTypes;
    const type = types[this.session.index % types.length];
    this.session.challengeStartedAt = Date.now();
    return this.createChallenge(word, type);
  }

  createChallenge(word, type) {
    if (type === 'translation') {
      return {
        type,
        word,
        eyebrow: 'Translation portal',
        prompt: word.swedish,
        instruction: 'Write the English word',
        answer: word.word
      };
    }
    if (type === 'spellforge') {
      let letters = shuffle(word.word.split(''));
      if (letters.join('') === word.word && letters.length > 1) letters = [...letters.slice(1), letters[0]];
      return {
        type,
        word,
        eyebrow: 'Spellforge',
        prompt: letters.join(' · '),
        instruction: 'Rebuild the word',
        answer: word.word
      };
    }
    const distractors = shuffle(WORDS.filter(item => item.id !== word.id && item.difficulty <= word.difficulty + 1)).slice(0, 3);
    return {
      type: 'definition',
      word,
      eyebrow: 'Rune pool',
      prompt: word.definition,
      instruction: 'Choose the matching English word',
      answer: word.word,
      choices: shuffle([word, ...distractors]).map(item => item.word)
    };
  }

  useItem(itemId) {
    if (!this.session || !this.state.inventory[itemId]) return false;
    this.state.inventory[itemId] -= 1;
    if (itemId === 'hint') this.session.hints += 1;
    this.save();
    return true;
  }

  checkAnswer(answer) {
    if (!this.session) return null;
    const challenge = this.getCurrentChallengeSnapshot();
    const expected = challenge.answer.trim().toLocaleLowerCase('en');
    const received = String(answer || '').trim().toLocaleLowerCase('en');
    const elapsed = Date.now() - this.session.challengeStartedAt;
    const correct = received === expected;
    this.session.attempts += 1;

    if (correct) {
      const base = challenge.word.difficulty * 10 + 10;
      const speedBonus = elapsed < 5000 ? 6 : elapsed < 9000 ? 3 : 0;
      const streakBonus = Math.min(10, this.session.streak * 2);
      const points = base + speedBonus + streakBonus;
      this.session.score += points;
      this.session.correct += 1;
      this.session.streak += 1;
      this.session.bestStreak = Math.max(this.session.bestStreak, this.session.streak);
      this.recordWord(challenge.word, true, elapsed);
      this.session.results.push({ wordId: challenge.word.id, correct: true, elapsed, points });
      return { correct: true, expected, points, word: challenge.word };
    }

    let protectedByShield = false;
    if (this.state.inventory.shield > 0) {
      this.state.inventory.shield -= 1;
      protectedByShield = true;
    } else {
      this.session.hearts = Math.max(0, this.session.hearts - 1);
    }
    this.session.streak = 0;
    this.recordWord(challenge.word, false, elapsed);
    this.session.results.push({ wordId: challenge.word.id, correct: false, elapsed, answer: received });
    this.save();
    return {
      correct: false,
      expected,
      protectedByShield,
      similarity: this.similarity(received, expected),
      word: challenge.word
    };
  }

  getCurrentChallengeSnapshot() {
    if (!this.session) return null;
    const word = this.session.words[this.session.index];
    const types = this.session.mission.challengeTypes;
    const type = types[this.session.index % types.length];
    return this.createChallenge(word, type);
  }

  advance() {
    if (!this.session) return { done: true };
    this.session.index += 1;
    const done = this.session.index >= this.session.words.length || this.session.hearts <= 0;
    if (done) return { done: true, summary: this.finishSession() };
    return { done: false, challenge: this.getCurrentChallenge() };
  }

  recordWord(word, correct, elapsed) {
    const current = this.getWordStat(word.id);
    const seen = current.seen + 1;
    const strength = correct ? Math.min(5, current.strength + 1) : Math.max(0, current.strength - 1);
    const intervals = [5 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 86400000, 7 * 86400000, 14 * 86400000, 30 * 86400000];
    const nextReview = Date.now() + (correct ? intervals[strength] : intervals[0]);
    this.state.wordStats[word.id] = {
      seen,
      correct: current.correct + (correct ? 1 : 0),
      wrong: current.wrong + (correct ? 0 : 1),
      strength,
      lastSeen: Date.now(),
      nextReview,
      averageTime: Math.round(((current.averageTime || 0) * current.seen + elapsed) / seen)
    };
    this.save();
  }

  finishSession() {
    const session = this.session;
    const accuracy = session.attempts ? session.correct / session.attempts : 0;
    const completed = session.index >= session.words.length && session.hearts > 0;
    const stars = completed ? (accuracy >= .9 ? 3 : accuracy >= .7 ? 2 : 1) : 0;
    const xpEarned = completed ? session.mission.reward.xp + session.score : Math.round(session.score * .45);
    const coinsEarned = completed ? session.mission.reward.coins + stars * 3 : Math.round(session.score / 18);
    this.state.xp += xpEarned;
    this.state.coins += coinsEarned;

    if (completed) {
      const previous = this.state.completedMissions[session.mission.id];
      this.state.completedMissions[session.mission.id] = {
        stars: Math.max(stars, previous?.stars || 0),
        bestAccuracy: Math.max(Math.round(accuracy * 100), previous?.bestAccuracy || 0),
        completedAt: new Date().toISOString()
      };
    }

    const summary = {
      mission: session.mission,
      completed,
      stars,
      accuracy: Math.round(accuracy * 100),
      score: session.score,
      xpEarned,
      coinsEarned,
      bestStreak: session.bestStreak,
      reviewed: session.words.length,
      results: session.results
    };
    this.state.sessions.unshift({ ...summary, at: new Date().toISOString(), results: undefined });
    this.state.sessions = this.state.sessions.slice(0, 40);
    this.session = null;
    this.save();
    return summary;
  }

  buyItem(itemId) {
    const item = SHOP.find(entry => entry.id === itemId);
    if (!item || this.state.coins < item.price) return false;
    this.state.coins -= item.price;
    this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + 1;
    this.save();
    return true;
  }

  getParentSummary() {
    const stats = Object.entries(this.state.wordStats).map(([id, stat]) => ({ word: WORDS.find(item => item.id === id), ...stat })).filter(item => item.word);
    const weakest = [...stats].sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct)).slice(0, 5);
    const mastered = stats.filter(stat => stat.strength >= 4);
    const attempts = stats.reduce((sum, stat) => sum + stat.seen, 0);
    const correct = stats.reduce((sum, stat) => sum + stat.correct, 0);
    return {
      wordsSeen: stats.length,
      mastered: mastered.length,
      attempts,
      accuracy: attempts ? Math.round(correct / attempts * 100) : 0,
      due: this.getDueWords().length,
      weakest,
      recentSessions: this.state.sessions.slice(0, 5)
    };
  }

  similarity(a, b) {
    if (!a || !b) return 0;
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        matrix[i][j] = a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
      }
    }
    return (Math.max(a.length, b.length) - matrix[a.length][b.length]) / Math.max(a.length, b.length);
  }
}

export { WORDS, MISSIONS, LEVELS, SHOP };
