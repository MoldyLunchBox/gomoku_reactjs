import React from 'react'

function Panel() {
    return (
        <div className="flex justify-center">

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