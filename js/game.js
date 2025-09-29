  // Game state variables
let currentGame = {
    mode: null,
    difficulty: 'easy',
    currentWord: null,
    currentWordIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    level: 1,
    wordsCompleted: 0,
    wordsTotal: 10,
    correctAnswers: 0,
    totalAttempts: 0,
    usedWords: [],
    hintsUsed: 0,
    skipsUsed: 0,
    currentWorld: 'basic'
};

// Player progression system
let playerProgress = {
    totalPoints: 0,
    totalLevel: 1,
    coins: 0,
    unlockedWorlds: ['basic'],
    worldLevels: {
        basic: 1,
        forest: 1,
        halloween: 1,
        space: 1,
        ocean: 1,
        winter: 1
    },
    achievements: [],
    inventory: {
        hintSticks: 0,
        timeFreezes: 0,
        doublePoints: 0,
        perfectStreaks: 0
    }
};

// Shop system with items
const shopItems = {
    hintStick: {
        name: "Hint Stick",
        description: "Get a detailed hint for the current word (5 uses)",
        price: 50,
        emoji: "💡",
        uses: 5,
        category: "helpers"
    },
    timeFreeze: {
        name: "Time Freeze",
        description: "Stop the timer in Quick Fire mode (3 uses)",
        price: 75,
        emoji: "⏸️",
        uses: 3,
        category: "helpers"
    },
    doublePoints: {
        name: "Double Points",
        description: "Earn 2x points for the next 5 words",
        price: 100,
        emoji: "✨",
        uses: 5,
        category: "boosters"
    },
    perfectStreak: {
        name: "Perfect Streak",
        description: "Auto-correct next wrong answer (1 use)",
        price: 150,
        emoji: "🛡️",
        uses: 1,
        category: "boosters"
    }
};

// World unlock requirements and themes
const worldSystem = {
    basic: {
        name: "Basic World",
        unlockLevel: 1,
        theme: "default",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        emoji: "📚"
    },
    forest: {
        name: "Enchanted Forest",
        unlockLevel: 10,
        theme: "forest",
        background: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        emoji: "🌲"
    },
    halloween: {
        name: "Spooky Halloween",
        unlockLevel: 25,
        theme: "halloween",
        background: "linear-gradient(135deg, #2c1810 0%, #ff6b35 100%)",
        emoji: "🎃"
    },
    space: {
        name: "Cosmic Adventure",
        unlockLevel: 50,
        theme: "space",
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
        emoji: "🚀"
    },
    ocean: {
        name: "Ocean Depths",
        unlockLevel: 75,
        theme: "ocean",
        background: "linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)",
        emoji: "🌊"
    },
    winter: {
        name: "Winter Wonderland",
        unlockLevel: 100,
        theme: "winter",
        background: "linear-gradient(135deg, #e6f3ff 0%, #b3d9ff 100%)",
        emoji: "❄️"
    }
};

// DOM elements
const elements = {
    modeSelection: document.getElementById('mode-selection'),
    gameArea: document.getElementById('game-area'),
    resultsScreen: document.getElementById('results-screen'),
    shopScreen: document.getElementById('shop-screen'),
    currentWord: document.getElementById('current-word'),
    wordHint: document.getElementById('word-hint'),
    wordDefinition: document.getElementById('word-definition'),
    userInput: document.getElementById('user-input'),
    feedback: document.getElementById('feedback'),
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    level: document.getElementById('level'),
    wordsCompleted: document.getElementById('words-completed'),
    wordsTotal: document.getElementById('words-total'),
    progressFill: document.getElementById('progress-fill'),
    finalScore: document.getElementById('final-score'),
    finalAccuracy: document.getElementById('final-accuracy'),
    finalStreak: document.getElementById('final-streak'),
    tipsList: document.getElementById('tips-list'),
    totalLevel: document.getElementById('total-level'),
    totalPoints: document.getElementById('total-points'),
    coins: document.getElementById('coins'),
    levelProgress: document.getElementById('level-progress'),
    worldSelector: document.getElementById('world-selector'),
    shopItems: document.getElementById('shop-items'),
    inventoryDisplay: document.getElementById('inventory-display')
};

