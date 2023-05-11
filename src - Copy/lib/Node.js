import PriorityQueue from "./priorityQueue"

const BOARD_EMPTY_CHAR = '.'
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
    let i = 0
    
    let moveExists = playerPieces.find(obj => obj.row === currentPiece.row && obj.col === currentPiece.col);
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

export class Node {
    constructor(board, piece, newPiece) {
        this.board = board
        this.newPiece = newPiece
        this.piece = piece  
        if (newPiece != null)
        this.score = (this.longestRow(piece) * 10) + this.connectedPieces(piece) + this.blockEnemy(piece == "X" ? "O" : "X" ) 
        // this.evalScore = this.evaluatePosition()
        //  this.subPositions = this.subPosition()
    }
    subPosition(piece) {
        let positions = new PriorityQueue()
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] === BOARD_EMPTY_CHAR) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    newPosition[i][j] = piece
                    // const newPlayer =  JSON.parse(JSON.stringify(this.player))
                    // newPlayer.pieces.push({ row: i, col: j })
                    positions.enqueue(new Node(newPosition, piece, { row: i, col: j }))
                }
            }
        }
        return positions
    }

    longestRow(piece) {
        const playerPieces = getPieces(piece, this.board)
        const allMoves = [
            { direction: "up", y: -1, x: 0 }, { direction: "down", y: 1, x: 0 }, { direction: "left", y: 0, x: -1 }, { direction: "right", y: 0, x: 1 },
            { direction: "diagUL", y: -1, x: -1 }, { direction: "diagUR", y: -1, x: 1 }, { direction: "diagDL", y: 1, x: -1 }, { direction: "diagDR", y: 1, x: 1 }
        ]
        let maxRow = 0
        for (let i = 0; i < playerPieces.length; i++) {
            const availableDirections = JSON.parse(JSON.stringify(allMoves));
            while (availableDirections.length) {
                const direction = availableDirections.shift()
                const currentPiece = playerPieces[i]
                if (pathWinnable(currentPiece, direction, this.board, piece)) {
                    const piecesRow = directionCounter(currentPiece, direction, playerPieces, this.board)
                    maxRow = piecesRow > maxRow ? piecesRow : maxRow
                }
            }
        }
        return maxRow
    }

    connectedPieces(piece) {
        const playerPieces = getPieces(piece, this.board)
        const allMoves = [
            { direction: "up", y: -1, x: 0 }, { direction: "down", y: 1, x: 0 }, { direction: "left", y: 0, x: -1 }, { direction: "right", y: 0, x: 1 },
            { direction: "diagUL", y: -1, x: -1 }, { direction: "diagUR", y: -1, x: 1 }, { direction: "diagDL", y: 1, x: -1 }, { direction: "diagDR", y: 1, x: 1 }
        ]
        let maxRow = 0
        let connections = 0
        for (let i = 0; i < playerPieces.length; i++) {
            const availableDirections = JSON.parse(JSON.stringify(allMoves));
            while (availableDirections.length) {
                const direction = availableDirections.shift()
                const currentPiece = playerPieces[i]
                const ret = followDirection(currentPiece, direction, playerPieces)
                connections += ret
            }
        }
        return connections
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