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
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  const [captures, setCaptures] = useState({ player1: 0, player2: 0 })
  const [replay, setReplay] = useState<any[][]>([]);
  const [replayIndex, setReplayIndex] = useState(0);
  const [possibleGameOver, setPossibleGameOver] = useState(0)
  const [prevMove, setPrevMove] = useState({x: 0, y: 0})
  useEffect(() => {
    console.log("replay lenth", replay.length)
    if (gameOver == 1){
      setReplayIndex(replay.length - 1)
      setScore({ player1: score.player1 + 1, player2: score.player2 })
    }
    else if (gameOver == 2){
      setReplayIndex(replay.length - 1)
      setScore({ player1: score.player1, player2: score.player2 + 1 })
    }
    else {
      const initialBoard = [
        new Array(19).fill(0), // Player 1's bit board
        new Array(19).fill(0), // Player 2's bit board
      ];
      setReplay([])
      setBoard(initialBoard)
      setReplayIndex(0)
      setGameOver(0)
    }
    setCaptures({ player1: 0, player2: 0 })


  }, [gameOver])
  useEffect(()=>{
    console.log(replay[replayIndex])
    if (gameOver)
    setBoard(replay[replayIndex ])

  },[replayIndex])
  useEffect(() => {
    const initialBoard = [
      new Array(19).fill(0), // Player 1's bit board
      new Array(19).fill(0), // Player 2's bit board
    ];
    setBoard(initialBoard)
    setGameOver(0)
    setTurn(1)
    setScore({ player1: 0, player2: 0 })
  }, [aiPlayer])

  useEffect(() => {
    if (captures.player1 == 4) {
      setGameOver(1)
      setCaptures({ player1: 0, player2: 0 })
    }
    else if ((captures.player2 == 4)) {
      setGameOver(2)
      setCaptures({ player1: 0, player2: 0 })
    }
  })
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
    <main className='  h-full bg-gradient-to-b from-cyan-500 to-blue-500 my-10'>
      <div className='container mx-auto px-4'>
        <div className="flex flex-row flex-wrap justify-center ">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Gomoku <mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">ONLINE</mark></h1>
        </div>
        <div className="flex flex-row flex-wrap justify-center ">
          <div className="basis-2/3 mb-5">
            <Grid board={board} turn={turn} aiPlayer={aiPlayer} setTurn={setTurn} setBoard={setBoard}
             gameOver={gameOver} setGameOver={setGameOver} setScore={setScore} 
             captures={captures} setCaptures={setCaptures} replay={replay} setReplay={setReplay}
             possibleGameOver={possibleGameOver} setPossibleGameOver={setPossibleGameOver}
             prevMove={prevMove} setPrevMove={setPrevMove}/>
          </div>
          <div className=" bg-white w-full md:w-1/3 max-w-[600px] max-h-[600px] shadow-md shadow-[#434141]">
            <Panel aiPlayer={aiPlayer} setAiPlayer={setAiPlayer} score={score} setGameOver={setGameOver}
             captures={captures} replay={replay} replayIndex={replayIndex} setReplayIndex={setReplayIndex}
             setBoard={setBoard} gameOver={gameOver}/>
          </div>
        </div>
        <Article />
      </div>
    </main>
  )
}
