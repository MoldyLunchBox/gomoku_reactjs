

const BOARD_SIZE = 19
const AI = 1
const HUMAN = 2

const { log } = console
const DEPTH = 4;

class PriorityQueue {
    constructor() {
        this.items = [];
        this.maxOpen = 0
    }
    /**
     * 
     * @param {Node} elem
     * @explanation : take a puzzle element of type Node 
     * then put it in the position in the list by its score
     */
    enqueue(elem) {
        // equivalent to :
        //      this.items.push(elem)
        //      this.items.sort((a,b) => a.score -b.score) 2814 19914 22728
        let contain = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].score < elem.score && elem.player == AI || this.items[i].score > elem.score && elem.player == HUMAN) {
                this.items.splice(i, 0, elem);
                contain = true;
                break;
            }
        }

        if (!contain) {
            this.items.push(elem)
        }

        // get complexity in size
        if (this.items.length > this.maxOpen)
            this.maxOpen = this.items.length
    }
    /**
     * 
     * @returns return first element and pop it from the list
     */
    dequeue() {
        return this.isEmpty() ? undefined : this.items.shift();
    }

    /**
     * 
     * @returns check if the items list is empty
     */
    isEmpty() {
        return this.items.length == 0;
    }
}




const EMPTY_PIECE = 0
const RANGE = 6
function printBoard(board, player = null) {
    console.log("\n")
    for (let i = 0; i < BOARD_SIZE; i++) {
        let line = ''
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (player && player.y == i && player.x == j)
                line += "A" + ' '
            else
                line += getPiece(i, j, board) + ' '
        }
        console.log(line)
    }
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


