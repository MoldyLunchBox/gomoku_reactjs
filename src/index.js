const { exit } = require('process');
const readline = require('readline');
const BOARD_EMPTY_CHAR = '.'
const BOARD_SIZE = 19
const AI = 1
const HUMAN = 2
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { log } = console
const DEPTH = 3;




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


class Node {
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
        const e_h = gomokuShapeScore(enemy.enemy.h_length, (enemy.ends.left != AI ? 1 : 0) + (enemy.ends.right != AI ? 1 : 0), true, this.newPiece)
        const e_v = gomokuShapeScore(enemy.enemy.v_length, (enemy.ends.bottom != AI ? 1 : 0) + (enemy.ends.top != AI ? 1 : 0), true, this.newPiece)
        const e_dl = gomokuShapeScore(enemy.enemy.dl_length, (enemy.ends.dbl != AI ? 1 : 0) + (enemy.ends.dtr != AI ? 1 : 0), true, this.newPiece)
        const e_dr = gomokuShapeScore(enemy.enemy.dr_length, (enemy.ends.dbr != AI ? 1 : 0) + (enemy.ends.dtl != AI ? 1 : 0), true, this.newPiece)
        const score = p_h + p_v + p_dl + p_dr + e_h + e_v + e_dl + e_dr + (this.parent ? this.parent.score : 0)
        if (this.depth == DEPTH && score > 60){
          printBoard(this.board)
            log(this.newPiece , " :")
            log(p_h, p_v, p_dl, p_dr, e_h, e_v, e_dl, e_dr)
            log("score", score)
        }
        this.debug = { p_h, p_v, p_dl, p_dr, e_h, e_v, e_dl, e_dr }
        return (score)
    }
    validateScores(){
        this.scores.player.player.h_length = this.scores.player.availableSpace.h_length + this.scores.player.player.h_length >= 5 ? this.scores.player.player.h_length : 0
        this.scores.player.player.v_length = this.scores.player.availableSpace.v_length + this.scores.player.player.v_length >= 5 ? this.scores.player.player.v_length : 0
    
        this.scores.player.player.dl_length = this.scores.player.availableSpace.dl_length + this.scores.player.player.dl_length >= 5 ? this.scores.player.player.dl_length : 0
        this.scores.player.player.dr_length = this.scores.player.availableSpace.dr_length + this.scores.player.player.dr_length >= 5 ? this.scores.player.player.dr_length : 0
    
    }

}

function gomokuShapeScore(consecutive, openEnds, currentTurn, newPiece) {
    // if (newPiece.y == 1 && newPiece.x == 2)
    //     log(consecutive, openEnds)
    if (openEnds == 0 && consecutive < 5 || consecutive == 0)
        return 0;
    switch (consecutive) {
        case 5:
            return 400000 * 2;
        case 4:
            switch (openEnds) {
                case 1:
                    if (currentTurn)
                        return 20900;
                    return 500000;
                case 2:
                    if (currentTurn)
                        return 20900;
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



class Tracker {
    constructor() {
        this.memory = 0
        this.player = 0
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



function minimax(board, depth, alpha, beta, maximizingPlayer) {
    // depth == 0 || board.isTerminalNode
    if (depth == 0) {
        return board.score;
    }
    //   let key = board.join(""); // Convert the board to a string to use as a hash key
    //   if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
    //     return memo[key];
    //   }

    let bestValue = maximizingPlayer ? -Infinity : Infinity;
    let i = 0
    let validMoves = board.generateMoves()
    let bestMove = ""
    while (!validMoves.isEmpty() && i < 9) {
        let move = validMoves.dequeue();
        printBoard(move.board)
        log(move.debug)
    
        log(move.score)
         log("\n")
        // let value = minimax(move, depth - 1, alpha, beta, !maximizingPlayer);
        // if (depth == DEPTH)  // prior to return to main, we make sure we capture which move had the best score so we can return it {
        //     bestMove = value > bestValue ? move : bestMove
        // bestValue = maximizingPlayer ? Math.max(bestValue, value) : Math.min(bestValue, value);
        // if (maximizingPlayer)
        //     alpha = Math.max(alpha, bestValue);
        // else
        //     beta = Math.min(beta, bestValue);
        // if (alpha >= beta)
        //     break;
        i++
    }
    exit()
    if (depth == DEPTH) {
        printBoard(bestMove.board)
        console.log("these are the scores:")
        console.log(bestMove.scores)
        return bestMove.board
    }
    //   memo[key] = bestValue; // Store the evaluation result for this board position
    return bestValue;
}



async function getPlayerMove(board) {
  let input = false
  var answer = {}
  while (!input) {

    answer = await new Promise((resolve) => {
      rl.question(`Place your piece: `, (answer) => {
        resolve(answer);
      });
    });
    // if (inputIsValid(answer, board))
    input = !input
  }
  answer = { row: answer.split(" ")[0], col: answer.split(" ")[1] }
  return answer
}
function preFillBoard(player, board) {
  for (let i = 0; i < player.pieces.length; i++) {
    board[player.pieces[i].row][player.pieces[i].col] = player.piece
  }
}



async function main() {

  // Create a bit board for each player
  let board = [
    new Array(19).fill(0), // Player 1's bit board
    new Array(19).fill(0), // Player 2's bit board
  ];

  // Function to set a stone at the given position for the specified player


  // Set a stone for Player 1 at position (2, 1)
  const x = 2;
  const y = 1;
  const player = 0;
  const player2 = 1;


  setPiece(5, 7,  0, board)
  setPiece(4, 6,  1, board)
  setPiece(3, 5,  1, board)
  setPiece(2, 4,  1, board)
  setPiece(1, 3,  1, board)
  setPiece(3, 4,  0, board)
  setPiece(4, 3,  0, board)
  setPiece(2, 5,  0, board)

  let tracker = new Tracker()

  const alpha = Number.NEGATIVE_INFINITY;
  const beta = Number.POSITIVE_INFINITY;

  const isMaximizingPlayer = true;
  let time = 0
  let HumanTurn = true
  let node = null
  while (true) {
    log("time", time)
    log(board)
    printBoard(board)
    console.log("memory", tracker.memory)
    if (HumanTurn) {
      var newMove = await getPlayerMove(board)
      setPiece(newMove.row, newMove.col, 1, board)
      log("aaaaaaaa", newMove)
      console.log("oooooooooooooo", calcBoundries(board))
      node = new Node(board, HUMAN, { y: newMove.row, x: newMove.col }, calcBoundries(board), null, DEPTH + 1)
    }
    else {
      const start = process.hrtime();
      board = minimax(node, DEPTH, alpha, beta, isMaximizingPlayer, tracker);
      time = process.hrtime(start);
    }
    log("---------------------")
    HumanTurn = !HumanTurn
  }
}
main()