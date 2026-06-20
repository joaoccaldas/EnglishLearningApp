import { WordboundEngine, MISSIONS, SHOP } from './engine.js';

const root = document.querySelector('#app');
const engine = new WordboundEngine();
let currentView = 'home';
let currentChallenge = null;
let latestSummary = null;
let answerLocked = false;
let toastTimer = 0;
let audioContext = null;

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function tone(kind = 'soft') {
  if (!engine.state.settings.sound) return;
  try {
    audioContext ||= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const presets = {
      soft: [330, .035, .12],
      correct: [620, .06, .18],
      wrong: [150, .045, .16],
      reward: [740, .055, .28]
    };
    const [frequency, volume, duration] = presets[kind] || presets.soft;
    oscillator.type = kind === 'wrong' ? 'sawtooth' : 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch { /* Audio is optional. */ }
}

function speak(text) {
  if (!engine.state.settings.speech || !('speechSynthesis' in window)) {
    showToast('Pronunciation is unavailable in this browser.');
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text));
  utterance.lang = 'en-GB';
  utterance.rate = .82;
  speechSynthesis.speak(utterance);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function shell(content, options = {}) {
  const level = engine.getLevel();
  const profile = engine.state.profile;
  return `
    <div class="wordbound-app">
      <header class="topbar">
        <button class="brand text-btn" data-action="home" aria-label="Return to Whispering Woods">
          <img src="assets/wordbound-mark.svg" alt="">
          <span class="brand-copy"><strong>Wordbound</strong><small>Whispering Woods</small></span>
        </button>
        <div class="top-actions">
          <span class="coin-chip" aria-label="${engine.state.coins} coins"><i class="coin-dot"></i><span>${engine.state.coins}</span></span>
          <button class="icon-btn" data-action="parent" aria-label="Open learning progress">↗</button>
          <button class="icon-btn" data-action="profile" aria-label="Open explorer settings">${escapeHtml(profile.crest)}</button>
        </div>
      </header>
      ${content}
      ${options.modal || ''}
    </div>
  `;
}

function currentMission() {
  return MISSIONS.find(mission => engine.isMissionUnlocked(mission) && !engine.state.completedMissions[mission.id])
    || MISSIONS[MISSIONS.length - 1];
}

function renderHome() {
  currentView = 'home';
  answerLocked = false;
  const restoration = Math.round(engine.getForestRestoration() * 100);
  const level = engine.getLevel();
  const parent = engine.getParentSummary();
  const nextMission = currentMission();
  const missionNodes = MISSIONS.map(mission => {
    const unlocked = engine.isMissionUnlocked(mission);
    const completion = engine.state.completedMissions[mission.id];
    const current = mission.id === nextMission.id;
    const stars = completion ? '★'.repeat(completion.stars) + '☆'.repeat(3 - completion.stars) : '☆☆☆';
    return `
      <button class="mission-node ${completion ? 'completed' : ''} ${current ? 'current' : ''}"
        style="--mission-accent:${mission.accent}"
        data-mission="${mission.id}"
        ${unlocked ? '' : 'disabled'}
        aria-label="${escapeHtml(mission.title)}. ${unlocked ? mission.short : `Locked until ${mission.unlock} missions are complete`}">
        <span class="mission-orb">${mission.boss ? '✹' : mission.number}</span>
        <span class="mission-copy"><strong>${escapeHtml(mission.title)}</strong><span>${escapeHtml(mission.short)}</span></span>
        <span class="mission-meta"><span class="mission-stars">${stars}</span><span class="mission-state">${completion ? 'Restored' : unlocked ? current ? 'Next' : 'Open' : 'Locked'}</span></span>
      </button>`;
  }).join('');

  root.innerHTML = shell(`
    <main class="screen home-screen" id="main">
      <div class="home-layout">
        <section class="world-hero">
          <img class="world-art" src="assets/whispering-woods.svg" alt="Moonlit Whispering Woods with a path of five glowing mission clearings" style="filter:saturate(${.55 + restoration / 150}) brightness(${.74 + restoration / 380})">
          <div class="forest-glow" style="opacity:${.22 + restoration / 180}"></div>
          <div class="hero-content">
            <p class="eyebrow">Chapter one</p>
            <div class="hero-title-row">
              <h1>Whispering Woods</h1>
              <span class="level-badge"><b>${level.number}</b><small>${escapeHtml(level.name)}</small></span>
            </div>
            <p class="hero-lede">The forest has lost its language. Restore its paths by translating, rebuilding and understanding English words.</p>
            <div class="restore-panel">
              <strong>Forest restored</strong><output>${restoration}%</output>
              <div class="restore-track"><div class="restore-fill" style="width:${restoration}%"></div></div>
            </div>
            <div class="hero-actions">
              <button class="primary-btn" data-mission="${nextMission.id}">${engine.getCompletedCount() ? 'Continue adventure' : 'Begin chapter'}</button>
              <button class="secondary-btn" data-action="speak-intro">Hear the story</button>
            </div>
          </div>
        </section>

        <aside class="home-side">
          <div class="section-heading">
            <div><p class="eyebrow">Adventure map</p><h2>Five forest missions</h2><p>Each clearing restores part of the world.</p></div>
            <span class="streak-chip">${engine.state.streak} day streak</span>
          </div>
          <nav class="mission-map" aria-label="Whispering Woods missions">${missionNodes}</nav>
          <div class="section-heading"><div><p class="eyebrow">Your learning</p><h2>Explorer progress</h2></div></div>
          <div class="quick-grid">
            <div class="quick-stat"><b>${parent.wordsSeen}</b><span>Words found</span></div>
            <div class="quick-stat"><b>${parent.mastered}</b><span>Mastered</span></div>
            <div class="quick-stat"><b>${engine.state.xp}</b><span>Experience</span></div>
          </div>
          <div class="hero-actions">
            <button class="secondary-btn" data-action="shop">Open satchel</button>
            <button class="secondary-btn" data-action="parent">Learning report</button>
          </div>
        </aside>
      </div>
    </main>
  `);
  bindGlobalActions();
}

function missionModal(missionId) {
  const mission = engine.getMission(missionId);
  const completion = engine.state.completedMissions[mission.id];
  return `
    <div class="modal" data-modal="mission" role="dialog" aria-modal="true" aria-labelledby="missionTitle">
      <section class="modal-card">
        <header class="modal-head">
          <div><p class="eyebrow">Mission ${mission.number}${mission.boss ? ' · Boss encounter' : ''}</p><h2 id="missionTitle">${escapeHtml(mission.title)}</h2></div>
          <button class="modal-close" data-action="close-modal" aria-label="Close">×</button>
        </header>
        <div class="mission-detail">
          <p>${escapeHtml(mission.story)}</p>
          <div class="reward-row"><span>+${mission.reward.xp} XP</span><span>+${mission.reward.coins} coins</span><span>${mission.length} challenges</span></div>
          ${completion ? `<p class="muted">Best result: ${completion.stars}/3 stars · ${completion.bestAccuracy}% accuracy</p>` : ''}
          <button class="primary-btn" data-action="start-mission" data-mission="${mission.id}">${completion ? 'Play again' : mission.boss ? 'Face the Glitch Thorn' : 'Enter mission'}</button>
        </div>
      </section>
    </div>`;
}

function openMission(missionId) {
  if (!engine.isMissionUnlocked(engine.getMission(missionId))) return;
  const app = document.querySelector('.wordbound-app');
  app.insertAdjacentHTML('beforeend', missionModal(missionId));
  bindModalActions();
  document.querySelector('.modal-close')?.focus();
}

function startMission(missionId) {
  document.querySelector('.modal')?.remove();
  try {
    currentChallenge = engine.startMission(missionId);
    tone('soft');
    renderGame();
  } catch (error) {
    showToast(error.message || 'This mission is still locked.');
  }
}

function renderGame(feedback = null) {
  currentView = 'game';
  const session = engine.session;
  if (!session || !currentChallenge) return renderHome();
  const progress = session.index / session.words.length * 100;
  const bossHealth = Math.max(0, 100 - session.index / session.words.length * 100);
  const hearts = '♥'.repeat(session.hearts) + '♡'.repeat(Math.max(0, 3 - session.hearts));
  const choiceMarkup = currentChallenge.type === 'definition'
    ? `<div class="choice-grid">${currentChallenge.choices.map(choice => `<button class="choice-btn" data-answer="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join('')}</div>`
    : `<form class="text-answer" id="answerForm"><input id="answerInput" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="30" aria-label="Your English answer" placeholder="Type your answer"><button class="primary-btn" type="submit">Cast</button></form>`;

  root.innerHTML = shell(`
    <main class="screen game-screen" id="main">
      <header class="game-head">
        <button class="back-btn" data-action="leave-game" aria-label="Leave mission">←</button>
        <div class="mission-progress" aria-label="Mission progress"><i style="width:${progress}%"></i></div>
        <span class="hearts" aria-label="${session.hearts} hearts remaining">${hearts}</span>
      </header>
      ${session.mission.boss ? `<div class="boss-panel"><div class="boss-top"><span>Glitch Thorn shield</span><span>${Math.ceil(bossHealth)}%</span></div><div class="boss-track"><i style="width:${bossHealth}%"></i></div></div>` : ''}
      <section class="challenge-stage ${feedback?.correct === true ? 'flash-correct' : feedback?.correct === false ? 'flash-wrong' : ''}" aria-labelledby="challengePrompt">
        <div class="challenge-content">
          <span class="challenge-label">${escapeHtml(currentChallenge.eyebrow)} · ${session.index + 1}/${session.words.length}</span>
          <p class="challenge-instruction">${escapeHtml(currentChallenge.instruction)}</p>
          <h1 class="challenge-prompt ${currentChallenge.type === 'definition' ? 'definition' : ''}" id="challengePrompt">${escapeHtml(currentChallenge.prompt)}</h1>
          <button class="pronounce-btn" data-action="pronounce">Listen to the English word</button>
          <div class="answer-area">${choiceMarkup}</div>
          <div class="utility-row">
            <button class="item-btn" data-item="hint">✦ Hint · ${engine.state.inventory.hint}</button>
            ${currentChallenge.type === 'definition' ? `<button class="item-btn" data-item="focus">◈ Focus · ${engine.state.inventory.focus}</button>` : ''}
          </div>
          <div class="feedback ${feedback ? feedback.correct ? 'correct' : 'wrong' : ''}" role="status">${feedback ? escapeHtml(feedback.message) : ''}</div>
        </div>
      </section>
    </main>
  `);
  bindGlobalActions();
  bindGameActions();
  document.querySelector('#answerInput')?.focus();
}

function bindGameActions() {
  document.querySelector('#answerForm')?.addEventListener('submit', event => {
    event.preventDefault();
    submitAnswer(document.querySelector('#answerInput')?.value || '');
  });
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => submitAnswer(button.dataset.answer));
  });
  document.querySelectorAll('[data-item]').forEach(button => {
    button.addEventListener('click', () => useItem(button.dataset.item));
  });
}