class Node {
    constructor(board, player, newPiece, boundries, parent, depth) {
        this.board = board
        this.newPiece = newPiece
        this.player = player
        this.boundries = boundries
        this.parent = parent
        this.debug = ""
        this.freethrees = 0
        this.depth = depth
        this.fling = null
        if (newPiece) {
            this.scores = this.calculateScores(board)
            this.validateScores()
            this.score = this.heuristics() * this.depth
        }
        else
            this.score = 0
    }
    generateMoves() {
        let positions = new PriorityQueue()
        for (let i = this.boundries.topLeft.y; i < this.boundries.bottomRight.y; i++) {
            for (let j = this.boundries.topLeft.x; j < this.boundries.bottomRight.x; j++) {
                if (getPiece(i, j, this.board) === EMPTY_PIECE) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    setPiece(i, j, this.player == AI ? 1 : 0, newPosition)
                    const node = new Node(newPosition, this.player == AI ? HUMAN : AI, { y: i, x: j }, this.boundries, this, this.depth - 1)
                    if (node.freeThrees != 2)
                        positions.enqueue(node)
                }
            }
        }
        return positions
    }

    calculateScores(board) {

        // let enemy_connection = {
        //     left: getPiece(this.newPiece.y, this.newPiece.x - 1, board) == (this.player === AI ? HUMAN : AI), // left
        //     right: getPiece(this.newPiece.y, this.newPiece.x + 1, board) == (this.player === AI ? HUMAN : AI), // right
        //     down: getPiece(this.newPiece.y + 1, this.newPiece.x, board) == (this.player === AI ? HUMAN : AI), // down
        //     up: getPiece(this.newPiece.y - 1, this.newPiece.x, board) == (this.player === AI ? HUMAN : AI), // up
        //     dr_up: getPiece(this.newPiece.y - 1, this.newPiece.x + 1, board) == (this.player === AI ? HUMAN : AI), //  diag right up
        //     dr_down: getPiece(this.newPiece.y + 1, this.newPiece.x + 1, board) == (this.player === AI ? HUMAN : AI), // diag right down
        //     dl_up: getPiece(this.newPiece.y - 1, this.newPiece.x - 1, board) == (this.player === AI ? HUMAN : AI), //  diag left up
        //     dl_down: getPiece(this.newPiece.y + 1, this.newPiece.x - 1, board) == (this.player === AI ? HUMAN : AI), // diag left down
        // }

        // player.connections = getPiece(this.newPiece.y, this.newPiece.x + 1, board) || getPiece(this.newPiece.y, this.newPiece.x - 1, board) || getPiece(this.newPiece.y - 1, this.newPiece.x, board) || getPiece(this.newPiece.y + 1, this.newPiece.x, board)


        const player = this.playerRowsLength()
        const enemy = this.enemyRowsLength()
        return {
            player, enemy
        };
    }

    playerRowsLength() {

        let streak = {
            player: {
                h_right: 1,   // length of the row right side of the piece
                h_left: 0,   // length of the row left side of the piece
                h_length: 1,  // length: 1 of the full row, (right + left)
                h_move: true,  // state of the row   true for available, false for ended

                v_bottom: 1,
                v_top: 0,
                v_length: 1,
                v_move: true,

                drb: 1,
                dlt: 0,
                dr_length: 1,
                dr_move: true,

                dlb: 1,
                drt: 0,
                dl_length: 1,
                dl_move: true,
                connections: 0
            },
            availableSpace: {       // length of the row available for the player
                h_length: 0,
                h_move: true,
                v_length: 0,
                v_move: true,
                dr_length: 0,
                dr_move: true,
                dl_length: 0,
                dl_move: true,
            },
            ends: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                dbl: 0, //diagonal bottom left
                dbr: 0, //diagonal bottom right
                dtl: 0, //diagonal top left
                dtr: 0, //diagonal top right
            },
            connections: 0

        }
        let sign = 1
        let piece = ""


        // if (this.newPiece.y == 6 && this.newPiece.x == 7) {

        //     console.log("debug: ----------")
        //     console.log( streak.player.dr_move , piece , this.player, sign)
        //     console.log("-----<")
        //     printBoard(this.board)
        // }

        for (let j = 1; j < RANGE; j++) {

            // Calculate horizontal score
            piece = getPiece(this.newPiece.y, this.newPiece.x + (j * sign), this.board)
            if (this.newPiece.x + (j * sign) < BOARD_SIZE && this.newPiece.x + (j * sign) >= 0) {  // range condition
                if (streak.player.h_move && piece === (this.player)) {
                    if (sign == 1)
                        streak.player.h_right++
                    else
                        streak.player.h_left++
                }
                else
                    streak.player.h_move = false
                if (streak.availableSpace.h_move && !streak.player.h_move) {
                    if (sign == 1)
                        streak.ends.right = piece
                    else
                        streak.ends.left = piece
                    if (piece === EMPTY_PIECE || piece === (this.player))
                        streak.availableSpace.h_length++
                    else
                        streak.availableSpace.h_move = false
                }

            }


            // Calculate vertical score for player

            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x, this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0) {  // range condition
                if (streak.player.v_move && piece === (this.player)) {
                    if (sign == 1)
                        streak.player.v_bottom++
                    else
                        streak.player.v_top++
                }
                else
                    streak.player.v_move = false
                if (streak.availableSpace.v_move && !streak.player.v_move) {
                    if (sign == 1)
                        streak.ends.bottom = piece
                    else
                        streak.ends.top = piece
                    if (piece === EMPTY_PIECE || piece === (this.player))
                        streak.availableSpace.v_length++
                    else
                        streak.availableSpace.v_move = false
                }
            }

            // Calculate diagonal score (top-left to bottom-right)
            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x + (j * sign), this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.x + (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0 && this.newPiece.x + (j * sign) >= 0) {  // range condition

                if (streak.player.dr_move && piece === (this.player)) {
                    if (sign == 1)
                        streak.player.drb++
                    else
                        streak.player.dlt++
                }
                else
                    streak.player.dr_move = false
                if (streak.availableSpace.dr_move && !streak.player.dr_move) {
                    if (sign == 1)
                        streak.ends.dbr = piece
                    else
                        streak.ends.dtl = piece
                    if (piece === EMPTY_PIECE || piece === (this.player))
                        streak.availableSpace.dr_length++
                    else
                        streak.availableSpace.dr_move = false
                }
            }

            // Calculate diagonal score (top-right to bottom-left)
            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x - (j * sign), this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.x - (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0 && this.newPiece.x - (j * sign) >= 0) {  // range condition

                if (streak.player.dl_move && piece === (this.player)) {
                    if (sign == 1)
                        streak.player.dlb++
                    else
                        streak.player.drt++
                }
                else
                    streak.player.dl_move = false
                if (streak.availableSpace.dl_move && !streak.player.dl_move) {
                    if (sign == 1)
                        streak.ends.dbl = piece
                    else
                        streak.ends.dtr = piece
                    if (piece === EMPTY_PIECE || piece === (this.player))
                        streak.availableSpace.dl_length++
                    else
                        streak.availableSpace.dl_move = false
                }
            }


            // when the loop reachs the end, it is then reversed once to calculate the opposite directions
            if (j + 1 == RANGE && sign == 1) {
                sign *= -1
                j = 0
                streak.player.h_move = true;
                streak.player.v_move = true;
                streak.player.dr_move = true;
                streak.player.dl_move = true;

                streak.availableSpace.h_move = true;
                streak.availableSpace.v_move = true;
                streak.availableSpace.dr_move = true;
                streak.availableSpace.dl_move = true;
            }
        }
        streak.player.h_length = streak.player.h_right + streak.player.h_left
        streak.player.v_length = streak.player.v_bottom + streak.player.v_top
        streak.player.dr_length = streak.player.drb + streak.player.dlt
        streak.player.dl_length = streak.player.dlb + streak.player.drt

        return streak
    }
    enemyRowsLength() {

        let streak = {
            enemy: {
                h_right: 0,   // length of the row right side of the piece
                h_left: 0,   // length of the row left side of the piece
                h_length: 0,  // length: 1 of the full row, (right + left)
                h_move: true,  // state of the row   true for available, false for ended

                v_bottom: 0,
                v_top: 0,
                v_length: 0,
                v_move: true,

                drb: 0,
                dlt: 0,
                dr_length: 0,
                dr_move: true,

                dlb: 0,
                drt: 0,
                dl_length: 0,
                dl_move: true,
                connections: 0
            },
            availableSpace: {       // length of the row available for the player
                h_length: 0,
                h_move: true,
                v_length: 0,
                v_move: true,
                dr_length: 0,
                dr_move: true,
                dl_length: 0,
                dl_move: true,
            },
            ends: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                dbl: 0, //diagonal bottom left
                dbr: 0, //diagonal bottom right
                dtl: 0, //diagonal top left
                dtr: 0, //diagonal top right
            },
            connections: 0

        }
        let sign = 1
        let piece = ""
        const enemy = this.player == AI ? HUMAN : AI



        for (let j = 1; j < RANGE; j++) {

            // Calculate horizontal score
            piece = getPiece(this.newPiece.y, this.newPiece.x + (j * sign), this.board)
            if (this.newPiece.x + (j * sign) < BOARD_SIZE && this.newPiece.x + (j * sign) >= 0) {  // range condition
                if (streak.enemy.h_move && piece === (enemy)) {
                    if (sign == 1){
                        streak.ends.right = piece
                        streak.enemy.h_right++
                    }
                    else{
                        streak.ends.left = piece
                        streak.enemy.h_left++
                    }

                }
                else
                    streak.enemy.h_move = false
                if (streak.availableSpace.h_move && !streak.enemy.h_move) {
                    if (sign == 1)
                        streak.ends.right = piece
                    else
                        streak.ends.left = piece
                    if (piece === EMPTY_PIECE || piece === (enemy))
                        streak.availableSpace.h_length++
                    else
                        streak.availableSpace.h_move = false
                }

            }

            // if (this.newPiece.y == 0 && this.newPiece.x == 0) {

            //     console.log("debug: ----------")
            //     console.log( streak.enemy.h_length, sign, this.newPiece.x , (j * sign), piece)
            //     console.log("-----<")
            // }


            // Calculate vertical score for enemy

            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x, this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0) {  // range condition

                if (streak.enemy.v_move && piece === (enemy)) {
                    if (sign == 1){
                        streak.enemy.v_bottom++
                        streak.ends.bottom = piece
                    }

                    else{
                        streak.ends.top = piece
                        streak.enemy.v_top++
                    }

                }
                else
                    streak.enemy.v_move = false
                if (streak.availableSpace.v_move && !streak.enemy.v_move) {
                    if (sign == 1)
                        streak.ends.bottom = piece
                    else
                        streak.ends.top = piece
                    if (piece === EMPTY_PIECE || piece === (enemy))
                        streak.availableSpace.v_length++
                    else
                        streak.availableSpace.v_move = false
                }
            }

            // Calculate diagonal score (top-left to bottom-right)
            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x + (j * sign), this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.x + (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0 && this.newPiece.x + (j * sign) >= 0) {  // range condition
                if (streak.enemy.dr_move && piece === (enemy)) {
                    if (sign == 1){
                        streak.ends.dbr = piece
                        streak.enemy.drb++
                    }
                    else{
                        streak.ends.dtl = piece
                        streak.enemy.dlt++
                    }

                }
                else
                    streak.enemy.dr_move = false
                if (streak.availableSpace.dr_move && !streak.enemy.dr_move) {
                    if (sign == 1)
                        streak.ends.dbr = piece
                    else
                        streak.ends.dtl = piece
                    if (piece === EMPTY_PIECE || piece === (enemy))
                        streak.availableSpace.dr_length++
                    else
                        streak.availableSpace.dr_move = false
                }
            }
            // Calculate diagonal score (top-right to bottom-left)
            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x - (j * sign), this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.x - (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0 && this.newPiece.x - (j * sign) >= 0) {  // range condition
                if (this.newPiece.x == 4 && this.newPiece.y == 15 && this.depth == 4 && this.player == AI) {
                    console.log("debugging dlb")
                    log(streak.enemy.dl_move,streak.availableSpace.dl_move, piece, sign)
                    log(streak.ends.dbl)
                }
                if (streak.enemy.dl_move && piece === (enemy)) {
                    if (sign == 1){
                        streak.enemy.dlb++
                        streak.ends.dbl = piece
                    }
                    else{
                        streak.enemy.drt++
                        streak.ends.dtr = piece
                    }

                }
                else
                    streak.enemy.dl_move = false
                if (streak.availableSpace.dl_move && !streak.enemy.dl_move) {
                    if (sign == 1)
                        streak.ends.dbl = piece
                    else
                        streak.ends.dtr = piece
                    if (piece === EMPTY_PIECE || piece === (enemy))
                        streak.availableSpace.dl_length++
                    else
                        streak.availableSpace.dl_move = false
                }
            }


            // when the loop reachs the end, it is then reversed once to calculate the opposite directions
            if (j + 1 == RANGE && sign == 1) {
                sign *= -1
                j = 0
                streak.enemy.h_move = true;
                streak.enemy.v_move = true;
                streak.enemy.dr_move = true;
                streak.enemy.dl_move = true;

                streak.availableSpace.h_move = true;
                streak.availableSpace.v_move = true;
                streak.availableSpace.dr_move = true;
                streak.availableSpace.dl_move = true;

            }
        }
        streak.enemy.h_length = streak.enemy.h_right + streak.enemy.h_left
        streak.enemy.v_length = streak.enemy.v_bottom + streak.enemy.v_top
        streak.enemy.dr_length = streak.enemy.drb + streak.enemy.dlt
        streak.enemy.dl_length = streak.enemy.dlb + streak.enemy.drt

        return streak
    }


    heuristics() {
        const player = this.scores.player
        const enemy = this.scores.enemy
        const enemyPlayer = this.player == AI ? HUMAN : AI

        // analysing and asigning score to player pieces
        const p_h = gomokuShapeScore(player.player.h_length, (player.ends.left != enemyPlayer ? 1 : 0) + (player.ends.right != enemyPlayer ? 1 : 0), true, player.player.h_left == 0 || player.player.h_right == 1, player.availableSpace.h_length)
        const p_v = gomokuShapeScore(player.player.v_length, (player.ends.bottom != enemyPlayer ? 1 : 0) + (player.ends.top != enemyPlayer ? 1 : 0), true, player.player.v_top == 0 || player.player.v_bottom == 1, player.availableSpace.v_length)
        const p_dl = gomokuShapeScore(player.player.dl_length, (player.ends.dbl != enemyPlayer ? 1 : 0) + (player.ends.dtr != enemyPlayer ? 1 : 0), true, player.player.drt == 0 || player.player.dlb == 1, player.availableSpace.dl_length)
        const p_dr = gomokuShapeScore(player.player.dr_length, (player.ends.dbr != enemyPlayer ? 1 : 0) + (player.ends.dtl != enemyPlayer ? 1 : 0), true, player.player.dlt == 0 || player.player.drb == 1, player.availableSpace.dr_length)

        // analysing and asigning score to enemy pieces
        const e_h = gomokuShapeScore(enemy.enemy.h_length, (enemy.ends.left == EMPTY_PIECE ? 1 : 0) + (enemy.ends.right == EMPTY_PIECE ? 1 : 0), false, enemy.enemy.h_left == 0 || enemy.enemy.h_right == 0, enemy.availableSpace.h_length)
        const e_v = gomokuShapeScore(enemy.enemy.v_length, (enemy.ends.bottom == EMPTY_PIECE ? 1 : 0) + (enemy.ends.top == EMPTY_PIECE ? 1 : 0), false, enemy.enemy.v_top == 0 || enemy.enemy.v_bottom == 0, enemy.availableSpace.v_length)
        const e_dl = gomokuShapeScore(enemy.enemy.dl_length, (enemy.ends.dbl == EMPTY_PIECE ? 1 : 0) + (enemy.ends.dtr == EMPTY_PIECE ? 1 : 0), false, enemy.enemy.drt == 0 || enemy.enemy.dlb == 0, enemy.availableSpace.dl_length)
        const e_dr = gomokuShapeScore(enemy.enemy.dr_length, (enemy.ends.dbr == EMPTY_PIECE ? 1 : 0) + (enemy.ends.dtl == EMPTY_PIECE ? 1 : 0), false, enemy.enemy.dlt == 0 || enemy.enemy.drb == 0, enemy.availableSpace.dr_length)


        this.debug = { p_h, p_v, p_dl, p_dr, e_h, e_v, e_dl, e_dr }
        const score = p_h + p_v + p_dl + p_dr + e_h + e_v + e_dl + e_dr + (this.parent ? this.parent.score : 0) + (this.fling ? 100 : 0)
        return (score)
    }
    validateScores() {
        const player = this.scores.player
        const enemy = this.scores.enemy
        const i = this.newPiece.y
        const j = this.newPiece.x
        let freeThrees = 0
        // checking horizental row for a row of 2
        // right side of the currently placed piece
        if (player.availableSpace.h_length > 4) {
            freeThrees = player.player.h_right == 3 ? freeThrees + 1 : freeThrees
            freeThrees = player.player.h_left == 2 ? freeThrees + 1 : freeThrees
        }
        if (player.availableSpace.v_length > 4) {
            freeThrees = player.player.v_bottom == 3 ? freeThrees + 1 : freeThrees
            freeThrees = player.player.v_top == 2 ? freeThrees + 1 : freeThrees
        }
        if (player.availableSpace.dl_length > 4) {
            freeThrees = player.player.dlb == 3 ? freeThrees + 1 : freeThrees
            freeThrees = player.player.drt == 2 ? freeThrees + 1 : freeThrees
        }
        if (player.availableSpace.dr_length > 4) {
            freeThrees = player.player.drb == 3 ? freeThrees + 1 : freeThrees
            freeThrees = player.player.dlt == 2 ? freeThrees + 1 : freeThrees
        }
        this.freeThrees = freeThrees

        // checking possibility of flinging enemy pieces
        // if (this.newPiece.x == 0 && this.newPiece.y == 0 && this.depth == 5) {
        //     console.log("debugging")
        //     log(this.player)

        //     log(player)
        //     log(enemy)
        //     log("enemy.enemy.h_left ", enemy.enemy.h_left)
        //     log("enemy.ends.left", enemy.ends.left)

        // }


        if (enemy.enemy.h_left == 2 && getPiece(i, j - 3, this.board) == this.player)         // left
            this.fling = { y: 0, x: -1 }
        if (enemy.enemy.h_right == 2 && getPiece(i, j + 3, this.board) == this.player) {      // right

            this.fling = { y: 0, x: 1 }

        }
        if (enemy.enemy.v_top == 2 && getPiece(i - 3, j, this.board) == this.player)           // top
            this.fling = { y: -1, x: 0 }

        if (enemy.enemy.v_bottom == 2 && getPiece(i + 3, j, this.board) == this.player)       // bottom
            this.fling = { y: 1, x: 0 }

        if (enemy.enemy.dlb == 2 && getPiece(i + 3, j - 3, this.board) == this.player)         // diagonal left bottom
            this.fling = { y: 1, x: -1 }

        if (enemy.enemy.drt == 2 && getPiece(i - 3, j + 3, this.board) == this.player)          // diagonal right top
            this.fling = { y: -1, x: 1 }

        if (enemy.enemy.drb == 2 && getPiece(i + 3, j + 3, this.board) == this.player)         // diagonal right bottom
            this.fling = { y: 1, x: 1 }

        if (enemy.enemy.dlt == 2 && getPiece(i - 3, j - 3, this.board) == this.player)            // diagonal left top
            this.fling = { y: -1, x: -1 }

        // player.player.h_length = player.availableSpace.h_length + player.player.h_length >= 5 ? player.player.h_length : 0
        // player.player.v_length = player.availableSpace.v_length + player.player.v_length >= 5 ? player.player.v_length : 0
        // player.player.dl_length = player.availableSpace.dl_length + player.player.dl_length >= 5 ? player.player.dl_length : 0
        // player.player.dr_length = player.availableSpace.dr_length + player.player.dr_length >= 5 ? player.player.dr_length : 0

        // enemy.enemy.h_length = enemy.availableSpace.h_length + enemy.enemy.h_length >= 5 ? enemy.enemy.h_length : 0
        // enemy.enemy.v_length = enemy.availableSpace.v_length + enemy.enemy.v_length >= 5 ? enemy.enemy.v_length : 0
        // enemy.enemy.dl_length = enemy.availableSpace.dl_length + enemy.enemy.dl_length >= 5 ? enemy.enemy.dl_length : 0
        // enemy.enemy.dr_length = enemy.availableSpace.dr_length + enemy.enemy.dr_length >= 5 ? enemy.enemy.dr_length : 0
        // if (this.newPiece.x == 4 && this.newPiece.y == 15 && this.depth == 4 && this.player == AI) {
        //     printBoard(this.board)
        //     console.log("debugging")
        //     log(player)
        //     log(enemy)
        // }
        player.availableSpace.h_length = (player.availableSpace.h_length + player.player.h_length) >= 5
        player.availableSpace.v_length = (player.availableSpace.v_length + player.player.v_length) >= 5
        player.availableSpace.dl_length = (player.availableSpace.dl_length + player.player.dl_length) >= 5
        player.availableSpace.dr_length = (player.availableSpace.dr_length + player.player.dr_length) >= 5

        enemy.availableSpace.h_length = (enemy.availableSpace.h_length + enemy.enemy.h_length) >= 5
        enemy.availableSpace.v_length = (enemy.availableSpace.v_length + enemy.enemy.v_length) >= 5
        enemy.availableSpace.dl_length = (enemy.availableSpace.dl_length + enemy.enemy.dl_length) >= 5
        enemy.availableSpace.dr_length = (enemy.availableSpace.dr_length + enemy.enemy.dr_length) >= 5

    }

}