// Update progress display
function updateProgressDisplay() {
    if (elements.totalLevel) {
        elements.totalLevel.textContent = playerProgress.totalLevel;
    }
    if (elements.totalPoints) {
        elements.totalPoints.textContent = playerProgress.totalPoints;
    }
    if (elements.coins) {
        elements.coins.textContent = playerProgress.coins;
    }
    
    // Update menu coins display
    const menuCoins = document.getElementById('menu-coins');
    if (menuCoins) {
        menuCoins.textContent = playerProgress.coins;
    }
    
    // Update shop coins display
    const shopCoins = document.getElementById('shop-coins');
    if (shopCoins) {
        shopCoins.textContent = playerProgress.coins;
    }
    
    // Update level progress bar
    if (elements.levelProgress) {
        const currentLevelPoints = getPointsForNextLevel(playerProgress.totalLevel - 1);
        const nextLevelPoints = getPointsForNextLevel(playerProgress.totalLevel);
        const pointsInThisLevel = playerProgress.totalPoints - currentLevelPoints;
        const pointsNeededForThisLevel = nextLevelPoints - currentLevelPoints;
        const progressPercent = (pointsInThisLevel / pointsNeededForThisLevel) * 100;
        
        elements.levelProgress.style.width = `${Math.min(100, progressPercent)}%`;
    }
    
    // Update world selector
    updateWorldSelector();
    
    // Update inventory display
    updateInventoryDisplay();
}

// Update world selector display
function updateWorldSelector() {
    if (elements.worldSelector) {
        elements.worldSelector.innerHTML = '';
        
        Object.keys(worldSystem).forEach(worldKey => {
            const world = worldSystem[worldKey];
            const isUnlocked = playerProgress.unlockedWorlds.includes(worldKey);
            const isSelected = currentGame.currentWorld === worldKey;
            
            const worldButton = document.createElement('button');
            worldButton.className = `world-btn ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`;
            worldButton.innerHTML = `
                <div class="world-emoji">${world.emoji}</div>
                <div class="world-name">${world.name}</div>
                <div class="world-level">${isUnlocked ? 'Unlocked' : `Level ${world.unlockLevel}`}</div>
            `;
            
            if (isUnlocked) {
                worldButton.onclick = () => selectWorld(worldKey);
            }
            
            elements.worldSelector.appendChild(worldButton);
        });
    }
}

// Select a world
function selectWorld(worldKey) {
    if (playerProgress.unlockedWorlds.includes(worldKey)) {
        currentGame.currentWorld = worldKey;
        applyWorldTheme(worldKey);
        updateWorldSelector();
    }
}

// Apply world theme to the interface
function applyWorldTheme(worldKey) {
    const world = worldSystem[worldKey];
    document.body.style.background = world.background;
    
    // Update theme-based styling
    document.documentElement.setAttribute('data-theme', world.theme);
}

// Show shop screen
function showShop() {
    elements.modeSelection.classList.add('hidden');
    elements.gameArea.classList.add('hidden');
    elements.resultsScreen.classList.add('hidden');
    elements.shopScreen.classList.remove('hidden');
    
    updateShopDisplay();
}

// Update shop display
function updateShopDisplay() {
    if (elements.shopItems) {
        elements.shopItems.innerHTML = '';
        
        Object.keys(shopItems).forEach(itemKey => {
            const item = shopItems[itemKey];
            const canAfford = playerProgress.coins >= item.price;
            
            const itemElement = document.createElement('div');
            itemElement.className = `shop-item ${canAfford ? 'affordable' : 'expensive'}`;
            itemElement.innerHTML = `
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="item-price">💰 ${item.price} coins</div>
                </div>
                <button class="buy-btn ${canAfford ? '' : 'disabled'}" 
                        onclick="buyItem('${itemKey}')" 
                        ${canAfford ? '' : 'disabled'}>
                    ${canAfford ? 'Buy' : 'Too Expensive'}
                </button>
            `;
            
            elements.shopItems.appendChild(itemElement);
        });
    }
}