function submitAnswer(answer) {
  if (answerLocked || !engine.session) return;
  if (!String(answer).trim()) {
    showToast('Write or choose an answer first.');
    return;
  }
  answerLocked = true;
  const result = engine.checkAnswer(answer);
  if (result.correct) {
    tone('correct');
    const message = `${result.word.word} restored · +${result.points} points`;
    renderGame({ correct: true, message });
    setTimeout(advanceChallenge, 950);
  } else {
    tone('wrong');
    const close = result.similarity >= .6;
    const shield = result.protectedByShield ? ' Your Guardian Leaf protected a heart.' : '';
    const message = `${close ? 'Very close.' : 'The rune cracked.'} The word was “${result.expected}”.${shield}`;
    renderGame({ correct: false, message });
    setTimeout(advanceChallenge, 1450);
  }
}

function advanceChallenge() {
  const outcome = engine.advance();
  answerLocked = false;
  if (outcome.done) {
    latestSummary = outcome.summary;
    tone(outcome.summary.completed ? 'reward' : 'wrong');
    renderResults();
    return;
  }
  currentChallenge = outcome.challenge;
  renderGame();
}

function useItem(itemId) {
  if (!engine.session) return;
  if (!engine.useItem(itemId)) {
    showToast(`No ${itemId} runes left. Visit the satchel.`);
    return;
  }
  if (itemId === 'hint') {
    const feedback = document.querySelector('.feedback');
    feedback.className = 'feedback correct';
    feedback.textContent = `Hint: ${currentChallenge.word.hint}`;
    showToast('A firefly revealed a clue.');
  }
  if (itemId === 'focus' && currentChallenge.type === 'definition') {
    const wrongButtons = [...document.querySelectorAll('[data-answer]')].filter(button => button.dataset.answer !== currentChallenge.answer);
    wrongButtons.slice(0, 2).forEach(button => { button.disabled = true; button.style.opacity = '.28'; });
    showToast('Two false runes faded away.');
  }
  document.querySelector(`[data-item="${itemId}"]`).textContent = `${itemId === 'hint' ? '✦ Hint' : '◈ Focus'} · ${engine.state.inventory[itemId]}`;
}

