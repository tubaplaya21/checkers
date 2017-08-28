// checkers.js

/** The state of the game */
var state = {
  over: false,
  turn: 'b',
  board: [
    [null,'w',null,'w',null,'w',null,'w',null,'w'],
    ['w',null,'w',null,'w',null,'w',null,'w',null],
    [null,'w',null,'w',null,'w',null,'w',null,'w'],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    ['b',null,'b',null,'b',null,'b',null,'b',null],
    [null,'b',null,'b',null,'b',null,'b',null,'b'],
    ['b',null,'b',null,'b',null,'b',null,'b',null]
  ]
}

/** @function getLegalMoves
  * returns a list of legal moves for the specified
  * piece to make.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {Array} the legal moves as an array of objects.
  */
function getLegalMoves(piece, x, y) {
  var moves = [];
  switch(piece) {
    case 'b': // black can only move down the board diagonally
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'w':  // white can only move up the board diagonally
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
  }
  return moves;
}

/** @function checkSlide
  * A helper function to check if a slide move is legal.
  * If it is, it is added to the moves array.
  * @param {Array} moves - the list of legal moves
  * @param {integer} x - the x position of the movement
  * @param {integer} y - the y position of the movement
  */
function checkSlide(moves, x, y) {
  // Check square is on grid
  if(x < 0 || x > 9 || y < 0 || y > 9) return;
  // check square is unoccupied
  if(state.board[y][x]) return;
  // legal move!  Add it to the move list
  moves.push({type: 'slide', x: x, y: y});
}

/** @function copyJumps
  * A helper function to clone a jumps object
  * @param {Object} jumps - the jumps to clone
  * @returns The cloned jump object
  */
function copyJumps(jumps) {
  // Use Array.prototype.slice() to create a copy
  // of the landings and captures array.
  var newJumps = {
    landings: jumps.landings.slice(),
    captures: jumps.captures.slice()
  }
  return newJumps;
}

/** @function checkJump
  * A recursive helper function to determine legal jumps
  * and add them to the moves array
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} x - the current x position of the piece
  * @param {integer} y - the current y position of the peice
  */
function checkJump(moves, jumps, piece, x, y) {
  switch(piece) {
    case 'b': // black can only move down the board diagonally
      checkLanding(moves, copyJumps(jumps), x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), x+1, y+1, x+2, y+2);
      break;
    case 'w':  // white can only move up the board diagonally
      checkLanding(moves, copyJumps(jumps), x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), x+1, y-1, x+2, y-2);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkLanding(moves, copyJumps(jumps), x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), x+1, y+1, x+2, y+2);
      checkLanding(moves, copyJumps(jumps), x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), x+1, y-1, x+2, y-2);
      break;
  }
}

/** @function checkLanding
  * A helper function to determine if a landing is legal,
  * if so, it adds the jump sequence to the moves list
  * and recursively seeks additional jump opportunities.
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} cx - the 'capture' x position the piece is jumping over
  * @param {integer} cy - the 'capture' y position of the peice is jumping over
  * @param {integer} lx - the 'landing' x position the piece is jumping onto
  * @param {integer} ly - the 'landing' y position of the peice is jumping onto
  */
function checkLanding(moves, jumps, piece, cx, cy, lx, ly) {
  // Check landing square is on grid
  if(lx < 0 || lx > 9 || ly < 0 || ly > 9) return;
  // Check landing square is unoccupied
  if(state.board[ly][lx]) return;
  // Check capture square is occuped by opponent
  if(piece == 'b' || 'bk' && state.board[cy][cx] != 'w' || state.board[cy][cx] != 'wk') return;
  if(piece == 'w' || 'wk' && state.board[cy][cx] != 'b' || state.board[cy][cx] != 'bk') return;
  // legal jump! add it to the moves list
  jumps.captures.push({x: cx, y: cy});
  jumps.landings.push({x: lx, y: ly});
  moves.push({
    type: 'jump',
    captures: jumps.captures.slice(),
    landings: jumps.landings.slice()
  });
  // check for further jump opportunities
  checkJump(moves, jumps, piece, lx, ly);
}

/** @function ApplyMove
  * A function to apply the selected move to the game
  * @param {object} move - the move to apply.
  */
function applyMove(x, y, move) {
  // TODO: Apply the move
  if(move.type === "slide"){
    state.board[move.y][move.x] = state.board[y][x];
    state.board[y][x] = null;
  }
  else{
    move.captures.forEach(function(square){
      state.board[square.y][square.x] = null;
    });
    var index = move.landings.length - 1;
    state.board[move.landings[index].y][move.landings[index].x] = state.board[y][x];
    state.board[y][x] = null;
  }
}

// TODO: Check for victory
function checkForVictory(){
  var wCount = 0;
  var bCount = 0;
  for(y = 0; y < 10; y++){
    for(x = 0; x < 10; x++){
      if(state.board[y][x] === "w" || state.board[y][x] === "wk")
        wCount++;
      if(state.board[y][x] === "b" || state.board[y][x] === "bk")
        wCount++;
    }
  }
  if(wCount == 0){
    state.over = true;
    return 'black wins';
  }
  if(bCount == 0){
    state.over = true;
    return 'white wins';
  }
}
// TODO: Start the next turn
function nexTurn(){
  if(state.turn == 'b') state.turn = 'w';
  else state.turn = 'b';
}

function printBoard(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'red';
  ctx.fillRect(10, 30, 20, 20);
  ctx.fillRect(10, 70, 20, 20);
  ctx.fillRect(10, 110, 20, 20);
  ctx.fillRect(10, 150, 20, 20);
  ctx.fillRect(30, 10, 20, 20);
  ctx.fillRect(30, 50, 20, 20);
  ctx.fillRect(30, 90, 20, 20);
  ctx.fillRect(30, 130, 20, 20);
  ctx.fillRect(50, 30, 20, 20);
  ctx.fillRect(50, 70, 20, 20);
  ctx.fillRect(50, 110, 20, 20);
  ctx.fillRect(50, 150, 20, 20);
  ctx.fillRect(70, 10, 20, 20);
  ctx.fillRect(70, 50, 20, 20);
  ctx.fillRect(70, 90, 20, 20);
  ctx.fillRect(70, 130, 20, 20);
  ctx.fillRect(90, 30, 20, 20);
  ctx.fillRect(90, 70, 20, 20);
  ctx.fillRect(90, 110, 20, 20);
  ctx.fillRect(90, 150, 20, 20);
  ctx.fillRect(110, 10, 20, 20);
  ctx.fillRect(110, 50, 20, 20);
  ctx.fillRect(110, 90, 20, 20);
  ctx.fillRect(110, 130, 20, 20);
  ctx.fillRect(130, 30, 20, 20);
  ctx.fillRect(130, 70, 20, 20);
  ctx.fillRect(130, 110, 20, 20);
  ctx.fillRect(130, 150, 20, 20);
  ctx.fillRect(150, 10, 20, 20);
  ctx.fillRect(150, 50, 20, 20);
  ctx.fillRect(150, 90, 20, 20);
  ctx.fillRect(150, 130, 20, 20);
}

function main(){

}
