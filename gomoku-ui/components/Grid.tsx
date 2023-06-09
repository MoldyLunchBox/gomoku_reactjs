"use client"; // This is a client component 👈🏽
import React from 'react'
import { counterMove } from "../gameLogic/main"

const { log } = console
interface Props {
  board: any[][],
  turn: number,
  aiPlayer: boolean,
  gameOver: number,
  replay: any[][],
  captures: { player1: number, player2: number }
  possibleGameOver: number
  prevMove: { y: number, x: number }
  setPrevMove: React.Dispatch<React.SetStateAction<{ y: number, x: number }>>
  setPossibleGameOver: React.Dispatch<React.SetStateAction<number>>
  setTurn: React.Dispatch<React.SetStateAction<number>>
  setBoard: React.Dispatch<React.SetStateAction<any[][]>>
  setGameOver: React.Dispatch<React.SetStateAction<number>>
  setScore: React.Dispatch<React.SetStateAction<{
    player1: number;
    player2: number;
  }>>
  setCaptures: React.Dispatch<React.SetStateAction<{
    player1: number;
    player2: number;
  }>>
  setReplay: React.Dispatch<React.SetStateAction<any[][]>>

}
function getPiece(x: number, y: number, board: any[][]) {
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

function setPiece(x: number, y: number, player: number, board: any[][]) {
  board[player][y] |= 1 << x;
  return board
}

export const Grid = ({ board, turn, aiPlayer, setTurn,
  setBoard, gameOver, setGameOver, setScore, setCaptures,
  captures, replay, setReplay, setPossibleGameOver, possibleGameOver,
  prevMove, setPrevMove }: Props) => {

  const handleClick = async (e: any) => {
    console.clear()

    const i = parseInt(`${e.target.id / 19}`)
    const j = e.target.id % 19
    if (getPiece(i, j, board) == 0) {

      let result = null
      const newboard = JSON.parse(JSON.stringify(board))
      setPiece(i, j, turn, newboard)
      const start = performance.now();
      // human player plays
      result = await counterMove(newboard, turn, false, { y: i, x: j })
      if (aiPlayer && result.valid) {
        if (result.fling)
          setCaptures({ player1: captures.player1 + 1, player2: captures.player2 })
        const replays = replay
        replays.push(result.newBoard)
        setReplay(replays)
        setBoard(result.newBoard)
        if (result.gameOver) {
          setGameOver(1)
        }
        else
          result = await counterMove(result.newBoard, 1, aiPlayer, { y: i, x: j })
        if (result.fling)
          setCaptures({ player1: captures.player1, player2: captures.player2 + 1 })

      }
      const end = performance.now();
      const elapsed = end - start;
      console.log("time:", elapsed.toFixed(2))
      if (result.valid) {
        if (!aiPlayer) {
          if (result.fling) {
            if (turn)
              setCaptures({ player1: captures.player1 + 1, player2: captures.player2 })
            else
              setCaptures({ player1: captures.player1, player2: captures.player2 + 1 })
          }
          if (result.gameOver)
            setGameOver(turn == 1 ? 1 : 2)
          else
            setTurn(turn ? 0 : 1)
        }
        else if (result.gameOver)
          setGameOver(2)
        const replays = replay
        replays.push(result.newBoard)
        setReplay(replays)
        setBoard(result.newBoard)

      }
    }
  }
  return (
    <div className="flex justify-center items-center">
      <div className="w-[600px]">

        <div className='grid grid-cols3 h-full w-full bg-white shadow-md shadow-[#434141] ' >
          {board[1].map((_, i) => (
            board[1].map((_, j) => (
              <div id={`${(i * 19) + j}`} className={`square cursor-pointer z-10 }`} onClick={!gameOver ? handleClick : ((e) => (console.log("game over")))} key={(i * 19) + j}>
                <div className='horizontal-line top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0'></div>
                <div className='vertical-line top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0'></div>
                <div className={`w-full h-full absolute pointer-events-none ${getPiece(i, j, board) == 2 ? 'bg-[#4169e1] rounded-full' : getPiece(i, j, board) == 1 ? 'bg-[#ff6347] rounded-full' : ''}`}></div>
                {/* <h2 className={`top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  pointer-events-none`}>{getPiece(i, j, board)}</h2> */}
              </div>
            ))
          ))
          }
        </div>

      </div>

    </div>
  )
}