function renderResults() {
  currentView = 'results';
  const summary = latestSummary;
  if (!summary) return renderHome();
  const stars = summary.stars ? '★'.repeat(summary.stars) + '☆'.repeat(3 - summary.stars) : '☆☆☆';
  root.innerHTML = shell(`
    <main class="screen results-screen" id="main">
      <section class="results-card">
        <div class="results-icon">${summary.completed ? summary.mission.boss ? '✹' : '✓' : '↻'}</div>
        <p class="eyebrow">${summary.completed ? 'Mission restored' : 'The path remains tangled'}</p>
        <h1>${escapeHtml(summary.mission.title)}</h1>
        <p>${summary.completed ? 'The forest remembers these words again.' : 'Your progress is saved. Return when you are ready.'}</p>
        <div class="star-row" aria-label="${summary.stars} of 3 stars">${stars}</div>
        <div class="result-grid">
          <div><b>${summary.accuracy}%</b><span>Accuracy</span></div>
          <div><b>+${summary.xpEarned}</b><span>Experience</span></div>
          <div><b>${summary.bestStreak}</b><span>Best streak</span></div>
        </div>
        <div class="result-actions">
          <button class="primary-btn" data-action="home">Return to forest</button>
          <button class="secondary-btn" data-action="replay" data-mission="${summary.mission.id}">Play again</button>
          <button class="secondary-btn" data-action="parent">View learning</button>
        </div>
      </section>
    </main>
  `);
  bindGlobalActions();
}