// Buy an item
function buyItem(itemKey) {
    const item = shopItems[itemKey];
    
    if (playerProgress.coins >= item.price) {
        playerProgress.coins -= item.price;
        
        // Add to inventory
        if (playerProgress.inventory[itemKey + 's']) {
            playerProgress.inventory[itemKey + 's'] += item.uses;
        } else {
            playerProgress.inventory[itemKey] = (playerProgress.inventory[itemKey] || 0) + item.uses;
        }
        
        // Show purchase confirmation
        showPurchaseConfirmation(item);
        
        // Update displays
        savePlayerProgress();
        updateProgressDisplay();
        updateShopDisplay();
    }
}

// Show purchase confirmation
function showPurchaseConfirmation(item) {
    const confirmation = document.createElement('div');
    confirmation.className = 'purchase-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <h2>🎉 Purchase Successful!</h2>
            <p>${item.emoji} ${item.name} added to inventory!</p>
            <div class="uses-info">Uses: ${item.uses}</div>
        </div>
    `;
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// Update inventory display
function updateInventoryDisplay() {
    if (elements.inventoryDisplay) {
        elements.inventoryDisplay.innerHTML = '';
        
        Object.keys(playerProgress.inventory).forEach(itemKey => {
            const count = playerProgress.inventory[itemKey];
            if (count > 0) {
                const item = shopItems[itemKey.replace('s', '')] || shopItems[itemKey];
                if (item) {
                    const inventoryItem = document.createElement('div');
                    inventoryItem.className = 'inventory-item';
                    inventoryItem.innerHTML = `
                        <span class="item-emoji">${item.emoji}</span>
                        <span class="item-count">${count}</span>
                    `;
                    inventoryItem.title = `${item.name}: ${count} uses left`;
                    elements.inventoryDisplay.appendChild(inventoryItem);
                }
            }
        });
    }
}

// Use hint stick
function useHintStick() {
    if (playerProgress.inventory.hintSticks > 0 && currentGame.currentWord) {
        playerProgress.inventory.hintSticks--;
        
        // Show enhanced hint with more details
        const enhancedHint = `💡 Enhanced Hint: ${currentGame.currentWord.hint}\n📝 Category: ${currentGame.currentWord.category}\n🔤 Length: ${currentGame.currentWord.word.length} letters`;
        
        elements.wordHint.innerHTML = enhancedHint.replace(/\n/g, '<br>');
        showFeedback('🔮 Hint Stick used! Check above for enhanced hints!', 'hint');
        
        savePlayerProgress();
        updateInventoryDisplay();
    } else if (playerProgress.inventory.hintSticks === 0) {
        showFeedback('💡 No Hint Sticks left! Buy more in the shop!', 'incorrect');
    }
}

// Use time freeze
function useTimeFreeze() {
    if (playerProgress.inventory.timeFreezes > 0 && currentGame.mode === 'quickfire' && quickFireTimer) {
        playerProgress.inventory.timeFreezes--;
        
        // Pause timer for 10 seconds
        clearInterval(quickFireTimer);
        showFeedback('⏸️ Time Freeze activated! 10 seconds added!', 'hint');
        
        timeLeft += 10;
        updateTimerDisplay();
        
        // Resume timer
        setTimeout(() => {
            startQuickFireTimer();
        }, 1000);
        
        savePlayerProgress();
        updateInventoryDisplay();
    } else if (playerProgress.inventory.timeFreezes === 0) {
        showFeedback('⏸️ No Time Freezes left! Buy more in the shop!', 'incorrect');
    } else {
        showFeedback('⏸️ Time Freeze only works in Quick Fire mode!', 'incorrect');
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Load player progress from localStorage
    loadPlayerProgress();
    
    // Add enter key support for input
    elements.userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Auto-focus input when game starts
    elements.userInput.addEventListener('focus', function() {
        this.select();
    });

    // Update words total display
    elements.wordsTotal.textContent = currentGame.wordsTotal;
    
    showModeSelection();
});

// Load player progress from localStorage
function loadPlayerProgress() {
    const savedProgress = localStorage.getItem('englishLearningProgress');
    if (savedProgress) {
        playerProgress = { ...playerProgress, ...JSON.parse(savedProgress) };
    }
    updateProgressDisplay();
}

// Save player progress to localStorage
function savePlayerProgress() {
    localStorage.setItem('englishLearningProgress', JSON.stringify(playerProgress));
}

// Calculate level from total points
function calculateLevelFromPoints(points) {
    // Level formula: Every 100 points = 1 level, with increasing requirements
    return Math.floor(Math.sqrt(points / 50)) + 1;
}

// Calculate points needed for next level
function getPointsForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 50;
}

// Add points and check for level ups and world unlocks
function addPoints(points) {
    const oldLevel = playerProgress.totalLevel;
    
    playerProgress.totalPoints += points;
    playerProgress.totalLevel = calculateLevelFromPoints(playerProgress.totalPoints);
    
    // Check for level up
    if (playerProgress.totalLevel > oldLevel) {
        handleLevelUp(oldLevel, playerProgress.totalLevel);
    }
    
    // Check for world unlocks
    checkWorldUnlocks();
    
    // Save progress
    savePlayerProgress();
    updateProgressDisplay();
}

// Handle level up events
function handleLevelUp(oldLevel, newLevel) {
    // Calculate coin reward (more coins for higher levels)
    const coinReward = Math.floor(newLevel * 10 + (newLevel / 5) * 25);
    playerProgress.coins += coinReward;
    
    // Show level up celebration with coin reward
    showLevelUpCelebration(newLevel, coinReward);
    
    // Add achievement
    playerProgress.achievements.push({
        type: 'level_up',
        level: newLevel,
        coinReward: coinReward,
        timestamp: new Date().toISOString()
    });
}

// Check and unlock new worlds
function checkWorldUnlocks() {
    Object.keys(worldSystem).forEach(worldKey => {
        const world = worldSystem[worldKey];
        if (playerProgress.totalLevel >= world.unlockLevel && 
            !playerProgress.unlockedWorlds.includes(worldKey)) {
            
            playerProgress.unlockedWorlds.push(worldKey);
            showWorldUnlock(world);
        }
    });
}

// Show level up celebration
function showLevelUpCelebration(newLevel, coinReward) {
    const celebration = document.createElement('div');
    celebration.className = 'level-up-celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <h2>🎉 LEVEL UP! 🎉</h2>
            <p>You reached Level ${newLevel}!</p>
            <div class="coin-reward">💰 +${coinReward} Coins!</div>
            <div class="celebration-stars">⭐⭐⭐</div>
        </div>
    `;
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// Show world unlock notification
function showWorldUnlock(world) {
    const notification = document.createElement('div');
    notification.className = 'world-unlock-notification';
    notification.innerHTML = `
        <div class="unlock-content">
            <h2>🌟 NEW WORLD UNLOCKED! 🌟</h2>
            <p>${world.emoji} ${world.name}</p>
            <p>Level ${world.unlockLevel} Achievement!</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Start a new game with selected mode and difficulty
function startGame(mode) {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    
    // Reset game state
    currentGame = {
        ...currentGame,
        mode: mode,
        difficulty: selectedDifficulty,
        currentWordIndex: 0,
        score: 0,
        streak: 0,
        level: 1,
        wordsCompleted: 0,
        correctAnswers: 0,
        totalAttempts: 0,
        usedWords: [],
        hintsUsed: 0,
        skipsUsed: 0
    };

    // Show game area
    elements.modeSelection.classList.add('hidden');
    elements.resultsScreen.classList.add('hidden');
    elements.gameArea.classList.remove('hidden');

    // Initialize first word
    nextWord();
    updateDisplay();
    elements.userInput.focus();
}

// Get next word based on difficulty and game mode
function nextWord() {
    let wordPool;
    
    // Use themed words if in a special world, otherwise use basic words
    if (currentGame.currentWorld !== 'basic' && themedWords[currentGame.currentWorld] && themedWords[currentGame.currentWorld][currentGame.difficulty]) {
        // Mix themed words with basic words for variety
        const themedWordPool = themedWords[currentGame.currentWorld][currentGame.difficulty] || [];
        const basicWordPool = wordsDatabase[currentGame.difficulty] || [];
        wordPool = [...themedWordPool, ...basicWordPool];
    } else {
        wordPool = wordsDatabase[currentGame.difficulty];
    }
    
    let availableWords = wordPool.filter(word => !currentGame.usedWords.includes(word.word));
    
    // If all words used, reset the pool but keep tracking
    if (availableWords.length === 0) {
        availableWords = wordPool;
        currentGame.usedWords = [];
    }
    
    // Select random word
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    currentGame.currentWord = availableWords[randomIndex];
    currentGame.usedWords.push(currentGame.currentWord.word);
    
    // Display word based on game mode
    displayCurrentWord();
    
    // Clear previous feedback and input
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    elements.userInput.value = '';
    elements.wordHint.textContent = '';
    
    // Clear any existing timers
    if (quickFireTimer) {
        clearInterval(quickFireTimer);
        quickFireTimer = null;
    }
    
    // Show additional information based on game mode
    switch (currentGame.mode) {
        case 'spelling':
            elements.wordDefinition.textContent = `🇸🇪 Swedish: ${currentGame.currentWord.swedish} → English: ?`;
            break;
        case 'definition':
            elements.wordDefinition.textContent = currentGame.currentWord.definition;
            break;
        case 'quickfire':
            elements.wordDefinition.textContent = `🇸🇪 ${currentGame.currentWord.swedish} → 🇬🇧 ?`;
            startQuickFireTimer();
            break;
        case 'phrases':
            elements.wordDefinition.textContent = `💡 ${currentGame.currentWord.hint}`;
            break;
        default:
            elements.wordDefinition.textContent = '';
    }
}

// Display current word based on game mode
function displayCurrentWord() {
    const word = currentGame.currentWord.word;
    
    switch (currentGame.mode) {
        case 'spelling':
            // Show Swedish word for translation to English
            elements.currentWord.textContent = currentGame.currentWord.swedish;
            elements.currentWord.style.fontSize = '2.2rem';
            elements.currentWord.style.color = '#2196F3';
            break;
            
        case 'writing':
            // Show scrambled letters for writing mode
            elements.currentWord.textContent = scrambleWord(word);
            elements.currentWord.style.fontSize = '2.5rem';
            elements.currentWord.style.color = '#495057';
            break;
            
        case 'definition':
            // Hide word for definition mode
            elements.currentWord.textContent = '? ? ?';
            elements.currentWord.style.fontSize = '2.5rem';
            elements.currentWord.style.color = '#6c757d';
            break;
            
        case 'quickfire':
            // Show Swedish word with timer pressure
            elements.currentWord.textContent = currentGame.currentWord.swedish;
            elements.currentWord.style.fontSize = '2.2rem';
            elements.currentWord.style.color = '#ff6b35';
            break;
            
        case 'phrases':
            // Show context sentence with missing word
            const sentence = generateContextSentence(currentGame.currentWord);
            elements.currentWord.textContent = sentence;
            elements.currentWord.style.fontSize = '1.8rem';
            elements.currentWord.style.color = '#495057';
            break;
    }
}

// Scramble word letters for writing mode
function scrambleWord(word) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join(' ');
}

// Generate context sentence for phrase building mode
function generateContextSentence(wordObj) {
    const templates = {
        animals: [
            `The ___ is a wonderful creature.`,
            `I saw a ___ at the zoo yesterday.`,
            `My favorite animal is a ___.`
        ],
        nature: [
            `The ___ is beautiful in spring.`,
            `We can see the ___ from our window.`,
            `I love walking near the ___.`
        ],
        food: [
            `I like to eat ___ for breakfast.`,
            `The ___ tastes delicious.`,
            `Would you like some ___?`
        ],
        objects: [
            `I need to buy a new ___.`,
            `The ___ is on the table.`,
            `Have you seen my ___?`
        ],
        actions: [
            `I like to ___ every morning.`,
            `Can you ___ with me?`,
            `It's important to ___ regularly.`
        ],
        default: [
            `The word is ___.`,
            `I'm thinking of the word ___.`,
            `Can you spell ___?`
        ]
    };
    
    const category = wordObj.category || 'default';
    const categoryTemplates = templates[category] || templates.default;
    const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
    
    return template.replace('___', '____');
}

