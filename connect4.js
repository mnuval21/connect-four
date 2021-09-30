//Setting the cells 7 wide and 6 high
const WIDTH = 7;
const HEIGHT = 6;

//Active player is set to player 1
let currPlayer = 1; 
//Where we will store the array of cells (board[y][x])
let board = [];

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //set "board" to empty HEIGHT x WIDTH matrix array
  for (let x = 0; x < HEIGHT; x++) {
    board.push(Array.from({ length: WIDTH }));
  }
}



function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // create the top of the columns.  Make it clickable.
  const top = document.createElement("tr");
  // giving the top row an ID of "column-top"
  top.setAttribute("id", "column-top");
  // listen for clicks on the top row and call the handleClick function
  top.addEventListener("click", handleClick);

  // create 7 <td></td> elements in the top row 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    // give each cell an ID of x
    headCell.setAttribute("id", x);
    //append each cell to the top row
    top.append(headCell);
  }
  // append all cells to the board
  htmlBoard.append(top);

  //  building the main part of the board
  // create 6 rows
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    //in each row, create 7 cells with an ID set to {y}-{x}.  The ID will be used to determine if the cell is open or not.
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      //append each cell into the row
      row.append(cell);
    }
    //append each row onto the board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //y=5; while y is greater than or equal to 0; decrease y by 1
  for( let y = HEIGHT - 1; y >= 0; y--){
    //if there is nothing on the board
    if (!board[y][x]) {
      //return y
      return y;
    }
  }
  
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const piece = document.createElement('div');
  // give it a class "piece"
  piece.classList.add('piece');
  // give it a class "p.{whichever current player is set to}" - this will determine the color of our piece.
  piece.classList.add(`p${currPlayer}`);
  // set top to -50*(y+2);
  piece.style.top = -50 * (y + 2);

  //get the ID of our available cell
  const openSpot = document.getElementById(`${y}-${x}`);
  //append the piece onto the board
  openSpot.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  //alert(msg);

  const modal = document.querySelector('.modal');
  const closeButton = document.querySelector('.close-button');
  const message = document.getElementById('msg');
  
  message.innerHTML = (msg);
  modal.classList.add("show-modal");
  
  closeButton.addEventListener("click", function(){
    modal.classList.remove("show-modal");
    window.location.reload();
  });
  
   
}




/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} Wins!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame("Tie!")
  }

  // switch players
  // switch currPlayer 1 <-> 2
  //if (currPlayer !== 1) {
    //currPlayer = 1;
  //}
  currPlayer = currPlayer === 1 ? 2 : 1;

  const player = document.getElementById('player');
  player.innerHTML = "Player " + currPlayer;


}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // go through each cell to check if there is piece there

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
