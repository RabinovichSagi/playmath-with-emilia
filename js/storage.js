// Storage utility for managing game progress and settings

const STORAGE_KEYS = {
    PROGRESS: 'playmathProgress',
    SETTINGS: 'playmathSettings',
    ACHIEVEMENTS: 'playmathAchievements'
};

// Default settings
const DEFAULT_SETTINGS = {
    soundEnabled: true,
    difficulty: 'easy',
    games: {
        addition: {
            maxNumber: 10,
            problemsPerRound: 5
        },
        subtraction: {
            maxNumber: 10,
            problemsPerRound: 5
        },
        numberRecognition: {
            maxNumber: 20,
            problemsPerRound: 5
        }
    }
};

// Load settings from local storage
function loadSettings() {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
}

// Save settings to local storage
function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Load progress from local storage
function loadProgress() {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return savedProgress ? JSON.parse(savedProgress) : {
        gameProgress: {},
        lastPlayed: {}
    };
}

// Save progress to local storage
function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

// Load achievements from local storage
function loadAchievements() {
    const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return savedAchievements ? JSON.parse(savedAchievements) : [];
}

// Save achievements to local storage
function saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

// Update game progress
function updateGameProgress(gameId, progress) {
    const currentProgress = loadProgress();
    currentProgress.gameProgress[gameId] = progress;
    currentProgress.lastPlayed[gameId] = new Date().toISOString();
    saveProgress(currentProgress);
}

// Get game progress
function getGameProgress(gameId) {
    const progress = loadProgress();
    return {
        progress: progress.gameProgress[gameId] || 0,
        lastPlayed: progress.lastPlayed[gameId] || null
    };
}

// Add achievement
function addAchievement(achievement) {
    const achievements = loadAchievements();
    if (!achievements.find(a => a.id === achievement.id)) {
        achievements.push({
            ...achievement,
            date: new Date().toISOString()
        });
        saveAchievements(achievements);
        return true;
    }
    return false;
}

// Get all achievements
function getAchievements() {
    return loadAchievements();
}

// Update game settings
function updateGameSettings(gameId, settings) {
    const currentSettings = loadSettings();
    currentSettings.games[gameId] = {
        ...currentSettings.games[gameId],
        ...settings
    };
    saveSettings(currentSettings);
}

// Get game settings
function getGameSettings(gameId) {
    const settings = loadSettings();
    return settings.games[gameId] || DEFAULT_SETTINGS.games[gameId];
}

// Export functions
window.storage = {
    loadSettings,
    saveSettings,
    loadProgress,
    saveProgress,
    loadAchievements,
    saveAchievements,
    updateGameProgress,
    getGameProgress,
    addAchievement,
    getAchievements,
    updateGameSettings,
    getGameSettings
}; 