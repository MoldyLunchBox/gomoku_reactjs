function minimax(position, depth, aiPlayer, alpha, beta, tracker) {
    var bestMove = null
    if (aiPlayer) {

        if (depth === 0 || position.longestRow("X") == 5) {
            if (aiPlayer)
            return ((position.longestRow("X") * 10) + position.connectedPieces("X") + position.blockEnemy("O")) 

            else
            return ((position.longestRow("O") * 10) + position.connectedPieces("O") + position.blockEnemy("X")) 


        }
        let bestValue = -Infinity;
        const subPositions = position.subPosition("X")
        // subPositions.sort((b, a) => 
        // ((a.longestRow("X") * 10) + a.connectedPieces("X") + a.blockEnemy("O")) - ((b.longestRow("X") * 10) + b.connectedPieces("X") + b.blockEnemy("O") )  );
        // // ((a.longestRow("O") * 10) + a.connectedPieces("O")) - ((b.longestRow("O") * 10) + b.connectedPieces("O"))
    // console.log(subPositions)
    while (!subPositions.isEmpty()){
        const move = subPositions.dequeue()
        tracker.memory++
            let value = minimax(move, depth - 1, false, alpha, beta, tracker);
            bestMove = value > bestValue ? move : bestMove
            bestValue = Math.max(bestValue, value);
            alpha = Math.max(alpha, value);
            if (beta <= alpha) {
    
                break;
            }
            // if (depth == DEPTH){
            //     log(move.board,"\n\n")
            //     log('best move board', bestMove)
            //     log("value", value, "\nbestvalue", bestValue,"\nalpha",alpha,"\nbeta", beta)
            //     // console.log("X",((move.longestRow("X") * 10) + move.connectedPieces("X")) )
            //     // log("O",  ((move.longestRow("O") * 10) + move.connectedPieces("O")))
            //     log("total",  (move.longestRow("X") * 10) + move.connectedPieces("X") + move.blockEnemy("O"))
            // }
        }
    
        // exit()
        if (depth == DEPTH){
            // console.log((bestMove.longestRow("X") * 2) + bestMove.connectedPieces("X"), "=", bestMove.longestRow("X"), "x 2 +", bestMove.connectedPieces("X") )
            return bestMove
        }
        return bestValue;
    } else {

        if (depth === 0 || position.longestRow("O") == 5) {
       
            // return (position.longestRow("O") * 10) + position.connectedPieces("O")
            return (position.longestRow("O") * 10) + position.connectedPieces("O") 
            

        }
        let bestValue = Infinity;
        const subPositions = position.subPosition("O")
        while (!subPositions.isEmpty()){
            const move = subPositions.dequeue()
            tracker.player++
            let value = minimax(move, depth - 1, true, alpha, beta, tracker);
            bestValue = Math.min(bestValue, value);
                bestValue = Math.max(bestValue, value);
                beta = Math.min(beta, value);
                if (beta <= alpha) {
                    // log("exited")
                    break;
                }   
            } 

        
        // if (depth == DEPTH - 1)
        //     exit()

        if (depth ==  DEPTH)
            return bestMove
        return bestValue;
    }
}