import { WordboundEngine, WORDS } from './engine.js';
import { isValidBackup, makeBackup, reviewReward, selectReviewWords, todayStamp } from './review.js';

const STORAGE_KEY = 'wordbound-state-v1';
const root = document.querySelector('#app');
let reviewSession = null;
let reviewLocked = false;

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function freshEngine() {
  return new WordboundEngine();
}

function showOnboarding() {
  const engine = freshEngine();
  if (engine.state.onboardingComplete || document.querySelector('.onboarding')) return;

  const overlay = document.createElement('div');
  overlay.className = 'onboarding';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'welcomeTitle');
  overlay.innerHTML = `
    <section class="onboarding-card">
      <div class="onboarding-crest">W</div>
      <p class="eyebrow">Welcome, ranger</p>
      <h1 id="welcomeTitle">Restore words. Restore the world.</h1>
      <p>Wordbound turns English practice into short forest missions. Progress is saved only on this device.</p>
      <div class="onboarding-steps">
        <div class="onboarding-step"><b>1</b><div><strong>Choose a mission</strong><span>Each clearing teaches a different language skill.</span></div></div>
        <div class="onboarding-step"><b>2</b><div><strong>Build word strength</strong><span>Missed words return later through adaptive review.</span></div></div>
        <div class="onboarding-step"><b>3</b><div><strong>Return each day</strong><span>A five-word review keeps the forest glowing.</span></div></div>
      </div>
      <form class="onboarding-form" id="onboardingForm">
        <label>Explorer name<input name="name" maxlength="20" autocomplete="nickname" value="${escapeHtml(engine.state.profile.name === 'Explorer' ? '' : engine.state.profile.name)}" placeholder="Your name"></label>
        <label>Crest<div class="crest-row">
          ${['W', 'L', 'N', '★', '◆'].map(crest => `<button type="button" class="crest-btn ${crest === 'W' ? 'active' : ''}" data-onboarding-crest="${crest}">${crest}</button>`).join('')}
        </div></label>
        <button class="primary-btn" type="submit">Enter Whispering Woods</button>
      </form>
    </section>`;
  document.body.append(overlay);

  overlay.querySelectorAll('[data-onboarding-crest]').forEach(button => {
    button.addEventListener('click', () => {
      overlay.querySelectorAll('[data-onboarding-crest]').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  overlay.querySelector('#onboardingForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const crest = overlay.querySelector('[data-onboarding-crest].active')?.dataset.onboardingCrest || 'W';
    engine.setProfile(data.get('name') || 'Explorer', crest);
    engine.state.onboardingComplete = true;
    engine.state.onboardedAt = new Date().toISOString();
    engine.save();
    location.reload();
  });

  overlay.querySelector('input')?.focus();
}

function decorateHome() {
  const homeSide = document.querySelector('.home-side');
  if (!homeSide || homeSide.querySelector('.daily-review-card')) return;

  const engine = freshEngine();
  const selected = selectReviewWords(engine, WORDS, 5);
  const dueCount = engine.getDueWords().length;
  const completedToday = engine.state.dailyReview?.date === todayStamp();
  const card = document.createElement('section');
  card.className = 'daily-review-card';
  card.innerHTML = `
    <div class="daily-review-top">
      <div>
        <p class="eyebrow">Daily ritual</p>
        <h3>${completedToday ? 'Review complete' : dueCount ? 'Words are calling' : 'Strengthen today’s words'}</h3>
        <p>${completedToday ? 'The forest is glowing. Another practice round is optional.' : dueCount ? `${dueCount} ${dueCount === 1 ? 'word is' : 'words are'} due for review.` : 'A short adaptive round will choose weak and unseen words.'}</p>
      </div>
      <span class="daily-review-count"><b>${selected.length}</b><small>words</small></span>
    </div>
    ${completedToday ? '<span class="review-complete-badge">✓ Completed today</span>' : ''}
    <div class="daily-review-meta"><span>About 3 minutes</span><span>Adaptive practice</span></div>
    <div class="daily-review-actions">
      <button class="${completedToday ? 'secondary-btn' : 'primary-btn'}" data-start-review>${completedToday ? 'Practice again' : 'Start daily review'}</button>
    </div>`;
  homeSide.prepend(card);
  card.querySelector('[data-start-review]').addEventListener('click', startDailyReview);
}

function startDailyReview() {
  const engine = freshEngine();
  const words = selectReviewWords(engine, WORDS, 5);
  reviewSession = {
    engine,
    words,
    index: 0,
    correct: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    challengeStartedAt: Date.now(),
    challenge: null
  };
  reviewSession.challenge = makeReviewChallenge();
  renderReview();
}

function makeReviewChallenge() {
  const word = reviewSession.words[reviewSession.index];
  const types = ['translation', 'definition', 'spellforge'];
  const type = types[reviewSession.index % types.length];
  reviewSession.challengeStartedAt = Date.now();
  return reviewSession.engine.createChallenge(word, type);
}

function reviewChoiceMarkup(challenge) {
  if (challenge.type === 'definition') {
    return `<div class="choice-grid">${challenge.choices.map(choice => `<button class="choice-btn" data-review-answer="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join('')}</div>`;
  }
  return `<form class="text-answer" id="reviewAnswerForm"><input id="reviewAnswerInput" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="30" aria-label="Your answer" placeholder="Type your answer"><button class="primary-btn" type="submit">Answer</button></form>`;
}

function renderReview(feedback = null) {
  const session = reviewSession;
  if (!session) return location.reload();
  const challenge = session.challenge;
  const progress = session.index / session.words.length * 100;
  root.innerHTML = `
    <div class="review-shell">
      <header class="topbar">
        <span class="brand"><img src="assets/wordbound-mark.svg" alt=""><span class="brand-copy"><strong>Daily review</strong><small>Whispering Woods</small></span></span>
        <span class="coin-chip"><i class="coin-dot"></i><span>${session.score}</span></span>
      </header>
      <main class="review-main" id="main">
        <header class="review-header">
          <button class="back-btn" data-exit-review aria-label="Leave daily review">←</button>
          <div class="review-progress" aria-label="Review progress"><i style="width:${progress}%"></i></div>
          <span class="review-score">${session.index + 1}/${session.words.length}</span>
        </header>
        <section class="review-card">
          <span class="review-label">${escapeHtml(challenge.eyebrow)}</span>
          <p class="review-instruction">${escapeHtml(challenge.instruction)}</p>
          <h1 class="review-prompt ${challenge.type === 'definition' ? 'definition' : ''}">${escapeHtml(challenge.prompt)}</h1>
          <button class="pronounce-btn" data-review-pronounce>Hear the word</button>
          <div class="review-answer">${reviewChoiceMarkup(challenge)}</div>
          <div class="review-feedback ${feedback ? feedback.correct ? 'correct' : 'wrong' : ''}" role="status">${feedback ? escapeHtml(feedback.message) : ''}</div>
        </section>
      </main>
    </div>`;

  root.querySelector('[data-exit-review]').addEventListener('click', () => {
    if (confirm('Leave this review? Completed answers are already saved.')) location.reload();
  });
  root.querySelector('[data-review-pronounce]').addEventListener('click', () => speakWord(challenge.answer));
  root.querySelector('#reviewAnswerForm')?.addEventListener('submit', event => {
    event.preventDefault();
    submitReviewAnswer(root.querySelector('#reviewAnswerInput')?.value || '');
  });
  root.querySelectorAll('[data-review-answer]').forEach(button => {
    button.addEventListener('click', () => submitReviewAnswer(button.dataset.reviewAnswer));
  });
  root.querySelector('#reviewAnswerInput')?.focus();
}

function speakWord(word) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-GB';
  utterance.rate = .82;
  speechSynthesis.speak(utterance);
}

function submitReviewAnswer(answer) {
  if (reviewLocked || !String(answer).trim()) return;
  reviewLocked = true;
  const session = reviewSession;
  const challenge = session.challenge;
  const expected = challenge.answer.trim().toLocaleLowerCase('en');
  const received = String(answer).trim().toLocaleLowerCase('en');
  const correct = received === expected;
  const elapsed = Date.now() - session.challengeStartedAt;
  session.engine.recordWord(challenge.word, correct, elapsed);
  if (correct) {
    session.correct += 1;
    session.score += 10;
  }
  session.answers.push({ wordId: challenge.word.id, correct, elapsed });
  const message = correct ? `${challenge.word.word} strengthened.` : `The word was “${challenge.answer}”. It will return sooner.`;
  renderReview({ correct, message });
  setTimeout(advanceReview, correct ? 850 : 1250);
}

function advanceReview() {
  reviewLocked = false;
  reviewSession.index += 1;
  if (reviewSession.index >= reviewSession.words.length) return finishReview();
  reviewSession.challenge = makeReviewChallenge();
  renderReview();
}

function finishReview() {
  const session = reviewSession;
  const completedToday = session.engine.state.dailyReview?.date === todayStamp();
  const reward = reviewReward({ correct: session.correct, total: session.words.length, completedToday });
  session.engine.state.xp += reward.xp;
  session.engine.state.coins += reward.coins;
  session.engine.state.dailyReview = {
    date: todayStamp(),
    completions: Number(session.engine.state.dailyReview?.completions || 0) + 1,
    accuracy: reward.accuracy,
    completedAt: new Date().toISOString()
  };
  session.engine.state.sessions.unshift({
    mission: { id: 'daily-review', title: 'Daily review' },
    completed: true,
    stars: reward.accuracy >= 90 ? 3 : reward.accuracy >= 70 ? 2 : 1,
    accuracy: reward.accuracy,
    score: session.score,
    xpEarned: reward.xp,
    coinsEarned: reward.coins,
    bestStreak: 0,
    reviewed: session.words.length,
    at: new Date().toISOString()
  });
  session.engine.state.sessions = session.engine.state.sessions.slice(0, 40);
  session.engine.save();

  root.innerHTML = `
    <div class="review-shell">
      <header class="topbar"><span class="brand"><img src="assets/wordbound-mark.svg" alt=""><span class="brand-copy"><strong>Daily review</strong><small>Complete</small></span></span></header>
      <main class="review-main review-result" id="main">
        <section class="review-result-card">
          <div class="results-icon">✦</div>
          <p class="eyebrow">Words strengthened</p>
          <h1>The forest remembers</h1>
          <p class="muted">Today’s adaptive review is complete. Missed words have been scheduled to return sooner.</p>
          <div class="review-result-grid">
            <div><b>${reward.accuracy}%</b><span>Accuracy</span></div>
            <div><b>+${reward.xp}</b><span>Experience</span></div>
            <div><b>+${reward.coins}</b><span>Coins</span></div>
          </div>
          <button class="primary-btn" data-return-forest>Return to forest</button>
        </section>
      </main>
    </div>`;
  root.querySelector('[data-return-forest]').addEventListener('click', () => location.reload());
}

function decorateProfileModal() {
  const form = document.querySelector('#profileForm');
  if (!form || form.querySelector('.save-tools')) return;
  const tools = document.createElement('section');
  tools.className = 'save-tools';
  tools.innerHTML = `
    <strong>Progress backup</strong>
    <p>Download a private copy of this browser’s progress or restore a previous Wordbound save.</p>
    <div class="save-tool-actions">
      <button type="button" class="secondary-btn" data-export-save>Download backup</button>
      <button type="button" class="secondary-btn" data-import-save>Restore backup</button>
      <input type="file" accept="application/json,.json" data-import-file hidden>
    </div>`;
  form.querySelector('button[type="submit"]')?.insertAdjacentElement('beforebegin', tools);

  tools.querySelector('[data-export-save]').addEventListener('click', exportSave);
  tools.querySelector('[data-import-save]').addEventListener('click', () => tools.querySelector('[data-import-file]').click());
  tools.querySelector('[data-import-file]').addEventListener('change', importSave);
}

function exportSave() {
  const engine = freshEngine();
  const payload = JSON.stringify(makeBackup(engine.state), null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wordbound-backup-${todayStamp()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function importSave(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!isValidBackup(parsed)) throw new Error('Invalid backup');
    if (!confirm('Replace the progress on this device with this backup?')) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    location.reload();
  } catch {
    alert('This file is not a valid Wordbound backup.');
  } finally {
    event.target.value = '';
  }
}

function scanInterface() {
  if (document.querySelector('.home-side')) decorateHome();
  if (document.querySelector('#profileForm')) decorateProfileModal();
}

const observer = new MutationObserver(scanInterface);
observer.observe(root, { childList: true, subtree: true });
scanInterface();
setTimeout(showOnboarding, 120);
