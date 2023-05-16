## gomoku_reactjs (javascript Reactjs)
 The goal of this project is to create a web app implementation of the board game Gomoku, also known as Five in a Row, where two players take turns placing their pieces on a board with the objective of placing five pieces in a row horizontally, vertically, or diagonally. The implementation should allow players to input their moves should also handle win conditions and error checking for invalid moves. two players can both be human or one human against computer ai, the last one is where the difficulty lays in this project

### Todo list
- [ ] create a console based implementation of the game where two human players can take turns placing the pieces. 
- [ ] concider efficiency in every way possible
- - [ ] represent the board using bigInt
- - [ ] alpha beta pruning to elemenate non valid moves
- - [ ] cache the scores somehow
- - [ ] pre calculate the next move while during the player's turn
- [ ] evaluate each user input (error check)
- [ ] add a win check
- [ ] create a todo list for how to handle the AI player


### Run the code :
```
- npm install
- npm run dev
```


### Example of input/output:
- for now its console based so the input is `` row column`` ex: `` 0 0``

output
```
X . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
```

function minimax(position, depth, computerPlayer) {
  if (depth == 0) {
    return the heuristic value of the position
  }

  if (computerPlayer) {
    bestValue = -Infinity
    for (each possible move m) {
      newPosition = position after applying m
      value = minimax(newPosition, depth - 1, false)
      bestValue = max(bestValue, value)
    }
    return bestValue
  } else {
    bestValue = Infinity
    for (each possible move m) {
      newPosition = position after applying m
      value = minimax(newPosition, depth - 1, true)
      bestValue = min(bestValue, value)
    }
    return bestValue
  }
}