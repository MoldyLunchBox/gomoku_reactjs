"use client"; // This is a client component 👈🏽
import Image from 'next/image'
import styles from './page.module.css'
import { Grid } from '@/components/Grid'

import { useState, useEffect } from 'react'
import { get } from 'http';
import Article from '@/components/Article';
import Panel from '@/components/Panel';
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

function setPiece(x: number, y: number, board: any[][]) {
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
  const [turn, setTurn] = useState(1)
  const [aiPlayer, setAiPlayer] = useState(true)
  const [gameOver, setGameOver] = useState(0)
  const [score, setScore] = useState({player1: 0, player2: 0})
  useEffect(()=>{
    if (gameOver == 1)
      setScore({player1: score.player1 + 1, player2: score.player2})
    else if (gameOver == 2)
      setScore({player1: score.player1 , player2: score.player2 + 1})
    else{
      const initialBoard = [
        new Array(19).fill(0), // Player 1's bit board
        new Array(19).fill(0), // Player 2's bit board
      ];
      setBoard(initialBoard)
      setGameOver(0)
    }
      
    
  },[gameOver])
  useEffect(()=>{
    const initialBoard = [
      new Array(19).fill(0), // Player 1's bit board
      new Array(19).fill(0), // Player 2's bit board
    ];
    setBoard(initialBoard)
    setGameOver(0)
    setTurn(1)
    setScore({player1: 0, player2: 0})
  },[aiPlayer])
  useEffect(() => {
    // console.clear()
    // for (let i = 0; i < 19; i++){
    //   for (let j = 0; j < 19; j++){
    //     const piece = getPiece(j,i,board)
    //     // if (piece == 1)
    //     //   console.log(`setPiece(${i}, ${j}, 0, board)`)
    //         if (piece == 2)
    //       console.log(`setPiece(${i}, ${j}, 1, board)`)
    //   }
    // }
    // setPiece(6, 2, board) 
    // setPiece(6, 3, board)
  },)

  return (
    <main className='  h-full bg-gradient-to-b from-cyan-500 to-blue-500'>
      <div className='container mx-auto px-4'>

      <div className="flex flex-row flex-wrap justify-center ">
        <div className="basis-2/3">
          <Grid board={board} turn={turn} aiPlayer={aiPlayer} setTurn={setTurn} setBoard={setBoard} gameOver={gameOver} setGameOver={setGameOver} setScore={setScore}/>
        </div>
        <div className=" bg-white basis-1/3">
          <Panel aiPlayer={aiPlayer} setAiPlayer={setAiPlayer} score={score} setGameOver={setGameOver}/>
        </div>
      </div>
      <Article />
      </div>
    </main>
  )
}
