// Game Configuration
const GAMES = [
    {
        id: 'addition',
        title: 'הרפתקת החיבור',
        description: 'תרגול חיבור מספרים!',
        icon: '➕',
        emoji: true,
        difficulty: 'easy'
    },
    {
        id: 'subtraction',
        title: 'ספארי החיסור',
        description: 'לימוד חיסור מספרים!',
        icon: '➖',
        emoji: true,
        difficulty: 'easy'
    },
    {
        id: 'number-recognition',
        title: 'נינג\'ה המספרים',
        description: 'שליטה בזיהוי מספרים!',
        icon: '🔢',
        emoji: true,
        difficulty: 'easy'
    },
    {
        id: 'series',
        title: 'מסע הסדרות',
        description: 'תרגול סדרות מספרים!',
        icon: '📈',
        emoji: true,
        difficulty: 'medium'
    }
];

// Application State
const state = {
    currentGame: null,
    isParentMode: false,
    studentName: 'אמיליה',
    achievements: [],
    gameProgress: {}
};

// DOM Elements
const elements = {
    studentInterface: document.getElementById('student-interface'),
    parentInterface: document.getElementById('parent-interface'),
    gameMenu: document.getElementById('game-menu'),
    gameContainer: document.getElementById('game-container'),
    parentModeButton: document.getElementById('parent-mode'),
    backToStudentButton: document.getElementById('back-to-student'),
    gameGrid: document.querySelector('.game-grid')
};

// Gradient background utility
const GRADIENT_CLASSES = [
    'bg-gradient-1',
    'bg-gradient-2',
    'bg-gradient-3',
    'bg-gradient-4',
    'bg-gradient-5',
    'bg-gradient-6',
    'bg-gradient-7'
];
let currentGradientIdx = 0;
let exerciseCounter = 0;
const EXERCISES_PER_BG = 3; // Change background every 3 exercises

function setGradientBackground(idx) {
    document.body.classList.remove(...GRADIENT_CLASSES);
    document.body.classList.add(GRADIENT_CLASSES[idx]);
}

function nextGradientBackground() {
    currentGradientIdx = (currentGradientIdx + 1) % GRADIENT_CLASSES.length;
    setGradientBackground(currentGradientIdx);
}

// Call this after each exercise is completed
function onExerciseCompleted() {
    exerciseCounter++;
    if (exerciseCounter % EXERCISES_PER_BG === 0) {
        nextGradientBackground();
    }
}

// Set initial gradient on load
setGradientBackground(currentGradientIdx);

// Navigation and Back Button Logic
const backButton = document.getElementById('back-button');
const navWarningModal = document.getElementById('nav-warning-modal');
const cancelNavBtn = document.getElementById('cancel-nav');
const confirmNavBtn = document.getElementById('confirm-nav');

let inMainMenu = true;
let pendingNavEvent = null;

function showBackButton(show) {
    backButton.style.display = show ? '' : 'none';
}

function goToMainMenu() {
    // Show main menu, hide game container
    elements.gameMenu.classList.remove('hidden');
    elements.gameContainer.classList.add('hidden');
    inMainMenu = true;
    showBackButton(false);
    history.replaceState({page: 'main'}, '', location.pathname);
}

function goToGame() {
    inMainMenu = false;
    showBackButton(true);
    history.pushState({page: 'game'}, '', location.pathname + '#game');
}

// Back button click
backButton.addEventListener('click', () => {
    goToMainMenu();
});

// Intercept browser back/forward
window.addEventListener('popstate', (e) => {
    if (inMainMenu) {
        // Already in main menu, show warning
        showNavWarning(e);
    } else {
        goToMainMenu();
    }
});

// Intercept refresh/navigation away
window.addEventListener('beforeunload', (e) => {
    if (inMainMenu) {
        e.preventDefault();
        e.returnValue = '';
        showNavWarning(e);
        return '';
    }
});

function showNavWarning(event) {
    navWarningModal.classList.remove('hidden');
    pendingNavEvent = event;
}

function hideNavWarning() {
    navWarningModal.classList.add('hidden');
    pendingNavEvent = null;
}

cancelNavBtn.addEventListener('click', () => {
    hideNavWarning();
});

confirmNavBtn.addEventListener('click', () => {
    hideNavWarning();
    if (pendingNavEvent && pendingNavEvent.type === 'beforeunload') {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        location.reload();
    } else {
        history.back();
    }
});

