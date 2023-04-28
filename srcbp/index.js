const readline = require('readline');
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

function inputIsValid(newPiece, board){
    const regex = /^\d+\s+\d+$/
    if (regex.test(newPiece)){
        const piece = {row: newPiece.split(" ")[0], col: newPiece.split(" ")[1]}
        if (board[piece.row][piece.col] == BOARD_EMPTY_CHAR)
            return true
    }
    return false
}

function winnerCheck(player){
    const allMoves = [
        "up", "down", "left", "right",
        "diagUL", "diagUR", "diagDL", "diagDR"
    ]
    for (let i = 0; i < player.pieces.length; i++){
        
    }
}

async function getPlayerMove(player, board, winner){
    let input = false
    var answer = {}
    while (!input){

        answer = await new Promise((resolve) => {
            rl.question(`${player.name} Enter a value: `, (answer) => {
                resolve(answer);
            });
        });
        if (inputIsValid(answer, board))
            input = !input
    }
    answer = {row: answer.split(" ")[0], col: answer.split(" ")[1]}
    player.pieces.push(answer)
    winner = winnerCheck(player)
return answer
}

async function main() {
    const player1 = {
        name: 'player1',
        piece: 'X',
        wins: 0 ,
        pieces: [] ,
      };
      
      const player2 = {
        name: 'player2',
        piece: 'O',
        wins: 0 ,
        pieces: [] ,
      };

    const board = createBoard(15, 15)
    let userInput = ""
    let isPlayer1Turn = true
    var winner = false
    while (true) {
        printBoard(board)
        const currentPlayer = isPlayer1Turn ? player1 : player2
        const newMove = await getPlayerMove(currentPlayer, board, winner)
        // log(newMove)
        // exit()
        board[newMove.row][newMove.col] = currentPlayer.piece
        isPlayer1Turn = !isPlayer1Turn
        console.clear()
    }
}
main()