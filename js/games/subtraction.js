/**
 * Subtraction Game Module
 */
const SubtractionGame = (function() {
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
        1: { minNumber: 1, maxNumber: 5, minResult: 0 },
        2: { minNumber: 1, maxNumber: 10, minResult: 0 },
        3: { minNumber: 5, maxNumber: 20, minResult: 0 }
    };
    
    // Initialize the game
    function init(container) {
        gameContainer = container;
        
        // Create game UI
        createGameUI();
        
        // Load saved level if available
        const savedLevel = Storage.getGameLevel('subtraction');
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
                    <span>רמה: <span id="subtraction-level">1</span></span>
                    <span>ניקוד: <span id="subtraction-score">0</span></span>
                </div>
                <div class="progress-bar">
                    <div id="subtraction-progress" class="progress"></div>
                </div>
            </div>
            <div class="game-content">
                <div id="subtraction-question" class="question"></div>
                <div id="subtraction-options" class="options"></div>
            </div>
            <div class="game-footer">
                <button id="subtraction-back" class="back-button">חזרה לתפריט</button>
            </div>
        `;
        
        // Get DOM elements
        questionElement = document.getElementById('subtraction-question');
        optionsContainer = document.getElementById('subtraction-options');
        scoreElement = document.getElementById('subtraction-score');
        levelElement = document.getElementById('subtraction-level');
        progressElement = document.getElementById('subtraction-progress');
        
        // Add event listener for back button
        document.getElementById('subtraction-back').addEventListener('click', () => {
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
        Storage.saveGameLevel('subtraction', level);
        
        // Generate first question
        generateQuestion();
    }
    
    // Generate a subtraction question
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
        
        // Generate numbers for subtraction
        let num1, num2;
        do {
            num1 = Math.floor(Math.random() * (levelConfig.maxNumber - levelConfig.minNumber + 1)) + levelConfig.minNumber;
            num2 = Math.floor(Math.random() * (num1 - levelConfig.minResult + 1));
        } while (num1 - num2 < levelConfig.minResult);
        
        const correctAnswer = num1 - num2;
        
        // Display question
        questionElement.textContent = `${num1} - ${num2} = ?`;
        
        // Generate options
        const options = generateOptions(correctAnswer, levelConfig);
        displayOptions(options, correctAnswer);
        
        // Increment question count
        questionCount++;
    }
    
    // Generate answer options
    function generateOptions(correctAnswer, levelConfig) {
        const options = [correctAnswer];
        
        // Generate 3 wrong options
        while (options.length < 4) {
            const min = Math.max(levelConfig.minResult, correctAnswer - 5);
            const max = Math.min(levelConfig.maxNumber, correctAnswer + 5);
            const wrongAnswer = Math.floor(Math.random() * (max - min + 1)) + min;
            
            if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
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
        Storage.saveGameScore('subtraction', score);
        
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