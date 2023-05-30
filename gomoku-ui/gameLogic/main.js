
import { getPieces, Node } from './lib/Node'
const BOARD_EMPTY_CHAR = '.'
const BOARD_SIZE = 19
const AI = 1
const HUMAN = 2

const { log } = console
const DEPTH = 2;

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



function minimax(board, depth, alpha, beta, maximizingPlayer) {
  // depth == 0 || board.isTerminalNode
  if (depth == 0) {
    return board.score;
  }

  //   let key = board.join(""); // Convert the board to a string to use as a hash key
  //   if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
  //     return memo[key];
  //   }

  let bestValue = maximizingPlayer ? -Infinity : Infinity;
  let i = 0
  let validMoves = board.generateMoves()
  let bestMove = ""
  while (!validMoves.isEmpty()) {
    let move = validMoves.dequeue();
    // printBoard(move.board)
    // log(move.scores)
    // log("\n")
    // log(board.score)
    if (depth == 1) {
      printBoard(move.board)
      log(move.scores)
      log("\n")
      log(board.score)
    }
    let value = minimax(move, depth - 1, alpha, beta, !maximizingPlayer);
    if (depth == DEPTH)  // prior to return to main, we make sure we capture which move had the best score so we can return it {
      bestMove = value > bestValue ? move.board : bestMove
    bestValue = maximizingPlayer ? Math.max(bestValue, value) : Math.min(bestValue, value);
    if (maximizingPlayer)
      alpha = Math.max(alpha, bestValue);
    else
      beta = Math.min(beta, bestValue);
    if (alpha >= beta)
      break;
    // i++
  }
  // exit()
  if (depth == DEPTH)
    return bestMove
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
  let topLeft = { y: BOARD_SIZE, x: BOARD_SIZE }
  let bottomRight = { y: 0, x: 0 }

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (getPiece(i, j, board)) {
        topLeft.y = Math.min(i, topLeft.y)
        topLeft.x = Math.min(j, topLeft.x)
        bottomRight.y = Math.max(i, bottomRight.y)
        bottomRight.x = Math.max(j, bottomRight.x)
      }
    }
  }
  topLeft.y = Math.max(0, topLeft.y - 3)
  topLeft.x = Math.max(0, topLeft.x - 3)
  bottomRight.y = Math.min(BOARD_SIZE, bottomRight.y + 3)
  bottomRight.x = Math.min(BOARD_SIZE, bottomRight.x + 3)
  return { topLeft, bottomRight }
}



export async function counterMove(board) {


  // const ret = minimax(node, DEPTH, alpha, beta, isMaximizingPlayer );
  return new Promise((resolve, reject) => {

    const worker = new Worker('./worker.js');
    log("here")
    // Handle messages from the worker
    worker.onmessage = function (event) {
      const result = event.data;
      log("message from worker", result)
      // Process the result from the worker
      // ...
      resolve(result)
      worker.terminate
    };

    // Call the worker with the task
    worker.postMessage({
      board: board
    });

  })
}
