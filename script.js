const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameOver = false;

// 🧩 Render the board
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    cellEl.textContent = cell;
    cellEl.addEventListener("click", () => makeMove(i));
    boardElement.appendChild(cellEl);
  });
}

// 🧍 Human makes a move
function makeMove(index) {
  if (board[index] === "" && !gameOver) {
    board[index] = human;
    renderBoard();
    if (checkWinner(board, human)) {
      statusElement.textContent = "You win! 🎉";
      gameOver = true;
      return;
    }
    if (isDraw(board)) {
      statusElement.textContent = "It's a draw!";
      gameOver = true;
      return;
    }

    statusElement.textContent = "AI's turn...";
    setTimeout(aiMove, 500);
  }
}

// 🤖 AI chooses move based on difficulty
function aiMove() {
  let difficulty = difficultySelect.value;
  let move;

  if (difficulty === "easy") {
    move = easyMove();
  } else if (difficulty === "medium") {
    move = mediumMove();
  } else {
    move = hardMove();
  }

  board[move] = ai;
  renderBoard();

  if (checkWinner(board, ai)) {
    statusElement.textContent = "AI wins! 🤖";
    gameOver = true;
    return;
  }

  if (isDraw(board)) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  statusElement.textContent = "Your turn!";
}

// 🎯 Easy mode (random move)
function easyMove() {
  const empty = board.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// 😎 Medium mode (50% random, 50% smart)
function mediumMove() {
  if (Math.random() < 0.5) return easyMove();
  return hardMove();
}

// 💪 Hard mode (unbeatable using minimax)
function hardMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// 🧮 Minimax algorithm
function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, ai)) return 1;
  if (checkWinner(board, human)) return -1;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = ai;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = human;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// 🏆 Check winner
function checkWinner(b, player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(p => p.every(i => b[i] === player));
}

// 😐 Draw condition
function isDraw(b) {
  return b.every(cell => cell !== "");
}

// 🔁 Restart game
restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusElement.textContent = "Your turn!";
  renderBoard();
});

renderBoard();
