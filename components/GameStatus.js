import Axios from 'axios';
import ships from '../data/ships';
import DirectionButtons from './DirectionButtons';
import ShipButtons from './ShipButtons';

function GameStatus({ status, setStatus, lose, win, turn, checkTurn, player, sunkMessage }) {
  const shipKeys = Object.keys(ships);
  const [playersReady, setPlayersReady] = React.useState(false);
  const [player2Joined, setPlayer2Joined] = React.useState(player === '2');

  React.useEffect(() => {
    if (status.player === '1') {
      const interval = setInterval(() => {      
        Axios.get(`/api/check-player2-joined?gameid=${status.gameId}`)
          .then(resp => {
            if (resp.data.joined) {
              setPlayer2Joined(true);
              clearInterval(interval);
            }
          })
      }, 5000)
    }
  }, [status.gameId, status.player])
  
  React.useEffect(() => {
    if (win || lose) {
      setStatus({ ...status, phase: 'game-end' })
    }
  }, [win, lose])

  React.useEffect(() => {
    if (playersReady) {
      setStatus({ ...status, phase: 'playing' })
    }
  }, [playersReady])


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
    });

    Axios.post('/api/player-ready', { player: status.player, game_id: status.gameId, placement: status.placement });
    const interval = setInterval(() => {
      Axios.get(`/api/player-ready?gameid=${status.gameId}`)
        .then(resp => {
          if (resp.data.ready) {
            setPlayersReady(true);
            clearInterval(interval);
            checkTurn();
          }
        })
    }, 5000)
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
          {
            !player2Joined && 
            <>
              <h2>Please use the below code to have another player join your game</h2>
              <h3>{status.gameId}</h3>
            </>
          }
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
      {
        status.phase === 'ready-to-play' && <h2>Please wait for the other player to finish placing thier ships</h2>
      }
      {
        status.phase === 'playing' &&
        <>
          {
            turn && <h2>Choose a target</h2>
          }
          {
            !turn && <h2>Please wait for other player to fire</h2>
          }
        </>
      }
      {
        status.phase === 'game-end' &&
        <>
          {
            win && <h2>You Win! 🎉</h2>
          }
          {
            lose && <h2>You lose... 😢</h2>
          }
        </>
      }
      {
        sunkMessage && <h3>{sunkMessage} 💥</h3>
      }
    </div>
  )
}

export default GameStatus;