import PriorityQueue from "./priorityQueue"
const BOARD_SIZE = 7
const AI = 0
const HUMAN = 1
const BOARD_EMPTY_CHAR = 0
// function directionCounter(currentPiece, direction, playerPieces, board) {
//     let i = 0
//     let moveExists = playerPieces.find(obj => obj.row === currentPiece.row && obj.col === currentPiece.col);
//     let pathElement = { row: currentPiece.row, col: currentPiece.col }
//     // console.log(board, "\n\neeeeeeeeeh")
//     while (i < 5 && moveExists) {
//         // if (direction.direction == "down" && currentPiece.row == 1 && currentPiece.col == 1) {

//         //     console.log(i, pathElement)
//         // }
//         pathElement = { row: pathElement.row + direction.y, col: pathElement.col + direction.x }

//         moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
//         i++
//     }
//     // exit()
//     return i

// }

function pathWinnable(currentPiece, direction, board, piece) {
    let i = currentPiece.row
    let j = currentPiece.col
    let reversed = false
    let moves = 0
    while (i >= 0 && j >= 0 && i < board.length && j < board.length && moves < 5) {
        if (board[i][j] == BOARD_EMPTY_CHAR || board[i][j] == piece)
            moves++
        else
            break
        i = i + direction.y
        j = j + direction.x
        if (!reversed && (i == board.length || j == board.length || i == -1 || j == -1)) {
            reversed = true
            direction = { direction: direction.direction, y: direction.y * -1, x: direction.x * -1 }
            i = currentPiece.row + direction.y
            j = currentPiece.col + direction.x
        }

    }
    // console.log(moves)
    if (moves == 5)
        return true
    return false
}

function followDirection(currentPiece, direction, playerPieces) {
    let i = 0
    let moveExists = playerPieces.find(obj => obj.row === currentPiece.row && obj.col === currentPiece.col);
    let pathElement = { row: currentPiece.row, col: currentPiece.col }
    while (i < 5 && moveExists) {
        pathElement = { row: pathElement.row + direction.y, col: pathElement.col + direction.x }

        moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
        i++
    }

    if (i > 1)
        return 1
    return 0

}

export function getPieces(piece, board) {
    let playerPieces = []
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] == piece)
                playerPieces.push({ row: i, col: j })
        }
    }
    return playerPieces
}

function directionCounter(currentPiece, direction, playerPieces, board) {
    console.log(playerPieces, currentPiece)
    console.log("in")

    let i = 0
    let winnableRow = 0
    let moveExists = playerPieces.find(obj => obj.row === currentPiece.row && obj.col === currentPiece.col);
    console.log("out")
    let pathElement = { row: currentPiece.row, col: currentPiece.col }
    let reversed = false
    while (i < 5 && moveExists) {
        pathElement = { row: pathElement.row + direction.y, col: pathElement.col + direction.x }

        moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
        if (!moveExists && !reversed) {
            direction = { direction: direction.direction, y: direction.y * -1, x: direction.x * -1 }
            pathElement = { row: currentPiece.row + direction.y, col: currentPiece.col + direction.x }
            reversed = true
            moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);

        }
        i++
    }
    return i

}
function blockedPathCounter(currentPiece, direction, board, piece) {
    let i = currentPiece.row
    let j = currentPiece.col
    let reversed = false
    let moves = 0
    // if (direction.direction == "down" && currentPiece.row == 2 && currentPiece.col == 1) {

    //     console.log(moves, piece, currentPiece, i, j, direction)
    // }
    // console.log(board, "\n\n")
    while (i >= 0 && j >= 0 && i < board.length && j < board.length && moves < 5) {
        // if (direction.direction == "down" && currentPiece.row == 1 && currentPiece.col == 1) {

        //     console.log(moves, i, j)
        // }
        if (board[i][j] == BOARD_EMPTY_CHAR || board[i][j] == piece)
            moves++
        else
            break
        i = i + direction.y
        j = j + direction.x
        if (!reversed && (i == board.length || j == board.length || i == -1 || j == -1)) {
            reversed = true
            direction = { direction: direction.direction, y: direction.y * -1, x: direction.x * -1 }
            i = currentPiece.row + direction.y
            j = currentPiece.col + direction.x
        }

    }
    // console.log(moves)
    if (moves == 5)
        return true
    return false
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


export class Node {
    constructor(board, piece, newPiece) {
        this.board = board
        this.newPiece = newPiece
        this.piece = piece
        // calculate longest row in every direction
        this.scores = this.calculateScores(board)
        this.score = this.scores.maxHorizontal + this.scores.maxVertical + this.scores.maxDiagonal
    }
    generateMoves(playerPiece) {
        let positions = new PriorityQueue()
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (getPiece(i, j, this.board) === BOARD_EMPTY_CHAR) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    setPiece(i, j, playerPiece, newPosition)
                    positions.enqueue(new Node(newPosition, playerPiece, { row: i, col: j }))
                }
            }
        }
        return positions
    }

    calculateScores(board) {
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


    blockEnemy(enemyPiece) {
        const currentPiece = this.newPiece
        const enemyPieces = getPieces(enemyPiece, this.board)
        enemyPieces.push(currentPiece)
        const allMoves = [
            { direction: "up", y: -1, x: 0 }, { direction: "down", y: 1, x: 0 }, { direction: "left", y: 0, x: -1 }, { direction: "right", y: 0, x: 1 },
            { direction: "diagUL", y: -1, x: -1 }, { direction: "diagUR", y: -1, x: 1 }, { direction: "diagDL", y: 1, x: -1 }, { direction: "diagDR", y: 1, x: 1 }
        ]
        let maxRow = 0
        while (allMoves.length) {
            const direction = allMoves.shift()
            // if (pathWinnable(currentPiece, direction, this.board, myPiece)) {
            const piecesRow = directionCounter(currentPiece, direction, enemyPieces, this.board) - 1
            maxRow = piecesRow > maxRow ? piecesRow : maxRow
            // }
        }
        if (maxRow == 3)
            maxRow = 10
        if (maxRow > 3)
            maxRow = 1000
        return maxRow
    }
}