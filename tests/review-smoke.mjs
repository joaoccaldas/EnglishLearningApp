import assert from 'node:assert/strict';
import { WordboundEngine, WORDS } from '../js/wordbound/engine.js';
import { isValidBackup, makeBackup, reviewReward, selectReviewWords, todayStamp } from '../js/wordbound/review.js';

const engine = new WordboundEngine();
engine.state = {
  version: 1,
  profile: { name: 'Review Tester', crest: 'R' },
  xp: 100,
  coins: 20,
  streak: 2,
  lastVisit: todayStamp(),
  completedMissions: {},
  wordStats: {
    owl: { seen: 3, correct: 1, wrong: 2, strength: 1, nextReview: 0, lastSeen: 0, averageTime: 4000 },
    bee: { seen: 3, correct: 3, wrong: 0, strength: 5, nextReview: Date.now() + 99999999, lastSeen: Date.now(), averageTime: 2000 }
  },
  inventory: { hint: 1, shield: 1, focus: 0 },
  settings: { sound: false, speech: false },
  sessions: []
};

const selected = selectReviewWords(engine, WORDS, 5);
assert.equal(selected.length, 5, 'Daily review should select five words');
assert.ok(selected.some(word => word.id === 'owl'), 'Due weak words should be prioritised');

const firstReward = reviewReward({ correct: 4, total: 5, completedToday: false });
const repeatReward = reviewReward({ correct: 4, total: 5, completedToday: true });
assert.equal(firstReward.accuracy, 80, 'Review accuracy should be calculated');
assert.ok(firstReward.xp > repeatReward.xp, 'First daily completion should earn a bonus');
assert.ok(firstReward.coins > repeatReward.coins, 'First daily completion should earn bonus coins');

const backup = makeBackup(engine.state);
assert.equal(isValidBackup(backup), true, 'Exported state should be a valid backup');
assert.equal(isValidBackup({ xp: 1 }), false, 'Incomplete state should be rejected');
assert.match(backup.exportFormat, /^wordbound-save-/, 'Backup should include a format marker');

console.log('Wordbound daily review smoke test passed');
