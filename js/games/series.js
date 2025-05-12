/**
 * Mathematical Series Game Module
 */
const SeriesGame = (function() {
    // Private variables
    let currentLevel = 1;
    let score = 0;
    let questionCount = 0;
    let maxQuestions = 5;
    let attempts = 0;
    let currentSeries = null;
    let currentSkipStep = null;
    let currentMissingIndices = null;
    
    // DOM elements
    let gameContainer;
    let questionElement;
    let skipStepInput;
    let checkButton;
    let scoreElement;
    let levelElement;
    let progressElement;
    
    // Game configuration based on level
    const levels = {
        1: { minNumber: 0, maxNumber: 10, skipSteps: [1, 2] },
        2: { minNumber: 0, maxNumber: 20, skipSteps: [1, 2] },
        3: { minNumber: 0, maxNumber: 20, skipSteps: [1, 2, 5] },
        4: { minNumber: 0, maxNumber: 50, skipSteps: [1, 2, 5, 10] },
        5: { minNumber: 0, maxNumber: 100, skipSteps: [1, 2, 5, 10] },
        6: { minNumber: 0, maxNumber: 100, skipSteps: [1, 2, 5, 10] },
        7: { minNumber: 0, maxNumber: 100, skipSteps: [1, 2, 5, 10] },
        8: { minNumber: 0, maxNumber: 100, skipSteps: [1, 2, 3, 4, 5, 10] },
        9: { minNumber: 0, maxNumber: 100, skipSteps: [1, 2, 3, 4, 5, 10] },
        10: { minNumber: 0, maxNumber: 100, skipSteps: [1, 2, 3, 4, 5, 10] },
    };
    
    // Initialize the game
    function init(container) {
        gameContainer = container;
        
        // Create game UI
        createGameUI();
        
        // Load saved level if available
        const savedLevel = Storage.getGameLevel('series');
        if (savedLevel) {
            currentLevel = savedLevel;
        }
        
        // Start the game
        startLevel(currentLevel);
    }
    
    // Create the game interface
    function createGameUI() {
        gameContainer.innerHTML = `
            <div class="game-header">
                <div class="game-info">
                    <span>רמה: <span id="series-level">1</span></span>
                    <span>ניקוד: <span id="series-score">0</span></span>
                </div>
                <div class="progress-bar">
                    <div id="series-progress" class="progress"></div>
                </div>
            </div>
            <div class="game-content">
                <div class="question question-rtl">
                    <label for="skip-step">מספר קפיצות:</label>
                    <input type="number" id="skip-step" min="1" max="10" disabled class="series-input">
                </div>
                <div id="series-question" class="question"></div>
                <button id="check-answer" class="check-button" disabled>בדוק תשובה</button>
            </div>
            <div class="game-footer">
                <button id="series-back" class="back-button">חזרה לתפריט</button>
            </div>
        `;
        
        // Get DOM elements
        questionElement = document.getElementById('series-question');
        skipStepInput = document.getElementById('skip-step');
        checkButton = document.getElementById('check-answer');
        scoreElement = document.getElementById('series-score');
        levelElement = document.getElementById('series-level');
        progressElement = document.getElementById('series-progress');
        
        // Add event listeners
        skipStepInput.addEventListener('input', handleSkipStepInput);
        checkButton.addEventListener('click', handleCheckButton);
        document.getElementById('series-back').addEventListener('click', () => {
            document.getElementById('game-menu').classList.remove('hidden');
            document.getElementById('game-container').classList.add('hidden');
        });
    }
    
    // Handle check button click based on its current state
    function handleCheckButton() {
        switch(checkButton.textContent) {
            case 'בדוק תשובה':
                checkAnswer();
                break;
            case 'נסה שוב':
                resetQuestion();
                break;
            case 'הצג תשובה':
                showAnswer();
                break;
            case 'המשך':
                generateQuestion();
                break;
        }
    }
    
    // Reset the current question for another attempt
    function resetQuestion() {
        attempts = 0;
        displaySeries(currentSeries, currentMissingIndices, currentSkipStep);
    }
    
    // Show the correct answer
    function showAnswer() {
        const inputs = questionElement.querySelectorAll('.series-input');
        inputs.forEach(input => {
            input.value = input.dataset.correct;
            input.classList.add('correct');
        });
        skipStepInput.value = currentSkipStep;
        skipStepInput.classList.add('correct');
        checkButton.textContent = 'המשך';
    }
    
    // Start a level
    function startLevel(level) {
        currentLevel = level;
        levelElement.textContent = level;
        scoreElement.textContent = score;
        questionCount = 0;
        
        // Save current level
        Storage.saveGameLevel('series', level);
        
        // Generate first question
        generateQuestion();
    }
    
    // Generate a series question
    function generateQuestion() {
        const levelConfig = levels[currentLevel];
        
        // Update progress
        const progress = (questionCount / maxQuestions) * 100;
        progressElement.style.width = progress + '%';
        
        // Check if level is complete
        if (questionCount >= maxQuestions) {
            completeLevel();
            return;
        }
        
        // Generate series
        const skipStep = levelConfig.skipSteps[Math.floor(Math.random() * levelConfig.skipSteps.length)];
        const startNumber = Math.floor(Math.random() * (levelConfig.maxNumber - skipStep * 5));
        const series = [];
        
        for (let i = 0; i < 6; i++) {
            series.push(startNumber + (i * skipStep));
        }
        
        // Randomly remove 1 or 2 numbers
        const missingCount = Math.random() < 0.5 ? 1 : 2;
        const missingIndices = [];
        
        while (missingIndices.length < missingCount) {
            const index = Math.floor(Math.random() * 6);
            if (!missingIndices.includes(index)) {
                missingIndices.push(index);
            }
        }
        
        // Store current question data
        currentSeries = series;
        currentSkipStep = skipStep;
        currentMissingIndices = missingIndices;
        attempts = 0;
        
        // Display question
        displaySeries(series, missingIndices, skipStep);
        
        // Increment question count
        questionCount++;
    }
    
    // Display the series with missing numbers
    function displaySeries(series, missingIndices, skipStep) {
        // Reset UI
        skipStepInput.value = '';
        skipStepInput.disabled = false;
        skipStepInput.classList.remove('correct', 'wrong');
        checkButton.disabled = true;
        checkButton.textContent = 'בדוק תשובה';
        
        // Create series display
        const seriesHTML = series.map((num, index) => {
            if (missingIndices.includes(index)) {
                return `<input type="number" class="series-input" disabled data-correct="${num}">`;
            }
            return `<span class="series-number">${num}</span>`;
        }).join(' ');
        
        questionElement.innerHTML = seriesHTML;
        
        // Store skip step for validation
        questionElement.dataset.skipStep = skipStep;
    }
    
    // Handle skip step input
    function handleSkipStepInput() {
        const inputs = questionElement.querySelectorAll('.series-input');
        inputs.forEach(input => {
            input.disabled = false;
            input.addEventListener('input', validateInputs);
        });
        validateInputs();
    }
    
    // Validate all inputs and enable/disable check button
    function validateInputs() {
        const skipStepValue = skipStepInput.value.trim();
        const numberInputs = questionElement.querySelectorAll('.series-input');
        const allNumbersFilled = Array.from(numberInputs).every(input => input.value.trim() !== '');
        
        checkButton.disabled = !(skipStepValue !== '' && allNumbersFilled);
    }
    
    // Check the answer
    function checkAnswer() {
        const skipStep = parseInt(questionElement.dataset.skipStep);
        const userSkipStep = parseInt(skipStepInput.value);
        
        let isCorrect = true;
        
        // Check skip step
        if (userSkipStep !== skipStep) {
            isCorrect = false;
            skipStepInput.classList.add('wrong');
        } else {
            skipStepInput.classList.add('correct');
        }
        
        // Check missing numbers
        const inputs = questionElement.querySelectorAll('.series-input');
        inputs.forEach(input => {
            const userValue = parseInt(input.value);
            const correctValue = parseInt(input.dataset.correct);
            
            if (userValue === correctValue) {
                input.classList.add('correct');
            } else {
                input.classList.add('wrong');
                isCorrect = false;
            }
        });
        
        // Handle result
        if (isCorrect) {
            score += 10;
            scoreElement.textContent = score;
            Storage.saveGameScore('series', score);
            checkButton.textContent = 'המשך';
        } else {
            attempts++;
            if (attempts === 1) {
                checkButton.textContent = 'נסה שוב';
            } else {
                checkButton.textContent = 'הצג תשובה';
            }
        }
        
        // Disable inputs
        skipStepInput.disabled = true;
        inputs.forEach(input => input.disabled = true);
        checkButton.disabled = false;
    }
    
    // Complete a level
    function completeLevel() {
        const nextLevel = currentLevel + 1;
        const hasNextLevel = levels[nextLevel] !== undefined;
        
        // Show level complete screen
        gameContainer.innerHTML = `
            <div class="level-complete">
                <h2>כל הכבוד! השלמת את רמה ${currentLevel}</h2>
                <p>הניקוד שלך: ${score}</p>
                ${hasNextLevel ? 
                    `<button id="next-level" class="primary-button">המשך לרמה ${nextLevel}</button>` : 
                    `<p>סיימת את כל הרמות!</p>`
                }
                <button id="back-to-menu" class="secondary-button">חזרה לתפריט</button>
            </div>
        `;
        
        // Add event listeners
        if (hasNextLevel) {
            document.getElementById('next-level').addEventListener('click', () => {
                init(gameContainer);
                startLevel(nextLevel);
            });
        }
        
        document.getElementById('back-to-menu').addEventListener('click', () => {
            document.getElementById('game-menu').classList.remove('hidden');
            document.getElementById('game-container').classList.add('hidden');
        });
    }
    
    // Public API
    return {
        init
    };
})(); 