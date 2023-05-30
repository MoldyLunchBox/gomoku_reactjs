import PriorityQueue from "./priorityQueue"
const {log} = console
const BOARD_SIZE = 19
const AI = 1
const HUMAN = 2
const EMPTY_PIECE = 0
const RANGE = 6
function printBoard(board) {
    console.log("\n")
    for (let i = 0; i < BOARD_SIZE; i++) {
        let line = ''
        for (let j = 0; j < BOARD_SIZE; j++) {
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


export class Node {
    constructor(board, player, newPiece, boundries, parent, depth) {
        this.board = board
        this.newPiece = newPiece
        this.player = player
        this.boundries = boundries
        this.parent = parent
        this.debug = ""
        this.depth = depth
        // console.log(boundries)
        // calculate longest row in every direction
        if (newPiece) {
            this.scores = this.calculateScores(board)
            this.score = this.heuristics() * this.depth

        }
        else
        this.score = 0
    }
    generateMoves() {
        let positions = new PriorityQueue()
        for (let i = this.boundries.topLeft.y ; i < this.boundries.bottomRight.y; i++) {
            for (let j = this.boundries.topLeft.x; j < this.boundries.bottomRight.x; j++) {
                if (getPiece(i, j, this.board) === EMPTY_PIECE) {
                    const newPosition = JSON.parse(JSON.stringify(this.board))
                    setPiece(i, j, this.player == AI ? 1 : 0, newPosition)
                    positions.enqueue(new Node(newPosition, this.player == AI ? HUMAN : AI, { y: i, x: j }, this.boundries, this, this.depth - 1))
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
                h_length: 1,   // length of the actual row
                h_move: true,  // state of the row   true for available, false for ended
                v_length: 1,
                v_move: true,
                dr_length: 1,
                dr_move: true,
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




        for (let j = 1; j < RANGE; j++) {

            // Calculate horizontal score
            piece = getPiece(this.newPiece.y, this.newPiece.x + (j * sign), this.board)
            if (this.newPiece.x + (j * sign) < BOARD_SIZE && this.newPiece.x + (j * sign) >= 0) {  // range condition
                if (streak.player.h_move && piece === (this.player))
                    streak.player.h_length++
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
            // if (this.newPiece.y == 0 && this.newPiece.x == 0) {

            //     console.log("debug: ----------")
            //     console.log( streak.player.h_length, sign, this.newPiece.x , (j * sign), piece)
            //     console.log("-----<")
            // }


            // Calculate vertical score for player

            piece = getPiece(this.newPiece.y + (j * sign), this.newPiece.x, this.board)
            if (this.newPiece.y + (j * sign) < BOARD_SIZE && this.newPiece.y + (j * sign) >= 0) {  // range condition

                if (streak.player.v_move && piece === (this.player))
                    streak.player.v_length++
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
                if (streak.player.dr_move && piece === (this.player))
                    streak.player.dr_length++
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

                if (streak.player.dl_move && piece === (this.player))
                    streak.player.dl_length++
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
        return streak
    }
    enemyRowsLength() {

        let streak = {
            enemy: {
                h_length: 0,   // length of the actual row
                h_move: true,  // state of the row   true for available, false for ended
                v_length: 0,
                v_move: true,
                dr_length: 0,
                dr_move: true,
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
                if (streak.enemy.h_move && piece === (enemy))
                    streak.enemy.h_length++
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

                if (streak.enemy.v_move && piece === (enemy))
                    streak.enemy.v_length++
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
                if (streak.enemy.dr_move && piece === (enemy))
                    streak.enemy.dr_length++
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

                if (streak.enemy.dl_move && piece === (enemy))
                    streak.enemy.dl_length++
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
        return streak
    }


    heuristics() {
        const player = this.scores.player
        const enemy = this.scores.enemy

        // analysing and asigning score to player pieces
        const p_h = gomokuShapeScore(player.player.h_length, (player.ends.left != HUMAN ? 1 : 0) + (player.ends.right != HUMAN ? 1 : 0), false, this.newPiece)
        const p_v = gomokuShapeScore(player.player.v_length, (player.ends.bottom != HUMAN ? 1 : 0) + (player.ends.top != HUMAN ? 1 : 0), false, this.newPiece)
        const p_dl = gomokuShapeScore(player.player.dl_length, (player.ends.dbl != HUMAN ? 1 : 0) + (player.ends.dtr != HUMAN ? 1 : 0), false, this.newPiece)
        const p_dr = gomokuShapeScore(player.player.dr_length, (player.ends.dbr != HUMAN ? 1 : 0) + (player.ends.dtl != HUMAN ? 1 : 0), false, this.newPiece)

        // analysing and asigning score to enemy pieces
        const e_h = gomokuShapeScore(enemy.enemy.h_length, (enemy.ends.left != AI ? 1 : 0) + (enemy.ends.right != AI ? 1 : 0),true, this.newPiece)
        const e_v = gomokuShapeScore(enemy.enemy.v_length, (enemy.ends.bottom != AI ? 1 : 0) + (enemy.ends.top != AI ? 1 : 0),true, this.newPiece)
        const e_dl = gomokuShapeScore(enemy.enemy.dl_length, (enemy.ends.dbl != AI ? 1 : 0) + (enemy.ends.dtr != AI ? 1 : 0),true, this.newPiece)
        const e_dr = gomokuShapeScore(enemy.enemy.dr_length, (enemy.ends.dbr != AI ? 1 : 0) + (enemy.ends.dtl != AI ? 1 : 0),true, this.newPiece)
// if (this.newPiece.y == 1 && this.newPiece.x == 2){

//     log(this.newPiece , " :")
//     log(p_h, p_v, p_dl, p_dr, e_h, e_v, e_dl, e_dr)

// }
this.debug = {p_h , p_v , p_dl , p_dr , e_h , e_v , e_dl , e_dr}
const score = p_h + p_v + p_dl + p_dr + e_h + e_v + e_dl + e_dr + (this.parent ? this.parent.score : 0)
return (score)
    }
 
}


function gomokuShapeScore(consecutive, openEnds, currentTurn, newPiece) {
    // if (newPiece.y == 1 && newPiece.x == 2)
    //     log(consecutive, openEnds)
	if (openEnds == 0 && consecutive < 5 || consecutive == 0)
		return 0;
	switch (consecutive) {
        case 5:
			return 400000* 2;
		case 4:
			switch (openEnds) {
				case 1:
					if (currentTurn)
						return 20000;
					return 500000;
				case 2:
					if (currentTurn)
						return 20000;
					return 500000;
			}
		case 3:
			switch (openEnds) {
				case 1:
					if (currentTurn)
						return 7;
					return 5;
				case 2:
					if (currentTurn)
						return 400000;
					return 20010;
			}
		case 2:
			switch (openEnds) {
				case 1:
					return 2;
				case 2:
					return 5;
			}
		case 1:
			switch (openEnds) {
				case 1:
					return 0.5;
				case 2:
					return 1;
			}
		default:
			return 200000000;
	}
}