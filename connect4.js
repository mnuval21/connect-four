//table rows and columns
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let x = 0; x < HEIGHT; x++) {
    board.push(Array.from({ length: WIDTH }));
  }
}


function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const board = document.getElementById('board');

  // create the top of the columns.  Make it clickable.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top);

  // main part of the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
  console.log('appending board onto the DOM in makeHtmlBoard()')
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  console.log('finding spot for column x(width) in findSpotForCol(x)')
  for( let y = HEIGHT - 1; y >= 0; y--){
    if (!board[y][x]) {
      return y;
    }
  }
  
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const openSpot = document.getElementById(`${y}-${x}`);
  openSpot.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  //alert(msg);
  //need to pass in (msg) in the modal alert
  //doesn't work yet
  const modal = document.querySelector('.modal');
  const closeButton = document.querySelector('.close-button');
  const message = document.getElementById('msg');
  
  message.innerHTML = (msg);
  modal.classList.add("show-modal");
  
  //function toggleModal() {
    //modal.classList.toggle("show-modal");
  //}
  //function windowOnClick(event) {
    //if(event.target === modal){
      //toggleModal();
    //}
  //}
  //window.addEventListener("click", windowOnClick);
  closeButton.addEventListener("click", function(){
    modal.classList.remove("show-modal");
    window.location.reload();
  });
  
   
}




//trigger.addEventListener("click", toggleModal);
//closeButton.addEventListener("click", toggleModal);
//window.addEventListener("click", windowOnClick);



/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
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

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
