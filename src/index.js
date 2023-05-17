const { exit } = require('process');
const readline = require('readline');
import { getPieces, Node } from './lib/Node'
const BOARD_EMPTY_CHAR = '.'
const BOARD_SIZE = 7
const AI = 0
const HUMAN = 1
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const { log } = console
const DEPTH = 4;

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
function followDirection(currentPiece, direction, playerPieces) {
    let i = 0
    let moveExists = true
    let pathElement = { row: currentPiece.row + direction.y, col: currentPiece.col + direction.x }
    while (i < 5 && moveExists) {
        pathElement = { row: pathElement.row + direction.y, col: pathElement.col + direction.x }
        moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
        i++
    }
    if (i == 5)
        return true
    return false

}
function winnerCheck(player, board) {
    const allMoves = [

        { direction: "up", y: -1, x: 0 }, { direction: "down", y: 1, x: 0 }, { direction: "left", y: 0, x: -1 }, { direction: "right", y: 0, x: 1 },
        { direction: "diagUL", y: -1, x: -1 }, { direction: "diagUR", y: -1, x: 1 }, { direction: "diagDL", y: 1, x: -1 }, { direction: "diagDR", y: 1, x: 1 }
    ]

    // const allMoves = [
    //     "up", "down", "left", "right",
    //     "diagUL", "diagUR", "diagDL", "diagDR"
    // ]
    for (let i = 0; i < player.pieces.length; i++) {
        const availableDirections = JSON.parse(JSON.stringify(allMoves));
        while (availableDirections.length) {
            const direction = availableDirections.shift()
            const currentPiece = player.pieces[i]

            if (followDirection(currentPiece, direction, player.pieces)) {
                log("winner", player.name)
                exit()
            }
        }
    }
}

