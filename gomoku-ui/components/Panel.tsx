import React from 'react'

interface Props {
    aiPlayer: boolean,
    setAiPlayer: React.Dispatch<React.SetStateAction<boolean>>
    score: {
        player1: number;
        player2: number;
    }
  setGameOver: React.Dispatch<React.SetStateAction<number>>
  captures: { player1: number, player2: number }

}

function Panel({ aiPlayer, setAiPlayer, score, setGameOver, captures }: Props) {
    const handleToggle = () => {
        setAiPlayer(!aiPlayer);
    };
    const handleRestart = () => {

        setGameOver(-1);
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
            <div className="result">
                <h1 className='text-3xl'> SCORE </h1>
                <div className='score'>
                    <span className="scorePlayer1"> {score.player1}</span>
                    <span className='delimiter'> :</span>
                    <span className="scorePlayer2"> {score.player2}</span>
                </div>
                <div>
                    <span className="namePlayer1"> me</span>
                    <span className='delimiter'> </span>
                    <span className="namePlayer2"> {`${aiPlayer ? 'comp' : 'you'}`}</span>
                </div>

        
                <button onClick={handleRestart} className="w-15 mt-8 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Restart
                </button>
      
            </div>
            <div className="result">
                <h1 className='text-xl mt-8'> Captures </h1>
                <div className='score'>
                    <span className="scorePlayer1"> {captures.player1}</span>
                    <span className='delimiter'> :</span>
                    <span className="scorePlayer2"> {captures.player2}</span>
                </div>
                <div>
                    <span className="namePlayer1"> me</span>
                    <span className='delimiter'> </span>
                    <span className="namePlayer2"> {`${aiPlayer ? 'comp' : 'you'}`}</span>
                </div>

        
             
      
            </div>


        </div>
    )
}

export default Panel