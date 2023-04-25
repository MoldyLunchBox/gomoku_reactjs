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

async function main() {
    const board = createBoard(15, 15)
    let userInput = ""
    while (true) {
        printBoard(board)
        const answer = await new Promise((resolve) => {
            rl.question('Enter a value: ', (answer) => {
                resolve(answer.split(" "));
            });
        });
        console.log(`You entered: ${answer}`);
        board[answer[0]][answer[1]] = "A"
        console.clear()
        printBoard(board)
    }
}
main()