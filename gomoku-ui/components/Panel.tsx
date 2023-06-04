import React from 'react'

interface Props {
    aiPlayer: boolean,
    replay: any[][],
    captures: { player1: number, player2: number }
    replayIndex: number
    gameOver : number
    setReplayIndex: React.Dispatch<React.SetStateAction<number>>
    setAiPlayer: React.Dispatch<React.SetStateAction<boolean>>
    score: {
        player1: number;
        player2: number;
    }
    setGameOver: React.Dispatch<React.SetStateAction<number>>
    setBoard: React.Dispatch<React.SetStateAction<any[][]>>
}

function Panel({ aiPlayer, setAiPlayer, score, setGameOver, gameOver, captures, replay, replayIndex, setReplayIndex, setBoard }: Props) {
    const handleToggle = () => {
        setAiPlayer(!aiPlayer);
    };

    const handleRestart = () => {

        setGameOver(-1);
    };

    const handleLeftClick = () => {
        if (replayIndex - 1 >= 0){
            setReplayIndex(replayIndex - 1)
        }
    };
    const handleRightClick = () => {
        if (replayIndex + 1 < replay.length){
            setReplayIndex(replayIndex + 1)
        }
    };
    return (
        <div className="flex flex-col justify-center my-6">
            <div className="flex justify-center items-center mb-5">
                <input
                    type="checkbox"
                    id="toggleSwitch"
                    checked={aiPlayer}
                    onChange={handleToggle}
                    className="hidden"
                />
                <label htmlFor="toggleSwitch" className={`relative  inline-flex items-center h-6 rounded-full w-12 cursor-pointer transition-colors ${aiPlayer ? 'bg-sky-500/100' : 'bg-gray-300'}`}>
                    <span className={`inline-block ml-1 w-4 h-4 transform rounded-full transition-transform ${aiPlayer ? 'translate-x-6 bg-white' : 'bg-gray-500'}`} />
                </label>
                <span className="ml-2">Computer</span>
            </div>
            <div className="result mt-5">
                <h1 className='text-4xl'> SCORE </h1>
                <div className='score'>
                    <span className="scorePlayer1 text-3xl"> {score.player1}</span>
                    <span className='delimiter text-3xl'> :</span>
                    <span className="scorePlayer2 text-3xl"> {score.player2}</span>
                </div>
                <div>
                    <span className="namePlayer1 text-2xl"> me</span>
                    <span className='delimiter text-2xl'> </span>
                    <span className="namePlayer2 text-2xl"> {`${aiPlayer ? 'comp' : 'you'}`}</span>
                </div>


                <button onClick={handleRestart} className="w-15 mt-8 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Restart
                </button>

            </div>
            <div className="result">
                <h1 className='text-2xl mt-8'> Captures </h1>
                <div className='score'>
                    <span className="scorePlayer1 text-xl"> {captures.player1}</span>
                    <span className='delimiter text-xl'> :</span>
                    <span className="scorePlayer2 text-xl"> {captures.player2}</span>
                </div>
                <div>
                    <span className="namePlayer1"> me</span>
                    <span className='delimiter'> </span>
                    <span className="namePlayer2"> {`${aiPlayer ? 'comp' : 'you'}`}</span>
                </div>
            </div>
            {gameOver &&
            <div className="result">
                <div className='flex  flex-row mt-8 justify-center '>

                    <h1 className='text-xl'>Replay </h1>
                    <div className="h-0 w-0 mt-2 ml-2 border-y-8 border-y-transparent border-l-[14px] border-l-blue-600"></div>
                </div>

                <div className='my-4 flex justify-center'>

                    <button onClick={handleLeftClick} type="button" className="text-blue-700 mr-2 border  border-gray-400  shadow focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center ml-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                        <svg aria-hidden="true" className="w-5 h-5 transform rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>

                    <button onClick={handleRightClick} type="button" className="text-blue-700 ml-2 border  border-gray-400  shadow  focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>

            }

        </div>
    )
}

export default Panel