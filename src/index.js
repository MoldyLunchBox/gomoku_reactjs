const { exit } = require('process');
const readline = require('readline');
import { getPieces, Node } from './lib/Node'
const BOARD_EMPTY_CHAR = '.'
const BOARD_SIZE = 19
const AI = 1
const HUMAN = 2
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { log } = console
const DEPTH = 3;

function createBoard(rows, cols) {
  const array = new Array(rows);
  for (let i = 0; i < rows; i++) {
    array[i] = new Array(cols).fill(BOARD_EMPTY_CHAR);
  }
  return array;
}


function inputIsValid(newPiece, board) {
  const regex = /^\d+\s+\d+$/
  if (regex.test(newPiece)) {
    const piece = { row: newPiece.split(" ")[0], col: newPiece.split(" ")[1] }
    if (board[piece.row][piece.col] == BOARD_EMPTY_CHAR)
      return true
  }
  return false
}



async function getPlayerMove(board) {
  let input = false
  var answer = {}
  while (!input) {

    answer = await new Promise((resolve) => {
      rl.question(`Place your piece: `, (answer) => {
        resolve(answer);
      });
    });
    // if (inputIsValid(answer, board))
    input = !input
  }
  answer = { row: answer.split(" ")[0], col: answer.split(" ")[1] }
  return answer
}
function preFillBoard(player, board) {
  for (let i = 0; i < player.pieces.length; i++) {
    board[player.pieces[i].row][player.pieces[i].col] = player.piece
  }
}

function memoize(func) {
  let cache = {};
  return function (...args) {
    let key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    let result = func.apply(this, args);
    cache[key] = result;
    return result;
  };
}
let memo = {};



function minimax(board, depth, alpha, beta, maximizingPlayer, tracker) {

  // depth == 0 || board.isTerminalNode
  if (depth == 0 || board.score >= 500000) {
   
    // console.log(maximizingPlayer)
    return Math.pow(board.score , (depth ? depth : 1));
  }

  //   let key = board.join(""); // Convert the board to a string to use as a hash key
  //   if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
  //     return memo[key];
  //   }

  let bestValue = maximizingPlayer ? -Infinity : Infinity;
  let i = 0
  let validMoves = board.generateMoves()
  var bestMove = ""
  while (!validMoves.isEmpty() && i < 9 ) {
    tracker.memory++
    // console.log(depth)
    let move = validMoves.dequeue();
    // if (depth == 1 && move.newPiece.y == 7 && move.newPiece.x == 13 ){
    printBoard(move.board)
    log(move.scores)
    log("\n")
    log(move.score)
    // let value = minimax(move, depth - 1, alpha, beta, !maximizingPlayer, tracker);
    // if (depth == DEPTH)
    // log(value)
    // if (depth == DEPTH)  // we make sure we capture the move with  the best score so we can return it 
    //   bestMove = value > bestValue ? move : bestMove
    // bestValue = maximizingPlayer ? Math.max(bestValue, value) : Math.min(bestValue, value);
    // if (maximizingPlayer)
    //   alpha = Math.max(alpha, bestValue);
    // else
    //   beta = Math.min(beta, bestValue);
    // if (alpha >= beta) {
    //   // console.log(" alpha", alpha, "beta", beta, "maximizing", maximizingPlayer, "bestValue", bestValue)
    //   break;
    // }
    i++
  }
  // exit()
  if (depth == DEPTH) {
    console.log(bestMove.scores)
    console.log(bestValue)
    console.log(bestMove.score)

    return bestMove.board
  }
  //   memo[key] = bestValue; // Store the evaluation result for this board position
  return bestValue;
}


class Tracker {
  constructor() {
    this.memory = 0
    this.player = 0
  }
}




function setPiece(y, x, player, board) {
  board[player][x] |= 1 << y;
  return board
}

