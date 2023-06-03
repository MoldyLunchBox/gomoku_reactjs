

export async function counterMove(board, turn, aiPlayer, newPiece) {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');
    // Handle messages from the worker
    worker.onmessage = function(event) {
      const result = event.data;
      resolve(result);
      worker.terminate();
    };

    // Call the worker with the task
    worker.postMessage({
      board: board,
      turn: turn,
      aiPlayer: aiPlayer,
      newPiece: newPiece
    });
  });
}
