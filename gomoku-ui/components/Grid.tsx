"use client"; // This is a client component 👈🏽
import React from 'react'
import {counterMove} from "../gameLogic/main"

const { log } = console
interface Props {
  board: any[][],
  setBoard: React.Dispatch<React.SetStateAction<any[][]>>
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

function setPiece(x: number, y: number, board: any[][])  {
  board[1][y] |= 1 << x;
  return board
}

export const Grid = ({ board, setBoard }: Props) => {
  const   handleClick = async(e: any) => {
    const i = parseInt(`${e.target.id / 19}`)
    const j = e.target.id % 19
    
    const newboard = Array.from(setPiece(i, j, board))
    setBoard(newboard)
    // console.log(i, j, e.target.id, e.target.id / 19)
    const start = performance.now();
    const ok = await counterMove(board)
    const end = performance.now();
    const elapsed = end - start;
    console.log("time:", elapsed.toFixed(2))
    setBoard(ok)
  }
  return (
    <div className="flex justify-center items-center">
      <div className="w-[961px]">

        <div className='grid grid-cols3 gap-1 h-full w-full ' >
          {board[1].map((_, i) => (
            board[1].map((_, j) => (
              <div id={`${(i * 19) + j}`} className={`square cursor-pointer ${getPiece(i, j, board) == 2 ? 'bg-red-400' : getPiece(i, j, board) == 1 ? 'bg-blue' : 'bg-[#008080]'}`} onClick={handleClick} key={(i*19) + j}>
                <h2 className={`top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  pointer-events-none`}>{getPiece(i, j, board)}</h2>
              </div>
            ))
          ))
          }
        </div>

      </div>

    </div>
  )
}