function renderParent() {
  currentView = 'parent';
  const summary = engine.getParentSummary();
  const weakRows = summary.weakest.length
    ? summary.weakest.map(item => `
      <div class="word-row"><div><strong>${escapeHtml(item.word.word)}</strong><span> · ${escapeHtml(item.word.swedish)}</span></div><div class="mastery-dots" aria-label="Mastery ${item.strength} of 5">${Array.from({ length: 5 }, (_, index) => `<i class="${index < item.strength ? 'on' : ''}"></i>`).join('')}</div></div>`).join('')
    : '<p class="muted">Practice a mission to reveal words that need more review.</p>';
  const sessionRows = summary.recentSessions.length
    ? summary.recentSessions.map(session => `<div class="session-row"><div><strong>${escapeHtml(session.mission.title)}</strong><span> · ${new Date(session.at).toLocaleDateString()}</span></div><span>${session.accuracy}%</span></div>`).join('')
    : '<p class="muted">No completed sessions yet.</p>';

  root.innerHTML = shell(`
    <main class="screen parent-screen" id="main">
      <header class="parent-head"><div><p class="eyebrow">Parent view</p><h1>Learning report</h1><p class="muted">Progress stays only in this browser.</p></div><button class="secondary-btn" data-action="home">Back to game</button></header>
      <div class="parent-grid">
        <section class="parent-card">
          <h2>Overview</h2>
          <div class="parent-stats">
            <div class="parent-stat"><b>${summary.wordsSeen}</b><span>Words practised</span></div>
            <div class="parent-stat"><b>${summary.mastered}</b><span>Words mastered</span></div>
            <div class="parent-stat"><b>${summary.accuracy}%</b><span>Overall accuracy</span></div>
            <div class="parent-stat"><b>${summary.due}</b><span>Due for review</span></div>
          </div>
        </section>
        <section class="parent-card"><h2>Needs reinforcement</h2>${weakRows}</section>
        <section class="parent-card wide"><h2>Recent missions</h2>${sessionRows}</section>
      </div>
    </main>
  `);
  bindGlobalActions();
}

