import React from 'react'

interface Props {
    aiPlayer: boolean,
    setAiPlayer: React.Dispatch<React.SetStateAction<boolean>>
}

function Panel({ aiPlayer, setAiPlayer }: Props) {
    const handleToggle = () => {
        setAiPlayer(!aiPlayer);
    };
    return (
        <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center my-5">
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
                <h1 className='text-3xl'> Results </h1>
                <div className='score'></div>
                <span className="scorePlayer1"> me</span>
                <span className='delimiter'> :</span>
                <span className="scorePlayer2"> me</span>

            </div>


        </div>
    )
}

export default Panel