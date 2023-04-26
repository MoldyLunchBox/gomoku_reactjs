const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const { log } = console


function createBoard(rows, cols) {
    const array = new Array(rows);
    for (let i = 0; i < rows; i++) {
        array[i] = new Array(cols).fill(".");
    }
    return array;
}
function printBoard(board) {
    for (let i = 0; i < board.length; i++) {
        log(board[i].join(' '))
    }
}

function ifvalid(userPieces1, userPieces2, newPiece){
    
}

async function getPlayerMove(player){
    const answer = await new Promise((resolve) => {
        rl.question('Enter a value: ', (answer) => {
            resolve({row: answer.split(" ")[0], col: answer.split(" ")[1]});
        });
    });
    player.placedPieces.push(answer)
return answer
}

async function main() {
    const player1 = {
        name: 'player1',
        piece: 'X',
        wins: 0 ,
        placedPieces: [] ,
      };
      
      const player2 = {
        name: 'player2',
        piece: 'O',
        wins: 0 ,
        placedPieces: [] ,
      };

    const board = createBoard(15, 15)
    let userInput = ""
    let isPlayer1Turn = true
    while (true) {
        printBoard(board)
        const currentPlayer = isPlayer1Turn ? player1 : player2
        const newMove = await getPlayerMove(currentPlayer)
        // log(newMove)
        // exit()
        board[newMove.row][newMove.col] = currentPlayer.piece
        isPlayer1Turn = !isPlayer1Turn
        console.clear()
    }
}
main()