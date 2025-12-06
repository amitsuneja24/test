// Game State
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Navigation
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    if (page === 'home') {
        document.getElementById('home-page').classList.add('active');
    } else if (page === 'tic-tac-toe') {
        document.getElementById('tic-tac-toe-page').classList.add('active');
        resetGame();
    } else if (page === 'memory') {
        document.getElementById('memory-page').classList.add('active');
        resetMemoryGame();
    } else if (page === 'snake') {
        document.getElementById('snake-page').classList.add('active');
        resetSnakeGame();
    } else if (page === 'rps') {
        document.getElementById('rps-page').classList.add('active');
    }
}

// Tic Tac Toe Functions
function makeMove(index) {
    // Check if cell is empty and game is active
    if (gameBoard[index] !== '' || !gameActive) {
        return;
    }
    
    // Make the move
    gameBoard[index] = currentPlayer;
    updateBoard();
    
    // Check for winner
    if (checkWinner()) {
        document.getElementById('game-status').textContent = `🎉 Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    
    // Check for draw
    if (gameBoard.every(cell => cell !== '')) {
        document.getElementById('game-status').textContent = "It's a draw! 🤝";
        gameActive = false;
        return;
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('current-player').textContent = `Player: ${currentPlayer}`;
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = gameBoard[index];
    });
}

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] !== '' && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[b] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('current-player').textContent = `Player: X`;
    document.getElementById('game-status').textContent = '';
    updateBoard();
}

// Memory Game Variables
const memoryEmojis = ['🍎', '🍎', '🍊', '🍊', '🍋', '🍋', '🍌', '🍌', 
                      '🍇', '🍇', '🍓', '🍓', '🍉', '🍉', '🍒', '🍒'];
let memoryCards = [];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initMemoryGame() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    memoryCards = memoryEmojis.sort(() => Math.random() - 0.5);
    
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = '?';
        card.onclick = () => flipMemoryCard(card);
        board.appendChild(card);
    });
}

function flipMemoryCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.textContent = card.dataset.emoji;
    card.classList.add('flipped');
    
    if (firstCard === null) {
        firstCard = card;
    } else if (secondCard === null) {
        secondCard = card;
        moves++;
        document.getElementById('moves-counter').textContent = `Moves: ${moves}`;
        canFlip = false;
        
        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
            // Match found
            setTimeout(() => {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                matchedPairs++;
                firstCard = null;
                secondCard = null;
                canFlip = true;
                
                if (matchedPairs === 8) {
                    document.getElementById('memory-status').textContent = `🎉 You won in ${moves} moves!`;
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                firstCard.textContent = '?';
                secondCard.textContent = '?';
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard = null;
                secondCard = null;
                canFlip = true;
            }, 800);
        }
    }
}

function resetMemoryGame() {
    firstCard = null;
    secondCard = null;
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    document.getElementById('moves-counter').textContent = `Moves: 0`;
    document.getElementById('memory-status').textContent = '';
    initMemoryGame();
}

// Snake Game Variables
const canvas = document.getElementById('snake-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let snakeScore = 0;
let snakeGameActive = false;
let snakeGameRunning = false;
let snakeGameInterval = null;

function initSnakeGame() {
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 400;
}

function resetSnakeGame() {
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    snakeScore = 0;
    snakeGameActive = true;
    snakeGameRunning = true;
    document.getElementById('snake-score').textContent = `Score: 0`;
    document.getElementById('snake-status').textContent = '';
    
    if (snakeGameInterval) clearInterval(snakeGameInterval);
    snakeGameInterval = setInterval(updateSnakeGame, 100);
}

function updateSnakeGame() {
    if (!snakeGameActive) return;
    
    direction = nextDirection;
    
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Check collision with walls
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        endSnakeGame();
        return;
    }
    
    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endSnakeGame();
        return;
    }
    
    snake.unshift(head);
    
    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        document.getElementById('snake-score').textContent = `Score: ${snakeScore}`;
        generateFood();
    } else {
        snake.pop();
    }
    
    drawSnakeGame();
}

function generateFood() {
    let newFood;
    let collision = true;
    while (collision) {
        newFood = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        collision = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    food = newFood;
}

function drawSnakeGame() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw snake
    ctx.fillStyle = '#667eea';
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
        if (index === 0) {
            ctx.fillStyle = '#764ba2';
            ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, gridSize - 8, gridSize - 8);
        }
        ctx.fillStyle = '#667eea';
    });
    
    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
}

function endSnakeGame() {
    snakeGameActive = false;
    snakeGameRunning = false;
    if (snakeGameInterval) clearInterval(snakeGameInterval);
    document.getElementById('snake-status').textContent = `Game Over! Final Score: ${snakeScore}`;
}

document.addEventListener('keydown', function(e) {
    if (!snakeGameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = {x: 0, y: -1};
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = {x: 0, y: 1};
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = {x: -1, y: 0};
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = {x: 1, y: 0};
            e.preventDefault();
            break;
    }
});

// Rock Paper Scissors Game Variables
let rpsPlayerScore = 0;
let rpsComputerScore = 0;

function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    const choiceEmojis = {
        'rock': '🪨',
        'paper': '📄',
        'scissors': '✂️'
    };
    
    document.getElementById('player-choice').textContent = choiceEmojis[playerChoice];
    document.getElementById('computer-choice').textContent = choiceEmojis[computerChoice];
    
    let result = '';
    
    if (playerChoice === computerChoice) {
        result = "It's a Tie! 🤝";
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = 'You Win! 🎉';
        rpsPlayerScore++;
    } else {
        result = 'Computer Wins! 🤖';
        rpsComputerScore++;
    }
    
    document.getElementById('rps-score').textContent = `You: ${rpsPlayerScore} | Computer: ${rpsComputerScore}`;
    document.getElementById('rps-result').textContent = result;
}

function resetRPSGame() {
    rpsPlayerScore = 0;
    rpsComputerScore = 0;
    document.getElementById('rps-score').textContent = `You: 0 | Computer: 0`;
    document.getElementById('player-choice').textContent = '-';
    document.getElementById('computer-choice').textContent = '-';
    document.getElementById('rps-result').textContent = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    resetGame();
    initMemoryGame();
    initSnakeGame();
});
