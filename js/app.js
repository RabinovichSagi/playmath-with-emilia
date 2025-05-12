// Game Configuration
const GAMES = [
    {
        id: 'addition',
        title: 'הרפתקת החיבור',
        description: 'תרגול חיבור מספרים!',
        icon: 'assets/images/addition.png',
        difficulty: 'easy'
    },
    {
        id: 'subtraction',
        title: 'ספארי החיסור',
        description: 'לימוד חיסור מספרים!',
        icon: 'assets/images/subtraction.png',
        difficulty: 'easy'
    },
    {
        id: 'number-recognition',
        title: 'נינג\'ה המספרים',
        description: 'שליטה בזיהוי מספרים!',
        icon: 'assets/images/numbers.png',
        difficulty: 'easy'
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
            <img src="${game.icon}" alt="${game.title}">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="progress-indicator">
                ${getProgressIndicator(game.id)}
            </div>
        </div>
    `).join('');
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
    const game = GAMES.find(g => g.id === gameId);
    if (game && window[`init${gameId.charAt(0).toUpperCase() + gameId.slice(1)}Game`]) {
        window[`init${gameId.charAt(0).toUpperCase() + gameId.slice(1)}Game`]();
    }
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

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 