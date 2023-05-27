"use client"; // This is a client component 👈🏽
import Image from 'next/image'
import styles from './page.module.css'
import { Grid } from '@/components/Grid'

import {useState } from 'react'
export default function Home() {
  const size = 19;
  const initialBoard = [
    new Array(19).fill(0), // Player 1's bit board
    new Array(19).fill(0), // Player 2's bit board
  ];
  
  const [board, setBoard] = useState(initialBoard);

  return (
    <main >
      <Grid board={board} setBoard={setBoard} />
    </main>
  )
}