function gomokuShapeScore(consecutive, openEnds, currentTurn, notSurounded, winnable) {
    if (!winnable) {
        if (consecutive == 2) {
            if (!currentTurn && notSurounded)
                return 20000; // Value player's open 3
        }
        if (consecutive == 3) {
            if (notSurounded)
                return 30000; // Prioritize blocking enemy's open 3
        }
        if (consecutive == 4 && !currentTurn) {
            return 40000; // Prioritize blocking enemy's open 3
        }
        return 0
    }
    if (openEnds == 0 && consecutive < 5 || consecutive == 0)
        return 0;

    switch (consecutive) {
        case 5:
            return 500000; // Winning move has high value

        case 4:
            switch (openEnds) {
                case 1:
                    if (!currentTurn)
                        return 500000; // Prioritize blocking enemy's open 4
                    return 20000; // Value player's open 4
                case 2:
                    if (!currentTurn)
                        return 500000; // Prioritize blocking enemy's open 4
                    return 30500; // Value player's open 4
            }

        case 3:
            switch (openEnds) {
                case 1:
                    if (!currentTurn) {
                        return 50
                    }
                    if (notSurounded)
                        return 30000; // Prioritize blocking enemy's open 3
                    return 200
                case 2:
                    if (!currentTurn)
                        return 400000; // Value player's double open 3
                    return 20000; // Prioritize blocking enemy's double open 3
            }

        case 2:
            switch (openEnds) {
                case 1:
                    if (!currentTurn && notSurounded)
                        return 20000; // Value player's open 3
                    return 0; // Value player's open 2
                case 2:
                    return 100; // Value player's double open 2
            }

        case 1:
            switch (openEnds) {
                case 1:
                    return 0.5; // Value player's open 1
                case 2:
                    return 1; // Value player's double open 1
            }

        default:
            return 200000000; // High value for other cases
    }
}


