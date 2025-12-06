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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    resetGame();
});
