const BOARD_EMPTY_CHAR = '.'
function followDirection(currentPiece, direction, playerPieces) {
    let i = 0
    let moveExists = true
    let pathElement = {row: currentPiece.row , col: currentPiece.col }
    while (i < 5 && moveExists){
        pathElement = {row: pathElement.row + direction.y, col: pathElement.col + direction.x}

        moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
        i++
    }

    return i

}
export function getPieces(piece, board){
    let playerPieces = []
    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board.length; j++){
            if (board[i][j] == piece)
            playerPieces.push({row: i, col: j})
        }
    }
    return playerPieces
}

export class Node {
    constructor(board, parent) {
        this.board = board
        this.parent = parent
        // this.evalScore = this.evaluatePosition()
        //  this.subPositions = this.subPosition()
    }
    subPosition(piece) {
        let positions = []
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] === BOARD_EMPTY_CHAR) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    newPosition[i][j] = piece
                    // const newPlayer =  JSON.parse(JSON.stringify(this.player))
                    // newPlayer.pieces.push({ row: i, col: j })
                    positions.push(new Node(newPosition, this))
                }
            }
        }
        return positions
    }

    longestRow(piece) {
        const playerPieces = getPieces(piece, this.board)
        const allMoves= [
          {direction: "up", y: -1, x: 0 }, {direction: "down", y: 1, x: 0 }, {direction: "left", y: 0, x: -1 }, {direction: "right", y: 0, x: 1 },
          {direction: "diagUL", y: -1, x: -1 }, {direction: "diagUR", y: -1, x: 1 }, {direction: "diagDL", y: 1, x: -1 }, {direction: "diagDR", y: 1, x: 1 }
        ]
        let maxRow = 0
        for (let i = 0; i < playerPieces.length; i++) {
            const availableDirections = JSON.parse(JSON.stringify(allMoves));
            while (availableDirections.length) {
                const direction = availableDirections.shift()
                const currentPiece = playerPieces[i]
                const piecesRow = followDirection(currentPiece, direction, playerPieces) 
                maxRow = piecesRow > maxRow ? piecesRow : maxRow  
            }
        }
        return maxRow
    }
    // evaluatePosition() {
    //     const xLongestRow = this.longestRow("X");
    //     const oLongestRow = this.longestRow("O");
    //     // Score is the difference between longest rows
    //     return xLongestRow - oLongestRow;
    //   }

}