/**
 * Number Recognition Game Module
 */
const NumberRecognitionGame = (function() {
    // Private variables
    let currentLevel = 1;
    let score = 0;
    let questionCount = 0;
    let maxQuestions = 10;
    
    // DOM elements
    let gameContainer;
    let questionElement;
    let optionsContainer;
    let scoreElement;
    let levelElement;
    let progressElement;
    
    // Game configuration based on level
    const levels = {
        1: { minNumber: 1, maxNumber: 5 },
        2: { minNumber: 1, maxNumber: 10 },
        3: { minNumber: 1, maxNumber: 20 }
    };
    
    // Initialize the game
    function init(container) {
        gameContainer = container;
        
        // Create game UI
        createGameUI();
        
        // Load saved level if available
        const savedLevel = Storage.getGameLevel('number-recognition');
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
                    <span>רמה: <span id="number-level">1</span></span>
                    <span>ניקוד: <span id="number-score">0</span></span>
                </div>
                <div class="progress-bar">
                    <div id="number-progress" class="progress"></div>
                </div>
            </div>
            <div class="game-content">
                <div id="number-question" class="question"></div>
                <div id="number-options" class="options"></div>
            </div>
            <div class="game-footer">
                <button id="number-back" class="back-button">חזרה לתפריט</button>
            </div>
        `;
        
        // Get DOM elements
        questionElement = document.getElementById('number-question');
        optionsContainer = document.getElementById('number-options');
        scoreElement = document.getElementById('number-score');
        levelElement = document.getElementById('number-level');
        progressElement = document.getElementById('number-progress');
        
        // Add event listener for back button
        document.getElementById('number-back').addEventListener('click', () => {
            // Show game menu and hide game container
            document.getElementById('game-menu').classList.remove('hidden');
            document.getElementById('game-container').classList.add('hidden');
        });
    }
    
    // Start a level
    function startLevel(level) {
        currentLevel = level;
        levelElement.textContent = level;
        scoreElement.textContent = score;
        questionCount = 0;
        
        // Save current level
        Storage.saveGameLevel('number-recognition', level);
        
        // Generate first question
        generateQuestion();
    }
    
    // Generate a number recognition question
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
        
        // Generate number for recognition
        const number = Math.floor(Math.random() * (levelConfig.maxNumber - levelConfig.minNumber + 1)) + levelConfig.minNumber;
        
        // Display question - show number in text form
        questionElement.innerHTML = `<span class="number-text">איזה מספר זה?</span><div class="number-display">${numberToHebrewText(number)}</div>`;
        
        // Generate options
        const options = generateOptions(number, levelConfig);
        displayOptions(options, number);
        
        // Increment question count
        questionCount++;
    }
    
    // Convert number to Hebrew text
    function numberToHebrewText(num) {
        const hebrewNumbers = [
            'אפס', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש',
            'שש', 'שבע', 'שמונה', 'תשע', 'עשר', 'אחת עשרה',
            'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה',
            'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה', 'עשרים'
        ];
        
        if (num <= 20) {
            return hebrewNumbers[num];
        } else {
            return num.toString(); // Fallback for larger numbers
        }
    }
    
    // Generate answer options
    function generateOptions(correctAnswer, levelConfig) {
        const options = [correctAnswer];
        
        // Generate 3 wrong options
        while (options.length < 4) {
            const wrongAnswer = Math.floor(Math.random() * (levelConfig.maxNumber - levelConfig.minNumber + 1)) + levelConfig.minNumber;
            
            if (!options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }
    
    // Display options
    function displayOptions(options, correctAnswer) {
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            
            button.addEventListener('click', () => {
                handleAnswer(option, correctAnswer);
            });
            
            optionsContainer.appendChild(button);
        });
    }
    
    // Handle user's answer
    function handleAnswer(selectedAnswer, correctAnswer) {
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Update score
        if (isCorrect) {
            score += 10;
            scoreElement.textContent = score;
        }
        
        // Highlight correct/wrong answer
        const buttons = optionsContainer.querySelectorAll('.option-button');
        buttons.forEach(button => {
            const buttonValue = parseInt(button.textContent);
            
            if (buttonValue === correctAnswer) {
                button.classList.add('correct');
            } else if (buttonValue === selectedAnswer && !isCorrect) {
                button.classList.add('wrong');
            }
            
            // Disable buttons
            button.disabled = true;
        });
        
        // Save score
        Storage.saveGameScore('number-recognition', score);
        
        // Wait before next question
        setTimeout(() => {
            generateQuestion();
        }, 1500);
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
            // Show game menu and hide game container
            document.getElementById('game-menu').classList.remove('hidden');
            document.getElementById('game-container').classList.add('hidden');
        });
    }
    
    // Public API
    return {
        init
    };
})(); 