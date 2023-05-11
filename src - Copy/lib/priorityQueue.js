/**
 * prototyping the queue system to manage a list of nodes where 
 * every new element is put in correct position to make 
 * an ASC list by score value
 */
export default class PriorityQueue {
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
            if (this.items[i].score < elem.score){
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


function minimax(position, depth, aiPlayer, alpha, beta, tracker) {

    var bestMove = null
    if (depth === 0 || (aiPlayer && position.longestRow("X") == 5) || (!aiPlayer && position.longestRow("O") == 5)) {
        if (aiPlayer)
            return ((position.longestRow("X") * 10) + position.connectedPieces("X") )

        else
            return ((position.longestRow("O") * 10) + position.connectedPieces("O") )


    }

    let key = position.board.join("");
    if (memo.hasOwnProperty(key)) { // Check if we've evaluated this board before
        return memo[key];
      }
    let bestValue = aiPlayer ? -Infinity : Infinity;

    const subPositions = aiPlayer ? position.subPosition("X") : position.subPosition("O")

    while (!subPositions.isEmpty()) {
        const move = subPositions.dequeue()
        tracker.memory++
        var  value = minimax(move, depth - 1, !aiPlayer, alpha, beta, tracker).value;
            bestMove = value > bestValue ? move : bestMove
        bestValue = aiPlayer ? Math.max(bestValue, value) : Math.max(bestValue, value);

        if (aiPlayer) 
            alpha = Math.max(alpha, value);
        else 
            beta = Math.min(beta, value);
        
        if (beta <= alpha)
            break;
        
        // if (depth == DEPTH - 1){
        //     log(move.board)
        //     log('best move board', bestMove)
        //     log('score', move.score, 'value', value,"\n\n-----------------\n\n")
        // //     log("value", value, "\nbestvalue", bestValue,"\nalpha",alpha,"\nbeta", beta)
        // //     // console.log("X",((move.longestRow("X") * 10) + move.connectedPieces("X")) )
        // //     // log("O",  ((move.longestRow("O") * 10) + move.connectedPieces("O")))
        // //     log("total",  (move.longestRow("X") * 10) + move.connectedPieces("X") + move.blockEnemy("O"))
        // }
    }
    // if (depth == DEPTH-1)
    // exit()
    memo[key] = bestValue
    if (depth == DEPTH) {
        return bestMove
    }
    return bestValue;

}