class Tracker {
    constructor() {
        this.memory = 0
        this.player = 0
    }
}

function deletPiece(x, y, player, board) {
    board[player][y] &= ~(1 << x);
    return board
}

function fling(node) {
    const player = node.player == AI ? 1 : 0
    if (node.fling) {
        deletPiece(node.newPiece.y + node.fling.y, node.newPiece.x + node.fling.x, player, node.board)
        deletPiece(node.newPiece.y + (node.fling.y * 2), node.newPiece.x + (node.fling.x * 2), player, node.board)
    }
}


function calcBoundries(board) {
    let topLeft = { y: BOARD_SIZE, x: BOARD_SIZE }
    let bottomRight = { y: 0, x: 0 }

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (getPiece(i, j, board)) {
                topLeft.y = Math.min(i, topLeft.y)
                topLeft.x = Math.min(j, topLeft.x)
                bottomRight.y = Math.max(i, bottomRight.y)
                bottomRight.x = Math.max(j, bottomRight.x)
            }
        }
    }
    topLeft.y = Math.max(0, topLeft.y - 3)
    topLeft.x = Math.max(0, topLeft.x - 3)
    bottomRight.y = Math.min(BOARD_SIZE, bottomRight.y + 3)
    bottomRight.x = Math.min(BOARD_SIZE, bottomRight.x + 3)
    return { topLeft, bottomRight }
}

