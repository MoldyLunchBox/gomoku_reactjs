import PriorityQueue from "./priorityQueue"
const BOARD_SIZE = 19
const AI = 1
const HUMAN = 2
const BOARD_EMPTY_CHAR = 0


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
    constructor(board, player, newPiece) {
        this.board = board
        this.newPiece = newPiece
        this.player = player
        // calculate longest row in every direction
        if (newPiece) {
            this.scores = this.calculateScores(board).row
            this.score = (this.scores.self.h_length + this.scores.self.v_length + this.scores.self.dr_length + this.scores.self.dl_length + this.scores.self.connections) * Math.max(
                this.scores.self.h_length,
                this.scores.self.v_length,
                this.scores.self.dr_length,
                this.scores.self.dl_length
            );
        }
    }
    generateMoves() {
        let positions = new PriorityQueue()
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (getPiece(i, j, this.board) === BOARD_EMPTY_CHAR) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    setPiece(i, j, this.player == AI ? 1 : 0, newPosition)
                    positions.enqueue(new Node(newPosition, this.player == AI ? HUMAN : AI, { y: i, x: j }))
                }
            }
        }
        return positions
    }

    calculateScores(board) {
        let row = {
            self: {
                h_length: 0,
                v_length: 0,
                dr_length: 0,
                dl_length: 0,
                connections: 0
            },
            enemy: {
                h_length: 0,
                v_length: 0,
                dr_length: 0,
                dl_length: 0
            }
        }
        let h_move = true;  // horizontal move available
        let v_move = true;  // vertical move available
        let dr_move = true; // diagonal right move available
        let dl_move = true; // diagonal left move available


        let block_h_move = true;  // horizontal move available
        let block_v_move = true;  // vertical move available
        let block_dr_move = true; // diagonal right move available
        let block_dl_move = true; // diagonal left move available

        let sign = 1
        // Calculate scores for horizontal, vertical, and diagonal lines
        let list = []
        for (let j = 0; j < BOARD_SIZE; j++) {
            // Calculate horizontal score
            if (h_move || block_h_move) {
                const piece = getPiece(this.newPiece.y, this.newPiece.x + j * sign, board)
                if (h_move && piece === (this.player)) {
                    if (j > 1 || j < -1)
                        block_h_move = false
                    row.self.h_length++
                }
                else
                    h_move = false
                if (block_h_move && piece === (this.player === AI ? HUMAN : AI))
                    row.enemy.h_length++
                else if (j > 1 || j < -1)
                    block_h_move = false

                    // if (this.newPiece.y == 10 && this.newPiece.x == 9 && piece){
                    //     console.log("debug: ----------")
                    //         console.log(piece, this.newPiece.y, this.newPiece.x + j * sign , piece === (this.player === AI ? HUMAN : AI))
                    //     console.log("-----<")
                    //     }

            }


            // Calculate vertical score for self
            if (v_move && this.newPiece.y + j < BOARD_SIZE) {
                const piece = getPiece(this.newPiece.y + j * sign, this.newPiece.x, board)
                if (piece === (this.player))
                    row.self.v_length++
                else
                    v_move = false
                // calculate vertical row length for blocked enemy
                // if (piece === this.player && (j > 0 || j < 0))

            }

            // Calculate diagonal score (top-left to bottom-right)

            if (this.newPiece.y + j < BOARD_SIZE && this.newPiece.x + j * sign < BOARD_SIZE && dr_move) {
                const piece = getPiece(this.newPiece.y + j * sign, this.newPiece.x + j * sign, board)
                if (piece === (this.player))
                    row.self.dr_length++
                else
                    dr_move = false
            }
      
            // Calculate diagonal score (top-right to bottom-left)
            if (this.newPiece.y - j >= 0 && dl_move) {
                const piece = getPiece(this.newPiece.y + j * sign, this.newPiece.x - j * sign, board)
                if (piece === (this.player))
                    row.self.dl_length++
                else
                    dl_move = false
            }

            // when the loop reachs the end, it is then reversed once to calculate the opposite directions
            if (j + 1 == BOARD_SIZE && sign == 1) {
                sign *= -1
                j = 0
                h_move = true;
                v_move = true;
                dr_move = true;
                dl_move = true;
                block_h_move = true
            }  
        }
        // if (this.newPiece.y == 10 && this.newPiece.x == 9){
        //     console.log(row)
        //     exit()
        // }
        row.self.connections = getPiece(this.newPiece.y, this.newPiece.x + 1, board) || getPiece(this.newPiece.y, this.newPiece.x - 1, board) || getPiece(this.newPiece.y - 1, this.newPiece.x, board) || getPiece(this.newPiece.y + 1, this.newPiece.x, board)
        return {
            row
        };
    }


    // calculateScores(board) {
    //     let maxHorizontal = 0;
    //     let maxVertical = 0;
    //     let maxDiagonal = 0;

    //     // Calculate scores for horizontal, vertical, and diagonal lines
    //     for (let i = 0; i < BOARD_SIZE; i++) {
    //         let consecutiveHorizontal = 0;
    //         let consecutiveVertical = 0;
    //         let consecutiveDiagonalRight = 0;
    //         let consecutiveDiagonalLeft = 0;

    //         let list = []
    //         for (let j = 0; j < BOARD_SIZE; j++) {
    //             // Calculate horizontal score
    //             consecutiveHorizontal = (getPiece(i, j, board) === 1) ? consecutiveHorizontal + 1 : 0;
    //             maxHorizontal = Math.max(maxHorizontal, consecutiveHorizontal);
    //             // Calculate vertical score
    //             consecutiveVertical = (getPiece(j, i, board) === 1) ? consecutiveVertical + 1 : 0;
    //             maxVertical = Math.max(maxVertical, consecutiveVertical);

    //             // Calculate diagonal score (top-left to bottom-right)
    //             if (i + j < BOARD_SIZE) {
    //                 consecutiveDiagonalRight = (getPiece(j, i + j, board) === 1) ? consecutiveDiagonalRight + 1 : 0;
    //                 maxDiagonal = Math.max(maxDiagonal, consecutiveDiagonalRight);
    //             }

    //             // Calculate diagonal score (top-right to bottom-left)
    //             if (i - j >= 0) {
    //                 consecutiveDiagonalLeft = (getPiece(j, i - j, board) === 1) ? consecutiveDiagonalLeft + 1 : 0;
    //                 maxDiagonal = Math.max(maxDiagonal, consecutiveDiagonalLeft);
    //             }
    //         }
    //     }

    //     return {
    //         maxHorizontal,
    //         maxVertical,
    //         maxDiagonal
    //     };
    // }

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



function calculateScores2(board) {
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
