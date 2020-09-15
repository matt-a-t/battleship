import React from 'react';
import ships from '../data/ships';
import DirectionButtons from './DirectionButtons';
import ShipButtons from './ShipButtons';

function GameStatus({ status, setStatus }) {
  const shipKeys = Object.keys(ships);
  
  function checkFinishedPlacing() {
    for (let i=0; i < shipKeys.length; i++) {
      if (status.placement[shipKeys[i]].length < 1) {
        return false;
      }
    }
    return true;
  }

  function finishedPlacing() {
    setStatus({
      ...status,
      phase: 'ready-to-play',
    })
  }
  
  function setDirection(dir) {
    setStatus({ ...status, placementDirection: dir });
  }

  function setCurrentlyPlacing(ship) {
    setStatus({ ...status, currentlyPlacing: ship });
  }

  return (
    <div id="game-status">
      {
        status.phase === 'placement' &&
        <>
          <h2>Place your ships</h2>
          <h3>Ships to place:</h3>
          <div id="ships-to-place">
            {
              shipKeys.map(key => {
                return (
                  <div key={key}>
                    {status.placement[key].length < 1 && <h4>{ships[key].name}</h4>}
                  </div>
                )
              })
            }
          </div>
          {
            checkFinishedPlacing() && (
              <div id="finished-button">
                <button className="big" onClick={() => finishedPlacing()}>Ready to start</button>
              </div>
            )
          }
          <div id="placement-buttons">
            <ShipButtons
              currentlyPlacing={status.currentlyPlacing}
              setCurrentlyPlacing={setCurrentlyPlacing}
            />
            <DirectionButtons
              direction={status.placementDirection}
              setDirection={setDirection}
            />
          </div>
        </>
      }
    </div>
  )
}

export default GameStatus;