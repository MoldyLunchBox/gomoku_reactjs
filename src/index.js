const { exit } = require('process');
const readline = require('readline');
import {Node} from './lib/Node'
const BOARD_EMPTY_CHAR = '.'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const { log } = console


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
    let pathElement = {row: currentPiece.row + direction.y, col: currentPiece.col + direction.x}
    log("loooking for ", pathElement, "in" , playerPieces)
    while (i < 5 && moveExists){
        pathElement = {row: pathElement.row + direction.y, col: pathElement.col + direction.x}
        moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
        i++
    }
    if (i == 5)
        return true
    return false

}
function winnerCheck(player, board) {
    const allMoves= [

      {direction: "up", y: -1, x: 0 }, {direction: "down", y: 1, x: 0 }, {direction: "left", y: 0, x: -1 }, {direction: "right", y: 0, x: 1 },
      {direction: "diagUL", y: -1, x: -1 }, {direction: "diagUR", y: -1, x: 1 }, {direction: "diagDL", y: 1, x: -1 }, {direction: "diagDR", y: 1, x: 1 }
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
        
            if (followDirection(currentPiece, direction, player.pieces)){
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
function preFillBoard(player, board){
    for (let i = 0; i < player.pieces.length; i++){
        board[player.pieces[i].row][player.pieces[i].col] = player.piece
    }
}
function minmax(position, depth, player){
    if (depth === 0 || position.longestRow == 5) {
        return position.longestRow;
      }
    
      if (player.name == "ai") {
        let bestValue = -Infinity;
        for (let move of position.subPositions) {
          let value = minimax(position.applyMove(move, player, position), depth - 1, false);
          bestValue = Math.max(bestValue, value);
        }
        return bestValue;
      } else {
        let bestValue = Infinity;
        for (let move of position.getMoves()) {
          let value = minimax(position.applyMove(move), depth - 1, true);
          bestValue = Math.min(bestValue, value);
        }
        return bestValue;
      }
}
async function main() {
    const player1 = {
        name: 'player1',
        piece: 'X',
        wins: 0,
        pieces: [
            { row: 0, col: 1 },
            { row: 0, col: 0 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
    };

    const player2 = {
        name: 'player2',
        piece: 'O',
        wins: 0,
        pieces: [],
    };
    const board = createBoard(5, 5)
    preFillBoard(player1, board)
    const node = new Node(board, player1, null)
    log(node.subPositions)
    log(node.subPositions.length)

    log(node.score)
    exit()
    let userInput = ""
    let isPlayer1Turn = true
    var winner = false
    while (true) {
        printBoard(board)
        const currentPlayer = isPlayer1Turn ? player1 : player2
        log(currentPlayer.pieces)
        const newMove = await getPlayerMove(currentPlayer, board, winner)
        // log(newMove)
        // exit()
        board[newMove.row][newMove.col] = currentPlayer.piece
        isPlayer1Turn = !isPlayer1Turn
        // console.clear()
    }
}
main()