const { exit } = require('process');
const readline = require('readline');
import { getPieces, Node } from './lib/Node'
const BOARD_EMPTY_CHAR = '.'

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
function printBoard(board) {
    for (let i = 0; i < board.length; i++) {
        log(board[i].join(' '))
    }
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
        if (inputIsValid(answer, board))
            input = !input
    }
    answer = { row: answer.split(" ")[0], col: answer.split(" ")[1] }
    player.pieces.push(answer)
    winner = winnerCheck(player)
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
  if (depth == 0 || board.isTerminalNode) {
    return board.score;
  }

  let key = board.join(""); // Convert the board to a string to use as a hash key
  if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
    return memo[key];
  }

  let bestValue = maximizingPlayer ? -Infinity : Infinity;
  let validMoves = board.generateMoves();

  while (!validMoves.isEmpty()) {
    let move = validMoves.dequeue();
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

  memo[key] = bestValue; // Store the evaluation result for this board position
  return bestValue;
}


class Tracker {
    constructor() {
        this.memory = 0
        this.player = 0
    }
}
function setPiece(board, y, x, piece) {
  var shift = (x * BOARD_SIZE) + y;
  var mask = ~(3 << shift);
  return (board & mask) | (piece << shift);
}


function getPiece(board, x, y) {
  const shift = (x * BOARD_SIZE) + y;
  const mask = 3 << shift;
  const piece = (board & mask) >> shift;
  return piece;
}


async function main() {
    let board = 0
    board = setPiece(board, 2, 3, 2)
    board = setPiece(board, 0, 0, 2)

    board = setPiece(board, 0, 1, 2)
    board = setPiece(board, 0, 2, 2)
    printBoard
    log(getPiece(board, 1, 3))
    let tracker = new Tracker()
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

    // const node = new Node(board, "X", null)
    // const alpha = Number.NEGATIVE_INFINITY;
    // const beta = Number.POSITIVE_INFINITY;

    // const isMaximizingPlayer = true;

    // let userInput = ""
    // let isPlayer1Turn = true
    // var winner = false
    // let time = 0
    // while (true) {
    //     printBoard(board)
    //     log("time", time)
    //     console.log(tracker.memory, tracker.player, tracker.memory + tracker.player)
    //     const currentPlayer = isPlayer1Turn ? player1 : player2
    //     if (currentPlayer.name == "player1") {

    //         var newMove = await getPlayerMove(currentPlayer, board, winner)
    //         board[newMove.row][newMove.col] = currentPlayer.piece
    //     }
    //     else {

    //         const node = new Node(board, "X", null)
    //         const start = process.hrtime();
    //         board = minimax(node, DEPTH, isMaximizingPlayer, alpha, beta, tracker).board;
    //         currentPlayer.pieces = getPieces(board, "X")
    //         time = process.hrtime(start);
    //     }
    //     log("---------------------")
    //     isPlayer1Turn = !isPlayer1Turn
    // }
}
main()