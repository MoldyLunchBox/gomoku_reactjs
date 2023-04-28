const BOARD_EMPTY_CHAR = '.'
function followDirection(currentPiece, direction, playerPieces) {
    let i = 1
    let moveExists = true
    let pathElement = {row: currentPiece.row + direction.y, col: currentPiece.col + direction.x}
    while (i < 5 && moveExists){
        pathElement = {row: pathElement.row + direction.y, col: pathElement.col + direction.x}
        moveExists = playerPieces.find(obj => obj.row === pathElement.row && obj.col === pathElement.col);
        i++
    }

    return i

}

export class Node {
    constructor(board, player, parent) {
        this.board = board
        this.player = player
        this.parent = parent
        this.subPositions = this.subPosition()
        this.score = this.longestRow()
    }
    subPosition() {
        let positions = []
        console.log('hi')
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] === BOARD_EMPTY_CHAR) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    newPosition[i][j] = this.player.piece
                    positions.push(newPosition)
                }
            }
        }
        return positions
    }
    applyMove(board, player, parent ){
        return new Node(board, player, parent)
    }

    longestRow() {
        const allMoves= [
    
          {direction: "up", y: -1, x: 0 }, {direction: "down", y: 1, x: 0 }, {direction: "left", y: 0, x: -1 }, {direction: "right", y: 0, x: 1 },
          {direction: "diagUL", y: -1, x: -1 }, {direction: "diagUR", y: -1, x: 1 }, {direction: "diagDL", y: 1, x: -1 }, {direction: "diagDR", y: 1, x: 1 }
        ]
        let maxRow = 0
        for (let i = 0; i < this.player.pieces.length; i++) {
            const availableDirections = JSON.parse(JSON.stringify(allMoves));
            while (availableDirections.length) {
                const direction = availableDirections.shift()
                const currentPiece = this.player.pieces[i]
                const piecesRow = followDirection(currentPiece, direction, this.player.pieces) 
                maxRow = piecesRow > maxRow ? piecesRow : maxRow  
            }
        }
        return maxRow
    }

}