// Timer for quick fire mode
let quickFireTimer = null;
let timeLeft = 0;

function startQuickFireTimer() {
    timeLeft = getDifficultyTime();
    updateTimerDisplay();
    
    quickFireTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(quickFireTimer);
            handleTimeUp();
        }
    }, 1000);
}

function getDifficultyTime() {
    switch (currentGame.difficulty) {
        case 'beginner': return 15;
        case 'easy': return 12;
        case 'medium': return 10;
        case 'hard': return 8;
        case 'expert': return 6;
        default: return 10;
    }
}

function updateTimerDisplay() {
    if (currentGame.mode === 'quickfire') {
        const timerColor = timeLeft <= 3 ? '#ff4757' : timeLeft <= 6 ? '#ffa502' : '#2ed573';
        elements.wordHint.innerHTML = `<span style="color: ${timerColor}; font-weight: bold; font-size: 1.2rem;">⏰ Time: ${timeLeft}s</span>`;
    }
}

function handleTimeUp() {
    showFeedback(`⏰ Time's up! The word was: ${currentGame.currentWord.word}`, 'incorrect');
    currentGame.streak = 0;
    currentGame.wordsCompleted++;
    
    setTimeout(() => {
        if (currentGame.wordsCompleted >= currentGame.wordsTotal) {
            endGame();
        } else {
            nextWord();
            updateDisplay();
            elements.userInput.focus();
        }
    }, 2000);
    
    updateDisplay();
}

