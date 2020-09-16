import Axios from 'axios';
import ships from '../data/ships';
import DirectionButtons from './DirectionButtons';
import ShipButtons from './ShipButtons';

function GameStatus({ status, setStatus }) {
  const shipKeys = Object.keys(ships);
  const [playersReady, setPlayersReady] = React.useState(false);
  const [player2Joined, setPlayer2Joined] = React.useState(false);

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
        playersReady && <h2>Please wait for other player to fire</h2>
      }
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