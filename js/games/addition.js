// Addition Game Module
function initAdditionGame() {
    const gameContainer = document.getElementById('game-container');
    let currentProblem = generateProblem();
    let score = 0;
    let totalProblems = 0;

    // Game state
    const gameState = {
        difficulty: 'easy',
        maxNumber: 10,
        problemsPerRound: 5
    };

    // Render the game interface
    gameContainer.innerHTML = `
        <div class="game-interface">
            <div class="game-header">
                <h2>Addition Adventure</h2>
                <div class="score-display">
                    Score: <span id="score">0</span>
                </div>
            </div>
            <div class="problem-container">
                <div class="problem">
                    <span id="num1">${currentProblem.num1}</span>
                    <span class="operator">+</span>
                    <span id="num2">${currentProblem.num2}</span>
                    <span class="equals">=</span>
                    <input type="number" id="answer" min="0" max="100">
                </div>
            </div>
            <div class="controls">
                <button id="check-answer">Check Answer</button>
                <button id="back-to-menu">Back to Menu</button>
            </div>
            <div id="feedback" class="feedback"></div>
        </div>
    `;

    // Add event listeners
    const answerInput = document.getElementById('answer');
    const checkButton = document.getElementById('check-answer');
    const backButton = document.getElementById('back-to-menu');

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    checkButton.addEventListener('click', checkAnswer);
    backButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        document.getElementById('game-menu').classList.remove('hidden');
        updateGameProgress('addition', Math.round((score / totalProblems) * 100));
    });

    // Generate a new addition problem
    function generateProblem() {
        const num1 = Math.floor(Math.random() * gameState.maxNumber) + 1;
        const num2 = Math.floor(Math.random() * gameState.maxNumber) + 1;
        return {
            num1,
            num2,
            answer: num1 + num2
        };
    }

    // Check the answer
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        const feedback = document.getElementById('feedback');
        
        if (isNaN(userAnswer)) {
            feedback.textContent = 'Please enter a number!';
            feedback.className = 'feedback error';
            return;
        }

        totalProblems++;
        
        if (userAnswer === currentProblem.answer) {
            score++;
            feedback.textContent = 'Correct! Great job! 🎉';
            feedback.className = 'feedback success';
            playSuccessSound();
        } else {
            feedback.textContent = `Not quite. The answer is ${currentProblem.answer}. Try again!`;
            feedback.className = 'feedback error';
        }

        // Update score display
        document.getElementById('score').textContent = score;

        // Generate new problem
        currentProblem = generateProblem();
        document.getElementById('num1').textContent = currentProblem.num1;
        document.getElementById('num2').textContent = currentProblem.num2;
        answerInput.value = '';

        // Check if round is complete
        if (totalProblems >= gameState.problemsPerRound) {
            const accuracy = Math.round((score / totalProblems) * 100);
            feedback.textContent = `Round complete! Your accuracy: ${accuracy}%`;
            feedback.className = 'feedback complete';
            
            // Update overall progress
            updateGameProgress('addition', accuracy);
            
            // Reset for next round
            score = 0;
            totalProblems = 0;
            document.getElementById('score').textContent = score;
        }

        // Focus on input for next problem
        answerInput.focus();
    }

    // Play success sound
    function playSuccessSound() {
        const audio = new Audio('assets/sounds/success.mp3');
        audio.play().catch(() => {
            // Ignore errors if sound can't be played
        });
    }
} 