/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class ConnectFour {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height; // height of the game board
    this.width = width; // width of the game board
    this.currPlayer = p1; // active player: 1 or 2
    this.makeBoard(); // create in-JS board structure, board = array of rows, each row is array of cells  (board[y][x])
    this.makeHtmlBoard(); // create HTML table and column tops that function as game board.
    this.gameOver = false;
  }
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      const boardRow = [];
      for (let x = 0; x < this.width; x++) {
        boardRow.push(0);
      }
      this.board.push(boardRow);
    }
  }

  makeHtmlBoard() {
    // variable that identifies the HTML table as the game board
    const htmlBoard = document.getElementById("board");

    // make clickable column row on top of the game board.
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);

    // makes each cell for the column row.
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // makes a table in HTML that functions as the game board board
    // each cell is given an id based on its x and y coordinate positioning.
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  // boolean that finds the first empty spot in the column.
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (!y) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    // The following code is for win conditions.

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // for a horizontal win, the y values will be the same for each piece.
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        // for a vertical win, the x values will be the same for each piece.
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        // for a diagonal right win, the y and x values will be increment by 1 with each piece.
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        // for a diagonal left win, as the y values increment for each piece, the x values will decrease.
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // returns true if a player meets any win condition.
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}
class Player {
  constructor(color) {
    this.color = color;
  }
}
document.getElementById("start-game").addEventListener("click", () => {
  let p1 = new Player(document.getElementById("p1-color").value);
  let p2 = new Player(document.getElementById("p2-color").value);
  new ConnectFour(p1, p2);
});
