// Create a new game instance and start it
const ticTacTocGame = new TicTacToeGame();
ticTacTocGame.start();

// Main "Game" object (controls turns, game state, UI status, reset)
function TicTacToeGame() {
  // Board + players
  const board = new Board();
  const humanPlayer = new HumanPlayer(board);
  const computerPlayer = new ComputerPlayer(board);

  // Turn counter: even = X (human), odd = O (computer)
  let turn = 0;

  // Stops the game when someone wins or it’s a draw
  let gameOver = false;

  // Observes DOM changes on the cells (when X/O appears)
  let observer = null;

  // Public method: start the game
  this.start = function () {
    // Watch for changes inside each cell so we can trigger the next turn
    const config = { childList: true, subtree: true };

    observer = new MutationObserver(() => takeTurn());
    board.positions.forEach((el) => observer.observe(el, config));

    // Reset button should be wired inside the game scope
    document.getElementById("reset").addEventListener("click", resetGame);

    // Start the first turn immediately
    takeTurn();
  };

  // Controls the game flow: check end conditions, then let current player play
  function takeTurn() {
    if (gameOver) return;

    // 1) Check winner
    const winner = board.CheckForWinner();
    if (winner) {
      document.getElementById("status").innerText = `${winner} wins!`;
      gameOver = true;
      return;
    }

    // 2) Check draw (all cells filled, no winner)
    const isDraw = board.positions.every((p) => p.innerText !== "");
    if (isDraw) {
      document.getElementById("status").innerText = "Draw!";
      gameOver = true;
      return;
    }

    // 3) Otherwise, play next turn
    if (turn % 2 === 0) {
      document.getElementById("status").innerText = "X’s turn";
      humanPlayer.takeTurn();
    } else {
      document.getElementById("status").innerText = "O’s turn";
      computerPlayer.takeTurn();
    }

    // Advance to next player
    turn++;
  }

  // Clears the board and restarts the game
  function resetGame() {
    gameOver = false;
    turn = 0;

    // Clear X/O text and remove winner highlight
    board.positions.forEach((p) => {
     p.innerText = "";
p.classList.remove("winner", "x", "o");
    });

    document.getElementById("status").innerText = "X’s turn";
    takeTurn();
  }
}

// Board object: stores positions (cells) + win checking logic
function Board() {
  // Grab all cells (your HTML uses <div class="col">)
  this.positions = Array.from(document.querySelectorAll(".col"));

  // Returns "X", "O" or null (no winner yet)
  this.CheckForWinner = function () {
    let winner = null;

    // All possible winning lines (rows, columns, diagonals)
    const WinningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    const positions = this.positions;

    // Check each line and see if it has same non-empty symbol
    WinningCombinations.forEach((combo) => {
      const a = positions[combo[0]].innerText;
      const b = positions[combo[1]].innerText;
      const c = positions[combo[2]].innerText;

      const isWinningCombo = a !== "" && a === b && b === c;

      if (isWinningCombo) {
        winner = a; // "X" or "O"

        // Highlight the winning cells
        combo.forEach((index) => positions[index].classList.add("winner"));
      }
    });

    return winner;
  };
}

// Human player: waits for a click and writes "X"
function HumanPlayer(board) {
    
  // Enable clicking on all cells for the human turn
  this.takeTurn = function () {
    board.positions.forEach((el) =>
      el.addEventListener("click", handleTurnTaken)
    );
  };

  // On click: place X, then remove listeners so human can’t play twice
  function handleTurnTaken(event) {
    // Prevent overwriting already-filled cells
    if (event.target.innerText !== "") return;

    event.target.innerText = 'X';
event.target.classList.add('x');

    // Disable clicks until the next human turn
    board.positions.forEach((el) =>
      el.removeEventListener("click", handleTurnTaken)
    );
  }
}

// Computer player: picks a random empty cell and writes "O"
function ComputerPlayer(board) {
  this.takeTurn = function () {
    const available = board.positions.filter((p) => p.innerText === "");
    if (available.length === 0) return;

    const move = Math.floor(Math.random() * available.length);
    available[move].innerText = 'O';
    available[move].classList.add('o');
  };
}