async function getPlayerMove(player, board, winner) {
    let input = false
    var answer = {}
    while (!input) {

        answer = await new Promise((resolve) => {
            rl.question(`${player.name} Enter a value: `, (answer) => {
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

// function minimax(position, depth, aiPlayer, alpha, beta, tracker) {
    
//     log("aaaaa")
//     var bestMove = null
//     if (depth === 0 || (aiPlayer && position.longestRow("X") == 5) || (!aiPlayer && position.longestRow("O") == 5)) {
//         if (aiPlayer)
//             return ((position.longestRow("X") * 10) + position.connectedPieces("X") )

//         else
//             return ((position.longestRow("O") * 10) + position.connectedPieces("O") )
            
            
//         }
        
//     let key = position.board.join("");
//     if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
//         log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
//         return memo[key];
//       }
//     let bestValue = aiPlayer ? -Infinity : Infinity;

//     const subPositions = aiPlayer ? position.subPosition("X") : position.subPosition("O")
// let i = 0
//     while (!subPositions.isEmpty()) {
//         const move = subPositions.dequeue()
//         // tracker.memory++
//         // var  value = minimax(move, depth - 1, !aiPlayer, alpha, beta, tracker);
//         //     bestMove = value > bestValue ? move : bestMove
//         // bestValue = aiPlayer ? Math.max(bestValue, value) : Math.max(bestValue, value);

//         // if (aiPlayer) 
//         //     alpha = Math.max(alpha, value);
//         // else 
//         //     beta = Math.min(beta, value);
        
//         // if (beta <= alpha)
//         //     break;
        
//         if (depth == DEPTH && i < 5){
//             printBoard(move.board)
//             // log('best move board', bestMove)
//             log('score', move.score, "\n\n-----------------\n\n")
//         //     log("value", value, "\nbestvalue", bestValue,"\nalpha",alpha,"\nbeta", beta)
//         //     // console.log("X",((move.longestRow("X") * 10) + move.connectedPieces("X")) )
//         //     // log("O",  ((move.longestRow("O") * 10) + move.connectedPieces("O")))
//         //     log("total",  (move.longestRow("X") * 10) + move.connectedPieces("X") + move.blockEnemy("O"))
//         }
//         i++
//     }
//     // if (depth == DEPTH-1)
//     exit()
//     memo[key] = bestValue
//     if (depth == DEPTH) {
//         return bestMove
//     }
//     return bestValue;

// }



function minimax(board, depth, alpha, beta, maximizingPlayer) {
    // depth == 0 || board.isTerminalNode
  if (depth == 0 ) {
    return board.score;
  }

//   let key = board.join(""); // Convert the board to a string to use as a hash key
//   if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
//     return memo[key];
//   }

  let bestValue = maximizingPlayer ? -Infinity : Infinity;
  let validMoves = board.generateMoves();
let move = ""
  while (!validMoves.isEmpty()) {
     move = validMoves.dequeue();
    let newBoard = makeMove(board, move);

    let value = minimax(newBoard, depth - 1, alpha, beta, !maximizingPlayer);
    bestValue = maximizingPlayer ? Math.max(bestValue, value) : Math.min(bestValue, value);

    if (maximizingPlayer) {
      alpha = Math.max(alpha, bestValue);
    } else {
      beta = Math.min(beta, bestValue);
    }

    if (alpha >= beta) {
      break;
    }
  }
if (depth == 5)
return move
//   memo[key] = bestValue; // Store the evaluation result for this board position
  return bestValue;
}


class Tracker {
    constructor() {
        this.memory = 0
        this.player = 0
    }
}




function setPiece(x, y, player, board) {
    board[player][y] |= 1 << x;
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
    for (let i = 0; i < BOARD_SIZE; i++) {
        let line = ''
        for(let j = 0; j < BOARD_SIZE; j++){
            line += getPiece(i, j,board ) + ' '
        }
        log(line)
    }
}



function calculateScores(board) {
  let maxHorizontal = 0;
  let maxVertical = 0;
  let maxDiagonal = 0;

  // Calculate scores for horizontal, vertical, and diagonal lines
  for (let i = 0; i < BOARD_SIZE; i++) {
    let consecutiveHorizontal = 0;
    let consecutiveVertical = 0;
    let consecutiveDiagonal1 = 0; // Top-left to bottom-right diagonal
    let consecutiveDiagonal2 = 0; // Top-right to bottom-left diagonal

    for (let j = 0; j < BOARD_SIZE; j++) {
      // Calculate horizontal score
      consecutiveHorizontal = (getPiece(i, j, board) === 1) ? consecutiveHorizontal + 1 : 0;
      maxHorizontal = Math.max(maxHorizontal, consecutiveHorizontal);

      // Calculate vertical score (only in the first iteration)
      if (j === 0) {
        consecutiveVertical = (getPiece(j, i, board) === 1) ? 1 : 0;
      } else {
        consecutiveVertical = (getPiece(j, i, board) === 1) ? consecutiveVertical + 1 : 0;
      }
      maxVertical = Math.max(maxVertical, consecutiveVertical);

      // Calculate diagonal score (top-left to bottom-right)
      if (i + j < BOARD_SIZE) {
        consecutiveDiagonal1 = (getPiece(j, i + j, board) === 1) ? consecutiveDiagonal1 + 1 : 0;
        maxDiagonal = Math.max(maxDiagonal, consecutiveDiagonal1);
      }

      // Calculate diagonal score (top-right to bottom-left)
      if (i - j >= 0) {
        consecutiveDiagonal2 = (getPiece(j, i - j, board) === 1) ? consecutiveDiagonal2 + 1 : 0;
        maxDiagonal = Math.max(maxDiagonal, consecutiveDiagonal2);
      }
    }
  }

  return {
    maxHorizontal,
    maxVertical,
    maxDiagonal
  };
}

function calculateScores2(board) {
  let maxHorizontal = 0;
  let maxVertical = 0;
  let maxDiagonal = 0;

  // Calculate scores for horizontal, vertical, and diagonal lines
  for (let i = 0; i < BOARD_SIZE; i++) {
    let consecutiveHorizontal = 0;
    let consecutiveVertical = 0;
    let consecutiveDiagonal = 0;

    for (let j = 0; j < BOARD_SIZE; j++) {
      // Calculate horizontal score
      consecutiveHorizontal = (getPiece(i, j, board) === 1) ? consecutiveHorizontal + 1 : 0;
      maxHorizontal = Math.max(maxHorizontal, consecutiveHorizontal);

      // Calculate vertical score
      consecutiveVertical = (getPiece(j, i, board) === 1) ? consecutiveVertical + 1 : 0;
      maxVertical = Math.max(maxVertical, consecutiveVertical);

      // Calculate diagonal score (top-left to bottom-right)
      if (i + j < BOARD_SIZE) {
        consecutiveDiagonal = (getPiece(j, i + j, board) === 1) ? consecutiveDiagonal + 1 : 0;
        maxDiagonal = Math.max(maxDiagonal, consecutiveDiagonal);
      }

      // Calculate diagonal score (top-right to bottom-left)
      if (i - j >= 0) {
        consecutiveDiagonal = (getPiece(j, i - j, board) === 1) ? consecutiveDiagonal + 1 : 0;
        maxDiagonal = Math.max(maxDiagonal, consecutiveDiagonal);
      }
    }
  }

  return {
    maxHorizontal,
    maxVertical,
    maxDiagonal
  };
}



async function main() {

// Create a bit board for each player
const board = [
    new Array(19).fill(0), // Player 1's bit board
    new Array(19).fill(0), // Player 2's bit board
  ];
  
  // Function to set a stone at the given position for the specified player

  
  // Set a stone for Player 1 at position (2, 1)
  const x = 2;
  const y = 1;
  const player = 0;
  const player2 = 1;

  setPiece(2, 1, AI, board);
  setPiece(2, 2, AI, board);
  setPiece(2, 3, AI, board);
  setPiece(2, 4, AI, board);
  setPiece(2, 5, AI, board);
  setPiece(3, 1, AI, board);
  setPiece(3, 4, AI, board);
  
  setPiece(4, 1, AI, board);
  
  setPiece(5, 1, AI, board);
  log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
  log(board)
  console.log(calculateScores2(board))
  const node = new Node(board, AI, null)
  const moves = node.generateMoves(AI)
  while (!moves.isEmpty()){
    const move = moves.dequeue()
    printBoard(move.board)
    log(move.score)
    // log(calculateScores2(move))
    log("\n")
  }

    // board = setPiece(board, 2, 3, 2)
    // let board = 0
    // board = setPiece(board, 0, 0, 2)
    // log(getPiece(board, 0, 0))

    // log(getPiece(board, 0, 1))
    // // board = setPiece(board, 0, 1, 2)
    // // board = setPiece(board, 0, 2, 2)
    // let tracker = new Tracker()
    // const player1 = {
    //     name: 'player1',
    //     piece: 'O',
    //     wins: 0,
    //     pieces: [
    //         { row: 2, col: 3 },
    //         { row: 0, col: 0 },
    //         { row: 0, col: 1 },
    //         { row: 0, col: 2 },

    //     ],
    // };

    // const player2 = {
    //     name: 'player2',
    //     piece: 'X',
    //     wins: 0,
    //     pieces: [
    //         { row: 2, col: 1 },
    //         { row: 2, col: 0 },
    //         { row: 2, col: 2 },
    //         { row: 2, col: 4 },
    //         { row: 1, col: 1 },
    //         { row: 3, col: 1 },
    //         { row: 4, col: 1 },
    //         { row: 3, col: 2 },
    //         { row: 3, col: 0 },



    //     ],
    // };
    // let board = createBoard(10, 10)
    // preFillBoard(player2, board)
    // preFillBoard(player1, board)

    const alpha = Number.NEGATIVE_INFINITY;
    const beta = Number.POSITIVE_INFINITY;

    const isMaximizingPlayer = true;

    let userInput = ""
    let isPlayer1Turn = true
    var winner = false
    let time = 0
    const HumanTurn = true 
    while (true) {
        log("time", time)
        // console.log(tracker.memory, tracker.player, tracker.memory + tracker.player)
        if (HumanTurn) {

            var newMove = await getPlayerMove(board)
            board[newMove.row][newMove.col] = currentPlayer.piece
            setPiece(x: newMove.)
        }
        else {
            const node = new Node(board, AI, null)

            const start = process.hrtime();
            board = minimax(node, DEPTH, isMaximizingPlayer, alpha, beta);
            time = process.hrtime(start);
        }
        log("---------------------")
        HumanTurn = !HumanTurn
    }
}
main()