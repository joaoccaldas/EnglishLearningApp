import assert from 'node:assert/strict';
import { WordboundEngine, MISSIONS } from '../js/wordbound/engine.js';

const engine = new WordboundEngine();
engine.state = {
  version: 1,
  profile: { name: 'Test Ranger', crest: 'T' },
  xp: 0,
  coins: 100,
  streak: 1,
  lastVisit: new Date().toISOString().slice(0, 10),
  completedMissions: {},
  wordStats: {},
  inventory: { hint: 2, shield: 1, focus: 1 },
  settings: { sound: false, speech: false },
  sessions: []
};

assert.equal(engine.isMissionUnlocked(MISSIONS[0]), true, 'First mission should be unlocked');
assert.equal(engine.isMissionUnlocked(MISSIONS[1]), false, 'Second mission should start locked');

let challenge = engine.startMission('lantern-path');
assert.equal(engine.session.words.length, 5, 'Lantern Path should contain five challenges');
assert.equal(challenge.type, 'translation', 'Lantern Path should use translation challenges');

while (engine.session) {
  const result = engine.checkAnswer(challenge.answer);
  assert.equal(result.correct, true, 'Correct answers should be recognised');
  const next = engine.advance();
  if (next.done) {
    assert.equal(next.summary.completed, true, 'Perfect run should complete mission');
    assert.equal(next.summary.stars, 3, 'Perfect run should award three stars');
    break;
  }
  challenge = next.challenge;
}

assert.equal(engine.getCompletedCount(), 1, 'Completed mission should be recorded');
assert.equal(engine.isMissionUnlocked(MISSIONS[1]), true, 'Completing mission one should unlock mission two');
assert.ok(engine.state.xp > 0, 'Mission completion should award XP');
assert.ok(engine.state.coins > 100, 'Mission completion should award coins');
assert.ok(Object.keys(engine.state.wordStats).length > 0, 'Word mastery should be recorded');

challenge = engine.startMission('echo-grove');
const wrongOne = engine.checkAnswer('definitely-wrong');
assert.equal(wrongOne.correct, false, 'Incorrect answer should be recognised');
assert.equal(wrongOne.protectedByShield, true, 'First incorrect answer should consume the shield');
assert.equal(engine.session.hearts, 3, 'Shield should protect a heart');
engine.advance();

challenge = engine.getCurrentChallenge();
const wrongTwo = engine.checkAnswer('still-wrong');
assert.equal(wrongTwo.protectedByShield, false, 'Second incorrect answer should not have a shield');
assert.equal(engine.session.hearts, 2, 'Incorrect answer without shield should remove one heart');

assert.equal(engine.buyItem('hint'), true, 'Affordable item should be purchasable');
assert.ok(engine.state.inventory.hint >= 3, 'Purchased hint should enter inventory');
assert.ok(engine.similarity('forst', 'forest') > .6, 'Similarity should recognise close spelling');

const parent = engine.getParentSummary();
assert.ok(parent.wordsSeen >= 2, 'Parent summary should include practised words');
assert.ok(parent.accuracy >= 0 && parent.accuracy <= 100, 'Accuracy should be a valid percentage');
assert.ok(engine.getForestRestoration() > 0, 'Completing a mission should restore the forest');

console.log('Wordbound engine smoke test passed');