// Initialize the application
function init() {
    loadProgress();
    renderGameMenu();
    setupEventListeners();
}

// Load progress from local storage
function loadProgress() {
    const savedProgress = localStorage.getItem('playmathProgress');
    if (savedProgress) {
        const { gameProgress, achievements } = JSON.parse(savedProgress);
        state.gameProgress = gameProgress;
        state.achievements = achievements;
    }
}

// Save progress to local storage
function saveProgress() {
    const progressData = {
        gameProgress: state.gameProgress,
        achievements: state.achievements
    };
    localStorage.setItem('playmathProgress', JSON.stringify(progressData));
}

// Render the game menu
function renderGameMenu() {
    elements.gameGrid.innerHTML = GAMES.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            ${game.emoji ? 
                `<div class="game-emoji-icon">${game.icon}</div>` : 
                `<img src="${game.icon}" alt="${game.title}">`
            }
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="progress-indicator">
                ${getProgressIndicator(game.id)}
            </div>
        </div>
    `).join('');
    inMainMenu = true;
    showBackButton(false);
    history.replaceState({page: 'main'}, '', location.pathname);
}

// Get progress indicator for a game
function getProgressIndicator(gameId) {
    const progress = state.gameProgress[gameId] || 0;
    return `
        <div class="progress-bar">
            <div class="progress" style="width: ${progress}%"></div>
        </div>
        <span>${progress}% הושלם</span>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Game card clicks
    elements.gameGrid.addEventListener('click', (e) => {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            const gameId = gameCard.dataset.gameId;
            startGame(gameId);
        }
    });

    // Parent mode toggle
    elements.parentModeButton.addEventListener('click', toggleParentMode);
    elements.backToStudentButton.addEventListener('click', toggleParentMode);
}

// Start a game
function startGame(gameId) {
    state.currentGame = gameId;
    elements.gameMenu.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    
    // Initialize the specific game
    const gameModules = {
        'addition': AdditionGame,
        'subtraction': SubtractionGame,
        'number-recognition': NumberRecognitionGame,
        'series': SeriesGame
    };
    
    // If the game module exists, initialize it
    if (gameModules[gameId]) {
        gameModules[gameId].init(elements.gameContainer);
    } else {
        console.error(`Game module not found: ${gameId}`);
    }
    
    goToGame();
}

// Toggle between parent and student modes
function toggleParentMode() {
    state.isParentMode = !state.isParentMode;
    elements.studentInterface.classList.toggle('hidden');
    elements.parentInterface.classList.toggle('hidden');
    
    if (state.isParentMode) {
        renderParentDashboard();
    }
}

// Render parent dashboard
function renderParentDashboard() {
    const progressStats = document.getElementById('progress-stats');
    const gameSettings = document.getElementById('game-settings');
    
    // Render progress statistics
    progressStats.innerHTML = GAMES.map(game => `
        <div class="stat-card">
            <h3>${game.title}</h3>
            <p>התקדמות: ${state.gameProgress[game.id] || 0}%</p>
            <p>שוחק לאחרונה: ${getLastPlayedDate(game.id)}</p>
        </div>
    `).join('');
    
    // Render game settings
    gameSettings.innerHTML = GAMES.map(game => `
        <div class="setting-card">
            <h3>${game.title}</h3>
            <select id="difficulty-${game.id}">
                <option value="easy">קל</option>
                <option value="medium">בינוני</option>
                <option value="hard">קשה</option>
            </select>
        </div>
    `).join('');
}

// Get last played date for a game
function getLastPlayedDate(gameId) {
    const lastPlayed = state.gameProgress[`${gameId}_lastPlayed`];
    return lastPlayed ? new Date(lastPlayed).toLocaleDateString('he-IL') : 'אף פעם';
}

// Update game progress
function updateGameProgress(gameId, progress) {
    state.gameProgress[gameId] = progress;
    state.gameProgress[`${gameId}_lastPlayed`] = new Date().toISOString();
    saveProgress();
    renderGameMenu();
}

// On load, set initial state
document.addEventListener('DOMContentLoaded', () => {
    showBackButton(true);
    if (location.hash === '#game') {
        inMainMenu = false;
        showBackButton(true);
    } else {
        inMainMenu = true;
        showBackButton(false);
    }
    history.replaceState({page: inMainMenu ? 'main' : 'game'}, '', location.pathname + (inMainMenu ? '' : '#game'));
});

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 