/**
 * Parent Dashboard Module
 */
const ParentDashboard = (function() {
    // DOM elements
    let dashboardContainer;
    
    // Initialize the dashboard
    function init(container) {
        dashboardContainer = container;
        
        // Render dashboard
        renderDashboard();
    }
    
    // Render the dashboard content
    function renderDashboard() {
        // Get all game stats from storage
        const games = [
            { id: 'addition', name: 'חיבור' },
            { id: 'subtraction', name: 'חיסור' },
            { id: 'number-recognition', name: 'זיהוי מספרים' }
        ];
        
        let dashboardHTML = `
            <div class="dashboard-stats">
                <h3>סיכום התקדמות</h3>
                <div class="stats-grid">
        `;
        
        // Add stats for each game
        games.forEach(game => {
            const score = Storage.getGameScore(game.id) || 0;
            const level = Storage.getGameLevel(game.id) || 1;
            
            dashboardHTML += `
                <div class="game-stat-card">
                    <h4>${game.name}</h4>
                    <div class="stat-details">
                        <div class="stat-item">
                            <span class="stat-label">ניקוד:</span>
                            <span class="stat-value">${score}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">רמה:</span>
                            <span class="stat-value">${level}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Add progress chart placeholder
        dashboardHTML += `
                </div>
                <div class="progress-chart">
                    <h3>התקדמות לאורך זמן</h3>
                    <div class="chart-placeholder">
                        <p>גרף התקדמות יוצג כאן בעתיד</p>
                    </div>
                </div>
            </div>
            
            <div class="recent-activity">
                <h3>פעילות אחרונה</h3>
                <div class="activity-list">
        `;
        
        // Add mock activity entries (would be replaced with real data in production)
        const mockActivities = [
            { game: 'חיבור', date: 'היום', score: '30 נקודות' },
            { game: 'חיסור', date: 'אתמול', score: '20 נקודות' },
            { game: 'זיהוי מספרים', date: 'לפני 3 ימים', score: '40 נקודות' }
        ];
        
        mockActivities.forEach(activity => {
            dashboardHTML += `
                <div class="activity-item">
                    <div class="activity-game">${activity.game}</div>
                    <div class="activity-date">${activity.date}</div>
                    <div class="activity-score">${activity.score}</div>
                </div>
            `;
        });
        
        dashboardHTML += `
                </div>
            </div>
            
            <div class="actions-panel">
                <button id="reset-progress" class="warning-button">איפוס התקדמות</button>
                <button id="export-data" class="secondary-button">ייצוא נתונים</button>
            </div>
        `;
        
        // Set the dashboard HTML
        dashboardContainer.innerHTML = dashboardHTML;
        
        // Add event listeners
        document.getElementById('reset-progress').addEventListener('click', handleResetProgress);
        document.getElementById('export-data').addEventListener('click', handleExportData);
    }
    
    // Handle reset progress action
    function handleResetProgress() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות? פעולה זו אינה ניתנת לביטול.')) {
            // Reset all game data
            const games = ['addition', 'subtraction', 'number-recognition'];
            games.forEach(game => {
                Storage.saveGameScore(game, 0);
                Storage.saveGameLevel(game, 1);
            });
            
            // Re-render dashboard
            renderDashboard();
            
            alert('ההתקדמות אופסה בהצלחה.');
        }
    }
    
    // Handle export data action
    function handleExportData() {
        // Collect all game data
        const exportData = {
            timestamp: new Date().toISOString(),
            games: {}
        };
        
        const games = ['addition', 'subtraction', 'number-recognition'];
        games.forEach(game => {
            exportData.games[game] = {
                score: Storage.getGameScore(game) || 0,
                level: Storage.getGameLevel(game) || 1
            };
        });
        
        // Convert to JSON string
        const dataStr = JSON.stringify(exportData, null, 2);
        
        // Create download link
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileName = 'emilia-math-data-' + new Date().toISOString().slice(0, 10) + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.style.display = 'none';
        
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    }
    
    // Public API
    return {
        init
    };
})(); 