"use client"; // This is a client component 👈🏽
import Image from 'next/image'
import styles from './page.module.css'
import { Grid } from '@/components/Grid'

import {useState, useEffect } from 'react'
import { get } from 'http';
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
  board[1][x] |= 1 << y;
  return board
}



export default function Home() {
  const size = 19;
  const initialBoard = [
    new Array(19).fill(0), // Player 1's bit board
    new Array(19).fill(0), // Player 2's bit board
  ];
  const [board, setBoard] = useState(initialBoard);
  // useEffect ( ()=>{
  //   console.clear()
  //   for (let i = 0; i < 19; i++){
  //     for (let j = 0; j < 19; j++){
  //       const piece = getPiece(j,i,board)
  //       if (piece == 1)
  //         console.log(`setPiece(${i}, ${j}, 0, board)`)
  //         else     if (piece == 2)
  //         console.log(`setPiece(${i}, ${j}, 1, board)`)
  //     }
  //   }

  // },[board])

  return (
    <main >
      <Grid board={board} setBoard={setBoard} />
    </main>
  )
}
