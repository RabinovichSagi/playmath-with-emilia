/**
 * Parent Settings Module
 */
const ParentSettings = (function() {
    // DOM elements
    let settingsContainer;
    
    // Default settings
    const defaultSettings = {
        difficulty: 'medium',
        soundEnabled: true,
        timerEnabled: true,
        language: 'he',
        maxQuestions: 10
    };
    
    // Initialize the settings
    function init(container) {
        settingsContainer = container;
        
        // Render settings form
        renderSettings();
    }
    
    // Render the settings form
    function renderSettings() {
        // Get current settings from storage or use defaults
        const settings = Storage.getSettings() || defaultSettings;
        
        // Create settings form
        const settingsHTML = `
            <div class="settings-form">
                <h3>הגדרות משחק</h3>
                
                <div class="setting-item">
                    <label for="difficulty">רמת קושי כללית:</label>
                    <select id="difficulty" name="difficulty">
                        <option value="easy" ${settings.difficulty === 'easy' ? 'selected' : ''}>קל</option>
                        <option value="medium" ${settings.difficulty === 'medium' ? 'selected' : ''}>בינוני</option>
                        <option value="hard" ${settings.difficulty === 'hard' ? 'selected' : ''}>קשה</option>
                    </select>
                </div>
                
                <div class="setting-item">
                    <label for="sound-toggle">צלילים:</label>
                    <div class="toggle-switch">
                        <input type="checkbox" id="sound-toggle" ${settings.soundEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label for="timer-toggle">טיימר:</label>
                    <div class="toggle-switch">
                        <input type="checkbox" id="timer-toggle" ${settings.timerEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label for="language">שפה:</label>
                    <select id="language" name="language">
                        <option value="he" ${settings.language === 'he' ? 'selected' : ''}>עברית</option>
                        <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>
                
                <div class="setting-item">
                    <label for="max-questions">מספר שאלות למשחק:</label>
                    <input type="number" id="max-questions" min="5" max="20" value="${settings.maxQuestions}">
                </div>
                
                <div class="game-specific-settings">
                    <h3>הגדרות ספציפיות למשחקים</h3>
                    
                    <div class="setting-section">
                        <h4>חיבור</h4>
                        <div class="setting-item">
                            <label for="addition-max">מספר מקסימלי:</label>
                            <input type="number" id="addition-max" min="5" max="100" value="20">
                        </div>
                    </div>
                    
                    <div class="setting-section">
                        <h4>חיסור</h4>
                        <div class="setting-item">
                            <label for="subtraction-max">מספר מקסימלי:</label>
                            <input type="number" id="subtraction-max" min="5" max="100" value="20">
                        </div>
                        <div class="setting-item">
                            <label for="allow-negative">אפשר תוצאות שליליות:</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="allow-negative">
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="setting-section">
                        <h4>זיהוי מספרים</h4>
                        <div class="setting-item">
                            <label for="number-max">מספר מקסימלי:</label>
                            <input type="number" id="number-max" min="5" max="100" value="20">
                        </div>
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button id="save-settings" class="primary-button">שמור הגדרות</button>
                    <button id="reset-settings" class="secondary-button">אפס להגדרות ברירת מחדל</button>
                </div>
            </div>
        `;
        
        // Set the settings HTML
        settingsContainer.innerHTML = settingsHTML;
        
        // Add event listeners
        document.getElementById('save-settings').addEventListener('click', saveSettings);
        document.getElementById('reset-settings').addEventListener('click', resetSettings);
    }
    
    // Save settings
    function saveSettings() {
        // Collect general settings
        const settings = {
            difficulty: document.getElementById('difficulty').value,
            soundEnabled: document.getElementById('sound-toggle').checked,
            timerEnabled: document.getElementById('timer-toggle').checked,
            language: document.getElementById('language').value,
            maxQuestions: parseInt(document.getElementById('max-questions').value) || 10,
            
            // Game-specific settings
            games: {
                addition: {
                    maxNumber: parseInt(document.getElementById('addition-max').value) || 20
                },
                subtraction: {
                    maxNumber: parseInt(document.getElementById('subtraction-max').value) || 20,
                    allowNegative: document.getElementById('allow-negative').checked
                },
                numberRecognition: {
                    maxNumber: parseInt(document.getElementById('number-max').value) || 20
                }
            }
        };
        
        // Save to storage
        Storage.saveSettings(settings);
        
        // Show confirmation
        showNotification('ההגדרות נשמרו בהצלחה!');
    }
    
    // Reset settings to defaults
    function resetSettings() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל ההגדרות לברירת המחדל?')) {
            // Save default settings
            Storage.saveSettings(defaultSettings);
            
            // Re-render settings form
            renderSettings();
            
            // Show confirmation
            showNotification('ההגדרות אופסו לברירת המחדל');
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Public API
    return {
        init
    };
})(); 