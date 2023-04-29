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
function minimax(position, depth, aiPlayer, alpha, beta) {
    var bestMove = null
    if (aiPlayer) {

        if (depth === 0 || position.longestRow("X") == 5) {
            return position.longestRow("X");

        }
        let bestValue = -Infinity;
        const subPositions = position.subPosition("X")
        subPositions.sort((a, b) => a.evaluatePosition() - b.evaluatePosition());

        for (let move of subPositions) {
            bestMove = move
            let value = minimax(move, depth - 1, false, alpha, beta);
            bestValue = Math.max(bestValue, value);
            alpha = Math.max(alpha, value);
            if (beta <= alpha) {

                break;
            }
        }
        if (depth == DEPTH)
            return bestMove
        return bestValue;
    } else {

        if (depth === 0 || position.longestRow("O") == 5) {
            return position.longestRow("O");

        }
        let bestValue = Infinity;
        const subPositions = position.subPosition("O")

        for (let move of subPositions) {
            bestMove = move
            let value = minimax(move, depth - 1, true, alpha, beta);
            bestValue = Math.min(bestValue, value);
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break;
            }
        }
        if (depth ==  DEPTH)
            return bestMove
        return bestValue;
    }
}
async function main() {
    const player1 = {
        name: 'player1',
        piece: 'O',
        wins: 0,
        pieces: [
        ],
    };

    const player2 = {
        name: 'player2',
        piece: 'X',
        wins: 0,
        pieces: [
            { row: 2, col: 1 },
            { row: 2, col: 0 },
            { row: 2, col: 2 },
            { row: 2, col: 4 },
        ],
    };
    let board = createBoard(5, 5)
    preFillBoard(player2, board)
    const node = new Node(board, null)
    printBoard(node.board)
    const alpha = Number.NEGATIVE_INFINITY;
    const beta = Number.POSITIVE_INFINITY;
  
    const isMaximizingPlayer = true;

    let userInput = ""
    let isPlayer1Turn = true
    var winner = false
    while (true) {
        printBoard(board)
        const currentPlayer = isPlayer1Turn ? player1 : player2
        if (currentPlayer.name == "player1") {

            var newMove = await getPlayerMove(currentPlayer, board, winner)
            board[newMove.row][newMove.col] = currentPlayer.piece
        }
        else {

            const node = new Node(board, null)
             board = minimax(node, DEPTH, isMaximizingPlayer, alpha, beta).board;
            currentPlayer.pieces = getPieces(board, "X")
        }
        log("---------------------")
        isPlayer1Turn = !isPlayer1Turn
    }
}
main()