const cache = new Map();
var start = performance.now()
function minimax(board, depth, alpha, beta, maximizingPlayer, tracker) {
    // Generate a unique key for the board position
    const key = board.board.toString();

    const end = performance.now();
    const elapsed = end - start
    // Check if the value is already cached
    if (cache.has(key)) {
        tracker.memory++
        return cache.get(key);
    }

    // Check if reached the maximum depth 
    if (elapsed > 500) {
        tracker.player = tracker.player > depth ? tracker.player : depth
        cache.set(key, board.score); // Cache the computed score
        return board.score; // Return the score of the board. (!) because i only calculate the score of the  currently placed piece, i add up the parent score to the current one, 
        // that way the final depth score is actually the score of all the moves taken
    }

    let bestValue = maximizingPlayer ? -Infinity : Infinity; // Initialize the best value
    let validMoves = board.generateMoves(); // Get valid moves for the current board
    if (validMoves.isEmpty()) {
        return board.parent.score
    }
    let bestMove = ""; // Initialize the best move to be returned at the end of the start depth
    while (!validMoves.isEmpty()) {
        let move = validMoves.dequeue(); // Get the next move from the valid moves
        let value = minimax(move, depth - 1, alpha, beta, !maximizingPlayer, tracker); // Recursively call minimax on the child nodes
        if (depth === DEPTH) {
            // If it's the first depth level, update the best move
            bestMove = value > bestValue ? move : bestMove;
        }
        bestValue = maximizingPlayer ? Math.max(bestValue, value) : Math.min(bestValue, value); // Update the best value

        if (maximizingPlayer) {
            alpha = Math.max(alpha, bestValue); // Update alpha value for pruning
        } else {
            beta = Math.min(beta, bestValue); // Update beta value for pruning
        }

        if (alpha >= beta) {
            break; // Perform alpha-beta pruning, this is only effective if the nodes are sorted correctly, from high to low for the maximizingPlayer (ai), and low to high for the HUMAN
        }
    }

    if (depth === DEPTH) {
        console.log(bestMove.scores)
        fling(bestMove)
        return bestMove; // If it's the first depth level, return the board of the best move
    }
    cache.set(key, bestValue); // Cache the computed best value
    return bestValue; // Return the best value at the current depth
}