function profileModal() {
  const profile = engine.state.profile;
  const crests = ['W', 'L', 'N', '★', '◆'];
  return `
    <div class="modal" data-modal="profile" role="dialog" aria-modal="true" aria-labelledby="profileTitle">
      <section class="modal-card">
        <header class="modal-head"><div><p class="eyebrow">Explorer settings</p><h2 id="profileTitle">Your ranger</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></header>
        <form class="profile-form" id="profileForm">
          <label>Explorer name<input name="name" maxlength="20" value="${escapeHtml(profile.name)}"></label>
          <label>Crest<div class="crest-row">${crests.map(crest => `<button type="button" class="crest-btn ${crest === profile.crest ? 'active' : ''}" data-crest="${crest}">${crest}</button>`).join('')}</div></label>
          <label><span>Sound and pronunciation</span><button class="secondary-btn" type="button" data-setting="sound">Sound ${engine.state.settings.sound ? 'on' : 'off'}</button><button class="secondary-btn" type="button" data-setting="speech">Speech ${engine.state.settings.speech ? 'on' : 'off'}</button></label>
          <button class="primary-btn" type="submit">Save explorer</button>
        </form>
      </section>
    </div>`;
}

function shopModal() {
  return `
    <div class="modal" data-modal="shop" role="dialog" aria-modal="true" aria-labelledby="shopTitle">
      <section class="modal-card">
        <header class="modal-head"><div><p class="eyebrow">Ranger satchel</p><h2 id="shopTitle">Helpful runes</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></header>
        <p class="muted">Coins are earned through missions. Items remain in this browser.</p>
        <div class="shop-grid">${SHOP.map(item => `<article class="shop-item"><span class="shop-icon">${item.icon}</span><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.description)}</p></div><button data-buy="${item.id}" ${engine.state.coins < item.price ? 'disabled' : ''}>${item.price}</button></article>`).join('')}</div>
      </section>
    </div>`;
}

function openModal(type) {
  const app = document.querySelector('.wordbound-app');
  app.insertAdjacentHTML('beforeend', type === 'shop' ? shopModal() : profileModal());
  bindModalActions();
}

function bindModalActions() {
  document.querySelectorAll('[data-action="close-modal"]').forEach(button => button.addEventListener('click', () => document.querySelector('.modal')?.remove()));
  document.querySelector('.modal')?.addEventListener('click', event => { if (event.target.classList.contains('modal')) event.currentTarget.remove(); });
  document.querySelectorAll('[data-action="start-mission"]').forEach(button => button.addEventListener('click', () => startMission(button.dataset.mission)));
  document.querySelectorAll('[data-crest]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-crest]').forEach(item => item.classList.toggle('active', item === button));
  }));
  document.querySelectorAll('[data-setting]').forEach(button => button.addEventListener('click', () => {
    engine.toggleSetting(button.dataset.setting);
    button.textContent = `${button.dataset.setting === 'sound' ? 'Sound' : 'Speech'} ${engine.state.settings[button.dataset.setting] ? 'on' : 'off'}`;
    tone('soft');
  }));
  document.querySelector('#profileForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const crest = document.querySelector('[data-crest].active')?.dataset.crest || 'W';
    engine.setProfile(form.get('name'), crest);
    document.querySelector('.modal')?.remove();
    showToast('Explorer saved.');
    if (currentView === 'home') renderHome();
  });
  document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
    if (engine.buyItem(button.dataset.buy)) {
      tone('reward');
      showToast('Rune added to your satchel.');
      document.querySelector('.modal')?.remove();
      openModal('shop');
    } else showToast('Not enough coins yet.');
  }));
}

function bindGlobalActions() {
  document.querySelectorAll('[data-mission]').forEach(button => {
    if (button.dataset.action === 'start-mission' || button.dataset.action === 'replay') return;
    button.addEventListener('click', () => openMission(button.dataset.mission));
  });
  document.querySelectorAll('[data-action]').forEach(button => {
    const action = button.dataset.action;
    if (['start-mission', 'close-modal'].includes(action)) return;
    button.addEventListener('click', () => {
      if (action === 'home') renderHome();
      if (action === 'parent') renderParent();
      if (action === 'profile') openModal('profile');
      if (action === 'shop') openModal('shop');
      if (action === 'replay') startMission(button.dataset.mission);
      if (action === 'pronounce' && currentChallenge) speak(currentChallenge.answer);
      if (action === 'speak-intro') speak('The Whispering Woods have lost their language. Restore the forest by finding, spelling, and understanding English words.');
      if (action === 'leave-game') {
        if (confirm('Leave this mission? Your current run will not be saved.')) {
          engine.session = null;
          renderHome();
        }
      }
    });
  });
}

addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelector('.modal')?.remove();
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}

renderHome();