// Check user's answer
function checkAnswer() {
    const userAnswer = elements.userInput.value.trim().toLowerCase();
    const correctWord = currentGame.currentWord.word.toLowerCase();
    
    if (!userAnswer) {
        showFeedback('Please enter an answer!', 'hint');
        return;
    }
    
    currentGame.totalAttempts++;
    
    if (userAnswer === correctWord) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(userAnswer);
    }
}

// Handle correct answer
function handleCorrectAnswer() {
    // Clear timer if in quick fire mode
    if (quickFireTimer) {
        clearInterval(quickFireTimer);
        quickFireTimer = null;
    }
    
    currentGame.correctAnswers++;
    currentGame.wordsCompleted++;
    currentGame.streak++;
    currentGame.bestStreak = Math.max(currentGame.bestStreak, currentGame.streak);
    
    // Calculate score based on difficulty, streak, and performance
    let points = getDifficultyPoints();
    points += Math.floor(currentGame.streak * 0.5); // Streak bonus
    
    // Quick fire time bonus
    if (currentGame.mode === 'quickfire' && timeLeft > 0) {
        points += Math.floor(timeLeft / 2); // Time bonus
    }
    
    // Bonus for not using hints or skips on this word
    if (currentGame.hintsUsed === 0) points += 5;
    
    currentGame.score += points;
    
    // Add points to global progression system
    addPoints(points);
    
    // Level up check (session level)
    if (currentGame.wordsCompleted % 5 === 0) {
        currentGame.level++;
        showFeedback(`🎉 Session Level Up! Level ${currentGame.level}! +${points} points`, 'correct');
    } else {
        const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        showFeedback(`${message} +${points} points`, 'correct');
    }
    
    // Show correct word briefly
    elements.currentWord.textContent = currentGame.currentWord.word.toUpperCase();
    elements.currentWord.classList.add('bounce');
    
    setTimeout(() => {
        elements.currentWord.classList.remove('bounce');
        if (currentGame.wordsCompleted >= currentGame.wordsTotal) {
            endGame();
        } else {
            nextWord();
            updateDisplay();
            elements.userInput.focus();
        }
    }, 2000);
    
    updateDisplay();
}