function winnerCheck(node) {
    const player = node.scores.player
    const maxLength = Math.max(player.player.h_length, player.player.v_length, player.player.dr_length, player.player.dl_length)
    if (maxLength >= 5)
        return true
    return false
}

// Handle messages from the main thread
self.onmessage = function (event) {
    // Create a bit board for each player
    let result = null
    var tracker = new Tracker

    var alpha = Number.NEGATIVE_INFINITY;
    var beta = Number.POSITIVE_INFINITY;

    var isMaximizingPlayer = true;
    // const ret = minimax(node, DEPTH, alpha, beta, isMaximizingPlayer );
    // start =  performance.now()
    const { board, turn, aiPlayer, newPiece } = event.data;

    // Call the minimax function
    // console.clear()
    if (aiPlayer) {
        const node = new Node(board, HUMAN, null, calcBoundries(board), null, DEPTH + 1)
        result = minimax(node, DEPTH, alpha, beta, isMaximizingPlayer, tracker);
        console.log("cach hits", tracker.memory)
        console.log("depth", tracker.player)
        const gameOver = winnerCheck(result)
        result = { newBoard: result.board, valid: true, gameOver: gameOver, fling: (result.fling ? true : false) }

    }
    else {

        const node = new Node(board, turn == 0 ? 1 : 2, newPiece, calcBoundries(board), null, DEPTH + 1)
        fling(node)
        if (node.freeThrees == 2)
            result = { newBoard: null, valid: false }
        else {
            const gameOver = winnerCheck(node)
            result = { newBoard: node.board, valid: true, gameOver: gameOver, fling: (node.fling ? true : false) }
        }

    }
    cache.clear();
    // Send the result back to the main thread
    self.postMessage(result);
};