// Function to get the state of the board at the given position
function getPiece(x, y, board) {
  const player1 = board[0][y] & (1 << x);
  const player2 = board[1][y] & (1 << x);

  if (player1 !== 0) {
    return 1; // Player 1's stone
  } else if (player2 !== 0) {
    return 2; // Player 2's stone
  } else {
    return 0; // Empty position
  }
}

function printBoard(board) {
  console.log("\n")
  for (let i = 0; i < BOARD_SIZE; i++) {
    let line = ''
    for (let j = 0; j < BOARD_SIZE; j++) {
      line += getPiece(i, j, board) + ' '
    }
    log(line)
  }
}


function calcBoundries(board) {
  let topLeft = {y: BOARD_SIZE, x: BOARD_SIZE}
  let bottomRight = {y:0, x:0}

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (getPiece(i, j, board)){
        topLeft.y = Math.min(i , topLeft.y)
        topLeft.x = Math.min(j , topLeft.x)
        bottomRight.y = Math.max(i , bottomRight.y)
        bottomRight.x = Math.max(j , bottomRight.x)
      }
    }
  }
  topLeft.y = Math.max(0 , topLeft.y - 3)
  topLeft.x = Math.max(0 , topLeft.x - 3)
  bottomRight.y = Math.min(BOARD_SIZE , bottomRight.y + 3)
  bottomRight.x = Math.min(BOARD_SIZE , bottomRight.x + 3)
  return {topLeft, bottomRight}
}



async function main() {

  // Create a bit board for each player
  let board = [
    new Array(19).fill(0), // Player 1's bit board
    new Array(19).fill(0), // Player 2's bit board
  ];

  // Function to set a stone at the given position for the specified player


  // Set a stone for Player 1 at position (2, 1)
  const x = 2;
  const y = 1;
  const player = 0;
  const player2 = 1;


  setPiece(10, 10, 1, board)
  setPiece(11, 10, 0, board)
  setPiece(9, 11, 1, board)
  setPiece(10, 9, 0, board)
  // setPiece(8, 12, 1, board)

  // setPiece(4, 0, 0, board)
  // setPiece(4, 2, 1, board)
  // setPiece(5, 0, 0, board)
  // setPiece(5, 1, 1, board)
  // setPiece(6, 0, 0, board)



  // setPiece(2, 2, 1, board);
  // setPiece(2, 3, 1, board);

  // setPiece(1, 3, 0, board);
  // setPiece(0, 3, 0, board);
  // setPiece(0, 2, 0, board);
  // setPiece(0, 1, 0, board);
  // setPiece(1, 1, 0, board);
  // setPiece(2, 1, 0, board);
  // setPiece(2, 2, 0, board);
  // setPiece(2, 3, 0, board);

  // setPiece(4, 3, 1, board);
  // setPiece(4, 0, 1, board);

  // setPiece(3, 3, 1, board);
  // setPiece(2, 2, 0, board);
  // setPiece(4, 2, 1, board);
  // setPiece(3, 1, 0, board);

  let tracker = new Tracker()

  const alpha = Number.NEGATIVE_INFINITY;
  const beta = Number.POSITIVE_INFINITY;

  const isMaximizingPlayer = true;
  let time = 0
  let HumanTurn = true
  let node = null
  while (true) {
    log("time", time)
    log(board)
    printBoard(board)
    console.log("memory", tracker.memory)
    if (HumanTurn) {
      var newMove = await getPlayerMove(board)
      setPiece(newMove.row, newMove.col, 1, board)
      log("aaaaaaaa", newMove)
      console.log("oooooooooooooo", calcBoundries(board))
      node = new Node(board, HUMAN, { y: newMove.row, x: newMove.col }, calcBoundries(board) )
    }
    else {
      const start = process.hrtime();
      board = minimax(node, DEPTH, alpha, beta, isMaximizingPlayer, tracker);
      time = process.hrtime(start);
    }
    log("---------------------")
    HumanTurn = !HumanTurn
  }
}
main()