// Handle incorrect answer
function handleIncorrectAnswer(userAnswer) {
    currentGame.streak = 0;
    
    // Provide specific feedback
    let feedbackMessage = '';
    const correctWord = currentGame.currentWord.word.toLowerCase();
    
    if (userAnswer.length !== correctWord.length) {
        feedbackMessage = `Try again! The word has ${correctWord.length} letters.`;
    } else {
        // Check for close matches
        const similarity = calculateSimilarity(userAnswer, correctWord);
        if (similarity > 0.6) {
            feedbackMessage = "So close! Check your spelling and try again.";
        } else {
            const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
            feedbackMessage = randomMessage;
        }
    }
    
    showFeedback(feedbackMessage, 'incorrect');
    
    // Clear input for retry
    elements.userInput.value = '';
    elements.userInput.focus();
}

// Calculate similarity between two words (simple algorithm)
function calculateSimilarity(word1, word2) {
    const len1 = word1.length;
    const len2 = word2.length;
    const matrix = [];
    
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (word1.charAt(i - 1) === word2.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
}

// Get points based on difficulty
function getDifficultyPoints() {
    switch (currentGame.difficulty) {
        case 'beginner': return 5;
        case 'easy': return 10;
        case 'medium': return 20;
        case 'hard': return 30;
        case 'expert': return 50;
        default: return 10;
    }
}

// Show hint for current word
function showHint() {
    if (currentGame.currentWord) {
        currentGame.hintsUsed++;
        const hint = currentGame.currentWord.hint;
        elements.wordHint.textContent = `💡 Hint: ${hint}`;
        showFeedback('Hint shown above! 👆', 'hint');
        
        // Reduce score slightly for using hint
        currentGame.score = Math.max(0, currentGame.score - 2);
        updateDisplay();
    }
}

// Skip current word
function skipWord() {
    currentGame.skipsUsed++;
    currentGame.streak = 0;
    currentGame.wordsCompleted++;
    
    showFeedback(`Skipped! The word was: ${currentGame.currentWord.word}`, 'hint');
    
    setTimeout(() => {
        if (currentGame.wordsCompleted >= currentGame.wordsTotal) {
            endGame();
        } else {
            nextWord();
            updateDisplay();
            elements.userInput.focus();
        }
    }, 2000);
    
    updateDisplay();
}

// Show feedback message
function showFeedback(message, type) {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback ${type}`;
}

// Update game display elements
function updateDisplay() {
    elements.score.textContent = currentGame.score;
    elements.streak.textContent = currentGame.streak;
    elements.level.textContent = currentGame.level;
    elements.wordsCompleted.textContent = currentGame.wordsCompleted;
    
    // Update progress bar
    const progress = (currentGame.wordsCompleted / currentGame.wordsTotal) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

// End game and show results
function endGame() {
    elements.gameArea.classList.add('hidden');
    elements.resultsScreen.classList.remove('hidden');
    
    // Calculate final statistics
    const accuracy = currentGame.totalAttempts > 0 
        ? Math.round((currentGame.correctAnswers / currentGame.totalAttempts) * 100)
        : 0;
    
    // Update final stats
    elements.finalScore.textContent = currentGame.score;
    elements.finalAccuracy.textContent = `${accuracy}%`;
    elements.finalStreak.textContent = currentGame.bestStreak;
    
    // Generate personalized tips
    generateTips(accuracy);
}

// Generate personalized learning tips
function generateTips(accuracy) {
    const tips = [];
    
    if (accuracy < 60) {
        tips.push("Focus on easier words first to build confidence");
        tips.push("Use the hint feature more often to learn new words");
    } else if (accuracy < 80) {
        tips.push("You're making great progress! Keep practicing");
        tips.push("Try the next difficulty level when ready");
    } else {
        tips.push("Excellent work! You're a spelling master!");
        tips.push("Challenge yourself with harder difficulty levels");
    }
    
    if (currentGame.hintsUsed > 5) {
        tips.push("Try to rely less on hints to improve memory");
    }
    
    if (currentGame.skipsUsed > 3) {
        tips.push("Don't skip too often - practice makes perfect!");
    }
    
    // Add random learning tips
    const randomTips = learningTips.slice().sort(() => 0.5 - Math.random()).slice(0, 2);
    tips.push(...randomTips);
    
    // Update tips display
    elements.tipsList.innerHTML = '';
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        elements.tipsList.appendChild(li);
    });
}

// Return to mode selection
function showModeSelection() {
    elements.gameArea.classList.add('hidden');
    elements.resultsScreen.classList.add('hidden');
    elements.modeSelection.classList.remove('hidden');
}

// Play again with same settings
function playAgain() {
    startGame(currentGame.mode);
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Only when game is active
    if (!elements.gameArea.classList.contains('hidden')) {
        switch(e.key) {
            case 'h':
            case 'H':
                if (e.ctrlKey) {
                    e.preventDefault();
                    showHint();
                }
                break;
            case 's':
            case 'S':
                if (e.ctrlKey) {
                    e.preventDefault();
                    skipWord();
                }
                break;
        }
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}	
